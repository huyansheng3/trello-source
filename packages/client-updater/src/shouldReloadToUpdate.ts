/* eslint-disable @typescript-eslint/no-use-before-define */
import { getLocation } from '@trello/router';
import {
  isBoardRoute,
  isCardRoute,
  getRouteIdFromPathname,
  RouteId,
} from '@trello/routes';
import { oneDayInMs } from './constants';

export const startTime = Date.now();

export enum ReloadCheckResult {
  RELOAD,
  BOARD_TO_CARD_TRANSITION,
  CARD_TO_BOARD_TRANSITION,
  SHORTCUTS_OVERLAY_TRANSITION,
  NOT_TIME_YET,
}

export const shouldReloadToUpdate = (path: string) => {
  try {
    const currentRoute = getRouteIdFromPathname(getLocation().pathname);
    const nextRoute = getRouteIdFromPathname(path);

    return (
      getReloadCheckResult(currentRoute, nextRoute) === ReloadCheckResult.RELOAD
    );
  } catch (err) {
    return false;
  }
};

/**
 * Returns a reason to update or not. This could theoretically be a boolean
 * value, but using an enum of outcomes lets us unit test with confidence (each
 * return value is unique, which lets us avoid false negatives when testing each
 * possible branch of code).
 */
export const getReloadCheckResult = (
  currentRoute: RouteId,
  nextRoute: RouteId,
) => {
  if (isBoardRoute(currentRoute) && isCardRoute(nextRoute)) {
    return ReloadCheckResult.BOARD_TO_CARD_TRANSITION;
  }

  if (isCardRoute(currentRoute) && isBoardRoute(nextRoute)) {
    return ReloadCheckResult.CARD_TO_BOARD_TRANSITION;
  }

  if (nextRoute === RouteId.SHORTCUTS_OVERLAY) {
    return ReloadCheckResult.SHORTCUTS_OVERLAY_TRANSITION;
  }

  if (Date.now() - startTime <= oneDayInMs) {
    return ReloadCheckResult.NOT_TIME_YET;
  }

  // We should reload to pick up the latest version
  return ReloadCheckResult.RELOAD;
};
