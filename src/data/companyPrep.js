// Company-wise prep kit. Edit this file to add companies or fix a link.
// Process notes are TYPICAL patterns from public experiences. They change by year, role and campus,
// so always trust the recruiter's email over this.

const g = (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`;
const CODE360 = 'https://www.naukri.com/code360';
const C360_TESTS = `${CODE360}/test-series`; // free company-wise mock test series

// Companies with a dedicated Naukri Code360 page (interview experiences / interview bundle)
const CODE360_EXPERIENCES = ['amazon', 'microsoft', 'google', 'adobe', 'flipkart', 'accenture', 'cred'];
const CODE360_BUNDLE = ['amazon', 'google', 'microsoft', 'flipkart'];

const PREPINSTA = { title: 'PrepInsta: placement papers & patterns', url: 'https://prepinsta.com/all-companies-dashboard/', note: 'Free pattern + previous questions for mass recruiters' };

export const COMPANIES = [
  {
    name: 'Amazon', kind: 'product', mocks: [{ title: 'Amazon online assessment practice', url: C360_TESTS, note: 'Free Code360 mock series; look for the Amazon assessment test' }], aliases: ['amazon', 'aws'], slug: 'amazon',
    blurb: 'Coding + behavioural. Every round tests the Leadership Principles, not only DSA.',
    rounds: ['Online assessment: usually 2 coding questions plus a work-style / behavioural section', 'Technical interviews: DSA, with Leadership Principle questions in every round', 'A "bar raiser" style round is common in later stages'],
    focus: ['Arrays, strings, hashing, sliding window', 'Trees, graphs (BFS/DFS), heaps', 'OOP and basic low-level design for some roles', '5-6 STAR stories mapped to Leadership Principles'],
    extra: [{ title: 'Amazon Leadership Principles', url: 'https://www.amazon.jobs/en/principles', note: 'Prepare a story for each' }],
  },
  {
    name: 'Microsoft', kind: 'product', mocks: [{ title: 'Microsoft online assessment test series', url: C360_TESTS, note: 'Free Code360 mock series (5 tests)' }], aliases: ['microsoft'], slug: 'microsoft',
    blurb: 'Coding-heavy with solid fundamentals; a design/managerial round at the end.',
    rounds: ['Online coding assessment', 'Technical rounds on DSA (and sometimes OOP / design)', 'Final round mixes design discussion with behaviour and projects'],
    focus: ['Linked lists, trees, recursion and DP basics', 'OOP, OS and DBMS fundamentals', 'Explaining your project and trade-offs clearly'],
    extra: [],
  },
  {
    name: 'Google', kind: 'product', mocks: [], aliases: ['google', 'alphabet'], slug: 'google',
    blurb: 'Several DSA-heavy rounds. Communication and optimising a brute force matter as much as the answer.',
    rounds: ['Online round and/or phone screen', 'Multiple DSA rounds (onsite or virtual)', 'A behavioural / "Googleyness" conversation'],
    focus: ['Graphs, trees, DP, recursion, binary search on answer', 'Thinking aloud and testing your own code with edge cases', 'Complexity analysis for every solution'],
    extra: [],
  },
  {
    name: 'Adobe', kind: 'product', mocks: [], aliases: ['adobe'], slug: 'adobe',
    blurb: 'Strong CS fundamentals plus DSA.',
    rounds: ['Online coding test', 'Technical rounds on DSA and CS fundamentals', 'Managerial / HR round'],
    focus: ['DSA: arrays, strings, trees, DP', 'OS, DBMS, OOP fundamentals', 'Puzzles can appear, so practise a few'],
    extra: [],
  },
  {
    name: 'Atlassian', kind: 'product', mocks: [], aliases: ['atlassian'], slug: 'atlassian',
    blurb: 'Practical coding with a strong values / teamwork component.',
    rounds: ['Coding assessment', 'Technical interviews focused on clean, working code and design', 'A values / behavioural round'],
    focus: ['Practical problem solving with good OOP and readable code', 'Collaboration, ownership and feedback stories', 'Basic design / API thinking'],
    extra: [],
  },
  {
    name: 'Flipkart', kind: 'product', mocks: [{ title: 'Flipkart mock test series', url: C360_TESTS, note: 'Free Code360 mock series (6 tests)' }], aliases: ['flipkart'], slug: 'flipkart',
    blurb: 'DSA plus a machine-coding / low-level design round.',
    rounds: ['Online coding test', 'DSA interviews', 'Machine coding or LLD round (design and code a small system)', 'Hiring manager round'],
    focus: ['DSA: trees, graphs, DP, heaps', 'OOP + design patterns; practise parking lot, library, cab booking style problems', 'Writing clean, extensible code in 60-90 minutes'],
    extra: [],
  },
  {
    name: 'Goldman Sachs', kind: 'product', mocks: [{ title: 'Goldman Sachs mock test', url: C360_TESTS, note: 'Free Code360 mock series; look for Goldman Sachs' }], aliases: ['goldman sachs', 'goldman'], slug: 'goldman-sachs',
    blurb: 'Online test with coding + aptitude, then technical rounds with fundamentals and puzzles.',
    rounds: ['Online assessment (coding and quantitative / aptitude)', 'Technical interviews: DSA and CS fundamentals', 'Final round with behavioural questions'],
    focus: ['DSA medium-level problems', 'Probability, puzzles and aptitude', 'DBMS, OS and OOP basics'],
    extra: [],
  },
  {
    name: 'TCS', kind: 'service', mocks: [{ title: 'TCS NQT mock test series', url: `${C360_TESTS}/tcs-mock-test-series-nqt`, note: 'Free · Code360 · aptitude, logic and coding' }, { title: 'TCS free mock tests (5 tests)', url: 'https://testbook.com/tcs/test-series', note: 'Testbook · free tests, one attempt each' }, { title: 'TCS interview preparation bundle', url: `${CODE360}/interview-bundle/tata-consultancy-services-tcs`, note: 'Code360 · experiences, problems and mock test' }], aliases: ['tcs', 'tata consultancy services'], slug: 'tcs',
    blurb: 'Mass recruiter. Cleared mostly through the TCS NQT test, then interviews.',
    rounds: ['TCS NQT: aptitude (numerical, verbal, reasoning) plus coding', 'Technical interview (projects, basics of your language, DBMS)', 'Managerial and HR rounds'],
    focus: ['Aptitude speed and accuracy', 'Basic coding in one language (strings, arrays, patterns)', 'Your final-year project and basics of DBMS / OOP'],
    extra: [PREPINSTA],
  },
  {
    name: 'Infosys', kind: 'service', mocks: [{ title: 'HackWithInfy mock test series', url: C360_TESTS, note: 'Free Code360 mock series (6 tests)' }, { title: 'Infosys mock test', url: C360_TESTS, note: 'Look for Infosys on the same page' }], aliases: ['infosys'], slug: 'infosys',
    blurb: 'Online test (reasoning, maths, verbal, coding for higher profiles) then interview.',
    rounds: ['Online assessment: reasoning, mathematical and verbal ability, with pseudocode / coding for some profiles', 'Technical interview', 'HR interview'],
    focus: ['Aptitude and logical reasoning', 'Pseudocode and basic programming', 'DBMS, OOP and communication'],
    extra: [PREPINSTA],
  },
  {
    name: 'Wipro', kind: 'service', mocks: [{ title: 'Wipro mock test', url: C360_TESTS, note: 'Free Code360 mock series; look for Wipro' }], aliases: ['wipro'], slug: 'wipro',
    blurb: 'Online aptitude + written communication + coding, followed by interviews.',
    rounds: ['Online assessment: aptitude, verbal / written communication and coding', 'Technical interview', 'HR interview'],
    focus: ['Aptitude and verbal ability', 'Simple coding questions', 'Basic DBMS, OOP and project discussion'],
    extra: [PREPINSTA],
  },
  {
    name: 'Accenture', kind: 'service', mocks: [{ title: 'Accenture assessment test', url: C360_TESTS, note: 'Free Code360 mock series; look for Accenture' }], aliases: ['accenture'], slug: 'accenture',
    blurb: 'Assessment-first process: cognitive + technical MCQs, coding, communication.',
    rounds: ['Cognitive and technical assessment (reasoning, pseudocode, networking, cloud basics)', 'Coding assessment for some profiles', 'Communication assessment, then interview'],
    focus: ['Reasoning and English ability', 'Pseudocode, networking, cloud and security basics', 'Clear spoken English in the interview'],
    extra: [PREPINSTA],
  },
  {
    name: 'Cognizant', kind: 'service', mocks: [], aliases: ['cognizant', 'cts'], slug: 'cognizant',
    blurb: 'Online assessment (aptitude + coding for higher profiles), then interviews.',
    rounds: ['Online assessment: aptitude, with coding for GenC Next / Pro style profiles', 'Technical interview', 'HR interview'],
    focus: ['Aptitude and logical reasoning', 'Coding fundamentals', 'Communication and basic DBMS / OOP'],
    extra: [PREPINSTA],
  },
  {
    name: 'Capgemini', kind: 'service', mocks: [], aliases: ['capgemini'], slug: 'capgemini',
    blurb: 'Aptitude/game-based test, pseudocode and English, then interviews.',
    rounds: ['Online test: aptitude / games, pseudocode and English communication', 'Technical interview', 'HR interview'],
    focus: ['Pseudocode and basic programming', 'Aptitude and verbal ability', 'Projects and basics of your language'],
    extra: [PREPINSTA],
  },
];

// ---------- Product-based vs Service-based guide ----------
export const KIND_LABEL = { product: 'Product-based', service: 'Service-based' };

const L = {
  striverA2Z: { title: "Striver's A2Z DSA Sheet", url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', note: 'Free · sheet + videos' },
  striverSde: { title: "Striver's SDE Sheet", url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/', note: 'Free · most asked problems' },
  neetcode: { title: 'NeetCode 150', url: 'https://neetcode.io/practice', note: 'Free · problems by pattern' },
  lc150: { title: 'LeetCode Top Interview 150', url: 'https://leetcode.com/studyplan/top-interview-150/', note: 'Free · study plan' },
  apnaNotes: { title: 'Apna College free notes (CN, DBMS)', url: 'https://www.apnacollege.in/notes', note: 'Free · Hindi' },
  gateSmashers: { title: 'Gate Smashers (OS, DBMS, CN)', url: 'https://www.youtube.com/@GateSmashers', note: 'Free · Hindi videos' },
  cwhNotes: { title: 'CodeWithHarry free notes', url: 'https://codewithharry.com/notes', note: 'Free · Hindi' },
  indiabix: { title: 'IndiaBIX aptitude', url: 'https://www.indiabix.com/', note: 'Free · quant, logical, verbal with answers' },
  prepinsta: { title: 'PrepInsta company dashboards', url: 'https://prepinsta.com/all-companies-dashboard/', note: 'Free pages · patterns and previous questions' },
  testbookNqt: { title: 'TCS NQT free aptitude mock tests', url: 'https://testbook.com/tcs-nqt/test-series', note: 'Testbook · free tests, one attempt each' },
  sqlbolt: { title: 'SQLBolt', url: 'https://sqlbolt.com/', note: 'Free · interactive SQL' },
  sql50: { title: 'LeetCode SQL 50', url: 'https://leetcode.com/studyplan/top-sql-50/', note: 'Free · practice' },
  tih: { title: 'Tech Interview Handbook', url: 'https://www.techinterviewhandbook.org/', note: 'Free · resume + behavioural' },
  amazonLp: { title: 'Amazon Leadership Principles', url: 'https://www.amazon.jobs/en/principles', note: 'Free · STAR story practice' },
  refactoring: { title: 'Refactoring Guru: design patterns', url: 'https://refactoring.guru/design-patterns', note: 'Free · for LLD / machine coding' },
  sdPrimer: { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', note: 'Free · GitHub' },
  experiences: { title: 'Real interview experiences (all companies)', url: `${CODE360}/interview-experiences`, note: 'Code360 · what was actually asked' },
  mockIndex: { title: 'Free company-wise mock test series', url: C360_TESTS, note: 'Code360 · TCS, Infosys, Wipro, Flipkart, Microsoft and more' },
  lcContest: { title: 'LeetCode weekly contests', url: 'https://leetcode.com/contest/', note: 'Free · timed practice like a real OA' },
  hackerrank: { title: 'HackerRank', url: 'https://www.hackerrank.com/', note: 'Free · many companies run their OA here' },
};

export const TYPE_GUIDES = {
  product: {
    title: 'Product-based companies',
    examples: 'Amazon, Microsoft, Google, Adobe, Atlassian, Flipkart...',
    blurb: 'Hiring is DSA-first. Cleared by problem solving speed and how clearly you think aloud. CS fundamentals and projects come after.',
    asked: [
      { stage: 'Online assessment', points: ['2-3 coding problems in 60-120 minutes (easy to medium, sometimes one hard)', 'Arrays, strings, hashing, two pointers, trees, graphs and DP basics repeat the most', 'Some add MCQs on CS fundamentals or a work-style section (Amazon)'] },
      { stage: 'Technical interviews (2-4 rounds)', points: ['Live DSA: clarify, give brute force, optimise, dry-run, state complexity', 'Most repeated: sliding window, binary search, linked list, stack, tree traversals, BFS/DFS, knapsack/LIS, heaps', 'Interviewers care more about your approach than a memorised answer'] },
      { stage: 'CS fundamentals and projects', points: ['OS (process vs thread, deadlock, paging), DBMS (ACID, indexing, joins), CN (TCP vs UDP, URL journey), OOP (4 pillars, SOLID)', 'Deep project questions: why this stack, trade-offs, one bug you fixed'] },
      { stage: 'Design and behavioural', points: ['SDE-1: low-level design / machine coding at some companies (parking lot, library, cab booking)', 'High-level system design mostly for experienced roles', 'Behavioural stories in STAR format (Amazon asks in every round)'] },
    ],
    prep: [
      { title: 'DSA (the main thing)', desc: 'Pick one sheet and finish it. Do 150-250 problems with patterns, not 600 random ones.', links: [L.striverA2Z, L.striverSde, L.neetcode, L.lc150] },
      { title: 'CS fundamentals', desc: 'Notes and videos for OS, DBMS, CN, OOP.', links: [L.apnaNotes, L.gateSmashers, L.cwhNotes] },
      { title: 'Low-level and system design', desc: 'Design patterns and basics of large-scale design.', links: [L.refactoring, L.sdPrimer] },
      { title: 'Behavioural and resume', desc: 'Prepare 4-5 STAR stories.', links: [L.tih, L.amazonLp] },
    ],
    mocks: [L.mockIndex, L.lcContest, L.hackerrank, L.experiences],
  },
  service: {
    title: 'Service-based companies',
    examples: 'TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini...',
    blurb: 'Hiring is test-first. Aptitude speed and basic coding clear the filter; interviews check basics, projects and communication. Higher-paying profiles (Digital / Prime, Specialist Programmer and similar) test DSA much harder.',
    asked: [
      { stage: 'Online assessment', points: ['Aptitude: percentages, ratios, time and work, profit and loss, series, coding-decoding, seating arrangement, data interpretation', 'Verbal: grammar, reading comprehension, sentence correction', 'Pseudocode / output questions and basic computer fundamentals MCQs', '1-2 easy to medium coding problems (strings, arrays, patterns, number problems)'] },
      { stage: 'Communication check', points: ['Written and spoken English assessment at several companies (Wipro, Accenture, Capgemini)', 'Practise reading aloud and a clear 60-second introduction'] },
      { stage: 'Technical interview', points: ['Your final-year project in detail', 'Basics of one language (C / C++ / Java / Python), OOP concepts', 'DBMS and SQL queries (joins, GROUP BY, second highest salary)', 'Simple DSA: sorting, palindrome, Fibonacci, reverse a linked list; basic OS and CN'] },
      { stage: 'Managerial / HR', points: ['Strengths and weaknesses, why this company, willingness to relocate or work in shifts', 'Service agreement or joining questions, and your plans for the next 5 years'] },
    ],
    prep: [
      { title: 'Aptitude and reasoning', desc: 'The biggest filter. Practise with a timer, 20-30 questions a day.', links: [L.indiabix, L.prepinsta, L.testbookNqt] },
      { title: 'Coding basics', desc: 'Start with the basics and arrays; easy problems are enough for most profiles.', links: [L.striverA2Z, L.cwhNotes] },
      { title: 'Technical interview basics', desc: 'DBMS, OOP, OS, networks and SQL.', links: [L.apnaNotes, L.gateSmashers, L.sqlbolt, L.sql50] },
      { title: 'HR and communication', desc: 'Self introduction, project explanation, common HR answers.', links: [L.tih] },
    ],
    mocks: [L.mockIndex, L.testbookNqt, L.prepinsta, L.experiences],
  },
};

// ---------- "Most commonly asked" notes for companies we have no data on ----------
export const GENERIC_TOPICS = {
  dsa: {
    title: 'DSA: most asked',
    points: [
      'Arrays and strings: two pointers, sliding window, prefix sums, Kadane',
      'Hashing: two-sum style problems, frequency maps, anagrams',
      'Binary search (also on answer) and sorting with complexities',
      'Linked list: reverse, detect cycle, merge two lists, find middle',
      'Stack and queue: valid parentheses, next greater element',
      'Trees and BST: traversals, height, LCA, level order, validate BST',
      'Graphs: BFS/DFS, connected components, cycle detection, shortest path',
      'DP basics (knapsack, LIS, LCS, coin change), recursion and backtracking, heaps (top-K)',
    ],
    links: [
      { title: "Striver's A2Z DSA Sheet", url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/' },
      { title: 'NeetCode 150', url: 'https://neetcode.io/practice' },
    ],
  },
  cs: {
    title: 'CS fundamentals: most asked',
    points: [
      'OS: process vs thread, deadlock and its 4 conditions, CPU scheduling, paging and virtual memory, mutex vs semaphore',
      'DBMS: ACID, normalization, indexing, joins, transaction isolation levels, primary vs foreign key',
      'Networks: OSI vs TCP/IP, TCP vs UDP, what happens when you type a URL, DNS, HTTP vs HTTPS',
      'OOP: four pillars, overloading vs overriding, abstract class vs interface, SOLID basics',
    ],
    links: [
      { title: 'Apna College free notes (CN, DBMS)', url: 'https://www.apnacollege.in/notes' },
      { title: 'CodeWithHarry free notes', url: 'https://codewithharry.com/notes' },
      { title: 'Gate Smashers (Hindi videos)', url: 'https://www.youtube.com/@GateSmashers' },
    ],
  },
  sql: {
    title: 'SQL: most asked',
    points: [
      'Joins (inner, left, self), GROUP BY with HAVING, subqueries',
      'Classics: second highest salary, find duplicates, employees earning more than their manager',
      'Window functions: ROW_NUMBER, RANK, running totals',
      'When to add an index; normalization vs denormalization',
    ],
    links: [
      { title: 'LeetCode SQL 50', url: 'https://leetcode.com/studyplan/top-sql-50/' },
      { title: 'SQLBolt', url: 'https://sqlbolt.com/' },
    ],
  },
  hr: {
    title: 'HR and projects: most asked',
    points: [
      'Tell me about yourself: 60-90 seconds, present, past, then why this role',
      'Walk me through your best project: problem, your part, stack choices, one bug you fixed, what you would improve',
      'Why this company? Strengths and weaknesses? A time you handled conflict or failure (use STAR)',
      'Questions to ask the interviewer: team, tech stack, onboarding',
    ],
    links: [{ title: 'Tech Interview Handbook', url: 'https://www.techinterviewhandbook.org/' }],
  },
  web: {
    title: 'Web / frontend: most asked',
    points: [
      'JavaScript: closures, hoisting, var/let/const, this, event loop, promises and async/await',
      'React: hooks, keys, virtual DOM, lifting state, controlled inputs, Context vs props',
      'CSS: box model, flex vs grid, specificity, responsive design',
      'HTTP and browser: REST, CORS, cookies vs localStorage, status codes, JWT auth flow',
    ],
    links: [
      { title: 'javascript.info', url: 'https://javascript.info/' },
      { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
    ],
  },
  backend: {
    title: 'Backend: most asked',
    points: [
      'REST API design, HTTP methods, idempotency, status codes, validation',
      'Auth: sessions vs JWT, password hashing (bcrypt), refresh tokens',
      'Databases: indexing, SQL vs NoSQL, transactions, the N+1 query problem',
      'Caching, queues, rate limiting; a small design problem like a URL shortener',
    ],
    links: [
      { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
      { title: 'Gaurav Sen (videos)', url: 'https://www.youtube.com/@gkcs' },
    ],
  },
  data: {
    title: 'Data / analytics: most asked',
    points: [
      'SQL joins and window functions, aggregation, cleaning data with pandas',
      'Statistics: mean vs median, variance, probability basics, hypothesis testing and p-value, A/B tests',
      'Metrics thinking: how would you measure whether a feature worked?',
    ],
    links: [
      { title: 'LeetCode SQL 50', url: 'https://leetcode.com/studyplan/top-sql-50/' },
      { title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn' },
    ],
  },
};

export const TRACKS = { sde: 'SDE / general', web: 'Web / full-stack', backend: 'Backend', data: 'Data / analytics' };
const TRACK_TOPICS = {
  sde: ['dsa', 'cs', 'sql', 'hr'],
  web: ['dsa', 'web', 'cs', 'hr'],
  backend: ['dsa', 'backend', 'sql', 'cs', 'hr'],
  data: ['sql', 'data', 'dsa', 'hr'],
};

export function inferTrack(role = '') {
  const r = role.toLowerCase();
  if (/data|analyst|analytics|ml\b|machine learning|\bai\b/.test(r)) return 'data';
  if (/front|react|\bui\b|web|full.?stack|mern/.test(r)) return 'web';
  if (/back|server|java\b|node|api/.test(r)) return 'backend';
  return 'sde';
}

export const topicsForTrack = (track) => (TRACK_TOPICS[track] || TRACK_TOPICS.sde).map((id) => ({ id, ...GENERIC_TOPICS[id] }));

const normalise = (s = '') =>
  s.toLowerCase().replace(/\b(pvt|private|ltd|limited|inc|llp|technologies|technology|india|software|services)\b/g, ' ').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

export function findCompany(name = '') {
  const n = normalise(name);
  if (!n) return null;
  return COMPANIES.find((c) => c.aliases.some((a) => n === a || new RegExp(`\\b${a}\\b`).test(n))) || null;
}

const slugOf = (name) => normalise(name).replace(/ /g, '-');

// Direct links we know exist + pre-filtered searches for the long tail
export function companyLinks(name, entry) {
  const slug = entry ? entry.slug : slugOf(name);
  const direct = [];
  if (CODE360_EXPERIENCES.includes(slug))
    direct.push({ title: `${name}: real interview experiences`, url: `${CODE360}/interview-experiences/${slug}`, note: 'Naukri Code360 · free' });
  if (CODE360_BUNDLE.includes(slug))
    direct.push({ title: `${name}: interview preparation bundle`, url: `${CODE360}/interview-bundle/${slug}`, note: 'Naukri Code360 · problems asked + guided path' });
  const search = [
    { title: `${name} interview experience on GeeksforGeeks`, url: g(`${name} interview experience site:geeksforgeeks.org`), note: 'Pre-filtered search' },
    { title: `${name} interview questions on LeetCode Discuss`, url: g(`${name} interview questions site:leetcode.com`), note: 'Pre-filtered search' },
    { title: `${name} interview questions on AmbitionBox`, url: g(`${name} interview questions site:ambitionbox.com`), note: 'Pre-filtered search' },
  ];
  return { direct: [...direct, ...(entry ? entry.extra : [])], search };
}

// Everything the Resources page / detail panel needs for one company
// kindOverride: product/service chosen by the user when the company is not in our list
export function getCompanyPrep(name, role = '', trackOverride, kindOverride) {
  const entry = findCompany(name);
  const track = trackOverride || inferTrack(role);
  const kind = (entry && entry.kind) || kindOverride || null;
  const mocks = [...(entry ? entry.mocks : []), ...(kind ? TYPE_GUIDES[kind].mocks : [])];
  const seen = new Set();
  return {
    entry,
    track,
    kind,
    links: companyLinks(name, entry),
    mocks: mocks.filter((m) => (seen.has(m.url + m.title) ? false : seen.add(m.url + m.title))),
    topics: topicsForTrack(track),
  };
}
