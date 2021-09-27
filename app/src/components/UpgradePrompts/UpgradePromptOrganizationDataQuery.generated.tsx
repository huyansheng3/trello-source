import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UpgradePromptOrganizationData"}}
export type UpgradePromptOrganizationDataQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type UpgradePromptOrganizationDataQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'products' | 'premiumFeatures'>
  )> }
);


export const UpgradePromptOrganizationDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UpgradePromptOrganizationData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useUpgradePromptOrganizationDataQuery__
 *
 * To run a query within a React component, call `useUpgradePromptOrganizationDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpgradePromptOrganizationDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpgradePromptOrganizationDataQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useUpgradePromptOrganizationDataQuery(baseOptions: Apollo.QueryHookOptions<UpgradePromptOrganizationDataQuery, UpgradePromptOrganizationDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UpgradePromptOrganizationDataQuery, UpgradePromptOrganizationDataQueryVariables>(UpgradePromptOrganizationDataDocument, options);
      }
export function useUpgradePromptOrganizationDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UpgradePromptOrganizationDataQuery, UpgradePromptOrganizationDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UpgradePromptOrganizationDataQuery, UpgradePromptOrganizationDataQueryVariables>(UpgradePromptOrganizationDataDocument, options);
        }
export type UpgradePromptOrganizationDataQueryHookResult = ReturnType<typeof useUpgradePromptOrganizationDataQuery>;
export type UpgradePromptOrganizationDataLazyQueryHookResult = ReturnType<typeof useUpgradePromptOrganizationDataLazyQuery>;
export type UpgradePromptOrganizationDataQueryResult = Apollo.QueryResult<UpgradePromptOrganizationDataQuery, UpgradePromptOrganizationDataQueryVariables>;