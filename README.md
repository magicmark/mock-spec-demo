# GraphQL @mock Directive Demo

**Live demo: https://mock-spec-demo.larah.me/**

This project implements the [GraphQL @mock directive specification](https://public.larah.me/~mark/MockSpec.wip.html) using Apollo Client with React and Vite.

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
    "__appliesTo__": "Country.capital",
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
│   │   ├── mockLink.ts        # Custom Apollo Link implementing @mock
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
   - Strips `@mock` directives from the query
   - Sends the modified query to the server
   - Merges mock data into the response

### Key Implementation Details

- Uses the GraphQL `visit` API to traverse and transform operation AST
- Reads mock data from JSON files at build time
- Validates mock variants exist and provides helpful error messages
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
3. **Field-Level Mock**: Note the request is sent, but `capital` is mocked
4. **Single Country**: All data from real API

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
    "__appliesTo__": "Type.field",
    "__description__": "Description of this mock variant",
    "__metadata__": {
      // Optional metadata
    }
  }
}
```

## Deviations from Spec

### Simplified Implementation
- **Field stripping**: Currently keeps fields in the query but removes `@mock` directives. The spec suggests removing mocked selections entirely, but this simplified approach works for the demo.
- **Schema awareness**: This implementation doesn't validate against a schema. A production implementation would need schema validation.

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
