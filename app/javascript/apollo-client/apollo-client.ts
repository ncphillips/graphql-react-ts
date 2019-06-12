import { getMainDefinition } from "apollo-utilities";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, Observable, split } from "apollo-link";
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink";
import { cable } from "../cable";

import cache from "./apollo-cache";
import ApolloClient from "apollo-client/ApolloClient";

/**
 * errorHandler
 *
 * Handles GraphQL and Network Errors.
 */
const errorHandler = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

/**
 * httpLink
 *
 */
const httpLink = new HttpLink({
  uri: `/graphql`,
  credentials: "include"
});

/**
 * wsLink
 */
const wsLink = new ActionCableLink({ cable });

/**
 * networkLink
 */
let networkLink = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query) as any;
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

/**
 * requestLink
 *
 * I don't understand why we need this, but it was suggested in the apollo docs.
 */
const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle: any;
      Promise.resolve(operation)
        // .then(oper => request(oper))
        .then(() => {
          // @ts-ignore
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const client = new ApolloClient({
  link: ApolloLink.from([errorHandler, requestLink, networkLink]),
  cache
});

export default client;
