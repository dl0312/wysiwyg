import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  opts: {
    credentials: "include"
  }
});

export default client;
