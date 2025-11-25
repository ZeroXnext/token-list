import * as ethers from 'ethers';

import { Wallet } from 'ethers';
import { ICryptography } from '@types';

export class EthersCrypto implements ICryptography {
  /** Hash data using SHA-256 */
  hash(data: Uint8Array) {
    return ethers.toBeArray(ethers.keccak256(data));
  }

  /** Generate a new secp256k1 key pair as Uint8Arrays */
  generateKeyPair(): [Uint8Array, Uint8Array] {
    const wallet = Wallet.createRandom();

    const privateKey = new Uint8Array(Buffer.from(wallet.privateKey.slice(2), 'hex'));
    const publicKey = new Uint8Array(Buffer.from(wallet.publicKey.slice(2), 'hex'));

    return [publicKey, privateKey];
  }

  /** Sign a message with a private key (Uint8Array) */
  sign(message: Uint8Array, privateKey: Uint8Array): Uint8Array {
    const wallet = new Wallet('0x' + Buffer.from(privateKey).toString('hex'));
    const signature = wallet.signMessageSync(message);
    return new Uint8Array(Buffer.from(signature.slice(2), 'hex'));
  }

  /** Verify a signature with a public key (Uint8Array) */
  verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): boolean {
    const recovered = ethers.verifyMessage(message, '0x' + Buffer.from(signature).toString('hex'));
    return recovered.toLowerCase() === '0x' + Buffer.from(publicKey).toString('hex');
  }
}
