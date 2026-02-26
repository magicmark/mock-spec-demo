import { gql } from "@apollo/client";

/**
 * Query to get a single country by code
 */
export const GET_COUNTRY = gql`
  query GetCountry($code: ID!) {
    country(code: $code) {
      code
      name
      capital
      currency
      emoji
      languages {
        code
        name
      }
    }
  }
`;

/**
 * Query with field-level mocking
 * The capital field will be mocked while other fields come from the server
 */
export const GET_COUNTRY_WITH_MOCK = gql`
  query GetCountry($code: ID!) {
    country(code: $code) {
      code
      name
      capital @mock(variant: "fictional-capital")
      currency
      emoji
      languages {
        code
        name
      }
    }
  }
`;

/**
 * Query to get list of countries (operation-level mock)
 */
export const GET_COUNTRIES_MOCK = gql`
  query GetCountries @mock(variant: "top-three") {
    countries {
      code
      name
      capital
      emoji
    }
  }
`;

/**
 * Query to get list of countries (no mock)
 */
export const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
      capital
      emoji
    }
  }
`;

/**
 * Query with a new field that doesn't exist in the schema yet
 * The population field will be mocked
 */
export const GET_COUNTRY_NEW_FIELD = gql`
  query GetCountryWithPopulation($code: ID!) {
    country(code: $code) {
      code
      name
      capital
      emoji
      population @mock(variant: "estimated-population")
    }
  }
`;

/**
 * Query with nested new types that don't exist in the schema yet
 * The weather field and its nested structure will be mocked
 */
export const GET_COUNTRY_NESTED_NEW = gql`
  query GetCountryWithWeather($code: ID!) {
    country(code: $code) {
      code
      name
      emoji
      weather @mock(variant: "current-weather") {
        temperature
        condition
        forecast {
          day
          high
          low
          precipitation
        }
      }
    }
  }
`;
