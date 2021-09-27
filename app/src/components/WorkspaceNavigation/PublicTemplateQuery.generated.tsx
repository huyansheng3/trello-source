import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"PublicTemplate"}}
export type PublicTemplateQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type PublicTemplateQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'isTemplate' | 'permissionLevel'>
    )> }
  )> }
);


export const PublicTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublicTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __usePublicTemplateQuery__
 *
 * To run a query within a React component, call `usePublicTemplateQuery` and pass it any options that fit your needs.
 * When your component renders, `usePublicTemplateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePublicTemplateQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function usePublicTemplateQuery(baseOptions: Apollo.QueryHookOptions<PublicTemplateQuery, PublicTemplateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PublicTemplateQuery, PublicTemplateQueryVariables>(PublicTemplateDocument, options);
      }
export function usePublicTemplateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PublicTemplateQuery, PublicTemplateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PublicTemplateQuery, PublicTemplateQueryVariables>(PublicTemplateDocument, options);
        }
export type PublicTemplateQueryHookResult = ReturnType<typeof usePublicTemplateQuery>;
export type PublicTemplateLazyQueryHookResult = ReturnType<typeof usePublicTemplateLazyQuery>;
export type PublicTemplateQueryResult = Apollo.QueryResult<PublicTemplateQuery, PublicTemplateQueryVariables>;