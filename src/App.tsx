import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client/react/compiled";
import { type DocumentNode, print } from "graphql";
import type { HighlighterCore, LanguageRegistration } from "shiki/core";
import graphqlGrammar from "tm-grammars/grammars/graphql.json";
import jsonGrammar from "tm-grammars/grammars/json.json";
import {
  GET_COUNTRIES_LIST_MOCK,
  GET_COUNTRIES_WITH_POPULATION_FRAGMENT_MOCK,
  GET_COUNTRIES_WITH_POPULATION_MOCK,
  GET_COUNTRY_ALIAS_MOCK,
  GET_COUNTRY_CAPITAL_ERROR,
  GET_COUNTRY_WITH_FRAGMENT_MOCK,
  GET_COUNTRY_WITH_MOCK,
  GET_COUNTRIES_MOCK,
  GET_COUNTRY_NEW_FIELD,
  GET_COUNTRY_NESTED_NEW,
  GET_COUNTRY_INLINE_VALUE,
} from "./queries/countries";

import CountryCapitalFragmentMock from "./queries/__graphql_mocks__/CountryCapitalFragment.json";
import CountryPopulationFragmentMock from "./queries/__graphql_mocks__/CountryPopulationFragment.json";
import GetCountriesMock from "./queries/__graphql_mocks__/GetCountries.json";
import GetCountriesListMock from "./queries/__graphql_mocks__/GetCountriesList.json";
import GetCountriesWithPopulationMock from "./queries/__graphql_mocks__/GetCountriesWithPopulation.json";
import GetCountryMock from "./queries/__graphql_mocks__/GetCountry.json";
import GetCountryAliasMock from "./queries/__graphql_mocks__/GetCountryAlias.json";
import GetCountryWithCapitalErrorMock from "./queries/__graphql_mocks__/GetCountryWithCapitalError.json";
import GetCountryWithPopulationMock from "./queries/__graphql_mocks__/GetCountryWithPopulation.json";
import GetCountryWithWeatherMock from "./queries/__graphql_mocks__/GetCountryWithWeather.json";

const DEMOS = {
  "operation-mock": {
    label: "Operation",
    query: GET_COUNTRIES_MOCK,
    mockFilename: "GetCountries.json",
    mockContent: GetCountriesMock,
  },
  "field-existing": {
    label: "Field (Existing)",
    query: GET_COUNTRY_WITH_MOCK,
    mockFilename: "GetCountry.json",
    mockContent: GetCountryMock,
    variables: { code: "US" },
  },
  "fragment-field-existing": {
    label: "Fragment Field (Existing)",
    query: GET_COUNTRY_WITH_FRAGMENT_MOCK,
    mockFilename: "CountryCapitalFragment.json",
    mockContent: CountryCapitalFragmentMock,
    variables: { code: "US" },
  },
  "field-alias": {
    label: "Field (Alias)",
    query: GET_COUNTRY_ALIAS_MOCK,
    mockFilename: "GetCountryAlias.json",
    mockContent: GetCountryAliasMock,
    variables: { code: "US" },
  },
  "list-field": {
    label: "List Field",
    query: GET_COUNTRIES_LIST_MOCK,
    mockFilename: "GetCountriesList.json",
    mockContent: GetCountriesListMock,
  },
  "list-field-nested": {
    label: "List Field (Nested)",
    query: GET_COUNTRIES_WITH_POPULATION_MOCK,
    mockFilename: "GetCountriesWithPopulation.json",
    mockContent: GetCountriesWithPopulationMock,
  },
  "list-field-fragment": {
    label: "List Field in Fragment",
    query: GET_COUNTRIES_WITH_POPULATION_FRAGMENT_MOCK,
    mockFilename: "CountryPopulationFragment.json",
    mockContent: CountryPopulationFragmentMock,
  },
  "field-new": {
    label: "Field (New)",
    query: GET_COUNTRY_NEW_FIELD,
    mockFilename: "GetCountryWithPopulation.json",
    mockContent: GetCountryWithPopulationMock,
    variables: { code: "US" },
  },
  "field-new-nested": {
    label: "Field (New w/ Selection Set)",
    query: GET_COUNTRY_NESTED_NEW,
    mockFilename: "GetCountryWithWeather.json",
    mockContent: GetCountryWithWeatherMock,
    variables: { code: "US" },
  },
  "inline-value": {
    label: "Field (Inline Value)",
    query: GET_COUNTRY_INLINE_VALUE,
    mockFilename: null,
    mockContent: null,
    variables: { code: "US" },
  },
  "field-error": {
    label: "Field (Error)",
    query: GET_COUNTRY_CAPITAL_ERROR,
    mockFilename: "GetCountryWithCapitalError.json",
    mockContent: GetCountryWithCapitalErrorMock,
    variables: { code: "US" },
  },
} as const;

type DemoKey = keyof typeof DEMOS;
type CodeLanguage = "graphql" | "json";

const SYNTAX_THEME = "catppuccin-latte";
// The @shikijs/langs GraphQL wrapper imports embedded JS/TS grammars for template interpolation.
const GRAPHQL_GRAMMAR = { ...graphqlGrammar, aliases: ["gql"] } as unknown as LanguageRegistration;
const JSON_GRAMMAR = jsonGrammar as unknown as LanguageRegistration;
let syntaxHighlighter: Promise<HighlighterCore> | null = null;

function getSyntaxHighlighter() {
  syntaxHighlighter ??= Promise.all([
    import("shiki/core"),
    import("shiki/engine/javascript"),
    import("@shikijs/themes/catppuccin-latte"),
  ]).then(([{ createHighlighterCore }, { createJavaScriptRegexEngine }, theme]) =>
    createHighlighterCore({
      themes: [theme.default],
      langs: [GRAPHQL_GRAMMAR, JSON_GRAMMAR],
      engine: createJavaScriptRegexEngine(),
    })
  );

  return syntaxHighlighter;
}

const DEMO_GROUPS = [
  {
    id: "fields",
    label: "Fields",
    accent: "#007bff",
    demos: [
      "field-existing",
      "fragment-field-existing",
      "field-alias",
      "field-new",
      "field-new-nested",
      "inline-value",
      "field-error",
    ],
  },
  {
    id: "operation",
    label: "Operation",
    accent: "#007bff",
    demos: ["operation-mock"],
  },
  {
    id: "lists",
    label: "Lists",
    accent: "#007bff",
    demos: ["list-field", "list-field-nested", "list-field-fragment"],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  accent: string;
  demos: readonly DemoKey[];
}>;

type DemoGroup = (typeof DEMO_GROUPS)[number];
type DemoGroupId = DemoGroup["id"];

function getDemoGroup(key: DemoKey): DemoGroup {
  return DEMO_GROUPS.find((group) => (group.demos as readonly DemoKey[]).includes(key)) ?? DEMO_GROUPS[0];
}

function getOperationName(query: DocumentNode): string {
  const operation = query.definitions.find((definition) => definition.kind === "OperationDefinition");
  return operation?.kind === "OperationDefinition" ? operation.name?.value ?? "Anonymous" : "Anonymous";
}

function dedent(source: string): string {
  const lines = source.split("\n");

  while (lines[0]?.trim() === "") lines.shift();
  while (lines[lines.length - 1]?.trim() === "") lines.pop();

  const indent = Math.min(
    ...lines
      .filter((line) => line.trim() !== "")
      .map((line) => line.match(/^\s*/)?.[0].length ?? 0)
  );

  return lines.map((line) => line.slice(indent)).join("\n");
}

function formatQuery(query: DocumentNode): string {
  return query.loc?.source.body ? dedent(query.loc.source.body) : print(query);
}

function HighlightedCodeBlock({
  code,
  language,
  maxHeight = "400px",
}: {
  code: string;
  language: CodeLanguage;
  maxHeight?: string;
}) {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    setHighlightedHtml(null);

    getSyntaxHighlighter()
      .then((highlighter) =>
        highlighter.codeToHtml(code, {
          lang: language,
          theme: SYNTAX_THEME,
        })
      )
      .then((html) => {
        if (isCurrent) {
          setHighlightedHtml(html);
        }
      })
      .catch(() => {
        if (isCurrent) {
          setHighlightedHtml("");
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [code, language]);

  if (!highlightedHtml) {
    return (
      <pre className="highlighted-code highlighted-code-fallback" style={{ maxHeight }}>
        {code}
      </pre>
    );
  }

  return (
    <div
      className="highlighted-code"
      style={{ maxHeight }}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  );
}

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "0.75rem clamp(1rem, 4vw, 2rem) 2rem", width: "min(100%, 1200px)", boxSizing: "border-box", margin: "0.5rem auto 0" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.25rem 1rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.4rem", color: "#1a1a2e" }}>GraphQL <code style={{ fontSize: "1.3rem", color: "#e83e8c" }}>@mock</code> Directive Demo</h1>
        <nav style={{ display: "flex", gap: "1rem", fontSize: "0.8rem" }}>
          <a href="https://public.larah.me/~mark/MockSpec.html" target="_blank" rel="noreferrer">Spec</a>
          <a href="https://github.com/graphql/ai-wg/issues/79" target="_blank" rel="noreferrer">AI WG Discussion</a>
          <a href="https://github.com/magicmark/mock-spec-demo" target="_blank" rel="noreferrer">Source</a>
        </nav>
      </div>

      {children}
    </div>
  );
}

function DemoSelector({
  selectedDemo,
  setSelectedDemo,
}: {
  selectedDemo: DemoKey;
  setSelectedDemo: (key: DemoKey) => void;
}) {
  const [activeGroupId, setActiveGroupId] = useState<DemoGroupId>(getDemoGroup(selectedDemo).id);
  const activeGroup = DEMO_GROUPS.find((group) => group.id === activeGroupId) ?? getDemoGroup(selectedDemo);

  return (
    <div style={{ marginBottom: "0.75rem", padding: "0.75rem", background: "#f6f7fb", borderRadius: "6px", border: "1px solid #c7ccd8" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Select Demo</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6a7888" }}>
            Categories
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexWrap: "wrap", padding: "0.25rem", background: "#fff", border: "1px solid #d5dbe5", borderRadius: "999px" }}>
            {DEMO_GROUPS.map((group) => {
              const isActive = activeGroup.id === group.id;

              return (
                <button
                  key={group.id}
                  onClick={() => {
                    setActiveGroupId(group.id);
                    setSelectedDemo(group.demos[0]);
                  }}
                  style={{
                    padding: "0.36rem 0.65rem",
                    borderRadius: "999px",
                    border: "none",
                    background: isActive ? group.accent : "transparent",
                    color: isActive ? "#fff" : "#243447",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  {group.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(15rem, 100%), 1fr))", gridAutoRows: "4.25rem", gap: "0.65rem" }}>
        {activeGroup.demos.map((key) => {
          const demo = DEMOS[key];
          const isSelected = selectedDemo === key;
          const operationName = getOperationName(demo.query);

          return (
            <button
              key={key}
              onClick={() => setSelectedDemo(key)}
              style={{
                height: "100%",
                padding: "0.55rem 0.75rem",
                borderRadius: "6px",
                border: `2px solid ${isSelected ? activeGroup.accent : "#d6dae3"}`,
                background: isSelected ? "#fff" : "#fbfcff",
                color: "#1f2f3f",
                cursor: "pointer",
                textAlign: "left",
                boxShadow: isSelected ? `inset 0 0 0 1px ${activeGroup.accent}` : "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <span style={{ display: "block", fontSize: "0.95rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "0.45rem" }}>
                {demo.label}
              </span>
              <span style={{ display: "block", fontFamily: "monospace", fontSize: "0.75rem", color: "#465a6e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {operationName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DemoPanel({ query, mockFilename, mockContent, variables }: {
  query: DocumentNode;
  mockFilename: string | null;
  mockContent: unknown;
  variables?: Record<string, unknown>;
}) {
  const [executeQuery, { loading, error, data }] = useLazyQuery<Record<string, unknown>>(query, {
    errorPolicy: "all",
  });
  const querySource = formatQuery(query);
  const mockSource = JSON.stringify(mockContent, null, 2);

  const panelStyle: React.CSSProperties = {
    flex: "1 1 22rem",
    minWidth: 0,
    padding: "0.75rem",
    background: "#f8f9fa",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
        <div style={panelStyle}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem" }}>GraphQL Query</h3>
          <HighlightedCodeBlock code={querySource} language="graphql" />
        </div>
        <div style={panelStyle}>
          {mockFilename ? (
            <>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem" }}>Mock File: <code>{mockFilename}</code></h3>
              <HighlightedCodeBlock code={mockSource} language="json" />
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

      <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
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
      {error && (
        <div style={{ marginTop: "1rem", padding: "0.75rem", border: "1px solid #dc3545", borderRadius: "6px", background: "#fff5f5", color: "#9f1239", textAlign: "left" }}>
          <strong>GraphQL Error:</strong> {error.message}
        </div>
      )}

      {data && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Response:</h3>
          <div style={{ padding: "1.5rem", border: "2px solid #007bff", borderRadius: "8px", background: "#cfe2ff" }}>
            <HighlightedCodeBlock code={JSON.stringify(data, null, 2)} language="json" maxHeight="520px" />
          </div>
        </div>
      )}
    </div>
  );
}

function SelectedDemoHeader({ demo }: { demo: (typeof DEMOS)[DemoKey] }) {
  return (
    <div style={{ margin: "0 0 0.5rem", paddingTop: "12px", display: "flex", alignItems: "center", flexWrap: "wrap" }}>
      <h2 style={{ margin: 0, fontSize: "0.9rem", color: "#5d6b7a", fontWeight: 800 }}>{demo.label}</h2>
    </div>
  );
}

function App() {
  const [selectedDemo, setSelectedDemo] = useState<DemoKey>("field-existing");
  const demo = DEMOS[selectedDemo];

  return (
    <PageFrame>
      <DemoSelector selectedDemo={selectedDemo} setSelectedDemo={setSelectedDemo} />
      <SelectedDemoHeader demo={demo} />

      <DemoPanel
        key={selectedDemo}
        query={demo.query}
        mockFilename={demo.mockFilename ?? null}
        mockContent={demo.mockContent ?? null}
        variables={"variables" in demo ? demo.variables : undefined}
      />
    </PageFrame>
  );
}

export default App;
