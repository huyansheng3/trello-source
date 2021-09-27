import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"GoldPremiumFreeTrialBanner"}}
export type GoldPremiumFreeTrialBannerQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type GoldPremiumFreeTrialBannerQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);


export const GoldPremiumFreeTrialBannerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GoldPremiumFreeTrialBanner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useGoldPremiumFreeTrialBannerQuery__
 *
 * To run a query within a React component, call `useGoldPremiumFreeTrialBannerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGoldPremiumFreeTrialBannerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGoldPremiumFreeTrialBannerQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGoldPremiumFreeTrialBannerQuery(baseOptions: Apollo.QueryHookOptions<GoldPremiumFreeTrialBannerQuery, GoldPremiumFreeTrialBannerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GoldPremiumFreeTrialBannerQuery, GoldPremiumFreeTrialBannerQueryVariables>(GoldPremiumFreeTrialBannerDocument, options);
      }
export function useGoldPremiumFreeTrialBannerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GoldPremiumFreeTrialBannerQuery, GoldPremiumFreeTrialBannerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GoldPremiumFreeTrialBannerQuery, GoldPremiumFreeTrialBannerQueryVariables>(GoldPremiumFreeTrialBannerDocument, options);
        }
export type GoldPremiumFreeTrialBannerQueryHookResult = ReturnType<typeof useGoldPremiumFreeTrialBannerQuery>;
export type GoldPremiumFreeTrialBannerLazyQueryHookResult = ReturnType<typeof useGoldPremiumFreeTrialBannerLazyQuery>;
export type GoldPremiumFreeTrialBannerQueryResult = Apollo.QueryResult<GoldPremiumFreeTrialBannerQuery, GoldPremiumFreeTrialBannerQueryVariables>;