import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CardsPerMember"}}
export type CardsPerMemberQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type CardsPerMemberQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { cards: Array<(
      { __typename: 'Card' }
      & Pick<Types.Card, 'id' | 'idMembers'>
    )>, members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id' | 'fullName' | 'username'>
    )> }
  )> }
);


export const CardsPerMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardsPerMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCardsPerMemberQuery__
 *
 * To run a query within a React component, call `useCardsPerMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardsPerMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardsPerMemberQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useCardsPerMemberQuery(baseOptions: Apollo.QueryHookOptions<CardsPerMemberQuery, CardsPerMemberQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CardsPerMemberQuery, CardsPerMemberQueryVariables>(CardsPerMemberDocument, options);
      }
export function useCardsPerMemberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardsPerMemberQuery, CardsPerMemberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CardsPerMemberQuery, CardsPerMemberQueryVariables>(CardsPerMemberDocument, options);
        }
export type CardsPerMemberQueryHookResult = ReturnType<typeof useCardsPerMemberQuery>;
export type CardsPerMemberLazyQueryHookResult = ReturnType<typeof useCardsPerMemberLazyQuery>;
export type CardsPerMemberQueryResult = Apollo.QueryResult<CardsPerMemberQuery, CardsPerMemberQueryVariables>;