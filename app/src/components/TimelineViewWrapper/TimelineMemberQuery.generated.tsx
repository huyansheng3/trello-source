import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"TimelineMember"}}
export type TimelineMemberQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TimelineMemberQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & { prefs?: Types.Maybe<(
      { __typename: 'Member_Prefs' }
      & Pick<Types.Member_Prefs, 'colorBlind'>
    )> }
  )> }
);


export const TimelineMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TimelineMember"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colorBlind"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useTimelineMemberQuery__
 *
 * To run a query within a React component, call `useTimelineMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useTimelineMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTimelineMemberQuery({
 *   variables: {
 *   },
 * });
 */
export function useTimelineMemberQuery(baseOptions?: Apollo.QueryHookOptions<TimelineMemberQuery, TimelineMemberQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TimelineMemberQuery, TimelineMemberQueryVariables>(TimelineMemberDocument, options);
      }
export function useTimelineMemberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TimelineMemberQuery, TimelineMemberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TimelineMemberQuery, TimelineMemberQueryVariables>(TimelineMemberDocument, options);
        }
export type TimelineMemberQueryHookResult = ReturnType<typeof useTimelineMemberQuery>;
export type TimelineMemberLazyQueryHookResult = ReturnType<typeof useTimelineMemberLazyQuery>;
export type TimelineMemberQueryResult = Apollo.QueryResult<TimelineMemberQuery, TimelineMemberQueryVariables>;