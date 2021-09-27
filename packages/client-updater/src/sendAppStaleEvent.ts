import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { startTime } from './shouldReloadToUpdate';
import { oneDayInMs } from './constants';

export const getStaleTime = () => {
  return startTime + oneDayInMs * 4;
};

export const sendAppStaleEvent = () => {
  Analytics.sendOperationalEvent({
    action: 'exceeded',
    actionSubject: 'app',
    attributes: {
      reason: '96 hour uptime exceeded',
    },
    source: getScreenFromUrl(),
  });
};
