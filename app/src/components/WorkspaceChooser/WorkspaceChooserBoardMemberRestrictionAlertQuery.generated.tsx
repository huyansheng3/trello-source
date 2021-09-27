import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspaceChooserBoardMemberRestrictionAlert"}}
export type WorkspaceChooserBoardMemberRestrictionAlertQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type WorkspaceChooserBoardMemberRestrictionAlertQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'displayName'>
  )> }
);


export const WorkspaceChooserBoardMemberRestrictionAlertDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceChooserBoardMemberRestrictionAlert"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspaceChooserBoardMemberRestrictionAlertQuery__
 *
 * To run a query within a React component, call `useWorkspaceChooserBoardMemberRestrictionAlertQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceChooserBoardMemberRestrictionAlertQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceChooserBoardMemberRestrictionAlertQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useWorkspaceChooserBoardMemberRestrictionAlertQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceChooserBoardMemberRestrictionAlertQuery, WorkspaceChooserBoardMemberRestrictionAlertQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceChooserBoardMemberRestrictionAlertQuery, WorkspaceChooserBoardMemberRestrictionAlertQueryVariables>(WorkspaceChooserBoardMemberRestrictionAlertDocument, options);
      }
export function useWorkspaceChooserBoardMemberRestrictionAlertLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceChooserBoardMemberRestrictionAlertQuery, WorkspaceChooserBoardMemberRestrictionAlertQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceChooserBoardMemberRestrictionAlertQuery, WorkspaceChooserBoardMemberRestrictionAlertQueryVariables>(WorkspaceChooserBoardMemberRestrictionAlertDocument, options);
        }
export type WorkspaceChooserBoardMemberRestrictionAlertQueryHookResult = ReturnType<typeof useWorkspaceChooserBoardMemberRestrictionAlertQuery>;
export type WorkspaceChooserBoardMemberRestrictionAlertLazyQueryHookResult = ReturnType<typeof useWorkspaceChooserBoardMemberRestrictionAlertLazyQuery>;
export type WorkspaceChooserBoardMemberRestrictionAlertQueryResult = Apollo.QueryResult<WorkspaceChooserBoardMemberRestrictionAlertQuery, WorkspaceChooserBoardMemberRestrictionAlertQueryVariables>;