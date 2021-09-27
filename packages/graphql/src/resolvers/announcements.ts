import {
  QueryAnnouncementsArgs,
  MutationDismissAnnouncementArgs,
} from '../generated';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import { token } from '@trello/session-cookie';
import { trelloFetch, fetch } from '@trello/fetch';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { ResolverContext } from '../types';
import { getNetworkClient } from '../getNetworkClient';
import { parseNetworkError } from '@trello/graphql-error-handling';

export const announcementsResolver = async (
  _parent: unknown,
  args: QueryAnnouncementsArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl =
    args && args.filter === 'all'
      ? networkClient.getUrl('/announcements/all')
      : networkClient.getUrl('/announcements');
  const response = await trelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Announcements',
      operationName: context.operationName,
    },
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });

    throw await parseNetworkError(response);
  }

  const announcements = await response.json();

  return prepareDataForApolloCache(announcements, info);
};

export const dismissAnnouncement = async (
  _obj: object,
  args: MutationDismissAnnouncementArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(networkClient.getUrl('/announcements/dismiss'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      id: args.announcementId,
      token: context.token || token,
    }),
    credentials: 'include',
  });

  return prepareDataForApolloCache({ success: response.ok }, info);
};
