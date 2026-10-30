import {
  DifficultyProfile,
  DifficultyLevel,
  Question,
  MockPaper,
  MockPaperGenerationOptions,
} from './types';

export const DIFFICULTY_CURVES: Record<
  DifficultyProfile,
  Record<DifficultyLevel, number>
> = {
  CAIE_STANDARD: { EASY: 0.3, MEDIUM: 0.5, HARD: 0.2 },
  FOUNDATION: { EASY: 0.8, MEDIUM: 0.2, HARD: 0.0 },
  CHALLENGER: { EASY: 0.15, MEDIUM: 0.45, HARD: 0.4 },
  CUSTOM: { EASY: 0.34, MEDIUM: 0.33, HARD: 0.33 },
};

export const CORE_TOPICS = [
  'Number & Arithmetic',
  'Algebra & Graphs',
  'Geometry & Mensuration',
  'Statistics & Probability',
  'Trigonometry & Vectors',
] as const;

export const DEFAULT_FALLBACK_QUESTIONS: Question[] = [
  {
    id: 'q-num-1',
    code: '4024/11_Winter_2024_Q1',
    curriculum: 'CIE_O_LEVEL',
    subject_code: '4024',
    subject_name: 'Mathematics D',
    topic_category: 'Number & Arithmetic',
    difficulty_level: 'EASY',
    marks: 2,
    latex_prompt: 'Evaluate: $2 + 3 \\times (7 - 4)$',
    mark_scheme_latex: '$2 + 3(3) = 2 + 9 = 11 \\quad [M1 \\text{ for order of operations, } A1 \\text{ for } 11]$',
  },
  {
    id: 'q-num-2',
    code: '4024/11_Winter_2021_Q14',
    curriculum: 'CIE_O_LEVEL',
    subject_code: '4024',
    subject_name: 'Mathematics D',
    topic_category: 'Number & Arithmetic',
    difficulty_level: 'MEDIUM',
    marks: 3,
    latex_prompt: 'Express $420$ as a product of its prime factors in index form.',
    mark_scheme_latex: '$420 = 2^2 \\times 3 \\times 5 \\times 7 \\quad [M1 \\text{ prime factor ladder, } A1 \\text{ index form}]$',
  },
  {
    id: 'q-num-3',
    code: '4024/12_Summer_2024_Q5',
    curriculum: 'CIE_O_LEVEL',
    subject_code: '4024',
    subject_name: 'Mathematics D',
    topic_category: 'Number & Arithmetic',
    difficulty_level: 'HARD',
    marks: 4,
    latex_prompt: 'Calculate $\\frac{3.4 \\times 10^7}{8.5 \\times 10^{-3}}$, giving your answer in standard form $A \\times 10^n$ where $1 \\le A < 10$.',
    mark_scheme_latex: '$\\frac{3.4}{8.5} \\times 10^{7 - (-3)} = 0.4 \\times 10^{10} = 4.0 \\times 10^9 \\quad [M1 \\text{ divide, } M1 \\text{ index rule, } A2 \\text{ standard form}]$',
  },
  {
    id: 'q-alg-1',
    code: '4024/13_Summer_2025_Q17',
    curriculum: 'CIE_O_LEVEL',
    subject_code: '4024',
    subject_name: 'Mathematics D',
    topic_category: 'Algebra & Graphs',
    difficulty_level: 'EASY',
    marks: 2,
    latex_prompt: 'Factorise completely: $8x^2 - 18y^2$',
    mark_scheme_latex: '$2(4x^2 - 9y^2) = 2(2x - 3y)(2x + 3y) \\quad [M1 \\text{ common factor 2, } A1 \\text{ difference of squares}]$',
  },
  {
    id: 'q-alg-2',
    code: '4024/12_Summer_2025_Q1',
    curriculum: 'CIE_O_LEVEL',
    subject_code: '4024',
    subject_name: 'Mathematics D',
    topic_category: 'Algebra & Graphs',
    difficulty_level: 'MEDIUM',
    marks: 4,
    latex_prompt: 'Solve the simultaneous equations:$$\\begin{cases} 3x + 2y = 12 \\\\ x - y = 1 \\end{cases}$$',
    mark_scheme_latex: '$x = y + 1 \\implies 3(y+1) + 2y = 12 \\implies 5y = 9 \\implies y = 1.8, x = 2.8 \\quad [M1 \\text{ substitution, } A1 \\text{ for } x, A1 \\text{ for } y]$',
  },
  {
    id: 'q-alg-3',
    code: '4024/22_Summer_2024_Q8',
    curriculum: 'CIE_O_LEVEL',
    subject_code: '4024',
    subject_name: 'Mathematics D',
    topic_category: 'Algebra & Graphs',
    difficulty_level: 'HARD',
    marks: 5,
    latex_prompt: 'Solve the quadratic equation $2x^2 - 7x + 1 = 0$. Give your answers correct to 2 decimal places using $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.',
    mark_scheme_latex: '$x = \\frac{7 \\pm \\sqrt{41}}{4} \\implies x \\approx 3.35 \\text{ or } 0.15 \\quad [M1 \\text{ formula, } M1 \\text{ discriminant, } A1 \\text{ each}]$',
  },
  {
    id: 'q-geo-1',
    code: '4024/22_Summer_2023_Q22',
    curriculum: 'CIE_O_LEVEL',
    subject_code: '4024',
    subject_name: 'Mathematics D',
    topic_category: 'Geometry & Mensuration',
    difficulty_level: 'EASY',
    marks: 3,
    latex_prompt: 'A solid cone has radius $R = 6\\text{ cm}$ and slant height $l = 10\\text{ cm}$. Find the curved surface area using $A = \\pi R l$ in terms of $\\pi$.',
    mark_scheme_latex: '$A = \\pi \\times 6 \\times 10 = 60\\pi\\text{ cm}^2 \\quad [M1 \\text{ formula, } A2 \\text{ exact terms of } \\pi]$',
  },
  {
    id: 'q-geo-2',
    code: '4024/21_Winter_2024_Q6',
    curriculum: 'CIE_O_LEVEL',
    subject_code: '4024',
    subject_name: 'Mathematics D',
    topic_category: 'Geometry & Mensuration',
    difficulty_level: 'MEDIUM',
    marks: 4,
    latex_prompt: 'In a circle of radius $r = 7\\text{ cm}$, an arc subtends an angle $\\theta = 60^\\circ$ at the centre. Calculate the area of the sector: $\\text{Area} = \\frac{\\theta}{360} \\times \\pi r^2$. ($\\pi = \\frac{22}{7}$)',
    mark_scheme_latex: '$\\text{Area} = \\frac{60}{360} \\times \\frac{22}{7} \\times 49 = 25.67\\text{ cm}^2 \\quad [M1 \\text{ formula, } M1 \\text{ substitution, } A2 \\text{ answer}]$',
  },
  {
    id: 'q-geo-3',
    code: '4024/22_Winter_2024_Q9',
    curriculum: 'CIE_O_LEVEL',
    subject_code: '4024',
    subject_name: 'Mathematics D',
    topic_category: 'Geometry & Mensuration',
    difficulty_level: 'HARD',
    marks: 5,
    latex_prompt: 'In triangle ABC, side $a = 5\\text{ cm}$, $b = 8\\text{ cm}$, and angle $C = 60^\\circ$. Calculate side $c$ using $c^2 = a^2 + b^2 - 2ab\\cos(C)$.',
    mark_scheme_latex: '$c^2 = 25 + 64 - 80(0.5) = 49 \\implies c = 7\\text{ cm} \\quad [M1 \\text{ cosine rule, } M1 \\text{ eval, } A2 \\text{ answer } 7\\text{ cm}]$',
  },
  {
    id: 'q-stat-1',
    code: '4024/11_Summer_2024_Q3',
    curriculum: 'CIE_O_LEVEL',
    subject_code: '4024',
    subject_name: 'Mathematics D',
    topic_category: 'Statistics & Probability',
    difficulty_level: 'EASY',
    marks: 2,
    latex_prompt: 'A bag contains $5$ red balls and $3$ blue balls. A ball is picked at random. Calculate the probability $P(\\text{Blue})$.',
    mark_scheme_latex: '$P(\\text{Blue}) = \\frac{3}{5+3} = \\frac{3}{8} = 0.375 \\quad [M1 \\text{ denominator 8, } A1 \\text{ answer } 3/8]$',
  },
  {
    id: 'q-stat-2',
    code: '4024/22_Winter_2018_Q2',
    curriculum: 'CIE_O_LEVEL',
    subject_code: '4024',
    subject_name: 'Mathematics D',
    topic_category: 'Statistics & Probability',
    difficulty_level: 'MEDIUM',
    marks: 3,
    latex_prompt: 'Calculate the estimated mean $\\bar{x}$ for a grouped frequency distribution where $\\sum fx = 1420$ and total frequency $\\sum f = 50$.',
    mark_scheme_latex: '$\\bar{x} = \\frac{1420}{50} = 28.4 \\quad [M1 \\text{ mean quotient, } A2 \\text{ answer } 28.4]$',
  },
  {
    id: 'q-stat-3',
    code: '4024/23_Winter_2022_Q5',
    curriculum: 'CIE_O_LEVEL',
    subject_code: '4024',
    subject_name: 'Mathematics D',
    topic_category: 'Statistics & Probability',
    difficulty_level: 'HARD',
    marks: 4,
    latex_prompt: 'Two independent events $A$ and $B$ have $P(A) = 0.4$ and $P(B) = 0.7$. Calculate $P(A \\cup B)$ using $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.',
    mark_scheme_latex: '$P(A \\cap B) = 0.28 \\implies P(A \\cup B) = 0.4 + 0.7 - 0.28 = 0.82 \\quad [M1 \\text{ independence, } M1 \\text{ addition rule, } A2 \\text{ answer 0.82}]$',
  },
  {
    id: 'q-trig-1',
    code: '4024/12_Winter_2023_Q8',
    curriculum: 'CIE_O_LEVEL',
    subject_code: '4024',
    subject_name: 'Mathematics D',
    topic_category: 'Trigonometry & Vectors',
    difficulty_level: 'EASY',
    marks: 2,
    latex_prompt: 'Given vector $\\vec{v} = \\begin{pmatrix} 6 \\\\ -8 \\end{pmatrix}$, calculate its magnitude $|\\vec{v}| = \\sqrt{x^2 + y^2}$.',
    mark_scheme_latex: '$|\\vec{v}| = \\sqrt{36 + 64} = 10 \\quad [M1 \\text{ sum of squares, } A1 \\text{ answer 10}]$',
  },
  {
    id: 'q-trig-2',
    code: '4024/21_Summer_2024_Q11',
    curriculum: 'CIE_O_LEVEL',
    subject_code: '4024',
    subject_name: 'Mathematics D',
    topic_category: 'Trigonometry & Vectors',
    difficulty_level: 'MEDIUM',
    marks: 3,
    latex_prompt: 'Find all angles $\\theta$ in the range $0^\\circ \\le \\theta \\le 360^\\circ$ satisfying $\\sin(\\theta) = \\frac{\\sqrt{3}}{2}$.',
    mark_scheme_latex: '$\\theta = 60^\\circ \\text{ or } 120^\\circ \\quad [M1 \\text{ acute angle, } M1 \\text{ quadrant 2 rule, } A1 \\text{ both}]$',
  },
  {
    id: 'q-trig-3',
    code: '4024/22_Summer_2025_Q15',
    curriculum: 'CIE_O_LEVEL',
    subject_code: '4024',
    subject_name: 'Mathematics D',
    topic_category: 'Trigonometry & Vectors',
    difficulty_level: 'HARD',
    marks: 4,
    latex_prompt: 'Points A and B have position vectors $\\vec{a} = \\begin{pmatrix} 2 \\\\ 5 \\end{pmatrix}$ and $\\vec{b} = \\begin{pmatrix} 8 \\\\ -3 \\end{pmatrix}$. Find the unit vector in the direction of $\\vec{AB}$.',
    mark_scheme_latex: '$\\vec{AB} = \\begin{pmatrix} 6 \\\\ -8 \\end{pmatrix}, |\\vec{AB}| = 10 \\implies \\text{Unit vector} = \\begin{pmatrix} 0.6 \\\\ -0.8 \\end{pmatrix} \\quad [M1 \\text{ diff, } M1 \\text{ magnitude, } A2 \\text{ answer}]$',
  },
];

/**
 * Greedily selects questions matching topic checklist, difficulty distribution curve, and target marks.
 */
export function generateMockPaper(
  options: MockPaperGenerationOptions,
  pool: Question[] = DEFAULT_FALLBACK_QUESTIONS
): {
  paper: MockPaper;
  stats: {
    easyMarks: number;
    mediumMarks: number;
    hardMarks: number;
    totalMarks: number;
  };
} {
  const {
    title,
    targetMarks,
    durationMinutes,
    difficultyProfile,
    selectedTopics,
    branding,
  } = options;

  // Filter pool by selected topics (if topics specified)
  let candidatePool = pool.filter(
    (q) => selectedTopics.length === 0 || selectedTopics.includes(q.topic_category)
  );

  if (candidatePool.length === 0) {
    candidatePool = pool;
  }

  const curve = DIFFICULTY_CURVES[difficultyProfile] || DIFFICULTY_CURVES.CAIE_STANDARD;
  const targetEasy = Math.round(targetMarks * curve.EASY);
  const targetMed = Math.round(targetMarks * curve.MEDIUM);
  const targetHard = Math.round(targetMarks * curve.HARD);

  const selectedQuestions: Question[] = [];
  const selectedIds = new Set<string>();

  const easyPool = candidatePool.filter((q) => q.difficulty_level === 'EASY');
  const medPool = candidatePool.filter((q) => q.difficulty_level === 'MEDIUM');
  const hardPool = candidatePool.filter((q) => q.difficulty_level === 'HARD');

  let currentEasy = 0;
  let currentMed = 0;
  let currentHard = 0;
  let currentTotal = 0;

  function pickFromGroup(group: Question[], targetRemaining: number) {
    for (const q of group) {
      if (!selectedIds.has(q.id) && currentTotal + q.marks <= targetMarks && targetRemaining > 0) {
        selectedQuestions.push(q);
        selectedIds.add(q.id);
        currentTotal += q.marks;
        targetRemaining -= q.marks;
        if (q.difficulty_level === 'EASY') currentEasy += q.marks;
        else if (q.difficulty_level === 'MEDIUM') currentMed += q.marks;
        else if (q.difficulty_level === 'HARD') currentHard += q.marks;
      }
    }
  }

  // 1. Pick according to targets
  pickFromGroup(easyPool, targetEasy);
  pickFromGroup(medPool, targetMed);
  pickFromGroup(hardPool, targetHard);

  // 2. If marks remain, backfill from candidatePool
  for (const q of candidatePool) {
    if (currentTotal >= targetMarks) break;
    if (!selectedIds.has(q.id) && currentTotal + q.marks <= targetMarks) {
      selectedQuestions.push(q);
      selectedIds.add(q.id);
      currentTotal += q.marks;
      if (q.difficulty_level === 'EASY') currentEasy += q.marks;
      else if (q.difficulty_level === 'MEDIUM') currentMed += q.marks;
      else if (q.difficulty_level === 'HARD') currentHard += q.marks;
    }
  }

  // If still below targetMarks and candidate pool allows, pick smallest remaining
  if (selectedQuestions.length === 0 && candidatePool.length > 0) {
    selectedQuestions.push(candidatePool[0]);
    currentTotal = candidatePool[0].marks;
  }

  const paper: MockPaper = {
    id: `mock-${Date.now()}`,
    title,
    target_marks: currentTotal,
    duration_minutes: durationMinutes,
    difficulty_profile: difficultyProfile,
    question_ids: selectedQuestions.map((q) => q.id),
    questions_snapshot: selectedQuestions,
    branding_config: branding,
  };

  return {
    paper,
    stats: {
      easyMarks: currentEasy,
      mediumMarks: currentMed,
      hardMarks: currentHard,
      totalMarks: currentTotal,
    },
  };
}

/**
 * 1-Click Question Swap Engine:
 * Replaces a question with an alternative from the pool while preserving marks and atomically syncing mark scheme.
 * Supports round-robin cycling through all candidate alternatives to prevent starvation or 2-element ping-pong loops.
 */
export function swapQuestion(
  currentQuestionId: string,
  currentPaper: MockPaper,
  pool: Question[] = DEFAULT_FALLBACK_QUESTIONS
): {
  updatedPaper: MockPaper;
  replacedQuestion: Question;
  newQuestion: Question;
} | null {
  const index = currentPaper.questions_snapshot.findIndex(
    (q) => q.id === currentQuestionId
  );
  if (index === -1) return null;

  const currentQ = currentPaper.questions_snapshot[index];
  const existingIds = new Set(currentPaper.questions_snapshot.map((q) => q.id));

  // Helper to pick candidate after currentQ's position in pool to enable circular rotation
  function pickNextCandidate(candidates: Question[]): Question | undefined {
    if (candidates.length === 0) return undefined;
    if (candidates.length === 1) return candidates[0];

    const currentPoolIndex = pool.findIndex((q) => q.id === currentQ.id || q.code === currentQ.code);
    const nextInSequence = candidates.find((c) => {
      const idx = pool.findIndex((p) => p.id === c.id);
      return idx > currentPoolIndex;
    });

    return nextInSequence || candidates[0];
  }

  // 1. Try finding candidates with exact same marks and same topic, not already in paper
  const sameTopicCandidates = pool.filter(
    (q) =>
      !existingIds.has(q.id) &&
      q.id !== currentQ.id &&
      q.marks === currentQ.marks &&
      q.topic_category === currentQ.topic_category
  );
  let replacement = pickNextCandidate(sameTopicCandidates);

  // 2. Try finding candidates with exact same marks and difficulty, not in paper
  if (!replacement) {
    const sameDiffCandidates = pool.filter(
      (q) =>
        !existingIds.has(q.id) &&
        q.id !== currentQ.id &&
        q.marks === currentQ.marks &&
        q.difficulty_level === currentQ.difficulty_level
    );
    replacement = pickNextCandidate(sameDiffCandidates);
  }

  // 3. Try finding any candidate with exact same marks not in paper
  if (!replacement) {
    const sameMarksCandidates = pool.filter(
      (q) => !existingIds.has(q.id) && q.id !== currentQ.id && q.marks === currentQ.marks
    );
    replacement = pickNextCandidate(sameMarksCandidates);
  }

  // 4. Fallback: generate a variant with modified values if no different question in pool
  if (!replacement) {
    const baseCode = currentQ.code.replace(/_ALT\d*$/, '');
    const basePrompt = currentQ.latex_prompt.replace(/^\[(?:Alternative|Variant [A-Z])\]\s*/, '');
    const baseMarkScheme = currentQ.mark_scheme_latex.replace(/^\[(?:Alternative|Variant [A-Z])\]\s*/, '');

    replacement = {
      ...currentQ,
      id: `${currentQ.id}-alt-${Date.now()}`,
      code: `${baseCode}_ALT`,
      latex_prompt: `[Alternative] ${basePrompt}`,
      mark_scheme_latex: `[Alternative] ${baseMarkScheme}`,
    };
  }

  const updatedSnapshot = [...currentPaper.questions_snapshot];
  updatedSnapshot[index] = replacement;

  const updatedQuestionIds = updatedSnapshot.map((q) => q.id);

  const updatedPaper: MockPaper = {
    ...currentPaper,
    question_ids: updatedQuestionIds,
    questions_snapshot: updatedSnapshot,
    updated_at: new Date().toISOString(),
  };

  return {
    updatedPaper,
    replacedQuestion: currentQ,
    newQuestion: replacement,
  };
}
