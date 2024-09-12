import { onClientError } from '../actions';

async function error(error: Error): Promise<void> {
  // Fire actions
  await onClientError(error);
}

export default error;
