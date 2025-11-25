/**
 * The identity object represents a party member.
 * Each commitment produced by a party MUST be associated in order with the following:
 *
 * 1. Protocol Version
 * 2. Type:
 *    0 = "PublicKey"
 *    1 = "DID"
 * 3. Hashed Identity
 *
 */
export const IDENTITY_TYPE = {
  PublicKey: 0,
  DID: 1,
} as const;

export type IdentityType = (typeof IDENTITY_TYPE)[keyof typeof IDENTITY_TYPE];

export interface Identity {
  protocolVersion: number;
  type: IdentityType;
  scheme: PkScheme | DIDScheme;
}

// Supported cryptography schemes

// Public Key scheme
export type PkScheme = Uint8Array;
// DID scheme
export interface DIDScheme {
  did: string; // The DID string
  resolver?: ResolverIdentity; // Optional resolver information
}
export const RESOLVER_IDENTITY_TYPE = {
  web: 0,
  eth: 1,
  ipfs: 2,
} as const;

export type DIDResolverIdentityType =
  (typeof RESOLVER_IDENTITY_TYPE)[keyof typeof RESOLVER_IDENTITY_TYPE];
// Optional resolver identity (for DIDs)
export interface ResolverIdentity {
  type: DIDResolverIdentityType;
  endpoint: string; // URL or network info
  version?: number; // Optional resolver version
}
