import Local from 'passport-local'
import { findUser, validatePassword } from './user'

export const localStrategy = new Local.Strategy(function (
  username,
  password,
  done
) {
  findUser({ username, password })
    .then((user) => {
      console.log('We logged in so user is:', user);
        done(null, user)
    })
    .catch((error) => {
      if (error.isAxiosError && error.response.status == 404) {
        return done(new Error('Invalid username and password combination'))
      }
      done(error)
    })
})
