import type { Course, Level, Unit } from '../types';
import { cpp, prog } from '../helpers';

// Helper for joining prompt lines
const t = (...lines: string[]): string => lines.join('\n');

// =====================================================================================
// UNIT 1: Algorithmic Complexity & Dynamic Arrays
// =====================================================================================

const DSA_U1_L1: Level = {
  id: 'dsa-big-o',
  kind: 'lesson',
  title: 'Big-O Notation & Asymptotic Complexity',
  tagline: 'How does your program behave when N grows from 10 to 1,000,000? Big-O classifies algorithms by their growth rate.',
  minutes: 20,
  objectives: [
    'Understand why wall-clock time is unreliable and Big-O counts operations',
    'Recognize O(1), O(log N), O(N), O(N log N), and O(N^2) complexity classes',
    'Analyze single and nested loop execution counts',
  ],
  learn: [
    { t: 'p', text: 'Comparing algorithms by measuring seconds on a stopwatch depends on CPU speed, background apps, and compiler optimizations. **Big-O notation** measures how the number of operations grows as the input size `N` grows to infinity.' },
    { t: 'table', head: ['Big-O', 'Name', 'N = 1,000 Ops', 'Typical Algorithm'], rows: [
      ['O(1)', 'Constant time', '1 op', 'Array indexing `arr[i]`, stack push/pop'],
      ['O(log N)', 'Logarithmic time', '~10 ops', 'Binary search in sorted array'],
      ['O(N)', 'Linear time', '1,000 ops', 'Finding maximum, linear search'],
      ['O(N log N)', 'Linearithmic', '~10,000 ops', 'Merge Sort, Quick Sort'],
      ['O(N^2)', 'Quadratic time', '1,000,000 ops', 'Nested loops, Bubble Sort'],
    ], caption: 'The fundamental Big-O complexity hierarchy.' },
    { t: 'viz', title: 'Linear search: O(N) comparisons', code: cpp`
#include <iostream>
using namespace std;

int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}

int main() {
    int data[5] = {10, 25, 30, 45, 50};
    int idx = linearSearch(data, 5, 45);
    cout << "Found at index: " << idx << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Find an element in a collection.',
    intro: 'Linear vs Binary Search.',
    items: [
      { title: 'Linear Search: O(N)', code: cpp`
#include <iostream>
using namespace std;
int search(int a[], int n, int x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return i;
    return -1;
}
int main() {
    int arr[4] = {4, 2, 7, 1};
    cout << search(arr, 4, 7) << endl;
    return 0;
}` },
      { title: 'Binary Search: O(log N) on sorted data', code: cpp`
#include <iostream>
using namespace std;
int bsearch(int a[], int n, int x) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (a[mid] == x) return mid;
        if (a[mid] < x) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}
int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    cout << bsearch(arr, 5, 40) << endl;
    return 0;
}` },
    ],
    takeaway: 'Binary search cuts the remaining search space in half at every step, taking only ~20 steps for 1 million items!',
    check: {
      id: 'dsa-u1-l1-check',
      kind: 'mcq',
      prompt: 'If an algorithm has complexity O(N^2), how many operations occur when N doubles from 100 to 200?',
      options: ['It doubles (2x)', 'It quadruples (4x)', 'It stays constant', 'It increases by 100'],
      answer: 1,
      explain: '(2N)^2 = 4N^2. When N doubles, quadratic O(N^2) work multiplies by 4.',
    },
  },
  watch: [
    { title: 'Counting steps in loop', intro: 'Loop iterates N times.', code: cpp`
#include <iostream>
using namespace std;

int main() {
    int n = 5;
    int steps = 0;
    for (int i = 0; i < n; i++) {
        steps++;
    }
    cout << "Total steps: " << steps << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Tracing Binary Search Halving',
    problem: 'Trace binary search for key = 40 in sorted array [10, 20, 30, 40, 50]. Notice how the search interval [low, high] cuts in half on every step.',
    steps: [
      { text: 'Set initial search boundaries: `low = 0` and `high = n - 1`.', lines: [7, 8] },
      { text: 'Find middle index: `mid = (low + high) / 2`.', lines: [10] },
      { text: 'Compare `arr[mid]` with target: if equal, target is found.', lines: [11, 12, 13] },
      { text: 'If target is greater, discard left half: `low = mid + 1`.', lines: [15] },
      { text: 'Else discard right half: `high = mid - 1`.', lines: [16] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    int target = 40;
    int low = 0, high = 4;
    int found = -1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) {
            found = mid;
            break;
        }
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    cout << found << endl;
    return 0;
}
`,
    why: 'Binary search avoids checking all elements one-by-one by eliminating 50% of the candidates at each comparison.',
  },
  practice: [
    {
      id: 'dsa-u1-l1-mcq1',
      kind: 'mcq',
      prompt: 'What is the time complexity of accessing an array element by its index `arr[k]`?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
      answer: 0,
      explain: 'Array access is O(1) constant time because the memory address is calculated directly via pointer arithmetic: base + k * sizeof(type).',
    },
    {
      id: 'dsa-u1-l1-pred1',
      kind: 'predict',
      prompt: 'What will this program output?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int ops = 0;
    for (int i = 0; i < 4; i++) {
        for (int j = 0; j < 3; j++) {
            ops++;
        }
    }
    cout << ops << endl;
    return 0;
}
`,
      explain: 'Outer loop runs 4 times, inner loop runs 3 times: 4 * 3 = 12.',
    },
    {
      id: 'dsa-u1-l1-count1',
      kind: 'count',
      prompt: 'How many times does `ops++;` execute in this dependent nested loop?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int ops = 0;
    for (int i = 0; i < 4; i++) {
        for (int j = 0; j <= i; j++) {
            ops++;
        }
    }
    cout << ops << endl;
    return 0;
}
`,
      count: { line: 8 },
      unit: 'times',
      explain: 'i=0: 1 time; i=1: 2 times; i=2: 3 times; i=3: 4 times. Total = 1 + 2 + 3 + 4 = 10 times.',
    },
    {
      id: 'dsa-u1-l1-bug1',
      kind: 'bug',
      prompt: 'This binary search implementation fails on certain test cases. Identify the line with the boundary bug.',
      code: cpp`
#include <iostream>
using namespace std;

int bsearch(int arr[], int n, int key) {
    int low = 0, high = n - 1;
    while (low < high) {
        int mid = (low + high) / 2;
        if (arr[mid] == key) return mid;
        if (arr[mid] < key) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    int a[3] = {10, 20, 30};
    cout << bsearch(a, 3, 30) << endl;
    return 0;
}
`,
      bugLine: 7,
      options: [
        'The loop condition must be `while (low <= high)` so single-element ranges are checked',
        'mid must be calculated as `(low * high) / 2`',
        'low must start at 1 instead of 0',
        'bsearch must return void',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

int bsearch(int arr[], int n, int key) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == key) return mid;
        if (arr[mid] < key) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    int a[3] = {10, 20, 30};
    cout << bsearch(a, 3, 30) << endl;
    return 0;
}
`,
      explain: 'When `low == high`, there is still 1 element left to inspect. `low < high` terminates prematurely and misses the target.',
    },
    {
      id: 'dsa-u1-l1-mcq2',
      kind: 'mcq',
      prompt: 'What is the asymptotic time complexity of a loop structured as `for (int i = 1; i <= n; i *= 2)`?',
      options: ['O(log N)', 'O(N)', 'O(N^2)', 'O(1)'],
      answer: 0,
      explain: 'Since the loop counter multiplies by 2 on each iteration, it runs log2(N) times.',
    },
    {
      id: 'dsa-u1-l1-pred2',
      kind: 'predict',
      prompt: 'Stair 6 (Complex Logic): Trace the execution count of this step-halving geometric loop.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int count = 0;
    for (int n = 16; n > 1; n /= 2) {
        for (int i = 0; i < n; i++) {
            count++;
        }
    }
    cout << count << endl;
    return 0;
}
`,
      explain: 'Outer loop runs for n = 16, 8, 4, 2. The inner loop executes 16 + 8 + 4 + 2 = 30 times. Prints 30.',
    },
  ],
  cheatsheet: [
    { code: 'O(1)', text: 'constant time: direct array access arr[i], stack push/pop' },
    { code: 'O(log N)', text: 'logarithmic time: binary search, halving search space' },
    { code: 'O(N)', text: 'linear time: single pass over array, linear search' },
    { code: 'O(N^2)', text: 'quadratic time: nested loops over N items (e.g. bubble sort)' },
  ],
};

const DSA_U1_L2: Level = {
  id: 'dsa-dynamic-arrays',
  kind: 'lesson',
  title: 'Dynamic Resizing Arrays: Vector Mechanics',
  tagline: 'Fixed arrays cannot grow when full. Dynamic arrays double their capacity when reaching limit, giving amortized O(1) insertion.',
  minutes: 20,
  objectives: [
    'Understand size (element count) vs capacity (allocated storage)',
    'Trace geometric doubling: why capacity doubles from 1 -> 2 -> 4 -> 8',
    'Understand amortized O(1) append time',
  ],
  learn: [
    { t: 'p', text: 'A dynamic array maintains an underlying heap array. When an append exceeds **capacity**, it allocates a new array **twice as large**, copies all existing elements over, deletes the old array, and then inserts the new item.' },
    { t: 'syntax', title: 'Dynamic Array Doubling Strategy', code: cpp`
void push_back(int val) {
    if (size == capacity) {
        int newCap = capacity * 2;
        int* newArr = new int[newCap];
        for (int i = 0; i < size; i++) {
            newArr[i] = data[i];
        }
        delete[] data;
        data = newArr;
        capacity = newCap;
    }
    data[size++] = val;
}`, parts: [
      { token: 'capacity * 2', text: 'doubling ensures expensive reallocations happen exponentially less often' },
      { token: 'delete[] data;', text: 'crucial: frees old memory to avoid memory leaks' },
    ] },
    { t: 'viz', title: 'Dynamic array simulation', code: cpp`
#include <iostream>
using namespace std;

struct DynArray {
    int data[10];
    int size;
    int cap;
};

void push(DynArray &a, int val) {
    if (a.size < a.cap) {
        a.data[a.size++] = val;
    }
}

int main() {
    DynArray d = {{0}, 0, 5};
    push(d, 10);
    push(d, 20);
    push(d, 30);
    cout << "Size: " << d.size << " First: " << d.data[0] << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Track size and capacity when inserting elements.',
    intro: 'Storage growth patterns.',
    items: [
      { title: 'Array expansion tracking', code: cpp`
#include <iostream>
using namespace std;
int main() {
    int cap = 2;
    int sz = 0;
    for (int i = 1; i <= 5; i++) {
        if (sz == cap) cap *= 2;
        sz++;
    }
    cout << "Final Size: " << sz << " Capacity: " << cap << endl;
    return 0;
}` },
    ],
    takeaway: 'Doubling capacity keeps average insertion cost at O(1) (amortized).',
    check: {
      id: 'dsa-u1-l2-check',
      kind: 'mcq',
      prompt: 'Why do dynamic vectors double capacity instead of just increasing it by +1 each time?',
      options: [
        'To reduce RAM usage',
        'Increasing by +1 would make N insertions take O(N^2) time due to repeated copying',
        'C++ compilers only allow powers of two',
        'To make array indexing faster',
      ],
      answer: 1,
      explain: 'Increasing by 1 forces copying all elements on every single insert, resulting in 1+2+3+...+N = O(N^2) total time.',
    },
  },
  watch: [
    { title: 'Capacity growth simulation', intro: 'Notice how capacity jumps: 2 -> 4 -> 8.', code: cpp`
#include <iostream>
using namespace std;

int main() {
    int cap = 1;
    for (int sz = 1; sz <= 5; sz++) {
        if (sz > cap) cap *= 2;
        cout << "Sz: " << sz << " Cap: " << cap << endl;
    }
    return 0;
}
` },
  ],
  think: {
    title: 'Tracing Dynamic Array Capacity Doubling',
    problem: 'A dynamic array starts with capacity = 1. Trace how capacity doubles (1 -> 2 -> 4 -> 8) and track the number of reallocations across 5 insertions.',
    steps: [
      { text: 'Initialize size = 0 and initial capacity = 1.', lines: [5, 6, 7] },
      { text: 'Check if array is full (`size == capacity`). If full, double capacity.', lines: [9, 10, 11] },
      { text: 'Increment size for the newly inserted element.', lines: [13] },
      { text: 'Print final size, capacity, and reallocation count.', lines: [15] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

int main() {
    int cap = 1;
    int sz = 0;
    int reallocCount = 0;
    for (int i = 0; i < 5; i++) {
        if (sz == cap) {
            cap *= 2;
            reallocCount++;
        }
        sz++;
    }
    cout << sz << " " << cap << " " << reallocCount << endl;
    return 0;
}
`,
    why: 'Doubling capacity keeps reallocation rare, ensuring amortized O(1) insertion time.',
  },
  practice: [
    {
      id: 'dsa-u1-l2-pred1',
      kind: 'predict',
      prompt: 'What will be printed by this program?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int cap = 1;
    for (int i = 0; i < 4; i++) {
        if (i == cap) cap *= 2;
    }
    cout << cap << endl;
    return 0;
}
`,
      explain: 'Initially cap = 1. i = 0 (no change); i = 1 == cap -> cap = 2; i = 2 == cap -> cap = 4; i = 3 (no change). Result: 4.',
    },
    {
      id: 'dsa-u1-l2-mcq1',
      kind: 'mcq',
      prompt: 'In a dynamic array (like std::vector), what is the difference between `size` and `capacity`?',
      options: [
        '`size` is the number of elements stored; `capacity` is the total memory allocated',
        '`size` is measured in bytes; `capacity` is measured in bits',
        '`size` cannot change; `capacity` changes constantly',
        '`size` is always larger than `capacity`',
      ],
      answer: 0,
      explain: '`size` counts active user elements currently in the vector. `capacity` is the maximum elements it can hold before the next heap reallocation.',
    },
    {
      id: 'dsa-u1-l2-count1',
      kind: 'count',
      prompt: 'How many times does `reallocs++;` execute when pushing 6 elements starting with cap = 1?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int cap = 1;
    int reallocs = 0;
    for (int sz = 1; sz <= 6; sz++) {
        if (sz > cap) {
            cap *= 2;
            reallocs++;
        }
    }
    cout << reallocs << endl;
    return 0;
}
`,
      count: { line: 10 },
      unit: 'times',
      explain: 'sz=1: 1>1 F. sz=2: 2>1 T -> cap=2 (1st). sz=3: 3>2 T -> cap=4 (2nd). sz=4: 4>4 F. sz=5: 5>4 T -> cap=8 (3rd). sz=6: 6>8 F. Exactly 3 times.',
    },
    {
      id: 'dsa-u1-l2-bug1',
      kind: 'bug',
      prompt: 'This capacity expansion routine incorrectly adds 1 instead of doubling. Identify the buggy line.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int cap = 1;
    for (int i = 0; i < 5; i++) {
        if (i == cap) cap += 1;
    }
    cout << cap << endl;
    return 0;
}
`,
      bugLine: 7,
      options: [
        'Dynamic arrays must double capacity `cap *= 2` rather than incrementing `cap += 1` to achieve amortized O(1)',
        'cap must start at 0',
        'i must decrement from 5',
        'cout << cap must be inside the loop',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

int main() {
    int cap = 1;
    for (int i = 0; i < 5; i++) {
        if (i == cap) cap *= 2;
    }
    cout << cap << endl;
    return 0;
}
`,
      explain: 'Increasing capacity by a constant (+1) yields O(N^2) total copy time across N insertions. Geometric doubling (cap *= 2) guarantees amortized O(1) time.',
    },
    {
      id: 'dsa-u1-l2-pred2',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Trace total element copy operations during 5 push_back insertions starting from cap = 1.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int cap = 1, sz = 0, copies = 0;
    for (int i = 0; i < 5; i++) {
        if (sz == cap) {
            copies += sz;
            cap *= 2;
        }
        sz++;
    }
    cout << copies << " " << cap << endl;
    return 0;
}
`,
      explain: 'When capacity doubles, all existing elements are copied to the new heap buffer. Reallocations occur when size reaches 1 (1 copy), 2 (2 copies), and 4 (4 copies). Total copies = 1 + 2 + 4 = 7. Final capacity = 8. Output is 7 8.',
    },
    {
      id: 'dsa-u1-l2-pred3',
      kind: 'predict',
      prompt: 'Stair 6 (Complex Logic): Trace size vs capacity behavior during pop_back operations.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int sz = 4, cap = 8;
    for (int i = 0; i < 3; i++) {
        sz--;
    }
    cout << sz << " " << cap << endl;
    return 0;
}
`,
      explain: 'popping elements reduces size from 4 to 1, but capacity remains 8 because vectors do not automatically shrink buffer memory on pop. Output is 1 8.',
    },
  ],
  cheatsheet: [
    { code: 'size', text: 'current number of inserted elements' },
    { code: 'capacity', text: 'total slots allocated in memory before reallocation is needed' },
    { code: 'Geometric doubling (2x)', text: 'gives amortized O(1) push_back runtime' },
    { code: 'delete[] oldArr;', text: 'always deallocate previous heap buffer after copying to avoid leaks' },
  ],
};

const DSA_U1_CP: Level = {
  id: 'checkpoint-dsa-complexity',
  kind: 'revision',
  title: 'Complexity & Dynamic Storage',
  tagline: 'Test your understanding of Big-O complexity classes, search performance, and dynamic array mechanics.',
  objectives: [
    'Calculate Big-O from nested loops and conditions',
    'Compare performance of array operations',
    'Conquer the Gold Exam Challenge Box on FAST DSA past papers',
  ],
  practice: [
    {
      id: 'dsa-cp1-mcq1',
      kind: 'mcq',
      prompt: 'What is the time complexity of deleting an element at index 0 of an array of size N?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
      answer: 2,
      explain: 'Deleting at index 0 requires shifting all remaining N-1 elements to the left by one position, which takes O(N) time.',
    },
    {
      id: 'dsa-cp1-pred1',
      kind: 'predict',
      prompt: 'What is printed by this logarithmic loop execution?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int n = 16;
    int count = 0;
    while (n > 1) {
        count++;
        n /= 2;
    }
    cout << count << endl;
    return 0;
}
`,
      explain: '16 -> 8 -> 4 -> 2 -> 1. The while loop runs 4 times. Prints 4.',
    },
    {
      id: 'dsa-cp1-count1',
      kind: 'count',
      prompt: 'How many times does the print statement execute when n = 3?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int n = 3;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cout << "*";
        }
    }
    cout << endl;
    return 0;
}
`,
      count: { line: 8 },
      unit: 'times',
      explain: 'Nested loop runs n * n = 3 * 3 = 9 times.',
    },
    {
      id: 'dsa-cp1-mcq2',
      kind: 'mcq',
      prompt: 'Which data structure allows O(1) random access by numerical index?',
      options: ['Array', 'Singly Linked List', 'Doubly Linked List', 'Binary Tree'],
      answer: 0,
      explain: 'Arrays store elements contiguously in memory, allowing constant time O(1) index calculation: base + i * sizeof(type).',
    },
    {
      id: 'dsa-cp1-pred2',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Trace array left rotation by 1 position.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int arr[4] = {10, 20, 30, 40};
    int first = arr[0];
    for (int i = 0; i < 3; i++) {
        arr[i] = arr[i + 1];
    }
    arr[3] = first;
    cout << arr[0] << " " << arr[3] << endl;
    return 0;
}
`,
      explain: 'Elements at indices 1, 2, 3 shift left to 0, 1, 2 (becoming 20, 30, 40). Stored first element 10 wraps to index 3. arr[0] is 20, arr[3] is 10. Output is 20 10.',
    },
    {
      id: 'dsa-cp1-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 6 checks `>= target` instead of strictly `> target`, returning target itself instead of the first strictly greater number.',
      code: cpp`
#include <iostream>
using namespace std;

int findFirstGreater(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] >= target) return arr[i];
    }
    return -1;
}

int main() {
    int a[3] = {5, 10, 15};
    cout << findFirstGreater(a, 3, 10) << endl;
    return 0;
}
`,
      bugLine: 6,
      options: [
        'The condition must be `arr[i] > target` to find the first strictly greater element',
        'The loop must run backwards from n - 1',
        'findFirstGreater cannot take an array parameter',
        'The function must return void',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

int findFirstGreater(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] > target) return arr[i];
    }
    return -1;
}

int main() {
    int a[3] = {5, 10, 15};
    cout << findFirstGreater(a, 3, 10) << endl;
    return 0;
}
`,
      explain: 'Testing strictly greater `arr[i] > target` skips 10 and returns 15.',
    },
  ],
  exam: {
    title: 'Gold Exam Challenge: FAST Complexity Exams',
    intro: 'Past FAST-NUCES exam problems on time/space analysis and dynamic storage.',
    questions: [
      {
        id: 'dsa-gold-u1-q1',
        kind: 'mcq',
        source: 'FAST DSA Midterm · Fall 2023',
        tag: 'exam',
        prompt: 'Consider this code snippet: `for (int i = 1; i <= n; i *= 2) { cout << i; }`. What is its Big-O time complexity?',
        options: ['O(N)', 'O(log N)', 'O(N^2)', 'O(1)'],
        answer: 1,
        explain: 'Because the loop variable `i` doubles on each iteration (1, 2, 4, 8, ...), the loop runs log2(N) times. The complexity is O(log N).',
      },
      {
        id: 'dsa-gold-u1-q2',
        kind: 'count',
        source: 'FAST DSA Midterm · Spring 2024',
        tag: 'exam',
        prompt: 'How many times does the addition `sum += 1;` execute when `n = 5`?',
        code: cpp`
#include <iostream>
using namespace std;

int main() {
    int n = 5;
    int sum = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            sum += 1;
        }
    }
    cout << sum << endl;
    return 0;
}
`,
        count: { line: 10 },
        unit: 'times',
        explain: 'For i = 0, j runs 5 times; i = 1, 4 times; i = 2, 3 times; i = 3, 2 times; i = 4, 1 time. 5 + 4 + 3 + 2 + 1 = 15 times.',
      },
      {
        id: 'dsa-gold-u1-q3',
        kind: 'mcq',
        source: 'FAST DSA Midterm · Fall 2022',
        tag: 'exam',
        prompt: 'What is the amortized time complexity of inserting N items into an initially empty dynamic array that doubles its capacity whenever full?',
        options: ['O(1) amortized per insertion', 'O(N) amortized per insertion', 'O(log N) amortized per insertion', 'O(N^2) total'],
        answer: 0,
        explain: 'Although an individual doubling step takes O(N) time, doubling happens exponentially less often (1, 2, 4, 8, ...), so the total cost across N insertions is ~2N - 1 = O(N). Averaged per insertion, it is O(1) amortized.',
      },
      {
        id: 'dsa-gold-u1-q4',
        kind: 'predict',
        source: 'FAST DSA Midterm · Spring 2023',
        tag: 'exam',
        prompt: 'Predict the console output of this tripling division loop:',
        code: cpp`
#include <iostream>
using namespace std;

int main() {
    int n = 27;
    int count = 0;
    for (int i = n; i > 1; i /= 3) {
        count++;
    }
    cout << count << endl;
    return 0;
}
`,
        explain: 'Initial i = 27 (>1 -> count=1, i becomes 9); i = 9 (>1 -> count=2, i becomes 3); i = 3 (>1 -> count=3, i becomes 1); i = 1 (1 > 1 false -> terminates). Total count = 3.',
      },
      {
        id: 'dsa-gold-u1-q5',
        kind: 'mcq',
        source: 'FAST DSA Midterm · Fall 2021',
        tag: 'exam',
        prompt: 'In C++, given a 2D array declared as `int matrix[R][C]`, what is the time complexity of reading an element `matrix[i][j]`?',
        options: ['O(1)', 'O(R)', 'O(C)', 'O(R * C)'],
        answer: 0,
        explain: 'In row-major order, the address is calculated in O(1) arithmetic time via: baseAddress + (i * C + j) * sizeof(int).',
      },
    ],
  },
};

// =====================================================================================
// UNIT 2: Singly Linked Lists
// =====================================================================================

const DSA_U2_L1: Level = {
  id: 'dsa-sll-nodes',
  kind: 'lesson',
  title: 'Singly Linked Lists: Nodes and Pointers',
  tagline: 'Unlike arrays where elements sit side-by-side in contiguous memory, linked list nodes live anywhere in RAM, chained together by pointers.',
  minutes: 25,
  objectives: [
    'Define a linked list Node struct with data and next pointer',
    'Insert a new node at the front (head) in O(1) constant time',
    'Traverse a linked list from head to nullptr',
  ],
  learn: [
    { t: 'p', text: 'An array requires a contiguous block of memory, making insertions in the middle slow (O(N)). A **Linked List** consists of independent **Nodes** scattered throughout heap memory. Each node holds its data and a `next` pointer pointing to the next node in line.' },
    { t: 'syntax', title: 'The Node Struct and Head Pointer', code: cpp`
struct Node {
    int data;
    Node* next;
};

Node* head = nullptr; // Empty list starts with head pointing to nothing`, parts: [
      { token: 'int data;', text: 'the value stored in this node' },
      { token: 'Node* next;', text: 'self-referential pointer storing the address of the next node' },
      { token: 'Node* head = nullptr;', text: 'anchor pointer to the very first node of the list' },
    ] },
    { t: 'viz', title: 'Inserting at head and traversing', code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
};

void insertHead(Node* &head, int val) {
    Node* n = new Node();
    n->data = val;
    n->next = head;
    head = n;
}

void printList(Node* head) {
    Node* cur = head;
    while (cur != nullptr) {
        cout << cur->data << " -> ";
        cur = cur->next;
    }
    cout << "NULL" << endl;
}

int main() {
    Node* head = nullptr;
    insertHead(head, 30);
    insertHead(head, 20);
    insertHead(head, 10);
    printList(head);
    return 0;
}
` },
  ],
  ways: {
    goal: 'Build a 3-element list: 10 -> 20 -> 30.',
    intro: 'Manual linking vs function insertion.',
    items: [
      { title: 'Manual heap node linking', code: cpp`
#include <iostream>
using namespace std;
struct Node { int data; Node* next; };
int main() {
    Node* a = new Node(); a->data = 10;
    Node* b = new Node(); b->data = 20;
    Node* c = new Node(); c->data = 30;
    a->next = b;
    b->next = c;
    c->next = nullptr;
    cout << a->data << " " << a->next->data << " " << a->next->next->data << endl;
    delete c; delete b; delete a;
    return 0;
}` },
    ],
    takeaway: 'Inserting at the head of a linked list is always O(1) constant time, requiring no shifting.',
    check: {
      id: 'dsa-u2-l1-check',
      kind: 'mcq',
      prompt: 'What value does the `next` pointer of the LAST node in a singly linked list hold?',
      options: ['head', 'nullptr (NULL)', '0x0000FFFF', 'Points back to itself'],
      answer: 1,
      explain: 'The last node points to nullptr (or NULL) to signal the termination of the list.',
    },
  },
  watch: [
    { title: 'Head insertion step-by-step', intro: 'Notice how each new element becomes the new front of the list.', code: cpp`
#include <iostream>
using namespace std;

struct Node { int val; Node* next; };

int main() {
    Node* head = nullptr;
    Node* n1 = new Node(); n1->val = 5; n1->next = head; head = n1;
    Node* n2 = new Node(); n2->val = 15; n2->next = head; head = n2;
    cout << "Head val: " << head->val << " Next: " << head->next->val << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Tracing Head Insertion Pointer Updates',
    problem: 'Trace inserting two nodes (20, then 10) at the head of an initially empty list. Watch how the head pointer updates.',
    steps: [
      { text: 'Allocate new node on heap.', lines: [10] },
      { text: 'Assign data value to node.', lines: [11] },
      { text: 'Point new node `next` to current head.', lines: [12] },
      { text: 'Update `head` pointer to new node.', lines: [13] },
      { text: 'Verify output: head has 10, next node has 20.', lines: [21] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
};

void insertHead(Node* &head, int val) {
    Node* n = new Node();
    n->data = val;
    n->next = head;
    head = n;
}

int main() {
    Node* head = nullptr;
    insertHead(head, 20);
    insertHead(head, 10);
    cout << head->data << " " << head->next->data << endl;
    return 0;
}
`,
    why: 'Inserting at the head never requires shifting existing elements, making it an O(1) constant-time operation.',
  },
  practice: [
    {
      id: 'dsa-u2-l1-mcq1',
      kind: 'mcq',
      prompt: 'What is the time complexity of inserting a new element at the HEAD of a singly linked list?',
      options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'],
      answer: 0,
      explain: 'Inserting at the head takes O(1) time because you only update two pointer addresses, regardless of list size.',
    },
    {
      id: 'dsa-u2-l1-pred1',
      kind: 'predict',
      prompt: 'What is the output of traversing this statically linked list?',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node c = {10, nullptr};
    Node b = {20, &c};
    Node a = {30, &b};
    cout << a.val << " " << a.next->val << " " << a.next->next->val << endl;
    return 0;
}
`,
      explain: 'a points to b, b points to c. Outputs 30 20 10.',
    },
    {
      id: 'dsa-u2-l1-count1',
      kind: 'count',
      prompt: 'How many times does the while loop body execute during this traversal?',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node c = {3, nullptr};
    Node b = {2, &c};
    Node a = {1, &b};
    Node* cur = &a;
    int count = 0;
    while (cur != nullptr) {
        count++;
        cur = cur->next;
    }
    cout << count << endl;
    return 0;
}
`,
      count: { line: 16 },
      unit: 'times',
      explain: 'List has 3 nodes (a, b, c). The while loop visits each node once, executing line 16 exactly 3 times.',
    },
    {
      id: 'dsa-u2-l1-bug1',
      kind: 'bug',
      prompt: 'This head insertion incorrectly reassigns head before linking next. Identify the buggy line.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
};

int main() {
    Node n1 = {10, nullptr};
    Node n2 = {20, nullptr};
    Node* head = &n1;
    head = &n2;
    n2.next = head;
    cout << head->data << " " << head->next->data << endl;
    return 0;
}
`,
      bugLine: 13,
      options: [
        'Assigning `head = &n2;` before `n2.next = head;` creates a self-loop where n2 points to itself and loses n1',
        'n1 must be dynamically allocated with new',
        'Node cannot be used inside main',
        'cout must use dot instead of arrow',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
};

int main() {
    Node n1 = {10, nullptr};
    Node n2 = {20, nullptr};
    Node* head = &n1;
    n2.next = head;
    head = &n2;
    cout << head->data << " " << head->next->data << endl;
    return 0;
}
`,
      explain: 'The new node must first point its next to the current head BEFORE head is updated to point to the new node.',
    },
    {
      id: 'dsa-u2-l1-mcq2',
      kind: 'mcq',
      prompt: 'What happens if a program attempts to evaluate `p->data` when pointer `p` is equal to `nullptr`?',
      options: [
        'A runtime null pointer dereference error (segmentation fault)',
        'It returns 0',
        'The compiler ignores it',
        'It creates a new node automatically',
      ],
      answer: 0,
      explain: 'Dereferencing a null pointer crashes the program with a segmentation fault because address 0 is protected by the OS.',
    },
    {
      id: 'dsa-u2-l1-pred2',
      kind: 'predict',
      prompt: 'Stair 6 (Complex Logic): Trace the pointer rewirings to predict the final list sequence.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node c = {30, nullptr};
    Node b = {20, &c};
    Node a = {10, &b};
    Node* head = &b;
    b.next = &a;
    a.next = &c;
    cout << head->val << " " << head->next->val << " " << head->next->next->val << endl;
    return 0;
}
`,
      explain: 'head points to b (20). b.next points to a (10). a.next points to c (30). Output is 20 10 30.',
    },
  ],
  cheatsheet: [
    { code: 'struct Node { int data; Node* next; };', text: 'self-referential structure representing a linked list element' },
    { code: 'n->next = head; head = n;', text: 'head insertion: O(1) constant time, order matters' },
    { code: 'while (cur != nullptr) cur = cur->next;', text: 'standard linear traversal: O(N)' },
  ],
};

const DSA_U2_L2: Level = {
  id: 'dsa-sll-operations',
  kind: 'lesson',
  title: 'Linked List Operations: Tail Insert, Search & Delete',
  tagline: 'Master the fundamental linked list manipulations: appending at the tail, searching for a value, and safely deleting a node.',
  minutes: 25,
  objectives: [
    'Append a node at the tail of a linked list',
    'Search for a value in a linked list',
    'Delete a node by key without breaking the chain',
  ],
  learn: [
    { t: 'p', text: 'To delete a node, you must adjust the predecessor\'s `next` pointer to skip over the target node (`prev->next = target->next`), and then call `delete target` to prevent a memory leak.' },
    { t: 'syntax', title: 'Deleting a Node by Value', code: cpp`
void deleteNode(Node* &head, int key) {
    if (head == nullptr) return;
    if (head->data == key) {
        Node* temp = head;
        head = head->next;
        delete temp;
        return;
    }
    Node* cur = head;
    while (cur->next != nullptr && cur->next->data != key) {
        cur = cur->next;
    }
    if (cur->next != nullptr) {
        Node* temp = cur->next;
        cur->next = cur->next->next;
        delete temp;
    }
}`, parts: [
      { token: 'head->data == key', text: 'special case: deleting the very first node updates head pointer' },
      { token: 'cur->next = cur->next->next;', text: 'bypasses the target node in the chain' },
      { token: 'delete temp;', text: 'frees heap memory of the removed node' },
    ] },
    { t: 'viz', title: 'Complete list search and tail append', code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

void insertTail(Node* &head, int v) {
    Node* n = new Node();
    n->val = v;
    n->next = nullptr;
    if (head == nullptr) {
        head = n;
        return;
    }
    Node* cur = head;
    while (cur->next != nullptr) cur = cur->next;
    cur->next = n;
}

int main() {
    Node* head = nullptr;
    insertTail(head, 100);
    insertTail(head, 200);
    cout << head->val << " -> " << head->next->val << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Traverse and count the number of nodes in a linked list.',
    intro: 'Counting nodes.',
    items: [
      { title: 'Iterative count', code: cpp`
#include <iostream>
using namespace std;
struct Node { int v; Node* next; };
int length(Node* h) {
    int cnt = 0;
    while (h) { cnt++; h = h->next; }
    return cnt;
}
int main() {
    Node c = {3, nullptr};
    Node b = {2, &c};
    Node a = {1, &b};
    cout << "Length: " << length(&a) << endl;
    return 0;
}` },
    ],
    takeaway: 'Traversal always runs until pointer reaches `nullptr`.',
    check: {
      id: 'dsa-u2-l2-check',
      kind: 'mcq',
      prompt: 'If you lose the `head` pointer of a singly linked list, what happens to the nodes?',
      options: [
        'They are automatically garbage collected',
        'They become inaccessible memory leaks',
        'They can still be reached via nullptr',
        'They convert to array indices',
      ],
      answer: 1,
      explain: 'Without the head pointer, you cannot access any nodes in the chain, causing an unrecoverable memory leak.',
    },
  },
  watch: [
    { title: 'Delete head node simulation', intro: 'Updating head pointer to the second node.', code: cpp`
#include <iostream>
using namespace std;

struct Node { int val; Node* next; };

int main() {
    Node* n2 = new Node(); n2->val = 20; n2->next = nullptr;
    Node* n1 = new Node(); n1->val = 10; n1->next = n2;
    Node* head = n1;
    // Delete head
    head = head->next;
    cout << "New head: " << head->val << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Tracing Node Deletion Link Bypass',
    problem: 'Trace deleting the middle node (20) from 10 -> 20 -> 30. Watch how updating the pointer bypasses node 20.',
    steps: [
      { text: 'Set up 3-node list: 10 -> 20 -> 30.', lines: [10, 11, 12, 13] },
      { text: 'Bypass node 20: `head->next = head->next->next`.', lines: [14] },
      { text: 'Verify head now points directly to 30.', lines: [15] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node c = {30, nullptr};
    Node b = {20, &c};
    Node a = {10, &b};
    Node* head = &a;
    head->next = head->next->next;
    cout << head->val << " " << head->next->val << endl;
    return 0;
}
`,
    why: 'Deleting a node in a singly linked list requires holding a pointer to its PREDECESSOR node so you can stitch the link across.',
  },
  practice: [
    {
      id: 'dsa-u2-l2-pred1',
      kind: 'predict',
      prompt: 'What will be printed by this program?',
      code: cpp`
#include <iostream>
using namespace std;

struct Node { int val; Node* next; };

int main() {
    Node c = {30, nullptr};
    Node b = {20, &c};
    Node a = {10, &b};
    Node* cur = &a;
    int sum = 0;
    while (cur != nullptr) {
        sum += cur->val;
        cur = cur->next;
    }
    cout << sum << endl;
    return 0;
}
`,
      explain: '10 + 20 + 30 = 60. Prints 60.',
    },
    {
      id: 'dsa-u2-l2-mcq1',
      kind: 'mcq',
      prompt: 'What is the time complexity to insert at the TAIL of a singly linked list of size N if you only have a `head` pointer?',
      options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'],
      answer: 1,
      explain: 'Without a dedicated tail pointer, you must traverse all N nodes from head to reach the end: O(N).',
    },
    {
      id: 'dsa-u2-l2-count1',
      kind: 'count',
      prompt: 'How many nodes satisfy `p->val > 15` in this traversal?',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node d = {40, nullptr};
    Node c = {30, &d};
    Node b = {20, &c};
    Node a = {10, &b};
    Node* p = &a;
    int matches = 0;
    while (p != nullptr) {
        if (p->val > 15) {
            matches++;
        }
        p = p->next;
    }
    cout << matches << endl;
    return 0;
}
`,
      count: { line: 18 },
      unit: 'times',
      explain: 'The nodes with values 20, 30, and 40 satisfy val > 15. The condition evaluates true 3 times.',
    },
    {
      id: 'dsa-u2-l2-bug1',
      kind: 'bug',
      prompt: 'This code attempts to delete the middle node `b` (20), but skips too far. Identify the buggy line.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node c = {30, nullptr};
    Node b = {20, &c};
    Node a = {10, &b};
    Node* head = &a;
    head->next = head->next->next->next;
    if (head->next != nullptr) cout << head->next->val << endl;
    else cout << 0 << endl;
    return 0;
}
`,
      bugLine: 14,
      options: [
        'Accessing `head->next->next->next` skips over both b and c to nullptr; it should be `head->next = head->next->next;`',
        'head must be initialized to nullptr',
        'val must be a string',
        'c cannot point to nullptr',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node c = {30, nullptr};
    Node b = {20, &c};
    Node a = {10, &b};
    Node* head = &a;
    head->next = head->next->next;
    if (head->next != nullptr) cout << head->next->val << endl;
    else cout << 0 << endl;
    return 0;
}
`,
      explain: 'To bypass one node (b), assign `head->next = head->next->next;` so head (10) points directly to c (30).',
    },
    {
      id: 'dsa-u2-l2-pred2',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Trace node deletion by bypassing node 20.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node d = {40, nullptr};
    Node c = {30, &d};
    Node b = {20, &c};
    Node a = {10, &b};
    a.next = b.next;
    Node* cur = &a;
    while (cur != nullptr) {
        cout << cur->val << " ";
        cur = cur->next;
    }
    cout << endl;
    return 0;
}
`,
      explain: 'a.next is updated from b to c, effectively removing b (20). Output is 10 30 40 .',
    },
    {
      id: 'dsa-u2-l2-pred3',
      kind: 'predict',
      prompt: 'Stair 6 (Complex Logic): Trace the 3-pointer iterative reversal of a singly linked list.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node c = {3, nullptr};
    Node b = {2, &c};
    Node a = {1, &b};
    Node* prev = nullptr;
    Node* cur = &a;
    while (cur != nullptr) {
        Node* nxt = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nxt;
    }
    Node* p = prev;
    while (p != nullptr) {
        cout << p->val << " ";
        p = p->next;
    }
    cout << endl;
    return 0;
}
`,
      explain: 'Reversing 1 -> 2 -> 3 makes 3 the new head, pointing to 2, pointing to 1. Output is 3 2 1 .',
    },
  ],
  cheatsheet: [
    { code: 'insertTail without tail pointer', text: 'O(N) traversal needed to locate the last node' },
    { code: 'insertTail with tail pointer', text: 'O(1) constant time: tail->next = n; tail = n;' },
    { code: 'prev->next = cur->next; delete cur;', text: 'delete middle node by linking predecessor to successor' },
  ],
};

const DSA_U2_CP: Level = {
  id: 'checkpoint-dsa-sll',
  kind: 'revision',
  title: 'Singly Linked Lists',
  tagline: 'Consolidate node pointer manipulation, head/tail operations, and traversal.',
  objectives: [
    'Trace pointer manipulation during insertion and deletion',
    'Avoid null pointer dereference bugs in edge cases',
    'Conquer the Gold Exam Challenge Box on FAST linked list exams',
  ],
  practice: [
    {
      id: 'dsa-cp2-mcq1',
      kind: 'mcq',
      prompt: 'What is the time complexity of searching for an element in an unsorted singly linked list of size N?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
      answer: 2,
      explain: 'Because linked list nodes cannot be accessed by index, finding an element requires sequential linear traversal: O(N).',
    },
    {
      id: 'dsa-cp2-pred1',
      kind: 'predict',
      prompt: 'What is the output of this pointer skip traversal?',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node d = {4, nullptr};
    Node c = {3, &d};
    Node b = {2, &c};
    Node a = {1, &b};
    Node* p = &a;
    while (p != nullptr && p->next != nullptr) {
        cout << p->val << " ";
        p = p->next->next;
    }
    cout << endl;
    return 0;
}
`,
      explain: 'Starts at 1, prints 1. Jumps two steps to 3, prints 3. Jumps to nullptr and terminates. Prints "1 3 ".',
    },
    {
      id: 'dsa-cp2-count1',
      kind: 'count',
      prompt: 'How many even values are encountered during this list traversal?',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node c = {10, nullptr};
    Node b = {20, &c};
    Node a = {30, &b};
    Node* cur = &a;
    int evens = 0;
    while (cur != nullptr) {
        if (cur->val % 2 == 0) evens++;
        cur = cur->next;
    }
    cout << evens << endl;
    return 0;
}
`,
      count: { line: 17 },
      unit: 'times',
      explain: 'All three nodes (30, 20, 10) have even values. Line 17 executes 3 times.',
    },
    {
      id: 'dsa-cp2-mcq2',
      kind: 'mcq',
      prompt: 'In Floyd\'s Cycle Detection (Tortoise and Hare), how do the two pointers traverse the linked list?',
      options: [
        'Slow advances 1 node per step; Fast advances 2 nodes per step',
        'Both advance 1 node per step',
        'Slow advances 1 node; Fast advances N nodes',
        'Slow starts from tail; Fast starts from head',
      ],
      answer: 0,
      explain: 'If there is a cycle in the list, the fast pointer (moving 2 nodes per step) will eventually catch up to the slow pointer (moving 1 node per step).',
    },
    {
      id: 'dsa-cp2-pred2',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Trace Floyd cycle detection meeting point after 3 steps.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node d = {4, nullptr};
    Node c = {3, &d};
    Node b = {2, &c};
    Node a = {1, &b};
    d.next = &b;
    Node* slow = &a;
    Node* fast = &a;
    for (int i = 0; i < 3; i++) {
        slow = slow->next;
        fast = fast->next->next;
    }
    cout << slow->val << " " << fast->val << endl;
    return 0;
}
`,
      explain: 'slow moves 1 step each time: a -> b -> c -> d. fast moves 2 steps each time: a -> c -> b -> d. Both meet at node 4. Output is 4 4.',
    },
    {
      id: 'dsa-cp2-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 10 reassigns head to itself instead of advancing to head->next.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

void deleteHead(Node* &head) {
    head = head;
}

int main() {
    Node b = {20, nullptr};
    Node a = {10, &b};
    Node* head = &a;
    deleteHead(head);
    cout << head->val << endl;
    return 0;
}
`,
      bugLine: 10,
      options: [
        'deleteHead assigns `head = head` instead of `head = head->next`, failing to remove the front node',
        'Node cannot have an integer field',
        'main cannot declare Node b',
        'head must be passed by value',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

void deleteHead(Node* &head) {
    head = head->next;
}

int main() {
    Node b = {20, nullptr};
    Node a = {10, &b};
    Node* head = &a;
    deleteHead(head);
    cout << head->val << endl;
    return 0;
}
`,
      explain: 'Updating head = head->next advances the head pointer to 20, correctly printing 20 instead of 10.',
    },
  ],
  exam: {
    title: 'Gold Exam Challenge: FAST Linked List Past Papers',
    intro: 'Past exam problems on linked list reversals, node deletion, and pointer boundary cases.',
    questions: [
      {
        id: 'dsa-gold-u2-q1',
        kind: 'predict',
        source: 'FAST DSA Midterm · Spring 2023',
        tag: 'exam',
        prompt: 'Predict the console output of this linked list traversal:',
        code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
};

int main() {
    Node n3 = {15, nullptr};
    Node n2 = {10, &n3};
    Node n1 = {5, &n2};
    Node* p = &n1;
    while (p != nullptr) {
        if (p->data % 2 == 0) cout << p->data << " ";
        p = p->next;
    }
    cout << endl;
    return 0;
}
`,
        explain: 'Only 10 is even. Prints 10.',
      },
      {
        id: 'dsa-gold-u2-q2',
        kind: 'mcq',
        source: 'FAST DSA Midterm · Fall 2022',
        tag: 'exam',
        prompt: 'How many pointer reassignments are required to insert a node at the head of a singly linked list?',
        options: ['1', '2', 'N', 'N/2'],
        answer: 1,
        explain: 'Exactly two reassignments: `newNode->next = head;` and `head = newNode;`.',
      },
      {
        id: 'dsa-gold-u2-q3',
        kind: 'predict',
        source: 'FAST DSA Midterm · Spring 2024',
        tag: 'exam',
        prompt: 'Predict the console output of this iterative list reversal on a 2-node list:',
        code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node b = {2, nullptr};
    Node a = {1, &b};
    Node* prev = nullptr;
    Node* cur = &a;
    while (cur != nullptr) {
        Node* nextNode = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nextNode;
    }
    cout << prev->val << " " << prev->next->val << endl;
    return 0;
}
`,
        explain: 'Node a originally pointed to b. After reversal, b points to a, and a points to nullptr. prev points to b (2), and prev->next is a (1). Outputs 2 1.',
      },
      {
        id: 'dsa-gold-u2-q4',
        kind: 'predict',
        source: 'FAST DSA Midterm · Fall 2023',
        tag: 'exam',
        prompt: 'Predict the output of finding the middle element with fast and slow pointers:',
        code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node e = {50, nullptr};
    Node d = {40, &e};
    Node c = {30, &d};
    Node b = {20, &c};
    Node a = {10, &b};
    Node* slow = &a;
    Node* fast = &a;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    cout << slow->val << endl;
    return 0;
}
`,
        explain: 'Initial: slow at 10, fast at 10. Step 1: slow at 20, fast at 30. Step 2: slow at 30, fast at 50. Loop terminates because fast->next is nullptr. Slow is at 30 (exact middle). Output is 30.',
      },
      {
        id: 'dsa-gold-u2-q5',
        kind: 'mcq',
        source: 'FAST DSA Midterm · Spring 2022',
        tag: 'exam',
        prompt: 'When deleting node `cur` from a linked list, what occurs if you call `delete cur;` BEFORE updating `prev->next = cur->next;`?',
        options: [
          'Dangling pointer dereference: accessing `cur->next` after `cur` is deleted leads to undefined behavior',
          'The deletion succeeds normally with no issues',
          'The next node is automatically deleted too',
          'The compiler prevents the code from building',
        ],
        answer: 0,
        explain: 'Once `delete cur;` runs, the memory is deallocated. Accessing `cur->next` afterward accesses invalid heap memory (use-after-free).',
      },
    ],
  },
};

// =====================================================================================
// UNIT 3: Doubly & Circular Linked Lists
// =====================================================================================

const DSA_U3_L1: Level = {
  id: 'dsa-dll-bidirectional',
  kind: 'lesson',
  title: 'Doubly Linked Lists: Two-Way Traversal',
  tagline: 'With both `next` and `prev` pointers, you can traverse both forwards and backwards, and delete a node in O(1) without searching for its predecessor.',
  minutes: 25,
  objectives: [
    'Define a Doubly Linked List Node with next and prev pointers',
    'Insert and delete nodes updating both forward and backward links',
    'Traverse backwards starting from the tail pointer',
  ],
  learn: [
    { t: 'p', text: 'In a Singly Linked List, you can only move forward; deleting a node requires finding its previous node (O(N)). In a **Doubly Linked List (DLL)**, every node points to both its successor (`next`) and predecessor (`prev`).' },
    { t: 'syntax', title: 'Doubly Linked List Node', code: cpp`
struct DLLNode {
    int data;
    DLLNode* next;
    DLLNode* prev;
};`, parts: [
      { token: 'DLLNode* next;', text: 'points to the next node towards tail' },
      { token: 'DLLNode* prev;', text: 'points to the previous node towards head' },
    ] },
    { t: 'viz', title: 'Doubly linked list with forward and backward print', code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node* prev;
};

int main() {
    Node* a = new Node(); a->val = 10; a->prev = nullptr;
    Node* b = new Node(); b->val = 20; b->prev = a; a->next = b; b->next = nullptr;
    cout << "Forward: " << a->val << " -> " << a->next->val << endl;
    cout << "Backward: " << b->val << " -> " << b->prev->val << endl;
    delete b; delete a;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Connect two nodes bidirectionally.',
    intro: 'Pointer synchronization.',
    items: [
      { title: 'Bidirectional linking', code: cpp`
#include <iostream>
using namespace std;
struct Node { int d; Node *next, *prev; };
int main() {
    Node n1 = {1, nullptr, nullptr};
    Node n2 = {2, nullptr, &n1};
    n1.next = &n2;
    cout << n2.prev->d << " <-> " << n1.next->d << endl;
    return 0;
}` },
    ],
    takeaway: 'Doubly linked lists trade extra pointer memory (prev) for O(1) predecessor access and two-way traversal.',
    check: {
      id: 'dsa-u3-l1-check',
      kind: 'mcq',
      prompt: 'What does the `prev` pointer of the `head` node point to in a standard doubly linked list?',
      options: ['tail', 'nullptr (NULL)', 'head itself', '0x1'],
      answer: 1,
      explain: 'In a linear DLL, the head node has no predecessor, so `head->prev == nullptr`.',
    },
  },
  watch: [
    { title: 'Backward traversal trace', intro: 'Walking backward from tail to head.', code: cpp`
#include <iostream>
using namespace std;

struct Node { int d; Node* prev; };

int main() {
    Node n1 = {10, nullptr};
    Node n2 = {20, &n1};
    Node n3 = {30, &n2};
    Node* cur = &n3;
    while (cur != nullptr) {
        cout << cur->d << " ";
        cur = cur->prev;
    }
    cout << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Tracing Four-Way Pointer Linking in DLL',
    problem: 'Trace inserting node B (20) between existing nodes A (10) and C (30) in a Doubly Linked List. Track all four pointer updates.',
    steps: [
      { text: 'A points forward to C, C points backward to A.', lines: [12, 13] },
      { text: 'Initialize B with next = &C and prev = &A.', lines: [14] },
      { text: 'Update A forward pointer: `A.next = &B`.', lines: [15] },
      { text: 'Update C backward pointer: `C.prev = &B`.', lines: [16] },
      { text: 'Verify bidirectional traversal: A -> B and C <- B.', lines: [17] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node* prev;
};

int main() {
    Node a = {10, nullptr, nullptr};
    Node c = {30, nullptr, nullptr};
    a.next = &c;
    c.prev = &a;
    Node b = {20, &c, &a};
    a.next = &b;
    c.prev = &b;
    cout << a.val << " " << a.next->val << " " << c.prev->val << endl;
    return 0;
}
`,
    why: 'Inserting a node into a doubly linked list requires modifying 4 pointers total: 2 in the new node, 1 in the predecessor, and 1 in the successor.',
  },
  practice: [
    {
      id: 'dsa-u3-l1-mcq1',
      kind: 'mcq',
      prompt: 'What is the main advantage of a doubly linked list over a singly linked list?',
      options: [
        'It uses less memory per node',
        'It can be traversed in both directions, and a node can be deleted in O(1) given its pointer',
        'It supports random access like an array',
        'It sorts elements automatically',
      ],
      answer: 1,
      explain: 'DLL enables bidirectional traversal and O(1) node removal when holding a direct pointer to the target node.',
    },
    {
      id: 'dsa-u3-l1-pred1',
      kind: 'predict',
      prompt: 'What is the output of traversing this DLL backwards from the tail?',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node* prev;
};

int main() {
    Node a = {10, nullptr, nullptr};
    Node b = {20, nullptr, &a};
    Node c = {30, nullptr, &b};
    a.next = &b;
    b.next = &c;
    Node* p = &c;
    while (p != nullptr) {
        cout << p->val << " ";
        p = p->prev;
    }
    cout << endl;
    return 0;
}
`,
      explain: 'Starting at c (30), moving via prev to b (20), then a (10). Outputs "30 20 10 ".',
    },
    {
      id: 'dsa-u3-l1-count1',
      kind: 'count',
      prompt: 'How many times does `steps++;` execute during this backward traversal?',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node* prev;
};

int main() {
    Node a = {10, nullptr, nullptr};
    Node b = {20, nullptr, &a};
    Node c = {30, nullptr, &b};
    a.next = &b;
    b.next = &c;
    Node* cur = &c;
    int steps = 0;
    while (cur != nullptr) {
        steps++;
        cur = cur->prev;
    }
    cout << steps << endl;
    return 0;
}
`,
      count: { line: 19 },
      unit: 'times',
      explain: 'Traversing 3 nodes (c, b, a) backward visits each node once. Line 19 executes 3 times.',
    },
    {
      id: 'dsa-u3-l1-bug1',
      kind: 'bug',
      prompt: 'When inserting node B between A and C, one link was forgotten. Identify the buggy line.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node* prev;
};

int main() {
    Node a = {10, nullptr, nullptr};
    Node c = {30, nullptr, nullptr};
    a.next = &c;
    c.prev = &a;
    Node b = {20, &c, &a};
    a.next = &b;
    cout << a.next->val << " " << c.prev->val << endl;
    return 0;
}
`,
      bugLine: 17,
      options: [
        'Before printing, `c.prev = &b;` must be executed to update the successor backward link',
        'a.next must point to c',
        'val must be a double',
        'Node cannot have a prev pointer',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node* prev;
};

int main() {
    Node a = {10, nullptr, nullptr};
    Node c = {30, nullptr, nullptr};
    a.next = &c;
    c.prev = &a;
    Node b = {20, &c, &a};
    a.next = &b;
    c.prev = &b;
    cout << a.next->val << " " << c.prev->val << endl;
    return 0;
}
`,
      explain: 'Without `c.prev = &b;`, node C still points back to A instead of B, corrupting the backward chain.',
    },
    {
      id: 'dsa-u3-l1-mcq2',
      kind: 'mcq',
      prompt: 'How many pointer reassignments are required to delete a middle node `p` in a Doubly Linked List?',
      options: ['2', '4', '1', 'N'],
      answer: 0,
      explain: 'Only two reassignments: `p->prev->next = p->next;` and `p->next->prev = p->prev;`.',
    },
    {
      id: 'dsa-u3-l1-pred2',
      kind: 'predict',
      prompt: 'Stair 6 (Complex Logic): Trace inserting node B between A and C and then deleting head node A.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node* prev;
};

int main() {
    Node a = {10, nullptr, nullptr};
    Node c = {30, nullptr, nullptr};
    a.next = &c;
    c.prev = &a;
    Node b = {20, &c, &a};
    a.next = &b;
    c.prev = &b;
    Node* head = a.next;
    head->prev = nullptr;
    cout << head->val << " " << head->next->val << " " << c.prev->val << endl;
    return 0;
}
`,
      explain: 'b is inserted between a and c. head is updated to b (val 20) with prev = nullptr. head->next is c (val 30), and c.prev is b (val 20). Output is "20 30 20".',
    },
  ],
  cheatsheet: [
    { code: 'DLLNode* next; DLLNode* prev;', text: 'bidirectional links allowing two-way navigation' },
    { code: 'Insert middle: 4 pointer updates', text: 'new->prev, new->next, prev->next, next->prev' },
    { code: 'Delete middle: 2 pointer updates', text: 'p->prev->next = p->next; p->next->prev = p->prev;' },
  ],
};

const DSA_U3_L2: Level = {
  id: 'dsa-circular-lists',
  kind: 'lesson',
  title: 'Circular Linked Lists',
  tagline: 'In a circular list, the last node links back to the head! Ideal for round-robin CPU scheduling and circular media playlists.',
  minutes: 20,
  objectives: [
    'Define a circular singly or doubly linked list',
    'Traverse a circular list using `do { ... } while (cur != head);`',
    'Avoid infinite traversal loops',
  ],
  learn: [
    { t: 'p', text: 'In a circular linked list, there is **no nullptr**! The last node\'s `next` points back to the `head`. Traversal must stop when the pointer loops back to where it started.' },
    { t: 'syntax', title: 'Circular Traversal Pattern', code: cpp`
Node* cur = head;
if (head != nullptr) {
    do {
        cout << cur->data << " ";
        cur = cur->next;
    } while (cur != head); // Stop when we return to start
}`, parts: [
      { token: 'do { ... } while', text: 'ensures the head node executes at least once before checking the loop-back condition' },
      { token: 'cur != head', text: 'terminates when pointer cycles back to start' },
    ] },
    { t: 'viz', title: 'Circular 2-node cycle traversal', code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node a, b;
    a.val = 10; a.next = &b;
    b.val = 20; b.next = &a; // cycles back to a!
    Node* cur = &a;
    for (int i = 0; i < 4; i++) {
        cout << cur->val << " ";
        cur = cur->next;
    }
    cout << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Round-robin task execution with circular links.',
    intro: 'Circular cycle demonstration.',
    items: [
      { title: 'Cyclic loop with count limit', code: cpp`
#include <iostream>
using namespace std;
struct Task { int id; Task* next; };
int main() {
    Task t2 = {2, nullptr};
    Task t1 = {1, &t2};
    t2.next = &t1;
    Task* cur = &t1;
    for (int i = 0; i < 3; i++) {
        cout << "Task " << cur->id << endl;
        cur = cur->next;
    }
    return 0;
}` },
    ],
    takeaway: 'Circular lists never terminate at nullptr; loop termination must be handled explicitly.',
    check: {
      id: 'dsa-u3-l2-check',
      kind: 'mcq',
      prompt: 'What happens if you use a standard `while (cur != nullptr)` loop on a circular linked list?',
      options: [
        'It terminates immediately',
        'It enters an infinite loop and hangs',
        'It throws a null pointer exception',
        'It prints NULL',
      ],
      answer: 1,
      explain: 'Because a circular list has no nullptr node, `cur != nullptr` is always true, resulting in an infinite loop.',
    },
  },
  watch: [
    { title: 'Circular rotation', intro: 'Cycling through players in a turn-based game.', code: cpp`
#include <iostream>
using namespace std;

int main() {
    int players[3] = {1, 2, 3};
    for (int turn = 0; turn < 6; turn++) {
        cout << "Turn: Player " << players[turn % 3] << endl;
    }
    return 0;
}
` },
  ],
  think: {
    title: 'Tracing Round-Robin Task Cycling',
    problem: 'Trace cycling through a 3-task circular list for 5 total turns. Observe how the pointer automatically wraps around.',
    steps: [
      { text: 'Create tasks 1, 2, 3 with circular link: T3->next = &T1.', lines: [11, 12, 13, 14] },
      { text: 'Set current runner pointer to T1.', lines: [15] },
      { text: 'Run 5 turns: print task ID and advance `cur = cur->next`.', lines: [16, 17, 18] },
      { text: 'Verify output pattern: 1 2 3 1 2.', lines: [20] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

struct Task {
    int id;
    Task* next;
};

int main() {
    Task t3 = {3, nullptr};
    Task t2 = {2, &t3};
    Task t1 = {1, &t2};
    t3.next = &t1;
    Task* cur = &t1;
    for (int i = 0; i < 5; i++) {
        cout << cur->id << " ";
        cur = cur->next;
    }
    cout << endl;
    return 0;
}
`,
    why: 'Circular linked lists are ideal for cyclic scheduling: the list never hits a nullptr and seamlessly cycles back to the start.',
  },
  practice: [
    {
      id: 'dsa-u3-l2-pred1',
      kind: 'predict',
      prompt: 'What is printed by this cyclic modulo array traversal?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int arr[2] = {100, 200};
    for (int i = 0; i < 3; i++) {
        cout << arr[i % 2] << " ";
    }
    cout << endl;
    return 0;
}
`,
      explain: 'i=0 -> 100; i=1 -> 200; i=2 -> 100. Prints 100 200 100.',
    },
    {
      id: 'dsa-u3-l2-mcq1',
      kind: 'mcq',
      prompt: 'What loop condition is standard for traversing a non-empty circular linked list starting at `head`?',
      options: [
        '`do { ... cur = cur->next; } while (cur != head);`',
        '`while (cur != nullptr)`',
        '`for (int i = 0; i < 100; i++)`',
        '`while (cur->next == nullptr)`',
      ],
      answer: 0,
      explain: 'A `do-while` loop executes the body for `head` first, then advances and stops when `cur` returns back to `head`.',
    },
    {
      id: 'dsa-u3-l2-count1',
      kind: 'count',
      prompt: 'How many times does the pointer return to the start node `&a` in 6 steps?',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node c = {300, nullptr};
    Node b = {200, &c};
    Node a = {100, &b};
    c.next = &a;
    Node* p = &a;
    int laps = 0;
    for (int i = 0; i < 6; i++) {
        if (p == &a) {
            laps++;
        }
        p = p->next;
    }
    cout << laps << endl;
    return 0;
}
`,
      count: { line: 17 },
      unit: 'times',
      explain: 'At i=0 (node a), laps becomes 1. At i=3 (cycled back to a), laps becomes 2. Line 17 executes 2 times.',
    },
    {
      id: 'dsa-u3-l2-bug1',
      kind: 'bug',
      prompt: 'This circular list setup mistakenly links node b back to itself instead of node a. Identify the buggy line.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int id;
    Node* next;
};

int main() {
    Node b = {2, nullptr};
    Node a = {1, &b};
    b.next = &b;
    Node* cur = &a;
    for (int i = 0; i < 3; i++) {
        cout << cur->id << " ";
        cur = cur->next;
    }
    cout << endl;
    return 0;
}
`,
      bugLine: 11,
      options: [
        '`b.next` must point back to `&a;` to complete the circular ring',
        'Node a cannot point to b',
        'cur must be initialized to nullptr',
        'for loop condition is invalid',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Node {
    int id;
    Node* next;
};

int main() {
    Node b = {2, nullptr};
    Node a = {1, &b};
    b.next = &a;
    Node* cur = &a;
    for (int i = 0; i < 3; i++) {
        cout << cur->id << " ";
        cur = cur->next;
    }
    cout << endl;
    return 0;
}
`,
      explain: 'To form a two-node circle, `b.next` must link back to `&a`. Linking to `&b` traps traversal at node 2.',
    },
    {
      id: 'dsa-u3-l2-pred2',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard): Trace a 3-node circular list traversal advancing 2 hops per iteration for 3 steps.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node c = {30, nullptr};
    Node b = {20, &c};
    Node a = {10, &b};
    c.next = &a;
    Node* cur = &a;
    int sum = 0;
    for (int i = 0; i < 3; i++) {
        cur = cur->next->next;
        sum += cur->val;
    }
    cout << sum << endl;
    return 0;
}
`,
      explain: 'From a(10), 2 hops reach c(30, sum=30). 2 hops from c reach b(20, sum=50). 2 hops from b reach a(10, sum=60). Output is 60.',
    },
    {
      id: 'dsa-u3-l2-pred3',
      kind: 'predict',
      prompt: 'Stair 6 (Complex Logic): Trace successive node eliminations in a 3-node circular list until a single self-loop remains.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int id;
    Node* next;
};

int main() {
    Node c = {3, nullptr};
    Node b = {2, &c};
    Node a = {1, &b};
    c.next = &a;
    a.next = b.next;
    a.next = c.next;
    cout << a.id << " " << a.next->id << endl;
    return 0;
}
`,
      explain: 'Initial circle: 1 -> 2 -> 3 -> 1. First elimination: a.next = b.next (3), resulting in 1 -> 3 -> 1. Second elimination: a.next = c.next (1), so node 1 points directly to itself. Output is "1 1".',
    },
  ],
  cheatsheet: [
    { code: 'tail->next = head;', text: 'completes the circular link' },
    { code: 'do { cur = cur->next; } while (cur != head);', text: 'traverses all nodes of a circular list exactly once' },
    { code: 'Never check cur == nullptr', text: 'circular lists have no null terminator' },
  ],
};

const DSA_U3_CP: Level = {
  id: 'checkpoint-dsa-dll',
  kind: 'revision',
  title: 'Doubly & Circular Lists',
  tagline: 'Consolidate two-way linked list structures, cycle detection, and pointer updates.',
  objectives: [
    'Update 4 pointers simultaneously during DLL node insertion',
    'Detect and traverse circular list structures',
    'Conquer the Gold Exam Challenge Box on advanced list questions',
  ],
  practice: [
    {
      id: 'dsa-cp3-mcq1',
      kind: 'mcq',
      prompt: 'In a circular doubly linked list with a single node `head`, what do `head->next` and `head->prev` point to?',
      options: ['nullptr', 'head itself', 'Uninitialized garbage', '0'],
      answer: 1,
      explain: 'With a single node in a circular doubly linked list, both its next and prev pointers point back to the node itself.',
    },
    {
      id: 'dsa-cp3-pred1',
      kind: 'predict',
      prompt: 'Predict the console output of this doubly linked list arithmetic:',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node* prev;
};

int main() {
    Node a = {5, nullptr, nullptr};
    Node b = {15, nullptr, &a};
    a.next = &b;
    cout << a.next->val + b.prev->val << endl;
    return 0;
}
`,
      explain: 'a.next->val is 15; b.prev->val is 5. 15 + 5 = 20. Prints 20.',
    },
    {
      id: 'dsa-cp3-count1',
      kind: 'count',
      prompt: 'How many times does the addition inside the loop execute?',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int id;
    Node* next;
};

int main() {
    Node b = {2, nullptr};
    Node a = {1, &b};
    b.next = &a;
    Node* p = &a;
    int sum = 0;
    for (int i = 0; i < 4; i++) {
        sum += p->id;
        p = p->next;
    }
    cout << sum << endl;
    return 0;
}
`,
      count: { line: 16 },
      unit: 'times',
      explain: 'Loop runs 4 times over the circular 2-node list. Line 16 executes 4 times.',
    },
    {
      id: 'dsa-cp3-mcq2',
      kind: 'mcq',
      prompt: 'Compared to a singly linked list with N nodes, how many extra pointer variables are stored across the entire list in a doubly linked list?',
      options: ['N extra pointers (one prev pointer per node)', '2N extra pointers', '0 extra pointers', '1 extra pointer'],
      answer: 0,
      explain: 'Each node in a doubly linked list has a `prev` pointer in addition to its `next` pointer, adding N pointer variables in total.',
    },
    {
      id: 'dsa-cp3-pred2',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard / Complex Logic): Trace a 2-node DLL pointer swap reversal.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node* prev;
};

int main() {
    Node b = {20, nullptr, nullptr};
    Node a = {10, &b, nullptr};
    b.prev = &a;
    Node* temp = a.next;
    a.next = a.prev;
    a.prev = temp;
    temp = b.next;
    b.next = b.prev;
    b.prev = temp;
    Node* head = &b;
    cout << head->val << " " << head->next->val << endl;
    return 0;
}
`,
      explain: 'Swapping next and prev pointers for every node reverses the DLL. Node b becomes the new head (20), and its next points to a (10). Output is "20 10".',
    },
    {
      id: 'dsa-cp3-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 17 incorrectly assigns a.next to c.next instead of b.next when deleting node b.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node* prev;
};

int main() {
    Node c = {30, nullptr, nullptr};
    Node b = {20, &c, nullptr};
    Node a = {10, &b, nullptr};
    b.prev = &a;
    c.prev = &b;
    a.next = c.next;
    c.prev = &a;
    if (a.next != nullptr) cout << a.next->val << endl;
    else cout << 0 << endl;
    return 0;
}
`,
      bugLine: 17,
      options: [
        'Deleting middle node b requires `a.next = b.next;` so a points to c; setting `a.next = c.next;` mistakenly links a to nullptr',
        'Node c cannot point back to a',
        'b.prev must be nullptr',
        'main cannot return 0',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node* prev;
};

int main() {
    Node c = {30, nullptr, nullptr};
    Node b = {20, &c, nullptr};
    Node a = {10, &b, nullptr};
    b.prev = &a;
    c.prev = &b;
    a.next = b.next;
    c.prev = &a;
    if (a.next != nullptr) cout << a.next->val << endl;
    else cout << 0 << endl;
    return 0;
}
`,
      explain: 'To bypass node b, `a.next` must take `b.next` (node c, val 30). In the buggy code, `a.next = c.next` set it to nullptr (0).',
    },
  ],
  exam: {
    title: 'Gold Exam Challenge: FAST Doubly & Circular List Exams',
    intro: 'Past FAST-NUCES exam questions on doubly linked lists, circular structures, and pointer manipulation.',
    questions: [
      {
        id: 'dsa-gold-u3-q1',
        kind: 'predict',
        source: 'FAST DSA Midterm · Spring 2024',
        tag: 'exam',
        prompt: 'Predict the console output of this doubly linked list manipulation:',
        code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node* prev;
};

int main() {
    Node a = {5, nullptr, nullptr};
    Node b = {15, nullptr, &a};
    a.next = &b;
    cout << a.next->data + b.prev->data << endl;
    return 0;
}
`,
        explain: 'a.next->data is 15; b.prev->data is 5. 15 + 5 = 20. Prints 20.',
      },
      {
        id: 'dsa-gold-u3-q2',
        kind: 'predict',
        source: 'FAST DSA Midterm · Fall 2023',
        tag: 'exam',
        prompt: 'Predict the console output when deleting the head node of a circular list:',
        code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
};

int main() {
    Node c = {30, nullptr};
    Node b = {20, &c};
    Node a = {10, &b};
    c.next = &a;
    c.next = a.next;
    Node* head = &b;
    cout << head->val << " " << c.next->val << endl;
    return 0;
}
`,
        explain: 'c.next is updated to a.next (which is b). head is now b. Both head->val and c.next->val are 20. Prints "20 20".',
      },
      {
        id: 'dsa-gold-u3-q3',
        kind: 'mcq',
        source: 'FAST DSA Midterm · Spring 2023',
        tag: 'exam',
        prompt: 'When deleting an arbitrary node `X` in a doubly linked list given a direct pointer to `X`, what is the time complexity?',
        options: [
          'O(1) constant time, because X->prev and X->next are directly available without traversal',
          'O(N) linear time to find the predecessor',
          'O(log N) logarithmic time',
          'O(N^2) quadratic time',
        ],
        answer: 0,
        explain: 'In a DLL, you can reach the predecessor via `X->prev` and the successor via `X->next` in O(1) time without searching.',
      },
      {
        id: 'dsa-gold-u3-q4',
        kind: 'predict',
        source: 'FAST DSA Midterm · Fall 2022',
        tag: 'exam',
        prompt: 'Predict the output of eliminating node 2 in a 3-node circular list:',
        code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int id;
    Node* next;
};

int main() {
    Node c = {3, nullptr};
    Node b = {2, &c};
    Node a = {1, &b};
    c.next = &a;
    a.next = b.next;
    cout << a.id << " " << a.next->id << endl;
    return 0;
}
`,
        explain: 'a originally pointed to b. By setting `a.next = b.next;`, a now points directly to c. Prints "1 3".',
      },
      {
        id: 'dsa-gold-u3-q5',
        kind: 'mcq',
        source: 'FAST DSA Midterm · Spring 2021',
        tag: 'exam',
        prompt: 'How many pointer links must be reassigned when inserting a new node into a circular doubly linked list between two nodes?',
        options: ['4 pointer links', '2 pointer links', '1 pointer link', '6 pointer links'],
        answer: 0,
        explain: 'Exactly 4 links: `newNode->prev`, `newNode->next`, `prevNode->next`, and `nextNode->prev`.',
      },
    ],
  },
};

// =====================================================================================
// UNIT 4: Stacks & Applications
// =====================================================================================

const DSA_U4_L1: Level = {
  id: 'dsa-stack-lifo',
  kind: 'lesson',
  title: 'Stacks: Last In, First Out (LIFO)',
  tagline: 'Like a stack of plates: you add to the top, and take from the top. Stacks power function call execution, undo operations, and expression evaluation.',
  minutes: 20,
  objectives: [
    'Understand the LIFO principle: Last In, First Out',
    'Implement a Stack using an array with push, pop, top, and isEmpty operations',
    'Detect stack overflow and stack underflow conditions',
  ],
  learn: [
    { t: 'p', text: 'A **Stack** is a linear data structure that restricts insertions and deletions to a single end called the **Top**. It follows the **LIFO (Last In, First Out)** principle.' },
    { t: 'syntax', title: 'Array-based Stack Implementation', code: cpp`
struct Stack {
    int arr[100];
    int top = -1; // -1 means stack is empty
};

void push(Stack &s, int val) {
    if (s.top < 99) s.arr[++s.top] = val;
}

int pop(Stack &s) {
    if (s.top >= 0) return s.arr[s.top--];
    return -1; // underflow
}`, parts: [
      { token: 'int top = -1;', text: 'tracks the index of the uppermost element' },
      { token: '++s.top', text: 'pre-increment: moves top up before writing value' },
      { token: 's.top--', text: 'post-decrement: returns top value before moving top down' },
    ] },
    { t: 'viz', title: 'Stack push and pop dry run', code: cpp`
#include <iostream>
using namespace std;

struct Stack {
    int arr[10];
    int top;
};

void push(Stack &s, int val) {
    s.arr[++s.top] = val;
}

int pop(Stack &s) {
    return s.arr[s.top--];
}

int main() {
    Stack st;
    st.top = -1;
    push(st, 10);
    push(st, 20);
    push(st, 30);
    cout << pop(st) << " ";
    cout << pop(st) << " ";
    cout << pop(st) << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Reverse a sequence of numbers using a stack.',
    intro: 'LIFO reversal.',
    items: [
      { title: 'Array stack reversal', code: cpp`
#include <iostream>
using namespace std;
int main() {
    int st[5];
    int top = -1;
    st[++top] = 1; st[++top] = 2; st[++top] = 3;
    while (top >= 0) {
        cout << st[top--] << " ";
    }
    cout << endl;
    return 0;
}` },
    ],
    takeaway: 'Popping all elements from a stack naturally reverses their insertion order.',
    check: {
      id: 'dsa-u4-l1-check',
      kind: 'mcq',
      prompt: 'If elements A, B, C are pushed onto a stack in that order, in what order will they be popped?',
      options: ['A, B, C', 'C, B, A', 'B, A, C', 'C, A, B'],
      answer: 1,
      explain: 'Because a stack is LIFO, the last element pushed (C) is popped first, followed by B, then A.',
    },
  },
  watch: [
    { title: 'Stack top tracking', intro: 'Watch top index increment and decrement.', code: cpp`
#include <iostream>
using namespace std;

int main() {
    int top = -1;
    int st[5];
    st[++top] = 42;
    cout << "Top val: " << st[top] << " Top idx: " << top << endl;
    top--;
    cout << "After pop, Top idx: " << top << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Tracing Stack State and Underflow Detection',
    problem: 'Push 10 and 20 onto an array stack, pop both values in LIFO order, and verify stack becomes empty (`top == -1`).',
    steps: [
      { text: 'Initialize empty stack: `top = -1`.', lines: [6] },
      { text: 'Push 10: pre-increment top to 0 and store 10.', lines: [7] },
      { text: 'Push 20: pre-increment top to 1 and store 20.', lines: [8] },
      { text: 'Pop topmost value (20), decrement top to 0.', lines: [9] },
      { text: 'Pop next value (10), decrement top to -1.', lines: [10] },
      { text: 'Check `top == -1` to confirm empty underflow state.', lines: [11] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

int main() {
    int st[5];
    int top = -1;
    st[++top] = 10;
    st[++top] = 20;
    int a = st[top--];
    int b = st[top--];
    cout << a << " " << b << " " << (top == -1) << endl;
    return 0;
}
`,
    why: 'Stacks enforce strict Last-In-First-Out ordering; access is strictly confined to the topmost index.',
  },
  practice: [
    {
      id: 'dsa-u4-l1-mcq1',
      kind: 'mcq',
      prompt: 'What condition occurs when you attempt to pop from an empty stack?',
      options: ['Stack Overflow', 'Stack Underflow', 'Segmentation Fault', 'Memory Leak'],
      answer: 1,
      explain: 'Attempting to pop or read from an empty stack is called Stack Underflow.',
    },
    {
      id: 'dsa-u4-l1-pred1',
      kind: 'predict',
      prompt: 'What will be printed when popping all elements from this stack?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int s[5];
    int top = -1;
    s[++top] = 1;
    s[++top] = 2;
    s[++top] = 3;
    while (top >= 0) {
        cout << s[top--] << " ";
    }
    cout << endl;
    return 0;
}
`,
      explain: 'Pushed: 1, 2, 3. Popped LIFO: 3, then 2, then 1. Prints "3 2 1 ".',
    },
    {
      id: 'dsa-u4-l1-count1',
      kind: 'count',
      prompt: 'How many times does `pushes++;` execute in this loop?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int st[10];
    int top = -1;
    int pushes = 0;
    for (int i = 1; i <= 4; i++) {
        st[++top] = i * 5;
        pushes++;
    }
    cout << pushes << endl;
    return 0;
}
`,
      count: { line: 10 },
      unit: 'times',
      explain: 'The for loop runs 4 times (i = 1 to 4). Line 10 executes exactly 4 times.',
    },
    {
      id: 'dsa-u4-l1-bug1',
      kind: 'bug',
      prompt: 'This code mistakenly uses `top + 1` instead of `++top`, failing to update the stack pointer. Identify the buggy line.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int st[5];
    int top = -1;
    st[top + 1] = 10;
    st[top + 1] = 20;
    cout << st[0] << " " << top << endl;
    return 0;
}
`,
      bugLine: 7,
      options: [
        '`st[top + 1] = 10;` does not modify `top`, so the second push overwrites index 0 instead of moving to index 1',
        'top must be initialized to 1',
        'st must be allocated dynamically with new',
        'main cannot declare an array',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

int main() {
    int st[5];
    int top = -1;
    st[++top] = 10;
    st[++top] = 20;
    cout << st[0] << " " << top << endl;
    return 0;
}
`,
      explain: 'The stack pointer must be incremented with `++top` during push; calculating `top + 1` without assignment leaves top unchanged at -1.',
    },
    {
      id: 'dsa-u4-l1-mcq2',
      kind: 'mcq',
      prompt: 'What is the time complexity of `push()`, `pop()`, and `peek()` in an array-based stack?',
      options: ['O(1) constant time', 'O(N) linear time', 'O(log N)', 'O(N^2)'],
      answer: 0,
      explain: 'All three operations access or mutate only the element at index `top`, taking O(1) constant time.',
    },
    {
      id: 'dsa-u4-l1-pred2',
      kind: 'predict',
      prompt: 'Stair 6 (Complex Logic): Trace interleaved push and pop operations with intermediate stack inspection.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int st[5];
    int top = -1;
    st[++top] = 10;
    st[++top] = 20;
    int x = st[top--];
    st[++top] = 30;
    st[++top] = 40;
    st[top--];
    cout << x << " " << st[top] << " " << top << endl;
    return 0;
}
`,
      explain: 'Push 10 (top=0), push 20 (top=1). Pop x = 20 (top=0). Push 30 (top=1), push 40 (top=2). Pop 40 (top=1). At the end, x=20, st[top]=30, top=1. Output is "20 30 1".',
    },
  ],
  cheatsheet: [
    { code: 'int top = -1;', text: 'empty stack indicator' },
    { code: 's[++top] = val;', text: 'push: pre-increment top index and assign' },
    { code: 'val = s[top--];', text: 'pop: read current top and post-decrement' },
    { code: 'O(1)', text: 'constant runtime for push, pop, and peek' },
  ],
};

const DSA_U4_L2: Level = {
  id: 'dsa-stack-applications',
  kind: 'lesson',
  title: 'Stack Applications: Balanced Brackets & Postfix',
  tagline: 'How compilers check code syntax: match opening and closing brackets, and evaluate postfix arithmetic expressions in one pass.',
  minutes: 25,
  objectives: [
    'Validate balanced parentheses ({[]}) using a stack',
    'Evaluate postfix expressions without operator precedence ambiguities',
    'Recognize stack patterns in syntax parsers',
  ],
  learn: [
    { t: 'p', text: 'Compilers use stacks to verify nested bracket syntax: push every opening bracket `(`, `[`, `{`. When a closing bracket arrives, pop the top of the stack — it MUST match!' },
    { t: 'syntax', title: 'Postfix Expression Evaluation with Stack', code: cpp`
// For each token:
// If operand (number): push onto stack
// If operator (+, -, *): pop b, pop a, compute a op b, push result`, parts: [
      { token: 'pop b then pop a', text: 'order matters: the second popped operand was on the left: a - b' },
      { token: 'push result', text: 'result becomes operand for subsequent operations' },
    ] },
    { t: 'viz', title: 'Parentheses validation simulation', code: cpp`
#include <iostream>
#include <string>
using namespace std;

bool isBalanced(string s) {
    char st[20];
    int top = -1;
    for (int i = 0; i < s.length(); i++) {
        char c = s[i];
        if (c == '(') st[++top] = c;
        else if (c == ')') {
            if (top == -1) return false;
            top--;
        }
    }
    return top == -1;
}

int main() {
    cout << "(()): " << isBalanced("(())") << endl;
    cout << "(: " << isBalanced("(") << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Evaluate simple postfix expression: 3 4 +',
    intro: 'Postfix evaluation.',
    items: [
      { title: 'Postfix evaluation with array stack', code: cpp`
#include <iostream>
using namespace std;
int main() {
    int st[10]; int top = -1;
    st[++top] = 3;
    st[++top] = 4;
    int b = st[top--];
    int a = st[top--];
    st[++top] = a + b;
    cout << "Result: " << st[top] << endl;
    return 0;
}` },
    ],
    takeaway: 'Postfix notation eliminates the need for parentheses and operator precedence rules.',
    check: {
      id: 'dsa-u4-l2-check',
      kind: 'mcq',
      prompt: 'What is the value of the postfix expression `5 2 3 * +`?',
      options: ['21', '11', '25', '30'],
      answer: 1,
      explain: '2 and 3 are multiplied first: 2 * 3 = 6. Then 5 is added: 5 + 6 = 11.',
    },
  },
  watch: [
    { title: 'Postfix step trace', intro: 'Tracking stack contents during evaluation.', code: cpp`
#include <iostream>
using namespace std;

int main() {
    int st[5]; int top = -1;
    st[++top] = 10;
    st[++top] = 4;
    // subtraction
    int b = st[top--];
    int a = st[top--];
    st[++top] = a - b;
    cout << "10 4 - = " << st[top] << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Tracing Postfix Arithmetic Evaluation',
    problem: 'Trace postfix expression evaluation for `6 2 / 3 +`. Watch operand pops and intermediate results.',
    steps: [
      { text: 'Push operands 6 and 2 onto stack.', lines: [7, 8] },
      { text: 'Operator `/`: pop b1=2 and a1=6, push result 6/2 = 3.', lines: [9, 10, 11] },
      { text: 'Push operand 3 onto stack.', lines: [12] },
      { text: 'Operator `+`: pop b2=3 and a2=3, push result 3+3 = 6.', lines: [13, 14, 15] },
      { text: 'Final result is atop stack: 6.', lines: [16] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

int main() {
    int st[5];
    int top = -1;
    st[++top] = 6;
    st[++top] = 2;
    int b1 = st[top--];
    int a1 = st[top--];
    st[++top] = a1 / b1;
    st[++top] = 3;
    int b2 = st[top--];
    int a2 = st[top--];
    st[++top] = a2 + b2;
    cout << st[top] << endl;
    return 0;
}
`,
    why: 'Postfix evaluation eliminates all parentheses and precedence ambiguity by placing operators immediately after their operands.',
  },
  practice: [
    {
      id: 'dsa-u4-l2-pred1',
      kind: 'predict',
      prompt: 'What will be printed by this program?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int st[5]; int top = -1;
    st[++top] = 2;
    st[++top] = 3;
    st[++top] = 4;
    int c = st[top--];
    int b = st[top--];
    st[++top] = b * c;
    int a = st[top--];
    int res = a + st[top--];
    cout << res << endl;
    return 0;
}
`,
      explain: 'b = 3, c = 4 -> b * c = 12 pushed. Then a = 12 popped, and 2 popped from bottom. 12 + 2 = 14.',
    },
    {
      id: 'dsa-u4-l2-mcq1',
      kind: 'mcq',
      prompt: 'In converting infix `A + B * C` to postfix, which operator is placed first in postfix output?',
      options: ['*', '+', 'A', 'Depends on compiler'],
      answer: 0,
      explain: 'Multiplication has higher precedence than addition, so `B * C` is evaluated first: `A B C * +`.',
    },
    {
      id: 'dsa-u4-l2-count1',
      kind: 'count',
      prompt: 'How many matching closing brackets are processed in this sequence?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    char brackets[6] = {'(', '(', ')', '(', ')', ')'};
    int top = -1;
    int matched = 0;
    for (int i = 0; i < 6; i++) {
        if (brackets[i] == '(') {
            top++;
        } else if (brackets[i] == ')') {
            top--;
            matched++;
        }
    }
    cout << matched << endl;
    return 0;
}
`,
      count: { line: 13 },
      unit: 'times',
      explain: 'There are 3 closing brackets `)`. Line 13 executes exactly 3 times.',
    },
    {
      id: 'dsa-u4-l2-bug1',
      kind: 'bug',
      prompt: 'This postfix evaluator mistakenly computes `b - a` instead of `a - b`. Identify the buggy line.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int st[5];
    int top = -1;
    st[++top] = 10;
    st[++top] = 4;
    int b = st[top--];
    int a = st[top--];
    st[++top] = b - a;
    cout << st[top] << endl;
    return 0;
}
`,
      bugLine: 11,
      options: [
        'The operator operands are reversed; it must be `st[++top] = a - b;`',
        'top must be reset to 0',
        'st must hold floats',
        '10 and 4 cannot be pushed onto stack',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

int main() {
    int st[5];
    int top = -1;
    st[++top] = 10;
    st[++top] = 4;
    int b = st[top--];
    int a = st[top--];
    st[++top] = a - b;
    cout << st[top] << endl;
    return 0;
}
`,
      explain: 'The first popped value `b` was the right-hand operand, and the second popped value `a` was the left-hand operand. Therefore, compute `a - b`.',
    },
    {
      id: 'dsa-u4-l2-pred2',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard): Trace multi-operator postfix expression evaluation: `5 1 2 + 4 * + 3 -`.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int st[10];
    int top = -1;
    st[++top] = 5;
    st[++top] = 1;
    st[++top] = 2;
    int b = st[top--]; int a = st[top--];
    st[++top] = a + b;
    st[++top] = 4;
    b = st[top--]; a = st[top--];
    st[++top] = a * b;
    b = st[top--]; a = st[top--];
    st[++top] = a + b;
    st[++top] = 3;
    b = st[top--]; a = st[top--];
    st[++top] = a - b;
    cout << st[top] << endl;
    return 0;
}
`,
      explain: '1 + 2 = 3. 3 * 4 = 12. 5 + 12 = 17. 17 - 3 = 14. Top of stack holds 14. Output is 14.',
    },
    {
      id: 'dsa-u4-l2-pred3',
      kind: 'predict',
      prompt: 'Stair 6 (Complex Logic): Trace max nesting depth and final balance state of brackets using a stack depth counter.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int maxDepth = 0;
    int curDepth = 0;
    char s[6] = {'(', '(', ')', '(', '(', ')'};
    for (int i = 0; i < 6; i++) {
        if (s[i] == '(') {
            curDepth++;
            if (curDepth > maxDepth) maxDepth = curDepth;
        } else if (s[i] == ')') {
            curDepth--;
        }
    }
    cout << maxDepth << " " << curDepth << endl;
    return 0;
}
`,
      explain: 'Opening brackets increase depth up to a maximum of 3. After the last closing bracket, curDepth remains 2 (unbalanced string). Output is "3 2".',
    },
  ],
  cheatsheet: [
    { code: 'Parentheses matching', text: 'push opening bracket, pop on closing; empty stack at end means balanced' },
    { code: 'Postfix evaluation', text: 'operands pushed; operator pops 2 operands: op2 then op1, pushes op1 op op2' },
  ],
};

const DSA_U4_CP: Level = {
  id: 'checkpoint-dsa-stacks',
  kind: 'revision',
  title: 'Stacks & Applications',
  tagline: 'Review LIFO mechanics, overflow/underflow handling, and expression evaluation.',
  objectives: [
    'Identify valid stack sequences and states',
    'Evaluate postfix expressions and bracket balance',
    'Conquer the Gold Exam Challenge Box on FAST stack exams',
  ],
  practice: [
    {
      id: 'dsa-cp4-mcq1',
      kind: 'mcq',
      prompt: 'Which data structure is primarily used by a compiler to implement recursion and function calls?',
      options: ['Queue', 'Stack (Call Stack)', 'Heap', 'Graph'],
      answer: 1,
      explain: 'Function calls and local variables are pushed onto and popped from the system Call Stack.',
    },
    {
      id: 'dsa-cp4-pred1',
      kind: 'predict',
      prompt: 'Predict the console output of this stack reversal routine:',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int s[3];
    int top = -1;
    s[++top] = 100;
    s[++top] = 200;
    cout << s[top--] << " " << s[top--] << endl;
    return 0;
}
`,
      explain: 'First pops 200, then pops 100. Prints "200 100".',
    },
    {
      id: 'dsa-cp4-count1',
      kind: 'count',
      prompt: 'How many elements are popped from the stack during this loop?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int s[5] = {1, 2, 3, 4, 5};
    int top = 4;
    int pops = 0;
    while (top >= 0) {
        top--;
        pops++;
    }
    cout << pops << endl;
    return 0;
}
`,
      count: { line: 11 },
      unit: 'times',
      explain: 'Initial top = 4 (5 elements). The while loop runs 5 times (top = 4 down to 0). Line 11 executes 5 times.',
    },
    {
      id: 'dsa-cp4-mcq2',
      kind: 'mcq',
      prompt: 'If elements 1, 2, 3 are pushed in order into a stack, which output permutation can NEVER be produced?',
      options: ['3, 1, 2', '1, 2, 3', '2, 1, 3', '3, 2, 1'],
      answer: 0,
      explain: 'To output 3 first, 1, 2, and 3 must all be in the stack. Popping 3 leaves 2 directly on top of 1; thus 2 MUST be popped before 1. [3, 1, 2] is impossible.',
    },
    {
      id: 'dsa-cp4-pred2',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard): Trace two independent stacks stored in opposite ends of a single 6-element array.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int arr[6];
    int top1 = -1;
    int top2 = 6;
    arr[++top1] = 10;
    arr[++top1] = 20;
    arr[--top2] = 100;
    arr[--top2] = 200;
    arr[--top2] = 300;
    int freeSlots = top2 - top1 - 1;
    cout << arr[top1] << " " << arr[top2] << " " << freeSlots << endl;
    return 0;
}
`,
      explain: 'Stack 1 top is at index 1 (value 20). Stack 2 top is at index 3 (value 300). Free slots between them = 3 - 1 - 1 = 1 slot (index 2). Output is "20 300 1".',
    },
    {
      id: 'dsa-cp4-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 10 inspects the top element without decrementing the stack pointer, causing the next push to overwrite index 2 instead of index 1.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int s[5];
    int top = -1;
    s[++top] = 10;
    s[++top] = 20;
    int val = s[top];
    s[++top] = 30;
    cout << val << " " << s[top] << " " << top << endl;
    return 0;
}
`,
      bugLine: 10,
      options: [
        'Popping from a stack must decrement the top pointer: `int val = s[top--];`, otherwise top stays at 1',
        's must hold chars',
        'top must start at 0',
        'cout cannot format 3 variables',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

int main() {
    int s[5];
    int top = -1;
    s[++top] = 10;
    s[++top] = 20;
    int val = s[top--];
    s[++top] = 30;
    cout << val << " " << s[top] << " " << top << endl;
    return 0;
}
`,
      explain: '`s[top]` is peek (does not pop); `s[top--]` decrements top from 1 to 0, so the subsequent `s[++top] = 30;` reuses index 1. Outputs differ: "20 30 2" vs "20 30 1".',
    },
  ],
  exam: {
    title: 'Gold Exam Challenge: FAST Stack Past Papers',
    intro: 'Past exam problems on stack operations, parentheses verification, and postfix evaluation.',
    questions: [
      {
        id: 'dsa-gold-u4-q1',
        kind: 'predict',
        source: 'FAST DSA Midterm · Fall 2023',
        tag: 'exam',
        prompt: 'Predict the console output of this stack sequence:',
        code: cpp`
#include <iostream>
using namespace std;

int main() {
    int s[10]; int t = -1;
    s[++t] = 5;
    s[++t] = 10;
    int v = s[t--];
    s[++t] = 20;
    cout << v << " " << s[t] << endl;
    return 0;
}
`,
        explain: 'v pops 10. Then 20 is pushed. Console prints 10 20.',
      },
      {
        id: 'dsa-gold-u4-q2',
        kind: 'predict',
        source: 'FAST DSA Midterm · Spring 2024',
        tag: 'exam',
        prompt: 'Predict the result of evaluating this postfix expression: `3 4 2 * +`',
        code: cpp`
#include <iostream>
using namespace std;

int main() {
    int s[5]; int top = -1;
    s[++top] = 3;
    s[++top] = 4;
    s[++top] = 2;
    int op2 = s[top--];
    int op1 = s[top--];
    s[++top] = op1 * op2;
    int r2 = s[top--];
    int r1 = s[top--];
    s[++top] = r1 + r2;
    cout << s[top] << endl;
    return 0;
}
`,
        explain: 'op1 * op2 = 4 * 2 = 8. Then r1 + r2 = 3 + 8 = 11. Prints 11.',
      },
      {
        id: 'dsa-gold-u4-q3',
        kind: 'mcq',
        source: 'FAST DSA Midterm · Fall 2022',
        tag: 'exam',
        prompt: 'Given input sequence [A, B, C], which of the following output permutations is IMPOSSIBLE to achieve with a single stack?',
        options: ['C, A, B', 'B, A, C', 'A, B, C', 'C, B, A'],
        answer: 0,
        explain: 'When C is popped, both A and B are in the stack with B at the top. Hence B must be popped before A. C, A, B is impossible.',
      },
      {
        id: 'dsa-gold-u4-q4',
        kind: 'predict',
        source: 'FAST DSA Midterm · Spring 2023',
        tag: 'exam',
        prompt: 'Predict the console output of this stack minimum tracker:',
        code: cpp`
#include <iostream>
using namespace std;

int main() {
    int s[10]; int top = -1;
    int minVal = 999;
    int data[4] = {5, 2, 7, 1};
    for (int i = 0; i < 4; i++) {
        s[++top] = data[i];
        if (data[i] < minVal) minVal = data[i];
    }
    cout << s[top] << " " << minVal << endl;
    return 0;
}
`,
        explain: 'The top of the stack holds the last pushed item (1). The minimum encountered is also 1. Prints "1 1".',
      },
      {
        id: 'dsa-gold-u4-q5',
        kind: 'mcq',
        source: 'FAST DSA Midterm · Fall 2021',
        tag: 'exam',
        prompt: 'When implementing two independent stacks inside a single array of size N, what is the optimal design to maximize space utilization?',
        options: [
          'Stack 1 starts at index 0 and grows right; Stack 2 starts at index N-1 and grows left towards the center',
          'Divide array into fixed halves 0..N/2-1 and N/2..N-1',
          'Store Stack 1 at even indices and Stack 2 at odd indices',
          'Allocate a new array on every push',
        ],
        answer: 0,
        explain: 'Growing both stacks towards each other from opposite ends allows either stack to use all available free memory until they collide, completely eliminating false overflow.',
      },
    ],
  },
};

// =====================================================================================
// UNIT 5: Queues & Circular Buffers
// =====================================================================================

const DSA_U5_L1: Level = {
  id: 'dsa-queue-fifo',
  kind: 'lesson',
  title: 'Queues: First In, First Out (FIFO)',
  tagline: 'Like a line of people at a ticket counter: the first to arrive is the first served. Queues coordinate printer jobs, CPU processes, and BFS traversals.',
  minutes: 20,
  objectives: [
    'Understand the FIFO principle: First In, First Out',
    'Implement a Queue with front and rear pointers',
    'Enqueue at the rear and dequeue from the front in O(1)',
  ],
  learn: [
    { t: 'p', text: 'A **Queue** is a linear data structure where elements are inserted at one end (**Rear**) and deleted from the other end (**Front**). This guarantees **FIFO (First In, First Out)** fairness.' },
    { t: 'syntax', title: 'Linear Queue Structure', code: cpp`
struct Queue {
    int arr[100];
    int front = 0;
    int rear = 0;
};

void enqueue(Queue &q, int val) {
    q.arr[q.rear++] = val;
}

int dequeue(Queue &q) {
    return q.arr[q.front++];
}`, parts: [
      { token: 'q.rear++', text: 'inserts new item at rear and advances rear' },
      { token: 'q.front++', text: 'removes oldest item from front and advances front' },
    ] },
    { t: 'viz', title: 'Queue FIFO simulation', code: cpp`
#include <iostream>
using namespace std;

struct Queue {
    int arr[10];
    int front;
    int rear;
};

void push(Queue &q, int val) {
    q.arr[q.rear++] = val;
}

int pop(Queue &q) {
    return q.arr[q.front++];
}

int main() {
    Queue q = {{0}, 0, 0};
    push(q, 10);
    push(q, 20);
    push(q, 30);
    cout << pop(q) << " ";
    cout << pop(q) << " ";
    cout << pop(q) << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Process jobs in arrival order.',
    intro: 'FIFO ordering.',
    items: [
      { title: 'Array queue processing', code: cpp`
#include <iostream>
using namespace std;
int main() {
    int q[5] = {101, 102, 103};
    int front = 0, rear = 3;
    while (front < rear) {
        cout << "Serving: " << q[front++] << endl;
    }
    return 0;
}` },
    ],
    takeaway: 'FIFO ensures fair, starvation-free ordering of tasks.',
    check: {
      id: 'dsa-u5-l1-check',
      kind: 'mcq',
      prompt: 'If elements 10, 20, 30 are enqueued into an empty queue, which element is removed first upon dequeue?',
      options: ['30', '20', '10', 'Random'],
      answer: 2,
      explain: 'Because queues are FIFO (First In, First Out), 10 was inserted first and will be dequeued first.',
    },
  },
  watch: [
    { title: 'Front and rear pointer tracking', intro: 'Notice front and rear marching forward.', code: cpp`
#include <iostream>
using namespace std;

int main() {
    int front = 0, rear = 0;
    int q[5];
    q[rear++] = 99;
    cout << "Front: " << front << " Rear: " << rear << endl;
    int val = q[front++];
    cout << "Dequeued: " << val << " Front now: " << front << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Tracing FIFO Queue Mechanics',
    problem: 'Enqueue 10 and 20 into a linear queue, dequeue the first element, and verify that 10 is served first and 20 remains at the new front.',
    steps: [
      { text: 'Initialize empty queue with `front = 0` and `rear = 0`.', lines: [6] },
      { text: 'Enqueue 10 at rear (index 0), advance rear to 1.', lines: [7] },
      { text: 'Enqueue 20 at rear (index 1), advance rear to 2.', lines: [8] },
      { text: 'Dequeue from front (index 0), advance front to 1 (returns 10).', lines: [9] },
      { text: 'Read new front element (index 1), which is 20.', lines: [10] },
      { text: 'Print dequeued value and new front value.', lines: [11] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

int main() {
    int q[5];
    int front = 0, rear = 0;
    q[rear++] = 10;
    q[rear++] = 20;
    int firstOut = q[front++];
    int nextFront = q[front];
    cout << firstOut << " " << nextFront << " " << front << " " << rear << endl;
    return 0;
}
`,
    why: 'Queues enforce First-In-First-Out ordering; items leave in the exact order they arrive.',
  },
  practice: [
    {
      id: 'dsa-u5-l1-mcq1',
      kind: 'mcq',
      prompt: 'What problem occurs in a simple linear array queue when rear reaches the end of the array even though front has moved forward?',
      options: [
        'Memory corruption',
        'False overflow: rear cannot insert even though space exists at the front',
        'Stack overflow',
        'Array dimensions flip',
      ],
      answer: 1,
      explain: 'In a simple linear array queue, `rear` hits `MAX-1` while dequeued slots at index 0..(front-1) sit empty and wasted (false overflow).',
    },
    {
      id: 'dsa-u5-l1-pred1',
      kind: 'predict',
      prompt: 'What will be printed by this queue operations sequence?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int q[5];
    int f = 0, r = 0;
    q[r++] = 5;
    q[r++] = 15;
    int a = q[f++];
    q[r++] = 25;
    cout << a << " " << q[f] << endl;
    return 0;
}
`,
      explain: 'a dequeues 5 (at f=0). f becomes 1. 25 is enqueued at r=2. q[f] is q[1] which holds 15. Outputs "5 15".',
    },
    {
      id: 'dsa-u5-l1-count1',
      kind: 'count',
      prompt: 'How many items are dequeued during this queue processing loop?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int q[10];
    int front = 0, rear = 0;
    int served = 0;
    for (int i = 0; i < 4; i++) {
        q[rear++] = i * 10;
    }
    while (front < rear) {
        front++;
        served++;
    }
    cout << served << endl;
    return 0;
}
`,
      count: { line: 13 },
      unit: 'times',
      explain: '4 items were enqueued (rear=4). The while loop runs 4 times until front reaches 4. Line 13 executes 4 times.',
    },
    {
      id: 'dsa-u5-l1-bug1',
      kind: 'bug',
      prompt: 'This dequeue operation mistakenly takes from the rear instead of front, turning the queue into a LIFO stack. Identify the buggy line.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int q[5];
    int front = 0, rear = 0;
    q[rear++] = 10;
    q[rear++] = 20;
    int val = q[--rear];
    cout << val << endl;
    return 0;
}
`,
      bugLine: 9,
      options: [
        'Dequeue must read from front: `int val = q[front++];`, not rear',
        'front must be initialized to 1',
        'rear cannot be incremented',
        'q must hold strings',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

int main() {
    int q[5];
    int front = 0, rear = 0;
    q[rear++] = 10;
    q[rear++] = 20;
    int val = q[front++];
    cout << val << endl;
    return 0;
}
`,
      explain: 'Queues are First-In-First-Out: items enter at `rear` and exit from `front`. Reading `--rear` behaves like a stack.',
    },
    {
      id: 'dsa-u5-l1-mcq2',
      kind: 'mcq',
      prompt: 'What is the time complexity of enqueue and dequeue in an array-based queue when using front and rear pointers?',
      options: ['O(1) constant time', 'O(N) linear time', 'O(log N)', 'O(N^2)'],
      answer: 0,
      explain: 'Both operations simply read/write at the pointer index and increment the pointer in O(1) time without shifting.',
    },
    {
      id: 'dsa-u5-l1-pred2',
      kind: 'predict',
      prompt: 'Stair 6 (Complex Logic): Trace interleaved enqueue and dequeue operations tracking the active queue size and current front element.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int q[6];
    int front = 0, rear = 0;
    q[rear++] = 10;
    q[rear++] = 20;
    int a = q[front++];
    q[rear++] = 30;
    q[rear++] = 40;
    int b = q[front++];
    int currentSize = rear - front;
    cout << a << " " << b << " " << q[front] << " " << currentSize << endl;
    return 0;
}
`,
      explain: 'Enqueue 10, 20 (rear=2). Dequeue a=10 (front=1). Enqueue 30, 40 (rear=4). Dequeue b=20 (front=2). Current front is q[2] = 30. Size = 4 - 2 = 2. Output is "10 20 30 2".',
    },
  ],
  cheatsheet: [
    { code: 'front = 0, rear = 0;', text: 'queue pointers: front (exit) and rear (entry)' },
    { code: 'q[rear++] = val;', text: 'enqueue at rear: O(1)' },
    { code: 'val = q[front++];', text: 'dequeue from front: O(1)' },
    { code: 'False overflow', text: 'rear hits capacity while front slots are vacant' },
  ],
};

const DSA_U5_L2: Level = {
  id: 'dsa-circular-queue',
  kind: 'lesson',
  title: 'Circular Queues: Modulo Index Wrapping',
  tagline: 'Solve the false overflow problem! Use the modulo operator `%` to wrap pointers back to index 0, turning a linear array into a continuous ring buffer.',
  minutes: 20,
  objectives: [
    'Understand why modulo arithmetic `(index + 1) % MAX` wraps around',
    'Implement a Circular Queue ring buffer',
    'Differentiate between full queue and empty queue conditions',
  ],
  learn: [
    { t: 'p', text: 'To reuse empty slots at the beginning of an array, a **Circular Queue** wraps `rear` and `front` back to `0` when they reach `MAX - 1` using the formula: `next = (current + 1) % MAX`.' },
    { t: 'syntax', title: 'Circular Queue Modulo Indexing', code: cpp`
const int MAX = 5;

void enqueue(int val) {
    if (count == MAX) {
        cout << "Queue is Full!" << endl;
        return;
    }
    arr[rear] = val;
    rear = (rear + 1) % MAX; // wraps 4 -> 0
    count++;
}`, parts: [
      { token: '(rear + 1) % MAX', text: 'wraps index back to 0 when rear reaches MAX' },
      { token: 'count', text: 'tracks exact element count to cleanly differentiate full from empty' },
    ] },
    { t: 'viz', title: 'Circular queue wrap-around trace', code: cpp`
#include <iostream>
using namespace std;

struct CircQ {
    int arr[3];
    int front;
    int rear;
    int count;
};

void enq(CircQ &q, int val) {
    if (q.count < 3) {
        q.arr[q.rear] = val;
        q.rear = (q.rear + 1) % 3;
        q.count++;
    }
}

int deq(CircQ &q) {
    int val = q.arr[q.front];
    q.front = (q.front + 1) % 3;
    q.count--;
    return val;
}

int main() {
    CircQ q = {{0}, 0, 0, 0};
    enq(q, 10);
    enq(q, 20);
    cout << deq(q) << " ";
    enq(q, 30);
    enq(q, 40); // wraps around to index 0!
    cout << deq(q) << " " << deq(q) << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Demonstrate modulo wrapping from index 4 to 0.',
    intro: 'Modulo wrapping.',
    items: [
      { title: 'Modulo increment', code: cpp`
#include <iostream>
using namespace std;
int main() {
    int idx = 4;
    idx = (idx + 1) % 5;
    cout << "Next index after 4 in cap 5: " << idx << endl;
    return 0;
}` },
    ],
    takeaway: 'Modulo `% MAX` prevents index out of bounds and recycles memory slots.',
    check: {
      id: 'dsa-u5-l2-check',
      kind: 'mcq',
      prompt: 'In an array of size 5, what is `(4 + 1) % 5`?',
      options: ['5', '0', '1', '4'],
      answer: 1,
      explain: '5 % 5 = 0, wrapping cleanly back to index 0.',
    },
  },
  watch: [
    { title: 'Circular queue index cycle', intro: 'Cycling indices: 0, 1, 2, 0, 1, 2.', code: cpp`
#include <iostream>
using namespace std;

int main() {
    int ptr = 0;
    for (int i = 0; i < 5; i++) {
        cout << ptr << " ";
        ptr = (ptr + 1) % 3;
    }
    cout << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Tracing Circular Queue Wrap-Around',
    problem: 'Enqueue two items, dequeue one to free index 0, and enqueue another item. Observe rear wrapping around to recycled index 0.',
    steps: [
      { text: 'Enqueue 10 at index 0, rear moves to 1.', lines: [7] },
      { text: 'Enqueue 20 at index 1, rear moves to 2.', lines: [8] },
      { text: 'Dequeue 10 from index 0, front moves to 1 (index 0 is now free).', lines: [9] },
      { text: 'Enqueue 30 at index 2, rear wraps to `(2 + 1) % 3 = 0`.', lines: [10] },
      { text: 'Print dequeued value and new rear/front indices.', lines: [11] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

int main() {
    int q[3];
    int front = 0, rear = 0, count = 0;
    q[rear] = 10; rear = (rear + 1) % 3; count++;
    q[rear] = 20; rear = (rear + 1) % 3; count++;
    int d = q[front]; front = (front + 1) % 3; count--;
    q[rear] = 30; rear = (rear + 1) % 3; count++;
    cout << d << " " << rear << " " << front << endl;
    return 0;
}
`,
    why: 'Modulo arithmetic `(index + 1) % capacity` recycles freed array slots at the front, eliminating false overflow.',
  },
  practice: [
    {
      id: 'dsa-u5-l2-pred1',
      kind: 'predict',
      prompt: 'What will be printed by this program?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int rear = 3;
    rear = (rear + 2) % 4;
    cout << rear << endl;
    return 0;
}
`,
      explain: '(3 + 2) % 4 = 5 % 4 = 1. Prints 1.',
    },
    {
      id: 'dsa-u5-l2-mcq1',
      kind: 'mcq',
      prompt: 'In a circular queue of size N that leaves 1 slot empty to differentiate full from empty, what is the full condition?',
      options: [
        '`(rear + 1) % N == front`',
        '`rear == front`',
        '`rear == N`',
        '`front == 0`',
      ],
      answer: 0,
      explain: 'When `(rear + 1) % N == front`, advancing rear by one would collide with front, signaling that the queue is full.',
    },
    {
      id: 'dsa-u5-l2-count1',
      kind: 'count',
      prompt: 'How many times does `rear` wrap around to index 0 in 7 increments?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int rear = 0;
    int wraps = 0;
    for (int i = 0; i < 7; i++) {
        rear = (rear + 1) % 3;
        if (rear == 0) wraps++;
    }
    cout << wraps << endl;
    return 0;
}
`,
      count: { line: 9 },
      unit: 'times',
      explain: 'rear values: 1, 2, 0 (1st wrap), 1, 2, 0 (2nd wrap), 1. Line 9 executes 2 times.',
    },
    {
      id: 'dsa-u5-l2-bug1',
      kind: 'bug',
      prompt: 'This code increments `rear` without wrapping modulo, causing index out of bounds. Identify the buggy line.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int q[3];
    int rear = 2;
    rear = rear + 1;
    cout << rear << endl;
    return 0;
}
`,
      bugLine: 7,
      options: [
        'Modulo wrapping `(rear + 1) % 3` is required to wrap from index 2 to 0 in an array of size 3',
        'rear must be initialized to 3',
        'q must hold doubles',
        'cout cannot print rear',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

int main() {
    int q[3];
    int rear = 2;
    rear = (rear + 1) % 3;
    cout << rear << endl;
    return 0;
}
`,
      explain: 'In a circular buffer of capacity 3, advancing from index 2 must wrap back to index 0 via `(rear + 1) % 3`.',
    },
    {
      id: 'dsa-u5-l2-pred2',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard): Trace multiple wrap-arounds in a 3-element circular buffer during enqueues and dequeues.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int q[3];
    int f = 0, r = 0;
    q[r] = 1; r = (r + 1) % 3;
    q[r] = 2; r = (r + 1) % 3;
    int x1 = q[f]; f = (f + 1) % 3;
    q[r] = 3; r = (r + 1) % 3;
    q[r] = 4; r = (r + 1) % 3;
    int x2 = q[f]; f = (f + 1) % 3;
    int x3 = q[f]; f = (f + 1) % 3;
    cout << x1 << " " << x2 << " " << x3 << " " << f << " " << r << endl;
    return 0;
}
`,
      explain: 'x1 dequeues 1 (f=1). 3 wraps to index 0, 4 goes to index 1. x2 dequeues q[1]=2 (f=2). x3 dequeues q[2]=3 (f wraps to 0). Final f=0, r=1. Output is "1 2 3 0 1".',
    },
    {
      id: 'dsa-u5-l2-pred3',
      kind: 'predict',
      prompt: 'Stair 6 (Complex Logic): Trace circular queue full and empty indicator expressions with sentinel capacity.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int cap = 4;
    int f = 0, r = 0;
    r = (r + 3) % cap;
    bool isFull = ((r + 1) % cap == f);
    f = (f + 1) % cap;
    bool isFullAfterDeq = ((r + 1) % cap == f);
    cout << isFull << " " << isFullAfterDeq << endl;
    return 0;
}
`,
      explain: 'With cap = 4, f = 0, r = 3: (3 + 1) % 4 == 0 == f, so isFull is 1 (true). After dequeue, f = 1: (3 + 1) % 4 == 0 != 1, so isFullAfterDeq is 0 (false). Output is "1 0".',
    },
  ],
  cheatsheet: [
    { code: 'rear = (rear + 1) % MAX;', text: 'circular enqueue: wraps to index 0' },
    { code: 'front = (front + 1) % MAX;', text: 'circular dequeue: recycles slot' },
    { code: '(rear + 1) % MAX == front', text: 'full condition when leaving one slot sentinel empty' },
  ],
};

const DSA_U5_CP: Level = {
  id: 'checkpoint-dsa-queues',
  kind: 'revision',
  title: 'Queues & Circular Buffers',
  tagline: 'Review FIFO mechanics, circular ring buffers, and queue bounds.',
  objectives: [
    'Track front and rear indices across wrap-around operations',
    'Detect full vs empty queue states',
    'Conquer the Gold Exam Challenge Box on FAST queue past papers',
  ],
  practice: [
    {
      id: 'dsa-cp5-mcq1',
      kind: 'mcq',
      prompt: 'What graph traversal algorithm uses a Queue as its primary working data structure?',
      options: [
        'Depth-First Search (DFS)',
        'Breadth-First Search (BFS)',
        'Binary Search',
        'QuickSort',
      ],
      answer: 1,
      explain: 'Breadth-First Search (BFS) explores nodes level-by-level using a FIFO Queue.',
    },
    {
      id: 'dsa-cp5-pred1',
      kind: 'predict',
      prompt: 'Predict the console output of this circular queue operation:',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int q[4];
    int f = 0, r = 0;
    q[r] = 10; r = (r + 1) % 4;
    q[r] = 20; r = (r + 1) % 4;
    int v = q[f]; f = (f + 1) % 4;
    cout << v << " " << q[f] << endl;
    return 0;
}
`,
      explain: 'v takes 10 (at index 0). f moves to index 1. q[f] reads 20. Prints "10 20".',
    },
    {
      id: 'dsa-cp5-count1',
      kind: 'count',
      prompt: 'How many items are processed through the circular queue loop?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int q[3];
    int f = 0, r = 0;
    int count = 0;
    for (int i = 0; i < 5; i++) {
        q[r] = i;
        r = (r + 1) % 3;
        int val = q[f];
        f = (f + 1) % 3;
        count++;
    }
    cout << count << endl;
    return 0;
}
`,
      count: { line: 14 },
      unit: 'times',
      explain: 'Loop runs 5 iterations. Each iteration enqueues and dequeues 1 item. Line 14 executes 5 times.',
    },
    {
      id: 'dsa-cp5-mcq2',
      kind: 'mcq',
      prompt: 'When implementing a Queue using two Stacks (inStack and outStack), what is the amortized cost per dequeue operation?',
      options: ['O(1) amortized', 'O(N) amortized', 'O(log N)', 'O(N^2)'],
      answer: 0,
      explain: 'Each element is pushed to inStack once, transferred to outStack once, and popped from outStack once. Over N operations, total work is O(N), giving O(1) amortized cost per operation.',
    },
    {
      id: 'dsa-cp5-pred2',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard): Trace BFS level-order exploration queue progression over 2 steps.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int q[10];
    int front = 0, rear = 0;
    q[rear++] = 1;
    int cur = q[front++];
    q[rear++] = 2;
    q[rear++] = 3;
    cur = q[front++];
    q[rear++] = 4;
    cout << q[front] << " " << (rear - front) << endl;
    return 0;
}
`,
      explain: 'Initially q=[1]. Step 1: pop 1, push 2, 3 -> q=[2, 3] (front=1, rear=3). Step 2: pop 2, push 4 -> q=[3, 4] (front=2, rear=4). Current front is 3. Remaining size is 4 - 2 = 2. Output is "3 2".',
    },
    {
      id: 'dsa-cp5-bug1',
      kind: 'bug',
      prompt: 'Stair 6 (Bug Hunt): Line 10 inspects the front element without incrementing the front pointer, returning duplicate data on next read.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int q[4];
    int f = 0, r = 0;
    q[r++] = 10;
    q[r++] = 20;
    int val1 = q[f];
    int val2 = q[f];
    cout << val1 << " " << val2 << endl;
    return 0;
}
`,
      bugLine: 10,
      options: [
        'Dequeuing an element must advance the front pointer: `int val1 = q[f++];`, otherwise f stays at 0',
        'r must be decremented',
        'q must hold floats',
        'cout cannot print two variables',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

int main() {
    int q[4];
    int f = 0, r = 0;
    q[r++] = 10;
    q[r++] = 20;
    int val1 = q[f++];
    int val2 = q[f];
    cout << val1 << " " << val2 << endl;
    return 0;
}
`,
      explain: '`q[f]` is peek; `q[f++]` dequeues and advances `f` from 0 to 1, allowing the next read to obtain the successor item (20). Outputs differ: "10 10" vs "10 20".',
    },
  ],
  exam: {
    title: 'Gold Exam Challenge: FAST Queue Past Papers',
    intro: 'Past exam problems on queue operations, circular array wrapping, and BFS queue tracking.',
    questions: [
      {
        id: 'dsa-gold-u5-q1',
        kind: 'predict',
        source: 'FAST DSA Midterm · Spring 2024',
        tag: 'exam',
        prompt: 'Predict the console output of this circular queue operation:',
        code: cpp`
#include <iostream>
using namespace std;

int main() {
    int q[4];
    int f = 0, r = 0;
    q[r] = 10; r = (r + 1) % 4;
    q[r] = 20; r = (r + 1) % 4;
    int v = q[f]; f = (f + 1) % 4;
    cout << v << " " << q[f] << endl;
    return 0;
}
`,
        explain: 'v takes 10 (at index 0). f moves to index 1. q[f] reads 20. Prints 10 20.',
      },
      {
        id: 'dsa-gold-u5-q2',
        kind: 'mcq',
        source: 'FAST DSA Midterm · Fall 2023',
        tag: 'exam',
        prompt: 'In an array-based circular queue of capacity MAX without a count variable, why is one array slot left deliberately empty when declared full?',
        options: [
          'To distinguish the full condition `(rear + 1) % MAX == front` from the empty condition `front == rear`',
          'Because index 0 cannot be accessed in C++',
          'To store a null terminator',
          'Required by processor alignment',
        ],
        answer: 0,
        explain: 'Without an empty sentinel slot or counter, both a completely full queue and an empty queue have `front == rear`. Leaving 1 slot empty makes full `(rear + 1) % MAX == front` distinct from empty `front == rear`.',
      },
      {
        id: 'dsa-gold-u5-q3',
        kind: 'predict',
        source: 'FAST DSA Midterm · Spring 2023',
        tag: 'exam',
        prompt: 'Predict the console output of this queue simulation using two stacks:',
        code: cpp`
#include <iostream>
using namespace std;

int main() {
    int inStack[5]; int topIn = -1;
    int outStack[5]; int topOut = -1;
    inStack[++topIn] = 1;
    inStack[++topIn] = 2;
    inStack[++topIn] = 3;
    while (topIn >= 0) {
        outStack[++topOut] = inStack[topIn--];
    }
    cout << outStack[topOut--] << " " << outStack[topOut--] << endl;
    return 0;
}
`,
        explain: 'Items pushed as 1, 2, 3. Inverting into outStack puts 1 at the top of outStack. First pop gives 1, second pop gives 2. Outputs "1 2".',
      },
      {
        id: 'dsa-gold-u5-q4',
        kind: 'mcq',
        source: 'FAST DSA Midterm · Fall 2022',
        tag: 'exam',
        prompt: 'What is a Double-Ended Queue (Deque)?',
        options: [
          'A generalized queue where insertions and deletions are permitted at BOTH front and rear ends in O(1)',
          'A queue with two parallel arrays',
          'A queue that only accepts even numbers',
          'A queue that sorts elements automatically on enqueue',
        ],
        answer: 0,
        explain: 'A Deque (Double-Ended Queue) allows push_front, push_back, pop_front, and pop_back all in O(1) constant time.',
      },
      {
        id: 'dsa-gold-u5-q5',
        kind: 'mcq',
        source: 'FAST DSA Midterm · Spring 2021',
        tag: 'exam',
        prompt: 'How does a Priority Queue differ from a standard FIFO Queue?',
        options: [
          'Elements are dequeued in order of priority (key value), regardless of arrival order',
          'It strictly follows FIFO arrival order',
          'It strictly follows LIFO order',
          'It discards elements at random when full',
        ],
        answer: 0,
        explain: 'In a Priority Queue, each element has a priority; dequeue always removes the element with the highest (or lowest) priority first.',
      },
    ],
  },
};

// =====================================================================================
// UNIT 6: Binary Trees & Binary Search Trees (BST)
// =====================================================================================

const DSA_U6_L1: Level = {
  id: 'dsa-tree-concepts',
  kind: 'lesson',
  title: 'Binary Trees: Anatomy, Height & Depth',
  tagline: 'Move from linear 1D lists to 2D hierarchical structures. Learn roots, parent-child relationships, leaves, height, and depth.',
  minutes: 25,
  objectives: [
    'Define a Binary Tree Node with data, left child, and right child',
    'Identify Root, Internal Nodes, and Leaf Nodes',
    'Calculate the Height and Depth of a tree recursively',
  ],
  learn: [
    { t: 'p', text: 'A **Tree** is a non-linear hierarchical data structure. A **Binary Tree** is a tree where every node has **at most two children** (called `left` and `right`). The top-most node is the **Root**; nodes with no children are **Leaves**.' },
    { t: 'syntax', title: 'Binary Tree Node Definition', code: cpp`
struct TreeNode {
    int data;
    TreeNode* left;
    TreeNode* right;
};`, parts: [
      { token: 'TreeNode* left;', text: 'pointer to left child subtree' },
      { token: 'TreeNode* right;', text: 'pointer to right child subtree' },
    ] },
    { t: 'callout', tone: 'key', title: 'Tree Height Formula', text: 'The height of an empty tree is `0`. The height of a non-empty tree is `1 + max(height(left), height(right))`.' },
    { t: 'viz', title: 'Manual 3-node binary tree creation', code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
};

int main() {
    Node* root = new Node(); root->val = 10;
    root->left = new Node(); root->left->val = 5; root->left->left = root->left->right = nullptr;
    root->right = new Node(); root->right->val = 15; root->right->left = root->right->right = nullptr;
    cout << "Root: " << root->val << " Left: " << root->left->val << " Right: " << root->right->val << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Calculate tree height recursively.',
    intro: 'Recursive tree height calculation.',
    items: [
      { title: 'Recursive height function', code: cpp`
#include <iostream>
using namespace std;
struct Node { int d; Node *left, *right; };
int height(Node* root) {
    if (!root) return 0;
    int lh = height(root->left);
    int rh = height(root->right);
    return 1 + (lh > rh ? lh : rh);
}
int main() {
    Node leftChild = {5, nullptr, nullptr};
    Node root = {10, &leftChild, nullptr};
    cout << "Height: " << height(&root) << endl;
    return 0;
}` },
    ],
    takeaway: 'Tree operations are naturally recursive because every child is itself the root of a subtree.',
    check: {
      id: 'dsa-u6-l1-check',
      kind: 'mcq',
      prompt: 'What is a node with zero children called in a binary tree?',
      options: ['Root', 'Internal node', 'Leaf node', 'Ancestor'],
      answer: 2,
      explain: 'A node with no children (both left and right are nullptr) is called a Leaf node.',
    },
  },
  watch: [
    { title: 'Height computation trace', intro: 'Leaves have height 1; their parent has height 2.', code: cpp`
#include <iostream>
using namespace std;

int main() {
    int lh = 1, rh = 0;
    int h = 1 + (lh > rh ? lh : rh);
    cout << "Tree height: " << h << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Tracing Recursive Tree Height Calculation',
    problem: 'Calculate the height of a binary tree where root (10) has a left child (5) with no children, and no right child.',
    steps: [
      { text: 'Left child (5) is a leaf with no children; height is 1.', lines: [11] },
      { text: 'Root (10) has left child and empty right subtree.', lines: [12] },
      { text: 'Subtree heights: `lh = 1`, `rh = 0`.', lines: [13, 14] },
      { text: 'Root height formula: `1 + max(lh, rh) = 1 + 1 = 2`.', lines: [15] },
      { text: 'Print final tree height.', lines: [16] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
};

int main() {
    Node leftChild = {5, nullptr, nullptr};
    Node root = {10, &leftChild, nullptr};
    int lh = 1;
    int rh = 0;
    int h = 1 + (lh > rh ? lh : rh);
    cout << h << endl;
    return 0;
}
`,
    why: 'Tree height is calculated bottom-up: the height of any node is 1 plus the maximum height of its children.',
  },
  practice: [
    {
      id: 'dsa-u6-l1-mcq1',
      kind: 'mcq',
      prompt: 'What is the maximum number of nodes at level `L` of a binary tree (where root is level 0)?',
      options: ['L', '2^L', '2L', 'L^2'],
      answer: 1,
      explain: 'Level 0 has 2^0 = 1 node; level 1 has 2^1 = 2; level 2 has 2^2 = 4 nodes: 2^L.',
    },
    {
      id: 'dsa-u6-l1-pred1',
      kind: 'predict',
      prompt: 'What will be printed by this leaf node detection code?',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    int leftVal;
    int rightVal;
};

int main() {
    Node n = {10, -1, -1};
    if (n.leftVal == -1 && n.rightVal == -1) {
        cout << "Leaf" << endl;
    } else {
        cout << "Internal" << endl;
    }
    return 0;
}
`,
      explain: 'Both left and right are -1 (representing null), so the node is a Leaf. Prints "Leaf".',
    },
    {
      id: 'dsa-u6-l1-count1',
      kind: 'count',
      prompt: 'How many leaf nodes are counted in this array of nodes?',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    bool isLeaf;
};

int main() {
    Node nodes[4] = {{10, false}, {5, true}, {15, false}, {18, true}};
    int leafCount = 0;
    for (int i = 0; i < 4; i++) {
        if (nodes[i].isLeaf) {
            leafCount++;
        }
    }
    cout << leafCount << endl;
    return 0;
}
`,
      count: { line: 15 },
      unit: 'times',
      explain: 'Two nodes (with values 5 and 18) have isLeaf == true. Line 15 executes 2 times.',
    },
    {
      id: 'dsa-u6-l1-bug1',
      kind: 'bug',
      prompt: 'This function incorrectly sums the child heights instead of taking their maximum. Identify the buggy line.',
      code: cpp`
#include <iostream>
using namespace std;

int calcHeight(int lh, int rh) {
    return 1 + (lh + rh);
}

int main() {
    int lh = 2, rh = 1;
    cout << calcHeight(lh, rh) << endl;
    return 0;
}
`,
      bugLine: 5,
      options: [
        'Height depends on the deeper subtree: `return 1 + (lh > rh ? lh : rh);`, not the sum',
        'Height of empty tree is 10',
        'lh and rh must be multiplied',
        'calcHeight must return double',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

int calcHeight(int lh, int rh) {
    return 1 + (lh > rh ? lh : rh);
}

int main() {
    int lh = 2, rh = 1;
    cout << calcHeight(lh, rh) << endl;
    return 0;
}
`,
      explain: 'Tree height represents the length of the LONGEST path from root to leaf, so the calculation must take `max(lh, rh)`.',
    },
    {
      id: 'dsa-u6-l1-mcq2',
      kind: 'mcq',
      prompt: 'What is the minimum height of a binary tree containing N nodes?',
      options: ['floor(log2(N)) + 1', 'N', 'N / 2', '1'],
      answer: 0,
      explain: 'In a completely balanced binary tree, the height is logarithmic: floor(log2(N)) + 1.',
    },
  ],
  cheatsheet: [
    { code: 'Root', text: 'topmost node with no parent' },
    { code: 'Leaf', text: 'node with no children (left == nullptr && right == nullptr)' },
    { code: 'Height = 1 + max(h(left), h(right))', text: 'recursive height formula' },
    { code: 'Level L capacity: 2^L nodes', text: 'maximum number of nodes at depth L' },
  ],
};

const DSA_U6_L2: Level = {
  id: 'dsa-bst-operations',
  kind: 'lesson',
  title: 'Binary Search Trees (BST): O(log N) Search',
  tagline: 'The BST property: all left values < Root < all right values. This enables fast O(log N) search, insertion, and sorted retrieval.',
  minutes: 25,
  objectives: [
    'State the Binary Search Tree invariant',
    'Insert a value into a BST maintaining the invariant',
    'Search for a target key in O(h) time',
  ],
  learn: [
    { t: 'p', text: 'A **Binary Search Tree (BST)** is a binary tree with a strict ordering rule: for every node `X`, **all values in its left subtree are smaller than `X`**, and **all values in its right subtree are greater than `X`**.' },
    { t: 'syntax', title: 'BST Recursive Insertion', code: cpp`
Node* insertBST(Node* root, int val) {
    if (root == nullptr) {
        Node* n = new Node();
        n->data = val;
        n->left = n->right = nullptr;
        return n;
    }
    if (val < root->data) {
        root->left = insertBST(root->left, val);
    } else {
        root->right = insertBST(root->right, val);
    }
    return root;
}`, parts: [
      { token: 'if (val < root->data)', text: 'smaller values go into the left subtree' },
      { token: 'else', text: 'larger values go into the right subtree' },
    ] },
    { t: 'viz', title: 'Searching a value in a BST', code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
};

bool searchBST(Node* root, int target) {
    if (root == nullptr) return false;
    if (root->val == target) return true;
    if (target < root->val) return searchBST(root->left, target);
    return searchBST(root->right, target);
}

int main() {
    Node l = {5, nullptr, nullptr};
    Node r = {15, nullptr, nullptr};
    Node root = {10, &l, &r};
    cout << "Search 15: " << searchBST(&root, 15) << endl;
    cout << "Search 7: " << searchBST(&root, 7) << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Verify BST property.',
    intro: 'BST search logic.',
    items: [
      { title: 'Iterative BST search', code: cpp`
#include <iostream>
using namespace std;
struct Node { int d; Node *l, *r; };
bool exists(Node* cur, int x) {
    while (cur) {
        if (cur->d == x) return true;
        if (x < cur->d) cur = cur->l;
        else cur = cur->r;
    }
    return false;
}
int main() {
    Node l = {20, nullptr, nullptr};
    Node root = {50, &l, nullptr};
    cout << "Found 20: " << exists(&root, 20) << endl;
    return 0;
}` },
    ],
    takeaway: 'BST search is like Binary Search on a sorted array, discarding half the tree at every comparison.',
    check: {
      id: 'dsa-u6-l2-check',
      kind: 'mcq',
      prompt: 'Where will a new value `12` be inserted in a BST with root `10` and right child `15`?',
      options: [
        'Left child of 10',
        'Left child of 15',
        'Right child of 15',
        'It replaces 10 as the new root',
      ],
      answer: 1,
      explain: '12 > 10 (goes right to 15); 12 < 15 (goes left of 15).',
    },
  },
  watch: [
    { title: 'BST search path trace', intro: 'Following arrows: 50 -> 25 -> 30.', code: cpp`
#include <iostream>
using namespace std;

int main() {
    cout << "Path: 50 -> 25 -> 30 (Found!)" << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Tracing BST Search Path',
    problem: 'Search for target 15 in a BST with root 20, left child 10, right child 30. Trace which branch is followed at each comparison.',
    steps: [
      { text: 'Set up BST: root 20, left child 10, right child 30.', lines: [11, 12, 13] },
      { text: 'Target is 15; start search at root (20).', lines: [14, 15] },
      { text: 'Compare 15 < 20: branch left to child 10.', lines: [19] },
      { text: 'Compare 15 > 10: branch right to child of 10 (nullptr).', lines: [20] },
      { text: 'Pointer is nullptr: target not found (prints 0).', lines: [22] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
};

int main() {
    Node leftChild = {10, nullptr, nullptr};
    Node rightChild = {30, nullptr, nullptr};
    Node root = {20, &leftChild, &rightChild};
    int target = 15;
    Node* cur = &root;
    bool found = false;
    while (cur != nullptr) {
        if (cur->val == target) { found = true; break; }
        if (target < cur->val) cur = cur->left;
        else cur = cur->right;
    }
    cout << found << endl;
    return 0;
}
`,
    why: 'BST property (left < root < right) enables binary search on trees: each comparison eliminates an entire subtree.',
  },
  practice: [
    {
      id: 'dsa-u6-l2-mcq1',
      kind: 'mcq',
      prompt: 'What is the worst-case search time complexity of an unbalanced (skewed) BST with N nodes?',
      options: ['O(log N)', 'O(N)', 'O(1)', 'O(N log N)'],
      answer: 1,
      explain: 'If elements are inserted in sorted order (e.g. 1, 2, 3, 4, 5), the BST degrades into a linear linked list with O(N) search time.',
    },
    {
      id: 'dsa-u6-l2-pred1',
      kind: 'predict',
      prompt: 'What will be printed by this BST search check?',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
};

int main() {
    Node l = {25, nullptr, nullptr};
    Node r = {75, nullptr, nullptr};
    Node root = {50, &l, &r};
    int target = 75;
    Node* p = &root;
    if (target > p->val) p = p->right;
    else p = p->left;
    cout << p->val << endl;
    return 0;
}
`,
      explain: '75 > 50, so pointer moves right to r. Prints 75.',
    },
    {
      id: 'dsa-u6-l2-count1',
      kind: 'count',
      prompt: 'How many comparisons are made before target 30 is found?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int bst[4] = {50, 25, 35, 30};
    int target = 30;
    int comparisons = 0;
    for (int i = 0; i < 4; i++) {
        comparisons++;
        if (bst[i] == target) break;
    }
    cout << comparisons << endl;
    return 0;
}
`,
      count: { line: 10 },
      unit: 'times',
      explain: 'The target 30 is at index 3. Loop executes 4 iterations. Line 10 executes 4 times.',
    },
    {
      id: 'dsa-u6-l2-bug1',
      kind: 'bug',
      prompt: 'This branching logic incorrectly goes right (1) when target is smaller than root. Identify the buggy line.',
      code: cpp`
#include <iostream>
using namespace std;

int nextBranch(int target, int rootVal) {
    if (target < rootVal) return 1;
    return -1;
}

int main() {
    cout << nextBranch(15, 20) << endl;
    return 0;
}
`,
      bugLine: 5,
      options: [
        'When target < rootVal, the search must go left (-1), not right: `if (target < rootVal) return -1;`',
        'target must equal rootVal',
        'return 0 instead',
        'main cannot print nextBranch',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

int nextBranch(int target, int rootVal) {
    if (target < rootVal) return -1;
    return 1;
}

int main() {
    cout << nextBranch(15, 20) << endl;
    return 0;
}
`,
      explain: 'In a BST, all values smaller than the current node lie strictly in its left subtree.',
    },
    {
      id: 'dsa-u6-l2-pred2',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard): Trace BST leftmost and rightmost traversals to determine minimum and maximum elements.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
};

int main() {
    Node n1 = {10, nullptr, nullptr};
    Node n3 = {30, nullptr, nullptr};
    Node n2 = {20, &n1, &n3};
    Node n5 = {60, nullptr, nullptr};
    Node n4 = {50, nullptr, &n5};
    Node root = {40, &n2, &n4};

    Node* curMin = &root;
    while (curMin->left != nullptr) curMin = curMin->left;

    Node* curMax = &root;
    while (curMax->right != nullptr) curMax = curMax->right;

    cout << curMin->val << " " << curMax->val << endl;
    return 0;
}
`,
      explain: 'In a BST, the minimum element is located at the leftmost node (10), and the maximum element is at the rightmost node (60). Output is "10 60".',
    },
  ],
  cheatsheet: [
    { code: 'BST Invariant', text: 'left subtree < Node < right subtree for every node' },
    { code: 'Balanced BST search', text: 'O(log N) time, halving search space at each step' },
    { code: 'Skewed BST search', text: 'O(N) time when elements are inserted in already-sorted order' },
  ],
};

const DSA_U6_L3: Level = {
  id: 'dsa-tree-traversals',
  kind: 'lesson',
  title: 'Tree Traversals: In-Order, Pre-Order & Post-Order',
  tagline: 'Visiting every node in a tree systematically: In-Order (Left, Root, Right) gives sorted keys; Pre-Order copies the tree; Post-Order deletes it.',
  minutes: 25,
  objectives: [
    'Execute In-Order (LNR), Pre-Order (NLR), and Post-Order (LRN) traversals',
    'Understand why In-Order traversal of a BST always yields sorted order',
    'Choose the appropriate traversal for copying vs deleting trees',
  ],
  learn: [
    { t: 'p', text: 'Because trees are non-linear, there are multiple ways to visit every node. The three classic depth-first traversals differ in when the **Node (N)** is processed relative to its **Left (L)** and **Right (R)** subtrees.' },
    { t: 'table', head: ['Traversal', 'Order', 'Unique Purpose'], rows: [
      ['In-Order', 'Left → Node → Right', 'Visits BST nodes in strictly sorted ascending order'],
      ['Pre-Order', 'Node → Left → Right', 'Used to serialize and clone/copy tree structures'],
      ['Post-Order', 'Left → Right → Node', 'Used to delete/free trees (children deleted before parent)'],
    ], caption: 'The three classic Depth-First tree traversals.' },
    { t: 'viz', title: 'In-order traversal yielding sorted order', code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
};

void inOrder(Node* root) {
    if (root == nullptr) return;
    inOrder(root->left);
    cout << root->val << " ";
    inOrder(root->right);
}

int main() {
    Node l = {20, nullptr, nullptr};
    Node r = {60, nullptr, nullptr};
    Node root = {40, &l, &r};
    cout << "InOrder: ";
    inOrder(&root);
    cout << endl;
    return 0;
}
` },
  ],
  ways: {
    goal: 'Perform In-order, Pre-order and Post-order visits on a 3-node tree.',
    intro: 'Comparing traversal sequences.',
    items: [
      { title: 'In-Order (Left-Root-Right)', code: cpp`
#include <iostream>
using namespace std;
struct N { int v; N *l, *r; };
void in(N* n) { if (!n) return; in(n->l); cout << n->v << " "; in(n->r); }
int main() {
    N l = {1, nullptr, nullptr}; N r = {3, nullptr, nullptr}; N root = {2, &l, &r};
    in(&root); cout << endl;
    return 0;
}` },
    ],
    takeaway: 'In-Order traversal on any valid BST always prints elements in ascending numerical order.',
    check: {
      id: 'dsa-u6-l3-check',
      kind: 'mcq',
      prompt: 'Which traversal visits children BEFORE visiting their parent, making it ideal for safely deleting a tree?',
      options: ['Pre-Order', 'In-Order', 'Post-Order', 'Level-Order'],
      answer: 2,
      explain: 'Post-Order (Left, Right, Node) processes both children before the parent node, ensuring no child pointers are orphaned when the parent is deleted.',
    },
  },
  watch: [
    { title: 'In-order sorted output', intro: 'Notice the output sequence is sorted: 5, 10, 15.', code: cpp`
#include <iostream>
using namespace std;

int main() {
    cout << "Sorted: 5 10 15" << endl;
    return 0;
}
` },
  ],
  think: {
    title: 'Tracing In-Order Ascending Retrieval',
    problem: 'Trace In-Order (Left, Root, Right) traversal of a 3-node BST with root 2, left child 1, right child 3.',
    steps: [
      { text: 'Create 3-node BST: left child 1, right child 3, root 2.', lines: [11, 12, 13] },
      { text: 'Visit left child (1), then root (2), then right child (3).', lines: [14] },
      { text: 'Verify output is in strictly ascending sorted order.', lines: [15] },
    ],
    code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
};

int main() {
    Node l = {1, nullptr, nullptr};
    Node r = {3, nullptr, nullptr};
    Node root = {2, &l, &r};
    cout << l.val << " " << root.val << " " << r.val << endl;
    return 0;
}
`,
    why: 'In-Order traversal of a BST visits nodes in strictly increasing order, serving as the canonical method for sorting or in-order serialization.',
  },
  practice: [
    {
      id: 'dsa-u6-l3-pred1',
      kind: 'predict',
      prompt: 'What is printed by an IN-ORDER traversal of this BST: root 50, left child 30, right child 70?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    cout << "30 50 70" << endl;
    return 0;
}
`,
      explain: 'Left (30) -> Root (50) -> Right (70). Prints 30 50 70.',
    },
    {
      id: 'dsa-u6-l3-mcq1',
      kind: 'mcq',
      prompt: 'Which traversal produces prefix notation when run on an expression tree?',
      options: ['Pre-Order', 'In-Order', 'Post-Order', 'Level-Order'],
      answer: 0,
      explain: 'Pre-Order visits the operator (root) before its operands (left and right subtrees), producing prefix notation.',
    },
    {
      id: 'dsa-u6-l3-count1',
      kind: 'count',
      prompt: 'How many nodes are visited during this full in-order traversal?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int order[3] = {10, 20, 30};
    int visits = 0;
    for (int i = 0; i < 3; i++) {
        visits++;
    }
    cout << visits << endl;
    return 0;
}
`,
      count: { line: 8 },
      unit: 'times',
      explain: 'Tree has 3 nodes. The loop executes 3 times. Line 8 executes 3 times.',
    },
    {
      id: 'dsa-u6-l3-bug1',
      kind: 'bug',
      prompt: 'This traversal printed root before left, making it pre-order instead of in-order. Identify the buggy line.',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int left = 10, root = 20, right = 30;
    cout << root << " " << left << " " << right << endl;
    return 0;
}
`,
      bugLine: 6,
      options: [
        'In-order must print left before root: `cout << left << " " << root << " " << right << endl;`',
        'right must be printed first',
        'root cannot be an int',
        'main cannot print multiple variables',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

int main() {
    int left = 10, root = 20, right = 30;
    cout << left << " " << root << " " << right << endl;
    return 0;
}
`,
      explain: 'In-order traversal visits the Left subtree first, then the Node (root), and finally the Right subtree.',
    },
    {
      id: 'dsa-u6-l3-pred2',
      kind: 'predict',
      prompt: 'Stair 5 (More Hard): Trace post-order evaluation (Left, Right, Root) aggregating values bottom-up.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
};

int main() {
    Node a = {5, nullptr, nullptr};
    Node b = {15, nullptr, nullptr};
    Node root = {10, &a, &b};

    int leftVal = root.left->val;
    int rightVal = root.right->val;
    int total = leftVal + rightVal + root.val;
    cout << leftVal << " " << rightVal << " " << total << endl;
    return 0;
}
`,
      explain: 'Post-order processes children first: left subtree yields 5, right subtree yields 15, and root holds 10. Total sum = 5 + 15 + 10 = 30. Output is "5 15 30".',
    },
  ],
  cheatsheet: [
    { code: 'In-Order (LNR)', text: 'Left -> Node -> Right: yields sorted ascending sequence in BST' },
    { code: 'Pre-Order (NLR)', text: 'Node -> Left -> Right: used to clone, serialize, or produce prefix' },
    { code: 'Post-Order (LRN)', text: 'Left -> Right -> Node: used to safely delete trees or produce postfix' },
  ],
};

const DSA_U6_CP: Level = {
  id: 'checkpoint-dsa-trees',
  kind: 'revision',
  title: 'Binary Trees & BSTs',
  tagline: 'The pinnacle of hierarchical data structures: trees, BST properties, and traversal algorithms.',
  objectives: [
    'Verify BST invariants across left and right subtrees',
    'Trace in-order, pre-order, and post-order traversals',
    'Conquer the Gold Exam Challenge Box on FAST tree past papers',
  ],
  practice: [
    {
      id: 'dsa-cp6-mcq1',
      kind: 'mcq',
      prompt: 'If the in-order traversal of a binary search tree is printed, what property does the resulting list have?',
      options: [
        'It is reverse sorted',
        'It is strictly sorted in ascending order',
        'It has all leaves first',
        'It is in random order',
      ],
      answer: 1,
      explain: 'In-order traversal of a BST always yields keys in ascending sorted order.',
    },
    {
      id: 'dsa-cp6-pred1',
      kind: 'predict',
      prompt: 'Predict the pre-order (Node -> Left -> Right) output for root 50, left child 25, right child 75:',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int root = 50, left = 25, right = 75;
    cout << root << " " << left << " " << right << endl;
    return 0;
}
`,
      explain: 'Pre-order visits Node (50) first, then Left (25), then Right (75). Prints "50 25 75".',
    },
    {
      id: 'dsa-cp6-count1',
      kind: 'count',
      prompt: 'How many leaf checks evaluate true in this 5-node tree?',
      code: cpp`
#include <iostream>
using namespace std;

int main() {
    int childCounts[5] = {2, 0, 1, 0, 0};
    int leaves = 0;
    for (int i = 0; i < 5; i++) {
        if (childCounts[i] == 0) {
            leaves++;
        }
    }
    cout << leaves << endl;
    return 0;
}
`,
      count: { line: 9 },
      unit: 'times',
      explain: 'Three nodes have child count 0 (indices 1, 3, 4). Line 9 executes 3 times.',
    },
    {
      id: 'dsa-cp6-mcq2',
      kind: 'mcq',
      prompt: 'What is the minimum number of nodes in a binary tree of height H (where a single root node has height 1)?',
      options: ['H', '2^H - 1', 'H + 1', '2H'],
      answer: 0,
      explain: 'A degenerate (skewed) binary tree where every node has only one child has exactly H nodes for height H.',
    },
    {
      id: 'dsa-cp6-bug1',
      kind: 'bug',
      prompt: 'Stair 5 (Bug Hunt): Line 17 checks target < cur->val instead of target > cur->val, branching to the wrong subtree during BST search.',
      code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
};

int main() {
    Node a = {10, nullptr, nullptr};
    Node b = {30, nullptr, nullptr};
    Node root = {20, &a, &b};
    int target = 30;
    Node* cur = &root;
    if (target < cur->val) cur = cur->right;
    else cur = cur->left;
    if (cur != nullptr) cout << cur->val << endl;
    else cout << 0 << endl;
    return 0;
}
`,
      bugLine: 17,
      options: [
        'When target is greater than cur->val, search must proceed to `cur->right`, not `cur->left`: `if (target > cur->val) cur = cur->right;`',
        'target must equal 0',
        'Node must not have val',
        'root cannot point to a and b',
      ],
      answer: 0,
      fixed: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
};

int main() {
    Node a = {10, nullptr, nullptr};
    Node b = {30, nullptr, nullptr};
    Node root = {20, &a, &b};
    int target = 30;
    Node* cur = &root;
    if (target > cur->val) cur = cur->right;
    else cur = cur->left;
    if (cur != nullptr) cout << cur->val << endl;
    else cout << 0 << endl;
    return 0;
}
`,
      explain: 'Because target (30) > cur->val (20), the BST property requires branching to the right child (30). The buggy condition went left (10). Outputs differ: "10" vs "30".',
    },
  ],
  exam: {
    title: 'Gold Exam Challenge: FAST Tree & BST Past Papers',
    intro: 'Past exam problems on tree heights, BST insertions, traversals, and balance factors.',
    questions: [
      {
        id: 'dsa-gold-u6-q1',
        kind: 'predict',
        source: 'FAST DSA Final Exam · Spring 2024',
        tag: 'exam',
        prompt: 'Predict the in-order traversal output of this BST constructed from numbers: 40, 20, 60, 10, 30:',
        code: cpp`
#include <iostream>
using namespace std;

int main() {
    cout << "10 20 30 40 60" << endl;
    return 0;
}
`,
        explain: 'In-order traversal always produces elements in ascending order: 10 20 30 40 60.',
      },
      {
        id: 'dsa-gold-u6-q2',
        kind: 'mcq',
        source: 'FAST DSA Final Exam · Fall 2023',
        tag: 'exam',
        prompt: 'What is the height of a balanced BST with N = 1,000,000 nodes?',
        options: ['~20', '~1,000', '~1,000,000', '~100'],
        answer: 0,
        explain: 'For a balanced BST, height h = log2(N). log2(1,000,000) is approximately 20.',
      },
      {
        id: 'dsa-gold-u6-q3',
        kind: 'mcq',
        source: 'FAST DSA Final Exam · Spring 2023',
        tag: 'exam',
        prompt: 'Which pair of tree traversals is sufficient to reconstruct a unique binary tree?',
        options: [
          'In-Order and Pre-Order (or In-Order and Post-Order)',
          'Pre-Order and Post-Order only',
          'In-Order only',
          'Level-Order only',
        ],
        answer: 0,
        explain: 'In-Order is strictly required because it reveals the boundary between left and right subtrees. Combined with Pre-Order (or Post-Order) to identify roots, the tree is uniquely defined.',
      },
      {
        id: 'dsa-gold-u6-q4',
        kind: 'predict',
        source: 'FAST DSA Final Exam · Fall 2022',
        tag: 'exam',
        prompt: 'Predict the output of finding the minimum element in this BST:',
        code: cpp`
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
};

int main() {
    Node a = {5, nullptr, nullptr};
    Node b = {15, nullptr, nullptr};
    Node c = {10, &a, &b};
    Node* cur = &c;
    while (cur->left != nullptr) {
        cur = cur->left;
    }
    cout << "Min: " << cur->val << endl;
    return 0;
}
`,
        explain: 'In a BST, the minimum value is always the leftmost node. Following left from 10 reaches 5. Prints "Min: 5".',
      },
      {
        id: 'dsa-gold-u6-q5',
        kind: 'mcq',
        source: 'FAST DSA Final Exam · Spring 2022',
        tag: 'exam',
        prompt: 'When evaluating an arithmetic expression tree, what traversal gives the Reverse Polish (postfix) notation?',
        options: [
          'Post-Order traversal (Left, Right, Root)',
          'Pre-Order traversal (Root, Left, Right)',
          'In-Order traversal (Left, Root, Right)',
          'Level-Order traversal',
        ],
        answer: 0,
        explain: 'Post-Order visits both operand subtrees before the operator node, which is the definition of postfix notation.',
      },
    ],
  },
};

// =====================================================================================
// DSA Units Export
// =====================================================================================

export const dsaUnit1: Unit = {
  id: 'dsa-u1',
  num: 1,
  title: 'Algorithmic Complexity & Dynamic Arrays',
  summary: 'Big-O notation, asymptotic analysis, linear vs binary search, and dynamic resizing vector mechanics.',
  levels: [DSA_U1_L1, DSA_U1_L2, DSA_U1_CP],
};

export const dsaUnit2: Unit = {
  id: 'dsa-u2',
  num: 2,
  title: 'Singly Linked Lists',
  summary: 'Nodes, pointers, O(1) head insertion, tail appending, searching, and deleting nodes by key.',
  levels: [DSA_U2_L1, DSA_U2_L2, DSA_U2_CP],
};

export const dsaUnit3: Unit = {
  id: 'dsa-u3',
  num: 3,
  title: 'Doubly & Circular Linked Lists',
  summary: 'Bidirectional prev pointers, two-way traversal, O(1) node deletion, and circular linked ring buffers.',
  levels: [DSA_U3_L1, DSA_U3_L2, DSA_U3_CP],
};

export const dsaUnit4: Unit = {
  id: 'dsa-u4',
  num: 4,
  title: 'Stacks & Applications',
  summary: 'LIFO principle, push/pop/top, stack underflow/overflow, balanced parentheses check, and postfix evaluation.',
  levels: [DSA_U4_L1, DSA_U4_L2, DSA_U4_CP],
};

export const dsaUnit5: Unit = {
  id: 'dsa-u5',
  num: 5,
  title: 'Queues & Circular Buffers',
  summary: 'FIFO principle, front/rear pointers, enqueue/dequeue, and modulo arithmetic wrapping ring buffers.',
  levels: [DSA_U5_L1, DSA_U5_L2, DSA_U5_CP],
};

export const dsaUnit6: Unit = {
  id: 'dsa-u6',
  num: 6,
  title: 'Binary Trees & Binary Search Trees (BST)',
  summary: 'Tree anatomy, recursive height calculation, BST search property, and In-Order/Pre-Order/Post-Order traversals.',
  levels: [DSA_U6_L1, DSA_U6_L2, DSA_U6_L3, DSA_U6_CP],
};

export const DSA_COURSE: Course = {
  id: 'dsa',
  title: 'Data Structures',
  lang: 'C++',
  units: [dsaUnit1, dsaUnit2, dsaUnit3, dsaUnit4, dsaUnit5, dsaUnit6],
};
