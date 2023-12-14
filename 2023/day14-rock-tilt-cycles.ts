class Day14{

    // View challenge: https://adventofcode.com/2023/day/14

    solveForPartOne(input: string): number {
        const rows = input.split('\n');
        // tilt rocks north
        for (let r = 0; r < rows.length; r++) {
            for (let c = 0; c < rows[0].length; c++) {
                if (rows[r][c] === 'O') {
                    // move north until you hit another 'O' or a '#', or hit the top
                    let testRow = r - 1;
                    while (testRow >= 0 && rows[testRow][c] === '.') {
                        testRow--;
                    }
                    // clear old row
                    rows[r] = rows[r].substring(0,c) + '.' + rows[r].substring(c+1);
                    // add rock to new row
                    const newRow = testRow + 1;
                    rows[newRow] = rows[newRow].substring(0,c) + 'O' + rows[newRow].substring(c+1);
                }
            }
        }
        // sum the load on the north side
        return this.getNorthLoad(rows);
    }

    // Runs in < 250 ms
    solveForPartTwo(input: string): number {
        const finalCycle = 1000000000;
        let rows = input.split('\n');
        let cycleNum = 0;
        let seenLoads: number[] = [];
        let patternStartIndex = 0;

        while (cycleNum < finalCycle) {
            cycleNum++;
            rows = this.applyTiltCycle(rows);
            let totalLoad = this.getNorthLoad(rows);

            // find a repeating pattern so that we can stop early
            // if we have seen this load result before, check if we have seen 2 full repeating load patterns
            // ex: [1, 1, 1, 2, 3, 1, 2, 3] => 2 pattern repeats! we can can break & the pattern is [1,2,3]
            // ex: [1, 1, 1, 2, 3, 1, 2] => don't break yet
            if (seenLoads.includes(totalLoad)) {
                const firstOccurence = seenLoads.indexOf(totalLoad);
                const secondOccurence = seenLoads.lastIndexOf(totalLoad);
                if (firstOccurence >= 0 && secondOccurence >= 0 && secondOccurence - firstOccurence > 1) {
                    const pattern1 = seenLoads.slice(firstOccurence, secondOccurence);
                    const pattern2 = seenLoads.slice(secondOccurence);
                    if (this.areArraysEqual(pattern1, pattern2)) {
                        // two repeated patterns in a row, break
                        patternStartIndex = secondOccurence;
                        break;
                    }
                }
            }
            seenLoads.push(totalLoad);
        }
        // since we know the repeating pattern of loads and where it starts, we can predict the load at `finalCycle`
        const patternLength = cycleNum - patternStartIndex - 1;
        const remainder = (finalCycle - patternStartIndex) % (patternLength);
        const loadAtFinalCycle = seenLoads[patternStartIndex + remainder - 1];
        return loadAtFinalCycle;
    }

    getNorthLoad(rows: string[]) : number {
        let totalLoad = 0;
        for (let r = 0; r < rows.length; r++) {
            const rowPower = rows.length - r;
            const roundRocks = [...rows[r].matchAll(/O/g)].length
            totalLoad += roundRocks * rowPower;
        }
        return totalLoad;
    }

    // tilt north, west, south, then east for a single cycle
    applyTiltCycle(rows: string[]) {
        // tilt north
        for (let r = 0; r < rows.length; r++) {
            for (let c = 0; c < rows[0].length; c++) {
                if (rows[r][c] === 'O') {
                    // move north until you hit another 'O' or a '#', or hit the top
                    let testRow = r - 1;
                    while (testRow >= 0 && rows[testRow][c] === '.') {
                        testRow--;
                    }
                    // clear old row
                    rows[r] = rows[r].substring(0,c) + '.' + rows[r].substring(c+1);
                    // add round rock to new row
                    const newRow = testRow + 1;
                    rows[newRow] = rows[newRow].substring(0,c) + 'O' + rows[newRow].substring(c+1);
                }
            }
        }
        // tilt west
        for (let r = 0; r < rows.length; r++) {
            for (let c = 0; c < rows[0].length; c++) {
                if (rows[r][c] === 'O') {
                    // move west until you hit another 'O' or a '#', or hit the left side
                    let testCol = c - 1;
                    while (testCol >= 0 && rows[r][testCol] === '.') {
                        testCol--;
                    }
                    // clear old col
                    rows[r] = rows[r].substring(0,c) + '.' + rows[r].substring(c+1);
                    // add round rock to new col
                    const newCol = testCol + 1;
                    rows[r] = rows[r].substring(0,newCol) + 'O' + rows[r].substring(newCol+1);
                }
            }
        }            
        // tilt south
        for (let r = rows.length - 1; r >= 0; r--) {
            for (let c = 0; c < rows[0].length; c++) {
                if (rows[r][c] === 'O') {
                    let testRow = r + 1;
                    while (testRow < rows.length && rows[testRow][c] === '.') {
                        testRow++;
                    }
                    rows[r] = rows[r].substring(0,c) + '.' + rows[r].substring(c+1);
                    const newRow = testRow - 1;
                    rows[newRow] = rows[newRow].substring(0,c) + 'O' + rows[newRow].substring(c+1);
                }
            }
        }
        // tilt east
        for (let r = 0; r < rows.length; r++) {
            for (let c = rows[0].length - 1; c >= 0; c--) {
                if (rows[r][c] === 'O') {
                    let testCol = c + 1;
                    while (testCol <= rows[0].length - 1 && rows[r][testCol] === '.') {
                        testCol++;
                    }
                    rows[r] = rows[r].substring(0,c) + '.' + rows[r].substring(c+1);
                    const newCol = testCol - 1;
                    rows[r] = rows[r].substring(0,newCol) + 'O' + rows[r].substring(newCol+1);
                }
            }
        }
        return rows;
    }


    areArraysEqual<T>(a: T[], b: T[]) : boolean {
        return JSON.stringify(a) === JSON.stringify(b);
     }
}

export default new Day14;