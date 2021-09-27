import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { desktopVersion, clientVersion } from '@trello/config';
import {
  isBrowserSupported,
  isDesktop,
  asString,
  getLanguage,
} from '@trello/browser';
import type { ownershipAreas } from './ownershipAreas';
import { getMemberProperty } from './getMemberProperty';
import { getSessionId } from './getSessionId';
import { getChannel } from './getChannel';

interface NetworkErrorEventInput {
  status: number;
  response: string | object;
  url: string;
  operationName?: string;
  ownershipArea?: ownershipAreas;
}

interface NetworkErrorEventAttributes extends NetworkErrorEventInput {
  trelloSessionId: string;
  channel: string | null;
  clientVersion: string;
  isBrowserSupported: boolean;
  browser: string;
  isDesktop: boolean;
  desktopVersion: string;
  language: string;
  idMember?: string;
}

/**
 * Sends a network error event to GAS
 */
export const sendNetworkErrorEvent = async ({
  status,
  response,
  url,
  operationName,
  ownershipArea,
}: NetworkErrorEventInput) => {
  const attributes: NetworkErrorEventAttributes = {
    // input
    status,
    response,
    url,
    operationName,
    ownershipArea,

    // derived attributes
    trelloSessionId: getSessionId(),
    channel: await getChannel(),
    clientVersion,
    isBrowserSupported: isBrowserSupported(),
    browser: asString,
    isDesktop: isDesktop(),
    desktopVersion,
    language: getLanguage(),
    ...getMemberProperty(),
  };

  Analytics.sendOperationalEvent({
    action: 'failed',
    actionSubject: 'request',
    source: getScreenFromUrl(),
    attributes,
  });
};
