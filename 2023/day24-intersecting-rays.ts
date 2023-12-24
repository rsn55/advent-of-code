import { init as initZ3 } from 'z3-solver';

type Ray = {x: number, y: number, z: number, vx: number, vy: number, vz: number};

class Day24 {

    // View challenge: https://adventofcode.com/2023/day/24

    solveForPartOne(input: string): number {
        const rays = this.parseInput(input);
        let numIntersecting = 0;
        for (let r1 = 0; r1 < rays.length - 1; r1++) {
            for (let r2 = r1+1; r2 < rays.length; r2++) {
                if (this.doRaysIntersect(rays[r1], rays[r2], 200000000000000, 400000000000000)) {
                    numIntersecting++;
                }
            }
        }
        return numIntersecting;
    }
    async solveForPartTwo(input: string): Promise<number> {
        const rays = this.parseInput(input);
        const { Context } = await initZ3();
	    const { Real, Solver } = Context('main');

        // the coordinates of the rock that we are solving for
        const xR = Real.const('x');
        const yR = Real.const('y');
        const zR = Real.const('z');
        const vxR = Real.const('vx');
        const vyR = Real.const('vy');
        const vzR = Real.const('vz');

	    const solver = new Solver();

        for (let ray of rays.slice(0,4)) { // only need to check 4 rays to get a unique solution
            let {x, y, z, vx, vy, vz} = ray;
            // rewrite ray intersection formulas for (x,y) and (y,z) planes

            // (vyR - vy) * (x - xR) - (vxR - vx) * (y - yR)
            solver.add((vyR.sub(vy).mul((xR.mul(-1)).add(x))).eq(vxR.sub(vx).mul((yR.mul(-1)).add(y))));
             // (vyR - vy) * (z - zR) - (vzR - vz) * (y - yR)
            solver.add((vyR.sub(vy).mul((zR.mul(-1)).add(z))).eq(vzR.sub(vz).mul((yR.mul(-1)).add(y))));
        }
        const satisfied = await solver.check();

	    if (satisfied !== 'sat') {
            // no solution
            return 0;
        }
        const model = solver.model();

        let sum = 0;
        for (let coord of [xR,yR,zR]) {
            const evaluated = parseInt((model.eval(coord) as unknown as Number).toString());
            sum += evaluated
        }
	    return sum;
    }

    parseInput(input: string) : Ray[] {
        const lines = input.split('\n');
        const rays : Ray[] = [];
        lines.forEach(l => {
            const nums = l.replace(',', '').replace('@', '').split(/\s+/).map(x => parseInt(x));
            rays.push({x: nums[0], y: nums[1], z: nums[2], vx: nums[3], vy: nums[4], vz: nums[5]});
        })
        return rays;
    }

    /** True if the two rays intersect on the x,y plane within bounds min <= x <= max and min <= y <= max */
    doRaysIntersect(a: Ray, b: Ray, min: number, max: number ) : boolean {
        const det = (b.vx * a.vy - b.vy * a.vx);
        if (det === 0) {
            // parallel lines
            return false;
        }
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const u = (dy * b.vx - dx * b.vy) / det;
        const v = (dy * a.vx - dx * a.vy) / det;
        if (u < 1 || v < 1) {
            // no intersection
            return false;
        }
        const intersect = {x: a.x + a.vx * u, y: a.y + a.vy * u, z: 0};
        if (max < intersect.x || min > intersect.x) {
            // intersects out of bounds
            return false;
        }
        if (max < intersect.y || min > intersect.y) {
            // intersects out of bounds
            return false;
        }
        // valid intersection
        return true;
    }
}

export default new Day24;