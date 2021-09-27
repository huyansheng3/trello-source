import { useReducer } from 'react';
import moment from 'moment';

import { localizeCount } from '@trello/i18n';
import {
  DropdownOption,
  Label,
  Member,
} from 'app/src/components/ViewsGenerics/types';

import { AddCardState, AddCardAction, List } from './types';

type CardTime = number | undefined;

const updateOptions = (
  options: DropdownOption[],
  selectedItem: DropdownOption,
  isMultiSelect: boolean = false,
) => {
  return options.map((item) =>
    item.value === selectedItem.value
      ? {
          ...item,
          isSelected: !item.isSelected,
        }
      : {
          ...item,
          isSelected: isMultiSelect && item.isSelected,
        },
  );
};

const updateDisplayText = (
  options: DropdownOption[],
  selectedItem: DropdownOption,
  isMultiSelect: boolean = false,
  defaultText: string,
  type: 'lists' | 'labels' | 'members',
): string => {
  if (!isMultiSelect) {
    return selectedItem.isSelected ? defaultText : selectedItem.label;
  }
  const selectedItems = options.filter(
    (item) => item.isSelected && item.value !== selectedItem.value,
  );
  const localizedString = `selected-count-${type}`;
  const count = selectedItems.length;
  if (selectedItem.isSelected) {
    if (count === 0) {
      return defaultText;
    } else if (count === 1) {
      return selectedItems[0].label || localizeCount(localizedString, 1);
    } else {
      return localizeCount(localizedString, count);
    }
  } else {
    if (count === 0) {
      return selectedItem.label || localizeCount(localizedString, 1);
    } else {
      return localizeCount(localizedString, count + 1);
    }
  }
};

export const addCardReducer = (state: AddCardState, action: AddCardAction) => {
  const calculateTime = (
    enabled: boolean,
    previousValue: CardTime,
    type: 'start' | 'due',
  ): CardTime => {
    if (!enabled) {
      return undefined;
    } else {
      let defaultDate = moment(previousValue);
      if (type === 'due') {
        if (state.startTime && state.startEnabled) {
          defaultDate = moment(state.startTime);
        }
        defaultDate.add(1, 'day');
      } else {
        if (state.dueTime && state.dueEnabled) {
          defaultDate = moment(state.dueTime);
          defaultDate.subtract(1, 'day');
        }
      }
      return defaultDate.valueOf();
    }
  };

  switch (action.type) {
    case 'start_date_updated':
      return {
        ...state,
        startTime: action.payload.time,
      };
    case 'due_date_updated':
      return {
        ...state,
        dueTime: action.payload.time,
      };
    case 'toggle_start':
      return {
        ...state,
        startEnabled: !state.startEnabled,
        startTime: calculateTime(!state.startEnabled, state.startTime, 'start'),
      };
    case 'toggle_due':
      return {
        ...state,
        dueEnabled: !state.dueEnabled,
        dueTime: calculateTime(!state.dueEnabled, state.dueTime, 'due'),
      };
    case 'list_selected':
      return {
        ...state,
        listOptions: updateOptions(state.listOptions, action.payload.item),
        listDisplayText: updateDisplayText(
          state.listOptions,
          action.payload.item,
          false,
          '',
          'lists',
        ),
      };
    case 'label_selected':
      return {
        ...state,
        labelOptions: updateOptions(
          state.labelOptions,
          action.payload.item,
          true,
        ),
        labelDisplayText: updateDisplayText(
          state.labelOptions,
          action.payload.item,
          true,
          '',
          'labels',
        ),
      };
    case 'member_selected':
      return {
        ...state,
        memberOptions: updateOptions(
          state.memberOptions,
          action.payload.item,
          true,
        ),
        memberDisplayText: updateDisplayText(
          state.memberOptions,
          action.payload.item,
          true,
          '',
          'members',
        ),
      };
    case 'title_updated':
      return {
        ...state,
        title: action.payload.title,
      };
    default:
      return state;
  }
};

interface UseViewsAddCardPopoverProps {
  startTime: number | undefined;
  dueTime: number | undefined;
  lists: List[];
  selectedListId?: string;
  labels?: Label[];
  selectedLabelId?: string;
  members?: Member[];
  selectedMemberId?: string;
}

const mapOption = (selectedId: string | undefined) => {
  const mapFunc = (item: Label | List | Member) => ({
    value: item.id,
    label: item.name,
    isSelected: item.id === selectedId,
  });
  return mapFunc;
};

export const useViewsAddCardPopover = ({
  startTime,
  dueTime,
  lists,
  selectedListId,
  labels = [],
  selectedLabelId,
  members = [],
  selectedMemberId,
}: UseViewsAddCardPopoverProps) => {
  const listOptions = lists.map(mapOption(selectedListId));
  const labelOptions = labels.map(mapOption(selectedLabelId));
  const memberOptions = members.map(mapOption(selectedMemberId));

  let listDisplayText = '';
  if (selectedListId) {
    listDisplayText =
      lists.find((list) => list.id === selectedListId)?.name || listDisplayText;
  }

  let labelDisplayText = '';
  if (selectedLabelId) {
    const selectedLabel = labels.find((label) => label.id === selectedLabelId);
    if (selectedLabel) {
      labelDisplayText =
        selectedLabel.name || localizeCount('selected-count-labels', 1);
    }
  }

  let memberDisplayText = '';
  if (selectedMemberId) {
    const selectedMember = members.find(
      (member) => member.id === selectedMemberId,
    );
    if (selectedMember) {
      memberDisplayText =
        selectedMember.name || localizeCount('selected-count-members', 1);
    }
  }
  const initialState = {
    title: '',
    startTime,
    dueTime: dueTime || moment().add(1, 'day').valueOf(),
    startEnabled: !!startTime,
    dueEnabled: true,
    listOptions,
    listDisplayText,
    labelOptions,
    labelDisplayText,
    memberOptions,
    memberDisplayText,
  } as AddCardState;
  const [state, dispatch] = useReducer(addCardReducer, initialState);

  return {
    state,
    dispatch,
  };
};
