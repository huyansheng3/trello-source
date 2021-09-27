import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CardsPerMemberHistory"}}
export type CardsPerMemberHistoryQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
  from?: Types.Maybe<Types.Scalars['String']>;
}>;


export type CardsPerMemberHistoryQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id' | 'fullName' | 'username'>
    )>, history?: Types.Maybe<(
      { __typename: 'Board_History' }
      & { cardsPerMember: (
        { __typename: 'Board_History_CardsPerMember' }
        & Pick<Types.Board_History_CardsPerMember, 'complete'>
        & { series: Array<(
          { __typename: 'Board_History_CardsPerMember_Series' }
          & Pick<Types.Board_History_CardsPerMember_Series, 'idMember'>
          & { dataPoints: Array<(
            { __typename: 'Board_History_CardsPerMember_Series_DataPoint' }
            & Pick<Types.Board_History_CardsPerMember_Series_DataPoint, 'dateTime' | 'value'>
          )> }
        )> }
      ) }
    )> }
  )> }
);


export const CardsPerMemberHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardsPerMemberHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardsPerMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"complete"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"dataPoints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateTime"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCardsPerMemberHistoryQuery__
 *
 * To run a query within a React component, call `useCardsPerMemberHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardsPerMemberHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardsPerMemberHistoryQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *      from: // value for 'from'
 *   },
 * });
 */
export function useCardsPerMemberHistoryQuery(baseOptions: Apollo.QueryHookOptions<CardsPerMemberHistoryQuery, CardsPerMemberHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CardsPerMemberHistoryQuery, CardsPerMemberHistoryQueryVariables>(CardsPerMemberHistoryDocument, options);
      }
export function useCardsPerMemberHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardsPerMemberHistoryQuery, CardsPerMemberHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CardsPerMemberHistoryQuery, CardsPerMemberHistoryQueryVariables>(CardsPerMemberHistoryDocument, options);
        }
export type CardsPerMemberHistoryQueryHookResult = ReturnType<typeof useCardsPerMemberHistoryQuery>;
export type CardsPerMemberHistoryLazyQueryHookResult = ReturnType<typeof useCardsPerMemberHistoryLazyQuery>;
export type CardsPerMemberHistoryQueryResult = Apollo.QueryResult<CardsPerMemberHistoryQuery, CardsPerMemberHistoryQueryVariables>;