# GraphQL @mock Directive Demo

**Live demo: https://mock-spec-demo.larah.me/**

This project demonstrates the draft [GraphQL @mock directive specification](https://public.larah.me/~mark/MockSpec.html) using Apollo Client with React and Vite.

## What is the @mock Directive?

The `@mock` directive allows GraphQL clients to return mocked data for fields or entire operations, enabling:

- **Parallel Development**: Frontend and backend teams can work simultaneously
- **Testing Different States**: Easily test loading, error, and edge case scenarios
- **Offline Development**: Work without backend availability

## Features Implemented

### 1. Operation-Level Mocking
Apply `@mock` to the entire operation - no network request is sent:

```graphql
query GetCountries @mock(variant: "top-three") {
  countries {
    code
    name
    capital
    emoji
  }
}
```

### 2. Field-Level Mocking
Apply `@mock` to specific fields - other fields fetch from real API:

```graphql
query GetCountry($code: ID!) {
  country(code: $code) {
    code
    name
    capital @mock(variant: "fictional-capital")
    currency
  }
}
```

### 3. Mock File Structure
Mock data is stored in JSON files following the spec:

```json
{
  "fictional-capital": {
    "data": "Wakanda City",
    "__path__": "country.capital",
    "__description__": "A fictional capital city name for testing"
  }
}
```

## Project Structure

```
apollo-mock-app/
├── src/
│   ├── apollo/
│   │   ├── client.ts          # Apollo Client setup
│   │   └── mockRegistry.ts    # Mock file registry
│   ├── queries/
│   │   ├── countries.ts       # GraphQL queries
│   │   └── __graphql_mocks__/
│   │       ├── GetCountry.json
│   │       └── GetCountries.json
│   ├── App.tsx                # Demo UI
│   └── main.tsx
└── package.json
```

## How It Works

### MockLink Implementation

The `MockLink` class is a custom Apollo Link that:

1. **Detects @mock directives** in GraphQL operations
2. **For operation-level mocks**: Returns mock data directly, bypassing the network
3. **For field-level mocks**:
   - Removes mocked selections from the server-bound query
   - Sends the modified query to the server
   - Merges mock data, errors, and extensions into the response

### Key Implementation Details

- Uses the GraphQL `visit` API to traverse and transform the operation AST
- Reads mock data from JSON files at build time
- Validates mock directive arguments and mock variants with helpful error messages
- Supports multiple mock variants per field/operation

## Running the Demo

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Visit http://localhost:5173 and try the different demos:

1. **Operation-Level Mock**: Click "Execute Query" and note NO network request in DevTools
2. **Real API**: See the POST request to the countries API
3. **Field Mock (Existing)**: Note the request is sent, but `capital` is mocked
4. **Fragment Field Mock (Existing)**: Define the mocked `capital` field in a fragment and load its mock file by fragment name
5. **Field Mock (New)**: Add a scalar field that is not returned by the real API
6. **Field Mock (New w/ Selection Set)**: Add a mocked object subtree
7. **Field Mock (Inline Value)**: Use inline scalar values without a mock file
8. **Field Mock (Error)**: See a field-level GraphQL error merged with real data

## Mock File Format

Mock files follow this structure:

```json
{
  "variant-id": {
    "data": {
      // The mock data matching the selection shape
    },
    "errors": [
      // Optional GraphQL errors array
    ],
    "extensions": {
      // Optional extensions object
    },
    "__path__": "response.path",
    "__description__": "Description of this mock variant",
    "__metadata__": {
      // Optional metadata
    }
  }
}
```

## Deviations from Spec

### Simplified Implementation
- **Schema awareness**: This implementation doesn't validate mock values against a schema. A production implementation would need schema validation.
- **Dynamic variant IDs**: The draft spec discusses variable-backed variants as a possible appendix feature, but this demo uses string literal variants only.
- **Trusted documents**: Trusted-document handling is outside the scope of this demo.

### Missing Features (for production)
- Bundler plugin to automatically collect and register mock files
- Schema validation of mock data
- Mock file hot-reloading in development
- TypeScript types generation from mock files

## Technologies Used

- **React 19** + **TypeScript**
- **Vite 7** for build tooling
- **Apollo Client 4** for GraphQL
- **graphql-tag** for query parsing
- Test API: https://countries.trevorblades.com/

## Learn More

- [GraphQL Mock Spec](../graphql-mock-spec/Spec.md)
- [Apollo Client Links](https://www.apollographql.com/docs/react/api/link/introduction/)
- [GraphQL Visitor Pattern](https://graphql.org/graphql-js/language/#visit)
