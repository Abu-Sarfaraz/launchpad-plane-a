-- Migration: PaperCraft AI Studio Relational Question Bank, Institutes, Mock Papers, and Generated PDFs
-- Enforces strict Row Level Security (RLS) across all tables

-- 1. questions_bank Table
CREATE TABLE IF NOT EXISTS public.questions_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  curriculum TEXT NOT NULL DEFAULT 'CIE_O_LEVEL',
  subject_code TEXT NOT NULL DEFAULT '4024',
  subject_name TEXT NOT NULL DEFAULT 'Mathematics D',
  topic_category TEXT NOT NULL,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('EASY', 'MEDIUM', 'HARD')),
  marks INTEGER NOT NULL DEFAULT 1,
  latex_prompt TEXT NOT NULL,
  mark_scheme_latex TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questions_bank_topic ON public.questions_bank(topic_category);
CREATE INDEX IF NOT EXISTS idx_questions_bank_difficulty ON public.questions_bank(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_questions_bank_curriculum ON public.questions_bank(curriculum, subject_code);

ALTER TABLE public.questions_bank ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on questions_bank"
  ON public.questions_bank FOR SELECT
  USING (true);

CREATE POLICY "Allow admins to insert questions"
  ON public.questions_bank FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Allow admins to update questions"
  ON public.questions_bank FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Allow admins to delete questions"
  ON public.questions_bank FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );


-- 2. institutes Table
CREATE TABLE IF NOT EXISTS public.institutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subtitle TEXT,
  logo_storage_path TEXT,
  logo_url TEXT,
  official_cover_page_enabled BOOLEAN NOT NULL DEFAULT true,
  student_header_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_institutes_owner_id ON public.institutes(owner_id);

ALTER TABLE public.institutes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own institutes"
  ON public.institutes FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own institutes"
  ON public.institutes FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own institutes"
  ON public.institutes FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete their own institutes"
  ON public.institutes FOR DELETE
  USING (owner_id = auth.uid());


-- 3. mock_papers Table
CREATE TABLE IF NOT EXISTS public.mock_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institute_id UUID REFERENCES public.institutes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  target_marks INTEGER NOT NULL DEFAULT 30,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  difficulty_profile TEXT NOT NULL DEFAULT 'CAIE_STANDARD' CHECK (difficulty_profile IN ('CAIE_STANDARD', 'FOUNDATION', 'CHALLENGER', 'CUSTOM')),
  question_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  questions_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  branding_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mock_papers_user_id ON public.mock_papers(user_id);

ALTER TABLE public.mock_papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mock papers"
  ON public.mock_papers FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own mock papers"
  ON public.mock_papers FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own mock papers"
  ON public.mock_papers FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own mock papers"
  ON public.mock_papers FOR DELETE
  USING (user_id = auth.uid());


-- 4. generated_pdfs Table
CREATE TABLE IF NOT EXISTS public.generated_pdfs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mock_paper_id UUID NOT NULL REFERENCES public.mock_papers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  storage_path TEXT,
  file_size_bytes INTEGER NOT NULL DEFAULT 0,
  download_url TEXT,
  include_mark_scheme BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_generated_pdfs_user_id ON public.generated_pdfs(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_pdfs_mock_paper_id ON public.generated_pdfs(mock_paper_id);

ALTER TABLE public.generated_pdfs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generated pdfs"
  ON public.generated_pdfs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own generated pdfs"
  ON public.generated_pdfs FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own generated pdfs"
  ON public.generated_pdfs FOR DELETE
  USING (user_id = auth.uid());


-- 5. Seed Core Examination Question Bank
INSERT INTO public.questions_bank (code, curriculum, subject_code, subject_name, topic_category, difficulty_level, marks, latex_prompt, mark_scheme_latex)
VALUES
  (
    '4024/11_Winter_2024_Q1',
    'CIE_O_LEVEL',
    '4024',
    'Mathematics D',
    'Number & Arithmetic',
    'EASY',
    2,
    'Evaluate: 2 + 3 \times (7 - 4)',
    '2 + 3(3) = 2 + 9 = 11 \quad [M1 \text{ for order of operations, } A1 \text{ for } 11]'
  ),
  (
    '4024/11_Winter_2021_Q14',
    'CIE_O_LEVEL',
    '4024',
    'Mathematics D',
    'Number & Arithmetic',
    'MEDIUM',
    3,
    'Express 420 as a product of its prime factors in index form.',
    '420 = 2^2 \times 3 \times 5 \times 7 \quad [M1 \text{ for factor tree/division, } A1 \text{ for prime factors, } A1 \text{ for index form}]'
  ),
  (
    '4024/12_Summer_2024_Q5',
    'CIE_O_LEVEL',
    '4024',
    'Mathematics D',
    'Number & Arithmetic',
    'HARD',
    4,
    'Calculate \frac{3.4 \times 10^7}{8.5 \times 10^{-3}}, giving your answer in standard form A \times 10^n where 1 \le A < 10.',
    '\frac{3.4}{8.5} \times 10^{7 - (-3)} = 0.4 \times 10^{10} = 4.0 \times 10^9 \quad [M1 \text{ divide coefficients, } M1 \text{ index rule, } A2 \text{ standard form}]'
  ),
  (
    '4024/12_Summer_2025_Q1',
    'CIE_O_LEVEL',
    '4024',
    'Mathematics D',
    'Algebra & Graphs',
    'MEDIUM',
    4,
    'Solve the simultaneous equations:\n\begin{cases} 3x + 2y = 12 \\ x - y = 1 \end{cases}',
    'x = y + 1 \implies 3(y+1) + 2y = 12 \implies 5y = 9 \implies y = 1.8, x = 2.8 \quad [M1 \text{ substitution/elimination, } M1 \text{ single variable, } A1 \text{ for } x, A1 \text{ for } y]'
  ),
  (
    '4024/13_Summer_2025_Q17',
    'CIE_O_LEVEL',
    '4024',
    'Mathematics D',
    'Algebra & Graphs',
    'EASY',
    2,
    'Factorise completely: 8x^2 - 18y^2',
    '2(4x^2 - 9y^2) = 2(2x - 3y)(2x + 3y) \quad [M1 \text{ common factor of 2, } A1 \text{ difference of two squares}]'
  ),
  (
    '4024/22_Summer_2024_Q8',
    'CIE_O_LEVEL',
    '4024',
    'Mathematics D',
    'Algebra & Graphs',
    'HARD',
    5,
    'Solve the quadratic equation 2x^2 - 7x + 1 = 0. Give your answers correct to 2 decimal places using x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}.',
    'x = \frac{7 \pm \sqrt{(-7)^2 - 4(2)(1)}}{2(2)} = \frac{7 \pm \sqrt{41}}{4} \implies x \approx 3.35 \text{ or } x \approx 0.15 \quad [M1 \text{ correct formula substitution, } M1 \text{ discriminant 41, } A1 \text{ for } 3.35, A1 \text{ for } 0.15]'
  ),
  (
    '4024/21_Winter_2024_Q6',
    'CIE_O_LEVEL',
    '4024',
    'Mathematics D',
    'Geometry & Mensuration',
    'MEDIUM',
    4,
    'In a circle of radius r = 7\text{ cm}, an arc subtends an angle \theta = 60^\circ at the centre. Calculate the area of the sector: \text{Area} = \frac{\theta}{360} \times \pi r^2. (Use \pi = \frac{22}{7})',
    '\text{Area} = \frac{60}{360} \times \frac{22}{7} \times 7^2 = \frac{1}{6} \times 154 = \frac{77}{3} \approx 25.67\text{ cm}^2 \quad [M1 \text{ sector formula, } M1 \text{ substitution, } A2 \text{ final value}]'
  ),
  (
    '4024/22_Summer_2023_Q22',
    'CIE_O_LEVEL',
    '4024',
    'Mathematics D',
    'Geometry & Mensuration',
    'EASY',
    3,
    'A solid cone has radius R = 6\text{ cm} and slant height l = 10\text{ cm}. Find the curved surface area using A_{\text{curved}} = \pi R l. Give your answer in terms of \pi.',
    'A = \pi \times 6 \times 10 = 60\pi\text{ cm}^2 \quad [M1 \text{ formula, } A2 \text{ exact value in terms of } \pi]'
  ),
  (
    '4024/22_Winter_2024_Q9',
    'CIE_O_LEVEL',
    '4024',
    'Mathematics D',
    'Geometry & Mensuration',
    'HARD',
    5,
    'In triangle ABC, side a = 5\text{ cm}, b = 8\text{ cm}, and angle C = 60^\circ. Calculate the exact length of side c using the cosine rule: c^2 = a^2 + b^2 - 2ab\cos(C).',
    'c^2 = 5^2 + 8^2 - 2(5)(8)\cos(60^\circ) = 25 + 64 - 80(0.5) = 89 - 40 = 49 \implies c = \sqrt{49} = 7\text{ cm} \quad [M1 \text{ cosine rule, } M1 \text{ evaluate } \cos(60^\circ)=0.5, M1 \text{ compute 49, } A2 \text{ for } c = 7\text{ cm}]'
  ),
  (
    '4024/11_Summer_2024_Q3',
    'CIE_O_LEVEL',
    '4024',
    'Mathematics D',
    'Statistics & Probability',
    'EASY',
    2,
    'A bag contains 5 red balls and 3 blue balls. A ball is picked at random. Calculate the probability P(\text{Blue}).',
    'P(\text{Blue}) = \frac{3}{5+3} = \frac{3}{8} = 0.375 \quad [M1 \text{ for denominator 8, } A1 \text{ for } 3/8]'
  ),
  (
    '4024/22_Winter_2018_Q2',
    'CIE_O_LEVEL',
    '4024',
    'Mathematics D',
    'Statistics & Probability',
    'MEDIUM',
    3,
    'Calculate the estimated mean \bar{x} for a grouped frequency distribution where \sum fx = 1420 and total frequency \sum f = 50.',
    '\bar{x} = \frac{\sum fx}{\sum f} = \frac{1420}{50} = 28.4 \quad [M1 \text{ mean formula quotient, } A2 \text{ accurate answer 28.4}]'
  ),
  (
    '4024/23_Winter_2022_Q5',
    'CIE_O_LEVEL',
    '4024',
    'Mathematics D',
    'Statistics & Probability',
    'HARD',
    4,
    'Two independent events A and B have P(A) = 0.4 and P(B) = 0.7. Calculate P(A \cup B) using P(A \cup B) = P(A) + P(B) - P(A \cap B).',
    'P(A \cap B) = P(A) \times P(B) = 0.4 \times 0.7 = 0.28. \text{ Then } P(A \cup B) = 0.4 + 0.7 - 0.28 = 0.82 \quad [M1 \text{ independence product rule, } M1 \text{ addition theorem, } A2 \text{ answer 0.82}]'
  ),
  (
    '4024/12_Winter_2023_Q8',
    'CIE_O_LEVEL',
    '4024',
    'Mathematics D',
    'Trigonometry & Vectors',
    'EASY',
    2,
    'Given vector \vec{v} = \begin{pmatrix} 6 \\ -8 \end{pmatrix}, calculate its magnitude |\vec{v}| = \sqrt{x^2 + y^2}.',
    '|\vec{v}| = \sqrt{6^2 + (-8)^2} = \sqrt{36 + 64} = \sqrt{100} = 10 \quad [M1 \text{ Pythagoras sum of squares, } A1 \text{ for } 10]'
  ),
  (
    '4024/21_Summer_2024_Q11',
    'CIE_O_LEVEL',
    '4024',
    'Mathematics D',
    'Trigonometry & Vectors',
    'MEDIUM',
    3,
    'Find all angles \theta in the range 0^\circ \le \theta \le 360^\circ satisfying \sin(\theta) = \frac{\sqrt{3}}{2}.',
    '\text{Reference angle } \theta = 60^\circ. \text{ Quadrant 2: } 180^\circ - 60^\circ = 120^\circ. \implies \theta = 60^\circ \text{ or } 120^\circ \quad [M1 \text{ for } 60^\circ, M1 \text{ for quadrant 2 rule, } A1 \text{ for both solutions}]'
  ),
  (
    '4024/22_Summer_2025_Q15',
    'CIE_O_LEVEL',
    '4024',
    'Mathematics D',
    'Trigonometry & Vectors',
    'HARD',
    4,
    'Points A and B have position vectors \vec{a} = \begin{pmatrix} 2 \\ 5 \end{pmatrix} and \vec{b} = \begin{pmatrix} 8 \\ -3 \end{pmatrix}. Find the unit vector in the direction of \vec{AB}.',
    '\vec{AB} = \vec{b} - \vec{a} = \begin{pmatrix} 6 \\ -8 \end{pmatrix}. |\vec{AB}| = 10. \text{ Unit vector } = \frac{1}{10}\begin{pmatrix} 6 \\ -8 \end{pmatrix} = \begin{pmatrix} 0.6 \\ -0.8 \end{pmatrix} \quad [M1 \text{ vector difference, } M1 \text{ magnitude, } A2 \text{ unit vector}]'
  )
ON CONFLICT (code) DO NOTHING;
