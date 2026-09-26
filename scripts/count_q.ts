import { OOP_COURSE } from '../src/content/oop';
import { DSA_COURSE } from '../src/content/dsa';

console.log('=== OOP COURSE ===');
for (const u of OOP_COURSE.units) {
  let totalPractice = 0;
  let examCount = 0;
  console.log(`Unit ${u.num}: ${u.title} (${u.levels.length} levels)`);
  for (const l of u.levels) {
    totalPractice += l.practice.length;
    const ec = l.exam?.questions.length || 0;
    examCount += ec;
    console.log(`  - Level ${l.id} (${l.title}): ${l.practice.length} practice, ${ec} exam`);
  }
  console.log(`  => TOTAL: practice=${totalPractice}, exam=${examCount}, sum=${totalPractice + examCount}`);
}

console.log('\n=== DSA COURSE ===');
for (const u of DSA_COURSE.units) {
  let totalPractice = 0;
  let examCount = 0;
  console.log(`Unit ${u.num}: ${u.title} (${u.levels.length} levels)`);
  for (const l of u.levels) {
    totalPractice += l.practice.length;
    const ec = l.exam?.questions.length || 0;
    examCount += ec;
    console.log(`  - Level ${l.id} (${l.title}): ${l.practice.length} practice, ${ec} exam`);
  }
  console.log(`  => TOTAL: practice=${totalPractice}, exam=${examCount}, sum=${totalPractice + examCount}`);
}
