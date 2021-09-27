import { ResolverContext } from '../types';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { getNetworkClient } from '../getNetworkClient';
import { token } from '@trello/session-cookie';
import { MutationUpdateMultipleEmailMembersPrimaryEmailArgs } from '../generated';

export const migrateEnterpriseToAtlassian = async (
  _parent: unknown,
  args: {
    idEnterprise: string;
  },
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/enterprises/${args.idEnterprise}/migrate`,
  );

  const response = await fetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      token: context.token || token,
    }),
  });

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, info);
};

export const updateMultipleEmailMembersPrimaryEmail = async (
  _parent: unknown,
  args: MutationUpdateMultipleEmailMembersPrimaryEmailArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/enterprises/${args.idEnterprise}/multiEmailMembers/primary`,
  );

  const response = await fetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      token: context.token || token,
      members: args.members,
    }),
  });

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const body = await response.json();

  return prepareDataForApolloCache(body, info);
};
