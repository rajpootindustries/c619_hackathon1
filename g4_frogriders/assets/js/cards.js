class Card {
    constructor(frogs, points) {
        
        this.trophyPoints = 0; 
        this.frogsColors = {"red": 0, "yellow": 0, "blue": 0, "brown": 0};

        /*
            public: 1 red 1 blue 3 trophy
                    1 red 1 brown 2 trophy
                    5 any 5 trophy
                    1 red 1 yellow 3 trohpy
                    1 yellow 1 brown 2 trophy
                    1 blue 1 brown 2 trophy

            privlage: 2 red/blue/yellow-2 trophy (x6)
                      move (x3) 2, 2, 3 trophy (diagonal, l shaped, runningstart) (x6)
                      pure trophy 4 trophy (x2)
                      1 trophy per 1 brown, 2 trophy for 2 privlage cards, 1 privilage and 1 frog pair for 2 trophy (9x)
                      required: fewest trohpy cards 5 trophy (x1) fewer frog by 5, by 3 (+5, +3) (x3)

            private:  2 red, 5 (x2)
                      2 yellow, 6 (x2)
                      4 all, 5 (x5)
                      2 blue, 6 (x1)
                      1 red 1 yellow 1 blue, 4 (x1)
                      1 red 1 yellow 1 brown, 4 (x1)
                      1 blue, 1 brown, 
        */
    }
}