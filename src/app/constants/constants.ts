export const STARTING_MOVES = 20;

export const ALL_STARS = 'allStars';

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
