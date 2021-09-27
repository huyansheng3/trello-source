import React from 'react';
import { AppCreatorModel } from 'app/gamma/src/types/models';
import { NotificationAppCreator } from './NotificationAppCreator';
import { NotificationDate } from './NotificationDate';

// eslint-disable-next-line @trello/less-matches-component
import styles from './NotificationMember.less';

interface NotificationMemberNameProps {
  appCreator?: AppCreatorModel | null;
  boardId?: string;
  boardUrl?: string;
  cardId?: string;
  type?: string;
  date?: Date;
  memberName?: string;
  onClickNotification?: () => void;
}

export class NotificationMemberName extends React.Component<NotificationMemberNameProps> {
  render() {
    const {
      appCreator,
      boardId,
      boardUrl,
      cardId,
      type,
      memberName,
      date,
      onClickNotification,
    } = this.props;

    return (
      <div>
        <strong
          className={styles.memberName}
          onClick={onClickNotification}
          role="button"
        >
          {memberName}
        </strong>
        {date && <NotificationDate date={date} className={styles.memberDate} />}
        {date && appCreator && appCreator?.name && (
          <NotificationAppCreator
            appCreator={appCreator}
            boardId={boardId}
            boardUrl={boardUrl}
            cardId={cardId}
            type={type}
          />
        )}
      </div>
    );
  }
}
