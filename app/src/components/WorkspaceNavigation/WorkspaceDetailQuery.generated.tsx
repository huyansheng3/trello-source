import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspaceDetail"}}
export type WorkspaceDetailQueryVariables = Types.Exact<{
  orgId?: Types.Maybe<Types.Scalars['ID']>;
}>;


export type WorkspaceDetailQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'name' | 'displayName' | 'logoHash' | 'premiumFeatures' | 'products' | 'idEnterprise'>
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id'>
    )> }
  )> }
);


export const WorkspaceDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"defaultValue":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspaceDetailQuery__
 *
 * To run a query within a React component, call `useWorkspaceDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceDetailQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useWorkspaceDetailQuery(baseOptions?: Apollo.QueryHookOptions<WorkspaceDetailQuery, WorkspaceDetailQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceDetailQuery, WorkspaceDetailQueryVariables>(WorkspaceDetailDocument, options);
      }
export function useWorkspaceDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceDetailQuery, WorkspaceDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceDetailQuery, WorkspaceDetailQueryVariables>(WorkspaceDetailDocument, options);
        }
export type WorkspaceDetailQueryHookResult = ReturnType<typeof useWorkspaceDetailQuery>;
export type WorkspaceDetailLazyQueryHookResult = ReturnType<typeof useWorkspaceDetailLazyQuery>;
export type WorkspaceDetailQueryResult = Apollo.QueryResult<WorkspaceDetailQuery, WorkspaceDetailQueryVariables>;