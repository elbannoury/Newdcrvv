/**
 * WhatsApp order notification helpers.
 *
 * Why the previous fetch + `no-cors` approach was unreliable:
 *  - `no-cors` swallows ALL responses (status, body) — we could not tell whether the
 *    request actually reached CallMeBot.
 *  - CallMeBot occasionally throttles or rejects very long Arabic messages because
 *    URL-encoded UTF-8 inflates length past safe limits.
 *  - Some browsers / extensions silently block third-party fetches from HTTPS pages.
 *
 * The strategy below is more robust:
 *  1. We trigger CallMeBot via an <img> ping. The browser fires the GET request the
 *     same way as for a tracking pixel — no CORS pre-flight, no fetch-blocking
 *     extensions, and we get a load/error callback so we know if it worked.
 *  2. We always keep a `wa.me` deep-link as a fallback that the admin can click
 *     from the order-confirmation page (and which we can auto-open if the API fails).
 *  3. Long messages are truncated to stay well inside browser URL limits (~7500 chars
 *     after encoding) so CallMeBot accepts them.
 */

export const WHATSAPP_PHONE = '212700720490';
export const WHATSAPP_DISPLAY = '+212 700 720 490';
export const CALLMEBOT_API_KEY = '8589862';

// CallMeBot accepts up to ~8KB total URL. After URL-encoding Arabic, each char ~9 bytes,
// so cap the raw message at ~700 chars to stay safe.
const MAX_MESSAGE_CHARS = 700;

export function buildWaMeLink(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

function buildCallMeBotUrl(message: string): string {
  const trimmed = message.length > MAX_MESSAGE_CHARS
    ? message.slice(0, MAX_MESSAGE_CHARS - 20) + '\n…(تابع في wa.me)'
    : message;
  return `https://api.callmebot.com/whatsapp.php?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(trimmed)}&apikey=${CALLMEBOT_API_KEY}`;
}

/**
 * Send a WhatsApp notification via CallMeBot using an image-pixel ping.
 * Resolves to `true` if the pixel loaded (CallMeBot returned 200), `false` otherwise.
 * Always resolves — never throws — so order placement is never blocked by notification failure.
 */
export function sendWhatsappViaPixel(message: string, timeoutMs = 6000): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);

    const url = buildCallMeBotUrl(message);
    const img = new Image();
    let settled = false;

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      resolve(ok);
    };

    img.onload = () => finish(true);
    img.onerror = () => finish(false);
    img.src = url;

    // Hard timeout — pixel APIs sometimes never call the callback.
    setTimeout(() => finish(false), timeoutMs);
  });
}

/**
 * Higher-level helper: try the pixel ping; if it fails, open WhatsApp Web with a
 * pre-filled message in a new tab as a guaranteed fallback. Never throws.
 */
export async function notifyWhatsappOrder(message: string, openFallback = false): Promise<{ delivered: boolean; fallbackUrl: string }> {
  const fallbackUrl = buildWaMeLink(message);
  let delivered = false;
  try {
    delivered = await sendWhatsappViaPixel(message);
  } catch {
    delivered = false;
  }

  if (!delivered && openFallback && typeof window !== 'undefined') {
    // Last-resort: open wa.me in a new tab. The shop owner / customer can hit "Send".
    window.open(fallbackUrl, '_blank', 'noopener');
  }

  return { delivered, fallbackUrl };
}
