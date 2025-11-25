export interface IWallet {
  sign(message: Uint8Array, key: Uint8Array): Uint8Array;
  verify(message: Uint8Array, signature: Uint8Array, key: Uint8Array): boolean;
}
