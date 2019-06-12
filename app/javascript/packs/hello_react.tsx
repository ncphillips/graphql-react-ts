// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import * as React from "react";
import * as ReactDOM from "react-dom";
import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";

import client from "../apollo-client";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";

function Hello() {
  let testFieldQuery = useQuery(QUERY_TEST_FIELD, { suspend: false });
  if (testFieldQuery.loading) return <div>Loading</div>;
  return <div>Test Field: {testFieldQuery.data.testField}</div>;
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <ApolloHooksProvider client={client}>
      <Hello />
    </ApolloHooksProvider>,
    document.body.appendChild(document.createElement("div"))
  );
});

const QUERY_TEST_FIELD = gql`
  query TestField {
    testField
  }
`;
