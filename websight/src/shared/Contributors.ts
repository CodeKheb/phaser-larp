import rawContributors from '@contributors?raw';

/**
 * One parsed entry from contributors/CONTRIBUTORS.txt.
 *
 * File format (enforced by .github/workflows/first-contribution.yml):
 * `LNAME, FNAME, M.I. PROGRAM - SECTION - YEAR LEVEL`
 * e.g. `Dela Cruz, Juan, M. BSIT - NW2A - 3rd Year`
 */
export interface Contributor {
    /** Family name, e.g. "Dela Cruz". */
    last: string;
    /** Given name, e.g. "Juan". */
    first: string;
    /** Middle initial including the dot, e.g. "M."; may be empty. */
    middleInitial: string;
    /** Program/section/year part, e.g. "BSIT - NW2A - 3rd Year". */
    program: string;
}

/**
 * Splits one raw line into its parts.
 * Returns null when the line doesn't look like an entry at all.
 */
function parseLine(line: string): Contributor | null {
    const [last, first, tail] = line.split(', ').map((part) => part.trim());

    if (!last || !first || !tail) return null;

    // The middle initial and program share the third field:
    // "M. BSIT - NW2A - 3rd Year" — split the leading "M." off the rest.
    const match = /^([A-Za-z]\.)?\s*(.*)$/.exec(tail);
    if (!match) return null;

    return {
        last,
        first,
        middleInitial: match[1] ?? '',
        program: match[2].trim(),
    };
}

/**
 * All first-time contributors in file order (the file is append-only,
 * oldest entry first). Blank lines and `#` comments are skipped —
 * the same rule the first-contribution CI check applies.
 *
 * The raw file is inlined at build time via the `@contributors` alias
 * in vite.config.ts, so a new name appears after the next deploy build.
 */
export const CONTRIBUTORS: Contributor[] = rawContributors
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'))
    .map(parseLine)
    .filter((entry): entry is Contributor => entry !== null);

/**
 * Full display name for an entry, e.g. "Juan M. Dela Cruz".
 * @param entry the contributor to render
 */
export function displayName(entry: Contributor): string {
    return [entry.first, entry.middleInitial, entry.last]
        .filter((part) => part !== '')
        .join(' ');
}
