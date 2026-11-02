/**
 * Service de chiffrement AES-GCM utilisant la Web Crypto API standard (globalThis.crypto).
 * Permet de chiffrer l'attribution secrète avec le mot de passe loufoque du participant.
 */

export function normalizePassword(password: string): string {
  return password.trim().toLowerCase();
}

function getCrypto(): Crypto {
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    return globalThis.crypto;
  }
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto;
  }
  throw new Error('Web Crypto API non disponible');
}

async function getKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const crypto = getCrypto();
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(normalizePassword(password)),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): Uint8Array {
  const matches = hex.match(/.{1,2}/g) || [];
  return new Uint8Array(matches.map(byte => parseInt(byte, 16)));
}

export async function encryptSecret(
  targetName: string,
  password: string
): Promise<{ ciphertext: string; iv: string; salt: string }> {
  const crypto = getCrypto();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey(password, salt);

  const enc = new TextEncoder();
  const encodedData = enc.encode(targetName);

  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as unknown as BufferSource },
    key,
    encodedData
  );

  return {
    ciphertext: bufferToHex(ciphertextBuffer),
    iv: bufferToHex(iv.buffer),
    salt: bufferToHex(salt.buffer)
  };
}

export async function decryptSecret(
  ciphertextHex: string,
  ivHex: string,
  saltHex: string,
  passwordAttempt: string
): Promise<string | null> {
  try {
    const crypto = getCrypto();
    const salt = hexToBuffer(saltHex);
    const iv = hexToBuffer(ivHex);
    const ciphertext = hexToBuffer(ciphertextHex);

    const key = await getKey(passwordAttempt, salt);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as unknown as BufferSource },
      key,
      ciphertext as unknown as BufferSource
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch {
    return null;
  }
}
