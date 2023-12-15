class Day15 {

    // View challenge: https://adventofcode.com/2023/day/15

    solveForPartOne(input: string): number {
        const steps = input.split(',');
        let totalSum = 0;
        for (let step of steps) {
            totalSum += this.hashFn(step);
        }
        return totalSum;
    }

    solveForPartTwo(input: string): number {
        const steps = input.split(',');
        let boxes: [string,number][][] = Array(256).fill([]); 
        let lensLabels = new Set<string>();
        // follow HASHMAP instruction sequence
        for (let step of steps) {
            const label = step.split(/[=-]/)[0];
            const boxNum = this.hashFn(label);
            lensLabels.add(label);
            if (step.includes('=')) {
                // add or replace lens in box
                const focalLength = parseInt(step.split(/[=]/)[1]);
                const lensIndex = boxes[boxNum].findIndex(x => x[0] === label);
                if (lensIndex > -1) {
                    boxes[boxNum][lensIndex] = [label, focalLength]; // replace
                } else {
                    boxes[boxNum] = [...boxes[boxNum], [label, focalLength]]; // add new
                }
            } else {
                // remove lens from box
                const sameLabelLensI = boxes[boxNum].findIndex(x => x[0] === label);
                if (sameLabelLensI > -1) {
                    boxes[boxNum] = boxes[boxNum].slice(0, sameLabelLensI).concat(boxes[boxNum].slice(sameLabelLensI + 1));
                }
            }
        }
        // add up focusing power
        let totalFocusingPower = 0;
        for (let lensLabel of lensLabels) {
            const boxNum = this.hashFn(lensLabel);
            const lensIndex = boxes[boxNum].findIndex(x => x[0] === lensLabel);
            if (lensIndex > -1) {
                const focalLength = boxes[boxNum][lensIndex][1];
                const focusingPower = (1 + boxNum) * (lensIndex + 1) * focalLength;
                totalFocusingPower += focusingPower;
            }
        }
        return totalFocusingPower;
    }

    /** Hashes a string to a number in range [0...255] */
    hashFn(s: string): number {
        let val = 0;
        for (let char of s) {
            const asciiCode = char.charCodeAt(0);
            val += asciiCode;
            val *= 17;
            val = val % 256;
        }
        return val;
    }
}

export default new Day15;