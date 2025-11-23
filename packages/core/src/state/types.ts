/**
 *  @property merkleRoot – The merkle root of all token lists
 *  @property trustedRuners – The
 *  @property signature – The signature of the state
 *  @property indexUrl – The URL containing all owned lists
 *  @property timestamp – The last updated at timestamp
 *  @property pluginsState – The state of each plugin
 */

export interface Manifest {
  merkleRoot: string;
  trustedRunners: string[];
  indexUrl: string;
  timestamp: number;
  pluginState: Record<PluginStateKey, PluginState>;
}

/**
 * PluginStateKey: The hash(plugin.id, hash, timestamp)
 */
type PluginStateKey = string;

/**
 * @property hash - The hash of the previous token list
 * @property timestamp - The timestamp
 */
export interface PluginState {
  hash: string;
  timestamp: number;
}

/**
 * @property merkleRoot – The merkleRoot produced during the runtime
 * @property timestamp – The timestamp in seconds since the last update
 * @property merkleRoot – The merkleRoot of the plugins run hashes
 */
export interface ManifestMessageType {
  merkleRoot: string;
  timestamp: number;
  indexUrl: string;
}

/**
 * Loading the state checks the following:
 *
 * 1. The integrity of the Manifest.
 */
export type loadState = (manifest: Manifest) => void;

// These functions just reads the manifest from remote or local
export type ReadManifestLocal = () => Manifest;
export type ReadManifestRemote = () => Manifest;

/**
 * @property id – A unique UUID generated during the development of the plugin
 * @property timestamp – The timestamp since the message was signed
 * @property scope – The attributes from the list that will be passed into the ExecutionContext
 */
export interface PluginMessage {
  id: string;
  scope: PluginScope;
  timestamp: string;
}

export type BaseOperations = 'update' | 'read';
export type ListOperations = 'add' | 'remove';

export type OperationValueType = string | number;

export interface PluginScope<T extends OperationValueType = string, V = OperationValueType> {
  path: T;
  operations: T extends Array<V> ? ListOperations : BaseOperations;
}
