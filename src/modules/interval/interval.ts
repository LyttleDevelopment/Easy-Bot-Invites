import { updateKnownInvites } from '../invite/check-invite';
import { executor } from '../../utils';

const actions = [updateKnownInvites];

export function startInterval() {
  // run all actions every 30 minutes
  setInterval(() => {
    actions.forEach((action) => {
      void executor(action);
    });
  }, 30 * 60 * 1000);
}
