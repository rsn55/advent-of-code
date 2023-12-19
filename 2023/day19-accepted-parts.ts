class Day19 {

    // View challenge: https://adventofcode.com/2023/day/19

    solveForPartOne(input: string): number {
        const [workflowStrings, partStrings] = input.split('\n\n').map(x => x.split('\n'));
        const parts = this.parseParts(partStrings);
        const workflows = this.parseWorkflows(workflowStrings);

        let acceptedSum = 0;
        for (let part of parts) {
            let state: AcceptionState | string = 'in';
            while (state !== AcceptionState.Accepted && state !== AcceptionState.Rejected) {
                const currWorkflow = workflows[state];
                let didMatchRule = false;
                for (let r of currWorkflow.rules) {
                    let p = part[r.partKey];
                    let isMatch = r.comparator === Comparator.GreaterThan ? p > r.n : p < r.n;
                    if (isMatch) {
                        state = r.resultingState;
                        didMatchRule = true;
                        break;
                    }
                }
                if (!didMatchRule) {
                    // did not fully match any rule in the workflow, so set the current state to the workflow final state
                    state = currWorkflow.finalState;
                }
            }
            if (state === AcceptionState.Accepted) {
                acceptedSum += part.x + part.m + part.s + part.a;
            }
        }
        return acceptedSum;
    }

    solveForPartTwo(input: string): number {
        const workflows = this.parseWorkflows(input.split('\n\n')[0].split('\n'));
        const partCombos = this.getAcceptedPartRangeCombos(workflows, 'in', {x: [1, 4000], s: [1, 4000], m: [1, 4000], a: [1, 4000]});
        return partCombos;
    }

    /** Returns the number of distinct combinations of ratings for a part that would be accepted by
     * the given list of workflows. Recursively splits the ranges into sub-ranges that match or
     * don't match each rule and adds together the combinations for each.
     * 
     * @param workflows the map of all workflows and their rules
     * @param state the state is one of Accepted, Rejected, or the name of the current workflow; first call starts at workflow "in"
     * @param partRanges the min and max ranges for each part to check for accepted combinations
     */
    getAcceptedPartRangeCombos(workflows: WorkflowMap, state: AcceptionState | string, partRanges: PartRanges) : number {
        let currState = state;
        while (currState !== AcceptionState.Accepted && currState !== AcceptionState.Rejected) {
            const currWorkflow = workflows[currState];
            let didFullMatchRule = false; // true if we hit a rule that matches the part range in its entirety

            for (let r of currWorkflow.rules) {
                const [pMin, pMax] = partRanges[r.partKey]; // the range of the part rating we compare for this rule
                let isFullMatch = r.comparator === Comparator.GreaterThan ? pMin > r.n : pMax < r.n;
                if (isFullMatch) {
                    // the entire part range matches this rule
                    currState = r.resultingState;
                    didFullMatchRule = true;
                    break;
                }
                // check for partial match
                let matchedRange = [pMin, pMax];
                let unmatchedRange = [pMin, pMax];
                if (r.comparator === Comparator.GreaterThan) {
                    matchedRange[0] = r.n + 1;
                    unmatchedRange[1] = r.n;
                } else {
                    matchedRange[1] = r.n - 1;
                    unmatchedRange[0] = r.n;
                }
                if (matchedRange[1] - matchedRange[0] >= 0) {
                    // there is a partial match, so recurse on the matching range
                    const recursedAccepted = this.getAcceptedPartRangeCombos(workflows, r.resultingState, {...partRanges, [r.partKey]: matchedRange});
                    // and it is also partially unmatched, so recurse on the unmatched part of the range
                    const recursedRejected = this.getAcceptedPartRangeCombos(workflows, state, {...partRanges, [r.partKey]: unmatchedRange});
                    // total combinations is a union of both of these
                    return recursedRejected + recursedAccepted;
                }
                // else, there is a full rejection and this rule will never match a subset of the ranges, so just continue on
            }
            if (!didFullMatchRule) {
               // did not fully match any rule in the workflow, so set the current state to the workflow final state
               currState = currWorkflow.finalState;
            }
        }
        if (currState === AcceptionState.Accepted) {
            // the whole part range is completely accepted; multiply the ranges of each rating to get a count of possible accepted combinations
            return (partRanges.x[1] - partRanges.x[0] + 1) * (partRanges.s[1] - partRanges.s[0] + 1) * (partRanges.m[1] - partRanges.m[0] + 1) * (partRanges.a[1] - partRanges.a[0] + 1);
        }
        // the whole part range is completely rejected, so there are no possible accepted combinations
        return 0;
    }

    // ====== Input Parsing Helpers ======
    
    parseParts(partStrings: string[]): Part[] {
        return partStrings.map(partStr => {
            const nums = [...partStr.matchAll(/\d+/g)].map(x => parseInt(x[0]));
            return {x: nums[0], m: nums[1], a: nums[2], s: nums[3]};
        });
    }

    parseWorkflows(workflowStrings: string[]): WorkflowMap {
        const workflows: WorkflowMap = {};

        for (let workflowStr of workflowStrings) {
            const workflow: Workflow = {rules: [], finalState: ''};
            const workflowName = workflowStr.substring(0,workflowStr.indexOf('{'));
            const ruleStrs = workflowStr.substring(workflowStr.indexOf('{') + 1, workflowStr.length - 1).split(',');
           
            workflow.finalState = ruleStrs[ruleStrs.length - 1];
            for (let i = 0; i < ruleStrs.length - 1; i++) {
                const colonIndex = ruleStrs[i].indexOf(':');
                const rule: Rule = {
                    partKey: ruleStrs[i][0] as PartKey, 
                    comparator: ruleStrs[i][1] as Comparator, 
                    n: parseInt(ruleStrs[i].substring(2, colonIndex)), 
                    resultingState: ruleStrs[i].substring(colonIndex + 1)
                }
                workflow.rules.push(rule);
            }
            workflows[workflowName] = workflow;
        }
        return workflows;
    }
}

// Part types
type PartKey = 'x' | 'm' | 'a' | 's';
type Part = {x: number, m: number, a: number, s: number}; // question part 1
type PartRanges = {x: [number, number], m: [number, number], a: [number, number], s: [number, number]}; // question part 2

// Workflow types
enum Comparator {
    GreaterThan = '>',
    LessThan = '<',
};
enum AcceptionState {
    Accepted = 'A',
    Rejected = 'R'
};
type Rule = {partKey: PartKey, comparator: Comparator, n: number, resultingState: AcceptionState | string};
type Workflow = {rules: Rule[], finalState: AcceptionState | string};
type WorkflowMap = {[w: string]: Workflow};


export default new Day19;