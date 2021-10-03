interface Level {
    id: number;
    required_stars: number;
    three_star: number; 
}

export const LEVELS: Level[] = [
    {
        id: 1,
        required_stars: 0,
        three_star: 262
    },
    {
        id: 2,
        required_stars: 2,
        three_star: 481
    },
    {
        id: 3,
        required_stars: 5,
        three_star: 262
    }
]