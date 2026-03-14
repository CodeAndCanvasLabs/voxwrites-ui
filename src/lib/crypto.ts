/**
 * Client-side RSA encryption for API key transport security.
 *
 * Uses Web Crypto API (built-in, zero dependencies) to encrypt API keys
 * with the server's RSA public key before sending over the wire.
 * Even over HTTPS, this prevents accidental logging of plain keys.
 */

let cachedPublicKey: CryptoKey | null = null;
let cachedPem: string | null = null;

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, '')
    .replace(/-----END PUBLIC KEY-----/, '')
    .replace(/\s/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function importPublicKey(pem: string): Promise<CryptoKey> {
  if (cachedPublicKey && cachedPem === pem) return cachedPublicKey;

  const keyData = pemToArrayBuffer(pem);
  cachedPublicKey = await crypto.subtle.importKey(
    'spki',
    keyData,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt'],
  );
  cachedPem = pem;
  return cachedPublicKey;
}

/**
 * Encrypt a plaintext string with an RSA public key (PEM format).
 * Returns a base64-encoded ciphertext string ready to send to the server.
 */
export async function encryptWithPublicKey(
  plaintext: string,
  publicKeyPem: string,
): Promise<string> {
  const key = await importPublicKey(publicKeyPem);
  const encoded = new TextEncoder().encode(plaintext);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    key,
    encoded,
  );
  // Convert to base64
  const bytes = new Uint8Array(encrypted);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
