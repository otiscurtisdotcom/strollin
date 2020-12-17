interface Level {
    id: number;
    required_stars: number;
    two_star: number;
    three_star: number; 
}

export const LEVELS: Level[] = [
    {
        id: 1,
        required_stars: 0,
        two_star: 240,
        three_star: 262
    },
    {
        id: 2,
        required_stars: 2,
        two_star: 432,
        three_star: 481
    },
    {
        id: 3,
        required_stars: 5,
        two_star: 240,
        three_star: 262
    }
]