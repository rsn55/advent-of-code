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

    // Solves a quadratic equation with ( -b ± √(b²-4ac) ) / (2a)
    quadraticFormula(quadCoeff: number, linCoeff: number, constant: number): [number, number] {
        const topPlus =  (-1)*linCoeff + Math.sqrt(linCoeff*linCoeff - 4 * quadCoeff * constant);
        const topMinus =  (-1)*linCoeff - Math.sqrt(linCoeff*linCoeff - 4 * quadCoeff * constant);
        return [topPlus / (2 * quadCoeff), topMinus / (2 * quadCoeff)];
    }
}

export default new Day6;