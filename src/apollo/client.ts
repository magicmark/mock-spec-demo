import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { MockLink } from "./mockLink";
import { mockRegistry } from "./mockRegistry";

// Create HTTP link for the countries API
const httpLink = new HttpLink({
  uri: "https://countries.trevorblades.com/",
});

// Create mock link with mock registry
const mockLink = new MockLink({
  mockRegistry,
});

// Compose links
const link = from([mockLink, httpLink]);

// Create Apollo Client
export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
