class Day7 {

    // View challenge: https://adventofcode.com/2023/day/7

    solveForPartOne(input: string): string {
        let handInfos: HandInfo[] = input.split('\n').map(line => line.split(/\s+/)).map(handInfo => ({hand: handInfo[0], bet: parseInt(handInfo[1]), strength: 0}));
        // calculate poker hand strength
        handInfos = handInfos.map((handInfo: HandInfo) => {
            const cardCounts = this.getCardCountsInHand(handInfo);
            const strength = this.calcStrengthFromCardCounts(cardCounts);
            return {...handInfo, strength};
        });
        // sort lowest -> highest based on hand strength, and tie-break with high card comparison
        this.sortHandsOnStrength(handInfos, rankedCardsPt1);

        // calculate winnings from sorted list
        let totalWinnings = 0;
        for (let j = 0; j < handInfos.length; j++) {
            const rank = j + 1;
            totalWinnings += rank * handInfos[j].bet;
        }
        return totalWinnings.toString();
    }

    solveForPartTwo(input: string): string {
        let handInfos: HandInfo[] = input.split('\n').map(line => line.split(/\s+/)).map(handInfo => ({hand: handInfo[0], bet: parseInt(handInfo[1]), strength: 0}));
        // calculate poker hand strength
        handInfos = handInfos.map((handInfo: HandInfo) => {
            const cardCounts = this.getCardCountsInHandWithJoker(handInfo);
            const strength = this.calcStrengthFromCardCounts(cardCounts);
            return {...handInfo, strength};
        });
        // sort lowest -> highest based on hand strength, and tie-break with high card comparison
        this.sortHandsOnStrength(handInfos, rankedCardsPt2);

        // calculate winnings from sorted list
        let totalWinnings = 0;
        for (let j = 0; j < handInfos.length; j++) {
            const rank = j + 1;
            totalWinnings += rank * handInfos[j].bet;
        }
        return totalWinnings.toString();
    }

    // sort hands lowest -> highest based on hand strength (in place),
    // and tie-break with high card comparison according to the [cardRanking] provided
    sortHandsOnStrength(handInfos: HandInfo[], cardRanking: {[k: string]: number}) {
        handInfos.sort((a, b) => {
            if (a.strength > b.strength){
                return 1;
            } else if (b.strength > a.strength){
                return -1;
            }
             // tie break
            for (let i = 0; i < a.hand.length; i++) {
                if (cardRanking[a.hand[i]] > cardRanking[b.hand[i]]) {
                    return 1;
                } else if (cardRanking[b.hand[i]] > cardRanking[a.hand[i]]) {
                    return -1;
                }
            }
            return 0; // dataset should exclude this possibility
        });
        return handInfos;
    }

    // Given the counts of each card in the hand (like `{"A": 2, "Q": 2, "3": 1}`),
    // Returns the strength ranking of the hand according to poker rules,
    // with "5 of a kind" as the highest and "high card" as the lowest strength
    calcStrengthFromCardCounts(cardCounts: {[k: string]: number}) {
        let strength = 0;
        const keyCount = Object.keys(cardCounts).length;
        const values = Object.values(cardCounts);
        if (keyCount === 1) strength = 6; // 5 of a kind
        else if (values.includes(4)) strength = 5; // 4 of a kind
        else if (values.includes(3) && values.includes(2)) strength = 4; // full house
        else if (values.includes(3)) strength = 3; // 3 of a kind
        else if (values.includes(2) && keyCount === 3) strength = 2; // 2 pairs
        else if (values.includes(2)) strength = 1; // 1 pair
        else strength = 0; // high card
        return strength;
    }

    //  Gets the counts of each card within the hand
    // "AAQQ3" => {"A": 2, "Q": 2, "3": 1}
    getCardCountsInHand(handInfo: HandInfo) {
        let d: {[k: string]: number} = {};
        for (let i = 0; i < handInfo.hand.length; i++) {
            const card = handInfo.hand[i];
            if (card in d) {
                d[card] =  d[card] + 1;
            } else {
                d[card] = 1;
            }
        }
        return d;
    }

    // Gets the counts of each card within the hand, and turns the jokers into 
    // whatever card would be most advantageous
    // "AAJQ3" => "AAAQ3" (convert joker) => {"A": 3, "Q": 1, "3": 1}
    getCardCountsInHandWithJoker(handInfo: HandInfo) {
        let d: {[k: string]: number} = {};
        let jokerCount = 0;
        for (let i = 0; i < handInfo.hand.length; i++) {
            const card = handInfo.hand[i];
            if (card === 'J') { // handle jokers afterwards
                jokerCount++;
                continue;
            }
            if (card in d) {
                d[card] =  d[card] + 1;
            } else {
                d[card] = 1;
            }
        }
        // add the jokers onto whichever card already has the highest count
        let highestCardKey: string = '';
        for (const k in d) {
            if (highestCardKey.length === 0 || d[highestCardKey] < d[k]) highestCardKey = k;
        }
        d[highestCardKey] += jokerCount;
        return d;
    }
}

type HandInfo = {hand: string, bet: number, strength: number};

const rankedCardsPt1: {[k: string]: number} = {'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2};
const rankedCardsPt2: {[k: string]: number} = {'A': 14, 'K': 13, 'Q': 12, 'T': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2, 'J': 0};


export default new Day7;
