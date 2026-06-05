import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '@/lib/supabase';
import { useApp, themeTokens, formatMAD } from '@/contexts/AppContext';
import { Loader2, ShieldCheck } from 'lucide-react';

const STRIPE_ACCOUNT_ID = 'acct_1TelwqHJrC9f2Zv1';
const stripePromise = STRIPE_ACCOUNT_ID
  ? loadStripe('pk_live_51OJhJBHdGQpsHqInIzu7c6PzGPSH0yImD4xfpofvxvFZs0VFhPRXZCyEgYkkhOtBOXFWvssYASs851mflwQvjnrl00T6DbUwWZ', { stripeAccount: STRIPE_ACCOUNT_ID })
  : null;

function PayForm({ onSuccess }: { onSuccess: (pi: any) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true); setErr('');
    const { error, paymentIntent } = await stripe.confirmPayment({ elements, redirect: 'if_required' });
    if (error) { setErr(error.message || 'Payment failed'); setLoading(false); }
    else if (paymentIntent?.status === 'succeeded') onSuccess(paymentIntent);
    else setLoading(false);
  };

  return (
    <form onSubmit={submit}>
      <PaymentElement />
      {err && <p className="text-red-500 text-sm mt-3">{err}</p>}
      <button type="submit" disabled={!stripe || loading} className="w-full mt-5 py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60" style={{ background: '#19A8E5' }}>
        {loading ? <><Loader2 size={18} className="animate-spin" /> Processing…</> : 'Pay Now'}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { theme, cart, cartTotal, clearCart } = useApp();
  const tk = themeTokens[theme];
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [payErr, setPayErr] = useState('');
  const [addr, setAddr] = useState({ name: '', email: '', address: '', city: '', state: '', zip: '', country: 'Morocco' });

  const total = cartTotal;

  useEffect(() => {
    if (total <= 0) return;
    supabase.functions.invoke('create-payment-intent', { body: { amount: total, currency: 'mad' } })
      .then(({ data, error }) => {
        if (error || !data?.clientSecret) { setPayErr('Unable to initialize payment. Please try again.'); return; }
        setClientSecret(data.clientSecret);
      });
  }, [total]);

  const onSuccess = async (pi: any) => {
    const { data: customer } = await supabase.from('ecom_customers').upsert({ email: addr.email, name: addr.name }, { onConflict: 'email' }).select('id').single();
    const { data: order } = await supabase.from('ecom_orders').insert({
      customer_id: customer?.id, status: 'paid', subtotal: cartTotal, tax: 0, shipping: 0, total,
      shipping_address: addr, stripe_payment_intent_id: pi.id
    }).select('id').single();
    if (order) {
      await supabase.from('ecom_order_items').insert(cart.map(i => ({
        order_id: order.id, product_id: i.product_id, variant_id: i.variant_id || null,
        product_name: i.name, variant_title: i.variant_title || null, sku: i.sku || null,
        quantity: i.quantity, unit_price: i.price, total: i.price * i.quantity
      })));
      try {
        const { data: items } = await supabase.from('ecom_order_items').select('*').eq('order_id', order.id);
        await fetch('https://famous.ai/api/ecommerce/6a221cd716d6a94b6f851f49/send-confirmation', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id, customerEmail: addr.email, customerName: addr.name, orderItems: items, subtotal: cartTotal, shipping: 0, tax: 0, total, shippingAddress: addr })
        });
      } catch (e) { /* ignore */ }
    }
    clearCart();
    navigate('/order-confirmation?id=' + (order?.id || ''));
  };

  if (cart.length === 0) {
    return <div className="max-w-3xl mx-auto px-5 py-24 text-center" style={{ color: tk.sub }}>Your cart is empty.</div>;
  }

  const input = { background: tk.surface, color: tk.text, border: `1px solid ${tk.border}` };

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8" style={{ color: tk.text }}>Checkout</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-8">
          <div>
            <h2 className="font-bold text-lg mb-4" style={{ color: tk.text }}>Shipping Address</h2>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Full Name" className="col-span-2 rounded-xl px-4 h-12 outline-none" style={input} value={addr.name} onChange={e => setAddr({ ...addr, name: e.target.value })} />
              <input placeholder="Email" className="col-span-2 rounded-xl px-4 h-12 outline-none" style={input} value={addr.email} onChange={e => setAddr({ ...addr, email: e.target.value })} />
              <input placeholder="Address" className="col-span-2 rounded-xl px-4 h-12 outline-none" style={input} value={addr.address} onChange={e => setAddr({ ...addr, address: e.target.value })} />
              <input placeholder="City" className="rounded-xl px-4 h-12 outline-none" style={input} value={addr.city} onChange={e => setAddr({ ...addr, city: e.target.value })} />
              <input placeholder="Region" className="rounded-xl px-4 h-12 outline-none" style={input} value={addr.state} onChange={e => setAddr({ ...addr, state: e.target.value })} />
              <input placeholder="Postal Code" className="rounded-xl px-4 h-12 outline-none" style={input} value={addr.zip} onChange={e => setAddr({ ...addr, zip: e.target.value })} />
              <input placeholder="Country" className="rounded-xl px-4 h-12 outline-none" style={input} value={addr.country} onChange={e => setAddr({ ...addr, country: e.target.value })} />
            </div>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-4" style={{ color: tk.text }}>Payment</h2>
            {!stripePromise ? (
              <div className="rounded-xl p-4 bg-yellow-50 text-yellow-800 text-sm">Payment processing is being set up. Please check back soon.</div>
            ) : payErr ? (
              <div className="rounded-xl p-4 bg-red-50 text-red-700 text-sm">{payErr}</div>
            ) : clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: theme === 'modern' ? 'night' : 'stripe' } }}>
                <PayForm onSuccess={onSuccess} />
              </Elements>
            ) : (
              <div className="flex items-center gap-2 text-sm" style={{ color: tk.sub }}><Loader2 size={16} className="animate-spin" /> Loading payment form…</div>
            )}
            <p className="text-xs mt-3 flex items-center gap-1.5" style={{ color: tk.sub }}><ShieldCheck size={14} /> Secure payment · Cash on Delivery also available</p>
          </div>
        </div>

        <div className="rounded-2xl p-6 h-fit lg:sticky lg:top-24" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
          <h2 className="font-bold text-lg mb-4" style={{ color: tk.text }}>Order Summary</h2>
          {cart.map(i => (
            <div key={i.product_id} className="flex justify-between text-sm mb-2" style={{ color: tk.sub }}>
              <span>{i.name} × {i.quantity}</span><span style={{ color: tk.text }}>{formatMAD(i.price * i.quantity)}</span>
            </div>
          ))}
          <div className="mt-4 pt-4 space-y-2" style={{ borderTop: `1px solid ${tk.border}` }}>
            <div className="flex justify-between text-sm" style={{ color: tk.sub }}><span>Subtotal</span><span style={{ color: tk.text }}>{formatMAD(cartTotal)}</span></div>
            <div className="flex justify-between text-sm" style={{ color: tk.sub }}><span>Shipping</span><span style={{ color: '#2ED1C2' }}>Free</span></div>
            <div className="flex justify-between font-bold text-lg pt-2" style={{ color: tk.text }}><span>Total</span><span>{formatMAD(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
