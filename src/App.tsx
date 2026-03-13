import { useState } from "react";
import { useLazyQuery } from "@apollo/client/react/compiled";
import { type DocumentNode, print } from "graphql";
import {
  GET_COUNTRY_WITH_MOCK,
  GET_COUNTRIES_MOCK,
  GET_COUNTRY_NEW_FIELD,
  GET_COUNTRY_NESTED_NEW,
  GET_COUNTRY_INLINE_VALUE,
} from "./queries/countries";

import GetCountriesMock from "./queries/__graphql_mocks__/GetCountries.json";
import GetCountryMock from "./queries/__graphql_mocks__/GetCountry.json";
import GetCountryWithPopulationMock from "./queries/__graphql_mocks__/GetCountryWithPopulation.json";
import GetCountryWithWeatherMock from "./queries/__graphql_mocks__/GetCountryWithWeather.json";

const DEMOS = {
  "operation-mock": {
    label: "Operation Mock",
    query: GET_COUNTRIES_MOCK,
    mockFilename: "GetCountries.json",
    mockContent: GetCountriesMock,
  },
  "field-existing": {
    label: "Field Mock (Existing)",
    query: GET_COUNTRY_WITH_MOCK,
    mockFilename: "GetCountry.json",
    mockContent: GetCountryMock,
    variables: { code: "US" },
  },
  "field-new": {
    label: "Field Mock (New)",
    query: GET_COUNTRY_NEW_FIELD,
    mockFilename: "GetCountryWithPopulation.json",
    mockContent: GetCountryWithPopulationMock,
    variables: { code: "US" },
  },
  "field-new-nested": {
    label: "Field Mock (New w/ Selection Set)",
    query: GET_COUNTRY_NESTED_NEW,
    mockFilename: "GetCountryWithWeather.json",
    mockContent: GetCountryWithWeatherMock,
    variables: { code: "US" },
  },
  "inline-value": {
    label: "Field Mock (Inline Value)",
    query: GET_COUNTRY_INLINE_VALUE,
    mockFilename: null,
    mockContent: null,
    variables: { code: "US" },
  },
} as const;

type DemoKey = keyof typeof DEMOS;

function DemoPanel({ query, mockFilename, mockContent, variables }: {
  query: DocumentNode;
  mockFilename: string | null;
  mockContent: unknown;
  variables?: Record<string, unknown>;
}) {
  const [executeQuery, { loading, error, data }] = useLazyQuery<Record<string, unknown>>(query);

  const panelStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    padding: "0.75rem",
    background: "#f8f9fa",
    borderRadius: "6px",
    border: "1px solid #ccc",
      };

  return (
    <div>
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <div style={panelStyle}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem" }}>GraphQL Query</h3>
          <pre style={{ background: "#fff", padding: "0.75rem", borderRadius: "4px", overflow: "auto", textAlign: "left", margin: 0, maxHeight: "400px", fontSize: "0.8rem" }}>
            {print(query)}
          </pre>
        </div>
        <div style={panelStyle}>
          {mockFilename ? (
            <>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem" }}>Mock File: <code>{mockFilename}</code></h3>
              <pre style={{ background: "#fff", padding: "0.75rem", borderRadius: "4px", overflow: "auto", textAlign: "left", margin: 0, maxHeight: "400px", fontSize: "0.8rem" }}>
                {JSON.stringify(mockContent, null, 2)}
              </pre>
            </>
          ) : (
            <>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem" }}>Mock File</h3>
              <div style={{ background: "#fff", padding: "0.75rem", borderRadius: "4px", color: "#6c757d", fontSize: "0.85rem" }}>
                No mock file needed — mock values are provided inline via the <code>value</code> argument.
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button
          onClick={() => executeQuery(variables ? { variables } : undefined)}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Execute Query
        </button>
        <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>
          Open Chrome DevTools Network tab to inspect the request and observe which fields are sent to (or omitted from) the server.
        </span>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      {data && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Response:</h3>
          <div style={{ padding: "1.5rem", border: "2px solid #007bff", borderRadius: "8px", background: "#cfe2ff" }}>
            <pre style={{ textAlign: "left", overflow: "auto", margin: 0 }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [selectedDemo, setSelectedDemo] = useState<DemoKey>("operation-mock");

  const demo = DEMOS[selectedDemo];

  return (
    <div style={{ padding: "0.75rem 2rem 2rem", maxWidth: "1200px", margin: "0.5rem auto 0" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.25rem 1rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.4rem", color: "#1a1a2e" }}>GraphQL <code style={{ fontSize: "1.3rem", color: "#e83e8c" }}>@mock</code> Directive Demo</h1>
        <nav style={{ display: "flex", gap: "1rem", fontSize: "0.8rem" }}>
          <a href="https://public.larah.me/~mark/MockSpec.wip.html" target="_blank" rel="noreferrer">Spec</a>
          <a href="https://github.com/graphql/ai-wg/issues/79" target="_blank" rel="noreferrer">AI WG Discussion</a>
          <a href="https://github.com/magicmark/mock-spec-demo" target="_blank" rel="noreferrer">Source</a>
        </nav>
      </div>

      <div style={{ marginBottom: "0.75rem", padding: "0.75rem 1rem", background: "#f8f9fa", borderRadius: "6px", border: "1px solid #ccc" }}>
        <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>Select Demo</h2>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {(Object.keys(DEMOS) as DemoKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedDemo(key)}
              style={{
                padding: "0.4rem 0.75rem",
                background: selectedDemo === key ? "#007bff" : "#6c757d",
                color: "white",
                border: selectedDemo === key ? "2px solid #0056b3" : "2px solid #545b62",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: "bold",
              }}
            >
              {DEMOS[key].label}
            </button>
          ))}
        </div>
      </div>

      <DemoPanel
        key={selectedDemo}
        query={demo.query}
        mockFilename={demo.mockFilename ?? null}
        mockContent={demo.mockContent ?? null}
        variables={"variables" in demo ? demo.variables : undefined}
      />
    </div>
  );
}

export default App;
