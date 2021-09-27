import { isDesktop } from '@trello/browser';
import { usesEnglish } from '@trello/locale';

export const isEligibleForExperiment = () => {
  return !isDesktop() && usesEnglish();
};
