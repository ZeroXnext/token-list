import { EthersCrypto } from '../helpers';
import IdentitySerializer from './identity-serializer';
import { IDENTITY_TYPE } from './types';

jest.mock('ethers', () => {
  const original = jest.requireActual('ethers');

  return {
    ...original, // keep any other non-mocked exports
    Wallet: {
      createRandom: jest.fn(() => ({
        privateKey: '0x'.padEnd(66, '0'), // 32 bytes hex
        publicKey: '0x'.padEnd(132, '0'), // 64 bytes hex
        signMessage: jest.fn(async () => '0x'.padEnd(132, '0')),
      })),
      verifyMessage: jest.fn(
        async () => '0x'.padEnd(42, '0'), // mock Ethereum address
      ),
    },
    keccak256: jest.fn(() => '0x'.padEnd(66, '0')),
    hexToBytes: jest.fn(
      (hex: string) =>
        new Uint8Array(
          hex
            .slice(2)
            .match(/.{1,2}/g)
            ?.map((b) => parseInt(b, 16)) || [],
        ),
    ),
  };
});

describe('Identity Serializer', () => {
  it('Should work', () => {
    const cryptography = new EthersCrypto();
    const [publicK] = cryptography.generateKeyPair();
    const identity = new IdentitySerializer(cryptography);
    const input = {
      protocolVersion: 0,
      type: IDENTITY_TYPE.PublicKey,
      scheme: publicK,
    };
    const serialized = identity.serialize(input);
    expect(serialized).not.toBe(undefined);

    const deserialized = identity.deserialize(serialized);
    expect(deserialized).toEqual(input);
  });
});
