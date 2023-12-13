class Day12 {

    // View challenge: https://adventofcode.com/2023/day/12

    solveForPartOne(input: string): number {
        const rows = input.split('\n');
        const conditionRecords = rows.map(row => {
            const sections = row.split(' ');
            return {springConditions: sections[0], contiguousGroups: sections[1].split(',').map(x => parseInt(x))}
        })
        let totalValidCount = 0;
        for (let record of conditionRecords) {
            const normalizedRecord = record.springConditions.replace(/\.+/g, '.'); // remove extraneous periods
            let cache: PermCountCache = {}
            totalValidCount += this.countValidPerms(normalizedRecord, record.contiguousGroups, cache)
        }
        return totalValidCount;
    }

    // Runs in < 300 ms on my input file
    solveForPartTwo(input: string): number {
        const rows = input.split('\n');
        // parse and repeat records 5 times
        const conditionRecords = rows.map(row => {
            const sections = row.split(' ');
            const repeatedSpringRecord = this.repeatString(sections[0], 5, '?');
            const repeatedGroups = this.repeatList(sections[1].split(',').map(x => parseInt(x)), 5);
            return {springConditions: repeatedSpringRecord, contiguousGroups: repeatedGroups}
        });
        let totalValidCount = 0;
        for (let record of conditionRecords) {
            const normalizedRecord = record.springConditions.replace(/\.+/g, '.'); // remove extraneous periods
            let cache: PermCountCache = {}
            totalValidCount += this.countValidPerms(normalizedRecord, record.contiguousGroups, cache)
        }
        return totalValidCount;
    }

    /** Recursively counts the valid permutations from a spring record and its list of contiguous
     * groups. Has a cache for storing permutation counts of (record,group) combos
     * that have already been seen. */
    countValidPerms(record: string, groups: number[], cache: PermCountCache) : number {
        const cacheKey = `${record},${groups.length}`;
        if (cacheKey in cache) {
            return cache[cacheKey];
        }
        if (record.length === 0 && groups.length !== 0) {
            cache[cacheKey] = 0;
            return 0; // invalid
        }
        if (groups.length === 0 && record.includes('#')) {
            cache[cacheKey] = 0;
            return 0; // invalid
        }
        if (record.length === 0 && groups.length === 0) {
            cache[cacheKey] = 1;
            return 1; // valid and complete
        }
        const symbol = record[0];
        let permCount = 0;
        switch (symbol) {
            case '#':
                // if the first char is a '#', it must be the start of a contiguous group
                // with length equal to groups[0], otherwise it's not valid
                let matchingGroupLen = groups[0];
                if (record.length < matchingGroupLen) {
                    return 0; // invalid
                }
                const matchingSection = record.substring(0, matchingGroupLen);
                if (matchingSection.includes('.')){
                    return 0; // invalid
                }
                if (record.length > matchingGroupLen && record[matchingGroupLen] === '#') {
                    return 0; // invalid
                }
                if (record.length > matchingGroupLen && record[matchingGroupLen] === '?') {
                    // the character directly following the contiguous group is a '?',
                    // but since a '#' cannot immediately follow a separate contiguous group,
                    // the '?' must actually be a '.', so we can just ignore that index
                    // and increment to the next one
                    matchingGroupLen++; 
                }
                permCount = this.countValidPerms(record.substring(matchingGroupLen), groups.slice(1), cache);
                cache[cacheKey] = permCount;
                return permCount;
            case '?':
                // if the first char is a '?' (unknown), either it is actually a '#' or a '.'
                // so the total permutation count is the sum of the perms when you replace
                // the current '?' with a '#', plus the perms when you replace it with a '.' instead.
                permCount = this.countValidPerms('#' + record.substring(1), groups, cache) + this.countValidPerms('.' + record.substring(1), groups, cache);
                cache[cacheKey] = permCount;
                return permCount;
            case '.':
            default:
                // if the first char is a '.', we can ignore it and continue on
                permCount = this.countValidPerms(record.substring(1), groups, cache);
                cache[cacheKey] = permCount;
                return permCount;
        }
    }

    // ====== Helpers ======

    // repeatList( [1,2,3], 2 ) => [1,2,3,1,2,3]
    repeatList(arr: number[], n: number) {
        return Array.from({ length: arr.length * n }, (_, i) => arr[i % arr.length]);
    }

    // repeatString( 'ABC', 2, '_' ) => 'ABC_ABC'
    repeatString(s: string, n: number, joinStr: string) {
        const repeated = (s + joinStr).repeat(n);
        // remove extra joinStr at the end
        return repeated.substring(0, repeated.length - 1);
    }

}

/** `<record>,<group-length>` => valid perm count */
type PermCountCache = {[k: string]:  number};

export default new Day12;