import * as PIXI from 'pixi.js';
import { Injectable } from '@angular/core';

import { CANVAS_HEIGHT, CANVAS_WIDTH, KEYS, TILE_SIZE, Coords, GRID_HEIGHT, GRID_WIDTH, START_X, START_Y } from '../constants/constants';
import { TERRAIN_INFO } from '../constants/terrain';
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
    wood_chopped: boolean;
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
    private readonly benchLayer = new PIXI.Container();
    private readonly renderer = PIXI.autoDetectRenderer();
    private readonly loader = new PIXI.Loader;

    //CREATE CONTENT
    private readonly sprite = new PIXI.Graphics().beginFill(0xe74c3c).drawCircle(TILE_SIZE / 2, TILE_SIZE / 2, (TILE_SIZE - 40) / 2);
    private spritePosition: Coords;
    private spriteTempPosition: Coords;

    private levelMap: Tile[][];

    private lastMoveDirections: KEYS[] = [];
    
    private animating = false;
    private firstMove = true;
    private loaded = false;

    constructor(
        private readonly scoresService: ScoresService,
    ) {}

    loadBasics() {
        if (!this.loaded) {
            this.loader.add([
                "assets/terrain.json",
                "assets/terrain.png",
                "assets/paths.json",
                "assets/paths.png"
            ]).load(() => {
                console.log('LOADED');
                this.loaded = true;
            });
        }
    }

    setupGame(levelId: number) {
        //CREATE APP
        this.app.view.style.height = `${CANVAS_HEIGHT / 3}px`;
        this.app.view.style.width = `${CANVAS_WIDTH / 3}px`;

        //LOAD ASSETS
        if (this.loader.resources[`assets/level${levelId}.json`]) {
            this.levelLoaded(levelId);
        } else {
            this.loader.add([
                `assets/level${levelId}.json`,
            ]).load(() => this.levelLoaded(levelId));
        }
    }

    private levelLoaded(levelId: number) {
        // SETUP BACKGROUND SPRITESHEET
        const sheet = this.loader.resources['assets/terrain.json'].spritesheet;

        // LOAD LEVEL FROM JSON
        const level = this.loader.resources[`assets/level${levelId}.json`].data;
        this.createLevel(level).map(tile => {
            const sprite = new PIXI.Sprite(
                sheet.textures![`terrain${tile.terrainId - 1}.png`]
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
        this.app.stage.addChild(this.benchLayer);
        this.app.stage.addChild(this.characterLayer);

        //ANIMATE
        this.animate();
    }

    keyPressed(event: KeyboardEvent) {
        if (
            !KEYS[event.key] ||
            this.animating ||
            // Only allow up for first move
            (this.firstMove && KEYS[event.key] !== KEYS.w) 
        ) return;

        this.firstMove = false;
        
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

        if (!withinBounds) return;

        const newTile = this.levelMap[newTileY][newTileX];
        const newTileTerrainId = newTile.terrainId;
        const newTileCoords = { yTile: newTileY, xTile: newTileX };

        if (TERRAIN_INFO[newTileTerrainId].passable && !newTile.visited) {
            this.spriteTempPosition = newTileCoords;
            this.levelMap[newTileY][newTileX].visited = true;
            this.lastMoveDirections.unshift(KEYS[event.key]);
            if (this.lastMoveDirections.length === 3) {
                this.lastMoveDirections.pop();
            }
        } else {
            return;
        }
        
        const isInEndZone = newTileY === GRID_HEIGHT - 1;

        let adjacentPoints = 0;
        let adjacentWood = 0;

        // DRAW PATH
        if (!isInEndZone) {
            setTimeout(() => {
                this.drawPath(newTileCoords);
            }, 200);

            // POINTS
            const adjacentScores = this.getAdjacent(newTileCoords);
            adjacentPoints = isInEndZone ? 0 : adjacentScores.score;
            adjacentWood = isInEndZone ? 0 : adjacentScores.wood;
        }
        
        this.scoresService.makeMove(adjacentPoints, adjacentWood, isInEndZone);
    }

    resetPositions() {
        this.spritePosition = { xTile:START_X, yTile:START_Y };
        this.spriteTempPosition = { xTile:START_X, yTile:START_Y };
        this.characterLayer.position.set(START_X * TILE_SIZE, START_Y * TILE_SIZE);
        
        this.levelMap?.map(row => {
            row.map(tile => {
                tile.visited = false;
                tile.wood_chopped = false;
            });
        });
        
        this.backgroundLayer.removeChildren();
        this.benchLayer.removeChildren();

        setTimeout(() => {
            this.pathLayer.removeChildren();
        }, 250);

        this.firstMove = true;
    }

    makeBench() {
        const xPos = this.spritePosition.xTile * TILE_SIZE;
        const yPos = this.spritePosition.yTile * TILE_SIZE;
        const benchSprite = new PIXI.Graphics().beginFill(0xe2d23c).drawRect(xPos, yPos, TILE_SIZE, TILE_SIZE);
        this.benchLayer.addChild(benchSprite);

        //BONUS POINTS
        const bonusPoints = this.getAdjacent(this.spritePosition).score;
        this.scoresService.makeBench(bonusPoints);
    }

    private createLevel = (rawTiles: RawTileMap): ParsedTile[] => {
        const array2d = Array.from({ length: rawTiles.height }).map((_, i) =>
            rawTiles.layers[0].data.slice(i * rawTiles.width, (i + 1) * rawTiles.width)
        );

        this.levelMap = array2d.map((row, i) => {
            return row.map((terrainId, j) => ({
                terrainId,
                visited: false,
                wood_chopped: false
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

    private getAdjacent(centreTile: Coords): ({score: number, wood: number}) {
        let score = 0;
        let wood = 0;
        let adjacentTiles: Tile[] = [];

        // Clockwise from top
        adjacentTiles.push(
            centreTile.yTile > 0 ? 
                    this.levelMap[centreTile.yTile - 1][centreTile.xTile] : undefined,
            
            centreTile.yTile > 0 && centreTile.xTile < GRID_WIDTH ? 
                    this.levelMap[centreTile.yTile - 1][centreTile.xTile + 1] : undefined,

            centreTile.xTile < GRID_WIDTH ?
                    this.levelMap[centreTile.yTile][centreTile.xTile + 1] : undefined,

            centreTile.xTile < GRID_WIDTH ?
                    this.levelMap[centreTile.yTile + 1][centreTile.xTile + 1] : undefined,

            this.levelMap[centreTile.yTile + 1][centreTile.xTile],

            centreTile.xTile > 0 ?
                    this.levelMap[centreTile.yTile + 1][centreTile.xTile - 1] : undefined,

            centreTile.xTile > 0 ?
                    this.levelMap[centreTile.yTile][centreTile.xTile - 1] : undefined,

            centreTile.xTile > 0 && centreTile.yTile > 0 ?
                    this.levelMap[centreTile.yTile - 1][centreTile.xTile - 1] : undefined,
        );

        adjacentTiles.forEach((tile: Tile) => {
            if (tile !== undefined && TERRAIN_INFO[tile.terrainId]) {
                score += TERRAIN_INFO[tile.terrainId].adj_points;
                
                if (TERRAIN_INFO[tile.terrainId].wood && !tile.wood_chopped) {
                    wood += TERRAIN_INFO[tile.terrainId].wood;
                    tile.wood_chopped = true;
                }
            }
        })

        return ({score, wood});
    }

    private drawPath(tileCoords: Coords) {
        const sheet = this.loader.resources['assets/paths.json'].spritesheet;
        let currentPath = '0';
        let previousPath = '0';

        if (this.pathLayer.children.length > 0 && this.lastMoveDirections.length > 1) {
            const previousTile = this.pathLayer.children[this.pathLayer.children.length - 1];
            const previousTilePosition = previousTile.position;
            previousTile.destroy();

            const lastTwoPaths = `${this.lastMoveDirections[1]}_${this.lastMoveDirections[0]}`;
            
            switch (lastTwoPaths) {
                case 'LEFT_LEFT':
                case 'RIGHT_RIGHT':
                    previousPath = '0';
                    break;
                case 'UP_UP':
                case 'DOWN_DOWN':
                    previousPath = '1';
                    break;
                case 'RIGHT_UP':
                case 'DOWN_LEFT':
                    previousPath = '2';
                    break;
                case 'RIGHT_DOWN':
                case 'UP_LEFT':
                    previousPath = '3';
                    break;
                case 'DOWN_RIGHT':
                case 'LEFT_UP':
                    previousPath = '4';
                    break;
                case 'UP_RIGHT':
                case 'LEFT_DOWN':
                    previousPath = '5';
                    break;
                default:
                    previousPath = '0';
                    break;
            };
            
            const previousPathSprite = new PIXI.Sprite(sheet.textures![`paths${previousPath}.png`]);
            previousPathSprite.position.set(previousTilePosition.x, previousTilePosition.y);
            this.pathLayer.addChild(previousPathSprite);
        }

        switch (this.lastMoveDirections[0]) {
            case KEYS.w:
                currentPath = '8';
                break;
            case KEYS.a:
                currentPath = '11';
                break;
            case KEYS.s:
                currentPath = '10';
                break;
            case KEYS.d:
                currentPath = '9';
                break;
        };

        const pathSprite = new PIXI.Sprite(sheet.textures![`paths${currentPath}.png`]);
        pathSprite.x = tileCoords.xTile * TILE_SIZE;
        pathSprite.y = tileCoords.yTile * TILE_SIZE;
        this.pathLayer.addChild(pathSprite);
    }
}