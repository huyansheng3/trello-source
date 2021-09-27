import React, { useEffect, useCallback, FunctionComponent } from 'react';
import { omit } from 'underscore';

import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { loadBoard } from 'app/gamma/src/modules/loaders/load-board';
import { State } from 'app/gamma/src/modules/types';
import { useSelector, useDispatch } from 'react-redux';
import { getBoardByShortLink } from 'app/gamma/src/selectors/boards';
import { BoardModel } from 'app/gamma/src/types/models';

import { KnownService, KnownServiceComponentProps } from './KnownService';

// eslint-disable-next-line @trello/less-matches-component
import styles from './KnownService.less';

interface OwnProps extends KnownServiceComponentProps {
  fullUrl: string;
  pathname: string;
  shortLink?: string;
}

interface StateProps {
  board?: BoardModel;
}

interface DispatchProps {
  loadBoard: () => void;
}

interface AllProps extends OwnProps, StateProps, DispatchProps {}

export const TrelloBoardComponentUnconnected = (props: AllProps) => {
  useEffect(() => {
    if (!props.board) {
      props.loadBoard();
    }
    // These actions should only run once on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { board, fullUrl, pathname, shortLink, ...rest } = props;
  const anchorProps = omit(rest, 'loadBoard');

  const fallbackUrl = shortLink ? `/b/${shortLink}` : pathname;
  const url = board && board.url && board.url ? board.url : fallbackUrl;
  const name = board && board.name ? board.name : fullUrl;

  return (
    <RouterLink
      {...anchorProps}
      href={url}
      className={styles.knownServiceLink}
      target=""
      rel=""
    >
      <img
        className={styles.knownServiceIcon}
        alt="Trello Icon"
        src={require('resources/images/services/trello.png')}
      />
      {name}
    </RouterLink>
  );
};

const TrelloBoardComponent: FunctionComponent<OwnProps> = ({
  shortLink,
  fullUrl,
  pathname,
}) => {
  const dispatch = useDispatch();
  const board = useSelector((state: State) =>
    getBoardByShortLink(state, shortLink || fullUrl),
  );
  const load = useCallback(() => {
    dispatch(loadBoard(shortLink || fullUrl));
  }, [dispatch, fullUrl, shortLink]);
  return (
    <TrelloBoardComponentUnconnected
      fullUrl={fullUrl}
      shortLink={shortLink}
      pathname={pathname}
      loadBoard={load}
      board={board}
    />
  );
};

export const TrelloBoard: KnownService<OwnProps> = {
  match: {
    protocol: location.protocol,
    host: location.host,
    pathname: new RegExp(`\
^\
/b/\
(\
[a-zA-Z0-9]{8}|\
[a-fA-F0-9]{24}\
)\
(?:$|/.*)\
`),
  },
  getMatchProps: ([fullUrl, pathname, shortLink]: string[]) => {
    return { fullUrl, pathname, shortLink };
  },
  Component: TrelloBoardComponent,
};
