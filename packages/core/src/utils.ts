import { generateKeyPairSync, sign, verify, createPrivateKey, createPublicKey } from 'crypto';
import { Key } from '@types';

export function slugify(str: string): string {
  return str
    .normalize("NFD")                 // decompose accents/diacritics
    .replace(/[\u0300-\u036f]/g, '')  // remove the accents
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')          // spaces/underscores → hyphens
    .replace(/[^\w-]+/g, '')          // remove non-alphanumeric except hyphen
    .replace(/--+/g, '-')             // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');         // remove leading/trailing hyphens
}

export function timestamp() {
  return new Date().toISOString();
}

export function generateKeyPair(): [Key, Key] {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');
  return [publicKey.export({ type: 'spki', format: 'pem' }), privateKey.export({ type: 'pkcs8', format: 'pem' })]
}

export function signMessage(privateKeyPem: Key, message: string): string {
  const privateKey = createPrivateKey(privateKeyPem);
  return sign(null, Buffer.from(message), privateKey).toString('base64');
}

export function verifyMessage(publicKeyPem: Key, message: string, signatureBase64: string): boolean {
  const publicKey = createPublicKey(publicKeyPem);
  return verify(
    null,
    Buffer.from(message),
    publicKey,
    Buffer.from(signatureBase64, 'base64')
  );
}