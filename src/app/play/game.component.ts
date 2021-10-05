import { Component, ElementRef, HostListener, Input, OnChanges, OnInit } from '@angular/core';

import { PixiService } from '../services/pixi.service';
import { ScoresService } from '../services/scores.service';

@Component({
  selector: 'game',
  template: '',
})
export class GameComponent implements OnInit, OnChanges {
  @Input() isPlaying = false;
  @Input() levelId!: number;

  readonly app = this.pixiService.app;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly pixiService: PixiService,
    private readonly scoresService: ScoresService
  ) {}

  ngOnInit() {
    this.scoresService.showWelcome();
    this.pixiService.setupGame(this.levelId);
    this.elementRef.nativeElement.appendChild(this.app.view);
  }

  ngOnChanges() {
    if (!this.isPlaying) this.pixiService.resetPositions();
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.isPlaying) return;
    this.pixiService.keyPressed(event);
  }
}
