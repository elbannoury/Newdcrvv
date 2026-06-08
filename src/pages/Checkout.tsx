import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '@/lib/supabase';
import { useApp, themeTokens, formatMAD } from '@/contexts/AppContext';
import { Loader2, ShieldCheck, MessageCircle } from 'lucide-react';

const STRIPE_ACCOUNT_ID = 'acct_1TelwqHJrC9f2Zv1';
const CALLMEBOT_PHONE = '212700720490';
const CALLMEBOT_API_KEY = '8589862';

const stripePromise = STRIPE_ACCOUNT_ID
  ? loadStripe('pk_live_51OJhJBHdGQpsHqInIzu7c6PzGPSH0yImD4xfpofvxvFZs0VFhPRXZCyEgYkkhOtBOXFWvssYASs851mflwQvjnrl00T6DbUwWZ', { stripeAccount: STRIPE_ACCOUNT_ID })
  : null;

type AddressState = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

function PayForm({ onSuccess }: { onSuccess: (pi: any) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setErr('');
    const { error, paymentIntent } = await stripe.confirmPayment({ elements, redirect: 'if_required' });
    if (error) {
      setErr(error.message || 'Payment failed');
      setLoading(false);
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent);
    } else {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <PaymentElement />
      {err && <p className="text-red-500 text-sm mt-3">{err}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-5 py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
        style={{ background: '#19A8E5' }}
      >
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
  const [placingOrder, setPlacingOrder] = useState(false);
  const [addr, setAddr] = useState<AddressState>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'Morocco',
  });

  const total = cartTotal;

  const missingFields = useMemo(() => {
    const entries: Array<[keyof AddressState, string]> = [
      ['name', 'full name'],
      ['email', 'email'],
      ['phone', 'phone number'],
      ['address', 'address'],
      ['city', 'city'],
      ['country', 'country'],
    ];

    return entries.filter(([key]) => !addr[key].trim()).map(([, label]) => label);
  }, [addr]);

  useEffect(() => {
    if (total <= 0) return;
    supabase.functions.invoke('create-payment-intent', { body: { amount: total, currency: 'mad' } })
      .then(({ data, error }) => {
        if (error || !data?.clientSecret) {
          setPayErr('Unable to initialize payment. Please try again.');
          return;
        }
        setClientSecret(data.clientSecret);
      });
  }, [total]);

  const sendCallMeBotNotification = async (orderId: string) => {
  const sendCallMeBotNotification = async (orderId: string) => {
  const itemsText = cart
    .map((item, index) => `${index + 1}. ${item.name}${item.variant_title ? ` (${item.variant_title})` : ''} × ${item.quantity} = ${formatMAD(item.price * item.quantity)}`)
    .join('\n');

  const orderRef = orderId.slice(0, 8).toUpperCase();
  const message = [
    '🛒 طلب جديد من DCRVV',
    `رقم الطلب: #${orderRef}`,
    `الاسم: ${addr.name}`,
    `البريد: ${addr.email}`,
    `الهاتف: ${addr.phone}`,
    `العنوان: ${addr.address}`,
    `المدينة: ${addr.city}`,
    `الجهة: ${addr.state || '-'}`,
    `الرمز البريدي: ${addr.zip || '-'}`,
    `الدولة: ${addr.country}`,
    '',
    'المنتجات:',
    itemsText,
    '',
    `الإجمالي: ${formatMAD(total)}`,
    'طريقة الدفع: الدفع عند الاستلام / أو تم الدفع أونلاين حسب حالة الطلب',
  ].join('%0A');

  const url = `https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE}&text=${message}&apikey=${CALLMEBOT_API_KEY}`;

  try {
    const response = await fetch(url, { 
      method: 'GET'
      // احذف mode: 'no-cors'
    });
    
    if (!response.ok) {
      console.warn(`WhatsApp notification returned status: ${response.status}`);
    }
  } catch (error) {
    console.error('CallMeBot notification failed:', error);
    // لا توقف العملية حتى لو فشلت الإشعارات
  }
};

  const createOrderRecord = async (status: string, paymentIntentId?: string) => {
    const { data: customer, error: customerError } = await supabase
      .from('ecom_customers')
      .upsert({ email: addr.email, name: addr.name }, { onConflict: 'email' })
      .select('id')
      .single();

    if (customerError) throw customerError;

    const { data: order, error: orderError } = await supabase
      .from('ecom_orders')
      .insert({
        customer_id: customer?.id,
        status,
        subtotal: cartTotal,
        tax: 0,
        shipping: 0,
        total,
        shipping_address: addr,
        stripe_payment_intent_id: paymentIntentId || null,
      })
      .select('id')
      .single();

    if (orderError || !order) throw orderError || new Error('Order creation failed');

    const { error: itemsError } = await supabase.from('ecom_order_items').insert(
      cart.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        product_name: item.name,
        variant_title: item.variant_title || null,
        sku: item.sku || null,
        quantity: item.quantity,
        unit_price: item.price,
        total: item.price * item.quantity,
      }))
    );

    if (itemsError) throw itemsError;

    try {
      const { data: items } = await supabase.from('ecom_order_items').select('*').eq('order_id', order.id);
      await fetch('https://famous.ai/api/ecommerce/6a221cd716d6a94b6f851f49/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          customerEmail: addr.email,
          customerName: addr.name,
          orderItems: items,
          subtotal: cartTotal,
          shipping: 0,
          tax: 0,
          total,
          shippingAddress: addr,
        }),
      });
    } catch (error) {
      console.error('Confirmation email failed', error);
    }

    await sendCallMeBotNotification(order.id);
    return order.id;
  };

  const ensureAddressComplete = () => {
    if (missingFields.length === 0) return true;
    setPayErr(`Please complete: ${missingFields.join(', ')}`);
    return false;
  };

  const onSuccess = async (pi: any) => {
    if (!ensureAddressComplete()) return;

    setPlacingOrder(true);
    setPayErr('');

    try {
      const orderId = await createOrderRecord('paid', pi.id);
      clearCart();
      navigate('/order-confirmation?id=' + orderId);
    } catch (error) {
      console.error(error);
      setPayErr('Payment succeeded, but saving the order failed. Please contact support immediately.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!ensureAddressComplete()) return;

    setPlacingOrder(true);
    setPayErr('');

    try {
      const orderId = await createOrderRecord('pending', null);
      clearCart();
      navigate('/order-confirmation?id=' + orderId);
    } catch (error) {
      console.error(error);
      setPayErr('Unable to complete your order right now. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
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
              <input placeholder="Phone Number" className="col-span-2 rounded-xl px-4 h-12 outline-none" style={input} value={addr.phone} onChange={e => setAddr({ ...addr, phone: e.target.value })} />
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
            ) : clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: theme === 'modern' ? 'night' : 'stripe' } }}>
                <PayForm onSuccess={onSuccess} />
              </Elements>
            ) : (
              <div className="flex items-center gap-2 text-sm" style={{ color: tk.sub }}><Loader2 size={16} className="animate-spin" /> Loading payment form…</div>
            )}
            {payErr && <div className="rounded-xl p-4 bg-red-50 text-red-700 text-sm mt-4">{payErr}</div>}
            <p className="text-xs mt-3 flex items-center gap-1.5" style={{ color: tk.sub }}><ShieldCheck size={14} /> Secure payment · Cash on Delivery also available</p>
          </div>
        </div>

        <div className="rounded-2xl p-6 h-fit lg:sticky lg:top-24" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
          <h2 className="font-bold text-lg mb-4" style={{ color: tk.text }}>Order Summary</h2>
          {cart.map(i => (
            <div key={i.product_id + (i.variant_id || '')} className="flex justify-between text-sm mb-2" style={{ color: tk.sub }}>
              <span>{i.name} × {i.quantity}</span><span style={{ color: tk.text }}>{formatMAD(i.price * i.quantity)}</span>
            </div>
          ))}
          <div className="mt-4 pt-4 space-y-2" style={{ borderTop: `1px solid ${tk.border}` }}>
            <div className="flex justify-between text-sm" style={{ color: tk.sub }}><span>Subtotal</span><span style={{ color: tk.text }}>{formatMAD(cartTotal)}</span></div>
            <div className="flex justify-between text-sm" style={{ color: tk.sub }}><span>Shipping</span><span style={{ color: '#2ED1C2' }}>Free</span></div>
            <div className="flex justify-between font-bold text-lg pt-2" style={{ color: tk.text }}><span>Total</span><span>{formatMAD(total)}</span></div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleCompleteOrder}
              disabled={placingOrder}
              className="w-full py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: '#111111' }}
            >
              {placingOrder ? <><Loader2 size={18} className="animate-spin" /> Completing Order…</> : 'Complete Order · Cash on Delivery'}
            </button>

            <div className="rounded-2xl p-4 text-sm" style={{ background: tk.bg, color: tk.sub, border: `1px dashed ${tk.border}` }}>
              <div className="flex items-start gap-2">
                <MessageCircle size={16} className="mt-0.5 shrink-0" style={{ color: '#25D366' }} />
                <div>
                  <p style={{ color: tk.text }} className="font-semibold mb-1">WhatsApp order alert enabled</p>
                  <p>When the customer completes the order, a WhatsApp notification will be sent automatically through CallMeBot.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
        }
