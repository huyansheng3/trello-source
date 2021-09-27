import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"OrganizationViews"}}
export type OrganizationViewsQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type OrganizationViewsQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & { organizationViews: Array<(
      { __typename: 'OrganizationView' }
      & Pick<Types.OrganizationView, 'id' | 'name' | 'shortLink'>
      & { prefs: (
        { __typename: 'OrganizationView_Prefs' }
        & Pick<Types.OrganizationView_Prefs, 'permissionLevel'>
      ), views: Array<(
        { __typename: 'OrganizationView_View' }
        & Pick<Types.OrganizationView_View, 'defaultViewType'>
      )> }
    )> }
  )> }
);


export const OrganizationViewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationViews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationViews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"created"}]}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"EnumValue","value":"name"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"views"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defaultViewType"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useOrganizationViewsQuery__
 *
 * To run a query within a React component, call `useOrganizationViewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationViewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationViewsQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useOrganizationViewsQuery(baseOptions: Apollo.QueryHookOptions<OrganizationViewsQuery, OrganizationViewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationViewsQuery, OrganizationViewsQueryVariables>(OrganizationViewsDocument, options);
      }
export function useOrganizationViewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationViewsQuery, OrganizationViewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationViewsQuery, OrganizationViewsQueryVariables>(OrganizationViewsDocument, options);
        }
export type OrganizationViewsQueryHookResult = ReturnType<typeof useOrganizationViewsQuery>;
export type OrganizationViewsLazyQueryHookResult = ReturnType<typeof useOrganizationViewsLazyQuery>;
export type OrganizationViewsQueryResult = Apollo.QueryResult<OrganizationViewsQuery, OrganizationViewsQueryVariables>;