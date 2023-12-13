class Day13 {

     // View challenge: https://adventofcode.com/2023/day/13

    solveForPartOne(input: string): number {
        const patterns = input.split('\n\n').map(pattern => pattern.split('\n'));
        let totalSum = 0;
        for (let pattern of patterns) {
            // check rows for horizontal mirror
            const horizontalCount = this.getCountFromMirror(pattern);
            if (horizontalCount > 0) {
                totalSum += 100 * horizontalCount;
                continue;
            }           
            // check columns for vertical mirror
            const columns = this.transposeColumns(pattern);
            totalSum += this.getCountFromMirror(columns)

        }
        return totalSum;
    }

    solveForPartTwo(input: string): number {
        const patterns = input.split('\n\n').map(pattern => pattern.split('\n'));
        let totalSum = 0;
        for (let pattern of patterns) {
            // check rows for horizontal smudged mirror
            const horizontalCount = this.getCountFromSmudgedMirror(pattern);
            if (horizontalCount > 0) {
                totalSum += 100 * horizontalCount;            
                continue;
            }

            // check columns for vertical smudged mirror
            const columns = this.transposeColumns(pattern);
            totalSum += this.getCountFromSmudgedMirror(columns);            

        }
        return totalSum;
    }

    /** Find the horizontal reflection point in a pattern and return the number of rows prior to it */
    getCountFromMirror(rows: string[]) {
        // the 'prevLine' is the index of the row previous to the possible reflection point. 
        // the actual reflection point of the mirror would be prevLine + 0.5;
        let prevLine = 0; 
        let isReflectionPoint = false;
        // check all possible reflection points
        for (prevLine; prevLine < rows.length - 1; prevLine++){
            // check the 2 lines on either side of the reflection point, then the 2 lines outside 
            // of those lines, etc. (distance from point determined by 'distance')
            // If you find any mismatch, this is not a valid mirror reflection point.
            let distance = 0;
            let foundMismatch = false;
            while (prevLine + distance + 1 < rows.length && prevLine - distance >= 0){
                if (rows[prevLine + distance + 1] !== rows[prevLine - distance]) {
                    // we found a mismatch, so this is not a reflection point
                    foundMismatch = true;
                    break;
                }
                distance++;
            }
            if (!foundMismatch) {
                // we checked every surrounding pair and determined that this
                // is the valid reflection point, so we don't need to check any others
                isReflectionPoint = true;
                break;
            }
        }
        if (isReflectionPoint) {
            return prevLine + 1; // count the lines before the reflection point
        }
        // if there is no valid reflection point from this direction
        return 0;
    }

     /** Find the horizontal reflection point in a pattern and return the number of rows prior to it.
      * One caveat: there is a 'smudge' i.e. single character that *must* be changed. So find the reflection
      * point that matches completely *except* for one character. */
    getCountFromSmudgedMirror(rows: string[]) {
        // the 'prevLine' is the index of the row previous to the possible reflection point. 
        // the actual reflection point of the mirror would be prevLine + 0.5;
        let prevLine = 0; 
        let isReflectionPoint = false;
        for (prevLine; prevLine < rows.length - 1; prevLine++){
            // check the 2 lines on either side of the reflection point, then the 2 lines outside 
            // of those lines, etc. (distance from point determined by 'distance')
            // If you find any mismatch, this is not a valid mirror reflection point.
            let distance = 0;
            let fixedSmudgeCount = 0; // we want to fix exactly 1 smudge for this reflection point
            let isInvalid = false;
            while (prevLine + distance + 1 < rows.length && prevLine - distance >= 0){
                const rowB = rows[prevLine + distance + 1];
                const rowA = rows[prevLine - distance];
                if (rowA !== rowB) {
                    if (fixedSmudgeCount > 0) { // too many mismatches, invalid
                        isInvalid = true;
                        break;
                    } else {
                        // make sure only exactly one character is different
                        let diffChars = 0;
                        for (let char = 0; char < rowA.length; char++){
                            if (rowA[char] !== rowB[char]) {
                                diffChars++;
                            }
                        }
                        if (diffChars === 1) {
                            fixedSmudgeCount++;
                        } else {
                            // too many smudges, invalid
                            isInvalid = true;
                            break;
                        }
                    }
                }
                distance++
            }
            if (!isInvalid && fixedSmudgeCount === 1) {
                // we checked every surrounding pair and determined that this
                // is the valid reflection point with only 1 smudge, so we don't need to check any others
                isReflectionPoint = true;
                break;
            }
        }
        if (isReflectionPoint) {
            return prevLine + 1; // count the lines before the reflection point
        }
        // if there is no valid reflection point from this direction
        return 0;
    }

    // Transposes vertical columns of a string[] to row form
    transposeColumns(rows: string[]) {
        const columns: string[] = []; 
        for (let c = 0; c < rows[0].length; c++) {
            let column: string = '';
            rows.forEach((row) => column += (row[c]));
            columns.push(column);
        }
        return columns;
    }
}

export default new Day13;