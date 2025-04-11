import { createServer } from 'node:http';
import { createPubSub, createSchema, createYoga } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid'; // Importamos uuid

const pubSub = createPubSub();
const MESSAGE_ADDED = 'MESSAGE_ADDED';

const typeDefs = `
  type Message {
    id: String!
    user: String!
    content: String!
  }

  type Query {
    messages: [Message!]!
  }

  type Mutation {
    sendMessage(user: String!, content: String!): Message!
  }

  type Subscription {
    messageAdded: Message!
  }
`;

const messages = [];

const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    sendMessage: (_, { user, content }) => {
      const id = uuidv4();
      const message = { id, user, content };
      messages.push(message);
      pubSub.publish(MESSAGE_ADDED, message);
      return message;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubSub.subscribe(MESSAGE_ADDED),
      resolve: payload => payload,
    },
  },
};

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: '/graphql',
  cors: {
    origin: '*',
  },
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.log('Servidor listo en http://localhost:4000/graphql');
});
