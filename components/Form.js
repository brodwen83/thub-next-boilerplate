import { useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import {
  petSchema,
  petsInitialValues,
} from '../middlewares/validation-schemas/pets';
import { Formik } from 'formik';

const Form = ({ formId, petForm, forNewPet = true }) => {
  const router = useRouter();
  const contentType = 'application/json';
  const [message, setMessage] = useState('');

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async form => {
    const { id } = router.query;

    try {
      const res = await fetch(`/api/pets/${id}`, {
        method: 'PUT',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }

      const { data } = await res.json();

      mutate(`/api/pets/${id}`, data, false); // Update the local data without a revalidation
      router.push('/');
    } catch (error) {
      console.error(error);
      setMessage('Failed to update pet');
    }
  };

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async form => {
    try {
      const res = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }

      router.push('/');
    } catch (error) {
      console.error(error);
      setMessage('Failed to add pet');
    }
  };

  const handleSubmit = values => {
    forNewPet ? postData(values) : putData(values);
  };

  return (
    <>
      <Formik
        initialValues={{ ...petsInitialValues, ...petForm }}
        validationSchema={petSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, handleChange, handleSubmit, isValid }) => (
          <>
            <form id={formId} onSubmit={handleSubmit}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                // maxLength="20"
                name="name"
                value={values.name}
                onChange={handleChange}
              />
              {errors && errors.name && (
                <small className="error-helper-text">{errors.name}</small>
              )}

              <label htmlFor="owner_name">Owner</label>
              <input
                type="text"
                maxLength="20"
                name="owner_name"
                value={values.owner_name}
                onChange={handleChange}
              />
              {errors && errors.owner_name && (
                <small className="error-helper-text">{errors.owner_name}</small>
              )}

              <label htmlFor="species">Species</label>
              <input
                type="text"
                maxLength="30"
                name="species"
                value={values.species}
                onChange={handleChange}
              />
              {errors && errors.species && (
                <small className="error-helper-text">{errors.species}</small>
              )}

              <label htmlFor="age">Age</label>
              <input
                type="number"
                name="age"
                value={values.age}
                onChange={handleChange}
              />
              {errors && errors.age && (
                <small className="error-helper-text">{errors.age}</small>
              )}

              <label htmlFor="poddy_trained">Potty Trained</label>
              <input
                type="checkbox"
                name="poddy_trained"
                checked={values.poddy_trained}
                onChange={handleChange}
              />
              {errors && errors.poddy_trained && (
                <small className="error-helper-text">
                  {errors.poddy_trained}
                </small>
              )}

              <label htmlFor="diet">Diet</label>
              <textarea
                name="diet"
                maxLength="60"
                value={values.diet}
                onChange={handleChange}
              />
              {errors && errors.diet && (
                <small className="error-helper-text">{errors.diet}</small>
              )}

              <label htmlFor="image_url">Image URL</label>
              <input
                type="url"
                name="image_url"
                value={values.image_url}
                onChange={handleChange}
              />
              {errors && errors.image_url && (
                <small className="error-helper-text">{errors.image_url}</small>
              )}

              <label htmlFor="likes">Likes</label>
              <textarea
                name="likes"
                maxLength="60"
                value={values.likes}
                onChange={handleChange}
              />
              {errors && errors.likes && (
                <small className="error-helper-text">{errors.likes}</small>
              )}

              <label htmlFor="dislikes">Dislikes</label>
              <textarea
                name="dislikes"
                maxLength="60"
                value={values.dislikes}
                onChange={handleChange}
              />
              {errors && errors.dislikes && (
                <small className="error-helper-text">{errors.dislikes}</small>
              )}

              <button type="submit" disabled={!isValid}>
                Submit
              </button>
            </form>

            <p>{message}</p>
            <div>
              {errors &&
                Object.values(errors).map((err, index) => (
                  <li key={`${index}:${err}`}>{err}</li>
                ))}
            </div>
          </>
        )}
      </Formik>
    </>
  );
};

export default Form;
