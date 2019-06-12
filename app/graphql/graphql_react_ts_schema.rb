class GraphqlReactTsSchema < GraphQL::Schema
  use GraphQL::Subscriptions::ActionCableSubscriptions

  mutation(Types::MutationType)
  query(Types::QueryType)
  subscription(Types::SubscriptionType)
end

GraphqlReactTsSchema.graphql_definition