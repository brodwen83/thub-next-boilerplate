import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { gql, useMutation, useApolloClient } from '@apollo/client';

import { VIEW_QUERY } from '../context/app-wrapper-provider';

const SIGNOUT_MUTATION = gql`
  mutation SignOutMutation {
    signOut
  }
`;

function SignOut() {
  const client = useApolloClient();

  const router = useRouter();

  const [signOut] = useMutation(SIGNOUT_MUTATION, {
    update: (store, { data }) => {
      if (!data) {
        return null;
      }

      store.writeQuery({
        query: VIEW_QUERY,
        data: {
          viewer: null,
        },
      });
    },
  });

  useEffect(() => {
    signOut().then(() => {
      client.resetStore().then(() => {
        router.push('/signin');
      });
    });
  }, [signOut, router, client]);

  return <p>Signing out...</p>;
}

export default SignOut;
