class Day6 {

    // View challenge: https://adventofcode.com/2023/day/6

    solveForPartOne(input: string): number {
        const lines = input.split('\n');
        const times = lines[0].split(/\s+/).slice(1).map(x => parseInt(x));
        const distances = lines[1].split(/\s+/).slice(1).map(x => parseInt(x));

        let totalErrorMargin = 1;
        for (let race = 0; race < times.length; race++) {
            const [min, max] = this.quadraticFormula(-1, times[race], (-1) * distances[race])
            const winningMax  = Number.isInteger(max) ? max - 1 : Math.floor(max);
            const winningMin  = Number.isInteger(min) ? min + 1 : Math.ceil(min);
            const winningRange = winningMax - winningMin + 1;
            totalErrorMargin *= winningRange;
        }
        return totalErrorMargin;
    }

    solveForPartTwo(input: string): number {
        const lines = input.split('\n');
        const time = parseInt(lines[0].split(/\s+/).slice(1).join(""));
        const distance = parseInt(lines[1].split(/\s+/).slice(1).join(""));

        const [min, max] = this.quadraticFormula(-1, time, (-1) * distance)
        const winningMax  = Number.isInteger(max) ? max - 1 : Math.floor(max);
        const winningMin  = Number.isInteger(min) ? min + 1 : Math.ceil(min);
        const winningRange = winningMax - winningMin + 1;
        
        return winningRange;
        
    }

    // ====== Helpers ======

    // Solves a quadratic equation of form `ax²+bx+c` with quadratic formula `( -b ± √(b²-4ac) ) / (2a)`
    quadraticFormula(a: number, b: number, c: number): [number, number] {
        const topPlus =  (-1)*b + Math.sqrt(b*b - 4 * a * c);
        const topMinus =  (-1)*b - Math.sqrt(b*b - 4 * a * c);
        return [topPlus / (2 * a), topMinus / (2 * a)];
    }
}

export default new Day6;
