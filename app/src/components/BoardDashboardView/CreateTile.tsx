import React from 'react';
import { AddIcon } from '@trello/nachos/icons/add';
import { Button } from '@trello/nachos/button';
import styles from './CreateTile.less';

interface CreateTileProps {
  onCreate(): void;
}

export const CreateTile: React.FC<CreateTileProps> = (props) => {
  return (
    <Button className={styles.container} onClick={props.onCreate}>
      <AddIcon size="large" />
    </Button>
  );
};
