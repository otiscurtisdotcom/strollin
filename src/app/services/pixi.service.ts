import * as PIXI from 'pixi.js';
import { Injectable } from '@angular/core';
import { CANVAS_HEIGHT, CANVAS_WIDTH, KEYS, STARTING_MOVES, TILE_SIZE, Coords, GRID_HEIGHT, GRID_WIDTH, START_X, START_Y } from './constants';
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
    tileId: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

enum TileId {
    Blank = 0
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

    private readonly contentLayer = new PIXI.Container();
    private readonly backgroundLayer = new PIXI.Container();
    private readonly renderer = PIXI.autoDetectRenderer();
    private readonly loader = new PIXI.Loader;

    //CREATE CONTENT
    private readonly sprite = new PIXI.Graphics().beginFill(0xe74c3c).drawRect(0, 0, TILE_SIZE, TILE_SIZE);
    private spritePosition: Coords;
    private spriteTempPosition: Coords;

    private levelMap: number[][];
    
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
            "../../assets/Tileset.json",
            "../../assets/Tileset.png",
            "../../assets/level1.json",
        ]).load(() => {
            // SETUP BACKGROUND SPRITESHEET
            let sheet = this.loader.resources['../../assets/Tileset.json'].spritesheet;

            // LOAD LEVEL FROM JSON
            const level = this.loader.resources['../../assets/level1.json'].data;
            this.createLevel(level).map(tile => {
                const sprite = new PIXI.Sprite(
                sheet.textures![`Tileset${tile.tileId - 1}.png`]
                );
                sprite.x = tile.x;
                sprite.y = tile.y;
                this.backgroundLayer.addChild(sprite);
            });
            this.app.stage.addChild(this.backgroundLayer);

            //ADD CONTENT TO CONTENT LAYER
            this.contentLayer.addChild(this.sprite);

            //ADD LAYER TO STAGE
            this.app.stage.addChild(this.contentLayer);

            //ANIMATE
            this.animate();
        });
    }

    createLevel = (rawTiles: RawTileMap): ParsedTile[] => {
        const array2d = Array.from({ length: rawTiles.height }).map((_, i) =>
            rawTiles.layers[0].data.slice(i * rawTiles.width, (i + 1) * rawTiles.width)
        );

        this.levelMap = array2d;

        return array2d.map((row, i) => {
            return row.map((tileId, j) => ({
                id: `${i}_${j}`,
                tileId,
                x: rawTiles.tilewidth * j,
                y: rawTiles.tileheight * i,
                width: rawTiles.tilewidth,
                height: rawTiles.tileheight
            }));
        })
        .reduce((acc, row) => row.concat(acc), [])
        .filter(tile => tile.tileId !== TileId.Blank);
    };

    resetPositions() {
        this.spritePosition = { xTile:START_X, yTile:START_Y};
        this.spriteTempPosition = { xTile:START_X, yTile:START_Y };
        this.contentLayer.position.set(START_X * TILE_SIZE, START_Y * TILE_SIZE);
    }

    animate() {
        this.renderer.render(this.contentLayer);

        const yDiff = this.spriteTempPosition.yTile - this.spritePosition.yTile;
        const xDiff = this.spriteTempPosition.xTile - this.spritePosition.xTile;

        if (this.contentLayer.position.y !== this.spriteTempPosition.yTile * TILE_SIZE) {
            this.contentLayer.position.y += yDiff * TILE_SIZE / 8;
            this.animating = true;
        } else {
            this.spritePosition.yTile = this.spriteTempPosition.yTile;
            this.animating = false;
        }
        
        if (this.contentLayer.position.x !== this.spriteTempPosition.xTile * TILE_SIZE) {
            this.contentLayer.position.x += xDiff * TILE_SIZE / 8;
            this.animating = true;
        } else {
            this.spritePosition.xTile = this.spriteTempPosition.xTile;
            this.animating = false;
        }

        requestAnimationFrame(this.animate.bind(this));
    }

    keyPressed(event: KeyboardEvent) {
        if (
            !KEYS[event.key] ||
            this.animating ||
            //Only allow up for first move
            (this.scoresService.liveMovesLeft === STARTING_MOVES && KEYS[event.key] !== KEYS.w) 
        ) return; 

        switch (KEYS[event.key]) {
        case KEYS.w:
            if (this.spritePosition.yTile > 0) {
                this.spriteTempPosition.yTile -= 1;
            }
            break;    
        case KEYS.a:
            if (this.spritePosition.xTile > 0) {
                this.spriteTempPosition.xTile -= 1;
            }
            break;
        case KEYS.s:
            if (this.spritePosition.yTile < GRID_HEIGHT - 1) {
                this.spriteTempPosition.yTile += 1;
            }
            break;

        case KEYS.d:
            if (this.spritePosition.xTile < GRID_WIDTH - 1) {
                this.spriteTempPosition.xTile += 1;
            }
            break;
        default:
            break;
        }

        const isInEndZone = this.spriteTempPosition.yTile === GRID_HEIGHT - 1;
        this.scoresService.makeMove(isInEndZone);
    }
}