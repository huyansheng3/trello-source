import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspaceChooserNewBillableGuests"}}
export type WorkspaceChooserNewBillableGuestsQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
  orgId: Types.Scalars['ID'];
}>;


export type WorkspaceChooserNewBillableGuestsQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & { newBillableGuests: Array<(
      { __typename: 'Organization_NewBillableGuest' }
      & Pick<Types.Organization_NewBillableGuest, 'id'>
    )>, memberships: Array<(
      { __typename: 'Organization_Membership' }
      & Pick<Types.Organization_Membership, 'idMember' | 'memberType'>
    )> }
  )> }
);


export const WorkspaceChooserNewBillableGuestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceChooserNewBillableGuests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newBillableGuests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWorkspaceChooserNewBillableGuestsQuery__
 *
 * To run a query within a React component, call `useWorkspaceChooserNewBillableGuestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceChooserNewBillableGuestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceChooserNewBillableGuestsQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useWorkspaceChooserNewBillableGuestsQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceChooserNewBillableGuestsQuery, WorkspaceChooserNewBillableGuestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceChooserNewBillableGuestsQuery, WorkspaceChooserNewBillableGuestsQueryVariables>(WorkspaceChooserNewBillableGuestsDocument, options);
      }
export function useWorkspaceChooserNewBillableGuestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceChooserNewBillableGuestsQuery, WorkspaceChooserNewBillableGuestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceChooserNewBillableGuestsQuery, WorkspaceChooserNewBillableGuestsQueryVariables>(WorkspaceChooserNewBillableGuestsDocument, options);
        }
export type WorkspaceChooserNewBillableGuestsQueryHookResult = ReturnType<typeof useWorkspaceChooserNewBillableGuestsQuery>;
export type WorkspaceChooserNewBillableGuestsLazyQueryHookResult = ReturnType<typeof useWorkspaceChooserNewBillableGuestsLazyQuery>;
export type WorkspaceChooserNewBillableGuestsQueryResult = Apollo.QueryResult<WorkspaceChooserNewBillableGuestsQuery, WorkspaceChooserNewBillableGuestsQueryVariables>;