import { AuthenticationError, UserInputError } from 'apollo-server-micro';

import { createNewUser, createUser, userSignedIn } from '../lib/user';
import { getLoginSession } from '../lib/auth';
import { removeTokenCookie } from '../lib/auth-cookies';
import dbConnect from '../lib/dbConnect';
import User from '../models/User';

export const resolvers = {
  Query: {
    async viewer(_parent, _args, context) {
      await dbConnect();

      try {
        const session = await getLoginSession(context.req);

        if (session) {
          const userExists = await User.findOne({ email: session.email });
          if (!userExists) {
            throw new AuthenticationError(
              'Authentication token is invalid, please log in',
            );
          }

          return userExists;
        }
      } catch (error) {
        throw new AuthenticationError(
          'Authentication token is invalid, please log in',
        );
      }
    },
  },

  Mutation: {
    async signUp(_parent, args) {
      const user = await createUser(args.input);
      return { user };
    },

    async signOut(_parent, _args, context) {
      removeTokenCookie(context.res);
      return true;
    },

    async createNewUser(
      _parent,
      { input: { username, fullName, email, password } },
    ) {
      const user = await createNewUser({ username, fullName, email, password });

      return { user };
    },

    async signIn(_parent, { input: { usernameOrEmail, password } }, context) {
      const user = await userSignedIn({ usernameOrEmail, password, context });

      if (!user)
        throw new UserInputError(
          'Invalid username or email and password combination',
        );

      return { user };
    },
  },
};
