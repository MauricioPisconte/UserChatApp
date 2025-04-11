import { createServer } from 'node:http';
import { createPubSub, createSchema, createYoga } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';
import { useServer } from 'graphql-ws/use/ws';
import { WebSocketServer } from 'ws';

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

const schema = createSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  cors: {
    origin: '*',
  },
});

const server = createServer(yoga);

const wsServer = new WebSocketServer({
  server,
  path: '/graphql',
});

useServer(
  {
    schema,
    execute: yoga.execute,
    subscribe: yoga.subscribe,
    onConnect: (ctx) => {
      console.log('Cliente WebSocket conectado');
    },
    onDisconnect: (ctx, code, reason) => {
      console.log('Cliente WebSocket desconectado');
    },
  },
  wsServer
);

server.listen(4000, () => {
  console.log('Servidor listo en http://localhost:4000/graphql');
});
