import type { Lab, TaskQ } from '../types';
import { cpp } from '../helpers';

// Lab sheets. Each task is solved by the learner first (live syntax check, unlimited hints);
// the model solution and its dry run open only after they solve it or give up.

/** join prompt lines (mini-markdown, `\n` = line break) */
const t = (...lines: string[]): string => lines.join('\n');

// =====================================================================================
// PF Lab Final · Spring 2020
// =====================================================================================

const SPR20 = 'PF Lab Final · Spring 2020';

const spr20q1: TaskQ = {
  id: 'lab-final-spr20-q1',
  kind: 'task',
  source: `${SPR20} · Q1`,
  tag: 'real life',
  prompt: t(
    '**Spreading V — a habitat simulation** (the big 50-mark question)',
    '',
    'You simulate a lab experiment on an `N x N` grid (the *habitat*). Every entity has **5 gates** named with letters from `{A, B, C, D, E, F, G, H}`.',
    '',
    '**Rules of the virus**',
    '• An entity can catch the virus only if it has gate `A` or gate `B`.',
    '• An infected entity that has **3 or more** of the gates `A, B, C, D` **dies** after `14` turns of being infected. Otherwise it **recovers** after `30` turns and is immune from then on.',
    '• An infected entity becomes **infectious after 3 turns**: at the start of a turn it spreads the virus only if it has already been infected for `3` or more turns.',
    '• A dead entity cannot move. It stays in the habitat for `5` more turns and is infectious during those turns, then it is removed from the grid.',
    '• The virus jumps from an infectious entity to a healthy (normal) one when they are **closer than 3 units in square form**: `|dx| < 3` and `|dy| < 3`.',
    '',
    '**Adapted for DryRun:** the original reads `input.txt` and writes `output.txt` and `turns.txt`. Here you read the *same text* with `cin` and print both reports with `cout`.',
    '',
    '**Input** (exactly like the file):',
    '`size 5\nturn_count 3\nentity_count 3\nentity 1 ACDEF 2x2 infected\nentity 2 BDFHC 4x5 normal\nentity 3 CDHGF 5x5 normal\nturn 1 2x3 4x5 5x4\nturn 2 3x3 4x4 5x3\nturn 3 3x4 4x3 5x2`',
    'A position `3x4` means column `x = 3`, row `y = 4` (both from `1`, row 1 is the top). A turn line gives the new position of every entity in order (a dead entity ignores its position).',
    '',
    '**Order of work in every turn**',
    '1. Move every entity that is not dead.',
    '2. Note which entities are infectious *now* (infected for 3+ turns, or dead but not removed yet).',
    '3. Update the clocks: every dead entity counts one more dead turn (after 5 it is removed); every infected entity counts one more sick turn and may die (`14`) or recover (`30`).',
    '4. Spread: every entity from step 2 infects every normal entity that has gate A or B and is closer than 3 units (a new infection starts with 0 sick turns).',
    '5. Print the turn: `Turn t:` and then the grid, one row per line, no spaces: `-` empty, `O` healthy (normal or recovered), `X` infected, `D` dead. If two entities share a cell, the one listed later wins.',
    '',
    '**After the last turn print the summary:**',
    '`Normal : 2\nInfected : 1\nDead : 0\nRecovered : 0\nentity 1 3x4 infected\nentity 2 4x3 normal\nentity 3 5x2 normal`',
    '(removed entities count as dead). Do not print any input prompts.',
  ),
  solution: cpp`
#include <iostream>
#include <string>
using namespace std;

const int MAXE = 10;

// one entity of the habitat
struct Entity {
    int id;
    string gates;
    int x, y;          // column and row, from 1
    int state;         // 0 normal, 1 infected, 2 dead, 3 recovered, 4 removed
    int sick;          // turns spent infected
    int deadFor;       // turns spent dead
    bool deadly;       // 3 or more of A, B, C, D
    bool canCatch;     // has gate A or B
};

bool hasGate(string gates, char g) {
    for (int i = 0; i < gates.length(); i++)
        if (gates[i] == g) return true;
    return false;
}

string stateName(int s) {
    if (s == 0) return "normal";
    if (s == 1) return "infected";
    if (s == 3) return "recovered";
    return "dead";               // dead or removed
}

void drawHabitat(Entity e[], int count, int n, int turn) {
    cout << "Turn " << turn << ":" << endl;
    for (int row = 1; row <= n; row++) {
        string line = "";
        for (int col = 1; col <= n; col++) {
            char c = '-';
            for (int k = 0; k < count; k++) {
                if (e[k].x == col && e[k].y == row && e[k].state != 4) {
                    if (e[k].state == 1) c = 'X';
                    else if (e[k].state == 2) c = 'D';
                    else c = 'O';
                }
            }
            line += c;
        }
        cout << line << endl;
    }
}

int main() {
    Entity e[MAXE];
    string word, status;
    char sep;
    int n, turns, count;
    cin >> word >> n >> word >> turns >> word >> count;

    for (int k = 0; k < count; k++) {
        cin >> word >> e[k].id >> e[k].gates >> e[k].x >> sep >> e[k].y >> status;
        e[k].state = (status == "infected") ? 1 : 0;
        e[k].sick = 0;
        e[k].deadFor = 0;
        int bad = 0;                                   // how many of A, B, C, D
        for (char g = 'A'; g <= 'D'; g++)
            if (hasGate(e[k].gates, g)) bad++;
        e[k].deadly = bad >= 3;
        e[k].canCatch = hasGate(e[k].gates, 'A') || hasGate(e[k].gates, 'B');
    }

    for (int t = 1; t <= turns; t++) {
        int num, nx, ny;
        cin >> word >> num;
        // 1. move everybody who is not dead
        for (int k = 0; k < count; k++) {
            cin >> nx >> sep >> ny;
            if (e[k].state != 2 && e[k].state != 4) {
                e[k].x = nx;
                e[k].y = ny;
            }
        }
        // 2. who is infectious at the start of this turn?
        bool infectious[MAXE];
        for (int k = 0; k < count; k++)
            infectious[k] = (e[k].state == 1 && e[k].sick >= 3) || e[k].state == 2;
        // 3. update the clocks (dead ones first, so a new death is not counted twice)
        for (int k = 0; k < count; k++) {
            if (e[k].state == 2) {
                e[k].deadFor++;
                if (e[k].deadFor >= 5) e[k].state = 4;       // removed
            } else if (e[k].state == 1) {
                e[k].sick++;
                if (e[k].deadly && e[k].sick >= 14) e[k].state = 2;
                else if (!e[k].deadly && e[k].sick >= 30) e[k].state = 3;
            }
        }
        // 4. spread the virus
        for (int a = 0; a < count; a++) {
            if (!infectious[a]) continue;
            for (int b = 0; b < count; b++) {
                int dx = e[a].x - e[b].x, dy = e[a].y - e[b].y;
                if (dx < 0) dx = -dx;
                if (dy < 0) dy = -dy;
                if (e[b].state == 0 && e[b].canCatch && dx < 3 && dy < 3) {
                    e[b].state = 1;
                    e[b].sick = 0;
                }
            }
        }
        // 5. the turn report
        drawHabitat(e, count, n, t);
    }

    // final summary
    int normal = 0, infected = 0, dead = 0, recovered = 0;
    for (int k = 0; k < count; k++) {
        if (e[k].state == 0) normal++;
        else if (e[k].state == 1) infected++;
        else if (e[k].state == 3) recovered++;
        else dead++;
    }
    cout << "Normal : " << normal << endl;
    cout << "Infected : " << infected << endl;
    cout << "Dead : " << dead << endl;
    cout << "Recovered : " << recovered << endl;
    for (int k = 0; k < count; k++)
        cout << "entity " << e[k].id << " " << e[k].x << "x" << e[k].y << " " << stateName(e[k].state) << endl;
    return 0;
}
`,
  tests: [
    {
      input: 'size 5\nturn_count 3\nentity_count 3\nentity 1 ACDEF 2x2 infected\nentity 2 BDFHC 4x5 normal\nentity 3 CDHGF 5x5 normal\nturn 1 2x3 4x5 5x4\nturn 2 3x3 4x4 5x3\nturn 3 3x4 4x3 5x2\n',
      label: 'the paper example (3 turns, nobody is infectious yet)',
    },
    {
      input: 'size 5\nturn_count 5\nentity_count 3\nentity 1 ACDEF 2x2 infected\nentity 2 BDFHC 4x5 normal\nentity 3 CDHGF 5x5 normal\nturn 1 2x3 4x5 5x4\nturn 2 3x3 4x4 5x3\nturn 3 3x4 4x3 5x2\nturn 4 3x3 4x3 5x3\nturn 5 2x3 4x2 4x3\n',
      label: '5 turns: entity 1 infects entity 2 in turn 4, entity 3 has no A/B gate',
    },
    {
      input: 'size 4\nturn_count 20\nentity_count 2\nentity 1 ABCDE 1x1 infected\nentity 2 EFGHC 4x4 normal\nturn 1 1x1 4x4\nturn 2 1x2 4x4\nturn 3 1x2 4x3\nturn 4 1x1 4x4\nturn 5 1x1 4x4\nturn 6 1x1 4x4\nturn 7 1x1 4x4\nturn 8 1x1 4x4\nturn 9 1x1 4x4\nturn 10 1x1 4x4\nturn 11 1x1 4x4\nturn 12 1x1 4x4\nturn 13 2x1 4x4\nturn 14 2x2 4x4\nturn 15 3x3 4x4\nturn 16 3x3 4x4\nturn 17 3x3 4x3\nturn 18 3x3 4x4\nturn 19 3x3 4x4\nturn 20 3x3 4x4\n',
      label: '20 turns: entity 1 dies in turn 14, stays 5 turns, then is removed',
    },
  ],
  compare: 'lines',
  steps: [
    'Understand first: this is a *simulation*. Every turn the same 5 jobs happen in the same order (move → who is infectious → clocks → spread → print). Write that order down before you code.',
    'Plan one **struct** for an entity: `id`, `gates` (a string like `ACDEF`), `x`, `y`, a `state` number (0 normal, 1 infected, 2 dead, 3 recovered, 4 removed), `sick` (turns infected), `deadFor` (turns dead). Keep all entities in an array of structs.',
    'Reading: the words `size`, `turn_count`, `entity`, `turn` can be read into a throw-away `string word`. A position like `2x3` is read as `int`, then `char` (the `x`), then `int`: `cin >> x >> sep >> y;`.',
    'Work out the fixed facts once, while reading each entity: `canCatch` = has gate A or B; `deadly` = counts how many of A, B, C, D it has and checks `>= 3`. A small function `hasGate(gates, g)` with a loop makes this easy.',
    'In each turn, first read the turn line and move every entity that is not dead or removed.',
    'Then fill a `bool infectious[]` array **before** changing anything: infected with `sick >= 3`, or dead. This way a brand-new infection cannot spread in the same turn.',
    'Clocks: for a dead entity `deadFor++` (at 5 it becomes removed). For an infected one `sick++`; if deadly and `sick >= 14` it dies, if not deadly and `sick >= 30` it recovers.',
    'Spread with two nested loops (a = infectious one, b = target). Distance in square form: take `dx` and `dy`, make them positive, and check `dx < 3 && dy < 3`. Only a normal entity that can catch it gets infected (`sick = 0`).',
    'Printing the grid: for every row, for every column, start with `-` and let each entity standing there overwrite it with `O`, `X` or `D`. Print `Turn t:` before the grid.',
    'At the end count the states (removed counts as dead) and print the 4 summary lines, then one line per entity: `entity 1 3x4 infected`.',
  ],
};

const spr20q2: TaskQ = {
  id: 'lab-final-spr20-q2',
  kind: 'task',
  source: `${SPR20} · Q2`,
  tag: 'real life',
  prompt: t(
    '**Bunny hops** (everybody likes bunnies)',
    '',
    'A bunny sits on a `10 x 10` grid (valid coordinates `0` to `9`) at `(X, Y)` and has some **carrot sticks** of energy. One hop eats one carrot.',
    '• direction `0` = **north**: `Y + 1`',
    '• direction `1` = **east**: `X + 1`',
    '• direction `2` = **south**: `Y - 1`',
    '• direction `3` = **west**: `X - 1`',
    '',
    '**Rules**',
    '• The bunny must stay inside the grid. If a hop would leave it, print `Grid limit exceeds, Bunny cannot hop` and stop.',
    '• If the bunny moved **east**, it cannot hop **north** next.',
    '• A hop **south** must be followed by a hop **west**.',
    '• If one of these two rules is broken, print `Bunny cannot hop` and stop taking directions.',
    '• A direction that is not `0`–`3` prints `Invalid direction` and the program reads the next direction.',
    '• When all carrots are eaten, print `Bunny cannot hop` and stop.',
    '',
    '**What to write**',
    '• Read `X`, `Y` and the number of carrots.',
    '• `hop(direction, x, y, carrots)` — if no carrot is left it prints `Bunny cannot hop`; otherwise it updates the coordinates and eats one carrot (check the grid limit here too).',
    '• `displayInfo(x, y, carrots)` prints `Bunny at location 7, 6 with 2 carrots` (always the word *carrots*).',
    '• `main()` calls `displayInfo` at the start and after every successful hop. **No global variables.** No input prompts.',
    '',
    'Example: input `7 6 2` and directions `1 1` prints',
    '`Bunny at location 7, 6 with 2 carrots\nBunny at location 8, 6 with 1 carrots\nBunny at location 9, 6 with 0 carrots\nBunny cannot hop`',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

void displayInfo(int x, int y, int carrots) {
    cout << "Bunny at location " << x << ", " << y << " with " << carrots << " carrots" << endl;
}

// moves the bunny one step; returns false if it could not hop
bool hop(int direction, int &x, int &y, int &carrots) {
    if (carrots == 0) {
        cout << "Bunny cannot hop" << endl;
        return false;
    }
    int nx = x, ny = y;
    if (direction == 0) ny++;          // north
    else if (direction == 1) nx++;     // east
    else if (direction == 2) ny--;     // south
    else nx--;                         // west
    if (nx < 0 || nx > 9 || ny < 0 || ny > 9) {
        cout << "Grid limit exceeds, Bunny cannot hop" << endl;
        return false;
    }
    x = nx;
    y = ny;
    carrots--;
    return true;
}

int main() {
    int x, y, carrots;
    cin >> x >> y >> carrots;
    displayInfo(x, y, carrots);

    int last = -1;                     // the previous direction (none yet)
    while (true) {
        if (carrots == 0) {            // no energy left
            hop(0, x, y, carrots);
            break;
        }
        int direction;
        cin >> direction;
        if (direction < 0 || direction > 3) {
            cout << "Invalid direction" << endl;
            continue;
        }
        // east cannot be followed by north, south must be followed by west
        if ((last == 1 && direction == 0) || (last == 2 && direction != 3)) {
            cout << "Bunny cannot hop" << endl;
            break;
        }
        if (!hop(direction, x, y, carrots)) break;
        displayInfo(x, y, carrots);
        last = direction;
    }
    return 0;
}
`,
  tests: [
    { input: '7 6 2\n1 1\n', label: 'runs out of carrots' },
    { input: '9 2 4\n3 1 1\n', label: 'leaves the grid on the right' },
    { input: '5 2 4\n1 0\n', label: 'east followed by north' },
    { input: '1 2 3\n1 7 2 0\n', label: 'invalid direction, then south not followed by west' },
  ],
  compare: 'lines',
  steps: [
    'Understand: the bunny keeps hopping until something stops it. List every way it can stop: no carrots, leaves the grid, breaks a direction rule.',
    'Variables in `main` (no globals!): `x`, `y`, `carrots`, and `last` = the previous direction (start with `-1`, meaning "no hop yet").',
    '`displayInfo` only prints one line. Write it first and call it right after reading the start values.',
    '`hop` must change `x`, `y` and `carrots` in `main`, so pass them **by reference** (`int &x`). Let it return `bool` so `main` knows whether to stop.',
    'Inside `hop`: first check `carrots == 0`. Then compute the new position in `nx`, `ny` with an `if / else if` on the direction, and check `0 <= nx <= 9` and `0 <= ny <= 9` before you store it.',
    'In `main` use `while (true)`. At the top: if the carrots are gone, let `hop` print its message and `break`.',
    'Read the direction. If it is not 0–3, print `Invalid direction` and `continue` (read again).',
    'Check the two rules with `last`: `(last == 1 && direction == 0)` or `(last == 2 && direction != 3)` → print `Bunny cannot hop` and `break`.',
    'Otherwise call `hop`; if it returns false, `break`. If it worked, call `displayInfo` and remember `last = direction`.',
  ],
};

const spr20q3: TaskQ = {
  id: 'lab-final-spr20-q3',
  kind: 'task',
  source: `${SPR20} · Q3`,
  prompt: t(
    '**Addition of (very) large numbers**',
    '',
    'Numbers like `109876201453` are too big to add safely as normal integers, so we add them digit by digit, like on paper.',
    '',
    '• Read two numbers as **char arrays** with `cin.getline` (maximum `20` digits each).',
    '• Store each number in its own **integer array**, one digit per index. While doing that, validate: only the characters `0`–`9` are allowed (no letters, no `+ - * & ^ % $ # @ ! ~ . , ? ;` …).',
    '• If the first number is invalid print `First number is invalid`; if the second one is invalid print `Second number is invalid`.',
    '• Otherwise add the two numbers and store the answer **digit by digit in a third array**, then print it.',
    '',
    '**Rules:** `string` and built-in functions (like `strlen`) are **not** allowed. Use `cin.getline` for input. Maximum array size `20`.',
    '',
    'Examples:',
    '`120367` and `1203a7` → `Second number is invalid`',
    '`1233677001257` and `1002` → `1233677002259`',
    '`109876201453` and `1203009954` → `111079211407`',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

const int MAX = 20;

// copies the digits of text into digits[]; returns false if a non-digit is found
bool toDigits(char text[], int digits[], int &len) {
    len = 0;
    while (text[len] != '\0') {
        if (text[len] < '0' || text[len] > '9') return false;
        digits[len] = text[len] - '0';     // '7' - '0' = 7
        len++;
    }
    return len > 0;
}

int main() {
    char num1[MAX + 1], num2[MAX + 1];
    int a[MAX], b[MAX], sum[MAX + 1];
    int lenA, lenB;
    cin.getline(num1, MAX + 1);
    cin.getline(num2, MAX + 1);

    if (!toDigits(num1, a, lenA)) {
        cout << "First number is invalid" << endl;
        return 0;
    }
    if (!toDigits(num2, b, lenB)) {
        cout << "Second number is invalid" << endl;
        return 0;
    }

    // add from the last digit; sum[] gets the answer from right to left
    int i = lenA - 1, j = lenB - 1, k = 0, carry = 0;
    while (i >= 0 || j >= 0 || carry > 0) {
        int d = carry;
        if (i >= 0) d += a[i--];
        if (j >= 0) d += b[j--];
        sum[k] = d % 10;
        carry = d / 10;
        k++;
    }
    for (int m = k - 1; m >= 0; m--) cout << sum[m];
    cout << endl;
    return 0;
}
`,
  tests: [
    { input: '120367\n1203a7\n', label: 'second number has a letter' },
    { input: '1233677001257\n1002\n', label: 'different lengths' },
    { input: '109876201453\n1203009954\n', label: 'paper example' },
    { input: '99999\n1\n', label: 'carry all the way: 99999 + 1' },
  ],
  compare: 'lines',
  steps: [
    'Understand: you do school addition — start at the **last** digit of both numbers, add them plus the carry, write `d % 10`, carry `d / 10`.',
    'Plan the arrays: two `char` arrays of size `21` (20 digits + `\\0`), two `int` arrays for the digits, and a third `int` array (size 21) for the answer.',
    'Read both lines with `cin.getline(num1, 21);`.',
    'Write one function that walks a char array until `\\0`. For every character check `c < \'0\' || c > \'9\'` → invalid. Otherwise store `c - \'0\'` (the ASCII trick turns `\'7\'` into `7`). It also gives you the length, so you do not need `strlen`.',
    'Print the right "invalid" message and stop if a number is not valid.',
    'For the addition keep two indexes `i` and `j` at the last digits and a `carry = 0`. Loop while `i >= 0 || j >= 0 || carry > 0` — the carry part handles `99999 + 1`.',
    'Inside the loop only add `a[i]` if `i >= 0` (the shorter number runs out first). Store `d % 10` in the sum array and move the indexes left.',
    'The sum array is filled from right to left, so print it **backwards** (from the last filled index down to 0).',
  ],
};

// =====================================================================================
// PF Lab Final · Fall 2022
// =====================================================================================

const F22 = 'PF Lab Final · Fall 2022';
const CORPUS = 'hello i am toqeer how is the life? what is going in the life? life is very short.\n';

const f22q1: TaskQ = {
  id: 'lab-final-fall22-q1',
  kind: 'task',
  source: `${F22} · Q1`,
  tag: 'real life',
  prompt: t(
    '**Shrinking an image with a filter**',
    '',
    'An image is stored as a square matrix of values `0`–`256`. To make it smaller we slide a square **filter** over it. The output size is',
    '`O = (Image - Filter) / 2 + 1`',
    'so a `6 x 6` image with a `2 x 2` filter gives a `3 x 3` output. The filter jumps **2 places** each time (right, and then down).',
    '',
    '**Rule for each output cell**',
    '1. Place the filter over a block of the image.',
    '2. `filter_max` = the maximum element of the filter.',
    '3. `img_max` = the maximum element of the image **in that block**.',
    '4. If `filter_max > img_max` store `filter_max`, otherwise store `img_max`.',
    '',
    '**Input:** the image size, the filter size, then the image rows, then the filter rows (sizes at most `10`).',
    '**Output:** `Output image size: 3 x 3` and then the output matrix, one row per line.',
    '',
    'Example image (6 x 6) with filter `33 45 / 11 110` gives:',
    '`197 256 134\n167 110 110\n161 255 110`',
    '(the first block `128 197 / 31 176` has max `197`, which beats `110`; the block `32 89 / 48 89` has max `89`, so `110` is stored).',
    '',
    '**Rubric:** full marks only if the program uses functions.',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

const int MAX = 10;

void readMatrix(int m[][MAX], int size) {
    for (int i = 0; i < size; i++)
        for (int j = 0; j < size; j++)
            cin >> m[i][j];
}

// largest value in the size x size block that starts at (row, col)
int blockMax(int m[][MAX], int row, int col, int size) {
    int best = m[row][col];
    for (int i = row; i < row + size; i++)
        for (int j = col; j < col + size; j++)
            if (m[i][j] > best) best = m[i][j];
    return best;
}

void applyFilter(int image[][MAX], int imgSize, int filter[][MAX], int filSize, int out[][MAX], int outSize) {
    int filterMax = blockMax(filter, 0, 0, filSize);
    for (int r = 0; r < outSize; r++) {
        for (int c = 0; c < outSize; c++) {
            int imgMax = blockMax(image, r * 2, c * 2, filSize);   // the filter jumps 2 places
            out[r][c] = (filterMax > imgMax) ? filterMax : imgMax;
        }
    }
}

int main() {
    int image[MAX][MAX], filter[MAX][MAX], out[MAX][MAX];
    int imgSize, filSize;
    cin >> imgSize >> filSize;
    readMatrix(image, imgSize);
    readMatrix(filter, filSize);

    int outSize = (imgSize - filSize) / 2 + 1;
    applyFilter(image, imgSize, filter, filSize, out, outSize);

    cout << "Output image size: " << outSize << " x " << outSize << endl;
    for (int r = 0; r < outSize; r++) {
        for (int c = 0; c < outSize; c++)
            cout << out[r][c] << " ";
        cout << endl;
    }
    return 0;
}
`,
  tests: [
    {
      input: '6 2\n128 197 256 88 134 0\n31 176 256 76 14 60\n11 145 32 89 11 07\n12 167 48 89 31 08\n51 18 255 67 13 60\n161 19 76 67 41 40\n33 45\n11 110\n',
      label: 'the paper example (6 x 6, filter 2 x 2)',
    },
    { input: '4 2\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16\n0 9\n9 0\n', label: '4 x 4 image, filter max 9' },
    {
      input: '5 3\n10 20 30 40 50\n5 5 5 5 5\n1 2 3 4 5\n60 0 0 0 70\n9 9 9 9 9\n1 1 1\n1 25 1\n1 1 1\n',
      label: '5 x 5 image, 3 x 3 filter (blocks overlap)',
    },
  ],
  compare: 'numbers',
  steps: [
    'Understand with the example: the output has `O x O` cells. Output cell `(r, c)` comes from the image block whose top-left corner is `(2r, 2c)` — that is the "jump 2 places".',
    'Variables: three 2D arrays (`image`, `filter`, `out`) of size `10 x 10`, and the sizes `imgSize`, `filSize`, `outSize`.',
    'Read the two sizes, then the image with two nested loops, then the filter. A `readMatrix(m, size)` function saves you writing the loops twice.',
    'Compute `outSize = (imgSize - filSize) / 2 + 1`.',
    'Write one helper `blockMax(m, row, col, size)` that finds the largest value in a `size x size` block starting at `(row, col)`. Start `best` with the first cell of the block, not with 0.',
    'The filter maximum is just `blockMax(filter, 0, 0, filSize)` — compute it once.',
    'Two nested loops over `r` and `c` (0 to `outSize - 1`): `imgMax = blockMax(image, r * 2, c * 2, filSize)`, then store the bigger of `filterMax` and `imgMax`.',
    'Print `Output image size: O x O`, then the output matrix row by row.',
  ],
};

const f22q2a: TaskQ = {
  id: 'lab-final-fall22-q2a',
  kind: 'task',
  source: `${F22} · Q2 (part 1)`,
  prompt: t(
    '**Corpus 1/3 — remove the small words**',
    '',
    'You are given a list of words stored in a **char array** (a *corpus*). Remove every word that is in this list:',
    '`string remove_words[] = {"is", "am", "of", "are", "the"};`',
    '',
    'Function prototype: `void remove_words(char arr[], string remove_words[], int size = 5)` (`size` is the size of the remove list; in your code you may give the second parameter another name). Words are separated by spaces; `life?` is one word, and it is not removed. Keep one space between the remaining words.',
    '',
    'Read the corpus with `cin.getline` (at most 300 characters), call the function, then print the corpus.',
    '',
    'Input: `hello i am toqeer how is the life? what is going in the life? life is very short.`',
    'Output: `hello i toqeer how life? what going in life? life very short.`',
  ),
  solution: cpp`
#include <iostream>
#include <cstring>
#include <string>
using namespace std;

void remove_words(char arr[], string removeList[], int size = 5) {
    char result[300] = "";
    char word[50];
    int i = 0;
    while (arr[i] != '\0') {
        if (arr[i] == ' ') {          // skip the spaces between words
            i++;
            continue;
        }
        int w = 0;                    // copy one word
        while (arr[i] != ' ' && arr[i] != '\0') {
            word[w] = arr[i];
            w++;
            i++;
        }
        word[w] = '\0';
        bool drop = false;            // is it in the remove list?
        for (int k = 0; k < size; k++)
            if (strcmp(word, removeList[k].c_str()) == 0) drop = true;
        if (!drop) {
            if (strlen(result) > 0) strcat(result, " ");
            strcat(result, word);
        }
    }
    strcpy(arr, result);              // put the new text back into arr
}

int main() {
    char corpus[300];
    string removeList[] = {"is", "am", "of", "are", "the"};
    cin.getline(corpus, 300);
    remove_words(corpus, removeList);
    cout << corpus << endl;
    return 0;
}
`,
  tests: [
    { input: CORPUS, label: 'the paper corpus' },
    { input: 'the cat is on the mat\n', label: 'starts with a removed word' },
    { input: 'what are you thinking of island theme\n', label: '"island" and "theme" must stay' },
  ],
  compare: 'lines',
  steps: [
    'Understand: you must compare **whole words**, not pieces. `island` contains `is` but must not be touched.',
    'Plan: walk through `arr` and cut it into words; build the answer in a second char array `result` (start it as `""`).',
    'Skip spaces with an `if` + `continue`. When you reach a letter, copy characters into `char word[50]` until a space or `\\0`, then close it with `word[w] = \'\\0\'`.',
    'Check the word against the list with a loop over `size` entries. Comparing a C-string with a `string`: `strcmp(word, list[k].c_str()) == 0` (or `list[k] == word`).',
    'If the word is not in the list, add it to `result` with `strcat` — and add a space first if `result` is not empty.',
    'At the end copy the answer back: `strcpy(arr, result);` — `arr` is the caller\'s array, so `main` sees the change.',
    'In `main`: `cin.getline(corpus, 300);`, call `remove_words(corpus, list);` (the default `size = 5` is used), print `corpus`.',
  ],
};

const f22q2b: TaskQ = {
  id: 'lab-final-fall22-q2b',
  kind: 'task',
  source: `${F22} · Q2 (part 2)`,
  prompt: t(
    '**Corpus 2/3 — frequency of each word**',
    '',
    'Write `void display_word_count(char words[])` that prints how many times each word appears in the corpus.',
    '',
    '• A word is a group of letters; punctuation (`?`, `.`) is not part of the word, so `life?` counts as `life`.',
    '• Print every different word **once**, in the order it first appears, as `word: count` (one per line).',
    '',
    'Read the corpus with `cin.getline` (at most 300 characters).',
    '',
    'Input: `hello i am toqeer how is the life? what is going in the life? life is very short.`',
    'Output starts with: `hello: 1\ni: 1\nam: 1\ntoqeer: 1\nhow: 1\nis: 3\nthe: 2\nlife: 3\n…`',
  ),
  solution: cpp`
#include <iostream>
#include <cstring>
using namespace std;

bool isLetter(char c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

void display_word_count(char words[]) {
    char list[60][30];        // the different words found so far
    int counts[60];
    int total = 0;
    char word[30];
    int i = 0;
    while (words[i] != '\0') {
        if (!isLetter(words[i])) {    // spaces and punctuation separate words
            i++;
            continue;
        }
        int w = 0;
        while (isLetter(words[i])) {
            word[w] = words[i];
            w++;
            i++;
        }
        word[w] = '\0';
        int found = -1;               // have we seen this word before?
        for (int k = 0; k < total; k++)
            if (strcmp(list[k], word) == 0) found = k;
        if (found >= 0) counts[found]++;
        else {
            strcpy(list[total], word);
            counts[total] = 1;
            total++;
        }
    }
    for (int k = 0; k < total; k++)
        cout << list[k] << ": " << counts[k] << endl;
}

int main() {
    char corpus[300];
    cin.getline(corpus, 300);
    display_word_count(corpus);
    return 0;
}
`,
  tests: [
    { input: CORPUS, label: 'the paper corpus' },
    { input: 'to be or not to be\n', label: 'to be or not to be' },
    { input: 'go, go, go! stop.\n', label: 'punctuation next to words' },
  ],
  compare: 'lines',
  steps: [
    'Understand: you need a small "table" of different words and a count for each word.',
    'Plan the table: `char list[60][30]` (one row per different word), `int counts[60]`, and `int total = 0` (how many rows are used).',
    'Walk through the text. A helper `isLetter(c)` makes the loop easy: if the character is not a letter, skip it.',
    'When you find a letter, copy letters into `char word[30]` until a non-letter, and end it with `\\0`.',
    'Search the table: loop `k` from `0` to `total - 1` and compare with `strcmp(list[k], word) == 0`.',
    'Found → `counts[k]++`. Not found → `strcpy(list[total], word); counts[total] = 1; total++;` (this keeps first-appearance order).',
    'At the end print every row as `word: count`.',
  ],
};

const f22q2c: TaskQ = {
  id: 'lab-final-fall22-q2c',
  kind: 'task',
  source: `${F22} · Q2 (part 3)`,
  prompt: t(
    '**Corpus 3/3 — count the alphabets**',
    '',
    'Write `int* alphabets_count(char words[])` that counts every **small** letter `a`–`z` in the corpus.',
    '',
    'Hint from the paper: use an integer array of size `26`, where index `0` counts `a` and index `25` counts `z`. Create it with `new`, return the pointer, and let `main` print it and `delete[]` it.',
    '',
    'Print all 26 counts on one line: `a: 2, b: 0, c: 0, … z: 0`',
    '',
    'Read the corpus with `cin.getline` (at most 300 characters).',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

int* alphabets_count(char words[]) {
    int *count = new int[26];
    for (int k = 0; k < 26; k++) count[k] = 0;
    for (int i = 0; words[i] != '\0'; i++)
        if (words[i] >= 'a' && words[i] <= 'z')
            count[words[i] - 'a']++;          // 'a' -> 0, 'b' -> 1, ... 'z' -> 25
    return count;
}

int main() {
    char corpus[300];
    cin.getline(corpus, 300);
    int *count = alphabets_count(corpus);
    for (int k = 0; k < 26; k++) {
        cout << char('a' + k) << ": " << count[k];
        if (k < 25) cout << ", ";
    }
    cout << endl;
    delete[] count;
    return 0;
}
`,
  tests: [
    { input: CORPUS, label: 'the paper corpus' },
    { input: 'Zebra ZOO buzz\n', label: 'capital letters are not counted' },
    { input: 'the quick brown fox jumps over the lazy dog\n', label: 'every letter at least once' },
  ],
  compare: 'numbers',
  steps: [
    'Understand: one counter per letter — 26 counters. Letter `c` belongs to index `c - \'a\'` (ASCII trick: `\'e\' - \'a\'` is `4`).',
    'Inside the function create the counters on the heap: `int *count = new int[26];` and set all of them to `0` with a loop (`new` does not clear them).',
    'Walk through the text until `\\0`. Only if the character is between `\'a\'` and `\'z\'`, do `count[c - \'a\']++`.',
    'Return the pointer. The array lives on the heap, so it still exists after the function ends.',
    'In `main`, loop `k` from `0` to `25` and print `char(\'a\' + k)`, `": "`, and `count[k]`, with `", "` between them.',
    'Finish with `delete[] count;` — every `new[]` needs one `delete[]`.',
  ],
};

const f22q3: TaskQ = {
  id: 'lab-final-fall22-q3',
  kind: 'task',
  source: `${F22} · Q3`,
  prompt: t(
    '**Most frequent elements**',
    '',
    'Write a function `mostFrequentElementsInArray(int *array, int size, int frequency)` that finds the elements which occur `frequency` times **or more**. Each such element is reported **once**, in the order it first appears.',
    '',
    'Example: `Arr = [2, 2, 4, 2, 4, 5, 6, 1, 1]`, frequency `2` → `2 4 1`.',
    '',
    '**Use only pointers and dynamic memory:** read `size`, create the array with `new`, read the elements, then read `frequency`.',
    '*Adapted:* the function returns the answer in a new dynamic array, so it gets one more parameter `int &count` for the number of elements found: `int* mostFrequentElementsInArray(int *array, int size, int frequency, int &count)`.',
    'Print the elements separated by spaces, or `None` if no element qualifies. Free all memory.',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

int* mostFrequentElementsInArray(int *array, int size, int frequency, int &count) {
    int *result = new int[size];
    count = 0;
    for (int i = 0; i < size; i++) {
        // skip a value we already handled earlier
        bool seen = false;
        for (int j = 0; j < i; j++)
            if (*(array + j) == *(array + i)) seen = true;
        if (seen) continue;
        // count how many times it occurs
        int times = 0;
        for (int j = i; j < size; j++)
            if (*(array + j) == *(array + i)) times++;
        if (times >= frequency) {
            *(result + count) = *(array + i);
            count++;
        }
    }
    return result;
}

int main() {
    int size, frequency;
    cin >> size;
    int *arr = new int[size];
    for (int i = 0; i < size; i++) cin >> *(arr + i);
    cin >> frequency;

    int count;
    int *answer = mostFrequentElementsInArray(arr, size, frequency, count);
    if (count == 0) cout << "None";
    for (int i = 0; i < count; i++) cout << *(answer + i) << " ";
    cout << endl;

    delete[] answer;
    delete[] arr;
    return 0;
}
`,
  tests: [
    { input: '9\n2 2 4 2 4 5 6 1 1\n2\n', label: 'paper example, frequency 2' },
    { input: '9\n2 2 4 2 4 5 6 1 1\n3\n', label: 'same array, frequency 3' },
    { input: '5\n1 2 3 4 5\n2\n', label: 'no element repeats' },
    { input: '6\n7 7 7 7 7 7\n1\n', label: 'one value only, reported once' },
  ],
  compare: 'lines',
  steps: [
    'Understand: two jobs for every element — (1) has it been handled already? (2) how many times does it occur?',
    'Dynamic memory in `main`: `int *arr = new int[size];` and read with `cin >> *(arr + i);`.',
    'In the function create the answer array `new int[size]` (it can never be bigger than `size`) and set `count = 0`.',
    'Outer loop over `i`. Inner loop over `j < i`: if an earlier element has the same value, this value was already handled → `continue`.',
    'Otherwise count its occurrences with another loop from `i` to `size - 1`.',
    'If `times >= frequency`, store it: `*(result + count) = *(array + i); count++;`.',
    'Return the pointer; `count` reaches `main` because it is a reference parameter.',
    'Print `None` when `count == 0`, otherwise the elements. Then `delete[]` both arrays.',
  ],
};

const f22q4: TaskQ = {
  id: 'lab-final-fall22-q4',
  kind: 'task',
  source: `${F22} · Q4`,
  prompt: t(
    '**Ways to write n with 1, 3 and 4 (recursion)**',
    '',
    'Write a **recursive** function `int count(int n)` that returns the number of ways to write a non-negative integer `n` as an ordered sum of `1`, `3` and `4`. (Order matters: `1+4` and `4+1` are different ways.) **No loops** in `count`.',
    '',
    'In `main` read `n` and print `count(n)`.',
    '',
    'For `n = 5` the ways are `1+1+1+1+1`, `1+1+3`, `1+3+1`, `3+1+1`, `1+4`, `4+1` → **6**.',
    '*(The original paper says 3, but it forgot the three ways that use a 3.)*',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

int count(int n) {
    if (n == 0) return 1;       // one way: the empty sum
    if (n < 0) return 0;        // went past zero: not a way
    // the first number of the sum is 1, 3 or 4
    return count(n - 1) + count(n - 3) + count(n - 4);
}

int main() {
    int n;
    cin >> n;
    cout << count(n) << endl;
    return 0;
}
`,
  tests: [
    { input: '5\n', label: 'n = 5' },
    { input: '0\n', label: 'n = 0' },
    { input: '4\n', label: 'n = 4' },
    { input: '8\n', label: 'n = 8' },
  ],
  compare: 'numbers',
  steps: [
    'Understand: every way starts with a first number — `1`, `3` or `4`. After that, the rest is a smaller problem.',
    'So the recursive idea is: ways(n) = ways(n - 1) + ways(n - 3) + ways(n - 4).',
    'Base case 1: `n == 0` means we used up exactly all of n — that counts as **1** way.',
    'Base case 2: `n < 0` means we went too far — **0** ways.',
    'Put the base cases **before** the recursive calls, or the function never stops.',
    'Check by hand: count(1) = 1, count(2) = 1, count(3) = 2, count(4) = 4, so count(5) = 4 + 1 + 1 = 6.',
    '`main` only reads `n` and prints `count(n)`.',
  ],
};

// =====================================================================================
// PF Lab Final · Fall 2023
// =====================================================================================

const F23 = 'PF Lab Final · Fall 2023';

const f23q1: TaskQ = {
  id: 'lab-final-fall23-q1',
  kind: 'task',
  source: `${F23} · Q1`,
  prompt: t(
    '**The wave pattern (function + loops)**',
    '',
    'Make a function `void pattern(int waveLength, int waveHeight)` that prints the pattern below using loops. Your `main` must be exactly:',
    '`int main() {\n    for (int i = 3, j = 3; i <= 8; i++, j += 2) {\n        cout << "length=" << i << " & height=" << j << endl;\n        pattern(i, j);\n        cout << endl;\n    }\n}`',
    '',
    'The first three outputs:',
    '`length=3 & height=3\n* ** ** *\n *  *  *\n* ** ** *\n\nlength=4 & height=5\n*   **   **   **   *\n * *  * *  * *  * *\n  *    *    *    *\n * *  * *  * *  * *\n*   **   **   **   *\n\nlength=5 & height=7\n*     **     **     **     **     *\n *   *  *   *  *   *  *   *  *   *\n  * *    * *    * *    * *    * *\n   *      *      *      *      *\n  * *    * *    * *    * *    * *\n *   *  *   *  *   *  *   *  *   *\n*     **     **     **     **     *`',
    '… and it goes on up to `length=8 & height=13`.',
    '',
    'The paper: *"Even an error of a single character will be considered incorrect."* (Spaces at the end of a line do not matter here.)',
  ),
  solution: cpp`
#include <iostream>
#include <string>
using namespace std;

// waveLength = how many X shapes, waveHeight = rows (each X is waveHeight wide)
void pattern(int waveLength, int waveHeight) {
    for (int r = 0; r < waveHeight; r++) {
        // build one X-piece of this row once ...
        string piece = "";
        for (int c = 0; c < waveHeight; c++) {
            if (c == r || c == waveHeight - 1 - r) piece += '*';
            else piece += ' ';
        }
        // ... and print it waveLength times side by side
        for (int k = 0; k < waveLength; k++) cout << piece;
        cout << endl;
    }
}

int main() {
    for (int i = 3, j = 3; i <= 8; i++, j += 2) {
        cout << "length=" << i << " & height=" << j << endl;
        pattern(i, j);
        cout << endl;
    }
    return 0;
}
`,
  tests: [{ label: 'no input — the six waves' }],
  compare: 'exact',
  steps: [
    'Understand the picture: look at `length=3 & height=3`. The row `* ** ** *` is really `*_*` `*_*` `*_*` — three copies of one small **X** of width 3 put side by side.',
    'So `waveLength` = how many X shapes, `waveHeight` = how many rows, and each X is also `waveHeight` characters wide.',
    'Inside one X, row `r` has a star in column `r` (the `\\` line) and in column `waveHeight - 1 - r` (the `/` line). Everything else is a space.',
    'Outer loop: `r` from `0` to `waveHeight - 1` (one line each).',
    'For the row, first build the X-piece: loop `c` from `0` to `waveHeight - 1` and add `*` or a space to a string.',
    'Then print the same piece `waveLength` times, and `endl` at the end of the row.',
    'Check the middle row of `height=5`: r = 2 gives columns 2 and 2 — one star, `  *  ` — matches `  *    *    *    *`.',
    'Copy the given `main` exactly; it already prints the `length=... & height=...` lines and the blank line after each wave.',
  ],
};

const f23q2: TaskQ = {
  id: 'lab-final-fall23-q2',
  kind: 'task',
  source: `${F23} · Q2`,
  prompt: t(
    '**Magic squares (Loubère\'s algorithm)**',
    '',
    'Write `void magicSquare(const int squareDimension)` that builds and prints a magic square of any **odd** size, and call it **4 times** from `main` with `3, 5, 7, 9`.',
    '',
    'An `n x n` magic square holds the numbers `1 … n²` so that every row, every column and both diagonals have the same sum (15 for `3 x 3`).',
    '',
    '**Loubère\'s algorithm**',
    '1. Place `1` in the **middle of the top row**.',
    '2. Put each next number one row **up** and one column **right**.',
    '   a) If that leaves the square, wrap around to the opposite end of the row or column.',
    '   b) If that cell is already filled, put the number **directly below** the current number instead.',
    '',
    'Print `dimension = n` and then the square, one row per line, e.g.',
    '`dimension = 3\n   8   1   6\n   3   5   7\n   4   9   2`',
    'and for 5: `17 24 1 8 15 / 23 5 7 14 16 / 4 6 13 20 22 / 10 12 19 21 3 / 11 18 25 2 9`.',
  ),
  solution: cpp`
#include <iostream>
#include <iomanip>
using namespace std;

void magicSquare(const int squareDimension) {
    const int n = squareDimension;
    int square[9][9];                      // big enough for n <= 9
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            square[i][j] = 0;              // 0 = empty

    int row = 0, col = n / 2;              // 1 goes in the middle of the top row
    for (int num = 1; num <= n * n; num++) {
        square[row][col] = num;
        int nextRow = (row - 1 + n) % n;   // one up (wrap around)
        int nextCol = (col + 1) % n;       // one right (wrap around)
        if (square[nextRow][nextCol] != 0) {
            nextRow = (row + 1) % n;       // taken: go directly below
            nextCol = col;
        }
        row = nextRow;
        col = nextCol;
    }

    cout << "dimension = " << n << endl;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            cout << setw(4) << square[i][j];
        cout << endl;
    }
    cout << endl;
}

int main() {
    magicSquare(3);
    magicSquare(5);
    magicSquare(7);
    magicSquare(9);
    return 0;
}
`,
  tests: [{ label: 'no input — squares of size 3, 5, 7, 9' }],
  compare: 'numbers',
  steps: [
    'Understand the algorithm on paper with the `3 x 3` example first: 1 top-middle, 2 wraps to the bottom row, 3 wraps to the first column, 4 goes below 3 because the cell is taken…',
    'Plan the data: a 2D array big enough for the largest case (`int square[9][9]`), filled with `0` = "empty" before you start.',
    'Start position: `row = 0`, `col = n / 2`.',
    'Loop `num` from `1` to `n * n`: put `num` in `square[row][col]`.',
    'Next cell "up and right" with wrap-around: `(row - 1 + n) % n` and `(col + 1) % n`. The `+ n` stops `row - 1` from becoming `-1`.',
    'If that cell is not `0`, use the cell directly below the current one instead: `(row + 1) % n`, same column.',
    'Print `dimension = n` and the rows. `setw(4)` from `<iomanip>` lines the columns up.',
    '`main` just calls `magicSquare(3)`, `(5)`, `(7)`, `(9)`. Check: every row of the 3 x 3 square must add to 15.',
  ],
};

const f23q3: TaskQ = {
  id: 'lab-final-fall23-q3',
  kind: 'task',
  source: `${F23} · Q3`,
  tag: 'real life',
  prompt: t(
    '**User registration and login**',
    '',
    '*Adapted for DryRun:* the paper saves each user in a text file (`ammar.txt`). File handling is not available here, so keep the users in an **array of structs** (at most 10 users) instead. Every value is one word.',
    '',
    '• `displayMenu()` prints `Press 1 to Register, 2 to Login, 3 to Exit`, reads the choice and returns it. `main` calls it again and again until the user chooses `3`, then prints `Goodbye`.',
    '• `registerUser()` reads **name, email, username, password, age** (in this order). It calls `isPasswordStrong(password)`. If the password is strong it stores the user and prints `Registered <name>`; otherwise it prints `Weak password`.',
    '• `isPasswordStrong(string)` — the password must: have **at least 8 characters**, contain **uppercase and lowercase** letters, at least one **digit**, and at least one **special character** (e.g. `@ # $ %`).',
    '• `loginUser()` reads **name, username, password**. If they match a stored user, print all details in this format:',
    '`name:ammar\nage:24\nemail:ammar.masood@isb.nu.edu.pk\nusername:ammar_user\npassword:Pass@1234`',
    'otherwise print `Login failed`.',
    '',
    'Do not print any input prompts.',
  ),
  solution: cpp`
#include <iostream>
#include <string>
#include <cctype>
using namespace std;

const int MAXU = 10;

struct User {
    string name, email, username, password;
    int age;
};

int displayMenu() {
    cout << "Press 1 to Register, 2 to Login, 3 to Exit" << endl;
    int choice;
    cin >> choice;
    return choice;
}

bool isPasswordStrong(string p) {
    bool upper = false, lower = false, digit = false, special = false;
    for (int i = 0; i < p.length(); i++) {
        if (isupper(p[i])) upper = true;
        else if (islower(p[i])) lower = true;
        else if (isdigit(p[i])) digit = true;
        else special = true;                 // not a letter and not a digit
    }
    return p.length() >= 8 && upper && lower && digit && special;
}

void registerUser(User users[], int &count) {
    User u;
    cin >> u.name >> u.email >> u.username >> u.password >> u.age;
    if (!isPasswordStrong(u.password)) {
        cout << "Weak password" << endl;
        return;
    }
    users[count] = u;
    count++;
    cout << "Registered " << u.name << endl;
}

void loginUser(User users[], int count) {
    string name, username, password;
    cin >> name >> username >> password;
    for (int i = 0; i < count; i++) {
        if (users[i].name == name && users[i].username == username && users[i].password == password) {
            cout << "name:" << users[i].name << endl;
            cout << "age:" << users[i].age << endl;
            cout << "email:" << users[i].email << endl;
            cout << "username:" << users[i].username << endl;
            cout << "password:" << users[i].password << endl;
            return;
        }
    }
    cout << "Login failed" << endl;
}

int main() {
    User users[MAXU];
    int count = 0;
    while (true) {
        int choice = displayMenu();
        if (choice == 1) registerUser(users, count);
        else if (choice == 2) loginUser(users, count);
        else if (choice == 3) break;
    }
    cout << "Goodbye" << endl;
    return 0;
}
`,
  tests: [
    {
      input: '1\nammar ammar.masood@isb.nu.edu.pk ammar_user Pass@1234 24\n2\nammar ammar_user Pass@1234\n3\n',
      label: 'register, then log in',
    },
    { input: '1\nammar a@b.pk ammar_user 12am34 24\n2\nammar ammar_user 12am34\n3\n', label: 'weak password (the paper\'s own 12am34)' },
    {
      input: '1\nsara sara@nu.pk sara01 Sara#2024 19\n1\nali ali@nu.pk ali_k Lahore$99 20\n2\nali ali_k Lahore$98\n2\nali ali_k Lahore$99\n3\n',
      label: 'two users, one wrong password',
    },
  ],
  compare: 'lines',
  steps: [
    'Understand: it is a menu program — a loop that shows the menu, reads a choice, does the job, and repeats until `3`.',
    'Plan the data: a `struct User` with `name`, `email`, `username`, `password` (strings) and `age` (int); an array `User users[10]` and `int count = 0` in `main`.',
    '`displayMenu()` prints the one menu line, reads the choice and returns it. In `main`: `while (true)` with `if / else if` on the choice; `3` → `break`, then print `Goodbye`.',
    '`isPasswordStrong`: four `bool` flags that start `false`. Loop over the characters: `isupper`, `islower`, `isdigit` from `<cctype>`; anything else is special. Return true only if the length is `>= 8` **and** all four flags are true.',
    '`registerUser(users, count)`: read the five values into a local `User u` in the given order. If the password is weak print `Weak password` and return. Otherwise `users[count] = u; count++;`. Pass `count` **by reference** so `main` sees the new count.',
    '`loginUser(users, count)`: read name, username, password, and loop over the stored users comparing all three with `==`.',
    'On a match print the five `key:value` lines (no spaces around `:`) and `return` straight away; after the loop print `Login failed`.',
  ],
};

const f23q4: TaskQ = {
  id: 'lab-final-fall23-q4',
  kind: 'task',
  source: `${F23} · Q4`,
  prompt: t(
    '**Find and replace**',
    '',
    'Write `void replaceSubstring(string sentence, string find, string replace)` that replaces **every** `find` substring in `sentence` with `replace`, creates the new string and displays it as `New String: …`.',
    '',
    '*Adapted:* the paper calls the function with hard-coded strings; here `main` reads the three strings with `getline` (sentence, find, replace — one per line) so that we can test many cases.',
    '',
    'Example:',
    'String: `I am Pakistani so I support the Pakistani Cricket team in Pak-India matches.`',
    'Find: `Pak` Replace: `Afghan`',
    '`New String: I am Afghanistani so I support the Afghanistani Cricket team in Afghan-India matches.`',
    '',
    'If `find` does not occur (e.g. `Pakii`), the new string is the same as the old one.',
  ),
  solution: cpp`
#include <iostream>
#include <string>
using namespace std;

void replaceSubstring(string sentence, string find, string replace) {
    string result = "";
    int n = sentence.length(), m = find.length();
    int i = 0;
    while (i < n) {
        // does find start at position i?
        if (i + m <= n && sentence.substr(i, m) == find) {
            result += replace;
            i += m;                  // jump over the matched part
        } else {
            result += sentence[i];   // copy one character
            i++;
        }
    }
    cout << "New String: " << result << endl;
}

int main() {
    string sentence, find, replace;
    getline(cin, sentence);
    getline(cin, find);
    getline(cin, replace);
    replaceSubstring(sentence, find, replace);
    return 0;
}
`,
  tests: [
    { input: 'I am Pakistani so I support the Pakistani Cricket team in Pak-India matches.\nPak\nAfghan\n', label: 'Pak → Afghan' },
    { input: 'I am Pakistani so I support the Pakistani Cricket team in Pak-India matches.\nPakii\nAfghan\n', label: 'Pakii is not there' },
    { input: 'banana bandana\nan\nAN\n', label: 'several matches in one word' },
  ],
  compare: 'lines',
  steps: [
    'Understand: walk through the sentence from left to right and build a **new** string. At each position either the whole `find` word starts here, or it does not.',
    'Variables: `result = ""`, `i = 0`, and the lengths `n` (sentence) and `m` (find).',
    'Loop `while (i < n)`.',
    'Test for a match with `sentence.substr(i, m) == find` — but only if `i + m <= n`, so the piece does not run past the end.',
    'Match → add `replace` to `result` and jump `i += m` (so the replaced part is not checked again).',
    'No match → add the single character `sentence[i]` and do `i++`.',
    'After the loop print `New String: ` and the result. In `main` read the three lines with `getline(cin, …)`.',
  ],
};

// =====================================================================================
// PF Lab Final (BS-DS) · Fall 2023
// =====================================================================================

const DS23 = 'PF Lab Final (BS-DS) · Fall 2023';

const ds23q1a: TaskQ = {
  id: 'lab-final-ds23-q1a',
  kind: 'task',
  source: `${DS23} · Q1(A)`,
  prompt: t(
    '**One character longer**',
    '',
    'Read a string `s` (a whole line). Copy it into another string `t`. Then append one character to `t` so that it is exactly **one character longer** than `s`, and print `t`. Use **ASCII values** to make the new character.',
    '',
    '*Adapted:* the paper adds a *random* character, but random numbers are not available here. So the new character is the one whose ASCII value is **one more than the last character** of `s` (for an empty line, add `a`).',
    '',
    'Example: input `abcd` → output `abcde` (`e` is the newly added character).',
  ),
  solution: cpp`
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    getline(cin, s);
    string t = s;                                  // copy
    if (s.length() == 0) t += 'a';
    else t += char(s[s.length() - 1] + 1);         // next ASCII value
    cout << t << endl;
    return 0;
}
`,
  tests: [
    { input: 'abcd\n', label: 'abcd' },
    { input: 'hello\n', label: 'hello' },
    { input: 'Zz9\n', label: 'ends with a digit' },
  ],
  compare: 'lines',
  steps: [
    'Read the whole line with `getline(cin, s);`.',
    'Copying a `string` is just `string t = s;` — it makes a separate copy.',
    'The last character is `s[s.length() - 1]` (or `s.back()`).',
    'Its ASCII value + 1 is the next character: `char(last + 1)` turns the number back into a `char`.',
    'Append it with `t += …` (or `t.push_back(…)`). Think about the empty line: there is no last character, so add `a`.',
    'Print `t`. Its length is now `s.length() + 1`.',
  ],
};

const ds23q1b: TaskQ = {
  id: 'lab-final-ds23-q1b',
  kind: 'task',
  source: `${DS23} · Q1(B)`,
  prompt: t(
    '**Longest substring without repeating characters**',
    '',
    'Read a string (a whole line) and print the length of the **longest substring** (a piece of neighbouring characters) in which **no character repeats**.',
    '',
    'Example 1: `abcabcbb` → `3` (the substring `abc`).',
    'Example 2: `" "` (one space) → `1`.',
  ),
  solution: cpp`
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    getline(cin, s);
    int n = s.length();
    int best = 0;
    for (int i = 0; i < n; i++) {                // the substring starts at i
        int j = i;
        while (j < n) {                          // try to add s[j]
            bool repeat = false;
            for (int k = i; k < j; k++)
                if (s[k] == s[j]) repeat = true;
            if (repeat) break;
            j++;
        }
        if (j - i > best) best = j - i;          // s[i .. j-1] has no repeats
    }
    cout << best << endl;
    return 0;
}
`,
  tests: [
    { input: 'abcabcbb\n', label: 'abcabcbb' },
    { input: ' \n', label: 'one space' },
    { input: 'bbbbb\n', label: 'bbbbb' },
    { input: 'pwwkew\n', label: 'pwwkew' },
  ],
  compare: 'numbers',
  steps: [
    'Understand with `abcabcbb`: starting at index 0 you can grow `a`, `ab`, `abc`, but the next `a` is a repeat. So from index 0 the best length is 3.',
    'Plan: try **every start** `i`. From each start, grow the piece to the right until a character repeats. Keep the largest length in `best`.',
    'Read with `getline(cin, s)` — a plain `cin >> s` would lose a line that is only a space.',
    'For a start `i`, use `j` for the next character to add. Check if `s[j]` already appears in `s[i] … s[j-1]` with a small loop.',
    'If it repeats, `break`; otherwise `j++`.',
    'The good piece is `s[i] … s[j-1]`, its length is `j - i`. Update `best`.',
    'Print `best`. Check: `pwwkew` → `wke` → 3; `bbbbb` → 1.',
  ],
};

const ds23q2a: TaskQ = {
  id: 'lab-final-ds23-q2a',
  kind: 'task',
  source: `${DS23} · Q2(A)`,
  prompt: t(
    '**Zig-zag sequence of a 3 x 3 matrix**',
    '',
    'Read a `3 x 3` matrix and print its elements as one sequence that starts at the **top-left** corner and ends at the **bottom-right** corner, walking the diagonals in a zig-zag:',
    '',
    '`1 2 3\n4 5 6\n7 8 9`  →  `1 2 4 7 5 3 6 8 9`',
    '',
    'The paper prints the sequence without spaces (`124753689`); here print the numbers **separated by spaces**, so that numbers with more than one digit are clear.',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

int main() {
    const int N = 3;
    int m[N][N];
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            cin >> m[i][j];

    // diagonal d holds the cells with i + j == d
    for (int d = 0; d <= 2 * (N - 1); d++) {
        if (d % 2 == 1) {
            // odd diagonal: go down-left (row grows)
            for (int i = 0; i < N; i++)
                if (d - i >= 0 && d - i < N) cout << m[i][d - i] << " ";
        } else {
            // even diagonal: go up-right (row shrinks)
            for (int i = N - 1; i >= 0; i--)
                if (d - i >= 0 && d - i < N) cout << m[i][d - i] << " ";
        }
    }
    cout << endl;
    return 0;
}
`,
  tests: [
    { input: '1 2 3\n4 5 6\n7 8 9\n', label: 'the paper matrix' },
    { input: '10 20 30\n40 50 60\n70 80 90\n', label: 'two-digit values' },
    { input: '9 -1 4\n0 3 7\n5 2 8\n', label: 'mixed values' },
  ],
  compare: 'numbers',
  steps: [
    'Understand: write the row+column of each number in the answer: 1(0,0) · 2(0,1) 4(1,0) · 7(2,0) 5(1,1) 3(0,2) · 6(1,2) 8(2,1) · 9(2,2). Each group has the same `i + j`: it is one **diagonal**.',
    'So loop over the diagonal number `d = i + j` from `0` to `4` (`2 * (N - 1)`).',
    'Direction: on odd diagonals the row goes **up** (0, 1, 2 …); on even diagonals it goes **down** (2, 1, 0 …). Look at 2 → 4 (row grows) and 7 → 5 → 3 (row shrinks).',
    'For a row `i` on diagonal `d`, the column is `j = d - i`. Only print it if `0 <= j < N`.',
    'Read the matrix with two nested loops first, then do the diagonal loops.',
    'Print each value followed by a space.',
  ],
};

const ds23q2b: TaskQ = {
  id: 'lab-final-ds23-q2b',
  kind: 'task',
  source: `${DS23} · Q2(B)`,
  prompt: t(
    '**Toeplitz matrix**',
    '',
    'A **Toeplitz** matrix is *diagonal-constant*: every diagonal from top-left to bottom-right has the same value all the way.',
    '',
    'Read the number of rows and columns (at most `10` each) and the matrix. Write a function that returns `true` or `false`, and print `Matrix is a Toeplitz` or `Matrix is not a Toeplitz`.',
    '',
    '`1 2 3 4\n5 1 2 3\n9 5 1 2`  →  `Matrix is a Toeplitz`',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

const int MAX = 10;

bool isToeplitz(int m[][MAX], int rows, int cols) {
    // every cell must equal the cell up-left of it
    for (int i = 1; i < rows; i++)
        for (int j = 1; j < cols; j++)
            if (m[i][j] != m[i - 1][j - 1]) return false;
    return true;
}

int main() {
    int m[MAX][MAX], rows, cols;
    cin >> rows >> cols;
    for (int i = 0; i < rows; i++)
        for (int j = 0; j < cols; j++)
            cin >> m[i][j];
    if (isToeplitz(m, rows, cols)) cout << "Matrix is a Toeplitz" << endl;
    else cout << "Matrix is not a Toeplitz" << endl;
    return 0;
}
`,
  tests: [
    { input: '3 4\n1 2 3 4\n5 1 2 3\n9 5 1 2\n', label: 'the paper example' },
    { input: '2 2\n1 2\n2 2\n', label: 'a 2 x 2 that fails' },
    { input: '3 3\n7 8 9\n6 7 8\n5 6 0\n', label: 'fails only in the last cell' },
    { input: '1 4\n4 3 2 1\n', label: 'one row' },
  ],
  compare: 'lines',
  steps: [
    'Understand: "same value along every diagonal" means each cell is equal to its neighbour **up and to the left**: `m[i][j] == m[i-1][j-1]`.',
    'Cells in the first row or first column have no up-left neighbour, so start both loops at `1`.',
    'Read `rows` and `cols`, then the matrix with nested loops into `int m[10][10]`.',
    'Write `bool isToeplitz(int m[][MAX], int rows, int cols)`. When a 2D array is a parameter, the column size must be written.',
    'As soon as one pair is different, `return false`. Only after both loops finish, `return true`.',
    'In `main` print the right sentence using the function result.',
  ],
};

const ds23q3a: TaskQ = {
  id: 'lab-final-ds23-q3a',
  kind: 'task',
  source: `${DS23} · Q3(A)`,
  prompt: t(
    '**Swap without a third variable**',
    '',
    'Read two integers. Write a function named `swap` that takes two **pointers** and swaps the numbers **without using a third variable**. After swapping, display the updated numbers in `main`:',
    '`a = 7, b = 5`',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

void swap(int *a, int *b) {
    *a = *a + *b;     // a now holds the total
    *b = *a - *b;     // total - old b = old a
    *a = *a - *b;     // total - old a = old b
}

int main() {
    int a, b;
    cin >> a >> b;
    swap(&a, &b);
    cout << "a = " << a << ", b = " << b << endl;
    return 0;
}
`,
  tests: [
    { input: '5 7\n', label: '5 and 7' },
    { input: '-3 10\n', label: 'a negative number' },
    { input: '4 4\n', label: 'equal numbers' },
  ],
  compare: 'numbers',
  steps: [
    'Understand the trick with `a = 5, b = 7`: first store the total in `a` (12). Then `b = 12 - 7 = 5` (old a). Then `a = 12 - 5 = 7` (old b).',
    'The function gets **addresses**: `void swap(int *a, int *b)`. Inside, `*a` means "the box a points to".',
    'Write the three lines with `*a` and `*b`: `*a = *a + *b;` then `*b = *a - *b;` then `*a = *a - *b;`.',
    'Call it with the addresses: `swap(&a, &b);` — without `&` the types do not match.',
    'Print both numbers in `main` after the call; the variables in `main` really changed.',
  ],
};

const ds23q3b: TaskQ = {
  id: 'lab-final-ds23-q3b',
  kind: 'task',
  source: `${DS23} · Q3(B)`,
  prompt: t(
    '**Encrypt and decrypt an array**',
    '',
    'Write `void Encrypt(int *arr, int size)` and `void Decrypt(int *arr, int size)`. Encryption multiplies every element by `8`; decryption divides it by `8` again. **Use pointers and functions.**',
    '',
    'Read `size` (at most `20`) and the elements, then print the encrypted array and the decrypted array:',
    '`10 20 30 40 50` → `Encrypted: 80 160 240 320 400` → `Decrypted: 10 20 30 40 50`',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

void Encrypt(int *arr, int size) {
    for (int i = 0; i < size; i++) *(arr + i) = *(arr + i) * 8;
}

void Decrypt(int *arr, int size) {
    for (int i = 0; i < size; i++) *(arr + i) = *(arr + i) / 8;
}

void print(int *arr, int size) {
    for (int i = 0; i < size; i++) cout << *(arr + i) << " ";
    cout << endl;
}

int main() {
    int arr[20], size;
    cin >> size;
    for (int i = 0; i < size; i++) cin >> arr[i];

    Encrypt(arr, size);
    cout << "Encrypted: ";
    print(arr, size);

    Decrypt(arr, size);
    cout << "Decrypted: ";
    print(arr, size);
    return 0;
}
`,
  tests: [
    { input: '5\n10 20 30 40 50\n', label: 'the paper array' },
    { input: '3\n1 -2 7\n', label: 'with a negative number' },
    { input: '1\n0\n', label: 'one element' },
  ],
  compare: 'numbers',
  steps: [
    'Understand: both functions change the array *in place* — the caller\'s array itself, not a copy.',
    'An array name is already the address of its first element, so `Encrypt(arr, size)` passes a pointer.',
    'Inside, reach element `i` with pointer arithmetic: `*(arr + i)` (same as `arr[i]`).',
    '`Encrypt`: loop over all elements and multiply each one by 8. `Decrypt`: divide each one by 8.',
    'A small `print(arr, size)` function avoids writing the output loop twice.',
    'In `main`: read the data, encrypt, print, decrypt, print.',
  ],
};

// =====================================================================================
// PF Lab Sessional I · Fall 2023 (two papers)
// =====================================================================================

const S1A = 'PF Lab Sessional I · Fall 2023 (paper A)';
const S1B = 'PF Lab Sessional I · Fall 2023 (paper B)';

const s1aq1: TaskQ = {
  id: 'lab-sess1-fall23a-q1',
  kind: 'task',
  source: `${S1A} · Q1`,
  prompt: t(
    '**Star cross with a # line**',
    '',
    'Read the number of rows (an **odd** number, `3, 5, 7, 9, 11 …`; no validation needed) and draw this pattern with loops:',
    '',
    'Rows = 5:',
    '`* # *\n *#*\n##0##\n *#*\n* # *`',
    '',
    'Rows = 9:',
    '`*   #   *\n *  #  *\n  * # *\n   *#*\n####0####\n   *#*\n  * # *\n *  #  *\n*   #   *`',
    '',
    '*Bonus in the exam: solve it with a single loop.*',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int mid = n / 2;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i == mid) {                          // the middle line
                if (j == mid) cout << '0';
                else cout << '#';
            } else if (j == i || j == n - 1 - i) {   // the two diagonals
                cout << '*';
            } else if (j == mid) {                   // the middle column
                cout << '#';
            } else {
                cout << ' ';
            }
        }
        cout << endl;
    }
    return 0;
}
`,
  tests: [
    { input: '5\n', label: 'rows = 5' },
    { input: '9\n', label: 'rows = 9' },
    { input: '3\n', label: 'rows = 3' },
  ],
  compare: 'exact',
  steps: [
    'Understand: the picture is an `n x n` square. Number rows `i` and columns `j` from `0`. The middle is `mid = n / 2`.',
    'Two nested loops: `i` over the rows, `j` over the columns; `endl` after each row.',
    'Find a rule for every kind of cell. Middle row (`i == mid`): all `#`, except `0` in the middle column.',
    'The stars make an X: `j == i` (the `\\` diagonal) or `j == n - 1 - i` (the `/` diagonal).',
    'The middle column (`j == mid`) is `#` in every other row.',
    'All other cells are spaces. Order your `if / else if` so the middle row is checked first.',
    'Test with rows = 5: row 1 → columns 1, 2, 3 are `*`, `#`, `*` → ` *#*`. Correct!',
  ],
};

const s1aq2: TaskQ = {
  id: 'lab-sess1-fall23a-q2',
  kind: 'task',
  source: `${S1A} · Q2`,
  prompt: t(
    '**Digit staircase**',
    '',
    'Read the number of rows (`3`, `4` or `5`, but your program must be generic) and print the pattern with loops — you cannot just print it with one `cout`. Look carefully, there is a hint in the numbers:',
    '',
    'rows = 5: `14321\n23321\n34521\n45671\n56789`',
    'rows = 4: `1321\n2321\n3451\n4567`',
    'rows = 3: `121\n231\n345`',
    '',
    '*Bonus in the exam: solve it with a single loop.*',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        // first part: i numbers counting up from i
        for (int k = 0; k < i; k++) cout << i + k;
        // second part: count down from n - i to 1
        for (int k = n - i; k >= 1; k--) cout << k;
        cout << endl;
    }
    return 0;
}
`,
  tests: [
    { input: '5\n', label: 'rows = 5' },
    { input: '4\n', label: 'rows = 4' },
    { input: '3\n', label: 'rows = 3' },
  ],
  compare: 'exact',
  steps: [
    'Understand: split every row of rows = 5 into two parts: `1|4321`, `23|321`, `345|21`, `4567|1`, `56789|`.',
    'Part 1 of row `i` (counting rows from 1): `i` numbers counting **up** from `i` — row 3 gives `3 4 5`.',
    'Part 2 of row `i`: counts **down** from `n - i` to `1` — row 3 of 5 gives `2 1`. The last row has no part 2.',
    'Outer loop `i` from `1` to `n`.',
    'First inner loop: `k` from `0` to `i - 1`, print `i + k`.',
    'Second inner loop: `k` from `n - i` down to `1`, print `k`. Then `endl`.',
    'Print the digits with no spaces between them.',
  ],
};

const s1bq1: TaskQ = {
  id: 'lab-sess1-fall23b-q1',
  kind: 'task',
  source: `${S1B} · Q1`,
  prompt: t(
    '**The kite**',
    '',
    'Read the number of rows (an **even** number, `4, 6, 8, 10 …`; no validation needed) and draw this pattern with loops. The kite is `rows - 1` characters wide.',
    '',
    'Rows = 6:',
    '`*****\n /|\\\n/ | \\\n\\ | /\n \\|/\n*****`',
    '',
    'Rows = 10:',
    '`*********\n   /|\\\n  / | \\\n /  |  \\\n/   |   \\\n\\   |   /\n \\  |  /\n  \\ | /\n   \\|/\n*********`',
    '',
    '*Bonus in the exam: solve it with a single loop.*',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int width = n - 1;
    int mid = width / 2;
    int half = (n - 2) / 2;              // rows in each half of the kite

    for (int j = 0; j < width; j++) cout << '*';
    cout << endl;
    // top half: / moves left, \ moves right
    for (int k = 0; k < half; k++) {
        for (int j = 0; j <= mid + 1 + k; j++) {
            if (j == mid - 1 - k) cout << '/';
            else if (j == mid) cout << '|';
            else if (j == mid + 1 + k) cout << '\\';
            else cout << ' ';
        }
        cout << endl;
    }
    // bottom half: \ moves right, / moves left
    for (int k = 0; k < half; k++) {
        for (int j = 0; j <= width - 1 - k; j++) {
            if (j == k) cout << '\\';
            else if (j == mid) cout << '|';
            else if (j == width - 1 - k) cout << '/';
            else cout << ' ';
        }
        cout << endl;
    }
    for (int j = 0; j < width; j++) cout << '*';
    cout << endl;
    return 0;
}
`,
  tests: [
    { input: '6\n', label: 'rows = 6' },
    { input: '10\n', label: 'rows = 10' },
    { input: '4\n', label: 'rows = 4' },
  ],
  compare: 'exact',
  steps: [
    'Understand the size: rows = 6 gives a width of 5 = `n - 1`; the `|` stands in the middle column `mid = (n - 1) / 2`.',
    'The first and last rows are `n - 1` stars. Between them there are `n - 2` rows: a top half and a bottom half of `(n - 2) / 2` rows each.',
    'Top half, row `k` (from 0): `/` at column `mid - 1 - k`, `|` at `mid`, `\\` at `mid + 1 + k`. The `/` and `\\` move apart.',
    'Bottom half, row `k`: `\\` at column `k`, `|` at `mid`, `/` at `width - 1 - k`. They move together.',
    'Inside each row loop over the columns and print the right symbol or a space. You can stop the column loop at the last symbol so there are no spaces at the end.',
    'A backslash in C++ must be written `\'\\\\\'` inside quotes — one `\\` alone starts an escape sequence.',
    'Check rows = 4: `***`, `/|\\`, `\\|/`, `***`.',
  ],
};

const s1bq2: TaskQ = {
  id: 'lab-sess1-fall23b-q2',
  kind: 'task',
  source: `${S1B} · Q2`,
  prompt: t(
    '**Counting from zero, pushed right**',
    '',
    'Read the number of rows (`3`, `4` or `5`, but your program must be generic) and print the pattern with loops — you cannot just print it with one `cout`. Look carefully, there is a hint:',
    '',
    'rows = 5: `01234\n50123\n54012\n54301\n54320`',
    'rows = 4: `0123\n4012\n4301\n4320`',
    'rows = 3: `012\n301\n320`',
    '',
    '*Bonus in the exam: solve it with a single loop.*',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        // first part: i numbers counting down from n
        for (int k = 0; k < i; k++) cout << n - k;
        // second part: count up from 0
        for (int k = 0; k < n - i; k++) cout << k;
        cout << endl;
    }
    return 0;
}
`,
  tests: [
    { input: '5\n', label: 'rows = 5' },
    { input: '4\n', label: 'rows = 4' },
    { input: '3\n', label: 'rows = 3' },
  ],
  compare: 'exact',
  steps: [
    'Understand: split each row of rows = 5 into two parts: `|01234`, `5|0123`, `54|012`, `543|01`, `5432|0`.',
    'Number the rows `i = 0 … n - 1`. Part 1 has `i` numbers counting **down** from `n`.',
    'Part 2 has the other `n - i` numbers, counting **up** from `0`.',
    'Outer loop `i` from `0` to `n - 1`.',
    'First inner loop: `k` from `0` to `i - 1`, print `n - k`.',
    'Second inner loop: `k` from `0` to `n - i - 1`, print `k`. Then `endl`.',
    'Print digits with no spaces between them.',
  ],
};

// =====================================================================================
// Object Oriented Programming (OOP) Tasks
// =====================================================================================

const OOP = 'Object Oriented Programming';

const oop1: TaskQ = {
  id: 'oop-task-matrix-transpose',
  kind: 'task',
  track: 'oop',
  source: `${OOP} · Lab 2`,
  prompt: t(
    '**Matrix Transposition**',
    '',
    'Model a 2D matrix. Write a program that reads the dimensions `rows` and `cols` of a matrix, followed by its elements.',
    'Store the matrix in a `Matrix` structure.',
    'Implement a function `void printTranspose(Matrix m)` that outputs the transposed matrix (`cols` rows and `rows` columns), with elements separated by spaces and each row on a new line.',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

struct Matrix {
    int rows;
    int cols;
    int data[10][10];
};

void printTranspose(Matrix m) {
    cout << "Transposed:" << endl;
    for (int j = 0; j < m.cols; j++) {
        for (int i = 0; i < m.rows; i++) {
            cout << m.data[i][j] << (i + 1 == m.rows ? "" : " ");
        }
        cout << endl;
    }
}

int main() {
    Matrix m;
    cin >> m.rows >> m.cols;
    for (int i = 0; i < m.rows; i++) {
        for (int j = 0; j < m.cols; j++) {
            cin >> m.data[i][j];
        }
    }
    printTranspose(m);
    return 0;
}
`,
  tests: [
    { input: '2 3\n1 2 3\n4 5 6\n', label: '2x3 Matrix' },
    { input: '3 3\n1 0 0\n0 1 0\n0 0 1\n', label: '3x3 Identity Matrix' },
    { input: '1 4\n5 10 15 20\n', label: '1x4 Row Matrix' },
  ],
  compare: 'exact',
  steps: [
    'Define `struct Matrix { int rows, cols; int data[10][10]; };`.',
    'In `main`, read `m.rows` and `m.cols`.',
    'Use nested loops `for (int i = 0; i < m.rows; i++)` and `for (int j = 0; j < m.cols; j++)` to read elements into `m.data[i][j]`.',
    'In `printTranspose`, print `"Transposed:"` on its own line.',
    'Loop column-first: outer loop `for (int j = 0; j < m.cols; j++)`, inner loop `for (int i = 0; i < m.rows; i++)`.',
    'Print `m.data[i][j]` followed by a space (or newline at the end of each row).',
  ],
  hints: [
    'Transposing a matrix means swapping row and column indices: cell (i, j) moves to (j, i).',
    'The outer loop of the transpose should iterate over columns `0` to `cols - 1`.',
  ],
};

const oop2: TaskQ = {
  id: 'oop-task-block-geometry',
  kind: 'task',
  track: 'oop',
  source: `${OOP} · Lab 3`,
  prompt: t(
    '**Block Geometry: Volume and Surface Area**',
    '',
    'Define a `Block` struct with dimensions `l, w, h` (integers).',
    'Write functions:',
    '- `int volume(Block b)`: returns $l \\times w \\times h$',
    '- `int surfaceArea(Block b)`: returns $2(lw + lh + wh)$',
    '',
    'Read dimensions for two blocks (`l1 w1 h1 l2 w2 h2`).',
    'Print each block\'s volume and surface area, then compare their volumes:',
    '- If block 1 has greater volume: print `Block 1 is larger`',
    '- If block 2 has greater volume: print `Block 2 is larger`',
    '- If equal: print `Both blocks are equal`',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

struct Block {
    int l, w, h;
};

int volume(Block b) {
    return b.l * b.w * b.h;
}

int surfaceArea(Block b) {
    return 2 * (b.l * b.w + b.l * b.h + b.w * b.h);
}

int main() {
    Block b1, b2;
    cin >> b1.l >> b1.w >> b1.h;
    cin >> b2.l >> b2.w >> b2.h;
    int v1 = volume(b1);
    int s1 = surfaceArea(b1);
    int v2 = volume(b2);
    int s2 = surfaceArea(b2);
    cout << "Block 1: Vol = " << v1 << ", SA = " << s1 << endl;
    cout << "Block 2: Vol = " << v2 << ", SA = " << s2 << endl;
    if (v1 > v2) cout << "Block 1 is larger" << endl;
    else if (v2 > v1) cout << "Block 2 is larger" << endl;
    else cout << "Both blocks are equal" << endl;
    return 0;
}
`,
  tests: [
    { input: '3 4 5\n2 5 6\n', label: 'v1 = 60, v2 = 60 (equal)' },
    { input: '5 5 5\n2 3 4\n', label: 'b1 larger' },
    { input: '1 2 3\n4 5 6\n', label: 'b2 larger' },
  ],
  compare: 'exact',
  steps: [
    'Create `struct Block { int l, w, h; };`.',
    'Write `volume`: `return b.l * b.w * b.h;`.',
    'Write `surfaceArea`: `return 2 * (b.l * b.w + b.l * b.h + b.w * b.h);`.',
    'Read `b1` and `b2` from `cin`.',
    'Print `Block 1: Vol = ..., SA = ...`.',
    'Compare `v1` and `v2` with `if / else if / else`.',
  ],
  hints: [
    'Surface area of a rectangular cuboid is $2(lw + lh + wh)$.',
  ],
};

const oop3: TaskQ = {
  id: 'oop-task-complex-numbers',
  kind: 'task',
  track: 'oop',
  source: `${OOP} · Lab 4`,
  prompt: t(
    '**Complex Number Operations**',
    '',
    'Define a `Complex` struct with `real` and `imag` integers.',
    'Write functions:',
    '- `Complex add(Complex c1, Complex c2)`: returns $(c_1.r + c_2.r) + (c_1.i + c_2.i)i$',
    '- `Complex multiply(Complex c1, Complex c2)`: returns $(c_1.r \\cdot c_2.r - c_1.i \\cdot c_2.i) + (c_1.r \\cdot c_2.i + c_1.i \\cdot c_2.r)i$',
    '- `void print(Complex c)`: prints formatted like `4 + 7i` (or `4 - 7i` if imag is negative).',
    '',
    'Input: 4 integers (`r1 i1 r2 i2`).',
    'Print the sum on the first line and the product on the second line.',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

struct Complex {
    int real;
    int imag;
};

Complex add(Complex c1, Complex c2) {
    Complex res;
    res.real = c1.real + c2.real;
    res.imag = c1.imag + c2.imag;
    return res;
}

Complex multiply(Complex c1, Complex c2) {
    Complex res;
    res.real = (c1.real * c2.real) - (c1.imag * c2.imag);
    res.imag = (c1.real * c2.imag) + (c1.imag * c2.real);
    return res;
}

void printComplex(Complex c) {
    if (c.imag >= 0)
        cout << c.real << " + " << c.imag << "i" << endl;
    else
        cout << c.real << " - " << -c.imag << "i" << endl;
}

int main() {
    Complex c1, c2;
    cin >> c1.real >> c1.imag >> c2.real >> c2.imag;
    Complex sum = add(c1, c2);
    Complex prod = multiply(c1, c2);
    cout << "Sum: ";
    printComplex(sum);
    cout << "Product: ";
    printComplex(prod);
    return 0;
}
`,
  tests: [
    { input: '3 2 1 7\n', label: '(3+2i) and (1+7i)' },
    { input: '2 3 4 -1\n', label: '(2+3i) and (4-1i)' },
  ],
  compare: 'exact',
  steps: [
    'Define `Complex` with `real` and `imag` integer fields.',
    'In `add`, add the corresponding real parts and imaginary parts.',
    'In `multiply`, use formula: $(ac - bd) + (ad + bc)i$.',
    'In `printComplex`, check if `c.imag >= 0` to format sign with spaces: `+` or `-`.',
  ],
  hints: [
    'Remember: $i^2 = -1$, which is why the real part of the product is $ac - bd$.',
  ],
};

const oop4: TaskQ = {
  id: 'oop-task-bank-account',
  kind: 'task',
  track: 'oop',
  source: `${OOP} · Lab 5`,
  prompt: t(
    '**Bank Account with Encapsulation & Validation**',
    '',
    'Define an `Account` struct with integer `id` and double `balance`.',
    'Implement operations:',
    '- `void deposit(Account &acc, double amt)`: if `amt > 0`, add to balance; else print `Invalid deposit`.',
    '- `void withdraw(Account &acc, double amt)`: if `amt > 0` and `amt <= acc.balance`, deduct from balance; else print `Insufficient funds`.',
    '',
    'Input: `id`, `initial_balance`, `deposit_amt`, `withdraw_amt`.',
    'Perform the deposit, then the withdrawal, and finally print `Final Balance: ` followed by the balance with 2 decimal places.',
  ),
  solution: cpp`
#include <iostream>
#include <iomanip>
using namespace std;

struct Account {
    int id;
    double balance;
};

void deposit(Account &acc, double amt) {
    if (amt > 0) {
        acc.balance += amt;
    } else {
        cout << "Invalid deposit" << endl;
    }
}

void withdraw(Account &acc, double amt) {
    if (amt > 0 && amt <= acc.balance) {
        acc.balance -= amt;
    } else {
        cout << "Insufficient funds" << endl;
    }
}

int main() {
    Account acc;
    double dep, with;
    cin >> acc.id >> acc.balance >> dep >> with;
    deposit(acc, dep);
    withdraw(acc, with);
    cout << fixed << setprecision(2);
    cout << "Final Balance: " << acc.balance << endl;
    return 0;
}
`,
  tests: [
    { input: '101 500.0 200.0 150.0\n', label: 'Normal operations' },
    { input: '102 100.0 50.0 200.0\n', label: 'Overdraft attempt' },
  ],
  compare: 'exact',
  steps: [
    'Define `struct Account { int id; double balance; };`.',
    'Pass `Account &acc` by reference so changes affect the account in main.',
    'Use `fixed << setprecision(2)` with `#include <iomanip>` for 2 decimals.',
  ],
  hints: [
    'Always validate that the withdrawal amount does not exceed the current balance.',
  ],
};

// =====================================================================================
// Data Structures (DSA) Tasks
// =====================================================================================

const DSA = 'Data Structures';

const dsa1: TaskQ = {
  id: 'dsa-task-linked-list',
  kind: 'task',
  track: 'dsa',
  source: `${DSA} · Lab 3`,
  prompt: t(
    '**Singly Linked List Implementation**',
    '',
    'Implement a Singly Linked List using a `Node` structure (`int data; Node* next;`).',
    'Write functions:',
    '- `void insertTail(Node* &head, int val)`: appends a new node with `val` at the end of the list.',
    '- `void printList(Node* head)`: prints values separated by ` -> `.',
    '',
    'Input: count `N`, followed by `N` integers.',
    'Build the list and print it.',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
};

void insertTail(Node* &head, int val) {
    Node* n = new Node();
    n->data = val;
    n->next = nullptr;
    if (head == nullptr) {
        head = n;
        return;
    }
    Node* cur = head;
    while (cur->next != nullptr)
        cur = cur->next;
    cur->next = n;
}

void printList(Node* head) {
    Node* cur = head;
    while (cur != nullptr) {
        cout << cur->data << (cur->next ? " -> " : "");
        cur = cur->next;
    }
    cout << endl;
}

int main() {
    int n, val;
    cin >> n;
    Node* head = nullptr;
    for (int i = 0; i < n; i++) {
        cin >> val;
        insertTail(head, val);
    }
    printList(head);
    return 0;
}
`,
  tests: [
    { input: '4\n10 20 30 40\n', label: '4 elements' },
    { input: '1\n99\n', label: 'Single element' },
  ],
  compare: 'exact',
  steps: [
    'Define `struct Node { int data; Node* next; };`.',
    'Allocate each new node using `new Node()`. Set `next = nullptr`.',
    'Pass `head` by reference (`Node* &head`) to update the head pointer when list is empty.',
    'Traverse to the last node (`cur->next == nullptr`) to link the new node.',
  ],
  hints: [
    'Remember to check if `head == nullptr` when inserting the first element.',
  ],
};

const dsa2: TaskQ = {
  id: 'dsa-task-reverse-list',
  kind: 'task',
  track: 'dsa',
  source: `${DSA} · Lab 4`,
  prompt: t(
    '**Reverse a Linked List In-Place**',
    '',
    'Write a function `Node* reverseList(Node* head)` that reverses a Singly Linked List in-place using three pointers (`prev, cur, nxt`) without creating any new nodes.',
    'Input: count `N`, followed by `N` integers.',
    'Reverse the list and print the reversed elements on a single line separated by spaces.',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
};

void insertTail(Node* &head, int val) {
    Node* n = new Node();
    n->data = val;
    n->next = nullptr;
    if (head == nullptr) { head = n; return; }
    Node* c = head;
    while (c->next != nullptr) c = c->next;
    c->next = n;
}

Node* reverseList(Node* head) {
    Node* prev = nullptr;
    Node* cur = head;
    while (cur != nullptr) {
        Node* nxt = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nxt;
    }
    return prev;
}

void printList(Node* head) {
    Node* c = head;
    while (c != nullptr) {
        cout << c->data << (c->next ? " " : "");
        c = c->next;
    }
    cout << endl;
}

int main() {
    int n, v;
    cin >> n;
    Node* head = nullptr;
    for (int i = 0; i < n; i++) {
        cin >> v;
        insertTail(head, v);
    }
    head = reverseList(head);
    printList(head);
    return 0;
}
`,
  tests: [
    { input: '4\n1 2 3 4\n', label: '1 2 3 4 -> 4 3 2 1' },
    { input: '5\n10 20 30 40 50\n', label: '5 elements' },
  ],
  compare: 'exact',
  steps: [
    'Initialize `prev = nullptr`, `cur = head`.',
    'In a loop while `cur != nullptr`:',
    '1. Save the next node: `nxt = cur->next`.',
    '2. Reverse pointer: `cur->next = prev`.',
    '3. Advance `prev = cur`, `cur = nxt`.',
    'Return `prev` as the new head of the reversed list.',
  ],
  hints: [
    'Keep three pointers: `prev`, `cur`, and `nxt`. Save `cur->next` before reversing the link!',
  ],
};

const dsa3: TaskQ = {
  id: 'dsa-task-stack-parentheses',
  kind: 'task',
  track: 'dsa',
  source: `${DSA} · Lab 5`,
  prompt: t(
    '**Balanced Parentheses using a Stack**',
    '',
    'Given an expression string consisting of brackets `()`, `{}`, and `[]`, determine if the brackets are balanced.',
    'Use an array-based stack.',
    'Rules:',
    '- Push open brackets `(`, `{`, `[` onto the stack.',
    '- For closing brackets `)`, `}`, `]`, check if the top matches the corresponding open bracket and pop it.',
    '- If empty at the end, output `Balanced`; otherwise `Not Balanced`.',
  ),
  solution: cpp`
#include <iostream>
#include <string>
using namespace std;

bool isMatching(char o, char c) {
    if (o == '(' && c == ')') return true;
    if (o == '{' && c == '}') return true;
    if (o == '[' && c == ']') return true;
    return false;
}

int main() {
    string s;
    cin >> s;
    char st[100];
    int top = -1;
    bool ok = true;
    for (int i = 0; i < s.length(); i++) {
        char ch = s[i];
        if (ch == '(' || ch == '{' || ch == '[') {
            st[++top] = ch;
        } else if (ch == ')' || ch == '}' || ch == ']') {
            if (top == -1 || !isMatching(st[top--], ch)) {
                ok = false;
                break;
            }
        }
    }
    if (top != -1) ok = false;
    if (ok) cout << "Balanced" << endl;
    else cout << "Not Balanced" << endl;
    return 0;
}
`,
  tests: [
    { input: '{[()]}\n', label: 'Balanced nested brackets' },
    { input: '{[(])}\n', label: 'Mismatched order' },
    { input: '(()\n', label: 'Unclosed bracket' },
  ],
  compare: 'exact',
  steps: [
    'Initialize stack array `char st[100]` with `top = -1`.',
    'Iterate over characters of string `s`.',
    'If opening bracket, push: `st[++top] = ch`.',
    'If closing bracket, check `top == -1` or mismatch with `st[top--]`. If mismatched, set `ok = false`.',
    'After loop, check `top == -1` to ensure no unclosed brackets remain.',
  ],
  hints: [
    'A closing bracket must match the most recently opened bracket (LIFO order).',
  ],
};

const dsa4: TaskQ = {
  id: 'dsa-task-queue-operations',
  kind: 'task',
  track: 'dsa',
  source: `${DSA} · Lab 6`,
  prompt: t(
    '**Queue Operations (Enqueue and Dequeue)**',
    '',
    'Implement a Queue of integers using an array.',
    'Input starts with `N` (number of operations).',
    'Each operation is either:',
    '- `1 X`: enqueue value `X`',
    '- `2`: dequeue and print the removed value',
    'If dequeue is called on an empty queue, print `Empty`.',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

struct Queue {
    int arr[100];
    int front;
    int rear;
};

void init(Queue &q) {
    q.front = 0;
    q.rear = 0;
}

void enqueue(Queue &q, int val) {
    q.arr[q.rear++] = val;
}

void dequeue(Queue &q) {
    if (q.front == q.rear) {
        cout << "Empty" << endl;
    } else {
        cout << q.arr[q.front++] << endl;
    }
}

int main() {
    Queue q;
    init(q);
    int n, op, val;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> op;
        if (op == 1) {
            cin >> val;
            enqueue(q, val);
        } else if (op == 2) {
            dequeue(q);
        }
    }
    return 0;
}
`,
  tests: [
    { input: '5\n1 10\n1 20\n2\n1 30\n2\n', label: 'Enqueue and Dequeue' },
    { input: '3\n2\n1 5\n2\n', label: 'Empty check' },
  ],
  compare: 'exact',
  steps: [
    'Define `struct Queue { int arr[100]; int front; int rear; };`.',
    '`enqueue` inserts at `rear++`.',
    '`dequeue` removes from `front++` (or prints `Empty` if `front == rear`).',
  ],
  hints: [
    'Queue is FIFO: First In, First Out.',
  ],
};

// =====================================================================================
// Additional Extracted FAST-NUCES Lab Tasks
// =====================================================================================

const pfExtra1: TaskQ = {
  id: 'pf-task-prime-array',
  kind: 'task',
  track: 'pf',
  source: 'PF Lab 8 · Task 1',
  prompt: t(
    '**Counting Prime Numbers in Dynamic Array**',
    '',
    'Dynamically allocate an integer array of size `N`. Read `N` integers into the array.',
    'Count how many numbers in the array are prime numbers.',
    'Print the total count in the format: `Total Primes: X`.',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

bool isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    int n;
    cin >> n;
    int* arr = new int[n];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    int primes = 0;
    for (int i = 0; i < n; i++) {
        if (isPrime(arr[i])) primes++;
    }
    cout << "Total Primes: " << primes << endl;
    delete[] arr;
    return 0;
}
`,
  tests: [
    { input: '5\n2 3 4 5 6\n', label: 'Primes: 2, 3, 5' },
    { input: '4\n1 4 6 8\n', label: 'No primes' },
  ],
  compare: 'exact',
  steps: [
    'Write helper function `bool isPrime(int n)`. Numbers `<= 1` are not prime.',
    'Allocate dynamic array: `int* arr = new int[n];`.',
    'Loop and count primes, print result, and remember to `delete[] arr;`.',
  ],
  hints: ['Check divisibility up to `i * i <= n`.'],
};

const pfExtra2: TaskQ = {
  id: 'pf-task-matrix-transpose',
  kind: 'task',
  track: 'pf',
  source: 'PF Lab 7 · Task 1',
  prompt: t(
    '**Matrix Transpose**',
    '',
    'Read dimensions `R` and `C` followed by an `R x C` matrix.',
    'Print `Transpose:` on the first line, followed by the transposed matrix (`C x R`) with space-separated values and a new line after each row.',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

int main() {
    int r, c;
    cin >> r >> c;
    int mat[10][10];
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            cin >> mat[i][j];
        }
    }
    cout << "Transpose:" << endl;
    for (int j = 0; j < c; j++) {
        for (int i = 0; i < r; i++) {
            cout << mat[i][j] << " ";
        }
        cout << endl;
    }
    return 0;
}
`,
  tests: [
    { input: '2 3\n1 2 3\n4 5 6\n', label: '2x3 Matrix' },
    { input: '2 2\n9 8\n7 6\n', label: '2x2 Square' },
  ],
  compare: 'exact',
  steps: [
    'Read `r` and `c`, then nested loop `for (int i = 0; i < r; i++)` to read elements.',
    'To print transpose, flip loops: outer loop runs for columns `j`, inner loop runs for rows `i`.',
  ],
  hints: ['In a transpose, element `mat[i][j]` moves to `[j][i]`.'],
};

const pfExtra3: TaskQ = {
  id: 'pf-task-palindrome-check',
  kind: 'task',
  track: 'pf',
  source: 'PF Lab 9 · Task 1',
  prompt: t(
    '**String Palindrome Check**',
    '',
    'Read a single-word string `s`. Determine if the string is a palindrome (reads the same backwards and forwards).',
    'Print `Palindrome: Yes` or `Palindrome: No`.',
  ),
  solution: cpp`
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    bool pal = true;
    int len = s.length();
    for (int i = 0; i < len / 2; i++) {
        if (s[i] != s[len - 1 - i]) {
            pal = false;
            break;
        }
    }
    if (pal) cout << "Palindrome: Yes" << endl;
    else cout << "Palindrome: No" << endl;
    return 0;
}
`,
  tests: [
    { input: 'racecar\n', label: 'Odd-length palindrome' },
    { input: 'noon\n', label: 'Even-length palindrome' },
    { input: 'fast\n', label: 'Not a palindrome' },
  ],
  compare: 'exact',
  steps: [
    'Read string `s` using `cin >> s;`.',
    'Compare character at index `i` with character at index `len - 1 - i` up to `len / 2`.',
  ],
  hints: ['If any mismatch is found, set flag to false and break immediately.'],
};

const oopExtra1: TaskQ = {
  id: 'oop-task-inventory',
  kind: 'task',
  track: 'oop',
  source: 'OOP Lab 6 · Task 1',
  prompt: t(
    '**Inventory Item Encapsulation**',
    '',
    'Represent a warehouse item with `id`, `quantity`, and `price`.',
    'Input consists of three space-separated integers: `id`, `quantity`, and `price`.',
    'Output:',
    '`Item ID: <id>`',
    '`Total Value: <quantity * price>`',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

struct Item {
    int id;
    int qty;
    int price;
};

int totalValue(Item &it) {
    return it.qty * it.price;
}

int main() {
    Item item;
    cin >> item.id >> item.qty >> item.price;
    cout << "Item ID: " << item.id << endl;
    cout << "Total Value: " << totalValue(item) << endl;
    return 0;
}
`,
  tests: [
    { input: '101 5 20\n', label: 'Basic item' },
    { input: '502 12 15\n', label: 'Multiple units' },
  ],
  compare: 'exact',
  steps: [
    'Define `struct Item` with fields `int id; int qty; int price;`.',
    'Write a function `totalValue(Item &it)` that returns `qty * price`.',
    'Read input and print `Item ID:` and `Total Value:`.',
  ],
  hints: ['Pass the item by reference `Item &it` to avoid copying.'],
};

const oopExtra2: TaskQ = {
  id: 'oop-task-gamescore',
  kind: 'task',
  track: 'oop',
  source: 'OOP Lab 8 · Task 1',
  prompt: t(
    '**GameScore Leaderboard**',
    '',
    'Given `N` player records consisting of a player name and integer score.',
    'Find and print the player with the highest score in the format:',
    '`Champion: <name> with <highScore>`',
  ),
  solution: cpp`
#include <iostream>
#include <string>
using namespace std;

struct GameScore {
    string name;
    int score;
};

int main() {
    int n;
    cin >> n;
    GameScore players[10];
    int maxScore = -1;
    string champ = "";
    for (int i = 0; i < n; i++) {
        cin >> players[i].name >> players[i].score;
        if (players[i].score > maxScore) {
            maxScore = players[i].score;
            champ = players[i].name;
        }
    }
    cout << "Champion: " << champ << " with " << maxScore << endl;
    return 0;
}
`,
  tests: [
    { input: '3\nAli 150\nSara 280\nBilal 210\n', label: 'Find top scorer' },
    { input: '2\nZayd 50\nHamza 95\n', label: 'Two players' },
  ],
  compare: 'exact',
  steps: [
    'Store player records in an array of `GameScore`.',
    'Track `maxScore` and `champ` as each record is entered.',
  ],
  hints: ['Compare each player score with `maxScore`.'],
};

const oopExtra3: TaskQ = {
  id: 'oop-task-matrix-ops',
  kind: 'task',
  track: 'oop',
  source: 'OOP Practice Sessional · Question 1',
  prompt: t(
    '**Matrix Addition with Struct**',
    '',
    'Represent a 2D Matrix with `rows`, `cols`, and a 2D array.',
    'Given dimensions `R` and `C` and elements of two `R x C` matrices `M1` and `M2`.',
    'Compute and print their element-wise sum matrix.',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

struct Matrix {
    int rows;
    int cols;
    int data[10][10];
};

void addMatrices(Matrix &a, Matrix &b, Matrix &res) {
    res.rows = a.rows;
    res.cols = a.cols;
    for (int i = 0; i < a.rows; i++) {
        for (int j = 0; j < a.cols; j++) {
            res.data[i][j] = a.data[i][j] + b.data[i][j];
        }
    }
}

int main() {
    Matrix m1, m2, sum;
    int r, c;
    cin >> r >> c;
    m1.rows = r; m1.cols = c;
    m2.rows = r; m2.cols = c;
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) cin >> m1.data[i][j];
    }
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) cin >> m2.data[i][j];
    }
    addMatrices(m1, m2, sum);
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            cout << sum.data[i][j] << " ";
        }
        cout << endl;
    }
    return 0;
}
`,
  tests: [
    { input: '2 2\n1 2\n3 4\n5 6\n7 8\n', label: '2x2 Matrix addition' },
    { input: '1 3\n10 20 30\n5 5 5\n', label: '1x3 Row vector addition' },
  ],
  compare: 'exact',
  steps: [
    'Define `struct Matrix { int rows; int cols; int data[10][10]; };`.',
    'Write `addMatrices` to add corresponding cells `a.data[i][j] + b.data[i][j]`.',
  ],
  hints: ['Pass both input matrices and output matrix by reference.'],
};

const dsaExtra1: TaskQ = {
  id: 'dsa-task-doubly-linked-list',
  kind: 'task',
  track: 'dsa',
  source: 'DSA Lab 4 · Task 1',
  prompt: t(
    '**Doubly Linked List (Bidirectional Traversal)**',
    '',
    'Implement a Doubly Linked List with `Node* next` and `Node* prev`.',
    'Given `N` integers, insert each at the end of the list.',
    'Print the list elements in forward order: `Forward: x y z `',
    'Print the list elements in backward order: `Backward: z y x `',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node* prev;
};

void insertEnd(Node* &head, Node* &tail, int val) {
    Node* n = new Node();
    n->data = val;
    n->next = nullptr;
    n->prev = tail;
    if (tail != nullptr) {
        tail->next = n;
    }
    tail = n;
    if (head == nullptr) {
        head = n;
    }
}

void printForward(Node* head) {
    Node* cur = head;
    while (cur != nullptr) {
        cout << cur->data << " ";
        cur = cur->next;
    }
    cout << endl;
}

void printBackward(Node* tail) {
    Node* cur = tail;
    while (cur != nullptr) {
        cout << cur->data << " ";
        cur = cur->prev;
    }
    cout << endl;
}

int main() {
    Node* head = nullptr;
    Node* tail = nullptr;
    int n, val;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> val;
        insertEnd(head, tail, val);
    }
    cout << "Forward: ";
    printForward(head);
    cout << "Backward: ";
    printBackward(tail);
    return 0;
}
`,
  tests: [
    { input: '3\n10 20 30\n', label: 'Three nodes' },
    { input: '1\n99\n', label: 'Single node' },
  ],
  compare: 'exact',
  steps: [
    'Define `struct Node { int data; Node* next; Node* prev; };`.',
    'When adding a new node, point `newNode->prev = tail` and `tail->next = newNode`.',
    'Traverse forward starting from `head`, and traverse backward starting from `tail`.',
  ],
  hints: ['Remember to handle the empty list case where `head == nullptr`.'],
};

const dsaExtra2: TaskQ = {
  id: 'dsa-task-circular-queue',
  kind: 'task',
  track: 'dsa',
  source: 'DSA Lab 6 · Task 1b',
  prompt: t(
    '**Circular Queue with Modulo Arithmetic**',
    '',
    'Implement a Circular Queue of fixed capacity `5` using an array.',
    'Support operations:',
    '- `1 X`: enqueue value `X`. If queue is full, print `Full`.',
    '- `2`: dequeue and print the removed value. If empty, print `Empty`.',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

struct CircularQueue {
    int arr[5];
    int front;
    int rear;
    int count;
};

void initQueue(CircularQueue &q) {
    q.front = 0;
    q.rear = 0;
    q.count = 0;
}

void enqueue(CircularQueue &q, int val) {
    if (q.count == 5) {
        cout << "Full" << endl;
        return;
    }
    q.arr[q.rear] = val;
    q.rear = (q.rear + 1) % 5;
    q.count++;
}

void dequeue(CircularQueue &q) {
    if (q.count == 0) {
        cout << "Empty" << endl;
        return;
    }
    cout << q.arr[q.front] << endl;
    q.front = (q.front + 1) % 5;
    q.count--;
}

int main() {
    CircularQueue q;
    initQueue(q);
    int ops;
    cin >> ops;
    for (int i = 0; i < ops; i++) {
        int type;
        cin >> type;
        if (type == 1) {
            int val;
            cin >> val;
            enqueue(q, val);
        } else if (type == 2) {
            dequeue(q);
        }
    }
    return 0;
}
`,
  tests: [
    { input: '6\n1 10\n1 20\n2\n1 30\n2\n2\n', label: 'Enqueue, dequeue and circular wrap' },
    { input: '7\n1 1\n1 2\n1 3\n1 4\n1 5\n1 6\n2\n', label: 'Full detection' },
  ],
  compare: 'exact',
  steps: [
    'Maintain `front`, `rear`, and `count` to track state.',
    'Advance pointers using `(ptr + 1) % MAXQ`.',
  ],
  hints: ['Modulo `%` wraps index back to 0 when it hits `MAXQ`.'],
};

const dsaExtra3: TaskQ = {
  id: 'dsa-task-bst-traversal',
  kind: 'task',
  track: 'dsa',
  source: 'DSA Lab 8 · Task 1 & 2',
  prompt: t(
    '**Binary Search Tree (In-order Traversal & Height)**',
    '',
    'Construct a Binary Search Tree (BST) from `N` integer values.',
    'Output:',
    '- `InOrder: <elements sorted>`',
    '- `Height: <height of tree>` (number of levels, empty tree is height 0, root only is height 1)',
  ),
  solution: cpp`
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* left;
    Node* right;
};

Node* insertBST(Node* root, int val) {
    if (root == nullptr) {
        Node* n = new Node();
        n->data = val;
        n->left = nullptr;
        n->right = nullptr;
        return n;
    }
    if (val < root->data) {
        root->left = insertBST(root->left, val);
    } else {
        root->right = insertBST(root->right, val);
    }
    return root;
}

void inOrder(Node* root) {
    if (root == nullptr) return;
    inOrder(root->left);
    cout << root->data << " ";
    inOrder(root->right);
}

int treeHeight(Node* root) {
    if (root == nullptr) return 0;
    int lh = treeHeight(root->left);
    int rh = treeHeight(root->right);
    return 1 + (lh > rh ? lh : rh);
}

int main() {
    int n, val;
    cin >> n;
    Node* root = nullptr;
    for (int i = 0; i < n; i++) {
        cin >> val;
        root = insertBST(root, val);
    }
    cout << "InOrder: ";
    inOrder(root);
    cout << endl;
    cout << "Height: " << treeHeight(root) << endl;
    return 0;
}
`,
  tests: [
    { input: '5\n10 5 15 2 7\n', label: 'Balanced BST' },
    { input: '3\n1 2 3\n', label: 'Skewed BST' },
  ],
  compare: 'exact',
  steps: [
    'Define `struct Node { int data; Node* left; Node* right; };`.',
    'Insert recursively: if `val < root->data` go left, else go right.',
    'In-order traversal: recurse left, print root, recurse right.',
    'Height is `1 + max(leftHeight, rightHeight)`.',
  ],
  hints: ['In-order traversal of a BST always yields sorted order.'],
};

const dsaExtra4: TaskQ = {
  id: 'dsa-task-postfix-eval',
  kind: 'task',
  track: 'dsa',
  source: 'DSA Lab 5 · Task 3',
  prompt: t(
    '**Evaluate Postfix Expression with Stack**',
    '',
    'Evaluate an arithmetic expression in postfix notation consisting of `N` tokens (single digits or operators `+`, `-`, `*`).',
    'Input starts with `N`, followed by `N` space-separated tokens.',
    'Print `Result: <evaluated value>`.',
  ),
  solution: cpp`
#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    int stack[50];
    int top = -1;
    for (int i = 0; i < n; i++) {
        string tok;
        cin >> tok;
        if (tok == "+" || tok == "-" || tok == "*") {
            int b = stack[top--];
            int a = stack[top--];
            if (tok == "+") stack[++top] = a + b;
            else if (tok == "-") stack[++top] = a - b;
            else if (tok == "*") stack[++top] = a * b;
        } else {
            int val = 0;
            for (int k = 0; k < tok.length(); k++) {
                val = val * 10 + (tok[k] - '0');
            }
            stack[++top] = val;
        }
    }
    cout << "Result: " << stack[top] << endl;
    return 0;
}
`,
  tests: [
    { input: '5\n2 3 4 * +\n', label: '2 + (3 * 4) = 14' },
    { input: '5\n10 4 - 2 *\n', label: '(10 - 4) * 2 = 12' },
  ],
  compare: 'exact',
  steps: [
    'Use an integer stack.',
    'When reading an operand, push onto stack.',
    'When reading an operator, pop `b` then `a`, compute `a op b`, and push the result.',
  ],
  hints: ['Remember that `b` is popped first and `a` second, so the operation is `a - b`.'],
};

// =====================================================================================
// Registered Labs across the 3 Course Tracks
// =====================================================================================

export const LABS: Lab[] = [
  // ─── Track 1: Programming Fundamentals ───
  {
    id: 'lab-pf-final-fall23',
    title: 'Functions & Problem Solving',
    source: F23,
    track: 'pf',
    unit: 7,
    intro: 'Four comprehensive tasks on functions, loops, 2D arrays, and strings.',
    tasks: [f23q1, f23q2, f23q3, f23q4],
  },
  {
    id: 'lab-pf-ds23',
    title: 'Matrix & String Operations',
    source: DS23,
    track: 'pf',
    unit: 8,
    intro: 'Matrix traversals (zig-zag and Toeplitz), array encryption, and substring manipulation.',
    tasks: [ds23q1a, ds23q1b, ds23q2a, ds23q2b, ds23q3a, ds23q3b],
  },
  {
    id: 'lab-pf-patterns',
    title: 'Nested Loop Patterns',
    source: S1A,
    track: 'pf',
    unit: 6,
    intro: 'Exam-style pattern tasks for nested loops: star crosses, digit staircases, and hollow pyramids.',
    tasks: [s1aq1, s1aq2, s1bq1, s1bq2],
  },
  {
    id: 'lab-pf-core-tasks',
    title: 'Arrays, Matrices & Palindromes',
    source: 'PF Course Labs',
    track: 'pf',
    unit: 8,
    intro: 'Dynamic array prime counting, matrix transpose, and string palindrome validation.',
    tasks: [pfExtra1, pfExtra2, pfExtra3],
  },
  {
    id: 'lab-pf-final-fall22',
    title: 'Image Filtering & Dynamic Memory',
    source: F22,
    track: 'pf',
    unit: 8,
    intro: 'Image filtering on a 2D array, C-string manipulation, and frequency counting.',
    tasks: [f22q1, f22q2a, f22q2b, f22q2c, f22q3, f22q4],
  },
  {
    id: 'lab-pf-final-spr20',
    title: 'Grid Simulation & Large Numbers',
    source: SPR20,
    track: 'pf',
    unit: 8,
    intro: 'Habitat simulation on a grid, reference-based movement, and large number addition.',
    tasks: [spr20q1, spr20q2, spr20q3],
  },

  // ─── Track 2: Object Oriented Programming ───
  {
    id: 'lab-oop-core',
    title: 'Object Oriented Programming',
    source: 'OOP Course Labs',
    track: 'oop',
    unit: 11,
    intro: 'Hands-on OOP lab tasks: Structs/classes, matrix operations, volume calculations, complex arithmetic, encapsulation, and game leaderboards.',
    tasks: [oop1, oop2, oop3, oop4, oopExtra1, oopExtra2, oopExtra3],
  },

  // ─── Track 3: Data Structures ───
  {
    id: 'lab-dsa-core',
    title: 'Data Structures',
    source: 'Data Structures Course Labs',
    track: 'dsa',
    unit: 10,
    intro: 'Essential data structures: Singly & Doubly Linked Lists, Queue & Circular Queue operations, BST traversals, and Postfix evaluation.',
    tasks: [dsa1, dsa2, dsa3, dsa4, dsaExtra1, dsaExtra2, dsaExtra3, dsaExtra4],
  },
];


