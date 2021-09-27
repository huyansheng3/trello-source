import { memberId } from '@trello/session-cookie';
import {
  useStarredBoardsQuery,
  StarredBoardsQuery,
} from './StarredBoardsQuery.generated';
import { useBoardStarsQuery } from './BoardStarsQuery.generated';

interface BoardStar {
  id: string;
  idBoard: string;
  pos: number;
}

type BoardWithStar = StarredBoardsQuery['boards'][number] & {
  idBoardStar: string;
  pos: number;
};

function getOpenBoardsWithStars({
  boardStars,
  boards,
}: {
  boardStars: BoardStar[];
  boards: StarredBoardsQuery['boards'];
}) {
  const idBoardToBoard = new Map(boards.map((board) => [board.id, board]));

  return boardStars.reduce((acc: BoardWithStar[], boardStar: BoardStar) => {
    const board = idBoardToBoard.get(boardStar.idBoard);
    if (board && !board.closed) {
      acc.push({
        ...board,
        idBoardStar: boardStar.id,
        pos: boardStar.pos,
      });
    }
    return acc;
  }, []);
}

export class MissingBoardStarsDataError extends Error {
  constructor() {
    const message = 'Failed to load data from useBoardStarsQuery';
    super(message);
    this.name = 'MissingBoardStarsDataError';
  }
}
export class MissingStarredBoardsDataError extends Error {
  constructor() {
    const message = 'Failed to load data from useStarredBoardsQuery';
    super(message);
    this.name = 'MissingStarredBoardsDataError';
  }
}

interface UseStarredBoardsProps {
  skip?: boolean;
}

/*
  Our Apollo/GraphQL implementation does not support real-time updates
  for boards filtered on 'starred' as of Sept-2021: https://hello.atlassian.net/wiki/spaces/TRELLOFE/pages/1225107180/Trello+Front+End+GraphQL+support+matrix+for+real-time+updates+of+filtered+list
  To get around that we de-normalize on the member -> boardStars prop.
  To avoid overfetching, we first fetch the boardStars and then fetch
  only boards that are starred.
*/

export const useStarredBoards = (props?: UseStarredBoardsProps) => {
  const {
    data: dataBoardStars,
    error: errorBoardStars,
    loading: loadingBoardStars,
    refetch,
  } = useBoardStarsQuery({
    variables: {
      memberId: memberId || '',
    },
    skip: props?.skip,
  });

  const {
    data: dataStarredBoards,
    error: errorStarredBoards,
    loading: loadingStarredBoards,
  } = useStarredBoardsQuery({
    variables: {
      idBoards:
        dataBoardStars?.member?.boardStars.map((star) => star.idBoard) || [],
    },
    skip: !dataBoardStars?.member?.boardStars,
  });

  if (loadingBoardStars || loadingStarredBoards) {
    return { loading: true, refetch };
  }

  if (errorBoardStars || errorStarredBoards) {
    return { error: errorBoardStars || errorStarredBoards, refetch };
  }

  /*
    There is a known issue where our Apollo/GraphQL implementation returns
    undefined for data, loading, and error. We create a specific instance
    of error in these cases, so that we can report it as a non-error
    operational event.
  */
  if (!dataBoardStars?.member || !dataStarredBoards?.boards) {
    if (!dataBoardStars?.member) {
      return { error: new MissingBoardStarsDataError(), refetch };
    } else {
      return { error: new MissingStarredBoardsDataError(), refetch };
    }
  }

  const openBoardsWithStars = getOpenBoardsWithStars({
    boards: dataStarredBoards.boards,
    boardStars: dataBoardStars.member.boardStars,
  });

  return { boards: openBoardsWithStars, refetch };
};
