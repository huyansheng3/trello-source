import Backbone from '@trello/backbone';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { defaultRouter } from 'app/src/router';
import { Controller } from 'app/scripts/controller';
import { navigate } from 'app/scripts/controller/navigate';
import { ModelCache } from 'app/scripts/db/model-cache';

import { CardFilter } from 'app/scripts/view-models/card-filter';

import {
  ViewFiltersContext,
  ViewFiltersContextValue,
  ViewFiltersSourceEditable,
} from './ViewFiltersContext';

import { ViewFilters } from './ViewFilters';
import {
  MembersFilter,
  LabelsFilter,
  DueFilter,
  TitleFilter,
  BoardDueFilterString,
  CompleteFilter,
  BoardTableViewFilter,
} from './filters';
import { FilterMode } from './types';

import { ID_NONE, NO_LABELS } from 'app/common/lib/util/satisfies-filter';
interface BoardFilterType {
  idLabels?: string[];
  idMembers?: string[];
  due?: BoardDueFilterString;
  overdue?: boolean;
  dueComplete?: boolean;
  mode?: string;
  title?: string;
}

const updateBoardFilterFromViewsFilter = (
  idBoard: string,
  viewsFilter: ViewFilters,
) => {
  const board = ModelCache.get('Board', idBoard);

  const boardFilter = board?.filter;

  const newFilterArr = Object.entries(viewsFilter.toQueryParams());

  boardFilter?.clear();

  newFilterArr.forEach(([key, value]) => {
    switch (key) {
      case 'idMembers':
        {
          const idMembersArr = value?.split(',');

          idMembersArr?.forEach((member) => {
            boardFilter?.addIdMember(member);
          });
        }
        break;
      case 'labels': {
        const labelsArr = value?.split(',');
        const labelsList = board?.labelList.models;
        const labelsObj: {
          [key: string]: string;
        } = {};

        labelsList?.forEach((label) => {
          const labelColor = label.get('color');
          const labelName = label.get('name');

          const labelString = labelName
            ? `${labelColor}:${labelName}`
            : labelColor;
          const labelID = label.get('id');

          labelsObj[labelString] = labelID;
        });

        labelsArr?.forEach((label) => {
          if (label === 'none') {
            return boardFilter?.addIdLabel(ID_NONE);
          }
          const labelID = labelsObj[label];
          boardFilter?.addIdLabel(labelID);
        });
        break;
      }
      case 'due':
        {
          const [rangeOrOverdueString, overdueString] = value?.split(',') || [];
          const isOverdueString =
            overdueString === 'overdue' ||
            (!overdueString && rangeOrOverdueString === 'overdue');
          const rangeString =
            rangeOrOverdueString !== 'overdue' ? rangeOrOverdueString : null;

          boardFilter?.set('overdue', isOverdueString);

          if (rangeString) {
            boardFilter?.set('due', rangeString);
          }
        }
        break;
      case 'dueComplete':
        {
          if (value === 'true') {
            boardFilter?.set(key, true);
            break;
          }
          if (value === 'false') {
            boardFilter?.set(key, false);
            break;
          }
        }
        break;
      case 'title':
      case 'mode':
        boardFilter?.set(key, value);
        break;
      default:
        break;
    }
  });
};

export const useInitialUrlFilters = (idBoard: string) => {
  useEffect(() => {
    // First check if we have params in the URL to populate
    const queryParams =
      Object.fromEntries(new URLSearchParams(location.search).entries()) || {};
    const urlFilter = ViewFilters.fromQueryParams(queryParams);

    if (urlFilter.isFiltering()) {
      updateBoardFilterFromViewsFilter(idBoard, urlFilter);
    }
  }, [idBoard]);
};

export const useBoardFiltersFromModelCache = (idBoard: string) => {
  const board = ModelCache.get('Board', idBoard);
  const modelCacheBoardFilters = board?.filter;

  const [boardFilters, setBoardFilters] = useState<BoardFilterType>(
    modelCacheBoardFilters ? modelCacheBoardFilters.toJSON() : {},
  );

  useEffect(() => {
    const onBoardFilterChange = (newBoardFilter: CardFilter) => {
      setBoardFilters(newBoardFilter.toJSON());
    };

    Backbone.Events.listenTo(
      modelCacheBoardFilters,
      'change:title change:idLabels change:idMembers change:due change:overdue change:dueComplete change:mode',
      onBoardFilterChange,
    );

    return () => {
      Backbone.Events.stopListening(
        modelCacheBoardFilters,
        'change:title change:idLabels change:idMembers change:due change:overdue change:dueComplete change:mode',
        onBoardFilterChange,
      );
    };
  }, [modelCacheBoardFilters]);

  return boardFilters;
};

export const parseBoardFilterObject = ({
  idLabels,
  idMembers,
  due,
  overdue,
  dueComplete,
  mode,
  title,
}: BoardFilterType): ViewFilters => {
  const members = new MembersFilter();

  if (idMembers) {
    idMembers.forEach((member) => {
      members.toggle(member);
    });
  }

  const labels = new LabelsFilter();
  if (idLabels) {
    idLabels.forEach((idLabel) => {
      if (idLabel === ID_NONE) {
        labels.toggle(NO_LABELS, NO_LABELS);
      }

      const label = ModelCache.get('Label', idLabel);

      if (label) {
        const color = label.get('color');
        const name = label.get('name');
        labels.toggle(color, name);
      }
    });
  }

  const dueFilter = new DueFilter();

  if (due) {
    dueFilter.fromBoardString(due);
  }

  if (overdue) {
    dueFilter.setOverdue(true);
  }

  if (dueComplete === true) {
    dueFilter.setCompleteFilter(CompleteFilter.Complete);
  } else if (dueComplete === false) {
    dueFilter.setCompleteFilter(CompleteFilter.Incomplete);
  }

  const titleFilter = new TitleFilter();
  if (title) {
    titleFilter.setTitle(title);
  }

  let modeFilter = undefined;
  if (mode) {
    if (mode === 'and') {
      modeFilter = FilterMode.And;
    }
  }

  return new ViewFilters({
    members,
    labels,
    due: dueFilter,
    title: titleFilter,
    mode: modeFilter,
  });
};

export const navigateToUrlFromFilterChange = (viewsFilters: ViewFilters) => {
  const routeContext = defaultRouter.getRoute();

  if (!routeContext?.url) {
    return;
  }

  const newUrlParams = viewsFilters.toQueryParams();
  const newUrl = new URL(routeContext.url.origin + routeContext.url.pathname);

  for (const [key, value] of Object.entries(newUrlParams)) {
    if (value) {
      newUrl.searchParams.set(key, value);
    }
  }

  if (routeContext.url.toString() === newUrl.toString()) {
    return;
  }

  // Hack: The URL api auto-encodes commas and colons, but we want to use "invalid" urls
  // with `,` and `:` characters in them.
  const search = newUrl.search.replace(/%2C/g, ',').replace(/%3A/g, ':');

  navigate(`${newUrl.pathname}${search}`, { replace: true });
  defaultRouter.updateSubscribers();
};

interface SingleBoardViewFiltersProviderProps {
  idBoard: string;
}

export const SingleBoardViewFiltersProvider: React.FC<SingleBoardViewFiltersProviderProps> = ({
  children,
  idBoard,
}) => {
  useInitialUrlFilters(idBoard);

  const boardFilters = useBoardFiltersFromModelCache(idBoard);

  const viewsFilters = useMemo(() => parseBoardFilterObject(boardFilters), [
    boardFilters,
  ]);

  useEffect(() => {
    if (Controller.showingBoardView()) {
      navigateToUrlFromFilterChange(viewsFilters);
    }
  }, [viewsFilters]);

  const setFilter = useCallback(
    (filter: BoardTableViewFilter) => {
      const board = ModelCache.get('Board', idBoard);
      const boardFilter = board?.filter;

      if (!boardFilter || !filter.serializeToBackboneFilter) {
        return;
      }

      const backboneFilterCriteria = filter.serializeToBackboneFilter(board);
      for (const key in backboneFilterCriteria) {
        boardFilter.set(
          key,
          backboneFilterCriteria[key as keyof typeof backboneFilterCriteria],
        );
      }
    },
    [idBoard],
  );

  const clearFilters = useCallback(() => {
    const board = ModelCache.get('Board', idBoard);
    board?.filter.clear();
  }, [idBoard]);

  const providerValue: ViewFiltersContextValue<ViewFiltersSourceEditable> = {
    viewFilters: {
      contextType: 'singleBoard',
      filters: viewsFilters,
      editable: true,
      setFilter,
      clearFilters,
    },
  };

  return (
    <ViewFiltersContext.Provider value={providerValue}>
      {children}
    </ViewFiltersContext.Provider>
  );
};
