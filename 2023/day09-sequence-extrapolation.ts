class Day9 {

    // View challenge: https://adventofcode.com/2023/day/9

    solveForPartOne(input: string): number {
        const sequences = input.split('\n').map(line => line.split(/\s+/)).map(line => line.map(x => parseInt(x)));
        let sum = 0;
        for (let sequence of sequences) {
            // calculate step differences
            let stepDifferences = this.findStepDifferences(sequence);
            // extrapolate next number in sequence
            let extrapolatedNum = 0;
            while (stepDifferences.length > 0) {
                const currStep = stepDifferences.pop()!;
                extrapolatedNum = extrapolatedNum + currStep[currStep.length - 1];
            }
            sum += extrapolatedNum;
        }
        return sum;
    }

    solveForPartTwo(input: string): number {
        const sequences = input.split('\n').map(line => line.split(/\s+/)).map(line => line.map(x => parseInt(x)));
        let sum = 0;
        for (let sequence of sequences) {
            // calculate step differences
            let stepDifferences = this.findStepDifferences(sequence);
            // extrapolate previous number in sequence
            let extrapolatedNum = 0;
            while (stepDifferences.length > 0) {
                const currStep = stepDifferences.pop()!;
                extrapolatedNum = currStep[0] - extrapolatedNum; // this is the only line different from part 1
            }
            sum = sum + extrapolatedNum;
        }
        return sum;
    }

    // ====== Helpers ======

    /** From a sequence of numbers, make a new sequence containing the differences between
     * each neighboring pair in the original one. Do the same for the new sequence, and 
     * continue until every number in the latest step is 0. If it never converges to 0, return an empty list.
     * Otherwise, return a list of all the step difference sequences, inc. the original.
     * 
     * Ex: findStepDifferences([ 1   3   6  10  15  21 ]) => [
     *         [ 1   3   6  10  15  21 ],
     *           [ 2   3   4   5   6 ],
     *             [ 1   1   1   1 ],
     *               [ 0   0   0 ],
     * ]
     */
    findStepDifferences(sequence: number[]) {
        // a list for all the step difference sequences
        let stepDifferences = [sequence]; 
        // exit loop when the last step difference is all 0s
        while (stepDifferences[stepDifferences.length - 1].some(x => x !== 0) ) {
            const lastStep = stepDifferences[stepDifferences.length - 1];
            // if there is only one number left and it has not converged to zero, a valid sequencing is not possible
            if (lastStep.length <= 1) {
                return [];
            }
            let stepDiff: number[] = [];
            // get the next step sequence by finding the difference between all the numbers
            // in the previous step sequence
            for (let i = 0; i < lastStep.length - 1; i++) {
                stepDiff.push(lastStep[i+1] - lastStep[i]);
            }
            stepDifferences.push(stepDiff);
        }
        return stepDifferences;
    }
}

export default new Day9;