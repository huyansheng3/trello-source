import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspaceChooser"}}
export type WorkspaceChooserQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
  memberId: Types.Scalars['ID'];
}>;


export type WorkspaceChooserQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'idOrganization'>
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id'>
    )> }
  )>, member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'idOrganizations'>
  )> }
);


export const WorkspaceChooserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceChooser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idOrganizations"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspaceChooserQuery__
 *
 * To run a query within a React component, call `useWorkspaceChooserQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceChooserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceChooserQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useWorkspaceChooserQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceChooserQuery, WorkspaceChooserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceChooserQuery, WorkspaceChooserQueryVariables>(WorkspaceChooserDocument, options);
      }
export function useWorkspaceChooserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceChooserQuery, WorkspaceChooserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceChooserQuery, WorkspaceChooserQueryVariables>(WorkspaceChooserDocument, options);
        }
export type WorkspaceChooserQueryHookResult = ReturnType<typeof useWorkspaceChooserQuery>;
export type WorkspaceChooserLazyQueryHookResult = ReturnType<typeof useWorkspaceChooserLazyQuery>;
export type WorkspaceChooserQueryResult = Apollo.QueryResult<WorkspaceChooserQuery, WorkspaceChooserQueryVariables>;