import client from '../main';
import { JEF_ID } from '../../constants';

export function getJefUser() {
  const userId = JEF_ID;
  // get user from client
  const user = client.users.cache.get(userId);
  return user;
}
