interface Terrain {
    adj_points: number;
    passable: boolean;
    wood?: number;
    wood_chopped?: boolean;
}

export const TERRAIN_INFO: Terrain[] = [
    // 0: Grass
    {
        adj_points: 1,
        passable: true
    },
    // 1: START / END
    {
        adj_points: 0,
        passable: true
    },
    // 2: START / END
    {
        adj_points: 0,
        passable: true
    },
    // 3: START / END
    {
        adj_points: 0,
        passable: true
    },
    // 4: Road
    {
        adj_points: -3,
        passable: true
    },
    // 5: Road
    {
        adj_points: -3,
        passable: true
    },
    // 6: Road
    {
        adj_points: -3,
        passable: true
    },
    // 7: Road
    {
        adj_points: -3,
        passable: true
    },
    // 8: Road
    {
        adj_points: -3,
        passable: true
    },
    // 9: Road
    {
        adj_points: -3,
        passable: true
    },
    // 10: Road
    {
        adj_points: -3,
        passable: true
    },
    // 11: Road
    {
        adj_points: -3,
        passable: true
    },
    // 12: Road
    {
        adj_points: -3,
        passable: true
    },
    // 13: Road
    {
        adj_points: -3,
        passable: true
    },
    // 14: Road
    {
        adj_points: -3,
        passable: true
    },
    // 15: Road
    {
        adj_points: -3,
        passable: true
    },
    // 16: Road
    {
        adj_points: -3,
        passable: true
    },
    // 17: Water
    {
        adj_points: 5,
        passable: false
    },
    // 18: Water
    {
        adj_points: 5,
        passable: false
    },
    // 19: Water
    {
        adj_points: 5,
        passable: false
    },
    // 20: Water
    {
        adj_points: 5,
        passable: false
    },
    // 21: Water
    {
        adj_points: 5,
        passable: false
    },
    // 22: Water
    {
        adj_points: 5,
        passable: false
    },
    // 23: Water
    {
        adj_points: 5,
        passable: false
    },
    // 24: Water
    {
        adj_points: 5,
        passable: false
    },
    // 25: Water
    {
        adj_points: 5,
        passable: false
    },
    // 26: Water
    {
        adj_points: 5,
        passable: false
    },
    // 27: Water
    {
        adj_points: 5,
        passable: false
    },
    // 28: Water
    {
        adj_points: 5,
        passable: false
    },
    // 29: Water
    {
        adj_points: 5,
        passable: false
    },
    // 30: Tree
    {
        adj_points: 10,
        passable: false
    },
    // 31: Tree
    {
        adj_points: 10,
        passable: false
    },
    // 32: Tree
    {
        adj_points: 10,
        passable: false
    },
    // 33: Deadwood
    {
        adj_points: 2,
        passable: false,
        wood: 1
    },
    // 34: Deadwood
    {
        adj_points: 2,
        passable: false,
        wood: 1
    },
]