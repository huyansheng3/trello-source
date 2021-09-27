import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspaceChooserRestrictedGuests"}}
export type WorkspaceChooserRestrictedGuestsQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
  orgId: Types.Scalars['ID'];
}>;


export type WorkspaceChooserRestrictedGuestsQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id'>
    )>, prefs: (
      { __typename: 'Organization_Prefs' }
      & Pick<Types.Organization_Prefs, 'boardInviteRestrict'>
    ) }
  )>, board?: Types.Maybe<(
    { __typename: 'Board' }
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id' | 'fullName'>
    )> }
  )> }
);


export const WorkspaceChooserRestrictedGuestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceChooserRestrictedGuests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardInviteRestrict"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspaceChooserRestrictedGuestsQuery__
 *
 * To run a query within a React component, call `useWorkspaceChooserRestrictedGuestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceChooserRestrictedGuestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceChooserRestrictedGuestsQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useWorkspaceChooserRestrictedGuestsQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceChooserRestrictedGuestsQuery, WorkspaceChooserRestrictedGuestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceChooserRestrictedGuestsQuery, WorkspaceChooserRestrictedGuestsQueryVariables>(WorkspaceChooserRestrictedGuestsDocument, options);
      }
export function useWorkspaceChooserRestrictedGuestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceChooserRestrictedGuestsQuery, WorkspaceChooserRestrictedGuestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceChooserRestrictedGuestsQuery, WorkspaceChooserRestrictedGuestsQueryVariables>(WorkspaceChooserRestrictedGuestsDocument, options);
        }
export type WorkspaceChooserRestrictedGuestsQueryHookResult = ReturnType<typeof useWorkspaceChooserRestrictedGuestsQuery>;
export type WorkspaceChooserRestrictedGuestsLazyQueryHookResult = ReturnType<typeof useWorkspaceChooserRestrictedGuestsLazyQuery>;
export type WorkspaceChooserRestrictedGuestsQueryResult = Apollo.QueryResult<WorkspaceChooserRestrictedGuestsQuery, WorkspaceChooserRestrictedGuestsQueryVariables>;