import * as Yup from 'yup';
// import { atleastTwoWords } from '../validationHelpers';

const petsInitialValues = {
  name: '',
  owner_name: '',
  species: '',
  age: 0,
  poddy_trained: false,
  diet: [],
  image_url: '',
  likes: [],
  dislikes: [],
};

const petSchema = Yup.object({
  name: Yup.string()
    // .matches(atleastTwoWords, 'Please provide name')
    .min(2, 'Minimum of 5 characters')
    .max(100, 'Maximum of 100 characters.')
    .required('Name is required.'),
  owner_name: Yup.string()
    // .matches(atleastTwoWords, 'Please provide owner name')
    .min(2, 'Minimum of 5 characters')
    .max(100, 'Maximum of 100 characters.')
    .required('Owner name is required.'),
  species: Yup.string()
    .min(2, 'Minimum of 5 characters')
    .max(100, 'Maximum of 100 characters.')
    .required('Species is required'),
  age: Yup.number().required('Age is required'),
  poddy_trained: Yup.bool()
    // .oneOf([true], 'Field must be checked.')
    .nullable(),
  diet: Yup.lazy(val =>
    Array.isArray(val) ? Yup.array().of(Yup.string()) : Yup.string(),
  ),
  image_url: Yup.string().url().required('Please provide image.'),
  likes: Yup.lazy(val =>
    Array.isArray(val) ? Yup.array().of(Yup.string()) : Yup.string(),
  ),
  dislikes: Yup.lazy(val =>
    Array.isArray(val) ? Yup.array().of(Yup.string()) : Yup.string(),
  ),
});

export { petsInitialValues, petSchema };
