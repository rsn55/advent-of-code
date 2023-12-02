class Day2 {

    // View challenge: https://adventofcode.com/2023/day/2

    solveForPartOne(input: string): number {
        const games = input.split('\n');
        const config = {red: 12, green: 13, blue: 14};

        let idSum = 0;
        for (let game of games) {
            const id = parseInt(game.match(/(\d+)/g)![0]);
            const subsets = game.substring(game.indexOf(':') + 1).split(';');
            let isPossible = true;
            for (let subset of subsets) {
                const counts = this.getColorCounts(subset);
                if (counts.red > config.red || counts.blue > config.blue || counts.green > config.green) {
                    isPossible = false;
                }
            }
            if (isPossible) {
                idSum += id;
            }
        }
        return idSum;
    }

    solveForPartTwo(input: string): number {
        const games = input.split('\n');
        let powerSum = 0;
        for (let game of games) {
            const subsets = game.substring(game.indexOf(':') + 1).split(';');
            let minCubes = {red: 0, green: 0, blue: 0};
            for (let subset of subsets) {
                const counts = this.getColorCounts(subset);
                
                minCubes.red = Math.max(counts.red, minCubes.red);
                minCubes.green = Math.max(counts.green, minCubes.green);
                minCubes.blue = Math.max(counts.blue, minCubes.blue);
            }
            powerSum += minCubes.red * minCubes.green * minCubes.blue;
        }
        return powerSum;
    }

     // ====== Helpers ======

    getColorCounts(subset: string): {red: number, green: number, blue: number} {
        const red = this.getColorCount(subset, 'red');
        const blue = this.getColorCount(subset, 'blue');
        const green = this.getColorCount(subset, 'green');
        return {red, blue, green};
    }

    getColorCount(subset: string, color: string): number {
        const regex = new RegExp('(\\d+)\\s' + color);
        const count = subset.match(regex)?.[1];
        return parseInt(count || '0');
    }
}

export default new Day2;