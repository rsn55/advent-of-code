
class Day25 {

    // View challenge: https://adventofcode.com/2023/day/25 (there is no part 2 this day)

    solveForPartOne(input: string): string {
        // parse input
        const lines = input.split('\n');
        const nodeMap: NodeMap = {}; // node name => names of nodes connected by an edge
        lines.forEach(l => {
            const name = l.split(':')[0];
            const edgeNames = l.split(':')[1].trim().split(' ');
            nodeMap[name] = [...(nodeMap[name] || []), ...edgeNames];
            for (let e of edgeNames) {
                nodeMap[e] = [...(nodeMap[e] || []), name];
            }
        });

        // run Karger's algorithm on the graph
        const combined = this.kargerMinCut(nodeMap);
        const nodeNames = Object.keys(combined);

        // each conglomerate node name is a comma-separated list of its original nodes,
        // so split the name to see how many are contained in each conglomerate group
        const sizeA = nodeNames[0].split(',').length;
        const sizeB = nodeNames[1].split(',').length;
        return (sizeA * sizeB).toString();
    }

    /** Runs Karger's minimum cut algorithm on the provided graph until we find a cut of exactly 3.
     * 
     * It iteratively contracts random edges (combining 2 nodes into a conglomerate node)
     * until only two nodes remain, which represent a cut. By iterating this algorithm many times, 
     * a min cut can be found with high probability.
     * 
     * https://en.wikipedia.org/wiki/Karger%27s_algorithm
     */
    kargerMinCut(nodeMap: NodeMap) : NodeMap {
        let final: NodeMap = {};
        // Repeat the algorithm until we find 2 conglomerate nodes with exactly 3 connections between them
        while (Object.keys(final).length !== 2 || final[Object.keys(final)[0]].length !== 3) {
            const testMap = JSON.parse(JSON.stringify(nodeMap)); // copy
            // keep eliminating random edges in the graph until only 2 nodes remain
            while (Object.keys(testMap).length !== 2) {
                // get a random node in the map
                const keys = Object.keys(testMap);
                const node1 = keys[this.getRandomInt(keys.length)];
                // get a random node that has an edge to [node1]
                const edges1 = testMap[node1];
                const node2 = edges1[this.getRandomInt(edges1.length)]
            
                // eliminate the edge between 2 random nodes
                this.eliminateEdge(testMap, node1, node2);
            }
            final = testMap;
        }
        return final;
    }

    /** Eliminates an edge between [node1] and [node2] within the [nodeMap], combining them into a single node. 
     * The new name is a join of the old ones (e.g. "abc" + "xyz" => node "abc,xyz")  */
    eliminateEdge(nodeMap: NodeMap, node1: string, node2: string) {
        // create the new conglomerate node
        const combinedNames = [node1, node2].join(',');
        let combinedEdges = [...nodeMap[node1], ...nodeMap[node2]];
        combinedEdges = combinedEdges.filter(e => !combinedNames.includes(e)); // remove self-references
        nodeMap[combinedNames] = combinedEdges;

        // delete old nodes
        delete nodeMap[node1];
        delete nodeMap[node2];

        // update all other nodes to refer to the conglomerate node instead of the original ones
        for (let n of Object.keys(nodeMap)) {
            nodeMap[n] = nodeMap[n].map(x => combinedNames.includes(x) ? combinedNames : x);
        }
    }

    /** getRandomInt(3) => one of 0, 1, 2 */
    getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }
}

type NodeMap = {[name: string]: string[]}; // node name => names of nodes connected by an edge


export default new Day25;