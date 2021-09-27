import React from 'react';
import styles from './BoardTileDropdownWrapper.less';

interface BoardTileDropdownWrapperProps {
  dataTestId?: string;
}

export const BoardTileDropdownWrapper: React.FunctionComponent<BoardTileDropdownWrapperProps> = ({
  dataTestId,
  children,
}) => {
  return (
    <ol data-test-id={dataTestId} className={styles.boardTileDropDownWrapper}>
      {children}
    </ol>
  );
};
