import {CHAINS_MAPPING} from '@constants';
import allNetworkTypes from './all-network-types';

export default function allChainNames(networkTypes = allNetworkTypes()) {
  return Array.from(new Set(Object.values(CHAINS_MAPPING).filter(item => networkTypes.includes(item.type)).map(item => item.name)));
}
