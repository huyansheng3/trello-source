import { sendAppStaleEventOnce } from './sendAppStaleEventOnce';
import { tenMinutesInMs } from './constants';

export const initializeStaleEventTimer = () => {
  const timer = setInterval(() => {
    const clearTimer = () => {
      clearInterval(timer);
    };
    sendAppStaleEventOnce(clearTimer);
  }, tenMinutesInMs);
};
