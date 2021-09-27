import { memberId } from '@trello/session-cookie';
import { dateComparator } from './dateComparator';
import { useRecentBoardsDetailQuery } from './RecentBoardsDetailQuery.generated';
import {
  RecentBoardsSlimQuery,
  useRecentBoardsSlimQuery,
} from './RecentBoardsSlimQuery.generated';

export class MissingRecentBoardsSlimDataError extends Error {
  constructor() {
    const message = 'Failed to load data from useRecentBoardsSlimQuery';
    super(message);
    this.name = 'MissingRecentBoardsSlimError';
  }
}

export class MissingRecentBoardsDetailDataError extends Error {
  constructor() {
    const message = 'Failed to load data from useRecentBoardsDetailQuery';
    super(message);
    this.name = 'MissingRecentBoardsDetailError';
  }
}

const sortByDateLastViewedAndLimit = ({
  boards,
}: {
  boards: NonNullable<RecentBoardsSlimQuery['member']>['boards'];
}) => {
  const MAX_RECENT_BOARDS = 8;

  return boards
    .filter((board) => !board.closed && !!board.dateLastView)
    .sort(dateComparator)
    .slice(0, MAX_RECENT_BOARDS);
};

interface UseRecentBoardsProps {
  skip?: boolean;
}

export const useRecentBoards = (props?: UseRecentBoardsProps) => {
  const {
    data: dataRecentBoardsSlim,
    loading: loadingRecentBoardsSlim,
    error: errorRecentBoardsSlim,
    refetch,
  } = useRecentBoardsSlimQuery({
    variables: {
      memberId: memberId || '',
    },
    skip: props?.skip,
  });

  const recentBoardsSlim = sortByDateLastViewedAndLimit({
    boards: dataRecentBoardsSlim?.member?.boards || [],
  });

  const {
    data: dataRecentBoardsDetail,
    loading: loadingRecentBoardsDetail,
    error: errorRecentBoardsDetail,
  } = useRecentBoardsDetailQuery({
    variables: {
      idBoards: recentBoardsSlim.map((board) => board.id),
    },
    skip: !dataRecentBoardsSlim?.member?.boards,
  });

  if (loadingRecentBoardsSlim || loadingRecentBoardsDetail) {
    return { loading: true, refetch };
  }

  if (errorRecentBoardsSlim || errorRecentBoardsDetail) {
    return { error: errorRecentBoardsSlim || errorRecentBoardsDetail, refetch };
  }

  /*
    There is a known issue where our Apollo/GraphQL implementation returns
    undefined for data, loading, and error. We create a specific instance
    of error in these cases, so that we can report it as a non-error
    operational event.
  */
  if (!dataRecentBoardsSlim?.member || !dataRecentBoardsDetail?.boards) {
    if (!dataRecentBoardsSlim?.member) {
      return { error: new MissingRecentBoardsSlimDataError(), refetch };
    } else {
      return { error: new MissingRecentBoardsDetailDataError(), refetch };
    }
  }

  return {
    data: {
      boards: dataRecentBoardsDetail?.boards,
      boardStars: dataRecentBoardsSlim?.member?.boardStars,
    },
    refetch,
  };
};
