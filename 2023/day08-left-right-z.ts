class Day8 {

    // View challenge: https://adventofcode.com/2023/day/8

    solveForPartOne(input: string): number {
        const instructions = input.split('\n\n')[0];
        const nodeList = input.split('\n\n')[1].split('\n');

        // construct a map for constant time lookup of nodes
        const nodeMap: {[k: string]: [string, string]} = {};
        for (let i = 0; i < nodeList.length; i++) {
            const nodes = nodeList[i].match(/([A-Z])+/g)!;
            nodeMap[nodes[0]] = [nodes[1], nodes[2]];
        }
        // travel through nodes following left/right instructions
        let currentNode = 'AAA';
        let instructionI = 0;
        let stepCount = 0;
        while (currentNode !== 'ZZZ') {
            stepCount += 1;
            if (instructions[instructionI] === 'L') {
                currentNode = nodeMap[currentNode][0];
            } else { // right
                currentNode = nodeMap[currentNode][1];
            }
            if (instructionI === instructions.length - 1) { // restart instructions if we ran out
                instructionI = 0;
            } else {
                instructionI++;
            }
        }
        return stepCount;
    }

    // Processes provided input file in ~10ms
    solveForPartTwo(input: string): number {
        const instructions = input.split('\n\n')[0];
        const nodeList = input.split('\n\n')[1].split('\n');

        // construct a map for constant time lookup of nodes
        const nodeMap: {[k: string]: [string, string]} = {};
        for (let i = 0; i < nodeList.length; i++) {
            const nodes = nodeList[i].match(/([A-Z])+/g)!;
            nodeMap[nodes[0]] = [nodes[1], nodes[2]];
        }
        // get all nodes that end with A
        let nodesWithA = Object.keys(nodeMap).filter(nodeKey => nodeKey[2] === 'A');
        let nodeMultiplesZ: number[] = [];
        // for each node ending with A, find the step count of the first instance of when it
        // is translated to a node ending with Z. From there, it will loop in a cycle of the same length
        // every time.
        for (let aNode of nodesWithA) {
            let currentNode = aNode;
            let stepCount = 0;
            let instructionI = 0;
            while (currentNode[2] !== 'Z') {
                stepCount += 1;
                if (instructions[instructionI] === 'L') { // left
                    currentNode = nodeMap[currentNode][0];
                } else { // right
                    currentNode = nodeMap[currentNode][1];
                }
                if (instructionI === instructions.length - 1) { // restart instructions
                    instructionI = 0;
                } else {
                    instructionI++;
                }
            }
            nodeMultiplesZ.push(stepCount);
        }
        // Now `nodeMultiplesZ` is a list of the step counts at which each starting A node 
        // loops to hit a Z node. In order to find the step where these all overlap, we just need 
        // to find the lowest common multiple.

        // Find LCM using prime factorization method
        return this.getLeastCommonMultiple(nodeMultiplesZ);
    }

    // ====== Helpers ======

    /** Gets the prime factorization of a number, stored as a map with counts of each factor
     * ex: getPrimeFactorization(36) => { '2': 2, '3': 2 } , i.e. [2, 2, 3, 3]
     * ex: getPrimeFactorization(25) => { '5': 2 } , i.e. [5, 5]     */ 
    getPrimeFactorization(original: number) {
        if (original === 1) {
            return {};
        }
        let num = original; 
        let f = 2;
        let factorMap: {[k: number]: number} = {}
        while (num > 1) {
            if (num % f === 0) {
                if (factorMap[f]) {
                    factorMap[f]++;
                } else {
                    factorMap[f] = 1;
                }
                num = num / f;
            } else {
                f++;
            }
        }
        return factorMap;
    }

     /** Gets the LCM of a list of numbers, using prime factorization method
     * ex: getLeastCommonMultiple([3,4,8,9]) => 72
     * ex: getLeastCommonMultiple([5, 125]) => 125     */ 
    getLeastCommonMultiple(nums: number[]) {
        // get the prime factorization of each number
        let primeFactors = nums.map(n => this.getPrimeFactorization(n));
        const combinedFactorMap: {[k: number]: number} = {};

        // we will keep popping keys from the factorizations until all factorizations are empty objects
        while (primeFactors.some(factorMap => Object.keys(factorMap).length > 0)) {
            // for each prime factor, find the maximum count it has among any one factorizations and 
            // make that its count in the combinedFactorMap
            const n = parseInt(Object.keys(primeFactors.find(factorMap => Object.keys(factorMap).length > 0)!)[0]);
            let maxN = 1;
            for (let i = 0; i < primeFactors.length; i++) {
                const val = primeFactors[i][n];
                if (val) {
                    if (val > maxN) maxN = val;
                    // remove this key from the factorization so that we dont check it twice
                    primeFactors[i] = Object.fromEntries(Object.entries(primeFactors[i]).filter(m => m[0] !== n.toString()))
                }
            }
            combinedFactorMap[n] = maxN;
        }
        // multiply out each factor in the combinedFactorMap to get the LCM
        // ex: {'3': 2} => 9
        let total = 1;
        for (let key in combinedFactorMap) {
            total *= Math.pow(parseInt(key),combinedFactorMap[key]);
        }
        return total;
    }
}

export default new Day8;