// Curated FREE resources for placement prep. Edit this file to add/remove links.
// Tags: Free = free to use, Hindi = Hindi/Hinglish content, Notes / Sheet / Videos / Practice = type.
// Some sites (e.g. PrepInsta, GeeksforGeeks) also have paid plans; the linked pages are free to read.

export const RESOURCE_SECTIONS = [
  {
    id: 'dsa',
    title: 'DSA roadmaps & practice sheets',
    blurb: 'Pick ONE sheet and finish it, instead of collecting ten.',
    items: [
      { title: "Striver's A2Z DSA Sheet", by: 'takeUforward', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', desc: 'Topic-wise roadmap from basics to graphs/DP with a video for each problem. Best if you are starting from zero.', tags: ['Free', 'Sheet', 'Videos'] },
      { title: "Striver's SDE Sheet", by: 'takeUforward', url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/', desc: 'Shorter, interview-focused list of the most asked problems. Good for the last 2-3 weeks.', tags: ['Free', 'Sheet'] },
      { title: 'Love Babbar 450 DSA Sheet', by: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/dsa-sheet-by-love-babbar/', desc: 'Classic 450-question sheet, grouped by topic with GfG article links.', tags: ['Free', 'Sheet'] },
      { title: 'NeetCode 150', by: 'NeetCode', url: 'https://neetcode.io/practice', desc: 'Curated 150 LeetCode problems by pattern, with video explanations.', tags: ['Free', 'Sheet', 'Videos'] },
      { title: 'LeetCode Top Interview 150', by: 'LeetCode', url: 'https://leetcode.com/studyplan/top-interview-150/', desc: "LeetCode's own study plan covering the standard interview patterns.", tags: ['Free', 'Practice'] },
      { title: 'takeUforward on YouTube', by: 'takeUforward', url: 'https://www.youtube.com/@takeUforward', desc: 'Video playlists that go with the sheets above.', tags: ['Free', 'Videos'] },
    ],
  },
  {
    id: 'cs',
    title: 'CS fundamentals: OS, DBMS, CN, OOP',
    blurb: 'These four subjects are asked in almost every technical round.',
    items: [
      { title: 'CodeWithHarry free notes', by: 'CodeWithHarry', url: 'https://codewithharry.com/notes', desc: 'Free downloadable notes and cheatsheets: DSA, Java, Python, JavaScript, MySQL, Git and more.', tags: ['Free', 'Hindi', 'Notes'] },
      { title: 'Apna College free notes', by: 'Apna College', url: 'https://www.apnacollege.in/notes', desc: 'Placement notes for theory subjects like Computer Networks and DBMS.', tags: ['Free', 'Hindi', 'Notes'] },
      { title: 'Gate Smashers', by: 'YouTube', url: 'https://www.youtube.com/@GateSmashers', desc: 'Hindi lecture playlists for OS, DBMS, Computer Networks and more. Great for quick concept clarity.', tags: ['Free', 'Hindi', 'Videos'] },
      { title: "Jenny's Lectures CS/IT", by: 'YouTube', url: 'https://www.youtube.com/@JennyslecturesCSIT', desc: 'Detailed lectures on DSA, OS, DBMS, TOC and compilers.', tags: ['Free', 'Videos'] },
      { title: 'Apna College on YouTube', by: 'Apna College', url: 'https://www.youtube.com/@ApnaCollegeOfficial', desc: 'Hindi/Hinglish placement-oriented playlists (DSA, Java, web dev).', tags: ['Free', 'Hindi', 'Videos'] },
    ],
  },
  {
    id: 'sql',
    title: 'SQL',
    blurb: 'Joins, GROUP BY and one window function cover most interview questions.',
    items: [
      { title: 'LeetCode SQL 50', by: 'LeetCode', url: 'https://leetcode.com/studyplan/top-sql-50/', desc: 'Fifty essential SQL problems, from easy selects to window functions.', tags: ['Free', 'Practice'] },
      { title: 'SQLBolt', by: 'SQLBolt', url: 'https://sqlbolt.com/', desc: 'Short interactive lessons you can finish in an evening.', tags: ['Free', 'Practice'] },
      { title: 'W3Schools SQL', by: 'W3Schools', url: 'https://www.w3schools.com/sql/', desc: 'Quick reference with a try-it editor.', tags: ['Free', 'Notes'] },
    ],
  },
  {
    id: 'aptitude',
    title: 'Aptitude & mass-recruiter tests (TCS, Infosys, Wipro...)',
    blurb: 'Service companies filter with aptitude + basic coding. Practise the pattern.',
    items: [
      { title: 'PrepInsta: all company dashboards', by: 'PrepInsta', url: 'https://prepinsta.com/all-companies-dashboard/', desc: 'Placement papers and patterns for TCS NQT, Infosys, Wipro, Cognizant, Accenture, Capgemini and many more.', tags: ['Free', 'Practice'] },
      { title: 'IndiaBIX aptitude', by: 'IndiaBIX', url: 'https://www.indiabix.com/', desc: 'Large bank of aptitude, logical reasoning and verbal questions with answers.', tags: ['Free', 'Practice'] },
    ],
  },
  {
    id: 'web',
    title: 'Web development & projects',
    blurb: 'Useful for full-stack / frontend roles and for explaining your projects.',
    items: [
      { title: 'javascript.info', by: 'javascript.info', url: 'https://javascript.info/', desc: 'The most thorough free JavaScript tutorial. Closures, promises, event loop explained properly.', tags: ['Free', 'Notes'] },
      { title: 'MDN Web Docs', by: 'Mozilla', url: 'https://developer.mozilla.org/', desc: 'The reference for HTML, CSS, JavaScript and web APIs.', tags: ['Free', 'Notes'] },
      { title: 'roadmap.sh', by: 'roadmap.sh', url: 'https://roadmap.sh/', desc: 'Visual roadmaps for frontend, backend, DevOps, system design and more.', tags: ['Free', 'Sheet'] },
      { title: 'CodeWithHarry on YouTube', by: 'CodeWithHarry', url: 'https://www.youtube.com/@CodeWithHarry', desc: 'Free Hindi courses on web development, Python, Java and DSA.', tags: ['Free', 'Hindi', 'Videos'] },
    ],
  },
  {
    id: 'design',
    title: 'System design & low-level design',
    blurb: 'Asked for SDE-1 at product companies (usually LLD) and more for SDE-2.',
    items: [
      { title: 'System Design Primer', by: 'GitHub', url: 'https://github.com/donnemartin/system-design-primer', desc: 'Free, widely used guide to large-scale system design with diagrams and flashcards.', tags: ['Free', 'Notes'] },
      { title: 'Gaurav Sen', by: 'YouTube', url: 'https://www.youtube.com/@gkcs', desc: 'System design concepts and case studies explained clearly.', tags: ['Free', 'Videos'] },
      { title: 'Refactoring Guru: design patterns', by: 'Refactoring Guru', url: 'https://refactoring.guru/design-patterns', desc: 'Readable catalog of OOP design patterns, useful for LLD and machine-coding rounds.', tags: ['Free', 'Notes'] },
    ],
  },
  {
    id: 'hr',
    title: 'HR, behavioural & resume',
    blurb: 'Rejections here are avoidable. Prepare 4-5 STAR stories.',
    items: [
      { title: 'Tech Interview Handbook', by: 'Yangshun Tay', url: 'https://www.techinterviewhandbook.org/', desc: 'Free guide covering resume, behavioural questions, coding interview prep and negotiation.', tags: ['Free', 'Notes'] },
      { title: 'Amazon Leadership Principles', by: 'Amazon', url: 'https://www.amazon.jobs/en/principles', desc: 'The 16 principles that Amazon interviews are built around. Useful STAR practice for any company.', tags: ['Free', 'Notes'] },
    ],
  },
  {
    id: 'practice',
    title: 'Practice platforms & real interview experiences',
    blurb: 'Learn what is actually being asked, from people who just interviewed.',
    items: [
      { title: 'Naukri Code360: interview experiences', by: 'Naukri Code360', url: 'https://www.naukri.com/code360/interview-experiences', desc: 'Round-by-round experiences from many companies, with the problems asked.', tags: ['Free', 'Practice'] },
      { title: 'LeetCode', by: 'LeetCode', url: 'https://leetcode.com/', desc: 'The standard platform for DSA practice and contests.', tags: ['Free', 'Practice'] },
      { title: 'HackerRank', by: 'HackerRank', url: 'https://www.hackerrank.com/', desc: 'Many companies run their online assessments here, so get used to the editor.', tags: ['Free', 'Practice'] },
    ],
  },
];

export const ALL_RESOURCES = RESOURCE_SECTIONS.flatMap((s) => s.items.map((i) => ({ ...i, section: s.title })));
