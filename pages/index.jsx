/* eslint-disable @next/next/no-img-element */
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import dbConnect from '../lib/dbConnect';
import Pet from '../models/Pet';
import { useAppContext } from '../context/app-wrapper-provider';

const Index = ({ pets }) => {
  const {
    currentUser: { viewer, shouldRedirect, viewerLoadingState, viewerError },
  } = useAppContext();

  const router = useRouter();

  useEffect(() => {
    if (shouldRedirect) {
      router.push('/signin');
    }
  }, [shouldRedirect, router]);

  if (viewerLoadingState) {
    return <p>Loding...</p>;
  }

  if (viewerError) {
    return <p>{viewerError.message}</p>;
  }

  return (
    <>
      <div>
        <p>
          Welcome {viewer?.username}{' '}
          <small>
            {viewer?.email}{' '}
            <span>
              <Link href={'/signout'} passHref>
                Signout
              </Link>
            </span>
          </small>
        </p>
      </div>

      {/* Create a card for each pet */}
      {pets.map(pet => (
        <div key={pet._id}>
          <div className="card">
            <img src={pet.image_url} alt={pet.name} />
            <h5 className="pet-name">{pet.name}</h5>
            <div className="main-content">
              <p className="pet-name">{pet.name}</p>
              <p className="owner">Owner: {pet.owner_name}</p>

              {/* Extra Pet Info: Likes and Dislikes */}
              <div className="likes info">
                <p className="label">Likes</p>
                <ul>
                  {pet.likes.map((data, index) => (
                    <li key={index}>{data} </li>
                  ))}
                </ul>
              </div>
              <div className="dislikes info">
                <p className="label">Dislikes</p>
                <ul>
                  {pet.dislikes.map((data, index) => (
                    <li key={index}>{data} </li>
                  ))}
                </ul>
              </div>

              <div className="btn-container">
                <Link href="/[id]/edit" as={`/${pet._id}/edit`} passHref>
                  <button className="btn edit">Edit</button>
                </Link>
                <Link href="/[id]" as={`/${pet._id}`} passHref>
                  <button className="btn view">View</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

/* Retrieves pet(s) data from mongodb database */
export async function getServerSideProps() {
  await dbConnect();

  /* find all the data in our database */
  const result = await Pet.find({});
  const pets = result.map(doc => {
    const pet = doc.toObject();
    pet._id = pet._id.toString();
    return pet;
  });

  return { props: { pets: pets } };
}

export default Index;
