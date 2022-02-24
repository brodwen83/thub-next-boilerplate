import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { AppWrapper } from '../context/app-wrapper-provider';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <AppWrapper>
        <Component {...pageProps} />
      </AppWrapper>
    </ApolloProvider>
  );
}

export default MyApp;
