import * as Yup from 'yup';

const signInInitialValues = {
  usernameOrEmail: '',
  password: '',
};

const signInSchema = Yup.object({
  usernameOrEmail: Yup.string().required('Username or Email is required.'),
  password: Yup.string().required('Password is required'),
});

export { signInInitialValues, signInSchema };
