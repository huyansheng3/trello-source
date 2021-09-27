import React from 'react';
import { forTemplate } from '@trello/i18n';
import { ClosedBoardUpsellMessaging } from 'app/src/components/UpgradePathAudit/ClosedBoardUpsellMessaging';
const format = forTemplate('board_closed', { shouldEscapeStrings: false });

interface BoardClosedProps {
  name?: string;
  deleting?: boolean;
  canReopen?: boolean;
  canDelete?: boolean;
  isDesktop?: boolean;
  isAtOrOverLimit?: boolean;
  orgName?: string;
  orgId?: string;
  billingUrl?: string;
}

export const DefaultBoardClosedView: React.FC<BoardClosedProps> = ({
  name,
  deleting,
  canReopen,
  canDelete,
  isDesktop,
  isAtOrOverLimit,
  orgName,
  orgId,
  billingUrl,
}) => {
  return (
    <div>
      <div className="big-message quiet closed-board">
        <h1>{format('name-is-closed', { name })}</h1>
        {deleting
          ? format('deleting')
          : [
              isAtOrOverLimit ? (
                <p className="messaging" key="messaging">
                  {isDesktop || !orgName || !billingUrl ? (
                    format('cannot-reopen-board-limit-reached-desktop')
                  ) : (
                    <ClosedBoardUpsellMessaging
                      orgId={orgId || ''}
                      teamName={orgName}
                    />
                  )}
                </p>
              ) : !canReopen && !canDelete ? (
                <p className="messaging" key="messaging">
                  {format(
                    'you-re-a-member-of-this-board-but-only-board-admins-are-able-to-re-open-it',
                  )}
                </p>
              ) : null,
              canReopen && !isAtOrOverLimit ? (
                <p key="reopen">
                  <a className="js-reopen" href="#">
                    {format('reopen')}
                  </a>
                </p>
              ) : null,
              canDelete ? (
                <p className="delete-container" key="delete">
                  <a className="quiet js-delete" href="#">
                    {format('permanently-delete-board')}
                  </a>
                </p>
              ) : null,
            ]}
      </div>
    </div>
  );
};
