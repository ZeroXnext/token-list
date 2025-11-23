# 1. Overview

This is the technical specification for the 0xList protocol.

# 1.1 Conventions used in This Document

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and
"OPTIONAL" in this document are to be interpreted as described in BCP
14 [RFC2119] [RFC8174] when, and only when, they appear in all
capitals, as shown here.

The grammatical rules in this document are to be interpreted as
described in [RFC5234](https://datatracker.ietf.org/doc/html/rfc5234).

# 2. Definitions

## 2.1. Configuration interface

```ts
interface Config {
  version: Version;
  schema: JSONSchema;
  allowedOperations: PathsOperations;
}
```

> Todo: Specify a link to supported JSON schema

**Requirements**:

1. `version` is REQUIRED and MUST be the [Version Interface](#22-version-interface)
2. `schema` is REQUIRED and MUST be a valid JSON Schema
3. `allowedOperations`: is REQUIRED and MUST be a valid [PathsOperations](#23-paths-operations) object

## 2.2. Version Interface

```ts
interface Version {
  major: number;
  minor: number;
  patch: number;
}
```

**Requirements**

1. A Version object MUST contain the fields major, minor, and patch.
2. Each of these fields MUST be a non-negative integer.
3. A Version object MUST NOT include any additional fields.
4. A Version object MAY be serialized or parsed using the form "MAJOR.MINOR.PATCH".
5. Semantic meaning of the fields (major = breaking changes, minor = new features, patch = fixes) is RECOMMENDED but not required.

## 2.3 PathOperationsMap

```ts
type AccessPath = string;
const OPERATIONS = {
  read: 'read',
  remove: 'remove',
  update: 'update',
  add: 'add',
} as const;

type Operations = (typeof OPERATIONS)[keyof typeof OPERATIONS];

interface PathsOperations {
  [key: AccessPath]: Operations[];
}

class PathsOperationsMap {
  public paths: PathsOperations;
  constructor(private schema: JSONSchema) {
    this.paths = {};
    this.init();
  }
  private init() {}
}
```

**Requirements**

1. `schema` it is REQUIRED and SHOULD be the `schema` provided in [config](#21-configuration-interface).

2. `paths[key]` it is REQUIRED and SHOULD be a valid path of a valid `schema` provided in the [Config](#21-configuration-interface);
3. `paths[value]` it is REQUIRED and SHOULD be one or more `OPERATIONS` depending on the type specified in [schema](#21-configuration-interface):
   2.1 `Object` (Array or literal) type SHOULD be able to have all `OPERATIONS`;
   2.2 `String` | `Number` type MAY be only `OPERATIONS.read`, `OPERATIONS.update`;
4. `init()` it is REQUIRED and it SHOULD digest the provided schema and produce the `paths` property

<!--
## 2.4. Cryptography lib interface

```ts
interface Cryptography {
	hash(input: Uint8Array | string): Uint8Array
	sign(message: Uint8Array): Signature
	verify(message: Uint8Array, signature: Signature): boolean
}
``` -->
