import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { gql } from '@apollo/client';
import { useMutation, useApolloClient } from '@apollo/client';
import { Formik } from 'formik';

import { getErrorMessage } from '../lib/form';
import Field from '../components/Field';
import {
  signInInitialValues,
  signInSchema,
} from '../middlewares/validation-schemas/signin';
import { useAppContext, VIEW_QUERY } from '../context/app-wrapper-provider';

const SIGNIN_MUTATION = gql`
  mutation SigninMutation($input: SignInInput) {
    signIn(input: $input) {
      user {
        id
        username
        fullName
        email
        role
      }
    }
  }
`;

function SignIn() {
  const router = useRouter();
  const client = useApolloClient();

  const {
    currentUser: { viewer },
  } = useAppContext();

  const [errorMsg, setErrorMsg] = useState();
  const [loginSuccessful, setLoginSuccessful] = useState(null);

  const [signIn, { loading: signInLoadingState }] =
    useMutation(SIGNIN_MUTATION);

  useEffect(() => {
    if (viewer) {
      setLoginSuccessful('Login successfull, redirecting...');
      router.push('/');
    }
  }, [viewer, router]);

  async function handleSubmit(values) {
    try {
      await client.resetStore();

      const { data } = await signIn({
        variables: {
          input: {
            usernameOrEmail: values.usernameOrEmail,
            password: values.password,
          },
        },

        update: (store, { data }) => {
          if (!data) {
            return null;
          }

          store.writeQuery({
            query: VIEW_QUERY,
            data: {
              viewer: { ...data?.signIn?.user },
            },
          });
        },
      });

      if (data.signIn.user) {
        await router.push('/');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(getErrorMessage(error));
    }
  }

  return loginSuccessful ? (
    <p>{loginSuccessful}</p>
  ) : (
    <Formik
      initialValues={signInInitialValues}
      validationSchema={signInSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, values, handleChange, handleSubmit }) => (
        <>
          {loginSuccessful && <p>{loginSuccessful}</p>}

          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            {errorMsg && <p className="error-helper-text">{errorMsg}</p>}
            <Field
              name="usernameOrEmail"
              type="usernameOrEmail"
              autoComplete="usernameOrEmail"
              required
              label="Username or Email"
              error={errors.usernameOrEmail}
              value={values.usernameOrEmail}
              onChange={handleChange}
            />
            <Field
              name="password"
              type="password"
              autoComplete="password"
              required
              label="Password"
              error={errors.password}
              value={values.password}
              onChange={handleChange}
            />
            <button type="submit" disabled={signInLoadingState}>
              Sign in
            </button>{' '}
            or{' '}
            <Link href="/signup">
              <a>Sign up</a>
            </Link>
          </form>
        </>
      )}
    </Formik>
  );
}

export default SignIn;
