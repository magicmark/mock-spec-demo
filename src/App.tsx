import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client/react/compiled";
import { print } from "graphql";
import {
  GET_COUNTRY_WITH_MOCK,
  GET_COUNTRIES_MOCK,
  GET_COUNTRY_NEW_FIELD,
  GET_COUNTRY_NESTED_NEW,
} from "./queries/countries";

function App() {
  const [selectedDemo, setSelectedDemo] = useState<string>("countries-mock");
  const [countryCode, setCountryCode] = useState<string>("US");

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>GraphQL @mock Directive Demo</h1>
      <p style={{ textAlign: "center" }}>
        This demo implements the GraphQL @mock directive specification using
        Apollo Client.
      </p>

      <div style={{ marginBottom: "2rem", padding: "1rem", background: "#f5f5f5", borderRadius: "8px" }}>
        <h2>Select Demo</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedDemo("countries-mock")}
            style={{
              padding: "0.5rem 1rem",
              background: selectedDemo === "countries-mock" ? "#007bff" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Operation-Level Mock
          </button>
          <button
            onClick={() => setSelectedDemo("country-field-mock")}
            style={{
              padding: "0.5rem 1rem",
              background: selectedDemo === "country-field-mock" ? "#007bff" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Field-Level Mock (Existing Field)
          </button>
          <button
            onClick={() => setSelectedDemo("country-new-field")}
            style={{
              padding: "0.5rem 1rem",
              background: selectedDemo === "country-new-field" ? "#007bff" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            New Field (Doesn't Exist Yet)
          </button>
          <button
            onClick={() => setSelectedDemo("country-nested-new")}
            style={{
              padding: "0.5rem 1rem",
              background: selectedDemo === "country-nested-new" ? "#007bff" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            New Nested Types
          </button>
        </div>
      </div>

      {selectedDemo === "countries-mock" && <CountriesOperationMock />}
      {selectedDemo === "country-field-mock" && (
        <CountryFieldMock code={countryCode} setCode={setCountryCode} />
      )}
      {selectedDemo === "country-new-field" && (
        <CountryNewField code={countryCode} setCode={setCountryCode} />
      )}
      {selectedDemo === "country-nested-new" && (
        <CountryNestedNew code={countryCode} setCode={setCountryCode} />
      )}
    </div>
  );
}

function CountriesOperationMock() {
  const [executeQuery, { loading, error, data }] = useLazyQuery(GET_COUNTRIES_MOCK);

  return (
    <div>
      <h2>Operation-Level Mock: GetCountries</h2>
      <p>
        <strong>Status:</strong> Entire operation is mocked (no server request)
      </p>
      <p>
        <strong>Mock Variant:</strong> "top-three"
      </p>

      <div style={{ marginBottom: "1rem", padding: "1rem", background: "#f8f9fa", borderRadius: "4px" }}>
        <h3>GraphQL Query:</h3>
        <pre style={{ background: "#fff", padding: "1rem", borderRadius: "4px", overflow: "auto", textAlign: "left" }}>
          {print(GET_COUNTRIES_MOCK)}
        </pre>
      </div>

      <button
        onClick={() => executeQuery()}
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

      <p style={{ marginTop: "1rem", color: "#6c757d", fontStyle: "italic" }}>
        Note: Open DevTools Network tab to see that NO network request is sent (operation-level mock)
      </p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      {data && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Response (Fully Mocked):</h3>
          <div style={{ padding: "1.5rem", border: "2px solid #ffc107", borderRadius: "8px", background: "#fff3cd" }}>
            <pre style={{ textAlign: "left", overflow: "auto", margin: 0 }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function CountryFieldMock({
  code,
  setCode,
}: {
  code: string;
  setCode: (code: string) => void;
}) {
  const [executeQuery, { loading, error, data }] = useLazyQuery(GET_COUNTRY_WITH_MOCK);

  return (
    <div>
      <h2>Field-Level Mock: GetCountry (Existing Field)</h2>
      <p>
        <strong>Status:</strong> Capital field is mocked, other fields from real API
      </p>
      <p>
        <strong>Mock Variant:</strong> "fictional-capital"
      </p>

      <div style={{ marginBottom: "1rem", padding: "1rem", background: "#f8f9fa", borderRadius: "4px" }}>
        <h3>GraphQL Query:</h3>
        <pre style={{ background: "#fff", padding: "1rem", borderRadius: "4px", overflow: "auto", textAlign: "left" }}>
          {print(GET_COUNTRY_WITH_MOCK)}
        </pre>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <label>
          Country Code:{" "}
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            style={{
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            placeholder="e.g., US"
          />
        </label>
        <button
          onClick={() => executeQuery({ variables: { code } })}
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
      </div>

      <p style={{ marginTop: "1rem", color: "#6c757d", fontStyle: "italic" }}>
        Note: The 'capital' field is mocked. All other fields are from the real API.
      </p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      {data && data.country && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Response (capital is mocked 🟡, rest is real 🟢):</h3>
          <div style={{ padding: "1.5rem", border: "2px solid #007bff", borderRadius: "8px", background: "#cfe2ff" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{data.country.emoji}</div>
            <pre style={{ textAlign: "left", overflow: "auto", margin: 0 }}>
              {JSON.stringify(data.country, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function CountryNewField({
  code,
  setCode,
}: {
  code: string;
  setCode: (code: string) => void;
}) {
  const [executeQuery, { loading, error, data }] = useLazyQuery(GET_COUNTRY_NEW_FIELD);

  return (
    <div>
      <h2>New Field Mock: Population Field Doesn't Exist Yet</h2>
      <p>
        <strong>Status:</strong> The 'population' field doesn't exist in the real schema - it's fully mocked
      </p>
      <p>
        <strong>Mock Variant:</strong> "estimated-population"
      </p>

      <div style={{ marginBottom: "1rem", padding: "1rem", background: "#f8f9fa", borderRadius: "4px" }}>
        <h3>GraphQL Query:</h3>
        <pre style={{ background: "#fff", padding: "1rem", borderRadius: "4px", overflow: "auto", textAlign: "left" }}>
          {print(GET_COUNTRY_NEW_FIELD)}
        </pre>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <label>
          Country Code:{" "}
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            style={{
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            placeholder="e.g., US"
          />
        </label>
        <button
          onClick={() => executeQuery({ variables: { code } })}
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
      </div>

      <p style={{ marginTop: "1rem", color: "#6c757d", fontStyle: "italic" }}>
        Note: The 'population' field doesn't exist in the Countries API schema yet. It's being mocked to simulate future development.
      </p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      {data && data.country && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Response (population is mocked 🟡, rest is real 🟢):</h3>
          <div style={{ padding: "1.5rem", border: "2px solid #9b59b6", borderRadius: "8px", background: "#e8daef" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{data.country.emoji}</div>
            <pre style={{ textAlign: "left", overflow: "auto", margin: 0 }}>
              {JSON.stringify(data.country, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function CountryNestedNew({
  code,
  setCode,
}: {
  code: string;
  setCode: (code: string) => void;
}) {
  const [executeQuery, { loading, error, data }] = useLazyQuery(GET_COUNTRY_NESTED_NEW);

  return (
    <div>
      <h2>New Nested Types: Weather Field with Forecast</h2>
      <p>
        <strong>Status:</strong> The entire 'weather' field and its nested types don't exist - fully mocked
      </p>
      <p>
        <strong>Mock Variant:</strong> "current-weather"
      </p>

      <div style={{ marginBottom: "1rem", padding: "1rem", background: "#f8f9fa", borderRadius: "4px" }}>
        <h3>GraphQL Query:</h3>
        <pre style={{ background: "#fff", padding: "1rem", borderRadius: "4px", overflow: "auto", textAlign: "left" }}>
          {print(GET_COUNTRY_NESTED_NEW)}
        </pre>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <label>
          Country Code:{" "}
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            style={{
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            placeholder="e.g., US"
          />
        </label>
        <button
          onClick={() => executeQuery({ variables: { code } })}
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
      </div>

      <p style={{ marginTop: "1rem", color: "#6c757d", fontStyle: "italic" }}>
        Note: The 'weather' field with nested forecast data doesn't exist in the schema. This demonstrates mocking complex nested types for future features.
      </p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      {data && data.country && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Response (weather is fully mocked 🟡, rest is real 🟢):</h3>
          <div style={{ padding: "1.5rem", border: "2px solid #17a2b8", borderRadius: "8px", background: "#d1ecf1" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{data.country.emoji}</div>
            <pre style={{ textAlign: "left", overflow: "auto", margin: 0 }}>
              {JSON.stringify(data.country, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
