import React, { useState, useMemo, useCallback } from 'react';
import { TypePickerPage } from './Pages/TypePickerPage';
import { ConfigurePage } from './Pages/ConfigurePage';
import { TileInput, Strings } from './types';
import styles from './TileEditor.less';

type TileEditorPage = 'type-picker' | 'configure';

const PagesOrder: TileEditorPage[] = ['type-picker', 'configure'];

export interface TileEditorProps {
  tile?: TileInput;
  strings: Strings;
  onSubmit(tile: TileInput): void;
  onClose(): void;
}

export function TileEditor({
  tile,
  onSubmit,
  strings,
  onClose,
}: TileEditorProps) {
  const [pageIndex, setPageIndex] = useState<number>(0);

  const [tileInput, setTileInput] = useState<TileInput>(
    tile ?? {
      type: 'cardsPerList',
      graph: {
        type: 'bar',
      },
    },
  );

  const onEdit = useCallback(
    (tile: TileInput) => {
      setTileInput(tile);
    },
    [setTileInput],
  );

  const onNext = useCallback(() => {
    setPageIndex((pageIndex) => pageIndex + 1);
  }, [setPageIndex]);

  const onBack = useCallback(() => {
    setPageIndex((pageIndex) => pageIndex - 1);
  }, [setPageIndex]);

  const _onSubmit = useCallback(() => {
    onSubmit(tileInput);
  }, [onSubmit, tileInput]);

  const pageElement = useMemo(() => {
    const page = PagesOrder[pageIndex];
    if (page === 'type-picker') {
      return (
        <TypePickerPage
          strings={strings}
          tile={tileInput}
          onEdit={onEdit}
          onNext={onNext}
          onClose={onClose}
        />
      );
    } else if (page === 'configure') {
      return (
        <ConfigurePage
          strings={strings}
          tile={tileInput}
          onEdit={onEdit}
          onBack={onBack}
          onSubmit={_onSubmit}
          onClose={onClose}
        />
      );
    }
  }, [
    pageIndex,
    strings,
    onClose,
    onEdit,
    onBack,
    onNext,
    _onSubmit,
    tileInput,
  ]);
  return <div className={styles.container}>{pageElement}</div>;
}
