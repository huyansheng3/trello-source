import React, { useCallback } from 'react';
import { memberId } from '@trello/session-cookie';
import styles from './BoardClosed.less';
import { useReopenBoardMutation } from './ReopenBoardMutation.generated';
import { LazyWorkspaceChooser } from 'app/src/components/WorkspaceChooser';
import { Analytics } from '@trello/atlassian-analytics';
import { Spinner } from '@trello/nachos/spinner';
import { useBoardPermissionsAndDetailsQuery } from './BoardPermissionsAndDetailsQuery.generated';
import { forNamespace, localizeCount } from '@trello/i18n';
import { MemberAvatar } from 'app/src/components/MemberAvatar';
interface BoardClosedProps {
  boardId: string;
}

const f = forNamespace('closed board view');

export const BoardClosed: React.FC<BoardClosedProps> = ({ boardId }) => {
  const { data, loading } = useBoardPermissionsAndDetailsQuery({
    variables: { boardId },
  });

  const [reopenBoard] = useReopenBoardMutation();

  const onWorkspaceChosen = useCallback(
    async (orgId) => {
      try {
        await reopenBoard({
          variables: { boardId },
        });
        Analytics.sendTrackEvent({
          action: 'reopened',
          actionSubject: 'board',
          source: 'closedBoardScreen',
          containers: {
            board: {
              id: boardId,
            },
            organization: {
              id: orgId,
            },
          },
        });
      } catch {
        // To Do: error state
      }
    },
    [reopenBoard, boardId],
  );

  const boardName = data?.board?.name;
  const meMembership = data?.board?.memberships?.find(
    (membership) => membership.idMember === memberId,
  );

  const isBoardAdmin = meMembership?.memberType === 'admin';
  const isBoardMember = meMembership?.memberType === 'normal';
  const adminIdArray = data?.board?.memberships
    ?.filter((member) => member.memberType === 'admin')
    .map((member) => member.idMember);
  const adminData = data?.board?.members?.filter((member) => {
    return adminIdArray?.includes(member.id);
  });
  const adminCount = adminData?.length || 0;

  return (
    <div className={styles.container}>
      <div className={styles.closedModalContainer}>
        <div className={styles.closedModal}>
          {loading ? (
            <Spinner centered />
          ) : (
            <div>
              <h1 className={styles.headerText}>
                {f('board closed title', { boardName })}
              </h1>
              {isBoardAdmin ? (
                <>
                  <div className={styles.reopenButton}>
                    <LazyWorkspaceChooser
                      boardId={boardId}
                      buttonText={f('reopen cta')}
                      shouldFitContainer={false}
                      onSuccess={onWorkspaceChosen}
                    />
                  </div>
                  <div className={styles.deleteLink}>
                    <a className="quiet js-delete" href="#">
                      {f('permanently delete board')}
                    </a>
                  </div>
                </>
              ) : isBoardMember ? (
                <div>
                  <div>
                    <p className={styles.adminText}>
                      {localizeCount('contact board admins', adminCount)}
                    </p>
                    <div className={styles.adminSection}>
                      {adminData?.map((member) => (
                        <div key={member.id} className={styles.adminNames}>
                          <div className={styles.avatar}>
                            <MemberAvatar idMember={member.id} size={24} />
                          </div>
                          <div>{member.fullName}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
