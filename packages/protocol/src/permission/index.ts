import { Identity } from '../utils/types';

/**
 * A permission is evidence that an actor is authorized to perform an action under a system’s rules.
 *
 */
export interface Certificate {
  type: string;
}
export default class Permission<ActionType = string> {
  constructor(
    public action: ActionType,
    private identity: Identity,
  ) {}
}
