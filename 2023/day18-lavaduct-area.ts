class Day18 {

    // View challenge: https://adventofcode.com/2023/day/18

    solveForPartOne(input: string): number {
        const instructions: [[number, number], number][] = input.split('\n').map(l => l.split(' ').slice(0,2)).map(i => [this.getDxDy(i[0]), parseInt(i[1])]);
        let pointsOnEdge = instructions.map(i => i[1]).reduce((a,b) => a + b, 0);
        const vertices: [number, number][] = [];
        let [r, c] = [0, 0];
        for (let i = 0; i < instructions.length; i++) {
            vertices.push([r,c]);
            let [dir, dist] = instructions[i];
            [r, c] = [r + dir[0] * dist, c + dir[1] * dist];
        }
        const area = this.shoelaceLarge(vertices.reverse()); // make it counter-clockwise
        const insidePoints = this.picks(pointsOnEdge, area);

        return insidePoints + pointsOnEdge;
    }

    solveForPartTwo(input: string): number {
        const hexCodes: string[] = input.split('\n').map(l => l.match(/\(#(.*)\)/)![1]);

        const instructions: [[number, number], number][] = hexCodes.map(hexCode => {
            const dist = parseInt(hexCode.substring(0, 5), 16);
            const dir = this.getDxDy(parseInt(hexCode[5]));
            return [dir, dist];
        });
        let pointsOnEdge = instructions.map(i => i[1]).reduce((a,b) => a + b, 0);

        const vertices: [number, number][] = [];
        let [r, c] = [0,0];
        for (let i = 0; i < instructions.length; i++) {
            vertices.push([r,c]);
            let [dir, dist] = instructions[i];
            [r, c] = [r + dir[0] * dist, c + dir[1] * dist];
        }
        const area = this.shoelaceLarge(vertices.reverse()); // make it counter-clockwise
        const insidePoints = this.picks(pointsOnEdge, area);

        return insidePoints + pointsOnEdge;
    }
    
    // Uses Shoelace algorithm with modification to prevent overflow for large numbers.
    // Assumes vertices are in counter-clockwise order
    // https://www.101computing.net/the-shoelace-algorithm/
    shoelaceLarge(vertices: [number, number][]) {
        let sum = 0;
        for (let i = 0; i < vertices.length; i++) {
            const nextI = i === vertices.length - 1 ? 0 : i + 1;
            sum += vertices[i][0] * vertices[nextI][1] - vertices[i][1] * vertices[nextI][0];
        }
        return Math.abs(sum) / 2;
    }

    // Pick's Theorem: returns inside point count
    // https://en.wikipedia.org/wiki/Pick%27s_theorem
    picks(edgePoints: number, area: number) {
        return area + 1 - (edgePoints / 2);
    }

    // From the encoded direction (L, R, U, D) or (0, 1, 2, 3) in the instructions,
    // return the [change in row, change in column] that represents the direction.
    getDxDy(direction: string | number) : [number, number] {
        switch (direction) {
            case 'L':
            case 2:
                return [0, -1];
            case 'R':
            case 0:
                return [0, 1];
            case 'D':
            case 1:
                return [1, 0];
            case 'U':
            case 3:
            default:
                return [-1, 0];
        }
    }
}

export default new Day18;