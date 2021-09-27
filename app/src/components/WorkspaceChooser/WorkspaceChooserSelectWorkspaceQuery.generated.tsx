import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspaceChooserSelectWorkspace"}}
export type WorkspaceChooserSelectWorkspaceQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
  memberId: Types.Scalars['ID'];
}>;


export type WorkspaceChooserSelectWorkspaceQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'idOrganization'>
  )>, member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'idEnterprise'>
    & { enterprises: Array<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id' | 'isRealEnterprise'>
    )>, organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'displayName' | 'idEnterprise'>
      & { limits: (
        { __typename: 'Organization_Limits' }
        & { orgs: (
          { __typename: 'Organization_Limits_Orgs' }
          & { freeBoardsPerOrg: (
            { __typename: 'Limit' }
            & Pick<Types.Limit, 'status'>
          ) }
        ) }
      ) }
    )> }
  )> }
);


export const WorkspaceChooserSelectWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceChooserSelectWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isRealEnterprise"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"freeBoardsPerOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspaceChooserSelectWorkspaceQuery__
 *
 * To run a query within a React component, call `useWorkspaceChooserSelectWorkspaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceChooserSelectWorkspaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceChooserSelectWorkspaceQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useWorkspaceChooserSelectWorkspaceQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceChooserSelectWorkspaceQuery, WorkspaceChooserSelectWorkspaceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceChooserSelectWorkspaceQuery, WorkspaceChooserSelectWorkspaceQueryVariables>(WorkspaceChooserSelectWorkspaceDocument, options);
      }
export function useWorkspaceChooserSelectWorkspaceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceChooserSelectWorkspaceQuery, WorkspaceChooserSelectWorkspaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceChooserSelectWorkspaceQuery, WorkspaceChooserSelectWorkspaceQueryVariables>(WorkspaceChooserSelectWorkspaceDocument, options);
        }
export type WorkspaceChooserSelectWorkspaceQueryHookResult = ReturnType<typeof useWorkspaceChooserSelectWorkspaceQuery>;
export type WorkspaceChooserSelectWorkspaceLazyQueryHookResult = ReturnType<typeof useWorkspaceChooserSelectWorkspaceLazyQuery>;
export type WorkspaceChooserSelectWorkspaceQueryResult = Apollo.QueryResult<WorkspaceChooserSelectWorkspaceQuery, WorkspaceChooserSelectWorkspaceQueryVariables>;