class Day1 {

    // View challenge: https://adventofcode.com/2023/day/1

    solveForPartOne(input: string): number {
        const calibrationLines = input.split("\n");
        let totalSum = 0;
        for (let line of calibrationLines) {
            const matches = line.match(/\d/g)!;
            const digit1 = matches[0];
            const digit2 = matches[matches.length - 1];
            totalSum += parseInt(digit1 + digit2);
        }
        return totalSum;
    }


    solveForPartTwo(input: string): number {
        const calibrationLines = input.split("\n");
        
        let totalSum = 0;
        for (let line of calibrationLines) {
            const matches = [...line.matchAll(/(?=(\d|one|two|three|four|five|six|seven|eight|nine))/gi)];
            const digit1 = this.convertToDigit(matches[0][1]);
            const digit2 = this.convertToDigit(matches[matches.length - 1][1]);
            totalSum += parseInt(digit1 + digit2);
        }
        return totalSum;
    }

    // ====== Helpers ======

    convertToDigit(s: string): string {
        const numberMap: { [k: string]: string } = {
            one: '1',
            two: '2',
            three: '3',
            four: '4',
            five: '5',
            six: '6',
            seven: '7',
            eight: '8',
            nine: '9',
        };
        return Number.isNaN(parseInt(s)) ? numberMap[s] : s;
    }

}

export default new Day1;