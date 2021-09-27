import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspaceChooserRestrictedBoardVisibility"}}
export type WorkspaceChooserRestrictedBoardVisibilityQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
  orgId: Types.Scalars['ID'];
}>;


export type WorkspaceChooserRestrictedBoardVisibilityQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & { prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'permissionLevel'>
    )> }
  )>, organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & { memberships: Array<(
      { __typename: 'Organization_Membership' }
      & Pick<Types.Organization_Membership, 'idMember' | 'memberType'>
    )>, prefs: (
      { __typename: 'Organization_Prefs' }
      & { boardVisibilityRestrict?: Types.Maybe<(
        { __typename: 'Organization_Prefs_BoardVisibilityRestrict' }
        & Pick<Types.Organization_Prefs_BoardVisibilityRestrict, 'private' | 'public' | 'org' | 'enterprise'>
      )> }
    ) }
  )> }
);


export const WorkspaceChooserRestrictedBoardVisibilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceChooserRestrictedBoardVisibility"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardVisibilityRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspaceChooserRestrictedBoardVisibilityQuery__
 *
 * To run a query within a React component, call `useWorkspaceChooserRestrictedBoardVisibilityQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceChooserRestrictedBoardVisibilityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceChooserRestrictedBoardVisibilityQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useWorkspaceChooserRestrictedBoardVisibilityQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceChooserRestrictedBoardVisibilityQuery, WorkspaceChooserRestrictedBoardVisibilityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceChooserRestrictedBoardVisibilityQuery, WorkspaceChooserRestrictedBoardVisibilityQueryVariables>(WorkspaceChooserRestrictedBoardVisibilityDocument, options);
      }
export function useWorkspaceChooserRestrictedBoardVisibilityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceChooserRestrictedBoardVisibilityQuery, WorkspaceChooserRestrictedBoardVisibilityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceChooserRestrictedBoardVisibilityQuery, WorkspaceChooserRestrictedBoardVisibilityQueryVariables>(WorkspaceChooserRestrictedBoardVisibilityDocument, options);
        }
export type WorkspaceChooserRestrictedBoardVisibilityQueryHookResult = ReturnType<typeof useWorkspaceChooserRestrictedBoardVisibilityQuery>;
export type WorkspaceChooserRestrictedBoardVisibilityLazyQueryHookResult = ReturnType<typeof useWorkspaceChooserRestrictedBoardVisibilityLazyQuery>;
export type WorkspaceChooserRestrictedBoardVisibilityQueryResult = Apollo.QueryResult<WorkspaceChooserRestrictedBoardVisibilityQuery, WorkspaceChooserRestrictedBoardVisibilityQueryVariables>;