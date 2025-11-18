import {DEFAULT_CHAINS} from '@constants';

export default function supportedChains(mapping = DEFAULT_CHAINS) {
  const chains = new Set<string>();
  const networkTypes = new Set<string>();
  for (let [, {name, type}] of mapping.entries()) {
    chains.add(name);
    networkTypes.add(type);
  }
  return [Array.from(networkTypes), Array.from(chains)];
}
