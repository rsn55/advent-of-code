class Day4 {

    // View challenge: https://adventofcode.com/2023/day/4

    solveForPartOne(input: string): number {
        const cardLines = input.split("\n");
        let totalPoints = 0;
        for (let cardLine of cardLines) {
            const groups = cardLine.split(/[:\|]/);
            const winningNumbers = groups[1].trim().split(/\s+/).map(num => parseInt(num));
            const myNumbers = groups[2].trim().split(/\s+/).map(num => parseInt(num));

            let cardPoints = 0;
            for (let myNum of myNumbers) {
                if (winningNumbers.includes(myNum)) {
                    cardPoints = cardPoints > 0 ? cardPoints * 2 : 1;
                }
            }
            totalPoints += cardPoints;
        }
        return totalPoints;
    }

    solveForPartTwo(input: string): number {
        const cardLines = input.split("\n");
        const cardWinningMap: number[] = []; // maps card id (index) -> count of winning lotto numbers on the card (value at index)
        
        // fill the map 
        for (let cardLine of cardLines) {
            const groups = cardLine.split(/[:\|]/);
            const cardId = parseInt(groups[0].split(/\s+/)[1]);
            const winningNumbers = groups[1].trim().split(/\s+/).map(num => parseInt(num));
            const myNumbers = groups[2].trim().split(/\s+/).map(num => parseInt(num));

            const winningCount = myNumbers.reduce((winners, n) => winningNumbers.includes(n) ? winners + 1 : winners, 0)
        
            cardWinningMap[cardId] = winningCount;
        }
        // make stack initialized to list of original card ids -  [1, 2, 3, ...]
        let idStack: number[] = Array.from({length: cardLines.length}, (_, i) => i + 1);

        // enumerate copies and add them to the stack
        let cardCount = 0;
        while (idStack.length) {
            cardCount++;
            const currentId = idStack.pop()!;
            if (cardWinningMap[currentId] > 0 ) { // if there are winning numbers in the card, add copies
                for (let i = currentId + 1; i <= currentId + cardWinningMap[currentId]; i++) { 
                    // performance note: n pushes to an array is much more efficient that concatenating an array of length n
                    idStack.push(i);
                }
            }
        }
        return cardCount;
    }

}

export default new Day4;
