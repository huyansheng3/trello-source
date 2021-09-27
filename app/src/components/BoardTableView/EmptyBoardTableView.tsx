import React from 'react';
import { forTemplate } from '@trello/i18n';
import styles from './EmptyBoardTableView.less';

const boardPlaceHolder = require('resources/images/empty-states/mbtv-empty-state-board-placeholder.svg');

const format = forTemplate('multi_board_table_view', {
  returnBlankForMissingStrings: true,
});

interface EmptyBoardTableViewProps {
  headingString?: string;
  subHeadingString?: string;
}

// TODO This component is used by other views besides Table
// View, so it should be placed in a more generic folder
// instead of `/BoardTableView with a more generic sounding
// component name. Since it's being replaced in the
// future, it didn't seem worth it to move it and rename it
export const EmptyBoardTableView: React.FunctionComponent<EmptyBoardTableViewProps> = ({
  headingString = 'add-boards-to-create',
  subHeadingString = 'your-team-table-can-help',
}) => (
  <div className={styles.empty}>
    <img
      src={boardPlaceHolder}
      className={styles.emptyBoardPlaceholder}
      alt=""
    />
    <div className={styles.message}>
      <h2 className={styles.heading}>{format(headingString)}</h2>
      <div className={styles.subheading}>{format(subHeadingString)}</div>
    </div>
  </div>
);
