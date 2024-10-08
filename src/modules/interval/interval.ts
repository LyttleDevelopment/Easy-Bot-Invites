import { updateKnownInvites } from '../invite/check-invite';
import { executor } from '../../utils';
import { cleanupAllMembers } from '../invite/cleanup-invite-members';

const actions = [updateKnownInvites, cleanupAllMembers];

export function startInterval() {
  // run all actions every 30 minutes
  const action = () => {
    actions.forEach((action) => {
      void executor(action);
    });
  };
  setInterval(action, 60 * 1000); // every minute
  action();
}
