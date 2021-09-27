import { useContext, useMemo } from 'react';
import type { UIEvent } from '@atlassiansox/analytics-web-client';
import {
  Analytics,
  SourceType,
  formatContainers,
  getScreenFromUrl,
} from '@trello/atlassian-analytics';
import { BoardViewContext } from 'app/src/components/BoardViewContext';
import { ViewFiltersContext } from 'app/src/components/ViewFilters';

// Most usages set source to `filterPopoverInlineDialog`, so make it optional.
type OptionalSource<T extends { source: SourceType }> = Omit<T, 'source'> &
  Partial<Pick<T, 'source'>>;

/**
 * Convenience hook for FilterPopover events; wraps Analytics helper functions
 * with common values derived from BoardViewContext and ViewFiltersContext.
 *
 * @example
 * const Analytics = useFilterPopoverAnalytics();
 * Analytics.sendScreenEvent({ name: 'filterPopoverInlineDialog' });
 */
export const useFilterPopoverAnalytics = () => {
  const { idBoard, idOrg: idOrganization } = useContext(BoardViewContext);
  const { viewFilters } = useContext(ViewFiltersContext);

  return useMemo<{
    sendScreenEvent: typeof Analytics.sendScreenEvent;
    sendClosedComponentEvent: typeof Analytics.sendClosedComponentEvent;
    sendClickedButtonEvent: (
      e: OptionalSource<Parameters<typeof Analytics.sendClickedButtonEvent>[0]>,
    ) => void;
    sendToggledFilterEvent: (
      e: {
        filterType:
          | 'boardsFilter'
          | 'dueFilter'
          | 'labelsFilter'
          | 'listFilter'
          | 'membersFilter';
        isChecked: boolean;
      } & Pick<UIEvent, 'attributes'>,
    ) => void;
  }>(() => {
    const commonAttributes = {
      screen: getScreenFromUrl(),
      viewFiltersContextType: viewFilters.contextType,
    };
    const containers = formatContainers({ idBoard, idOrganization });
    return {
      sendScreenEvent: ({ attributes, ...props }) =>
        Analytics.sendScreenEvent({
          attributes: { ...commonAttributes, ...attributes },
          containers,
          ...props,
        }),
      sendClosedComponentEvent: ({ attributes, ...props }) =>
        Analytics.sendClosedComponentEvent({
          attributes: { ...commonAttributes, ...attributes },
          containers,
          ...props,
        }),
      sendClickedButtonEvent: ({ attributes, ...props }) =>
        Analytics.sendClickedButtonEvent({
          source: 'filterPopoverInlineDialog',
          attributes: { ...commonAttributes, ...attributes },
          containers,
          ...props,
        }),
      sendToggledFilterEvent: ({
        filterType,
        isChecked,
        attributes,
        ...props
      }) =>
        Analytics.sendUIEvent({
          action: isChecked ? 'checked' : 'unchecked',
          actionSubject: 'filter',
          actionSubjectId: filterType,
          source: 'filterPopoverInlineDialog',
          attributes: { ...commonAttributes, ...attributes },
          containers,
          ...props,
        }),
    };
  }, [idBoard, idOrganization, viewFilters.contextType]);
};
