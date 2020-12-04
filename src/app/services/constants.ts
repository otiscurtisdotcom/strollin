export const STARTING_MOVES = 20;

export enum KEYS {
    "w" = "UP",
    "a" = "LEFT",
    "s" = "DOWN",
    "d" = "RIGHT",
};

export const TILE_SIZE = 128;
export const GRID_HEIGHT = 10;
export const GRID_WIDTH = 10;

export const CANVAS_HEIGHT = TILE_SIZE * GRID_HEIGHT;
export const CANVAS_WIDTH = TILE_SIZE * GRID_WIDTH;

export interface Coords {
    xTile: number;
    yTile: number;
}

export interface Tile {
    terrainId: number;
    visited?: boolean;
}

export const START_X = 2;
export const START_Y = GRID_HEIGHT - 1;

interface Terrain {
    adj_points: number;
    passable: boolean;
}

export const TERRAIN_INFO: Terrain[] = [
    // 0: Grass
    {
        adj_points: 1,
        passable: true
    },
    // 1: Water
    {
        adj_points: 5,
        passable: false
    },
    // 2: Water
    {
        adj_points: 5,
        passable: false
    },
    // 3: Water
    {
        adj_points: 5,
        passable: false
    },
    // 4: Water
    {
        adj_points: 5,
        passable: false
    },
    // 5: Water
    {
        adj_points: 5,
        passable: false
    },
    // 6: START / END
    {
        adj_points: 0,
        passable: true
    },
    // 7: START / END
    {
        adj_points: 0,
        passable: true
    },
    // 8: START / END
    {
        adj_points: 0,
        passable: true
    },
    // 9: START / END
    {
        adj_points: 0,
        passable: true
    },
    // 10: START / END
    {
        adj_points: 0,
        passable: true
    },
    // 11: Road
    {
        adj_points: -3,
        passable: true
    },
    // 12: Road
    {
        adj_points: -3,
        passable: true
    },
    // 13: Road
    {
        adj_points: -3,
        passable: true
    },
    // 14: Road
    {
        adj_points: -3,
        passable: true
    },
    // 15: Road
    {
        adj_points: -3,
        passable: true
    },
    // 16: Tree 1
    {
        adj_points: 10,
        passable: false
    },
    // 17: Tree 2
    {
        adj_points: 10,
        passable: false
    },
]
