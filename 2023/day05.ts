class Day5 {

    // View challenge: https://adventofcode.com/2023/day/5

    solveForPartOne(input: string): string {
        const almanac = input.split('\n\n');
        const seeds = almanac[0].split(': ')[1].split(' ').map(s => parseInt(s));
        const seedGroups = almanac.slice(1).map(s => s.split('\n').slice(1))
        const seedMaps = seedGroups.map(g => g.map(s => {
            const splitLine = s.split(" ");
            return {destRange: parseInt(splitLine[0]), srcRange: parseInt(splitLine[1]), rangeLen: parseInt(splitLine[2])}
        }));
        let minLocation: number | undefined = undefined;
        for (let seed of seeds) {
            let convertedSeed = seed;
            for (let seedMap of seedMaps) {
                for (let rangeLine of seedMap) {
                    const rangeEnd = rangeLine.srcRange + rangeLine.rangeLen - 1;
                    if (rangeLine.srcRange <= convertedSeed && rangeEnd >= convertedSeed) {
                        // converted seed is in range, so convert it again
                        const diff = convertedSeed - rangeLine.srcRange;
                        convertedSeed = rangeLine.destRange + diff;
                        break; // we dont want to check the other ranges then
                    }   
                }
                // if none of the range lines matched, we change nothing
            }
            minLocation = minLocation ? Math.min(convertedSeed, minLocation) : convertedSeed;
        }
        return (minLocation || 0).toString();
    }

    // Optimized to process my AOC input file in around 1 ms
    solveForPartTwo(input: string): string {
        const startTime = Date.now();
        const almanac = input.split('\n\n');
        const seedRanges = almanac[0].split(': ')[1].split(' ').map(s => parseInt(s));
        const seedGroups = almanac.slice(1).map(s => s.split('\n').slice(1))
        const seedMaps = seedGroups.map(g => g.map(s => {
            const splitLine = s.split(" ");
            return {destRange: parseInt(splitLine[0]), srcRange: parseInt(splitLine[1]), rangeLen: parseInt(splitLine[2])}
        }));

        let minLocation: number | undefined = undefined;
        for (let i = 0; i < seedRanges.length - 1; i += 2) {
            const seedRangeStart = seedRanges[i];
            const seedRangeEnd = seedRangeStart + seedRanges[i + 1] - 1;
            
            let startingRanges: [number, number][] = [[seedRangeStart, seedRangeEnd]];
            for (let seedMap of seedMaps) {
                let splitRanges = [...startingRanges]; // we split off subsets of the starting range to be processed in this stack
                let convertedRanges: [number, number][] = []; // results of the starting range and any subset splits
                while (splitRanges.length > 0){
                    const [splitStart, splitEnd] = splitRanges.pop()!;
                    let found = false;
                    for (let rangeLine of seedMap) {
                        const [srcRangeStart, srcRangeEnd] = [rangeLine.srcRange, rangeLine.srcRange + rangeLine.rangeLen - 1]
                        // if whole range matches: convert and end
                        if (srcRangeStart <= splitStart && srcRangeEnd >= splitEnd) {
                            convertedRanges.push([rangeLine.destRange + splitStart - srcRangeStart, rangeLine.destRange + splitEnd - srcRangeStart]);
                            found = true;
                            break;
                        }   
                        // the start is within range, but not the end
                        // match what you can, convert that part, and make a new range for the rest + add to stack
                        if (srcRangeStart <= splitStart && splitStart <= srcRangeEnd) {
                            // [splitStart, rangeEnd] matches
                            convertedRanges.push([rangeLine.destRange + splitStart - srcRangeStart, rangeLine.destRange + srcRangeEnd - srcRangeStart]);
                            splitRanges.push([srcRangeEnd + 1, splitEnd]); 
                            found = true;
                            break;
                        }
                        // the end is within range, but not the start
                        // match what you can, convert that part, and make a new range for the rest + add to stack
                        if (srcRangeEnd >= splitEnd && splitEnd >= srcRangeStart) {
                            // [rangeStart, splitEnd] matches
                            convertedRanges.push([rangeLine.destRange + srcRangeStart - srcRangeStart, rangeLine.destRange + splitEnd - srcRangeStart]);
                            splitRanges.push([splitStart, srcRangeStart - 1]); 
                            found = true;
                            break;
                        }
                        // the map range is contained within the seed range
                        // match what you can, convert that part, and make 2 new ranges for the rest + add to stack
                        if (srcRangeStart >= splitStart && srcRangeEnd <= splitEnd) {
                            // [srcRangeStart, srcRangeEnd] matches
                            convertedRanges.push([rangeLine.destRange + srcRangeStart - srcRangeStart, rangeLine.destRange + srcRangeEnd - srcRangeStart]);
                            splitRanges.push([splitStart, srcRangeStart - 1]); 
                            splitRanges.push([srcRangeEnd + 1, splitEnd]); 
                            found = true;
                            break;
                        }
                        // else none of range matches, skip
                    }
                    // if none of them match, it stays the same
                    if (!found) convertedRanges.push([splitStart, splitEnd]);
                }
                // reset
                startingRanges = convertedRanges;

            }
            minLocation = minLocation ? Math.min(...startingRanges.map(x => x[0]), minLocation) : Math.min(...startingRanges.map(x => x[0]));
            
        }
        console.log('ms to complete part 2: ', Date.now() - startTime);
        return (minLocation || 0).toString();
    }

    // My initial naive approach, which takes around 3.5 *minutes* to process my AOC input file
    solveForPartTwoBruteForce(input: string): string {
        const startTime = Date.now();
        const almanac = input.split('\n\n');
        const seedRanges = almanac[0].split(': ')[1].split(' ').map(s => parseInt(s));
        const seedGroups = almanac.slice(1).map(s => s.split('\n').slice(1))
        const seedMaps = seedGroups.map(g => g.map(s => {
            const splitLine = s.split(" ");
            return {destRange: parseInt(splitLine[0]), srcRange: parseInt(splitLine[1]), rangeLen: parseInt(splitLine[2])}
        }));

        let minLocation: number | undefined = undefined;
        for (let i = 0; i < seedRanges.length - 1; i += 2) {
            const seedRangeStart = seedRanges[i];
            const seedRangeEnd = seedRangeStart + seedRanges[i + 1];
            
            for (let seed = seedRangeStart; seed < seedRangeEnd; seed++) {
                let convertedSeed = seed;
                for (let seedMap of seedMaps) {
                    for (let rangeLine of seedMap) {
                        const rangeEnd = rangeLine.srcRange + rangeLine.rangeLen - 1;
                        if (rangeLine.srcRange <= convertedSeed && rangeEnd >= convertedSeed) {
                            // converted seed is in range, so convert it again
                            const diff = convertedSeed - rangeLine.srcRange;
                            convertedSeed = rangeLine.destRange + diff;
                            break; // we dont care about the other ranges then
                        }   
                    }
                    // if none of them match, it stays the same
                }
                minLocation = minLocation ? Math.min(convertedSeed, minLocation) : convertedSeed;
            }
        }
        console.log('ms to complete part 2 brute force: ', Date.now() - startTime);
        return (minLocation || 0).toString();
    }
}

export default new Day5;