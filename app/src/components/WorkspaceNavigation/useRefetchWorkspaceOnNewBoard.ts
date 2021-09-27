import { useEffect, useMemo } from 'react';
import { LiveUpdaterClient } from 'app/scripts/init/live-updater-client';
import { Callback } from 'app/scripts/init/live-updater';
import { throttle } from '@trello/time';
import { memberId } from '@trello/session-cookie';
import { useWorkspaceMemberQuery } from './WorkspaceMemberQuery.generated';

// eslint-disable-next-line @trello/no-module-logic
const client = new LiveUpdaterClient();

export const useRefetchWorkspaceOnNewBoard = (idWorkspace?: string | null) => {
  const { refetch } = useWorkspaceMemberQuery({
    variables: {
      memberId: memberId || '',
    },
  });

  const fiveMinutes = 5 * 60 * 1000;
  const throttledRefetch = useMemo(() => throttle(refetch, fiveMinutes), [
    refetch,
    fiveMinutes,
  ]);

  useEffect(() => {
    const onUpdate: Callback = (update) => {
      if (
        update.typeName === 'Action' &&
        !update.delta.deleted &&
        update.delta.type === 'addToOrganizationBoard' &&
        update.delta.data?.organization?.id === idWorkspace
      ) {
        // if the current user created the board, refetch immediately
        // a UI refresh will not feel jarring at that moment
        if (update.delta.idMemberCreator === memberId) {
          refetch();
        } else {
          throttledRefetch();
        }
      }
    };

    // listen for new boards added to organization
    // when encountered, refetch
    client.subscribe(onUpdate);
    return () => {
      client.unsubscribe(onUpdate);
      throttledRefetch.cancel();
    };
  }, [idWorkspace, refetch, throttledRefetch]);
};
