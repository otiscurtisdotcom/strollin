import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { ALL_STARS } from '../constants/constants'; 
import { LEVELS } from '../constants/levels';
import { PixiService } from '../services/pixi.service';
import { Stars } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class HasEnoughStarsGuard implements CanActivate {
    constructor(
        private readonly pixiService: PixiService,
        private readonly router: Router,
    ) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const currentLevel = route.url[1].path;
        const requiredStars = LEVELS.find(
            level => `${level.id}` === currentLevel
        ).required_stars;
        
        let totalStars = 0;
        const allStarsLoaded: Stars[] = JSON.parse(localStorage.getItem(ALL_STARS) || "[]");
        allStarsLoaded.forEach(level => totalStars += level.levelStars);
        
        return totalStars >= requiredStars;
    }
}