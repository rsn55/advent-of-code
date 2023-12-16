class Day16 {

    // View challenge: https://adventofcode.com/2023/day/16

    solveForPartOne(input: string): number {
        const rows = input.split('\n');
        return this.followBeam([0,0], rows, new Set<string>(), new Set<string>(), 'R').size;
    }

    solveForPartTwo(input: string): number {
        const rows = input.split('\n');
        let maxEnergized = 0;
        // test all starting positions in first row and last row
        for (let c = 0; c < rows[0].length; c++) {
            // first row
            let energized = this.followBeam([0, c], rows, new Set<string>(), new Set<string>(), 'D');
            maxEnergized = Math.max(maxEnergized, energized.size);
            // last row
            energized = this.followBeam([rows.length - 1, c], rows, new Set<string>(), new Set<string>(), 'U');
            maxEnergized = Math.max(maxEnergized, energized.size);
        }
        // test last col and first col
        for (let r = 0; r < rows.length; r++) {
            // first col
            let energized = this.followBeam([r,0], rows, new Set<string>(), new Set<string>(), 'R');
            maxEnergized = Math.max(maxEnergized, energized.size);
            // last col
            energized = this.followBeam([r,rows[0].length - 1], rows, new Set<string>(), new Set<string>(), 'L');
            maxEnergized = Math.max(maxEnergized, energized.size);
        }
        return maxEnergized;
    }

    /** Returns a set of energized coordinates 
     * @param currentPos - current [row, col] coordinates of the light beam
     * @param rows - the grid
     * @param energized - set of [row, col] coordinates that light passes through
     * @param seen - set of [row, col, direction] states that have already been processed (for detecting cycles)
     * @param direction - the current direction of the beam of light (L, R, U, D)
     * @returns set of energized coordinates
    */
    followBeam(currentPos: [number, number], rows: string[], energized: Set<string>, seen: Set<string>, direction: Direction) : Set<string> {
        let [row, col] = currentPos;
        if (seen.has(`${row},${col},${direction}`)) {
            // if we have already passed through this point going the same direction,
            // we have entered a cycle where no new energized points will be found, so return
            return energized;
        }
        if (row < 0 || col < 0 || row >= rows.length || col >= rows[0].length) {
            // we hit an outside edge of the grid and cannot go further
            return energized;
        }
        
        energized.add(`${row},${col}`);
        seen.add(`${row},${col},${direction}`);

        switch(rows[row][col]) {
            case '.':
                // keep going in same direction
                if (direction === 'L') {
                    col--;
                } else if (direction === 'R') {
                    col++;
                } else if (direction === 'U') {
                    row--;
                } else if (direction === 'D'){
                    row++;
                }
                break;
            case '\\':
                // turn 90 degrees from current direction
                if (direction === 'L') {
                    // left -> up
                    row--;
                    direction = 'U';
                } else if (direction === 'R') {
                    // right -> down
                    row++;
                    direction = 'D';
                } else if (direction === 'U') {
                    // up -> left
                    col--;
                    direction = 'L';
                } else if (direction === 'D') {
                    // down -> right
                    col++;
                    direction = 'R';
                }
                break;
            case '/':
                // turn 90 degrees from current direction
                if (direction === 'L') {
                    // left -> down
                    row++;
                    direction = 'D';
                } else if (direction === 'R') {
                    // right -> up
                    row--;
                    direction = 'U';
                } else if (direction === 'U') {
                    // up -> right
                    col++;
                    direction = 'R';
                } else if (direction === 'D') { 
                    // down -> left
                    col--;
                    direction = 'L';
                }
                break;
            case '|':
                if (direction === 'U') {
                    // continue up
                    row--;
                } else if (direction === 'D') { 
                    // continue down
                    row++;
                } else { // split in 2 directions
                    // go up
                    energized = this.followBeam([row-1, col], rows, energized, seen, 'U');
                    // then go down
                    return this.followBeam([row+1, col], rows, energized, seen, 'D');
                }
                break;
            case '-':
                if (direction === 'L') {
                    // continue left
                    col--;
                } else if (direction === 'R'){ 
                    // continue right
                    col++;
                } else {  // split in 2 directions
                    // go left
                    energized = this.followBeam([row, col-1], rows, energized, seen, 'L');
                    // then go right
                    return this.followBeam([row, col+1], rows, energized, seen, 'R');
                }
                break;
        }
        return this.followBeam([row, col], rows, energized, seen, direction);
    }
}

type Direction = 'L' | 'R' | 'U' | 'D';


export default new Day16;