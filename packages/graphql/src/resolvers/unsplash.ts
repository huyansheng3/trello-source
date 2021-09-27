import { QueryUnsplashPhotosArgs } from '../generated';
import {
  QueryInfo,
  prepareDataForApolloCache,
} from '../prepareDataForApolloCache';
import { unsplashClient } from '@trello/unsplash';
import { JSONArray, ResolverContext } from '../types';

export const unsplashPhotosResolver = async (
  obj: object,
  args: QueryUnsplashPhotosArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const searchQuery = args?.query?.trim();
  const page = args?.page || undefined;
  const perPage = args?.perPage || undefined;

  const { response } = searchQuery
    ? await unsplashClient.search({
        query: searchQuery,
        perPage,
        page,
      })
    : await unsplashClient.getDefaultCollection({
        perPage,
        page,
      });

  return prepareDataForApolloCache(
    (response?.results as unknown) as JSONArray,
    info,
  );
};
