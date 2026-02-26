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

// Create Apollo Client with relaxed type policies to allow mocking fields that don't exist
export const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Country: {
        fields: {
          // Allow any field on Country type (for mocking non-existent fields)
          population: {
            read(existing) {
              return existing;
            },
          },
          weather: {
            read(existing) {
              return existing;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all", // Don't throw errors, return them in the result
    },
    query: {
      errorPolicy: "all",
    },
  },
});
