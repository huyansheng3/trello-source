import { client, deserializeJSONString } from '@trello/graphql';
import API from 'app/gamma/src/api';
import { Action, actionCreator } from '@trello/redux';
import { featureFlagClient } from '@trello/feature-flag-client';

import { BoardResponse } from 'app/gamma/src/types/responses';
import { StandardThunkAction, Dispatch } from 'app/gamma/src/types';
import { BOARD_FIELDS, CARD_FIELDS_MINIMAL } from './fields';
import { State } from 'app/gamma/src/modules/types';
import { LoadBoardDocument, LoadBoardQuery } from './LoadBoardQuery.generated';

// Action types
export const LOAD_BOARD_REQUEST = Symbol('loaders/LOAD_BOARD_REQUEST');
export const LOAD_BOARD_SUCCESS = Symbol('loaders/LOAD_BOARD_SUCCESS');
export const LOAD_BOARD_ERROR = Symbol('loaders/LOAD_BOARD_ERROR');

export type LoadBoardRequestAction = Action<typeof LOAD_BOARD_REQUEST, string>;
export type LoadBoardSuccessAction = Action<
  typeof LOAD_BOARD_SUCCESS,
  BoardResponse
>;
export type LoadBoardErrorAction = Action<typeof LOAD_BOARD_ERROR, Error>;

// Action creators
const loadBoardRequest = actionCreator<LoadBoardRequestAction>(
  LOAD_BOARD_REQUEST,
);
export const loadBoardSuccess = actionCreator<LoadBoardSuccessAction>(
  LOAD_BOARD_SUCCESS,
);
const loadBoardError = actionCreator<LoadBoardErrorAction>(LOAD_BOARD_ERROR);

const BOARD_ACTIONS = [
  'addAttachmentToCard',
  'addChecklistToCard',
  'addMemberToBoard',
  'addMemberToCard',
  'addToOrganizationBoard',
  'commentCard',
  'convertToCardFromCheckItem',
  'copyBoard',
  'copyCard',
  'copyCommentCard',
  'createBoard',
  'createCard',
  'createList',
  'deleteAttachmentFromCard',
  'deleteCard',
  'disablePlugin',
  'disablePowerUp',
  'emailCard',
  'enablePlugin',
  'enablePowerUp',
  'makeAdminOfBoard',
  'makeNormalMemberOfBoard',
  'makeObserverOfBoard',
  'moveCardFromBoard',
  'moveCardToBoard',
  'moveListFromBoard',
  'moveListToBoard',
  'removeChecklistFromCard',
  'removeFromOrganizationBoard',
  'removeMemberFromCard',
  'unconfirmedBoardInvitation',
  'unconfirmedOrganizationInvitation',
  'updateBoard',
  'updateCard:closed',
  'updateCard:due',
  'updateCard:idList',
  'updateCheckItemStateOnCard',
  'updateList:closed',
];

export const loadBoard = (boardIdentifier: string): StandardThunkAction => {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch(loadBoardRequest(boardIdentifier));
    const useGraphQL = featureFlagClient.get(
      'fep.use-graphql-for-board-loader',
      false,
    );

    if (useGraphQL) {
      const { data, error } = await client.query({
        query: LoadBoardDocument,
        variables: {
          id: boardIdentifier,
        },
        fetchPolicy: 'network-only',
      });
      if (error) {
        dispatch(loadBoardError(error));
      } else {
        const board: LoadBoardQuery['board'] = data.board;
        if (!board) {
          return;
        }
        const dataToDispatch = {
          ...board,
          actions: board.actions.map((action) => ({
            ...action,
            data: deserializeJSONString(action.data),
            display: {
              ...action.display,
              entities: deserializeJSONString(action.display.entities),
            },
            limits:
              action.type === 'commentCard'
                ? { reactions: board.limits.reactions }
                : {},
          })),
        };
        // TODO: Subscribe to the board socket updates

        // Casting as any here is a result of converting the fetching of data from a
        // Gamma network call (explicit types) to an Apollo GraphQL call (looser types)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(loadBoardSuccess(dataToDispatch as any));
      }
    } else {
      try {
        const board = await API.client.rest.get<BoardResponse>(
          `boards/${boardIdentifier}`,
          {
            query: {
              actions: BOARD_ACTIONS,
              actions_display: true,
              actions_limit: 50,
              cards: 'visible',
              card_attachments: true,
              card_fields: CARD_FIELDS_MINIMAL,
              fields: BOARD_FIELDS,
              labels: 'all',
              labels_limit: 1000,
              lists: 'open',
              members: 'all',
              memberships: 'all',
              organization: true,
              organization_memberships: 'all',
            },
          },
        );

        // TODO: Subscribe to the board socket updates

        dispatch(loadBoardSuccess(board));
      } catch (err) {
        dispatch(loadBoardError(err));
      }
    }
  };
};
