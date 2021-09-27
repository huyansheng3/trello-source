/* eslint-disable import/no-default-export */
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadHeader } from 'app/gamma/src/modules/loaders/load-header';
import { State } from 'app/gamma/src/modules/types';
import { getMe } from 'app/gamma/src/selectors/members';
import {
  getMyId,
  isLoggedIn as isLoggedInSelector,
} from 'app/gamma/src/selectors/session';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';

import Header from './header';

import { addSubscription } from 'app/scripts/init/subscriber';

export const HeaderContainer = () => {
  const dispatch = useDispatch();
  const { myId, isLoggedIn, me } = useSelector((state: State) => {
    return {
      myId: getMyId(state),
      isLoggedIn: isLoggedInSelector(state),
      me: getMe(state),
    };
  });

  const loadHeaderData = useCallback((id) => dispatch(loadHeader(id)), [
    dispatch,
  ]);

  useEffect(() => {
    if (myId) {
      return addSubscription({
        modelType: 'Member',
        idModel: myId,
        tags: ['messages', 'updates'],
      });
    }
  }, [myId]);

  useEffect(() => {
    if (myId) {
      loadHeaderData(myId);
    }
  }, [loadHeaderData, myId]);

  return <Header isLoggedIn={isLoggedIn} me={me} />;
};

const WithProviders: React.FunctionComponent = () => {
  return (
    <ComponentWrapper>
      <HeaderContainer />
    </ComponentWrapper>
  );
};

export default WithProviders;
