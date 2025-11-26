import Permission from '../permission';
import { Identity } from '../utils/types';
import { ActorRole } from './types';

export class Actor {
  constructor(
    public role: ActorRole,
    private identity: Identity,
    public permission: Permission,
  ) {}
}
