import * as PIXI from 'pixi.js';
import { Injectable } from '@angular/core';
import { CANVAS_HEIGHT, CANVAS_WIDTH, KEYS, STARTING_MOVES, TILE_SIZE, Coords, GRID_HEIGHT, GRID_WIDTH, START_X, START_Y, TERRAIN_INFO } from './constants';
import { ScoresService } from './scores.service';

interface RawTileMap {
    layers: Array<{ data: number[] }>;
    height: number;
    width: number;
    tileheight: number;
    tilewidth: number;
}

interface ParsedTile {
    id: string;
    terrainId: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

enum TerrainId {
    Blank = 0
}

interface Tile {
    terrainId: number;
    visited: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class PixiService {
    public readonly app = new PIXI.Application({
        height: CANVAS_HEIGHT,
        width: CANVAS_WIDTH,
        backgroundColor: 0x669955,
    });

    private readonly characterLayer = new PIXI.Container();
    private readonly pathLayer = new PIXI.Container();
    private readonly backgroundLayer = new PIXI.Container();
    private readonly renderer = PIXI.autoDetectRenderer();
    private readonly loader = new PIXI.Loader;

    //CREATE CONTENT
    private readonly sprite = new PIXI.Graphics().beginFill(0xe74c3c).drawRect(0, 0, TILE_SIZE, TILE_SIZE);
    private spritePosition: Coords;
    private spriteTempPosition: Coords;

    private levelMap: Tile[][];
    
    private animating = false;

    constructor(
        private readonly scoresService: ScoresService,
    ) {}

    setupGame() {
        //CREATE APP
        this.app.view.style.height = `${CANVAS_HEIGHT / 3}px`;
        this.app.view.style.width = `${CANVAS_WIDTH / 3}px`;

        //LOAD ASSETS
        this.loader.add([
            "assets/Tileset.json",
            "assets/Tileset.png",
            "assets/level1.json",
        ]).load(() => {
            // SETUP BACKGROUND SPRITESHEET
            let sheet = this.loader.resources['assets/Tileset.json'].spritesheet;

            // LOAD LEVEL FROM JSON
            const level = this.loader.resources['assets/level1.json'].data;
            this.createLevel(level).map(tile => {
                const sprite = new PIXI.Sprite(
                sheet.textures![`Tileset${tile.terrainId - 1}.png`]
                );
                sprite.x = tile.x;
                sprite.y = tile.y;
                this.backgroundLayer.addChild(sprite);
            });
            //ADD CONTENT TO CONTENT LAYER
            this.characterLayer.addChild(this.sprite);

            //ADD LAYERS TO STAGE
            this.app.stage.addChild(this.backgroundLayer);
            this.app.stage.addChild(this.pathLayer);
            this.app.stage.addChild(this.characterLayer);

            //ANIMATE
            this.animate();
        });
    }

    keyPressed(event: KeyboardEvent) {
        if (
            !KEYS[event.key] ||
            this.animating ||
            // Only allow up for first move
            (this.scoresService.liveMovesLeft === STARTING_MOVES && KEYS[event.key] !== KEYS.w) 
        ) return;

        let newTileY: number;
        let newTileX: number;
        let withinBounds: boolean;

        switch (KEYS[event.key]) {
        case KEYS.w:
            // UP
            newTileY = this.spritePosition.yTile - 1;
            newTileX = this.spritePosition.xTile;
            withinBounds = this.spritePosition.yTile > 0;
            break;

        case KEYS.a:
            // LEFT
            newTileY = this.spritePosition.yTile;
            newTileX = this.spritePosition.xTile - 1;
            withinBounds = this.spritePosition.xTile > 0;
            break;

        case KEYS.s:
            // DOWN
            newTileY = this.spritePosition.yTile + 1;
            newTileX = this.spritePosition.xTile;
            withinBounds = this.spritePosition.yTile < GRID_HEIGHT - 1;
            break;

        case KEYS.d:
            // RIGHT
            newTileY = this.spritePosition.yTile;
            newTileX = this.spritePosition.xTile + 1;
            withinBounds = this.spritePosition.xTile < GRID_WIDTH - 1;
            break;

        default:
            break;
        }

        const newTile = this.levelMap[newTileY][newTileX];
        const newTileTerrainId = newTile.terrainId;
        const newTileCoords = { yTile: newTileY, xTile: newTileX };

        if (withinBounds && TERRAIN_INFO[newTileTerrainId].passable && !newTile.visited) {
            this.spriteTempPosition = newTileCoords;
            this.levelMap[newTileY][newTileX].visited = true;
        } else {
            return;
        }
        
        const isInEndZone = newTileY === GRID_HEIGHT - 1;

        // DRAW PATH
        if (!isInEndZone) {
            setTimeout(() => {
                this.drawPath(newTileCoords);
            }, 200);
        }
        
        // POINTS
        let adjacentPoints = 0;
        adjacentPoints = isInEndZone ? 0 : this.getAdjacent(newTileCoords);
        this.scoresService.makeMove(adjacentPoints, isInEndZone);
    }

    resetPositions() {
        this.spritePosition = { xTile:START_X, yTile:START_Y};
        this.spriteTempPosition = { xTile:START_X, yTile:START_Y };
        this.characterLayer.position.set(START_X * TILE_SIZE, START_Y * TILE_SIZE);
        
        this.levelMap?.map(row => {
            row.map(tile => {
                tile.visited = false;
            });
        });

        setTimeout(() => {
            this.pathLayer.removeChildren();
        }, 250)
    }

    private createLevel = (rawTiles: RawTileMap): ParsedTile[] => {
        const array2d = Array.from({ length: rawTiles.height }).map((_, i) =>
            rawTiles.layers[0].data.slice(i * rawTiles.width, (i + 1) * rawTiles.width)
        );

        this.levelMap = array2d.map((row, i) => {
            return row.map((terrainId, j) => ({
                terrainId,
                visited: false
            }));
        });
        
        return array2d.map((row, i) => {
            return row.map((terrainId, j) => ({
                id: `${i}_${j}`,
                terrainId,
                x: rawTiles.tilewidth * j,
                y: rawTiles.tileheight * i,
                width: rawTiles.tilewidth,
                height: rawTiles.tileheight
            }));
        })
        .reduce((acc, row) => row.concat(acc), [])
        .filter(tile => tile.terrainId !== TerrainId.Blank);
    }

    private animate() {
        this.renderer.render(this.characterLayer);

        const yDiff = this.spriteTempPosition.yTile - this.spritePosition.yTile;
        const xDiff = this.spriteTempPosition.xTile - this.spritePosition.xTile;

        if (this.characterLayer.position.y !== this.spriteTempPosition.yTile * TILE_SIZE) {
            this.characterLayer.position.y += yDiff * TILE_SIZE / 8;
            this.animating = true;
        } else {
            this.spritePosition.yTile = this.spriteTempPosition.yTile;
            this.animating = false;
        }
        
        if (this.characterLayer.position.x !== this.spriteTempPosition.xTile * TILE_SIZE) {
            this.characterLayer.position.x += xDiff * TILE_SIZE / 8;
            this.animating = true;
        } else {
            this.spritePosition.xTile = this.spriteTempPosition.xTile;
            this.animating = false;
        }

        requestAnimationFrame(this.animate.bind(this));
    }

    private getAdjacent(centreTile: Coords): number {
        let score = 0;
        let adjacentTileIds = [];

        // Clockwise from top
        adjacentTileIds.push(
            centreTile.yTile > 0 ? 
                    this.levelMap[centreTile.yTile - 1][centreTile.xTile].terrainId : undefined,
            
            centreTile.yTile > 0 && centreTile.xTile < GRID_WIDTH ? 
                    this.levelMap[centreTile.yTile - 1][centreTile.xTile + 1].terrainId : undefined,

            centreTile.xTile < GRID_WIDTH ?
                    this.levelMap[centreTile.yTile][centreTile.xTile + 1].terrainId : undefined,

            centreTile.xTile < GRID_WIDTH ?
                    this.levelMap[centreTile.yTile + 1][centreTile.xTile + 1].terrainId : undefined,

            this.levelMap[centreTile.yTile + 1][centreTile.xTile].terrainId,

            centreTile.xTile > 0 ?
                    this.levelMap[centreTile.yTile + 1][centreTile.xTile - 1].terrainId : undefined,

            centreTile.xTile > 0 ?
                    this.levelMap[centreTile.yTile][centreTile.xTile - 1].terrainId : undefined,

            centreTile.xTile > 0 && centreTile.yTile > 0 ?
                    this.levelMap[centreTile.yTile - 1][centreTile.xTile - 1].terrainId : undefined,
        );

        adjacentTileIds.forEach((id: number) => {
            if (id !== undefined && TERRAIN_INFO[id]) {
                score += TERRAIN_INFO[id].adj_points;
            }
        })

        return score;
    }

    private drawPath(tileCoords: Coords) {
        const xPos = tileCoords.xTile * TILE_SIZE;
        const yPos = tileCoords.yTile * TILE_SIZE;
        const pathSprite = new PIXI.Graphics().beginFill(0xa74c3c).drawRect(xPos, yPos, TILE_SIZE, TILE_SIZE);
        this.pathLayer.addChild(pathSprite);
    }
}