import Cors from 'micro-cors';
import { ApolloServer } from 'apollo-server-micro';
import { schema } from '../../../apollo/schema';
import { resolvers } from '../../../apollo/resolvers';

const cors = Cors();

const apolloServer = new ApolloServer({
  schema,
  resolvers,
  context(ctx) {
    return ctx;
  },
});

const startServer = apolloServer.start();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default cors(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
});

// export default apolloServer.createHandler({ path: '/api/graphql' });
