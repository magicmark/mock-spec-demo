import { gql } from "@apollo/client";

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
