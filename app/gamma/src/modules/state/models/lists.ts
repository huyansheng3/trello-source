/* eslint-disable import/no-default-export */
import { normalizeList } from 'app/gamma/src/api/normalizers/list';
import {
  LOAD_BOARD_SUCCESS,
  LoadBoardSuccessAction,
} from 'app/gamma/src/modules/loaders/load-board';
import {
  LOAD_CARD_SUCCESS,
  LoadCardSuccessAction,
} from 'app/gamma/src/modules/loaders/load-card';
import { CardResponse } from 'app/gamma/src/types/responses';
import { ListModel } from 'app/gamma/src/types/models';
import { createReducer } from '@trello/redux';
// Keys of a type T that can't have something of type U assigned to them
// KeysWithoutType<{a:string, b?:string, c:number}, undefined> returns 'a' | 'c'
// KeysWithoutType<{a:string, b:string, c:number}, string> returns 'c'
type KeysWithoutType<T, U> = {
  [K in keyof T]-?: U extends T[K] ? never : K;
}[keyof T];
// This is a subset of T that includes keys that are in K or
// which cannot be undefined
type HasRequiredKeys<T, K extends keyof T> = { [key in K]-?: T[key] } &
  { [key in KeysWithoutType<T, undefined>]: T[key] };
import { uniqBy } from '@trello/arrays';
import { PERFORM_SEARCH_SUCCESS, PerformSearchSuccessAction } from './search';

// Reducer
export type ListState = ListModel[];
const initialState: ListState = [];

export default createReducer(initialState, {
  [LOAD_BOARD_SUCCESS](state, { payload }: LoadBoardSuccessAction) {
    const { lists = [] } = payload;

    return uniqBy(
      state.concat(lists.map((list) => normalizeList(list))),
      (list) => list.id,
    );
  },

  [LOAD_CARD_SUCCESS](state, { payload }: LoadCardSuccessAction) {
    if (!payload.list) {
      return state;
    }

    return uniqBy(
      state.concat([normalizeList(payload.list)]),
      (list) => list.id,
    );
  },

  [PERFORM_SEARCH_SUCCESS](state, { payload }: PerformSearchSuccessAction) {
    const { cards = [] } = payload;

    const newLists = cards
      .filter(
        ({ list, idList }) =>
          list && !state.find((existingList) => existingList.id === idList),
      )
      .map((card: HasRequiredKeys<CardResponse, 'list'>) =>
        normalizeList(card.list),
      );

    return state.concat(newLists);
  },
});
