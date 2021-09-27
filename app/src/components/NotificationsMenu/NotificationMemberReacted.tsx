import { forTemplate, localizeCount } from '@trello/i18n';
import { Tooltip } from '@trello/nachos/tooltip';
import { State } from 'app/gamma/src/modules/types';
import { Joinn } from 'app/src/components/Joinn';
import React from 'react';
import { connect } from 'react-redux';
import { getMemberReactorsFullNames } from 'app/gamma/src/selectors/reactions';
import { ReactorsNames, AppCreatorModel } from 'app/gamma/src/types/models';
import { NotificationAppCreator } from './NotificationAppCreator';
import { NotificationDate } from './NotificationDate';

// eslint-disable-next-line @trello/less-matches-component
import styles from './NotificationMember.less';

const format = forTemplate('notification');

interface NotificationMemberReactedOwnProps {
  appCreator?: AppCreatorModel | null;
  boardId?: string;
  boardUrl?: string;
  cardId?: string;
  type?: string;
  idNotification: string;
  date?: Date;
  memberName?: string;
  idAction?: string;
  onClickNotification?: () => void;
}

interface NotificationMemberReactedStateProps {
  memberReactorsFullNames: ReactorsNames;
}

interface NotificationMemberReactedProps
  extends NotificationMemberReactedOwnProps,
    NotificationMemberReactedStateProps {}

const mapStateToProps = (
  state: State,
  ownProps: NotificationMemberReactedOwnProps,
) => {
  const { idAction = '' } = ownProps;

  return {
    memberReactorsFullNames: getMemberReactorsFullNames(state, idAction),
  };
};

export class NotificationMemberReactedUnconnected extends React.Component<NotificationMemberReactedProps> {
  render() {
    const {
      appCreator,
      boardId,
      boardUrl,
      cardId,
      type,
      idNotification = '',
      memberName,
      date,
      memberReactorsFullNames,
      onClickNotification,
    } = this.props;

    const numberOthersReacted = memberReactorsFullNames.length - 1;

    const memberNameComponent = (
      <strong key={idNotification} className={styles.memberName}>
        {memberName}
      </strong>
    );

    const reactorNames = memberReactorsFullNames.map((reactor) => (
      <span key={reactor.id}>{reactor.name}</span>
    ));

    const notificationNext =
      !numberOthersReacted || numberOthersReacted < 1
        ? format('member-reacted', {
            memberReactorName: memberNameComponent,
          })
        : format('member-and-others-reacted-to-you', {
            memberReactorName: memberNameComponent,
            membersOther: (
              <strong
                key={`${idNotification}:${numberOthersReacted}`}
                className={styles.memberName}
              >
                {localizeCount('others', numberOthersReacted)}
              </strong>
            ),
          });

    return (
      <div className={styles.memberReactors}>
        <Tooltip
          content={
            numberOthersReacted < 1 ? null : (
              <span className={styles.tooltipReactorNames}>
                <Joinn key="reactorNames" components={reactorNames} />
              </span>
            )
          }
        >
          <span onClick={onClickNotification} role="button">
            {memberName && notificationNext}
          </span>
        </Tooltip>
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

export const NotificationMemberReacted = connect(mapStateToProps)(
  NotificationMemberReactedUnconnected,
);
