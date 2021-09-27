import { SharedState } from '@trello/shared-state';

export interface LocationState {
  hostname: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
}

const { pathname, search, hash, hostname, origin } = window.location;
export const locationState = new SharedState<LocationState>({
  hostname,
  pathname,
  search,
  hash,
  origin,
});
