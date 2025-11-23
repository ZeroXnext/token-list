```ts
/**
 * I'm building a permissionTree and revocationTree, they both make up merkle trees.
 * Permission tree, contains the plugin id associated with the hashed operation details such as: scope, allowedOrigins, paths associated with operation, required boolean, plugin id, expiration timestamp validity plus expiration timestamp signed by the owner.
 *
 * On the other hand, revocation tree contains the hashed plugin id + issuance expiration timestamp, associtated with the restricted schema or undefined, meaning the entire contract is revoked.
 *
 * Definitions:
 * permissionStateLeaf = hash(plugin.id)
 *
 * type AccessKey = "*" | string
 *
 * Utilities:
 * It valides and pr
 * – validateKey()
 * - accessKey(key: AccessKey, list): list[key];
 *
 * Requirement:
 * - The operation should be the valid key of the TokenList schema produced using the "accessKey" utility.
 * type Operation = TokenList[AccessKey]
 *
 *
 * Rationality
 * - A path is always needed in order to perform an operation, otherwise there will be no "walk".
 * - Operations that can be performed on a path makes the program safe and secure.
 * – Origins prop makes the program more secure, transparent and increases trust worthiness.
 * – Required, this field adds reusability of the program.
 *
 * type PermissionStatePath = {
 *    path: AccessKey,
 *    operation: [],
 *    origins: string[],
 *    required: boolean
 * }
 *
 * struc PermissionStateTree {
 *  permissionStateLeaf {
 *      paths: PermissionStatePath[]
 *  }
 * }
 *
 *
 * revocationStateLeaf = hash(plugin.id, permission.timestamp)
 *
 * - Plugin permission Leaf: hash(plugin id)
 * - Plugin revocation Leaf: hash(plugin id + permission timestamp)
 * - PermissionStateTree: A merkle tree structure representing plugin's permission schema signed by owner.
 * - RevocationStateTree: A merkle tree structure representing plugin's state permission schema
 *
 * - OP_CORRUPT: The system did not anticipate presence of given leaf
 *
 * The 3 things, system has to know before moving into the execution phase, is:
 *
 * 1. Does the plugin have authorization?
 *
 * 1.1 Verifies the plugin permission leaf against the permissionState tree otherwise system halts with OP_CORRUPT.
 * 1.2 Verify plugin revocation leaf +
 * 1.
 */
```
