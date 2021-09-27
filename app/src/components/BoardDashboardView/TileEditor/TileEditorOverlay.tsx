import React from 'react';
import { Overlay, OverlayBackground } from 'app/src/components/Overlay';
import { TileEditor, TileEditorProps } from './TileEditor';
import styles from './TileEditorOverlay.less';

interface TileEditorOverlayProps extends TileEditorProps {
  onClose(): void;
}

export const TileEditorOverlay: React.FC<TileEditorOverlayProps> = ({
  onClose,
  ...restProps
}) => {
  return (
    <Overlay
      onClose={onClose}
      background={OverlayBackground.DARK}
      closeOnEscape
    >
      <div className={styles.container}>
        <TileEditor onClose={onClose} {...restProps} />
      </div>
    </Overlay>
  );
};
