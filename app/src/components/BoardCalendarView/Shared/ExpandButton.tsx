import React from 'react';
import cx from 'classnames';

import { forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { DownIcon } from '@trello/nachos/icons/down';
import { Tooltip } from '@trello/nachos/tooltip';

import styles from './ExpandButton.less';

const format = forTemplate('calendar-view');

interface ExpandButtonProps {
  expanded: boolean;
  handleExpand: () => void;
}

export const ExpandButton: React.FC<ExpandButtonProps> = ({
  expanded,
  handleExpand,
}) => {
  return (
    <div className={styles.expandButtonContainer}>
      <Button
        className={styles.expandButton}
        onClick={handleExpand}
        size="fullwidth"
        iconAfter={
          <Tooltip
            content={expanded ? format('show-less') : format('show-more')}
            position="top"
            hideTooltipOnMouseDown
          >
            <DownIcon
              size="small"
              dangerous_className={cx(
                styles.dropdownButtonIcon,
                expanded && styles.rotated,
              )}
            />
          </Tooltip>
        }
      />
    </div>
  );
};
