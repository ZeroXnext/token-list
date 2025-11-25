export interface ICryptography {
  sign(message: Uint8Array, key: Uint8Array): Uint8Array;
  verify(message: Uint8Array, signature: Uint8Array, key: Uint8Array): boolean;
  hash(data: Uint8Array): Uint8Array;
}
