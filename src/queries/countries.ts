import { gql } from "@apollo/client";

export const GET_COUNTRY_WITH_MOCK = gql`
  query GetCountry($code: ID!) {
    country(code: $code) {
      code
      name
      capital @mock(variant: "fictional-capital")
      emoji
    }
  }
`;

export const GET_COUNTRY_WITH_FRAGMENT_MOCK = gql`
  query GetCountryWithCapitalFragment($code: ID!) {
    country(code: $code) {
      code
      name
      emoji
      ...CountryCapitalFragment
    }
  }

  fragment CountryCapitalFragment on Country {
    capital @mock(variant: "fictional-capital")
  }
`;

export const GET_COUNTRY_ALIAS_MOCK = gql`
  query GetCountryAlias($code: ID!) {
    country(code: $code) {
      code
      name
      capital @mock(variant: "fictional-capital")
      home: capital @mock(variant: "fictional-home")
      emoji
    }
  }
`;

export const GET_COUNTRIES_LIST_MOCK = gql`
  query GetCountriesList {
    continent(code: "AN") {
      code
      countries @mock(variant: "antarctic-countries") {
        code
        name
      }
    }
  }
`;

export const GET_COUNTRIES_WITH_POPULATION_MOCK = gql`
  query GetCountriesWithPopulation {
    continent(code: "AN") {
      code
      countries {
        code
        name
        population @mock(variant: "estimated-population")
      }
    }
  }
`;

export const GET_COUNTRIES_WITH_POPULATION_FRAGMENT_MOCK = gql`
  query GetCountriesWithPopulationFragment {
    continent(code: "AN") {
      code
      countries {
        code
        name
        ...CountryPopulationFragment
      }
    }
  }

  fragment CountryPopulationFragment on Country {
    population @mock(variant: "estimated-population")
  }
`;

export const GET_COUNTRY_CAPITAL_ERROR = gql`
  query GetCountryWithCapitalError($code: ID!) {
    country(code: $code) {
      code
      name
      capital @mock(variant: "capital-with-error")
      emoji
    }
  }
`;

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

export const GET_COUNTRY_NEW_FIELD = gql`
  query GetCountryWithPopulation($code: ID!) {
    country(code: $code) {
      code
      name
      capital
      emoji
      # this field does not exist on the server!
      population @mock(variant: "estimated-population")
    }
  }
`;

export const GET_COUNTRY_NESTED_NEW = gql`
  query GetCountryWithWeather($code: ID!) {
    country(code: $code) {
      code
      name
      emoji
      # this field does not exist on the server!
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

export const GET_COUNTRY_INLINE_VALUE = gql`
  query GetCountryInlineValue($code: ID!) {
    country(code: $code) {
      code
      name
      emoji
      capital @mock(value: "Wakanda City")
      population @mock(value: "331900000")
    }
  }
`;
