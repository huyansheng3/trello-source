import { useMemo, useCallback } from 'react';
import { TileInput } from './TileEditor';
import {
  BoardDashboardViewTilesQuery,
  BoardDashboardViewTilesDocument,
  useBoardDashboardViewTilesQuery,
} from './BoardDashboardViewTilesQuery.generated';
import { useCreateDashboardViewTileMutation } from './CreateDashboardViewTileMutation.generated';
import { useUpdateDashboardViewTileMutation } from './UpdateDashboardViewTileMutation.generated';
import { useDeleteDashboardViewTileMutation } from './DeleteDashboardViewTileMutation.generated';

const mapFromToGqlFrom = (from?: TileInput['from']) => {
  if (!from) {
    return null;
  }
  return {
    ...from,
    __typename: 'Board_DashboardViewTile_From' as 'Board_DashboardViewTile_From',
  };
};

const mapGraphToGqlGraph = (graph: TileInput['graph']) => {
  return {
    ...graph,
    __typename: 'Board_DashboardViewTile_Graph' as 'Board_DashboardViewTile_Graph',
  };
};

export const useTiles = (idBoard: string, skip = false) => {
  const { data, loading } = useBoardDashboardViewTilesQuery({
    variables: {
      boardId: idBoard,
    },
    skip,
  });

  const tiles = useMemo(() => {
    if (!data || !data.board) {
      return [];
    }
    return [...data.board.dashboardViewTiles].sort(
      (tile1, tile2) => tile1.pos - tile2.pos,
    );
  }, [data]);

  const [
    createDashboardViewTileMutation,
  ] = useCreateDashboardViewTileMutation();

  const [
    updateDashboardViewTileMutation,
  ] = useUpdateDashboardViewTileMutation();

  const [
    deleteDashboardViewTileMutation,
  ] = useDeleteDashboardViewTileMutation();

  const getTileById = useCallback(
    (id: string) => {
      return tiles.find((tile) => tile.id === id);
    },
    [tiles],
  );

  const createTile = useCallback(
    (tile: TileInput) => {
      const lastTile = tiles.length > 0 ? tiles[tiles.length - 1] : null;
      const newTilePos = lastTile ? lastTile.pos + 1 : 1;
      createDashboardViewTileMutation({
        variables: {
          idBoard,
          tile: {
            ...tile,
            pos: newTilePos,
          },
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createDashboardViewTile: {
            id: 'tempId',
            type: tile.type,
            from: mapFromToGqlFrom(tile.from),
            pos: newTilePos,
            dateLastActivity: new Date().toString(),
            graph: mapGraphToGqlGraph(tile.graph),
            __typename: 'Board_DashboardViewTile',
          },
        },
        update: (proxy, result) => {
          if (result.data?.createDashboardViewTile) {
            const data = proxy.readQuery<BoardDashboardViewTilesQuery>({
              query: BoardDashboardViewTilesDocument,
              variables: { boardId: idBoard },
            });

            if (!data?.board) {
              return;
            }

            proxy.writeQuery<BoardDashboardViewTilesQuery>({
              query: BoardDashboardViewTilesDocument,
              data: {
                ...data,
                board: {
                  ...data.board,
                  dashboardViewTiles: [
                    ...tiles,
                    result.data.createDashboardViewTile,
                  ],
                },
              },
            });
          }
        },
      });
    },
    [idBoard, createDashboardViewTileMutation, tiles],
  );

  const editTile = useCallback(
    (idTile: string, tile: TileInput) => {
      updateDashboardViewTileMutation({
        variables: {
          idBoard,
          tile: {
            id: idTile,
            ...tile,
          },
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateDashboardViewTile: {
            id: idTile,
            type: tile.type,
            from: mapFromToGqlFrom(tile.from),
            graph: mapGraphToGqlGraph(tile.graph),
            __typename: 'Board_DashboardViewTile',
          },
        },
      });
    },
    [updateDashboardViewTileMutation, idBoard],
  );

  const deleteTile = useCallback(
    (idTile: string) => {
      deleteDashboardViewTileMutation({
        variables: {
          idBoard,
          idTile,
        },
        optimisticResponse: {
          deleteDashboardViewTile: true,
          __typename: 'Mutation',
        },
        update(cache, result) {
          if (result.data?.deleteDashboardViewTile) {
            const data = cache.readQuery<BoardDashboardViewTilesQuery>({
              query: BoardDashboardViewTilesDocument,
              variables: { boardId: idBoard },
            });
            if (!data?.board) {
              return;
            }
            const tiles = data.board.dashboardViewTiles.filter(
              (tile) => tile.id !== idTile,
            );
            cache.writeQuery({
              query: BoardDashboardViewTilesDocument,
              data: {
                board: {
                  ...data.board,
                  dashboardViewTiles: tiles,
                },
              },
            });
          }
        },
      });
    },
    [deleteDashboardViewTileMutation, idBoard],
  );

  return {
    getTileById,
    tiles,
    loading,
    createTile,
    editTile,
    deleteTile,
  };
};
