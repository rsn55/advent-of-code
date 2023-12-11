class Day11 {

    // View challenge: https://adventofcode.com/2023/day/11

    solveForPartOne(input: string): number {
        return this.getPathLenOfExpandedGalaxies(input, 2)
    }

    solveForPartTwo(input: string): number {
        return this.getPathLenOfExpandedGalaxies(input, 1000000)
    }

    // ====== Helpers ======

    /** Expand the empty rows/cols by the [multiplier] */
    getPathLenOfExpandedGalaxies(input: string, multiplier: number): number {
        const rows = input.split('\n');

        // get empty row indexes
        const emptyRows: number[] = [];
        for (let r = 0; r < rows.length; r++) {
            if (rows[r].indexOf('#') === -1) {
                emptyRows.push(r);
            }
        }

        // get empty column indexes
        const emptyCols: number[] = [];
        for (let c = 0; c < rows[0].length; c++) {
            let hasGalaxy = false;
            for (let r = 0; r < rows.length; r++) {
                if (rows[r][c] === '#') {
                    hasGalaxy = true;
                    break;
                }
            }
            if (!hasGalaxy) {
                emptyCols.push(c);
            }
        }
        // get all 'real' galaxy coordinates, with expanded cols/rows calculated in
        let galaxies: [number,number][] = [];
        for (let r = 0; r < rows.length; r++) {
            let expandedRowNum = r + emptyRows.filter(x => x < r).length  *  (multiplier - 1);
            for (let c = 0; c < rows[0].length; c++) {
                let expandedColNum = c + emptyCols.filter(x => x < c).length  *  (multiplier -1);
                if (rows[r][c] === '#') {
                    galaxies.push([expandedRowNum,expandedColNum]);
                }
            }
        }
        // pair up the galaxies and get the path lengths between each pair
        // Only count each pair once; order within the pair doesn't matter.
        let totalPathLength = 0;
        for (let a = 0; a < galaxies.length; a++) {
            for (let b = a + 1; b < galaxies.length; b++) {
                const rowDist = Math.abs(galaxies[a][0] - galaxies[b][0]);
                const colDist = Math.abs(galaxies[a][1] - galaxies[b][1]);
                totalPathLength += rowDist + colDist;
            }
        }
        return totalPathLength;
    }
}

export default new Day11;