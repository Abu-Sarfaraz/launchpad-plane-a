export type Curriculum = 'CIE_O_LEVEL' | 'CIE_A_LEVEL' | 'EDEXCEL' | 'IB' | 'CAIE';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export type DifficultyProfile = 'CAIE_STANDARD' | 'FOUNDATION' | 'CHALLENGER' | 'CUSTOM';

export interface Question {
  id: string;
  code: string;
  curriculum: string;
  subject_code: string;
  subject_name: string;
  topic_category: string;
  difficulty_level: DifficultyLevel;
  marks: number;
  latex_prompt: string;
  mark_scheme_latex: string;
  created_at?: string;
  updated_at?: string;
}

export interface BrandingConfig {
  instituteName: string;
  subtitle: string;
  logoUrl?: string;
  enableCoverPage: boolean;
  enableStudentHeader: boolean;
  candidateInstructions?: string;
  watermarkText?: string;
}

export interface MockPaperGenerationOptions {
  title: string;
  subject: string;
  subjectCode?: string;
  curriculum: Curriculum;
  targetMarks: number;
  durationMinutes: number;
  difficultyProfile: DifficultyProfile;
  selectedTopics: string[];
  branding: BrandingConfig;
}

export interface MockPaper {
  id: string;
  user_id?: string;
  institute_id?: string | null;
  title: string;
  target_marks: number;
  duration_minutes: number;
  difficulty_profile: DifficultyProfile;
  question_ids: string[];
  questions_snapshot: Question[];
  branding_config: BrandingConfig;
  created_at?: string;
  updated_at?: string;
}
