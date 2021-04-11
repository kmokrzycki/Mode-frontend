import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import backend from './backend';

/**
 * User methods. The example doesn't contain a DB, but for real applications you must use a
 * db here, such as MongoDB, Fauna, SQL, etc.
 */

const users = []

export async function createUser({ username }) {
  // Here you should create the user and save the salt and hashed password (some dbs may have
  // authentication methods that will do it for you so you don't have to worry about it):
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(username, salt, 1000, 64, 'sha512')
    .toString('hex')
  const user = {
    id: uuidv4(),
    createdAt: Date.now(),
    username,
    hash,
    salt,
  }

  const result = await backend.request('/api/v1/account', 'put',
  {
    name: username,
    balance: 0,
  });

  // This is an in memory store for users, there is no data persistence without a proper DB
  users.push(user)

  return { username, createdAt: Date.now() }
}

// Here you should lookup for the user in your DB
export async function findUser({ username, password }) {
  const result = await backend.request(`/api/v1/account/${password}`);
  return result.data.account;
}

// Compare the password of an already fetched user (using `findUser`) and compare the
// password for a potential match
export function validatePassword(user, inputPassword) {
  console.error('Login: ', user, inputPassword);
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, 'sha512')
    .toString('hex')
  console.log(inputHash);
  const passwordsMatch = user.hash === inputHash
  return passwordsMatch
}
