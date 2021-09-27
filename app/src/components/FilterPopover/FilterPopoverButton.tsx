import React, { Suspense, useCallback, useContext, useState } from 'react';
import cx from 'classnames';
import { getScreenFromUrl } from '@trello/atlassian-analytics';
import { forNamespace } from '@trello/i18n';
import { Key, Scope, useShortcut } from '@trello/keybindings';
import { Button, ButtonProps } from '@trello/nachos/button';
import { CloseIcon } from '@trello/nachos/icons/close';
import { FilterIcon } from '@trello/nachos/icons/filter';
import { Popover, usePopover, PopoverPlacement } from '@trello/nachos/popover';
import { useLazyComponent } from '@trello/use-lazy-component';
import { Feature } from 'app/scripts/debug/constants';
import { BoardViewContext } from 'app/src/components/BoardViewContext';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { ViewFiltersContext } from 'app/src/components/ViewFilters';
import type { CountableViewFilterParams } from 'app/src/components/ViewFilters';
import { FilterPopoverSkeleton } from './FilterPopoverSections/FilterPopoverSkeleton';
import { useFilterPopoverAnalytics } from './useFilterPopoverAnalytics';
import styles from './FilterPopoverButton.less';

const format = forNamespace('filter popover');

// Filters to skip when calculating active filters and clearing filters.
const SKIPPED_FILTERS: CountableViewFilterParams = ['boards', 'sort'];

interface FilterPopoverButtonProps {
  /**
   * State styling is manually applied within this component, as it's considered
   * "active" when any filters are applied. Appearance is referenced directly in
   * our LESS styles as a result.
   * @default 'default'
   */
  appearance?: Extract<
    ButtonProps['appearance'],
    'default' | 'transparent' | 'transparent-dark'
  >;
  /**
   * Supplemental classname applied to the button group. Use this for spacing
   * the FilterPopoverButton in context, not for styling internals if possible.
   */
  className?: string;
  isDisabled?: boolean;
}

export const FilterPopoverButton: React.FunctionComponent<FilterPopoverButtonProps> = ({
  appearance = 'default',
  className,
  isDisabled,
}) => {
  const Analytics = useFilterPopoverAnalytics();
  const { cardsData } = useContext(BoardViewContext);
  const { viewFilters } = useContext(ViewFiltersContext);

  const getCommonAttributes = useCallback(
    () => ({
      totalFilterLength: viewFilters.filters.totalFilterLength(SKIPPED_FILTERS),
    }),
    [viewFilters],
  );

  // Suspend the popover until it has been lazily loaded at least once.
  const [isPopoverPreloaded, _loadPopover] = useState(false);
  const loadPopover = useCallback(() => _loadPopover(true), [_loadPopover]);
  const FilterPopover = useLazyComponent(
    () => import(/* webpackChunkName: "filter-popover" */ './FilterPopover'),
    { namedImport: 'FilterPopover', preload: isPopoverPreloaded },
  );

  const { toggle, triggerRef, popoverProps } = usePopover<HTMLButtonElement>({
    size: 'large',
    onShow: () => {
      Analytics.sendScreenEvent({
        name: 'filterPopoverInlineDialog',
        attributes: getCommonAttributes(),
      });
    },
    onHide: () => {
      Analytics.sendClosedComponentEvent({
        componentType: 'inlineDialog',
        componentName: 'filterPopoverInlineDialog',
        source: getScreenFromUrl(),
        attributes: getCommonAttributes(),
      });
    },
    placement: PopoverPlacement.BOTTOM_END,
  });

  const togglePopover = useCallback(() => {
    loadPopover();
    // We only want open clicks; close clicks aren't very interesting.
    if (!popoverProps.isVisible) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'filterPopoverButton',
        source: getScreenFromUrl(),
        attributes: getCommonAttributes(),
      });
    }
    toggle();
  }, [
    Analytics,
    getCommonAttributes,
    loadPopover,
    popoverProps.isVisible,
    toggle,
  ]);

  useShortcut(togglePopover, { scope: Scope.BoardView, key: Key.f });

  const onClickClearFiltersButton = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'clearFiltersButton',
      source: getScreenFromUrl(),
      attributes: getCommonAttributes(),
    });
    viewFilters.editable && viewFilters.clearFilters(SKIPPED_FILTERS);
  }, [Analytics, viewFilters, getCommonAttributes]);

  const isFiltering = viewFilters.filters.isFiltering(SKIPPED_FILTERS);
  const isActive = popoverProps.isVisible || isFiltering;

  if (!viewFilters.editable) {
    return null;
  }

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-panorama',
        feature: Feature.ProjectBrita,
      }}
    >
      <div
        className={cx(styles.buttonGroup, className)}
        data-appearance={appearance}
      >
        <Button
          appearance={appearance}
          className={cx(
            styles.filterButton,
            styles[appearance],
            isActive && styles.isActive,
            isFiltering && styles.isFiltering,
          )}
          iconBefore={<FilterIcon size="small" />}
          isDisabled={isDisabled}
          onClick={togglePopover}
          onMouseEnter={loadPopover}
          ref={triggerRef}
        >
          {format('filter')}
          {isFiltering && (
            <span
              className={cx(
                styles.cardsCount,
                cardsData.isLoading && styles.customSpinner,
              )}
            >
              {!cardsData.isLoading && cardsData.total}
            </span>
          )}
        </Button>
        {isFiltering ? (
          <Button
            appearance={appearance}
            className={cx(styles.clearFiltersButton, styles[appearance])}
            iconBefore={<CloseIcon size="small" />}
            isDisabled={isDisabled}
            onClick={onClickClearFiltersButton}
          />
        ) : null}
      </div>
      {popoverProps.isVisible && (
        <Popover
          title={format('filter')}
          dontOverlapAnchorElement
          {...popoverProps}
        >
          <Suspense fallback={<FilterPopoverSkeleton />}>
            <FilterPopover viewFilters={viewFilters} />
          </Suspense>
        </Popover>
      )}
    </ErrorBoundary>
  );
};
