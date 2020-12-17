import { Injectable } from "@angular/core";
import { CanActivate, Router } from '@angular/router';
import { PixiService } from '../services/pixi.service';

@Injectable({
    providedIn: 'root'
})
export class IsLoadedGuard implements CanActivate {
    constructor(
        private readonly pixiService: PixiService,
        private readonly router: Router,
    ) {}

    canActivate(): boolean {
        const contentLoaded: boolean = this.pixiService.isLoaded;
        if (!contentLoaded) this.router.navigate(['']);
        return contentLoaded;
    }
}