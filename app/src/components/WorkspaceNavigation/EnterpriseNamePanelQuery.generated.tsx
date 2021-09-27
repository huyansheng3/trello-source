import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"EnterpriseNamePanel"}}
export type EnterpriseNamePanelQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type EnterpriseNamePanelQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & { enterprise?: Types.Maybe<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'displayName' | 'logoHash'>
    )> }
  )> }
);


export const EnterpriseNamePanelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EnterpriseNamePanel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useEnterpriseNamePanelQuery__
 *
 * To run a query within a React component, call `useEnterpriseNamePanelQuery` and pass it any options that fit your needs.
 * When your component renders, `useEnterpriseNamePanelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEnterpriseNamePanelQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useEnterpriseNamePanelQuery(baseOptions: Apollo.QueryHookOptions<EnterpriseNamePanelQuery, EnterpriseNamePanelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EnterpriseNamePanelQuery, EnterpriseNamePanelQueryVariables>(EnterpriseNamePanelDocument, options);
      }
export function useEnterpriseNamePanelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EnterpriseNamePanelQuery, EnterpriseNamePanelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EnterpriseNamePanelQuery, EnterpriseNamePanelQueryVariables>(EnterpriseNamePanelDocument, options);
        }
export type EnterpriseNamePanelQueryHookResult = ReturnType<typeof useEnterpriseNamePanelQuery>;
export type EnterpriseNamePanelLazyQueryHookResult = ReturnType<typeof useEnterpriseNamePanelLazyQuery>;
export type EnterpriseNamePanelQueryResult = Apollo.QueryResult<EnterpriseNamePanelQuery, EnterpriseNamePanelQueryVariables>;