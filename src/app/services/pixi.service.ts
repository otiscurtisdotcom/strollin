import * as PIXI from 'pixi.js';
import { Injectable } from '@angular/core';
import { canvasHeight, canvasWidth, KEYS, STARTING_MOVES, startX, startY, tileSize } from './constants';
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

interface Coords {
    x: number;
    y: number;
}

@Injectable({
    providedIn: 'root'
})
export class PixiService {
    public readonly app = new PIXI.Application({
        height: canvasHeight,
        width: canvasWidth,
        backgroundColor: 0x669955,
    });

    private readonly contentLayer = new PIXI.Container();
    private readonly backgroundLayer = new PIXI.Container();
    private readonly renderer = PIXI.autoDetectRenderer();
    private readonly loader = new PIXI.Loader;

    //CREATE CONTENT
    private readonly sprite = new PIXI.Graphics().beginFill(0xe74c3c).drawRect(0, 0, tileSize, tileSize);
    private spritePosition: Coords;
    private spriteNewPosition: Coords;
    
    private animating = false;

    constructor(
        private readonly scoresService: ScoresService,
    ) {}

    setupGame() {
        //CREATE APP
        this.app.view.style.height = `${canvasHeight / 3}px`;
        this.app.view.style.width = `${canvasWidth / 3}px`;

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
        this.spritePosition = { x: startX, y: startY };
        this.spriteNewPosition = { x: startX, y: startY };
        this.contentLayer.position.set(startX,startY);
    }

    animate() {
        this.renderer.render(this.contentLayer);

        const yDiff = this.spriteNewPosition.y - this.spritePosition.y;
        const xDiff = this.spriteNewPosition.x - this.spritePosition.x;

        if (this.contentLayer.position.y !== this.spriteNewPosition.y) {
        this.contentLayer.position.y += yDiff / (tileSize / 8);
        this.animating = true;
        } else {
        this.spritePosition.y = this.spriteNewPosition.y;
        this.animating = false;
        }
        
        if (this.contentLayer.position.x !== this.spriteNewPosition.x) {
        this.contentLayer.position.x += xDiff / (tileSize / 8);
        this.animating = true;
        } else {
        this.spritePosition.x = this.spriteNewPosition.x;
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
            if (this.spritePosition.y > 0) {
            this.spriteNewPosition.y -= tileSize;
            }
            break;
            
        case KEYS.a:
            if (this.spritePosition.x > 0) {
            this.spriteNewPosition.x -= tileSize;
            }
            break;
            
        case KEYS.s:
            if (this.spritePosition.y < canvasHeight - tileSize) {
            this.spriteNewPosition.y += tileSize;
            }
            break;

        case KEYS.d:
            if (this.spritePosition.x < canvasWidth - tileSize) {
            this.spriteNewPosition.x += tileSize;
            }
            break;

        default:
            break;
        }

        const isInEndZone = this.spriteNewPosition.y === canvasHeight - tileSize;
        this.scoresService.makeMove(isInEndZone);
    }
}