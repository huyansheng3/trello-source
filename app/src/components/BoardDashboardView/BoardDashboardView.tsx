/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import classNames from 'classnames';

import { Analytics } from '@trello/atlassian-analytics';
import { Tile, getTileTypeCounts, getTileType } from '@trello/dashboard';
import { CloseIcon } from '@trello/nachos/icons/close';

import {
  useWorkspaceNavigation,
  useWorkspaceNavigationHidden,
} from 'app/src/components/WorkspaceNavigation';
import { TileErrorBoundary } from './TileErrorBoundary';
import { useBoardDashboardViewScreenEventQuery } from './BoardDashboardViewScreenEventQuery.generated';
import { useAnalyticsDataQuery } from './AnalyticsDataQuery.generated';
import {
  PermissionsContextProvider,
  PermissionsContext,
} from './PermissionsContext';
import { EditTileOverlay } from './EditTileOverlay';
import { CreateTileOverlay } from './CreateTileOverlay';
import { CardsPerListBarChart } from './tiles/CardsPerListBarChart';
import { CardsPerListPieChart } from './tiles/CardsPerListPieChart';
import { CardsPerLabelBarChart } from './tiles/CardsPerLabelBarChart';
import { CardsPerLabelPieChart } from './tiles/CardsPerLabelPieChart';
import { CardsPerMemberBarChart } from './tiles/CardsPerMemberBarChart';
import { CardsPerMemberPieChart } from './tiles/CardsPerMemberPieChart';
import { CardsPerDueDateBarChart } from './tiles/CardsPerDueDateBarChart';
import { CardsPerDueDatePieChart } from './tiles/CardsPerDueDatePieChart';
import { CardsPerListLineChart } from './tiles/CardsPerListLineChart';
import { CardsPerLabelLineChart } from './tiles/CardsPerLabelLineChart';
import { CardsPerMemberLineChart } from './tiles/CardsPerMemberLineChart';
import { CardsPerDueDateLineChart } from './tiles/CardsPerDueDateLineChart';
import { CreateTile } from './CreateTile';
import { useTiles } from './useTiles';
import { TileInput } from './TileEditor';
import { TileProps } from './types';
import styles from './BoardDashboardView.less';
import { BoardReportsViewTestIds } from '@trello/test-ids';
import { SingleBoardViewProvider } from 'app/src/components/BoardViewContext/SingleBoardViewProvider';

const mapTileToElement = (props: Omit<TileProps, 'tile'>) => (tile: Tile) => {
  if (tile.type === 'cardsPerList') {
    if (tile.graph.type === 'bar') {
      return <CardsPerListBarChart key={tile.id} tile={tile} {...props} />;
    }
    if (tile.graph.type === 'pie') {
      return <CardsPerListPieChart key={tile.id} tile={tile} {...props} />;
    }
  }
  if (tile.type === 'cardsPerLabel') {
    if (tile.graph.type === 'bar') {
      return <CardsPerLabelBarChart key={tile.id} tile={tile} {...props} />;
    }
    if (tile.graph.type === 'pie') {
      return <CardsPerLabelPieChart key={tile.id} tile={tile} {...props} />;
    }
  }
  if (tile.type === 'cardsPerMember') {
    if (tile.graph.type === 'bar') {
      return <CardsPerMemberBarChart key={tile.id} tile={tile} {...props} />;
    }
    if (tile.graph.type === 'pie') {
      return <CardsPerMemberPieChart key={tile.id} tile={tile} {...props} />;
    }
  }
  if (tile.type === 'cardsPerDueDate') {
    if (tile.graph.type === 'bar') {
      return <CardsPerDueDateBarChart key={tile.id} tile={tile} {...props} />;
    }
    if (tile.graph.type === 'pie') {
      return <CardsPerDueDatePieChart key={tile.id} tile={tile} {...props} />;
    }
  }
  if (tile.type === 'cardsPerListHistory') {
    if (tile.graph.type === 'line') {
      return <CardsPerListLineChart key={tile.id} tile={tile} {...props} />;
    }
  }
  if (tile.type === 'cardsPerLabelHistory') {
    if (tile.graph.type === 'line') {
      return <CardsPerLabelLineChart key={tile.id} tile={tile} {...props} />;
    }
  }
  if (tile.type === 'cardsPerMemberHistory') {
    if (tile.graph.type === 'line') {
      return <CardsPerMemberLineChart key={tile.id} tile={tile} {...props} />;
    }
  }
  if (tile.type === 'cardsPerDueDateHistory') {
    if (tile.graph.type === 'line') {
      return <CardsPerDueDateLineChart key={tile.id} tile={tile} {...props} />;
    }
  }
  return null;
};

const useScreenEvent = (idBoard: string) => {
  const isEventSent = useRef(false);

  const { data, loading } = useBoardDashboardViewScreenEventQuery({
    variables: { boardId: idBoard },
  });

  useEffect(() => {
    if (!isEventSent.current && !loading) {
      const tiles = data?.board?.dashboardViewTiles;
      const attributes = tiles
        ? {
            totalTileCount: tiles.length,
            tileTypeCounts: getTileTypeCounts(tiles),
          }
        : undefined;
      const idOrg = data?.board?.idOrganization;
      const idEnt = data?.board?.idEnterprise;
      Analytics.sendScreenEvent({
        name: 'boardDashboardScreen',
        containers: {
          organization: { id: idOrg },
          board: { id: idBoard },
          enterprise: { id: idEnt },
        },
        attributes,
      });
      isEventSent.current = true;
    }
  }, [idBoard, data, loading]);
};

const useAnalyticsEvents = (idBoard: string) => {
  const { data } = useAnalyticsDataQuery({
    variables: { boardId: idBoard },
  });

  const containers = useMemo(() => {
    return {
      organization: data?.board ? { id: data.board.idOrganization } : undefined,
      board: { id: idBoard },
      enterprise: data?.board ? { id: data.board.idEnterprise } : undefined,
    };
  }, [data, idBoard]);

  const clickAddTile = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'addTile',
      source: 'boardDashboardScreen',
      containers,
    });
  }, [containers]);

  const clickEditTile = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'editTile',
      source: 'dashboardTileInlineDialog',
      containers,
    });
  }, [containers]);

  const addTile = useCallback(
    (tile: TileInput) => {
      Analytics.sendTrackEvent({
        action: 'added',
        actionSubject: 'dashboardTile',
        source: 'dashboardTileWizardModal',
        containers,
        attributes: {
          tileType: getTileType(tile),
        },
      });
    },
    [containers],
  );

  const editTile = useCallback(
    (tile: Tile, newTile: TileInput) => {
      Analytics.sendTrackEvent({
        action: 'edited',
        actionSubject: 'dashboardTile',
        source: 'dashboardTileWizardModal',
        containers,
        attributes: {
          previousTileType: getTileType(tile),
          tileType: getTileType(newTile),
        },
      });
    },
    [containers],
  );

  const deleteTile = useCallback(
    (tile: Tile) => {
      Analytics.sendTrackEvent({
        action: 'deleted',
        actionSubject: 'dashboardTile',
        source: 'dashboardTileInlineDialog',
        containers,
        attributes: {
          tileType: getTileType(tile),
        },
      });
    },
    [containers],
  );

  return { clickAddTile, clickEditTile, addTile, editTile, deleteTile };
};

interface BoardDashboardViewProps {
  idBoard: string;
  navigateToBoardView(): void;
}

export const BoardDashboardView: React.FunctionComponent<BoardDashboardViewProps> = ({
  idBoard,
  navigateToBoardView,
}) => {
  useScreenEvent(idBoard);

  const [
    {
      expanded: workspaceNavigationExpanded,
      enabled: workspaceNavigationEnabled,
    },
  ] = useWorkspaceNavigation();
  const [
    { hidden: workspaceNavigationHidden },
  ] = useWorkspaceNavigationHidden();

  return (
    <div
      className={classNames(styles.boardDashboardContainer, {
        [styles.collapsedWorkspaceNavigation]:
          workspaceNavigationEnabled &&
          !workspaceNavigationHidden &&
          !workspaceNavigationExpanded,
      })}
      data-test-id={BoardReportsViewTestIds.DashboardWrapper}
    >
      <PermissionsContextProvider idBoard={idBoard}>
        <SingleBoardViewProvider idBoard={idBoard}>
          <div className={styles.boardDashboardHeaderToolbarRight}>
            <span
              role="button"
              data-test-id={BoardReportsViewTestIds.CloseButton}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => navigateToBoardView()}
            >
              <CloseIcon size="large" color="dark" />
            </span>
          </div>
          <div className={styles.content}>
            <DashboardTiles
              idBoard={idBoard}
              navigateToBoardView={navigateToBoardView}
            />
          </div>
        </SingleBoardViewProvider>
      </PermissionsContextProvider>
    </div>
  );
};

type DashboardTilesProps = BoardDashboardViewProps;
const DashboardTiles: React.FC<DashboardTilesProps> = ({
  idBoard,
  navigateToBoardView,
}) => {
  const { getTileById, tiles, createTile, editTile, deleteTile } = useTiles(
    idBoard,
  );

  const analyticsEvents = useAnalyticsEvents(idBoard);
  const { canEdit } = useContext(PermissionsContext);

  const [idTileEditing, setIdTileEditing] = useState<null | string>(null);
  const [isCreatingTile, setIsCreatingTile] = useState<boolean>(false);
  const tileEditing = useMemo(() => {
    if (idTileEditing) {
      return tiles.find((tile) => tile.id === idTileEditing);
    }
    return null;
  }, [idTileEditing, tiles]);

  const openEditOverlay = useCallback(
    (idTile: string) => {
      analyticsEvents.clickEditTile();
      setIdTileEditing(idTile);
    },
    [setIdTileEditing, analyticsEvents],
  );

  const closeEditOverlay = useCallback(() => {
    setIdTileEditing(null);
  }, [setIdTileEditing]);

  const openCreateOverlay = useCallback(() => {
    analyticsEvents.clickAddTile();
    setIsCreatingTile(true);
  }, [setIsCreatingTile, analyticsEvents]);

  const closeCreateOverlay = useCallback(() => {
    setIsCreatingTile(false);
  }, [setIsCreatingTile]);

  const onCreateTile = useCallback(
    (tile: TileInput) => {
      analyticsEvents.addTile(tile);
      createTile(tile);
      setIsCreatingTile(false);
    },
    [createTile, setIsCreatingTile, analyticsEvents],
  );

  const onEditTile = useCallback(
    (tile: TileInput) => {
      if (idTileEditing) {
        const oldTile = getTileById(idTileEditing);
        if (oldTile) {
          analyticsEvents.editTile(oldTile, tile);
        }
        editTile(idTileEditing, tile);
        setIdTileEditing(null);
      }
    },
    [editTile, setIdTileEditing, idTileEditing, analyticsEvents, getTileById],
  );

  const onDeleteTile = useCallback(
    (idTile: string) => {
      const tile = getTileById(idTile);
      if (tile) {
        analyticsEvents.deleteTile(tile);
      }
      deleteTile(idTile);
    },
    [deleteTile, analyticsEvents, getTileById],
  );

  const tileElements = useMemo(() => {
    return tiles.map((tile) => (
      <TileErrorBoundary tile={tile} key={tile.id}>
        {mapTileToElement({
          idBoard,
          onDelete: () => onDeleteTile(tile.id),
          onEdit: () => openEditOverlay(tile.id),
          navigateToBoardView,
        })(tile)}
      </TileErrorBoundary>
    ));
  }, [tiles, onDeleteTile, openEditOverlay, navigateToBoardView, idBoard]);

  return (
    <>
      {tileElements}
      {canEdit() && <CreateTile onCreate={openCreateOverlay} />}
      {tileEditing && (
        <EditTileOverlay
          tile={tileEditing}
          onSubmit={onEditTile}
          onClose={closeEditOverlay}
        />
      )}
      {isCreatingTile && (
        <CreateTileOverlay
          onSubmit={onCreateTile}
          onClose={closeCreateOverlay}
        />
      )}
    </>
  );
};
