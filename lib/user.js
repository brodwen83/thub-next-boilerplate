import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { UserInputError } from 'apollo-server-micro';

import { signUpSchema } from '../middlewares/validation-schemas/signup';
import User from '../models/User';
import dbConnect from './dbConnect';
import { setLoginSession } from './auth';

/**
 * User methods. The example doesn't contain a DB, but for real applications you must use a
 * db here, such as MongoDB, Fauna, SQL, etc.
 */
const users = [];

export async function createUser({ email, password }) {
  // Here you should create the user and save the salt and hashed password (some dbs may have
  // authentication methods that will do it for you so you don't have to worry about it):
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  const user = {
    id: uuidv4(),
    createdAt: Date.now(),
    email,
    hash,
    salt,
  };

  // This is an in memory store for users, there is no data persistence without a proper DB
  users.push(user);

  return user;
}

// Here you should lookup for the user in your DB
export async function findUser({ email }) {
  // This is an in memory store for users, there is no data persistence without a proper DB
  return users.find(user => user.email === email);
}

// Compare the password of an already fetched user (using `findUser`) and compare the
// password for a potential match
export async function validatePassword(user, inputPassword) {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, 'sha512')
    .toString('hex');
  const passwordsMatch = user.hash === inputHash;
  return passwordsMatch;
}

export async function createNewUser({ fullName, username, email, password }) {
  await dbConnect();

  try {
    await signUpSchema.validate(
      { fullName, username, email, password },
      { stripUnknown: true },
    );

    const newUser = await new User({
      username,
      fullName,
      email,
      password,
    }).save();

    if (!newUser) {
      throw new Error('User creation failed.');
    }

    return newUser;
  } catch (error) {
    console.error(error);

    if (error.code === 11000)
      throw new Error(
        `* ${Object.keys(error.keyValue)} ${Object.values(
          error.keyValue,
        )} already taken.`,
      );

    throw new Error(error);
  }
}

export async function userSignedIn({ usernameOrEmail, password, context }) {
  await dbConnect();

  try {
    const userExists = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    }).select('+password');
    // .populate('parent prospectRecord');

    if (!userExists) throw new UserInputError('User does not exist.');

    // if (!userExists.verified) {
    //   throw new UserInputError('Please verify your email');
    // }

    // if (!userExists.approved) {
    //   throw new UserInputError('Account currently waiting for approval');
    // }

    const isMatch = await userExists.comparePassword(password);
    if (!isMatch)
      throw new UserInputError(
        'Invalid username or email and password combination',
      );

    const session = {
      id: userExists.id,
      email: userExists.email,
      username: userExists.username,
      fullName: userExists.fullName,
      role: userExists.role,
    };

    await setLoginSession(context.res, session);

    return userExists;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
