import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CreateOrganizationView"}}
export type CreateOrganizationViewMutationVariables = Types.Exact<{
  name: Types.Scalars['String'];
  idOrganization: Types.Scalars['ID'];
  prefs: Types.InputOrganizationView_Prefs;
  views: Array<Types.InputOrganizationView_View> | Types.InputOrganizationView_View;
}>;


export type CreateOrganizationViewMutation = (
  { __typename: 'Mutation' }
  & { createOrganizationView?: Types.Maybe<(
    { __typename: 'OrganizationView' }
    & Pick<Types.OrganizationView, 'name' | 'shortLink'>
  )> }
);


export const CreateOrganizationViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOrganizationView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idOrganization"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prefs"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputOrganizationView_Prefs"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"views"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputOrganizationView_View"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrganizationView"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"idOrganization"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idOrganization"}}},{"kind":"Argument","name":{"kind":"Name","value":"prefs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prefs"}}},{"kind":"Argument","name":{"kind":"Name","value":"views"},"value":{"kind":"Variable","name":{"kind":"Name","value":"views"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}}]}}]}}]} as unknown as DocumentNode;
export type CreateOrganizationViewMutationFn = Apollo.MutationFunction<CreateOrganizationViewMutation, CreateOrganizationViewMutationVariables>;

/**
 * __useCreateOrganizationViewMutation__
 *
 * To run a mutation, you first call `useCreateOrganizationViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrganizationViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrganizationViewMutation, { data, loading, error }] = useCreateOrganizationViewMutation({
 *   variables: {
 *      name: // value for 'name'
 *      idOrganization: // value for 'idOrganization'
 *      prefs: // value for 'prefs'
 *      views: // value for 'views'
 *   },
 * });
 */
export function useCreateOrganizationViewMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrganizationViewMutation, CreateOrganizationViewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOrganizationViewMutation, CreateOrganizationViewMutationVariables>(CreateOrganizationViewDocument, options);
      }
export type CreateOrganizationViewMutationHookResult = ReturnType<typeof useCreateOrganizationViewMutation>;
export type CreateOrganizationViewMutationResult = Apollo.MutationResult<CreateOrganizationViewMutation>;
export type CreateOrganizationViewMutationOptions = Apollo.BaseMutationOptions<CreateOrganizationViewMutation, CreateOrganizationViewMutationVariables>;