import {CHAINS_MAPPING} from '@constants';

export default function allNetworkTypes() {
  return Array.from(new Set(Object.values(CHAINS_MAPPING).map(item => item.type)));
}
