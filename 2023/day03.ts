class Day3 {

    // View challenge: https://adventofcode.com/2023/day/3

    solveForPartOne(input: string): number {
        const schema_lines = input.split('\n');
        let sum_of_parts = 0;
        for (let row_i = 0; row_i < schema_lines.length; row_i++) {

            const row = schema_lines[row_i];
            const number_matches = [...row.matchAll(/\d+/g)];

            for (let numMatch of number_matches) {
                const number_str = numMatch[0];
                const number = parseInt(number_str);

                const start_idx = numMatch.index!; // where the number starts
                const end_idx = start_idx + number_str.length - 1; // where the number ends

                const start_diag = start_idx > 0 ? start_idx - 1 : start_idx; // the left diagonal index
                const end_diag = end_idx < row.length - 1 ? end_idx + 1 : end_idx; // the right diagonal index

                // check for neighboring symbols

                // left side of the number
                if (start_idx > 0 && this.hasSymbol(row[start_idx - 1])) {
                    sum_of_parts += number;
                    continue;
                }
                // right side of the number
                if (end_idx < row.length - 1 && this.hasSymbol(row[end_idx + 1])) { 
                    sum_of_parts += number;
                    continue;
                }
                // above (previous row)
                if (row_i > 0) { 
                    const prev_row = schema_lines[row_i - 1];
                    const chars_above_num = prev_row.substring(start_diag, end_diag + 1);
                    if (this.hasSymbol(chars_above_num)) {
                        sum_of_parts += number;
                        continue;
                    }
                }
                // below (next row)
                if (row_i < schema_lines.length - 1 && this.hasSymbol(schema_lines[row_i + 1].substring(start_diag, end_diag + 1))) { 
                    const next_row = schema_lines[row_i + 1];
                    const chars_below_num = next_row.substring(start_diag, end_diag + 1);
                    if (this.hasSymbol(chars_below_num)) {
                        sum_of_parts += number;
                        continue;
                    }
                }                
            }
        }
        return sum_of_parts;
    }

    solveForPartTwo(input: string): number {
        const schema_lines = input.split('\n');
        let sum_gear_ratios = 0;
        for (let row_i = 0; row_i < schema_lines.length; row_i++) {
            const row = schema_lines[row_i];
            // indexes of all the stars (*) in this row
            const star_idxs = [...row.matchAll(/\*/g)].map(match => match.index!);

            for (let star_idx of star_idxs) {
                const start_diag = star_idx > 0 ? star_idx - 1 : star_idx; // the left diagonal index
                const end_diag = star_idx < row.length - 1 ? star_idx + 1 : star_idx; // the right diagonal index

                let neighbor_nums: number[] = []; // all the neighboring numbers of the star

                // check for neighboring numbers

                // left side of the star
                if (star_idx > 0 && this.hasNumber(row[star_idx - 1])) {
                    const left_str = row.substring(0, star_idx);
                    const matches = [...this.getAllNumbers(left_str)];
                    const final_match = matches[matches.length - 1][1];
                    neighbor_nums.push(parseInt(final_match));
                }
                // right side of the star
                if (star_idx < row.length - 1 && this.hasNumber(row[star_idx + 1])) {
                    const right_str = row.substring(star_idx + 1);
                    const right_side_num = right_str.match(/\d+/g)![0];
                    neighbor_nums.push(parseInt(right_side_num));
                }
                // above star (previous row)
                if (row_i > 0) { 
                    const prev_row = schema_lines[row_i - 1];
                    const chars_above_star = prev_row.substring(start_diag, end_diag + 1);

                    if (this.hasNumber(chars_above_star)) {
                        const all_prev_row_nums = [...this.getAllNumbers(prev_row)];
                        const nums_above_star = all_prev_row_nums.filter((match) => {
                            const start_num_idx = match.index!; // where the number starts
                            const end_num_idx = match.index! + match[1].length - 1; // where the number ends

                            return (star_idx >= start_num_idx - 1 && star_idx <= end_num_idx + 1);
                                
                        })
                        nums_above_star.forEach((match) => neighbor_nums.push(parseInt(match[1])));
                    }
                }
                // below star (next row)
                if (row_i < schema_lines.length - 1) {
                    const next_row = schema_lines[row_i + 1];
                    const chars_below_star = next_row.substring(start_diag, end_diag + 1);

                    if (this.hasNumber(chars_below_star)) {
                        const all_next_row_nums = [...this.getAllNumbers(next_row)];
                        const nums_below_star = all_next_row_nums.filter((match) => {
                            const start_num_idx = match.index!; // where the number starts
                            const end_num_idx = match.index! + match[1].length - 1; // where the number ends
                            
                            return (star_idx >= start_num_idx - 1 && star_idx <= end_num_idx + 1);

                        });
                        nums_below_star.forEach(match =>  neighbor_nums.push(parseInt(match[1])));
                    }
                }
                // am i a gear?
                if (neighbor_nums.length === 2) {
                    const gear_ratio = neighbor_nums[0] * neighbor_nums[1];
                    sum_gear_ratios += gear_ratio;
                }
                
            }
        }
        return sum_gear_ratios;
    }

    // ====== Helpers ======

    hasSymbol(s: string): boolean {
        return /[^\w\d\.]/.test(s);
    }
    hasNumber(s: string): boolean {
        return /\d/.test(s);
    }
    getAllNumbers(s: string) : RegExpMatchArray[] {
        return [...s.matchAll(/(\d+)/g)];
    }
}

export default new Day3;