import {
  DIDScheme,
  Identity,
  IDENTITY_TYPE,
  PkScheme,
  ResolverIdentity,
  IdentityType,
  DIDResolverIdentityType,
} from './types';
import { ICryptography } from '@types';
/**
 * Identity is an object that enables the system to label ownership of a thing
 * using either a PublicKey or Decentralized Identifier (DID)
 *
 * The serialization is as follows:
 * 1. Protocol Version
 * 2. Identity scheme (e.g: DID:prism)
 * 3. Public Key or DID
 */
export default class IdentitySerializer {
  constructor(private crypto: ICryptography) {}

  /** Serialize identity to byte array */
  serialize(identity: Identity): Uint8Array {
    const versionByte = identity.protocolVersion & 0xff;
    const typeByte = identity.type & 0xff;
    let schemeBytes: Uint8Array;

    if (identity.type === IDENTITY_TYPE.PublicKey) {
      const pk = identity.scheme as PkScheme;
      schemeBytes = pk;
    } else {
      const did = identity.scheme as DIDScheme;
      const didBytes = new TextEncoder().encode(did.did);

      if (did.resolver) {
        const resolverType = did.resolver.type;

        if (typeof resolverType == 'object') {
          throw new Error('Invalid');
        }

        const resolverTypeByte = resolverType & 0xff;
        const endpointBytes = new TextEncoder().encode(did.resolver.endpoint);
        const resolverVersion = did.resolver.version ?? 0;

        schemeBytes = new Uint8Array(2 + didBytes.length + 1 + 2 + endpointBytes.length + 1);
        let offset = 0;

        // DID length
        schemeBytes[offset++] = didBytes.length >> 8;
        schemeBytes[offset++] = didBytes.length & 0xff;
        schemeBytes.set(didBytes, offset);
        offset += didBytes.length;

        // Resolver type
        schemeBytes[offset++] = resolverTypeByte;

        // Endpoint length
        schemeBytes[offset++] = endpointBytes.length >> 8;
        schemeBytes[offset++] = endpointBytes.length & 0xff;

        // Endpoint bytes
        schemeBytes.set(endpointBytes, offset);
        offset += endpointBytes.length;

        // Resolver version
        schemeBytes[offset++] = resolverVersion;
      } else {
        // No resolver
        schemeBytes = new Uint8Array(2 + didBytes.length);
        schemeBytes[0] = didBytes.length >> 8;
        schemeBytes[1] = didBytes.length & 0xff;
        schemeBytes.set(didBytes, 2);
      }
    }

    const serialized = new Uint8Array(2 + schemeBytes.length);
    serialized[0] = versionByte;
    serialized[1] = typeByte;
    serialized.set(schemeBytes, 2);

    return serialized;
  }

  /** Hash the identity using injected Cryptography implementation */
  hash(identity: Identity): Uint8Array {
    const serialized = this.serialize(identity);
    return this.crypto.hash(serialized);
  }

  /** Deserialize from byte array back to Identity */
  deserialize(bytes: Uint8Array): Identity {
    const protocolVersion = bytes[0];
    const type = bytes[1] as IdentityType;
    const schemeBytes = bytes.slice(2);

    if (type === IDENTITY_TYPE.PublicKey) {
      return {
        protocolVersion,
        type,
        scheme: schemeBytes, // crypto unknown in this design
      };
    } else {
      const didLen = (schemeBytes[0] << 8) | schemeBytes[1];
      const did = new TextDecoder().decode(schemeBytes.slice(2, 2 + didLen));

      let resolver: ResolverIdentity | undefined;
      if (schemeBytes.length > 2 + didLen) {
        let offset = 2 + didLen;

        const resolverType = schemeBytes[offset++] as DIDResolverIdentityType;

        const endpointLen = (schemeBytes[offset++] << 8) | schemeBytes[offset++];
        const endpoint = new TextDecoder().decode(schemeBytes.slice(offset, offset + endpointLen));
        offset += endpointLen;

        const resolverVersion = schemeBytes[offset++];
        resolver = { type: resolverType, endpoint, version: resolverVersion };
      }

      return {
        protocolVersion,
        type,
        scheme: { did, resolver },
      };
    }
  }
}
