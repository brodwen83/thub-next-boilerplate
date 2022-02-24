import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Formik } from 'formik';
import { gql, useMutation } from '@apollo/client';

import { getErrorMessage } from '../lib/form';
import Field from '../components/Field';
import {
  signUpInitialValues,
  signUpSchema,
} from '../middlewares/validation-schemas/signup';

const CreateNewUserMutation = gql`
  mutation CreateNewUser($input: SignUpInput!) {
    createNewUser(input: $input) {
      user {
        fullName
        email
        username
      }
    }
  }
`;

function SignUp() {
  const [signupNewUser] = useMutation(CreateNewUserMutation);
  const [errorMsg, setErrorMsg] = useState();
  const router = useRouter();

  async function handleSubmit(values) {
    try {
      await signupNewUser({
        variables: {
          input: {
            username: values.username,
            fullName: values.fullName,
            email: values.email,
            password: values.password,
          },
        },
      });

      router.push('/signin');
    } catch (error) {
      console.error(error);
      setErrorMsg(getErrorMessage(error));
    }
  }

  return (
    <>
      <Formik
        initialValues={signUpInitialValues}
        validationSchema={signUpSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, handleChange, handleSubmit }) => (
          <>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
              {errorMsg && <p className="error-helper-text">{errorMsg}</p>}
              <Field
                name="fullName"
                type="text"
                autoComplete="fullName"
                required
                label="Full Name"
                error={errors.fullName}
                value={values.fullName}
                onChange={handleChange}
              />
              <Field
                name="username"
                type="text"
                autoComplete="username"
                required
                label="Username"
                error={errors.username}
                value={values.username}
                onChange={handleChange}
              />
              <Field
                name="email"
                type="email"
                autoComplete="email"
                required
                label="Email"
                error={errors.email}
                value={values.email}
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
              <button type="submit" onSubmit={handleSubmit}>
                Sign up
              </button>{' '}
              or{' '}
              <Link href="/signin">
                <a>Sign in</a>
              </Link>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}

export default SignUp;
