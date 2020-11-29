import * as PIXI from 'pixi.js';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { InformationService } from './information/information.service';

enum KEYS {
  "w" = "UP",
  "a" = "LEFT",
  "s" = "DOWN",
  "d" = "RIGHT",
};

const tileSize = 100;
const canvasHeight = 1000;
const canvasWidth = 1000;

interface Coords {
  x: number;
  y: number;
}

@Component({
  selector: 'game',
  template: '',
})
export class GameComponent implements OnInit {
  public app = new PIXI.Application({
    height: canvasHeight,
    width: canvasWidth,
  });
  private contentLayer = new PIXI.Container();
  private renderer = PIXI.autoDetectRenderer();

  //CREATE CONTENT
  private sprite = new PIXI.Graphics().beginFill(0xe74c3c).drawRect(0, 0, tileSize, tileSize);
  private spritePosition: Coords = { x: 0, y: 0 };
  private spriteNewPosition: Coords = { x: 0, y: 0 };
  
  private animating = false;

  private liveScore = 0;
  private liveMovesLeft = this.informationService.startingMoves;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly informationService: InformationService,
  ) {}

  ngOnInit() {
    this.playGame();
  }

  playGame() {
    //CREATE APP
    this.app.view.style.height = `${canvasHeight / 2}px`;
    this.app.view.style.width = `${canvasWidth / 2}px`;
    this.elementRef.nativeElement.appendChild(this.app.view);

    //ADD CONTENT TO LAYER
    this.contentLayer.addChild(this.sprite);

    //ADD LAYER TO STAGE
    this.app.stage.addChild(this.contentLayer);

    //ANIMATE
    this.animate();
  }

  animate() {
    this.renderer.render(this.contentLayer);

    const yDiff = this.spriteNewPosition.y - this.spritePosition.y;
    const xDiff = this.spriteNewPosition.x - this.spritePosition.x;

    if (this.contentLayer.position.y !== this.spriteNewPosition.y) {
      this.contentLayer.position.y += yDiff / 10;
      this.animating = true;
    } else {
      this.spritePosition.y = this.spriteNewPosition.y;
      this.animating = false;
    }

    if (this.contentLayer.position.x !== this.spriteNewPosition.x) {
      this.contentLayer.position.x += xDiff / 10;
      this.animating = true;
    } else {
      this.spritePosition.x = this.spriteNewPosition.x;
      this.animating = false;
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!KEYS[event.key] || this.animating) return;

    this.liveScore += 1;
    this.informationService.score.next(this.liveScore);

    this.liveMovesLeft -= 1;
    this.informationService.movesLeft.next(this.liveMovesLeft);

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
    }
  }
}
