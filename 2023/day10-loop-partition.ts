class Day10 {

    // View challenge: https://adventofcode.com/2023/day/10

    solveForPartOne(input: string): number {
        const loopLen = this.getLoop(input).originalLoopLen;
        return Math.ceil((loopLen) / 2);
    }

    solveForPartTwo(input: string): number {
        const oldRows = input.split('\n');
        // pad grid; add an empty row between each original row, and same for cols
        // this way we can more easily traverse between adjacent, disconnected loop points
        const rows = this.padGrid(input);
        const {paddedLoopPoints, originalLoopLen} = this.getLoop(input); 
        
        // Find the OUTER area (not inner - we will get that later)
        // Start with any outer point; we know [0,0] is outer and that the loop 
        // does not touch the edge of the grid at any point
        // because we added padding to the outside with `padGrid`, and therefore the whole
        // outer section is connected.
        let visited = new Set();
        let toVisit = new Set(['0,0']); // list of outer (row,col) pairs that are next up to visit
        let outerCount = 0;
        while (toVisit.size > 0) {
            const popped = this.popSet(toVisit)!;
            const [row, col] = popped.split(',').map(x => parseInt(x));
            visited.add(popped);

            // we don't include the padded spaces in our count of outer nodes, but we still traverse them
            if (rows[row][col] !== ' ') {
                outerCount++;
            }

            // Get any surrounding outer points and add to to_visit. As long as it's a neighbor
            // and not a part of the loop, we can assume it is also an outer point.
            // west / left
            const leftPoint = `${row},${col-1}`
            if (col > 0 && !paddedLoopPoints.has(leftPoint) && !visited.has(leftPoint)) {
                toVisit.add(leftPoint);
            }
            // east / right
            const rightPoint =  `${row},${col+1}`
            if (col < rows[0].length - 1 && !paddedLoopPoints.has(rightPoint) && !visited.has(rightPoint)) {
                toVisit.add(rightPoint);
            }
            // north
            const abovePoint =  `${row-1},${col}`
            if (row > 0 && !paddedLoopPoints.has(abovePoint) && !visited.has(abovePoint) ) {
                toVisit.add(abovePoint);
            }
            // south
            const belowPoint =  `${row+1},${col}`
            if (row < rows.length - 1 && !paddedLoopPoints.has(belowPoint) && !visited.has(belowPoint)) {
                toVisit.add(belowPoint);
            }
        }
        // the inner area = total area - outer area - loop area
        return (oldRows.length * oldRows[0].length) - outerCount - (originalLoopLen);
    }

    // ====== Helpers ======

    /** Given a grid with a continuous loop containing 'S', returns [originalLoopLen], which is
     * the length of this loop. Also returns [paddedLoopPoints], which is a set of all the 
     * coordinates of points within the loop in a 'padded'/'expanded' version 
     * of the grid (with empty rows and cols added between each) */
    getLoop(input: string): {paddedLoopPoints: Set<string>, originalLoopLen: number} {
        const rows = input.split('\n');
        // find the start position ('S')
        let [row, col] = this.getStartPos(rows);
        let paddedRow = this.getPaddedIndex(row);
        let paddedCol = this.getPaddedIndex(col);


        // Keep track of all points that are part of the loop in the padded version of the grid.
        // This includes points that correspond to a loop point of the original grid,
        // As well as the extra padding spaces between them and their connected pipes
        let paddedLoopPoints = new Set([`${paddedRow},${paddedCol}`]); 

        // Find the next part of the loop connected to the starting point (in original grid)
        // You need to check in all directions because 'S' can be any type of pipe
        if (col > 0 && ['-', 'L', 'F'].includes(rows[row][col-1])) { // left / west
            col--;
        } else if (row > 0 && ['|', '7', 'F'].includes(rows[row - 1][col])) { // north
            row--;
        } else if (col < rows[row].length - 1 && ['-', 'J', '7'].includes(rows[row][col+1])) { // right / east
            col++;
        } else if (row < rows.length - 1 && ['|', 'L', 'J'].includes(rows[row + 1][col])) { // south
            row++;
        }

        let dist = 1; // the total length of the original loop (not including space padding)
        let prev_row = row;
        let prev_col = col;

        // follow the path of the loop through the original grid according to each pipe's directions
        // while also recording the equivalent points on the array padded with spaces
        while (rows[row][col] !== 'S') { // when we get back to S, the whole loop has been traversed
            paddedRow = this.getPaddedIndex(row);
            paddedCol = this.getPaddedIndex(col);
            paddedLoopPoints.add(`${paddedRow},${paddedCol}`);
            dist++;

            // figure out which direction we came from previously
            let previousDirection: string | undefined = undefined;
            if (prev_col !== col) {
                previousDirection = prev_col < col ? 'west' : 'east';
            } else if (prev_row !== row) {
                previousDirection = prev_row < row ? 'north' : 'south';
            } 
            prev_row = row;
            prev_col = col;

            const currentSymbol = rows[row][col];

            // include extra spacing around the point in padded loop set to keep it continuous
            if (['-', 'L', 'F'].includes(currentSymbol)) { // right / east
                paddedLoopPoints.add(`${paddedRow},${paddedCol+1}`); // 
            }
            if (['|', '7', 'F'].includes(currentSymbol)) { // south
                paddedLoopPoints.add(`${paddedRow+1},${paddedCol}`);
            }
            if (['-', 'J', '7'].includes(currentSymbol)) { // left / west
                paddedLoopPoints.add(`${paddedRow},${paddedCol-1}`);
            }
            if (['|', 'L', 'J'].includes(currentSymbol)) { // north
                paddedLoopPoints.add(`${paddedRow-1},${paddedCol}`);
            }

            switch (currentSymbol) {
                case '-': // connects east and west directions
                    // travel to the next connected pipe in the original grid
                    if (previousDirection === 'east') col--; // east -> west
                    else col++; // west -> east
                    break;
                case '|': // north and south
                    if (previousDirection === 'north') row++; // north -> south
                    else row--; // south -> north
                    break;
                case 'F': // south and east
                    if (previousDirection === 'east') row++; // east -> south
                    else col++; // south -> east
                    break;
                case 'J': // north and west
                    if (previousDirection === 'north') col--; // north -> west
                    else row--; // west -> north
                    break;
                case 'L': // north and east
                    if (previousDirection === 'north') col++; // north -> east
                    else row--; // east -> north
                    break;
                case '7': // south and west
                    if (previousDirection === 'south') col--; // south -> west
                    else row++; // west -> south
                    break;
                default:
            }
            
        }
        return {paddedLoopPoints, originalLoopLen: dist};
    }

    /** Pops any item from a set and returns the item. */
    popSet<T>(set: Set<T>) {
        for (const value of set) {
          set.delete(value);
          return value;
        }
        return undefined;
    }

    /** Adds padding of spaces in between each row and column, and on the borders
    * ex:
    *                    '           '
    * 'F---7'            ' F - - - 7 '
    * 'L---J'      =>    '           '
    *                    ' L - - - J '
    *                    '           '
    */
    padGrid(input: string): string[] {
        const oldRows = input.split('\n');
        let rows: string[] = [];
        const emptyRow = new Array(oldRows[0].length  * 2 + 1).join(' ');
        rows.push(emptyRow); 
        for (let r of oldRows) {
            rows.push(' ' + Array.from(r).join(' ') + ' '); // pad columns with spaces
            rows.push(emptyRow); 
        }
        return rows;

    }

    /** Returns the [row, col] position of the start point, S */
    getStartPos(rows: string[]) {
        let row = 0;
        let col = 0;
        for (let r = 0; r < rows.length; r++) {
            col = rows[r].indexOf('S');
            if (col !== -1) {
                row = r;
                break;
            }
        }
        return [row, col];
    }

    /** The padded grid doubles the amount of rows and columns, and additionally adds 1 more to border
     * in the 0 position */
    getPaddedIndex(n: number) {
        return n * 2 + 1;
    }
}

export default new Day10;