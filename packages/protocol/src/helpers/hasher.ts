import * as crypto from 'node:crypto';
import { IHasher } from '@types';

export class SHA256Hasher implements IHasher {
  name = 'sha256';
  hash(data: Uint8Array): Uint8Array {
    return new Uint8Array(crypto.createHash('sha256').update(data).digest());
  }
}
