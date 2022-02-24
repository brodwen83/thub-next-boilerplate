import { createContext, useContext } from 'react';
import { gql, useQuery } from '@apollo/client';

const AppContext = createContext();

export const VIEW_QUERY = gql`
  query ViewerQuery {
    viewer {
      id
      email
      fullName
      username
      role
    }
  }
`;

export function AppWrapper({ children }) {
  const {
    data,
    loading: viewerLoadingState,
    error: viewerError,
  } = useQuery(VIEW_QUERY);

  const viewer = data?.viewer;
  const shouldRedirect = !(viewerLoadingState || viewerError || viewer);

  return (
    <AppContext.Provider
      value={{
        sampleText: 'sample',
        currentUser: {
          viewer,
          shouldRedirect,
          viewerError,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
