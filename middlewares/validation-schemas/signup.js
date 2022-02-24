import * as Yup from 'yup';
import { atleastTwoWords, onlyOneWord } from '../validationHelpers';

const signUpInitialValues = {
  fullName: '',
  username: '',
  email: '',
  password: '',
};

const signUpSchema = Yup.object({
  fullName: Yup.string()
    .matches(atleastTwoWords, 'Please provide at least two words')
    .min(5, 'Minimum of 5 characters')
    .max(100, 'Maximum of 100 characters.')
    .required('Name is required.'),
  username: Yup.string()
    .matches(onlyOneWord, 'Please provide only one word')
    .min(5, 'Minimum of 5 characters')
    .max(10, 'Maximum of 10 characters.')
    .required('Username is required.'),
  email: Yup.string()
    .email('Invalid email address.')
    .required('Email is required.'),
  password: Yup.string().required('Password is required'),
});

export { signUpInitialValues, signUpSchema };
