import * as PIXI from 'pixi.js';
import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  app = new PIXI.Application({
    height: 400,
    resolution: 3,
    width: 400,
  });
  contentLayer = new PIXI.Container();

  constructor(
    private elementRef: ElementRef,
  ) {}

  ngOnInit() {
    this.playGame();
  }

  playGame() {
    console.log('PLAY...');

    //CREATE APP
    this.app.view.style.height = '400px';
    this.app.view.style.width = '400px';
    this.elementRef.nativeElement.appendChild(this.app.view);

    //CREATE CONTENT
      const graphics = new PIXI.Graphics();
      graphics.beginFill(0xe74c3c);
      graphics.drawCircle(60, 185, 40);

    //ADD CONTENT TO LAYER
    this.contentLayer.addChild(graphics);

    //ADD LAYER TO STAGE
    this.app.stage.addChild(this.contentLayer);
  }
}
