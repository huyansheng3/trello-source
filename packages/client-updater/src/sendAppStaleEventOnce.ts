import { getStaleTime, sendAppStaleEvent } from './sendAppStaleEvent';

export const sendAppStaleEventOnce = (clearTimer: () => void) => {
  if (Date.now() > getStaleTime()) {
    sendAppStaleEvent();
    clearTimer();
  }
};
