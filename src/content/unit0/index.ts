import type { Level, Unit } from '../types';
import { cpp, prog } from '../helpers';

// Unit 0 comes before any C++. Every program here is shown as a FLOWCHART (view: 'flow' or a flow block);
// the C++ behind it is only a way to build the picture and run the dry run. Code is shown only in `flow-to-code`.

// ------------------------------------------------------------------ Level 0.1: algorithms
const AVG3 = prog(cpp`
    double a, b, c;
    cin >> a >> b >> c;
    double sum = a + b + c;
    double avg = sum / 3;
    cout << "Average = " << avg << endl;`);

const A1: Level = {
  id: 'algorithms',
  kind: 'lesson',
  title: 'What is an algorithm?',
  tagline: 'Before a computer can do anything, someone must write down the exact steps. That list of steps is called an **algorithm**.',
  minutes: 15,
  objectives: [
    'Say what an algorithm is: finite, clear, ordered steps',
    'Split any task into input → process → output',
    'Write numbered English steps for everyday tasks and simple maths',
  ],
  learn: [
    { t: 'p', text: 'A recipe for tea, or the directions you give a friend to reach your house, are **algorithms**: a list of steps that, if followed exactly, always solves the problem. A computer is a very fast but very *literal* friend — it does exactly what the steps say, nothing more. So programming starts with planning the steps.' },
    { t: 'list', ordered: true, items: [
      'Start.',
      'Boil **1 cup** of water.',
      'Add **1 teaspoon** of tea leaves and boil for **2 minutes**.',
      'Add **half a cup** of milk and **2 teaspoons** of sugar.',
      'Boil for **1 more minute**, then pour into a cup through a strainer.',
      'Stop.',
    ] },
    { t: 'callout', tone: 'key', title: 'Three rules for a good algorithm', text: '**Finite**: it must end (it reaches Stop). **Clear**: every step has exactly one meaning — "add 2 teaspoons", not "add some". **Ordered**: the steps are done one after another in a fixed order — you cannot pour the tea before you boil it.' },
    { t: 'table', head: ['Task', 'Input (what we are given)', 'Process (what we do)', 'Output (the answer we show)'], rows: [
      ['Make tea', 'water, tea leaves, milk, sugar', 'boil, mix, strain', 'a cup of tea'],
      ['Average of 3 numbers', 'the numbers `a`, `b`, `c`', '`sum = a + b + c`, `avg = sum / 3`', 'the average'],
      ['Shop bill', 'price and quantity', '`total = price × quantity`', 'the total to pay'],
      ['Cricket run rate', 'runs and overs', '`rate = runs / overs`', 'runs per over'],
    ], caption: 'Almost every algorithm has the same shape: **Input → Process → Output**.' },
    { t: 'list', ordered: true, items: [
      'Start.',
      'Read three numbers `a`, `b` and `c`.',
      'Work out `sum = a + b + c`.',
      'Work out `avg = sum / 3`.',
      'Display `avg`.',
      'Stop.',
    ] },
    { t: 'callout', tone: 'tip', title: 'Dry run = following the steps by hand', text: 'Pick some input, for example `70`, `80`, `96`, and follow the steps with a pencil: `sum = 246`, `avg = 246 / 3 = 82`. This is called a **dry run**. It is how we check an algorithm *before* a computer ever runs it.' },
    { t: 'flow', title: 'Your first flowchart: the same six steps as a picture (press ▶ to dry-run it)', code: AVG3, input: '70 80 96\n' },
    { t: 'terms', items: [
      { term: 'Algorithm', def: 'a finite list of clear, ordered steps that solves a problem' },
      { term: 'Input', def: 'the values the algorithm is given (typed by the user)' },
      { term: 'Process', def: 'the work done on the values: calculations, comparisons' },
      { term: 'Output', def: 'the result shown to the user' },
      { term: 'Flowchart', def: 'an algorithm drawn as a picture of boxes joined by arrows' },
    ] },
  ],
  ways: {
    goal: 'Find the average of three numbers (`70`, `80`, `96` → `82`). Four correct algorithms, drawn as flowcharts.',
    intro: 'There is almost never only one correct algorithm. Look at the boxes in the middle — the input and the output are the same every time.',
    items: [
      { title: 'Add first, then divide', view: 'flow', code: AVG3, input: '70 80 96\n' },
      { title: 'One formula', view: 'flow', code: prog(cpp`
    double a, b, c;
    cin >> a >> b >> c;
    double avg = (a + b + c) / 3;
    cout << "Average = " << avg << endl;`), input: '70 80 96\n', note: 'The brackets matter: add **all three** first, then divide.' },
      { title: 'A running total', view: 'flow', code: prog(cpp`
    double a, b, c;
    cin >> a >> b >> c;
    double sum = 0;
    sum = sum + a;
    sum = sum + b;
    sum = sum + c;
    cout << "Average = " << sum / 3 << endl;`), input: '70 80 96\n', note: 'Start the total at 0 and add one number at a time — the idea behind loops later.' },
      { title: 'Divide each number first', view: 'flow', code: prog(cpp`
    double a, b, c;
    cin >> a >> b >> c;
    double avg = a / 3 + b / 3 + c / 3;
    cout << "Average = " << avg << endl;`), input: '70 80 96\n', note: 'Also correct: (a + b + c) / 3 = a/3 + b/3 + c/3. More work, same answer.' },
    ],
    takeaway: 'Different steps, same input, same output. A good algorithm is one that is **correct**, **clear** and **finishes** — and the simplest one is usually the best.',
    check: { id: 'algorithms-ways-check', kind: 'mcq', prompt: 'Which of these is NOT a good algorithm step?', options: ['Add a little salt.', 'Read the three numbers a, b and c.', 'Work out avg = sum / 3.', 'Display the average.'], answer: 0, hints: ['A step must have exactly one meaning.'], explain: '"A little" is not clear — two people would do different things. Say exactly how much: "Add half a teaspoon of salt".' },
  },
  watch: [
    { title: 'Average of three numbers', view: 'flow', intro: 'Follow the arrows: read the three numbers, add them, divide by 3, show the answer.', code: AVG3, input: '70 80 96\n' },
    { title: 'Shop bill', view: 'flow', intro: 'Input → process → output with a real shop: 4 packets of biscuits at Rs 250 each.', code: prog(cpp`
    int price, qty;
    cin >> price >> qty;
    int total = price * qty;
    cout << "Total = Rs " << total << endl;`), input: '250 4\n' },
  ],
  think: {
    title: 'Cricket run rate',
    view: 'flow',
    problem: 'A team scored `180` runs in `20` overs. Write an algorithm that reads the runs and the overs and shows the **run rate** (runs per over).',
    steps: [
      { text: 'Make two boxes in memory for the runs and the overs.', lines: [5] },
      { text: 'Input: read the runs and the overs.', lines: [6] },
      { text: 'Process: `rate = runs / overs`.', lines: [7] },
      { text: 'Output: display the rate.', lines: [8] },
    ],
    code: prog(cpp`
    double runs, overs;
    cin >> runs >> overs;
    double rate = runs / overs;
    cout << "Run rate = " << rate << endl;`),
    input: '180 20\n',
    why: 'Always find the three parts first. **Input**: runs, overs. **Process**: one division. **Output**: the rate. Then each part becomes one or two boxes.',
    yourTurn: {
      id: 'algorithms-think-trace',
      kind: 'trace',
      mode: 'vars',
      view: 'flow',
      prompt: 'Dry run the flowchart for a team that scored `150` runs in `20` overs. Fill each row as the boxes run.',
      code: prog(cpp`
    double runs, overs;
    cin >> runs >> overs;
    double rate = runs / overs;
    cout << "Run rate = " << rate << endl;`),
      input: '150 20\n',
      vars: ['runs', 'overs', 'rate'],
      hints: ['The input box stores 150 in runs and 20 in overs.', '150 / 20 = 7.5'],
      explain: 'runs = 150, overs = 20, rate = 150 / 20 = `7.5`, and the output is `Run rate = 7.5`.',
    },
  },
  practice: [
    { id: 'algorithms-q1', kind: 'mcq', prompt: 'An algorithm finds the **area of a rectangle**. What is its INPUT?', options: ['The length and the width', 'The area', 'Multiplying length × width', 'The screen'], answer: 0, hints: ['Input = what the user must give before any work can start.'], explain: 'Input: length and width. Process: `area = length × width`. Output: the area.' },
    { id: 'algorithms-q2', kind: 'mcq', tag: 'real life', prompt: 'Which list of ATM steps is in the correct ORDER?', options: [
      'Insert card → enter PIN → type amount → take cash → take card',
      'Enter PIN → insert card → take cash → type amount → take card',
      'Type amount → take cash → insert card → enter PIN → take card',
      'Take cash → insert card → enter PIN → type amount → take card',
    ], answer: 0, hints: ['What must the machine know before it can check your PIN?'], explain: 'Each step needs the step before it: the machine cannot check a PIN before it has your card, and it cannot give cash before it knows the amount. Order is one of the three rules.' },
    { id: 'algorithms-q3', kind: 'mcq', tag: 'tricky', prompt: 'A student writes: **1.** Start. **2.** Stir the tea. **3.** Go back to step 2. **4.** Stop. Which rule of a good algorithm is broken?', options: ['Finite — it never reaches Stop', 'Clear — "stir" has two meanings', 'Ordered — step 4 should come first', 'Nothing, it is a good algorithm'], answer: 0, hints: ['Follow the steps: 1, 2, 3, 2, 3, 2, 3 … does it ever reach step 4?'], explain: 'Step 3 always sends you back to step 2, so step 4 is never reached. An algorithm must **finish**. A correct version: "3. If the tea is the right colour, go to step 4, otherwise go back to step 2."' },
    { id: 'algorithms-q4', kind: 'predict', view: 'flow', prompt: 'The user types `4` and `5`. Follow the flowchart and write exactly what it displays.', code: prog(cpp`
    int a, b;
    cin >> a >> b;
    int sum = a + b;
    int product = a * b;
    cout << "Sum = " << sum << endl;
    cout << "Product = " << product << endl;`), input: '4 5\n', hints: ['sum = 4 + 5, product = 4 × 5.', 'Each Display box ends with a new line.'], explain: '`sum = 9`, `product = 20`. The two output boxes show `Sum = 9` and then, on the next line, `Product = 20`.' },
    { id: 'algorithms-q5', kind: 'trace', mode: 'vars', view: 'flow', prompt: 'Celsius to Fahrenheit: `f = c × 9 / 5 + 32`. Dry run it for `c = 25`.', code: prog(cpp`
    int c;
    cin >> c;
    int f = c * 9 / 5 + 32;
    cout << c << " C = " << f << " F" << endl;`), input: '25\n', vars: ['c', 'f'], hints: ['Work left to right: 25 × 9 = 225, then 225 / 5 = 45, then 45 + 32.'], explain: '25 × 9 = 225, 225 / 5 = 45, 45 + 32 = `77`. Output: `25 C = 77 F`.' },
    { id: 'algorithms-q6', kind: 'mcq', prompt: 'Steps for the area of a rectangle: **1.** Start **2.** Read length and width **3.** ??? **4.** Display area **5.** Stop. What is step 3?', options: ['area = length × width', 'Read area', 'Display length × width', 'Stop'], answer: 0, hints: ['Step 4 displays `area` — where does `area` get its value?'], explain: 'Between input and output comes the **process**: `area = length × width`. Without it there is nothing to display.' },
    { id: 'algorithms-q7', kind: 'mcq', prompt: 'In a shop-bill algorithm, the step `total = price × quantity` is which part?', options: ['Process', 'Input', 'Output', 'Start'], answer: 0, hints: ['It does not read anything and does not show anything.'], explain: 'It *works something out* from values we already have — that is processing.' },
    { id: 'algorithms-q8', kind: 'predict', view: 'flow', tag: 'real life', prompt: 'Sara saves Rs 50 every day. The user types `7` (days). What does the flowchart display?', code: prog(cpp`
    int days;
    cin >> days;
    int saved = days * 50;
    cout << "Saved: Rs " << saved << endl;`), input: '7\n', hints: ['7 × 50'], explain: '`saved = 7 × 50 = 350`, so it displays `Saved: Rs 350`.' },
  ],
  cheatsheet: [
    { code: 'Algorithm', text: 'a finite list of clear, ordered steps that solves a problem' },
    { code: 'Input → Process → Output', text: 'find these three parts first, for every problem' },
    { code: 'Start … Stop', text: 'every algorithm begins once and must finish' },
    { code: 'Dry run', text: 'follow the steps by hand with real numbers to check them' },
  ],
};

// ------------------------------------------------------------------ Level 0.2: flowchart symbols
const SYMBOLS = prog(cpp`
    int n; // @ Rectangle: Declare n
    cin >> n; // @ Parallelogram: Input n
    if (n < 0) { // @ Diamond: n < 0 ?
        n = -n; // @ Rectangle: n = -n
    }
    cout << n; // @ Parallelogram: Display n`);

const S2: Level = {
  id: 'flowchart-symbols',
  kind: 'lesson',
  title: 'Flowchart symbols',
  tagline: 'A flowchart is an algorithm drawn as a picture. Each kind of step has its own shape, and arrows show which step comes next.',
  minutes: 20,
  objectives: [
    'Name the five symbols: oval, rectangle, parallelogram, diamond, arrow',
    'Follow the rules: one Start, two exits from every decision, arrows show the order',
    'Follow a flowchart box by box for a given input (a dry run)',
  ],
  learn: [
    { t: 'p', text: 'Numbered English steps are good, but a picture is easier to follow — especially when the algorithm has to *choose* between two paths. In a **flowchart**, the **shape** of a box tells you what kind of step it is, and the **arrows** tell you where to go next.' },
    { t: 'table', head: ['Symbol', 'Shape', 'Used for', 'Example label'], rows: [
      ['**Terminal**', 'Oval (rounded ends)', 'where the algorithm starts and stops', 'Start, Stop'],
      ['**Process**', 'Rectangle', 'a calculation, or making / changing a variable', '`sum = a + b`, `Declare n`'],
      ['**Input / Output**', 'Parallelogram (slanted sides)', 'reading a value from the user, or showing something', '`Input n`, `Display sum`'],
      ['**Decision**', 'Diamond', 'a yes/no question — it has two exits, **Yes** and **No**', '`n > 0 ?`'],
      ['**Flow line**', 'Arrow', 'shows which box comes next', '→'],
    ] },
    { t: 'flowchart', code: SYMBOLS, caption: 'Every shape in one picture. This small algorithm shows the *size* of a number: if it is negative, it removes the minus sign.' },
    { t: 'callout', tone: 'key', title: 'The rules', text: 'Exactly **one Start**. Arrows go from top to bottom (and back up only for loops). Every **diamond has two exits**, labelled Yes and No. Each rectangle does **one** job. Draw it so the arrows do not cross. Every path must reach **Stop**.' },
    { t: 'table', head: ['Written in a box', 'Meaning'], rows: [
      ['`a = b + c`', 'work out `b + c`, then store the answer in the box `a` (some books draw `a ← b + c`)'],
      ['`n > 0 ?`, `n < 0 ?`', 'is n greater than 0? is n less than 0?'],
      ['`n >= 50 ?`, `n <= 50 ?`', 'is n **at least** 50 (50 counts)? is n **at most** 50?'],
      ['`n == 0 ?`', 'is n **equal** to 0? (two `=` signs: one `=` would mean "store")'],
      ['`n != 0 ?`', 'is n **not** equal to 0?'],
      ['`Display "Hi"` / `Display x`', 'show the text inside the quotes exactly / show the **value** in box x'],
    ], caption: 'We write boxes in the same short style C++ uses, so moving to code later is easy.' },
    { t: 'h', text: 'Following a flowchart: a dry run' },
    { t: 'flow', title: 'Size of a number — dry run it with -7 (then change the input to 12)', code: SYMBOLS, input: '-7\n' },
    { t: 'callout', tone: 'tip', title: 'Where did the arrows go?', text: 'With `-7` the diamond answers **Yes**, so the box `n = -n` runs and n becomes 7. With `12` it answers **No**, the arrow goes around that box, and both paths meet again before `Display n`.' },
  ],
  ways: {
    goal: 'Show whether a number is positive (`7` → `Positive`). Four correct flowcharts.',
    items: [
      { title: 'Ask "is n > 0?"', view: 'flow', code: prog(cpp`
    int n;
    cin >> n;
    if (n > 0) {
        cout << "Positive";
    } else {
        cout << "Not positive";
    }`), input: '7\n' },
      { title: 'Ask the opposite question', view: 'flow', code: prog(cpp`
    int n;
    cin >> n;
    if (n <= 0) {
        cout << "Not positive";
    } else {
        cout << "Positive";
    }`), input: '7\n', note: 'The Yes and No boxes swap places.' },
      { title: 'Turn the question around', view: 'flow', code: prog(cpp`
    int n;
    cin >> n;
    if (0 < n) {
        cout << "Positive";
    } else {
        cout << "Not positive";
    }`), input: '7\n', note: '"0 is less than n" means the same as "n is greater than 0".' },
      { title: 'Guess first, then correct', view: 'flow', code: prog(cpp`
    int n;
    cin >> n;
    string msg = "Not positive";
    if (n > 0) {
        msg = "Positive";
    }
    cout << msg;`), input: '7\n', note: 'Store the "no" answer first; change it only on the Yes path. The No arrow has no box at all.' },
    ],
    takeaway: 'The same decision can be drawn in many ways. What matters: the diamond asks the right question, and each exit leads to the right box.',
    check: { id: 'flowchart-symbols-ways-check', kind: 'mcq', prompt: 'Which of these is NOT a correct flowchart?', options: [
      'A diamond `marks >= 50 ?` with only a Yes arrow coming out',
      'A diamond whose Yes and No arrows lead to different boxes',
      'An oval Start at the top with one arrow going down',
      'A parallelogram `Input marks` right after Start',
    ], answer: 0, hints: ['Count the exits a diamond must have.'], explain: 'A decision always has **two** exits. With only Yes, the flowchart does not say what to do when the answer is No.' },
  },
  watch: [
    { title: 'Voting age', view: 'flow', intro: 'Input 16 takes the No arrow. Change it to 20 and watch the other path light up.', code: prog(cpp`
    int age;
    cin >> age;
    if (age >= 18) {
        cout << "You can vote" << endl;
    } else {
        cout << "Wait " << 18 - age << " more years" << endl;
    }
    cout << "Thank you" << endl;`), input: '16\n' },
    { title: 'Parking fee', view: 'flow', intro: 'Every symbol except a diamond: Rs 50 for every hour.', code: prog(cpp`
    int hours;
    cin >> hours;
    int fee = hours * 50;
    cout << "Fee: Rs " << fee << endl;`), input: '3\n' },
  ],
  think: {
    title: 'Heat alert',
    view: 'flow',
    problem: 'Read today\'s temperature. If it is more than 40, display `Heat alert`. For every temperature, display `Drink water` at the end.',
    steps: [
      { text: 'Rectangle: make a box in memory for the temperature.', lines: [5] },
      { text: 'Parallelogram: read the temperature.', lines: [6] },
      { text: 'Diamond: is the temperature more than 40?', lines: [7] },
      { text: 'Yes arrow → parallelogram: display `Heat alert`.', lines: [8] },
      { text: 'Both arrows meet → parallelogram: display `Drink water`. Then Stop.', lines: [10] },
    ],
    code: prog(cpp`
    int temp;
    cin >> temp;
    if (temp > 40) {
        cout << "Heat alert" << endl;
    }
    cout << "Drink water" << endl;`),
    input: '44\n',
    why: 'The No arrow of the diamond has no box on it — it simply skips the alert. Both paths meet again, so `Drink water` is shown for everyone.',
    yourTurn: {
      id: 'flowchart-symbols-think-trace',
      kind: 'trace',
      mode: 'vars',
      view: 'flow',
      prompt: 'Dry run the flowchart for a temperature of `35`. Write the value stored, the diamond\'s answer (true = Yes, false = No) and what is displayed.',
      code: prog(cpp`
    int temp;
    cin >> temp;
    if (temp > 40) {
        cout << "Heat alert" << endl;
    }
    cout << "Drink water" << endl;`),
      input: '35\n',
      vars: ['temp'],
      hints: ['Is 35 more than 40?', 'No → skip the alert box.'],
      explain: '`35 > 40` is false, so the No arrow is followed and only `Drink water` is displayed.',
    },
  },
  practice: [
    { id: 'flowchart-symbols-q1', kind: 'mcq', prompt: 'Which shape is used for a **decision** (a yes/no question)?', options: ['Diamond', 'Rectangle', 'Parallelogram', 'Oval'], answer: 0, hints: ['It has two exits.'], explain: 'A diamond: one arrow in, two arrows out (Yes and No).' },
    { id: 'flowchart-symbols-q2', kind: 'mcq', prompt: 'Which shape is used for `Input marks` and for `Display grade`?', options: ['Parallelogram', 'Rectangle', 'Diamond', 'Oval'], answer: 0, hints: ['Input and output share one shape.'], explain: 'Both reading and showing use the parallelogram (slanted rectangle).' },
    { id: 'flowchart-symbols-q3', kind: 'mcq', view: 'flow', prompt: 'Look at the flowchart. Which box is a **process** box?', code: prog(cpp`
    int a, b;
    cin >> a >> b;
    int c = a * b;
    cout << c;`), input: '3 4\n', options: ['`c = a * b`', '`Input a, b`', '`Display c`', '`Start`'], answer: 0, hints: ['A process box works something out. Which box does a calculation?'], explain: '`c = a * b` is a rectangle: it calculates and stores. `Declare a, b` is a process box too. `Input` and `Display` are parallelograms; Start is an oval.' },
    { id: 'flowchart-symbols-q4', kind: 'predict', view: 'flow', prompt: 'The user types `12`. What does the flowchart display?', code: prog(cpp`
    int n;
    cin >> n;
    if (n > 10) {
        cout << "Big" << endl;
    } else {
        cout << "Small" << endl;
    }
    cout << "Done" << endl;`), input: '12\n', hints: ['Is 12 > 10?', 'After the Yes box, the paths meet at `Display "Done"`.'], explain: '`12 > 10` → Yes → `Big`. Then both paths meet and `Done` is displayed too.' },
    { id: 'flowchart-symbols-q5', kind: 'mcq', view: 'flow', prompt: 'For which input does this flowchart follow the **No** arrow?', code: prog(cpp`
    int age;
    cin >> age;
    if (age >= 18) {
        cout << "Adult";
    } else {
        cout << "Child";
    }`), input: '18\n', options: ['17', '18', '25', '40'], answer: 0, hints: ['`>=` means "at least". Is 18 at least 18?'], explain: 'Only `17 >= 18` is false. 18 is *at least* 18, so it takes the Yes arrow.' },
    { id: 'flowchart-symbols-q6', kind: 'trace', mode: 'vars', view: 'flow', tag: 'real life', prompt: 'Shoe shop: bills over Rs 300 get Rs 50 off. Dry run for a price of `400`.', code: prog(cpp`
    int price;
    cin >> price;
    int discount = 0;
    if (price > 300) {
        discount = 50;
    }
    int pay = price - discount;
    cout << "Pay " << pay << endl;`), input: '400\n', vars: ['price', 'discount', 'pay'], hints: ['discount starts at 0.', '400 > 300 → Yes → discount becomes 50.'], explain: 'discount = 0, then Yes → 50. pay = 400 − 50 = `350`.' },
    { id: 'flowchart-symbols-q7', kind: 'mcq', tag: 'tricky', prompt: 'A student draws: Start → `Input n` → `Display n` → an arrow back up to `Input n`. There is no diamond. What is wrong?', options: ['It never reaches Stop — there is no question that lets it leave', 'Input and Display cannot be next to each other', 'Start must be a rectangle', 'Nothing is wrong'], answer: 0, hints: ['Which box could ever send the flow to Stop?'], explain: 'Without a decision, the back arrow repeats forever. A loop needs a diamond that can answer No and leave. Rule: every path must reach **Stop**.' },
    { id: 'flowchart-symbols-q8', kind: 'mcq', prompt: 'What does the box `total = total + 5` do?', options: ['Works out total + 5 and stores the answer back in total', 'Asks whether total is equal to total + 5', 'Displays total + 5', 'Nothing — it can never be true'], answer: 0, hints: ['In a rectangle, `=` means *store*, not *is equal*.'], explain: 'A rectangle with `=` is an instruction: work out the right side, put the result into the box on the left. If total was 10, it becomes 15.' },
  ],
  cheatsheet: [
    { code: 'Oval', text: 'Start / Stop' },
    { code: 'Rectangle', text: 'process: calculate, store (`sum = a + b`)' },
    { code: 'Parallelogram', text: 'input / output (`Input n`, `Display sum`)' },
    { code: 'Diamond', text: 'decision: a yes/no question with two exits' },
  ],
};

// ------------------------------------------------------------------ Level 0.3: sequence
const SUM2 = prog(cpp`
    int a, b;
    cin >> a >> b;
    int sum = a + b;
    cout << "Sum = " << sum << endl;`);

const MINS = prog(cpp`
    int total;
    cin >> total;
    int hours = total / 60;
    int mins = total % 60;
    cout << hours << " h " << mins << " min" << endl;`);

const Q3: Level = {
  id: 'flow-sequence',
  kind: 'lesson',
  title: 'Sequence: one box after another',
  tagline: 'The simplest flowcharts go straight down: every box runs exactly once, from Start to Stop. The skill is keeping track of the values.',
  minutes: 20,
  objectives: [
    'Draw straight-line flowcharts for sums, areas, averages and conversions',
    'Use `/` (whole division) and `%` (remainder) to split minutes into hours',
    'Swap two values with a temporary box, and dry-run it in a table',
  ],
  learn: [
    { t: 'p', text: 'A **variable** is a labelled box in memory that holds one value. `Input a` puts the typed number into box `a`. `sum = a + b` reads the values in `a` and `b`, adds them, and puts the answer into box `sum`. In a sequence, the boxes run one after another, each exactly once.' },
    { t: 'flow', title: 'Sum of two numbers (input 8 and 5)', code: SUM2, input: '8 5\n' },
    { t: 'table', head: ['Box', '`a`', '`b`', '`sum`', 'Output'], rows: [
      ['`Declare a, b`', '?', '?', '', ''],
      ['`Input a, b`', '8', '5', '', ''],
      ['`sum = a + b`', '', '', '13', ''],
      ['`Display "Sum = ", sum`', '', '', '', '`Sum = 13`'],
    ], caption: 'A **dry-run table**: one column per variable, one row per box. Write a value only when it changes. `?` means the box exists but has no value yet.' },
    { t: 'callout', tone: 'warn', title: 'Order matters', text: 'If `sum = a + b` came **before** `Input a, b`, the boxes `a` and `b` would still be empty and the sum would be rubbish. A value must be stored before it is used.' },
    { t: 'h', text: 'Whole-number division and remainder' },
    { t: 'table', head: ['Box', 'Result', 'Why'], rows: [
      ['`135 / 60`', '`2`', 'with whole numbers, `/` keeps only the whole part: 60 fits into 135 two times'],
      ['`135 % 60`', '`15`', '`%` (remainder) is what is left over: 135 − 2 × 60 = 15'],
      ['`7 / 2` and `7 % 2`', '`3` and `1`', '7 = 3 × 2 + 1'],
      ['`n % 10`', 'last digit of n', '472 % 10 = 2'],
    ] },
    { t: 'flow', title: 'Minutes → hours and minutes (input 135)', code: MINS, input: '135\n' },
    { t: 'callout', tone: 'key', title: 'Swapping needs a third box', text: 'To swap `a` and `b`, you cannot write `a = b` then `b = a` — after the first box, the old value of a is gone. Like swapping the drinks in two glasses, you need an empty third glass: `temp = a`, `a = b`, `b = temp`. (See it in *Watch*.)' },
  ],
  ways: {
    goal: 'Find the area of a rectangle with length `12` and width `5` (→ `60`).',
    items: [
      { title: 'Input, multiply, display', view: 'flow', code: prog(cpp`
    int length, width;
    cin >> length >> width;
    int area = length * width;
    cout << "Area = " << area << endl;`), input: '12 5\n' },
      { title: 'Multiply the other way round', view: 'flow', code: prog(cpp`
    int length, width;
    cin >> length >> width;
    int area = width * length;
    cout << "Area = " << area << endl;`), input: '12 5\n', note: '12 × 5 = 5 × 12.' },
      { title: 'Calculate inside the output box', view: 'flow', code: prog(cpp`
    int length, width;
    cin >> length >> width;
    cout << "Area = " << length * width << endl;`), input: '12 5\n', note: 'No `area` box: the output box works it out and shows it. Shorter, but you cannot use the area again later.' },
      { title: 'Fixed values, no input', view: 'flow', code: prog(cpp`
    int length = 12;
    int width = 5;
    int area = length * width;
    cout << "Area = " << area << endl;`), note: 'Works only for this one rectangle. Reading input makes the algorithm useful for every rectangle.' },
    ],
    takeaway: 'Input → process → output, each box once. You may merge or split boxes, but every value must be stored before it is used.',
    check: { id: 'flow-sequence-ways-check', kind: 'mcq', prompt: 'Which box does NOT find the area of a rectangle?', options: ['`area = length + width`', '`area = length * width`', '`area = width * length`', '`Display length * width`'], answer: 0, hints: ['Area = length × width.'], explain: '`length + width` gives 17, not 60. That is half the perimeter, not the area.' },
  },
  watch: [
    { title: 'Swapping two values with a temp box', view: 'flow', intro: 'Watch the Variables panel: `temp` keeps a copy of a, so nothing is lost.', code: prog(cpp`
    int a, b;
    cin >> a >> b;
    int temp = a;
    a = b;
    b = temp;
    cout << "a = " << a << ", b = " << b << endl;`), input: '3 9\n' },
    { title: 'Average of three marks', view: 'flow', intro: 'Add all three, then divide by 3.', code: prog(cpp`
    double m1, m2, m3;
    cin >> m1 >> m2 >> m3;
    double avg = (m1 + m2 + m3) / 3;
    cout << "Average = " << avg << endl;`), input: '70 80 90\n' },
    { title: 'How many Rs 500 notes?', view: 'flow', intro: '`/` counts the whole notes, `%` gives the money left over.', code: prog(cpp`
    int amount;
    cin >> amount;
    int notes = amount / 500;
    int left = amount % 500;
    cout << notes << " notes of 500, Rs " << left << " left" << endl;`), input: '1750\n' },
  ],
  think: {
    title: 'Shop bill with 10% discount',
    view: 'flow',
    problem: 'Read the price of one item and the quantity. Work out the total, take 10% off, and display the amount to pay.',
    steps: [
      { text: 'Make boxes for the price and the quantity.', lines: [5] },
      { text: 'Input: read the price and the quantity.', lines: [6] },
      { text: 'Process: `total = price × qty`.', lines: [7] },
      { text: 'Process: 10% of the total is `total / 10`.', lines: [8] },
      { text: 'Process: `pay = total − discount`.', lines: [9] },
      { text: 'Output: display the amount to pay.', lines: [10] },
    ],
    code: prog(cpp`
    int price, qty;
    cin >> price >> qty;
    int total = price * qty;
    int discount = total / 10;
    int pay = total - discount;
    cout << "Pay Rs " << pay << endl;`),
    input: '250 4\n',
    why: 'One job per box. Each process box uses only values that were stored by the boxes above it.',
    yourTurn: {
      id: 'flow-sequence-think-trace',
      kind: 'trace',
      mode: 'vars',
      view: 'flow',
      prompt: 'Dry run the bill for price `120` and quantity `5`.',
      code: prog(cpp`
    int price, qty;
    cin >> price >> qty;
    int total = price * qty;
    int discount = total / 10;
    int pay = total - discount;
    cout << "Pay Rs " << pay << endl;`),
      input: '120 5\n',
      vars: ['price', 'qty', 'total', 'discount', 'pay'],
      given: [0],
      hints: ['total = 120 × 5.', 'discount = 600 / 10.'],
      explain: 'total = 600, discount = 60, pay = 540 → `Pay Rs 540`.',
    },
  },
  practice: [
    { id: 'flow-sequence-q1', kind: 'trace', mode: 'vars', view: 'flow', prompt: 'Dry run the swap for input `15` and `2`.', code: prog(cpp`
    int a, b;
    cin >> a >> b;
    int temp = a;
    a = b;
    b = temp;
    cout << a << " " << b << endl;`), input: '15 2\n', vars: ['a', 'b', 'temp'], hints: ['temp gets a copy of a (15).', 'Then a gets b, and b gets the copy.'], explain: 'temp = 15, a = 2, b = 15. Output `2 15`.' },
    { id: 'flow-sequence-q2', kind: 'predict', view: 'flow', prompt: 'The user types `200`. What does the flowchart display?', code: MINS, input: '200\n', hints: ['200 / 60 keeps only the whole part.', '200 − 3 × 60 = ?'], explain: '`200 / 60 = 3` and `200 % 60 = 20` → `3 h 20 min`.' },
    { id: 'flow-sequence-q3', kind: 'predict', view: 'flow', tag: 'tricky', prompt: 'A student tries to swap without a temp box. `a` is 3 and `b` is 9. What is displayed?', code: prog(cpp`
    int a = 3;
    int b = 9;
    a = b;
    b = a;
    cout << a << " " << b << endl;`), hints: ['After `a = b`, what is in box a?', 'Then `b = a` copies that same value back.'], explain: '`a = b` makes a 9 — the 3 is lost. Then `b = a` copies 9 into b. Output: `9 9`. That is why a swap needs `temp`.' },
    { id: 'flow-sequence-q4', kind: 'blanks', view: 'flow', prompt: 'Area of a triangle = base × height ÷ 2. Fill in **Box 1**. Input `10 6` → `Area = 30`.', code: prog(cpp`
    int base, height;
    cin >> base >> height;
    int area;
    [[1]];
    cout << "Area = " << area << endl;`), blanks: [{ answers: ['area = base * height / 2', 'area = (base * height) / 2', 'area = height * base / 2', 'area = base * height * 0.5'] }], chips: ['area', '=', 'base', 'height', '*', '/', '2'], input: '10 6\n', hints: ['The box must store something in `area`.', 'Use `*` for × and `/` for ÷.'], explain: '`area = base * height / 2` → 10 × 6 = 60, 60 / 2 = 30.' },
    { id: 'flow-sequence-q5', kind: 'blanks', view: 'flow', prompt: 'Convert seconds into minutes and seconds. Fill in **Box 1** and **Box 2**. Input `125` → `2 min 5 sec`.', code: prog(cpp`
    int total, m, s;
    cin >> total;
    [[1]];
    [[2]];
    cout << m << " min " << s << " sec" << endl;`), blanks: [{ answers: ['m = total / 60'] }, { answers: ['s = total % 60', 's = total - m * 60'] }], chips: ['m', 's', 'total', '=', '/', '%', '60'], input: '125\n', hints: ['How many whole 60s fit into total? Use `/`.', 'What is left over? Use `%`.'], explain: '`m = total / 60` → 2, `s = total % 60` → 5.' },
    { id: 'flow-sequence-q6', kind: 'trace', mode: 'vars', view: 'flow', tag: 'tricky', prompt: 'The same box can change many times. Dry run it.', code: prog(cpp`
    int x = 5;
    x = x + 3;
    x = x * 2;
    x = x - 1;
    cout << x << endl;`), vars: ['x'], hints: ['Each box uses the value x has *right now*.'], explain: '5 → 8 → 16 → 15. Only the latest value is kept in the box.' },
    { id: 'flow-sequence-q7', kind: 'mcq', prompt: 'A flowchart for "sum of two numbers" has these boxes in the middle. Which order is correct?', options: ['`Input a, b` → `sum = a + b` → `Display sum`', '`sum = a + b` → `Input a, b` → `Display sum`', '`Display sum` → `Input a, b` → `sum = a + b`', '`Input a, b` → `Display sum` → `sum = a + b`'], answer: 0, hints: ['A value must be stored before it is used.'], explain: 'Read the numbers, then add them, then show the answer: input → process → output.' },
    { id: 'flow-sequence-q8', kind: 'predict', view: 'flow', tag: 'real life', prompt: 'Electricity: the meter read `1100` last month and `1250` this month. One unit costs Rs 20. What is displayed?', code: prog(cpp`
    int previous, current;
    cin >> previous >> current;
    int units = current - previous;
    int bill = units * 20;
    cout << units << " units, bill Rs " << bill << endl;`), input: '1100 1250\n', hints: ['units = 1250 − 1100.'], explain: 'units = 150, bill = 150 × 20 = 3000 → `150 units, bill Rs 3000`.' },
  ],
  cheatsheet: [
    { code: 'sum = a + b', text: 'work out the right side, then store it in the box on the left' },
    { code: '135 / 60 → 2   135 % 60 → 15', text: 'whole division and remainder' },
    { code: 'temp = a, a = b, b = temp', text: 'the three boxes of a swap' },
    { code: 'Dry-run table', text: 'one column per variable, one row per box, write only changes' },
  ],
};

// ------------------------------------------------------------------ Level 0.4: decisions
const EVEN = prog(cpp`
    int n;
    cin >> n;
    if (n % 2 == 0) {
        cout << n << " is Even" << endl;
    } else {
        cout << n << " is Odd" << endl;
    }`);

const LARGEST3 = prog(cpp`
    int a, b, c;
    cin >> a >> b >> c;
    if (a > b) {
        if (a > c) {
            cout << "Largest: " << a << endl;
        } else {
            cout << "Largest: " << c << endl;
        }
    } else {
        if (b > c) {
            cout << "Largest: " << b << endl;
        } else {
            cout << "Largest: " << c << endl;
        }
    }`);

const GRADES = prog(cpp`
    int marks;
    cin >> marks;
    if (marks >= 80) {
        cout << "Grade A" << endl;
    } else if (marks >= 70) {
        cout << "Grade B" << endl;
    } else if (marks >= 60) {
        cout << "Grade C" << endl;
    } else {
        cout << "Fail" << endl;
    }`);

const D4: Level = {
  id: 'flow-decisions',
  kind: 'lesson',
  title: 'Decisions: the diamond',
  tagline: 'A diamond asks a yes/no question. The flow splits into two paths — and exactly one of them is taken.',
  minutes: 25,
  objectives: [
    'Draw decisions for even/odd, pass/fail and the largest of two numbers',
    'Put decisions inside decisions (largest of three, grade ladders)',
    'Find an input for every path through a flowchart',
  ],
  learn: [
    { t: 'p', text: 'Real problems need choices: *is the number even? did the student pass? which number is bigger?* A **diamond** asks the question. The **Yes** arrow leads to the boxes for "yes", the **No** arrow to the boxes for "no", and then the two paths **meet again**.' },
    { t: 'flow', title: 'Even or odd (input 7 — then try 10)', code: EVEN, input: '7\n' },
    { t: 'callout', tone: 'key', title: 'Exactly one path runs', text: 'For one input, the diamond gives one answer, so only one of the two output boxes runs — never both, never neither. `n % 2` is the remainder after dividing by 2: 0 for even numbers, 1 for odd ones.' },
    { t: 'table', head: ['Question in the diamond', 'Yes when …', 'Example Yes / No'], rows: [
      ['`n % 2 == 0 ?`', 'n is even', '10 / 7'],
      ['`marks >= 50 ?`', 'marks is 50 or more', '50 / 49'],
      ['`a > b ?`', 'a is bigger than b', '9 and 4 / 4 and 9'],
      ['`balance >= amount ?`', 'there is enough money', '5000, 2000 / 1000, 2000'],
    ] },
    { t: 'h', text: 'Decisions inside decisions' },
    { t: 'flow', title: 'Largest of three (input 4 9 2)', code: LARGEST3, input: '4 9 2\n' },
    { t: 'callout', tone: 'tip', title: 'Count the paths — and test each one', text: 'The first diamond splits into 2 paths, and each of those meets another diamond: **4 paths** in total (4 output boxes). A good tester picks one input for each path, e.g. `9 4 2` (a), `4 2 9` (c), `4 9 2` (b), `2 4 9` (c).' },
    { t: 'callout', tone: 'warn', title: '> or >= ?', text: 'The edge value is where mistakes hide. If the pass mark is 50, `marks > 50 ?` says **No** for exactly 50 — the student fails by mistake. Always test the edge value (50) itself.' },
  ],
  ways: {
    goal: 'Display the larger of two numbers (`15` and `9` → `15`).',
    items: [
      { title: 'Ask "a > b?"', view: 'flow', code: prog(cpp`
    int a, b;
    cin >> a >> b;
    if (a > b) {
        cout << a;
    } else {
        cout << b;
    }`), input: '15 9\n' },
      { title: 'Ask "b > a?"', view: 'flow', code: prog(cpp`
    int a, b;
    cin >> a >> b;
    if (b > a) {
        cout << b;
    } else {
        cout << a;
    }`), input: '15 9\n' },
      { title: 'Guess a, then correct', view: 'flow', code: prog(cpp`
    int a, b;
    cin >> a >> b;
    int big = a;
    if (b > big) {
        big = b;
    }
    cout << big;`), input: '15 9\n', note: 'Only one output box. This idea — keep the biggest so far — becomes "largest in a list" with loops.' },
      { title: 'Ask "a >= b?"', view: 'flow', code: prog(cpp`
    int a, b;
    cin >> a >> b;
    if (a >= b) {
        cout << a;
    } else {
        cout << b;
    }`), input: '15 9\n', note: 'When a and b are equal, either one is the larger — both answers are right.' },
    ],
    takeaway: 'One question, many drawings. Check every version with an input for each path — and with two equal numbers.',
    check: { id: 'flow-decisions-ways-check', kind: 'mcq', prompt: 'Which algorithm gives the WRONG answer for `a = 4`, `b = 10`?', options: [
      '`big = a`, then if `a > b` → `big = b`, then display big',
      '`big = a`, then if `b > big` → `big = b`, then display big',
      'if `a > b` → display a, else display b',
      'if `b > a` → display b, else display a',
    ], answer: 0, hints: ['Dry run the first one: is 4 > 10?'], explain: 'In the first one the question is wrong: `4 > 10` is No, so big stays 4. It should ask `b > big`.' },
  },
  watch: [
    { title: 'Grade ladder', view: 'flow', intro: 'Diamonds in a chain: the first Yes wins, and the rest are skipped. Input 72.', code: GRADES, input: '72\n' },
    { title: 'Pass or fail — the edge value', view: 'flow', intro: '49 is the last failing mark. Try 50 as well.', code: prog(cpp`
    int marks;
    cin >> marks;
    if (marks >= 50) {
        cout << "Pass" << endl;
    } else {
        cout << "Fail, " << 50 - marks << " marks short" << endl;
    }`), input: '49\n' },
  ],
  think: {
    title: 'Ticket price by age',
    view: 'flow',
    problem: 'A zoo ticket is free for children under 5, Rs 200 for children under 12, and Rs 500 for everyone else. Read the age and display the price.',
    steps: [
      { text: 'Make boxes for the age and the price.', lines: [5] },
      { text: 'Input: read the age.', lines: [6] },
      { text: 'First question: is the age under 5? Yes → price = 0.', lines: [7] },
      { text: 'No → next question: is the age under 12? Yes → price = 200.', lines: [9] },
      { text: 'No again → price = 500.', lines: [12] },
      { text: 'All paths meet → display the price.', lines: [14] },
    ],
    code: prog(cpp`
    int age, price;
    cin >> age;
    if (age < 5) {
        price = 0;
    } else if (age < 12) {
        price = 200;
    } else {
        price = 500;
    }
    cout << "Ticket: Rs " << price << endl;`),
    input: '8\n',
    why: 'The second diamond sits on the **No** arrow of the first, so it only asks "under 12?" about people who are already 5 or older. Three prices → two diamonds → three paths.',
    yourTurn: {
      id: 'flow-decisions-think-trace',
      kind: 'trace',
      mode: 'vars',
      view: 'flow',
      prompt: 'Dry run the ticket flowchart for a `30`-year-old.',
      code: prog(cpp`
    int age, price;
    cin >> age;
    if (age < 5) {
        price = 0;
    } else if (age < 12) {
        price = 200;
    } else {
        price = 500;
    }
    cout << "Ticket: Rs " << price << endl;`),
      input: '30\n',
      vars: ['age', 'price'],
      hints: ['30 < 5? No. 30 < 12? No.'],
      explain: 'Both diamonds answer No, so the last box stores 500 → `Ticket: Rs 500`.',
    },
  },
  practice: [
    { id: 'flow-decisions-q1', kind: 'predict', view: 'flow', prompt: 'The user types `0`. What is displayed?', code: prog(cpp`
    int n;
    cin >> n;
    if (n > 0) {
        cout << "Positive" << endl;
    } else if (n < 0) {
        cout << "Negative" << endl;
    } else {
        cout << "Zero" << endl;
    }`), input: '0\n', hints: ['Is 0 > 0? Is 0 < 0?'], explain: 'Both questions answer No, so the last box runs: `Zero`.' },
    { id: 'flow-decisions-q2', kind: 'mcq', view: 'flow', prompt: 'Grade ladder: which input takes the **No** arrow at the first diamond and the **Yes** arrow at the second?', code: GRADES, input: '72\n', options: ['75', '85', '65', '40'], answer: 0, hints: ['No at `marks >= 80`, Yes at `marks >= 70`.'], explain: '75: not ≥ 80, but ≥ 70 → Grade B. 85 says Yes at the first diamond; 65 and 40 say No at both.' },
    { id: 'flow-decisions-q3', kind: 'trace', mode: 'vars', view: 'flow', prompt: 'Dry run "largest of three" for `5 12 8`.', code: LARGEST3, input: '5 12 8\n', vars: ['a', 'b', 'c'], hints: ['5 > 12? No → go to the right-hand diamond.', '12 > 8?'], explain: 'No, then Yes → `Largest: 12`.' },
    { id: 'flow-decisions-q4', kind: 'blanks', view: 'flow', prompt: 'Fill in the decision **Box 1** so the flowchart tells even from odd. Input `6` → `Even`.', code: prog(cpp`
    int n;
    cin >> n;
    if ([[1]]) {
        cout << "Even" << endl;
    } else {
        cout << "Odd" << endl;
    }`), blanks: [{ answers: ['n % 2 == 0', '0 == n % 2', 'n % 2 != 1'] }], chips: ['n', '%', '2', '==', '!=', '0'], input: '6\n', hints: ['Even numbers leave remainder 0 when divided by 2.', 'Use `==` to ask "is equal?".'], explain: '`n % 2 == 0` → the remainder is 0 → even.' },
    { id: 'flow-decisions-q5', kind: 'predict', view: 'flow', tag: 'tricky', prompt: 'The pass mark is 50. Ali got exactly `50`. What does this flowchart display?', code: prog(cpp`
    int marks;
    cin >> marks;
    if (marks > 50) {
        cout << "Pass" << endl;
    } else {
        cout << "Fail" << endl;
    }`), input: '50\n', hints: ['Is 50 *greater than* 50?'], explain: '`50 > 50` is No → `Fail`. The diamond should ask `marks >= 50 ?`. Always test the edge value.' },
    { id: 'flow-decisions-q6', kind: 'mcq', view: 'flow', prompt: 'How many different paths lead from Start to Stop in this flowchart?', code: LARGEST3, input: '4 9 2\n', options: ['4', '2', '3', '8'], answer: 0, hints: ['Count the output boxes: each path ends at a different one.'], explain: 'The first diamond gives 2 paths, and each meets one more diamond → 2 × 2 = 4 paths, one per output box.' },
    { id: 'flow-decisions-q7', kind: 'blanks', view: 'flow', prompt: 'Complete "largest of three": fill in the diamonds **Box 1** and **Box 2**. Input `3 7 5` → `Largest: 7`.', code: prog(cpp`
    int a, b, c;
    cin >> a >> b >> c;
    if ([[1]]) {
        if (a > c) {
            cout << "Largest: " << a << endl;
        } else {
            cout << "Largest: " << c << endl;
        }
    } else {
        if ([[2]]) {
            cout << "Largest: " << b << endl;
        } else {
            cout << "Largest: " << c << endl;
        }
    }`), blanks: [{ answers: ['a > b', 'b < a', 'a >= b'] }, { answers: ['b > c', 'c < b', 'b >= c'] }], chips: ['a', 'b', 'c', '>', '<'], input: '3 7 5\n', hints: ['The Yes path of Box 1 then compares a with c — so Box 1 must have found a bigger than b.', 'Box 2 decides between b and c.'], explain: 'Box 1: `a > b`. Box 2: `b > c`. For 3 7 5: No, then Yes → 7.' },
    { id: 'flow-decisions-q8', kind: 'predict', view: 'flow', tag: 'real life', prompt: 'A shop gives 10% off on bills of Rs 5000 or more. The bill is `6000`. What is displayed?', code: prog(cpp`
    int bill;
    cin >> bill;
    if (bill >= 5000) {
        bill = bill - bill / 10;
    }
    cout << "Pay Rs " << bill << endl;`), input: '6000\n', hints: ['6000 / 10 = 600.'], explain: 'Yes → bill = 6000 − 600 = 5400 → `Pay Rs 5400`.' },
  ],
  cheatsheet: [
    { code: 'n % 2 == 0 ?', text: 'even (Yes) or odd (No)' },
    { code: 'Diamond on a No arrow', text: 'a ladder: first Yes wins, the rest are skipped' },
    { code: '2 diamonds deep → 4 paths', text: 'test one input per path' },
    { code: '> vs >=', text: 'always test the edge value' },
  ],
};

// ------------------------------------------------------------------ Level 0.5: loops
const COUNT1N = prog(cpp`
    int n;
    cin >> n;
    int i = 1;
    while (i <= n) {
        cout << i << " ";
        i = i + 1;
    }`);

const SUM1N = prog(cpp`
    int n;
    cin >> n;
    int sum = 0;
    int i = 1;
    while (i <= n) {
        sum = sum + i;
        i = i + 1;
    }
    cout << "Sum = " << sum << endl;`);

const L5: Level = {
  id: 'flow-loops',
  kind: 'lesson',
  title: 'Loops: the arrow that goes back',
  tagline: 'Need to repeat a step 100 times? Do not draw 100 boxes — draw one arrow going back up to a diamond.',
  minutes: 25,
  objectives: [
    'Read a loop: start value, question, body, change, back arrow',
    'Draw loops for counting, sums, tables, factorials and reading until 0',
    'Predict how many times a box runs and how many times the diamond is asked',
  ],
  learn: [
    { t: 'p', text: 'A **loop** repeats boxes. After the last box of the body, an arrow goes **back up** to the diamond, which asks its question again. While the answer is **Yes**, the body runs again. When it is **No**, the flow leaves the loop and goes on down.' },
    { t: 'flow', title: 'Counting from 1 to n (input 5)', code: COUNT1N, input: '5\n' },
    { t: 'callout', tone: 'key', title: 'The four parts of a counting loop', text: '**Start value** `i = 1` (before the loop). **Question** `i <= n ?` (the diamond). **Body** `Display i` (the work). **Change** `i = i + 1` (moves i towards the end). Miss any one of them and the loop breaks.' },
    { t: 'table', head: ['Round', '`i`', '`i <= 3 ?`', 'Output so far'], rows: [
      ['1', '1', 'Yes', '`1 `'],
      ['2', '2', 'Yes', '`1 2 `'],
      ['3', '3', 'Yes', '`1 2 3 `'],
      ['—', '4', '**No** → leave', '`1 2 3 `'],
    ], caption: 'Dry run for `n = 3`: the body runs 3 times, but the diamond is asked **4** times — the last answer is the No that ends the loop.' },
    { t: 'flow', title: 'Sum of 1 to n (input 4)', code: SUM1N, input: '4\n' },
    { t: 'callout', tone: 'warn', title: 'The infinite loop', text: 'Forget the box `i = i + 1` and i stays 1 for ever. `1 <= 5 ?` is Yes every time, so the loop never ends and Stop is never reached. The algorithm is no longer **finite**. Always check: does something in the body move the loop towards a No?' },
    { t: 'h', text: 'How many times?' },
    { t: 'table', head: ['Start', 'Question', 'Body runs', 'Diamond asked'], rows: [
      ['`i = 1`', '`i <= n ?`', 'n times', 'n + 1 times'],
      ['`i = 0`', '`i < n ?`', 'n times', 'n + 1 times'],
      ['`i = 1`', '`i < n ?`', 'n − 1 times', 'n times'],
      ['`i = 0`', '`i <= n ?`', 'n + 1 times', 'n + 2 times'],
    ], caption: 'Off-by-one mistakes are the most common loop bug. Check the first and the last round by hand.' },
  ],
  ways: {
    goal: 'Display `1 2 3 4 5 `.',
    items: [
      { title: 'Start at 1, ask i <= 5', view: 'flow', code: prog(cpp`
    int i = 1;
    while (i <= 5) {
        cout << i << " ";
        i = i + 1;
    }`) },
      { title: 'Start at 1, ask i < 6', view: 'flow', code: prog(cpp`
    int i = 1;
    while (i < 6) {
        cout << i << " ";
        i = i + 1;
    }`), note: 'For whole numbers, `i < 6` and `i <= 5` are the same question.' },
      { title: 'Start at 0, add first', view: 'flow', code: prog(cpp`
    int i = 0;
    while (i < 5) {
        i = i + 1;
        cout << i << " ";
    }`), note: 'The change comes **before** the display, so start one lower.' },
      { title: 'Read the end from the user', view: 'flow', code: COUNT1N, input: '5\n', note: 'Now the same flowchart counts to any n.' },
    ],
    takeaway: 'Start value, question and change must fit together. Move one of them and you must adjust the others.',
    check: { id: 'flow-loops-ways-check', kind: 'mcq', prompt: 'Which loop does NOT display `1 2 3 4 5 `?', options: [
      '`i = 1`, ask `i < 5 ?`, display i, `i = i + 1`',
      '`i = 1`, ask `i <= 5 ?`, display i, `i = i + 1`',
      '`i = 0`, ask `i < 5 ?`, `i = i + 1`, display i',
      '`i = 1`, ask `i < 6 ?`, display i, `i = i + 1`',
    ], answer: 0, hints: ['Dry run the first one: when i is 5, what does `i < 5 ?` say?'], explain: '`5 < 5` is No, so the first loop stops after `1 2 3 4 ` — an off-by-one mistake.' },
  },
  watch: [
    { title: 'Multiplication table', view: 'flow', intro: 'The same Display box runs 10 times, with a different i each time.', code: prog(cpp`
    int n;
    cin >> n;
    int i = 1;
    while (i <= 10) {
        cout << n << " x " << i << " = " << n * i << endl;
        i = i + 1;
    }`), input: '7\n' },
    { title: 'Factorial: 5! = 1 × 2 × 3 × 4 × 5', view: 'flow', intro: 'Like a sum, but start at 1 and multiply.', code: prog(cpp`
    int n;
    cin >> n;
    int fact = 1;
    int i = 1;
    while (i <= n) {
        fact = fact * i;
        i = i + 1;
    }
    cout << n << "! = " << fact << endl;`), input: '5\n' },
    { title: 'Read numbers until 0', view: 'flow', intro: 'We do not know how many numbers will come. The value 0 means "I am finished" — it is not added.', code: prog(cpp`
    int x;
    int sum = 0;
    cin >> x;
    while (x != 0) {
        sum = sum + x;
        cin >> x;
    }
    cout << "Total = " << sum << endl;`), input: '4 7 2 0\n' },
  ],
  think: {
    title: 'Average of n marks',
    view: 'flow',
    problem: 'Read how many students there are (`n`), then read each student\'s marks, and display the average.',
    steps: [
      { text: 'Read n.', lines: [6] },
      { text: 'Start the total at 0 and the counter at 1.', lines: [7, 8] },
      { text: 'Loop question: have we read fewer than n marks? (`i <= n ?`)', lines: [9] },
      { text: 'Body: read one mark …', lines: [10] },
      { text: '… add it to the total …', lines: [11] },
      { text: '… and count it. Then go back to the question.', lines: [12] },
      { text: 'After the loop: display total ÷ n.', lines: [14] },
    ],
    code: prog(cpp`
    int n, m;
    cin >> n;
    int sum = 0;
    int i = 1;
    while (i <= n) {
        cin >> m;
        sum = sum + m;
        i = i + 1;
    }
    cout << "Average = " << sum / n << endl;`),
    input: '3 70 80 90\n',
    why: 'The input box sits **inside** the loop, so it runs n times and reads a new mark each round. The total must start at 0 **before** the loop — inside, it would be reset every round.',
    yourTurn: {
      id: 'flow-loops-think-trace',
      kind: 'trace',
      mode: 'vars',
      view: 'flow',
      prompt: 'Dry run for 2 students with marks `45` and `55`.',
      code: prog(cpp`
    int n, m;
    cin >> n;
    int sum = 0;
    int i = 1;
    while (i <= n) {
        cin >> m;
        sum = sum + m;
        i = i + 1;
    }
    cout << "Average = " << sum / n << endl;`),
      input: '2 45 55\n',
      vars: ['n', 'm', 'sum', 'i'],
      given: [0],
      hints: ['The diamond is asked 3 times: Yes, Yes, No.', 'sum: 0 → 45 → 100.'],
      explain: 'sum = 100, and 100 / 2 = 50 → `Average = 50`.',
    },
  },
  practice: [
    { id: 'flow-loops-q1', kind: 'count', view: 'flow', prompt: 'How many times does the highlighted **Display** box run?', code: prog(cpp`
    int i = 1;
    while (i <= 6) {
        cout << "*";
        i = i + 1;
    }`), count: { line: 7 }, hints: ['i takes the values 1, 2, 3, … Which is the last one that says Yes?'], explain: 'i = 1, 2, 3, 4, 5, 6 → Yes. i = 7 → No. The box runs **6** times: `******`.' },
    { id: 'flow-loops-q2', kind: 'count', view: 'flow', tag: 'tricky', prompt: 'How many times is the highlighted **diamond** asked its question?', code: prog(cpp`
    int i = 0;
    while (i < 4) {
        cout << i;
        i = i + 1;
    }`), count: { checks: 6 }, hints: ['The body runs for i = 0, 1, 2, 3.', 'Do not forget the last question — the one that answers No.'], explain: 'Four Yes answers (i = 0, 1, 2, 3) and one No (i = 4): **5** times. The diamond is always asked once more than the body runs.' },
    { id: 'flow-loops-q3', kind: 'trace', mode: 'vars', view: 'flow', prompt: 'Dry run the factorial flowchart for `n = 3`.', code: prog(cpp`
    int n;
    cin >> n;
    int fact = 1;
    int i = 1;
    while (i <= n) {
        fact = fact * i;
        i = i + 1;
    }
    cout << fact << endl;`), input: '3\n', vars: ['fact', 'i'], hints: ['fact: 1 → 1 × 1 → 1 × 2 → 2 × 3.'], explain: 'fact = 1, 2, 6 and i = 2, 3, 4. When i is 4, `4 <= 3` is No. Output `6`.' },
    { id: 'flow-loops-q4', kind: 'predict', view: 'flow', prompt: 'The user types `5`. What is displayed?', code: SUM1N, input: '5\n', hints: ['1 + 2 + 3 + 4 + 5'], explain: 'sum = 15 → `Sum = 15`.' },
    { id: 'flow-loops-q5', kind: 'blanks', view: 'flow', prompt: 'Complete the counting loop: fill in the diamond **Box 1** and the change **Box 2**. Input `4` → `1 2 3 4 `.', code: prog(cpp`
    int n;
    cin >> n;
    int i = 1;
    while ([[1]]) {
        cout << i << " ";
        [[2]];
    }`), blanks: [{ answers: ['i <= n', 'i < n + 1', 'n >= i'] }, { answers: ['i = i + 1', 'i++', 'i += 1', '++i'] }], chips: ['i', 'n', '<=', '<', '=', '+', '1'], input: '4\n', hints: ['Keep going while i has not passed n.', 'i must grow by 1 each round.'], explain: 'Box 1: `i <= n`. Box 2: `i = i + 1`.' },
    { id: 'flow-loops-q6', kind: 'mcq', tag: 'tricky', prompt: 'A flowchart counts from 1 to 5, but the student forgot the box `i = i + 1`. What happens?', options: ['It displays 1 again and again for ever — an infinite loop', 'It displays 1 2 3 4 5', 'It displays nothing', 'It displays 1 once and stops'], answer: 0, hints: ['i never changes. What does `1 <= 5 ?` say every time?'], explain: 'i stays 1, so the diamond answers Yes for ever. The algorithm never reaches Stop.' },
    { id: 'flow-loops-q7', kind: 'count', view: 'flow', tag: 'real life', prompt: 'Rs 100 in a scheme that doubles your money every year. How many times does the highlighted box run before the money reaches Rs 1000?', code: prog(cpp`
    int money = 100;
    int years = 0;
    while (money < 1000) {
        money = money * 2;
        years = years + 1;
    }
    cout << years << " years, Rs " << money << endl;`), count: { line: 8 }, hints: ['100 → 200 → 400 → …', 'Stop asking when the money is 1000 or more.'], explain: '100 → 200 → 400 → 800 → 1600: the box runs **4** times. Output: `4 years, Rs 1600`.' },
    { id: 'flow-loops-q8', kind: 'predict', view: 'flow', tag: 'tricky', prompt: 'The user types `5 3 0 8`. What is displayed?', code: prog(cpp`
    int x;
    int sum = 0;
    cin >> x;
    while (x != 0) {
        sum = sum + x;
        cin >> x;
    }
    cout << "Total = " << sum << endl;`), input: '5 3 0 8\n', hints: ['What happens when the 0 is read?'], explain: '5 and 3 are added. Then 0 is read, `0 != 0 ?` is No, and the loop ends. The 8 is never read: `Total = 8`.' },
  ],
  cheatsheet: [
    { code: 'i = 1 → i <= n ? → body → i = i + 1 → back', text: 'the counting loop' },
    { code: 'sum = 0 before the loop', text: 'a total starts at 0 (a product at 1)' },
    { code: 'body n times, diamond n + 1 times', text: 'the last question is the No' },
    { code: 'no change in the body', text: 'infinite loop — never reaches Stop' },
  ],
};

// ------------------------------------------------------------------ Level 0.6: tracing & completing
const SQRT = prog(cpp`
    int num;
    cin >> num;
    int i = 0;
    while ((i + 1) * (i + 1) <= num) {
        i = i + 1;
    }
    cout << "Nearest square root: " << i << endl;`);

const DIGSUM = prog(cpp`
    int n, d;
    cin >> n;
    int sum = 0;
    while (n > 0) {
        d = n % 10;
        sum = sum + d;
        n = n / 10;
    }
    cout << "Sum of digits = " << sum << endl;`);

const LARGEST_LIST = prog(cpp`
    int n, x;
    cin >> n;
    cin >> x;
    int big = x;
    int i = 1;
    while (i < n) {
        cin >> x;
        if (x > big) {
            big = x;
        }
        i = i + 1;
    }
    cout << "Largest: " << big << endl;`);

const T6: Level = {
  id: 'flow-trace',
  kind: 'lesson',
  title: 'Tracing and completing flowcharts',
  tagline: 'Exam style: a flowchart with empty boxes, or "what is the output for this input?". A neat dry-run table answers both.',
  minutes: 30,
  objectives: [
    'Dry-run a loop flowchart in a table without losing track',
    'Use `% 10` and `/ 10` to work with the digits of a number',
    'Fill in the missing process and decision boxes of a flowchart',
  ],
  learn: [
    { t: 'p', text: 'University exams love two kinds of flowchart questions: **"state the output for input …"** and **"complete the flowchart by filling in the missing steps"**. Both are solved the same way: a careful dry run.' },
    { t: 'callout', tone: 'key', title: 'How to dry-run on paper', text: '1. Make a column for every variable, one for the diamond\'s answer, and one for the output. 2. Follow the arrows, one box at a time. 3. Write a new value only when it changes, and cross out the old one in your head. 4. At every diamond, put in the **current** values and write Yes or No.' },
    { t: 'flow', title: 'Nearest square root without a calculator (input 20)', code: SQRT, input: '20\n' },
    { t: 'table', head: ['`i`', '`(i + 1) * (i + 1)`', '`<= 20 ?`'], rows: [
      ['0', '1', 'Yes → i = 1'],
      ['1', '4', 'Yes → i = 2'],
      ['2', '9', 'Yes → i = 3'],
      ['3', '16', 'Yes → i = 4'],
      ['4', '25', '**No** → display 4'],
    ], caption: 'Keep making i bigger while the **next** square still fits into num. 4 × 4 = 16 ≤ 20 but 5 × 5 = 25 > 20, so the answer is 4.' },
    { t: 'h', text: 'Working with digits' },
    { t: 'table', head: ['Box', 'For n = 472', 'Meaning'], rows: [
      ['`d = n % 10`', '`2`', 'the last digit'],
      ['`n = n / 10`', '`47`', 'drop the last digit'],
      ['`n > 0 ?`', 'Yes, until n becomes 0', 'are there digits left?'],
    ] },
    { t: 'flow', title: 'Sum of digits (input 472)', code: DIGSUM, input: '472\n' },
    { t: 'callout', tone: 'tip', title: 'Filling in a missing box', text: 'Ask two questions. **What must change every round?** (or the loop never ends — usually `i = i + 1` or `n = n / 10`). **What decides when to stop?** (the diamond). Then dry run your answer with a small input to check it.' },
  ],
  ways: {
    goal: 'Count the digits of `4096` (→ `4`).',
    items: [
      { title: 'Chop digits while n > 0', view: 'flow', code: prog(cpp`
    int n;
    cin >> n;
    int count = 0;
    while (n > 0) {
        n = n / 10;
        count = count + 1;
    }
    cout << count;`), input: '4096\n' },
      { title: 'Chop digits while n != 0', view: 'flow', code: prog(cpp`
    int n;
    cin >> n;
    int count = 0;
    while (n != 0) {
        n = n / 10;
        count = count + 1;
    }
    cout << count;`), input: '4096\n' },
      { title: 'Start the count at 1', view: 'flow', code: prog(cpp`
    int n;
    cin >> n;
    int count = 1;
    while (n >= 10) {
        n = n / 10;
        count = count + 1;
    }
    cout << count;`), input: '4096\n', note: 'Every number has at least one digit; add one more for every extra digit.' },
      { title: 'Body first, question after', view: 'flow', code: prog(cpp`
    int n;
    cin >> n;
    int count = 0;
    do {
        n = n / 10;
        count = count + 1;
    } while (n > 0);
    cout << count;`), input: '4096\n', note: 'Here the diamond comes **after** the body, so the body always runs at least once.' },
    ],
    takeaway: 'All four count 4 digits for 4096. They differ only for `n = 0`: ways 1 and 2 say 0 digits, ways 3 and 4 say 1 digit. Edge values again!',
    check: { id: 'flow-trace-ways-check', kind: 'mcq', prompt: 'For `n = 0`, which ways display **0** (and not 1)?', options: ['Ways 1 and 2', 'Ways 3 and 4', 'Ways 1 and 3', 'All four'], answer: 0, hints: ['In ways 1 and 2 the diamond is asked before the body. What does it say for 0?'], explain: 'Ways 1 and 2 ask first and say No at once, so count stays 0. Way 3 starts at 1; way 4 runs the body once before asking.' },
  },
  watch: [
    { title: 'Largest in a list', view: 'flow', intro: 'Read how many numbers, then keep the biggest seen so far. Input: 5 numbers — 12 7 30 9 4.', code: LARGEST_LIST, input: '5 12 7 30 9 4\n' },
    { title: 'Reverse a number', view: 'flow', intro: 'Take the last digit off n and stick it on the end of rev.', code: prog(cpp`
    int n, d;
    cin >> n;
    int rev = 0;
    while (n > 0) {
        d = n % 10;
        rev = rev * 10 + d;
        n = n / 10;
    }
    cout << "Reversed: " << rev << endl;`), input: '123\n' },
  ],
  think: {
    title: 'Count the digits',
    view: 'flow',
    problem: 'Read a positive whole number and display how many digits it has.',
    steps: [
      { text: 'Read n.', lines: [6] },
      { text: 'No digits counted yet: count = 0.', lines: [7] },
      { text: 'Are there digits left? (`n > 0 ?`)', lines: [8] },
      { text: 'Yes → chop off the last digit …', lines: [9] },
      { text: '… and count it. Back to the question.', lines: [10] },
      { text: 'No → display the count.', lines: [12] },
    ],
    code: prog(cpp`
    int n;
    cin >> n;
    int count = 0;
    while (n > 0) {
        n = n / 10;
        count = count + 1;
    }
    cout << "Digits: " << count << endl;`),
    input: '4096\n',
    why: '`n = n / 10` is the change that moves the loop towards the end: every round n loses one digit, so it must reach 0.',
    yourTurn: {
      id: 'flow-trace-think-trace',
      kind: 'trace',
      mode: 'vars',
      view: 'flow',
      prompt: 'Dry run for `n = 385`.',
      code: prog(cpp`
    int n;
    cin >> n;
    int count = 0;
    while (n > 0) {
        n = n / 10;
        count = count + 1;
    }
    cout << "Digits: " << count << endl;`),
      input: '385\n',
      vars: ['n', 'count'],
      hints: ['n: 385 → 38 → 3 → 0.'],
      explain: 'Three rounds, so count = 3 → `Digits: 3`.',
    },
  },
  practice: [
    { id: 'flow-trace-q1', kind: 'blanks', view: 'flow', tag: 'exam', prompt: 'Complete the "nearest square root" flowchart. Fill in the diamond **Box 1** and the process **Box 2**. Input `30` → `5`.', code: prog(cpp`
    int num;
    cin >> num;
    int i = 0;
    while ([[1]]) {
        [[2]];
    }
    cout << i << endl;`), blanks: [{ answers: ['(i + 1) * (i + 1) <= num', '(i+1)*(i+1) <= num', 'num >= (i + 1) * (i + 1)'] }, { answers: ['i = i + 1', 'i++', 'i += 1', '++i'] }], chips: ['i', 'num', '(', ')', '+', '*', '<=', '=', '1'], input: '30\n', hints: ['Keep going while the **next** square, (i + 1) × (i + 1), still fits into num.', 'The box inside the loop moves i on by 1.'], explain: 'Box 1: `(i + 1) * (i + 1) <= num`. Box 2: `i = i + 1`. For 30: 1, 4, 9, 16, 25 fit, 36 does not → `5`.' },
    { id: 'flow-trace-q2', kind: 'trace', mode: 'vars', view: 'flow', prompt: 'Dry run "sum of digits" for `305`.', code: DIGSUM, input: '305\n', vars: ['n', 'd', 'sum'], hints: ['305 % 10 = 5, 305 / 10 = 30.', 'Then 30 % 10 = 0.'], explain: 'd = 5, 0, 3 → sum = 5, 5, 8; n = 30, 3, 0 → `Sum of digits = 8`.' },
    { id: 'flow-trace-q3', kind: 'blanks', view: 'flow', prompt: 'Complete "sum of digits": fill in **Box 1** (take the last digit) and **Box 2** (drop the last digit). Input `4213` → `10`.', code: prog(cpp`
    int n, d;
    cin >> n;
    int sum = 0;
    while (n > 0) {
        [[1]];
        sum = sum + d;
        [[2]];
    }
    cout << sum << endl;`), blanks: [{ answers: ['d = n % 10'] }, { answers: ['n = n / 10', 'n /= 10'] }], chips: ['d', 'n', '=', '%', '/', '10'], input: '4213\n', hints: ['The last digit is the remainder after dividing by 10.', 'Whole division by 10 removes the last digit.'], explain: 'Box 1: `d = n % 10`. Box 2: `n = n / 10`. 3 + 1 + 2 + 4 = 10.' },
    { id: 'flow-trace-q4', kind: 'count', view: 'flow', tag: 'tricky', prompt: 'Input: 5 numbers — `3 8 2 9 1`. How many times does the highlighted box `big = x` run?', code: LARGEST_LIST, input: '5 3 8 2 9 1\n', count: { line: 13 }, hints: ['big starts as 3 (the first number, stored before the loop).', 'Which of 8, 2, 9, 1 is bigger than the biggest so far?'], explain: '8 > 3 → Yes (big = 8). 2 → No. 9 > 8 → Yes (big = 9). 1 → No. **2** times.' },
    { id: 'flow-trace-q5', kind: 'predict', view: 'flow', tag: 'tricky', prompt: 'Reverse a number. The user types `1200`. What is displayed?', code: prog(cpp`
    int n, d;
    cin >> n;
    int rev = 0;
    while (n > 0) {
        d = n % 10;
        rev = rev * 10 + d;
        n = n / 10;
    }
    cout << rev << endl;`), input: '1200\n', hints: ['The first two digits taken off are 0 and 0.', 'rev: 0 → 0 → 2 → 21'], explain: 'd = 0, 0, 2, 1 → rev = 0, 0, 2, 21. Zeros at the front of a number are not shown: `21`.' },
    { id: 'flow-trace-q6', kind: 'count', view: 'flow', prompt: 'The user types `12345`. How many times is the highlighted diamond asked?', code: prog(cpp`
    int n;
    cin >> n;
    int count = 0;
    while (n > 0) {
        n = n / 10;
        count = count + 1;
    }
    cout << count << endl;`), input: '12345\n', count: { checks: 8 }, hints: ['One Yes per digit …', '… plus the final No.'], explain: '5 Yes answers (one per digit) + 1 No = **6**.' },
    { id: 'flow-trace-q7', kind: 'blanks', view: 'flow', prompt: 'Complete "largest in a list": fill in the diamond **Box 1** and the process **Box 2**. Input: 4 numbers — `6 2 9 5` → `9`.', code: prog(cpp`
    int n, x;
    cin >> n;
    cin >> x;
    int big = x;
    int i = 1;
    while (i < n) {
        cin >> x;
        if ([[1]]) {
            [[2]];
        }
        i = i + 1;
    }
    cout << big << endl;`), blanks: [{ answers: ['x > big', 'big < x', 'x >= big'] }, { answers: ['big = x'] }], chips: ['x', 'big', '>', '<', '='], input: '4 6 2 9 5\n', hints: ['Is the new number bigger than the biggest so far?', 'If yes, it becomes the new biggest.'], explain: 'Box 1: `x > big`. Box 2: `big = x`.' },
    { id: 'flow-trace-q8', kind: 'predict', view: 'flow', tag: 'tricky', prompt: 'A mystery flowchart. The user types `6`. What is displayed?', code: prog(cpp`
    int n;
    cin >> n;
    cout << n;
    while (n > 1) {
        if (n % 2 == 0) {
            n = n / 2;
        } else {
            n = 3 * n + 1;
        }
        cout << " " << n;
    }
    cout << endl;`), input: '6\n', hints: ['Even → halve it. Odd → 3n + 1.', '6 → 3 → 10 → …'], explain: '6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1. Output: `6 3 10 5 16 8 4 2 1`.' },
  ],
  cheatsheet: [
    { code: 'd = n % 10,  n = n / 10', text: 'take the last digit / drop the last digit' },
    { code: '(i + 1) * (i + 1) <= num ?', text: 'nearest square root: does the next square still fit?' },
    { code: 'big = first; if x > big → big = x', text: 'largest in a list' },
    { code: 'Missing box?', text: 'what must change every round, and what decides when to stop' },
  ],
};

// ------------------------------------------------------------------ Level 0.7: flowchart → C++
const SUM_CODE = SUM2;

const EVEN_CODE = prog(cpp`
    int n;
    cin >> n;
    if (n % 2 == 0) {
        cout << "Even" << endl;
    } else {
        cout << "Odd" << endl;
    }`);

const C7: Level = {
  id: 'flow-to-code',
  kind: 'lesson',
  title: 'From flowchart to C++',
  tagline: 'Every box becomes one line of C++. Once you can draw the flowchart, the program almost writes itself.',
  minutes: 25,
  objectives: [
    'Turn each flowchart symbol into its line of C++',
    'Choose `if … else` for a diamond whose paths meet, `while` for a diamond with a back arrow',
    'Read a short C++ program and see the flowchart inside it',
  ],
  learn: [
    { t: 'p', text: 'Now the big step: the language a computer understands. **C++** is written as lines of text, but each line is just one of the boxes you already know. Unit 1 explains every word — here you only need to see that flowchart and code are the **same algorithm**.' },
    { t: 'table', head: ['Box in the flowchart', 'Line of C++'], rows: [
      ['Oval **Start** … **Stop**', '`int main() {` … `return 0; }`'],
      ['Rectangle `Declare a, b`', '`int a, b;`  (`int` = whole numbers, `double` = decimals)'],
      ['Parallelogram `Input a, b`', '`cin >> a >> b;`'],
      ['Rectangle `sum = a + b`', '`sum = a + b;`  (every instruction ends with `;`)'],
      ['Parallelogram `Display "Sum = ", sum`', '`cout << "Sum = " << sum;`'],
      ['Diamond whose Yes and No paths **meet below**', '`if (condition) { Yes boxes } else { No boxes }`'],
      ['Diamond with a **back arrow**', '`while (condition) { body boxes }`'],
    ] },
    { t: 'flowchart', code: SUM_CODE, caption: 'The flowchart of "sum of two numbers" …' },
    { t: 'anatomy', code: SUM_CODE, notes: [
      { lines: [1, 2], label: 'Setup', text: 'Every program starts with these two lines. They are not boxes — they switch on `cin` and `cout`.' },
      { lines: [4], label: 'Start', text: 'The oval Start becomes `int main() {`: the algorithm begins here.' },
      { lines: [5], label: 'Declare a, b', text: 'Make two boxes in memory for whole numbers.' },
      { lines: [6], label: 'Input a, b', text: '`cin >>` reads what the user types into a and b.' },
      { lines: [7], label: 'sum = a + b', text: 'The process box, word for word, with a `;` at the end.' },
      { lines: [8], label: 'Display', text: '`cout <<` shows text and values. `endl` moves to a new line.' },
      { lines: [9, 10], label: 'Stop', text: '`return 0;` and the closing `}` are the oval Stop.' },
    ] },
    { t: 'callout', tone: 'key', title: 'if or while?', text: 'Look at the arrows leaving the diamond. If both go **down** and meet again → `if … else`. If one arrow comes **back up** to the diamond → `while`. The boxes on the Yes path go inside the `{ }`.' },
    { t: 'compare', items: [
      { title: 'Diamond with a back arrow written as if', good: false, code: prog(cpp`
    int i = 1;
    if (i <= 3) {
        cout << i << " ";
        i = i + 1;
    }`), note: 'Prints only `1 ` — an `if` asks once and never goes back.' },
      { title: 'Written as while', good: true, code: prog(cpp`
    int i = 1;
    while (i <= 3) {
        cout << i << " ";
        i = i + 1;
    }`), note: 'Prints `1 2 3 ` — `while` goes back to the question after the body.' },
    ] },
    { t: 'viz', title: 'The same algorithm, now running as C++ (input 8 and 5)', code: SUM_CODE, input: '8 5\n' },
  ],
  ways: {
    goal: 'Even or odd (`7` → `Odd`) — as flowcharts and as C++ code.',
    items: [
      { title: 'Flowchart: ask "remainder 0?"', view: 'flow', code: EVEN_CODE, input: '7\n' },
      { title: 'The same as C++', code: EVEN_CODE, input: '7\n', note: 'Diamond → `if (n % 2 == 0)`. Yes path → first `{ }`. No path → `else { }`.' },
      { title: 'Flowchart: ask "remainder 1?"', view: 'flow', code: prog(cpp`
    int n;
    cin >> n;
    if (n % 2 == 1) {
        cout << "Odd" << endl;
    } else {
        cout << "Even" << endl;
    }`), input: '7\n' },
      { title: 'The same as C++', code: prog(cpp`
    int n;
    cin >> n;
    if (n % 2 == 1) {
        cout << "Odd" << endl;
    } else {
        cout << "Even" << endl;
    }`), input: '7\n', note: 'Swapping the question swaps what goes inside the two `{ }` blocks.' },
    ],
    takeaway: 'Flowchart and code are two ways of writing one algorithm. Draw first when the problem is new; write code straight away when it is easy.',
    check: { id: 'flow-to-code-ways-check', kind: 'mcq', prompt: 'Which line of C++ matches the parallelogram `Input marks`?', options: ['`cin >> marks;`', '`cout << marks;`', '`marks = input;`', '`int marks;`'], answer: 0, hints: ['cin reads, cout shows.'], explain: '`cin >> marks;` reads a value into marks. `cout` is for Display boxes, and `int marks;` is the Declare box.' },
  },
  watch: [
    { title: 'Sum of 1 to n — as a flowchart', view: 'flow', intro: 'First the picture you know …', code: SUM1N, input: '4\n' },
    { title: '… and the same program as C++', intro: 'Now watch the same steps in code: the diamond is the `while` line, the back arrow is the closing `}`.', code: SUM1N, input: '4\n' },
    { title: 'Grade ladder as C++', intro: 'Each diamond on a No arrow becomes `else if`.', code: GRADES, input: '65\n' },
  ],
  think: {
    title: 'Nearest square root: flowchart → code',
    problem: 'Turn the "nearest square root" flowchart (Level *Tracing*) into C++: read num, start i at 0, keep adding 1 to i while `(i + 1) × (i + 1)` still fits into num, then display i.',
    steps: [
      { text: 'Declare box → `int num;`', lines: [5] },
      { text: 'Input box → `cin >> num;`', lines: [6] },
      { text: 'Process box `i = 0` → `int i = 0;`', lines: [7] },
      { text: 'Diamond with a back arrow → `while (…) {`', lines: [8] },
      { text: 'The box on the Yes path → inside the `{ }`', lines: [9] },
      { text: 'The back arrow → the closing `}`', lines: [10] },
      { text: 'Display box on the No path → `cout << i;`', lines: [11] },
    ],
    code: SQRT,
    input: '50\n',
    why: 'One box, one line. The only new things are the `{ }` that show which boxes are inside the loop, and the `;` after every instruction.',
    yourTurn: {
      id: 'flow-to-code-think-trace',
      kind: 'trace',
      mode: 'vars',
      prompt: 'Dry run the C++ program for `num = 10`.',
      code: SQRT,
      input: '10\n',
      vars: ['num', 'i'],
      hints: ['(0+1)² = 1, (1+1)² = 4, (2+1)² = 9, (3+1)² = 16.'],
      explain: '1, 4 and 9 fit into 10; 16 does not. i = 3 → `Nearest square root: 3`.',
    },
  },
  practice: [
    { id: 'flow-to-code-q1', kind: 'mcq', prompt: 'A diamond has an arrow that goes **back up** to it. Which C++ word do you use?', options: ['`while`', '`if`', '`else`', '`cout`'], answer: 0, hints: ['Which one repeats?'], explain: 'A back arrow means *repeat* → `while`. `if` asks only once.' },
    { id: 'flow-to-code-q2', kind: 'mcq', view: 'flow', prompt: 'Which C++ line is the box `fact = fact * i`?', code: prog(cpp`
    int n;
    cin >> n;
    int fact = 1;
    int i = 1;
    while (i <= n) {
        fact = fact * i;
        i = i + 1;
    }
    cout << fact << endl;`), input: '4\n', options: ['`fact = fact * i;`', '`cout << fact * i;`', '`cin >> fact;`', '`while (fact * i) {`'], answer: 0, hints: ['A rectangle is copied word for word.'], explain: 'A process box is the same text with `;` at the end.' },
    { id: 'flow-to-code-q3', kind: 'mcq', view: 'flow', prompt: 'Which C++ code matches this flowchart?', code: prog(cpp`
    int t;
    cin >> t;
    if (t > 40) {
        cout << "Hot";
    }
    cout << "!";`), input: '45\n', options: [
      '`cin >> t; if (t > 40) { cout << "Hot"; } cout << "!";`',
      '`cin >> t; while (t > 40) { cout << "Hot"; } cout << "!";`',
      '`cin >> t; if (t > 40) { cout << "Hot"; cout << "!"; }`',
      '`cout << t; if (t > 40) { cin >> "Hot"; } cout << "!";`',
    ], answer: 0, hints: ['No back arrow → `if`.', 'Is `Display "!"` on the Yes path, or after the paths meet?'], explain: 'The diamond\'s paths meet again, so it is an `if`. `Display "!"` comes after they meet, so it is outside the `{ }`.' },
    { id: 'flow-to-code-q4', kind: 'parsons', prompt: 'Put the lines in order to turn the flowchart Start → `Declare a, b` → `Input a, b` → `sum = a + b` → `Display sum` → Stop into C++. Input `4 6` → `10`.', lines: [
      '#include <iostream>',
      'using namespace std;',
      'int main() {',
      '    int a, b, sum;',
      '    cin >> a >> b;',
      '    sum = a + b;',
      '    cout << sum;',
      '    return 0;',
      '}',
    ], distractors: ['    cout >> sum;', '    cin << a << b;'], input: '4 6\n', hints: ['The boxes go in the same order as the flowchart.', '`cin >>` reads, `cout <<` displays — look at the arrows.'], explain: 'Setup lines, then `int main() {` (Start), then one line per box, then `return 0; }` (Stop).' },
    { id: 'flow-to-code-q5', kind: 'blanks', prompt: 'Turn the countdown flowchart (`Input n` → diamond `n > 0 ?` → `Display n` → `n = n - 1` → back) into C++. Input `3` → `3 2 1 `.', code: prog(cpp`
    int n;
    [[1]] >> n;
    [[2]] (n > 0) {
        cout << n << " ";
        n = n - 1;
    }`), blanks: [{ answers: ['cin'] }, { answers: ['while'] }], chips: ['cin', 'cout', 'while', 'if'], input: '3\n', hints: ['Input box → which word?', 'The diamond has a back arrow.'], explain: '`cin >> n;` for the input box, `while` for the diamond with a back arrow.' },
    { id: 'flow-to-code-q6', kind: 'bug', prompt: 'A student turned the "display 1 to 3" flowchart into code, but it displays only `1`. Which line is wrong?', code: prog(cpp`
    int i = 1;
    if (i <= 3) {
        cout << i << " ";
        i = i + 1;
    }`), bugLine: 6, options: ['The diamond has a back arrow, so line 6 must be `while`, not `if`', 'Line 5 should be `i = 0`', 'Line 7 should use `cin`', 'Line 8 should be `i = i - 1`'], answer: 0, fixed: prog(cpp`
    int i = 1;
    while (i <= 3) {
        cout << i << " ";
        i = i + 1;
    }`), hints: ['An `if` asks its question only once.'], explain: 'A loop in a flowchart becomes `while`, which goes back to the question after every round.' },
    { id: 'flow-to-code-q7', kind: 'trace', mode: 'vars', prompt: 'The "sum of digits" flowchart, now as C++. Dry run it for `57`.', code: DIGSUM, input: '57\n', vars: ['n', 'd', 'sum'], hints: ['57 % 10 = 7, 57 / 10 = 5.'], explain: 'd = 7, sum = 7, n = 5; d = 5, sum = 12, n = 0 → `Sum of digits = 12`.' },
    { id: 'flow-to-code-q8', kind: 'predict', tag: 'tricky', prompt: 'A student wrote the input box with the arrows the wrong way round. What does the program display — or does it not compile?', code: prog(cpp`
    int n;
    cin << n;
    cout << n * 2;`), hints: ['`cin` reads with `>>` (the arrows point into the variable).'], explain: 'It does **not compile**: line 6 must be `cin >> n;`. With `cin`, the arrows point *into* the variable; with `cout`, they point *out* to the screen.' },
  ],
  cheatsheet: [
    { code: 'Start / Stop', text: '`int main() {` … `return 0; }`' },
    { code: 'Input x / Display x', text: '`cin >> x;` / `cout << x;`' },
    { code: 'x = … (rectangle)', text: 'the same text plus `;`' },
    { code: 'diamond: paths meet / back arrow', text: '`if (…) { } else { }` / `while (…) { }`' },
  ],
};

// ------------------------------------------------------------------ Checkpoint
const CP: Level = {
  id: 'checkpoint-flowcharts',
  kind: 'revision',
  title: 'Flowcharts',
  tagline: '**Checkpoint 0.** Read, trace, count and complete flowcharts — bills, tickets, ATMs and grades. Then try the gold exam box.',
  minutes: 35,
  objectives: [
    'Dry-run sequence, decision and loop flowcharts for any input',
    'Count how many times a box runs',
    'Fill in the missing boxes of a flowchart',
  ],
  practice: [
    { id: 'checkpoint-flowcharts-q1', kind: 'mcq', prompt: 'In a flowchart for a shop, which symbol is used for the box `Display bill`?', options: ['Parallelogram', 'Rectangle', 'Diamond', 'Oval'], answer: 0, hints: ['Input and output share a shape.'], explain: 'Showing something to the user is output → parallelogram.' },
    { id: 'checkpoint-flowcharts-q2', kind: 'predict', view: 'flow', tag: 'real life', prompt: 'Electricity bill: the first 100 units cost Rs 10 each, the next 100 cost Rs 15 each, and every unit above 200 costs Rs 20. The user types `250`. What is displayed?', code: prog(cpp`
    int units, bill;
    cin >> units;
    if (units <= 100) {
        bill = units * 10;
    } else if (units <= 200) {
        bill = 1000 + (units - 100) * 15;
    } else {
        bill = 2500 + (units - 200) * 20;
    }
    cout << "Bill: Rs " << bill << endl;`), input: '250\n', hints: ['250 <= 100? No. 250 <= 200? No.', '2500 + 50 × 20'], explain: 'Both diamonds say No → `bill = 2500 + 50 × 20 = 3500` → `Bill: Rs 3500`.' },
    { id: 'checkpoint-flowcharts-q3', kind: 'trace', mode: 'vars', view: 'flow', tag: 'real life', prompt: 'Cinema ticket: children under 12 pay Rs 300, people aged 60 or more pay Rs 400, everyone else pays Rs 800. Dry run for age `65`.', code: prog(cpp`
    int age, price;
    cin >> age;
    if (age < 12) {
        price = 300;
    } else if (age >= 60) {
        price = 400;
    } else {
        price = 800;
    }
    cout << "Rs " << price << endl;`), input: '65\n', vars: ['age', 'price'], hints: ['65 < 12? No.', '65 >= 60? Yes.'], explain: 'No, then Yes → price = 400 → `Rs 400`.' },
    { id: 'checkpoint-flowcharts-q4', kind: 'count', view: 'flow', tag: 'real life', prompt: 'ATM: the balance is Rs 5000 and a machine keeps withdrawing Rs 1500 while there is enough money. How many times does the highlighted withdraw box run?', code: prog(cpp`
    int balance = 5000;
    int times = 0;
    while (balance >= 1500) {
        balance = balance - 1500;
        times = times + 1;
    }
    cout << times << " withdrawals, Rs " << balance << " left" << endl;`), count: { line: 8 }, hints: ['5000 → 3500 → …', 'Is 500 at least 1500?'], explain: '5000 → 3500 → 2000 → 500. At 500 the diamond says No: **3** times. Output: `3 withdrawals, Rs 500 left`.' },
    { id: 'checkpoint-flowcharts-q5', kind: 'blanks', view: 'flow', tag: 'real life', prompt: 'Grade calculator: 80 or more → A, 65 or more → B, otherwise C. Fill in the diamonds **Box 1** and **Box 2**. Input `70` → `B`.', code: prog(cpp`
    int marks;
    cin >> marks;
    if ([[1]]) {
        cout << "A" << endl;
    } else if ([[2]]) {
        cout << "B" << endl;
    } else {
        cout << "C" << endl;
    }`), blanks: [{ answers: ['marks >= 80', 'marks > 79', '80 <= marks'] }, { answers: ['marks >= 65', 'marks > 64', '65 <= marks'] }], chips: ['marks', '>=', '>', '<', '80', '65'], input: '70\n', hints: ['Ask about the highest grade first.', '"65 or more" → `>=`.'], explain: 'Box 1: `marks >= 80`. Box 2: `marks >= 65`. For 70: No, then Yes → `B`.' },
    { id: 'checkpoint-flowcharts-q6', kind: 'mcq', view: 'flow', prompt: 'Which input makes this flowchart follow the **No** arrow at **every** diamond?', code: GRADES, input: '72\n', options: ['55', '60', '70', '80'], answer: 0, hints: ['The last diamond asks `marks >= 60 ?`.'], explain: 'Only 55 is below 60, so all three diamonds say No → `Fail`. 60 is an edge value: `60 >= 60` is Yes.' },
    { id: 'checkpoint-flowcharts-q7', kind: 'count', view: 'flow', tag: 'tricky', prompt: 'How many times is the highlighted diamond asked?', code: prog(cpp`
    int i = 10;
    while (i > 0) {
        cout << i << " ";
        i = i - 3;
    }`), count: { checks: 6 }, hints: ['i: 10, 7, 4, 1, …', 'What is 1 − 3? Is it > 0?'], explain: 'i = 10, 7, 4, 1 → Yes (4 times). i = −2 → No. **5** questions. Output: `10 7 4 1 `.' },
    { id: 'checkpoint-flowcharts-q8', kind: 'predict', view: 'flow', prompt: 'The user types `4`. What is displayed?', code: prog(cpp`
    int n;
    cin >> n;
    int i = 1;
    while (i <= n) {
        cout << i * i << " ";
        i = i + 1;
    }`), input: '4\n', hints: ['The Display box shows i × i, not i.'], explain: 'i = 1, 2, 3, 4 → `1 4 9 16 `.' },
    { id: 'checkpoint-flowcharts-q9', kind: 'mcq', tag: 'tricky', prompt: 'A flowchart should display the numbers from 10 down to 1. It has `i = 10`, the diamond `i >= 1 ?`, `Display i` and `i = i + 1`. What happens?', options: ['It never stops: i grows, so `i >= 1` is always Yes', 'It displays 10 down to 1', 'It displays nothing', 'It displays only 10'], answer: 0, hints: ['Which way does i move?'], explain: 'The change goes the wrong way: 10, 11, 12, … are all ≥ 1. The box must be `i = i - 1`.' },
    { id: 'checkpoint-flowcharts-q10', kind: 'trace', mode: 'vars', view: 'flow', prompt: 'Power: multiply `result` by `b`, `e` times. Dry run for `b = 2`, `e = 4`.', code: prog(cpp`
    int b, e;
    cin >> b >> e;
    int result = 1;
    int i = 1;
    while (i <= e) {
        result = result * b;
        i = i + 1;
    }
    cout << result << endl;`), input: '2 4\n', vars: ['result', 'i'], hints: ['result: 1 → 2 → 4 → …'], explain: 'result = 2, 4, 8, 16. `2⁴ = 16`.' },
    { id: 'checkpoint-flowcharts-q11', kind: 'predict', view: 'flow', tag: 'real life', prompt: 'Cricket: the flowchart reads the runs of 6 balls and counts the sixes. The user types `4 6 0 6 1 2`. What is displayed?', code: prog(cpp`
    int r;
    int total = 0;
    int sixes = 0;
    int ball = 1;
    while (ball <= 6) {
        cin >> r;
        total = total + r;
        if (r == 6) {
            sixes = sixes + 1;
        }
        ball = ball + 1;
    }
    cout << total << " runs, " << sixes << " sixes" << endl;`), input: '4 6 0 6 1 2\n', hints: ['4 + 6 + 0 + 6 + 1 + 2', 'How many of them are exactly 6?'], explain: 'total = 19 and two balls were 6 → `19 runs, 2 sixes`.' },
    { id: 'checkpoint-flowcharts-q12', kind: 'blanks', view: 'flow', prompt: '**Capstone.** Add up the even numbers from 1 to n. Fill in the diamond **Box 1**, and the process boxes **Box 2** and **Box 3**. Input `10` → `30`.', code: prog(cpp`
    int n;
    cin >> n;
    int sum = 0;
    int i = 1;
    while (i <= n) {
        if ([[1]]) {
            [[2]];
        }
        [[3]];
    }
    cout << sum << endl;`), blanks: [{ answers: ['i % 2 == 0', '0 == i % 2'] }, { answers: ['sum = sum + i', 'sum += i', 'sum = i + sum'] }, { answers: ['i = i + 1', 'i++', 'i += 1', '++i'] }], chips: ['i', 'sum', 'n', '%', '2', '==', '=', '+', '1', '0'], input: '10\n', hints: ['Box 1: is i even?', 'Box 2 adds i to the total; Box 3 moves i on — it is outside the inner diamond so it runs every round.'], explain: 'Box 1: `i % 2 == 0`. Box 2: `sum = sum + i`. Box 3: `i = i + 1`. 2 + 4 + 6 + 8 + 10 = 30.' },
  ],
  exam: {
    title: 'Exam Challenge: flowcharts',
    intro: 'Sessional style. Dry-run on paper first, then answer. Every question uses a flowchart.',
    questions: [
      { id: 'checkpoint-flowcharts-x1', kind: 'blanks', view: 'flow', tag: 'exam', prompt: 'Complete the given flowchart by filling in the missing steps. It displays all factors of n. Input `12` → `1 2 3 4 6 12 `.', code: prog(cpp`
    int n;
    cin >> n;
    int i = 1;
    while (i <= n) {
        if ([[1]]) {
            cout << i << " ";
        }
        [[2]];
    }`), blanks: [{ answers: ['n % i == 0', '0 == n % i'] }, { answers: ['i = i + 1', 'i++', 'i += 1', '++i'] }], chips: ['n', 'i', '%', '==', '0', '=', '+', '1'], input: '12\n', hints: ['i is a factor when n divides by i with no remainder.'], explain: 'Box 1: `n % i == 0` (no remainder). Box 2: `i = i + 1` so every i from 1 to n is tried.' },
      { id: 'checkpoint-flowcharts-x2', kind: 'predict', view: 'flow', tag: 'exam', prompt: 'State the output of the flowchart for input `6`.', code: prog(cpp`
    int n;
    cin >> n;
    int a = 0;
    int b = 1;
    int i = 1;
    while (i <= n) {
        cout << a << " ";
        int c = a + b;
        a = b;
        b = c;
        i = i + 1;
    }`), input: '6\n', hints: ['Each round: display a, then the pair (a, b) moves on to (b, a + b).'], explain: '(a, b): (0,1) → (1,1) → (1,2) → (2,3) → (3,5) → (5,8). Displayed a values: `0 1 1 2 3 5 `.' },
      { id: 'checkpoint-flowcharts-x3', kind: 'count', view: 'flow', tag: 'exam', prompt: 'How many times is the highlighted `Display "*"` box executed? (A loop inside a loop.)', code: prog(cpp`
    int i = 1;
    while (i <= 3) {
        int j = 1;
        while (j <= i) {
            cout << "*";
            j = j + 1;
        }
        cout << endl;
        i = i + 1;
    }`), count: { line: 9 }, unit: 'times', hints: ['For i = 1 the inner loop runs once, for i = 2 twice …'], explain: '1 + 2 + 3 = **6** stars, one row per i: `*`, `**`, `***`.' },
      { id: 'checkpoint-flowcharts-x4', kind: 'predict', view: 'flow', tag: 'exam', prompt: 'State the output of the flowchart.', code: prog(cpp`
    int x = 17;
    int y = 5;
    int z = x / y * y;
    int r = x % y;
    cout << z << " " << r << " " << z + r << endl;`), hints: ['17 / 5 is whole division.', 'Left to right: (17 / 5) × 5.'], explain: '17 / 5 = 3, 3 × 5 = 15; 17 % 5 = 2; 15 + 2 = 17 → `15 2 17`.' },
      { id: 'checkpoint-flowcharts-x5', kind: 'count', view: 'flow', tag: 'exam', prompt: 'How many times is the highlighted decision checked?', code: prog(cpp`
    int i = 1;
    while (i != 9) {
        i = i + 2;
    }
    cout << i << endl;`), count: { checks: 6 }, hints: ['i: 1, 3, 5, 7, 9'], explain: 'i = 1, 3, 5, 7 → Yes (4 times); i = 9 → No. **5** checks. (If i started at 2 it would jump over 9 and never stop!)' },
      { id: 'checkpoint-flowcharts-x6', kind: 'predict', view: 'flow', tag: 'exam', prompt: 'State the output of the flowchart for input `12 18`.', code: prog(cpp`
    int a, b;
    cin >> a >> b;
    while (a != b) {
        if (a > b) {
            a = a - b;
        } else {
            b = b - a;
        }
    }
    cout << a << endl;`), input: '12 18\n', hints: ['12 > 18? No → b = 18 − 12.', 'Then a = 12, b = 6.'], explain: '(12, 18) → (12, 6) → (6, 6). a equals b → display `6` (the greatest common divisor).' },
      { id: 'checkpoint-flowcharts-x7', kind: 'trace', mode: 'output', view: 'flow', tag: 'exam', prompt: 'Trace the flowchart for input `6` and write what each Display box shows.', code: prog(cpp`
    int n;
    cin >> n;
    while (n > 0) {
        cout << n % 2;
        n = n / 2;
    }
    cout << endl;`), input: '6\n', hints: ['6 % 2 = 0, then n = 3.', '3 % 2 = 1, then n = 1.'], explain: 'Remainders 0, 1, 1 → `011`. (It is 6 in binary, 110, written backwards.)' },
      { id: 'checkpoint-flowcharts-x8', kind: 'count', view: 'flow', tag: 'exam', prompt: 'How many times is the highlighted Display box executed?', code: prog(cpp`
    int i = 1;
    while (i <= 20) {
        if (i % 3 == 0) {
            cout << i << " ";
        }
        i = i + 1;
    }`), count: { line: 8 }, hints: ['Which numbers from 1 to 20 divide by 3?'], explain: '3, 6, 9, 12, 15, 18 → **6** times.' },
      { id: 'checkpoint-flowcharts-x9', kind: 'mcq', view: 'flow', tag: 'exam', prompt: 'For which input does this flowchart display `C`?', code: prog(cpp`
    int n;
    cin >> n;
    if (n > 50) {
        if (n > 80) {
            cout << "A";
        } else {
            cout << "B";
        }
    } else {
        if (n > 20) {
            cout << "C";
        } else {
            cout << "D";
        }
    }`), input: '30\n', options: ['35', '65', '90', '20'], answer: 0, hints: ['C needs No at the first diamond and Yes at `n > 20 ?`.'], explain: '35: `35 > 50` No, `35 > 20` Yes → C. 65 → B, 90 → A, 20 → D (20 > 20 is No).' },
      { id: 'checkpoint-flowcharts-x10', kind: 'predict', view: 'flow', tag: 'exam', prompt: 'Leap year check. State the output for input `1900`.', code: prog(cpp`
    int y;
    cin >> y;
    if (y % 400 == 0) {
        cout << "Leap" << endl;
    } else if (y % 100 == 0) {
        cout << "Not leap" << endl;
    } else if (y % 4 == 0) {
        cout << "Leap" << endl;
    } else {
        cout << "Not leap" << endl;
    }`), input: '1900\n', hints: ['1900 % 400 = 300.', '1900 % 100 = 0.'], explain: 'Not divisible by 400, but divisible by 100 → `Not leap`. The order of the diamonds matters: 1900 is also divisible by 4, but that diamond is never reached.' },
    ],
  },
  cheatsheet: [
    { code: 'Oval / Rectangle / Parallelogram / Diamond', text: 'start-stop / process / input-output / decision' },
    { code: 'diamond asked = body runs + 1', text: 'for a loop that asks first' },
    { code: 'n % 10, n / 10', text: 'last digit, drop last digit' },
  ],
};

export const unit0: Unit = {
  id: 'u0',
  num: 0,
  title: 'Flowcharts & algorithms',
  summary: 'Before any code: plan the steps, draw them as a flowchart, and dry-run the boxes by hand.',
  levels: [A1, S2, Q3, D4, L5, T6, C7, CP],
};
