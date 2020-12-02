import { Component, ElementRef, HostListener, Input, OnChanges, OnInit } from '@angular/core';

import { PixiService } from '../services/pixi.service';

@Component({
  selector: 'game',
  template: '',
})
export class GameComponent implements OnInit, OnChanges {
  @Input() isPlaying = false;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly pixiService: PixiService,
  ) {}

  ngOnInit() {
    this.pixiService.setupGame();
    this.elementRef.nativeElement.appendChild(this.pixiService.app.view);
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
