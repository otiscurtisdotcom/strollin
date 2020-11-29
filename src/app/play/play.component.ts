import * as PIXI from 'pixi.js';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

enum KEYS {
  "w" = "UP",
  "a" = "LEFT",
  "s" = "DOWN",
  "d" = "RIGHT",
};

const tileSize = 100;

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  public app = new PIXI.Application({
    height: 1000,
    width: 1000,
  });
  private contentLayer = new PIXI.Container();
  private renderer = PIXI.autoDetectRenderer();

  //CREATE CONTENT
  private graphics = new PIXI.Graphics().beginFill(0xe74c3c).drawRect(0, 0, tileSize, tileSize);

  constructor(
    private elementRef: ElementRef,
  ) {}

  ngOnInit() {
    this.playGame();
  }

  playGame() {
    //CREATE APP
    this.app.view.style.height = '500px';
    this.app.view.style.width = '500px';
    this.elementRef.nativeElement.appendChild(this.app.view);

    //ADD CONTENT TO LAYER
    this.contentLayer.addChild(this.graphics);

    //ADD LAYER TO STAGE
    this.app.stage.addChild(this.contentLayer);

    //ANIMATE
    this.animate();
  }

  animate() {
    this.renderer.render(this.contentLayer);
    requestAnimationFrame(this.animate.bind(this));
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!KEYS[event.key]) return;
    console.log(KEYS[event.key]);

    switch (KEYS[event.key]) {
      case KEYS.w:
        this.contentLayer.position.y -= tileSize;
        break;
        
      case KEYS.a:
        this.contentLayer.position.x -= tileSize;
        break;
        
      case KEYS.s:
        this.contentLayer.position.y += tileSize;
        break;

      case KEYS.d:
        this.contentLayer.position.x += tileSize;
        break;
    }
  }
}
