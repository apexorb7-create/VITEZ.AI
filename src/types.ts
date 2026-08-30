export type TenderSource = 'xarid.uz' | 'uzex.uz' | 'dxarid.uz' | 'e-ID.uz';

export type TenderCategory = 
  | 'Qurilish va Muhandislik' 
  | 'IT va Dasturiy Ta’minot' 
  | 'Tibbiyot va Farmatsevtika' 
  | 'Energetika va Kommunal' 
  | 'Konsalting va Ta’lim' 
  | 'Logistika va Transport';

export type TenderStatus = 'OPEN' | 'CLOSING_SOON' | 'EVALUATION' | 'CLOSED';

export type DecisionType = 'GO' | 'REVIEW' | 'NO_GO';

export type PipelineStageType = 'DISCOVERED' | 'ANALYZING' | 'PREPARING' | 'SUBMITTED' | 'WON' | 'LOST';

export type DocStatus = 'READY' | 'EXPIRING' | 'MISSING' | 'REVIEW';

export interface Company {
  id: string;
  name: string;
  industry: string;
  capabilities: string[];
  certifications: string[];
  employeeCount: number;
  foundedYear: number;
  experienceYears: number;
  taxId: string;
  address: string;
  annualRevenueUzs: number;
  licenseNumber: string;
}

export interface Tender {
  id: string;
  tenderNumber: string;
  title: string;
  agency: string;
  category: TenderCategory;
  budgetUzs: number;
  deadline: string;
  requirements: string[];
  sourcePortal: TenderSource;
  description: string;
  status: TenderStatus;
  publishedAt: string;
  region: string;
  earnestMoneyUzs: number;
  contractDurationMonths: number;
}

export interface FitScoreFactor {
  id: string;
  tenderId: string;
  name: string;
  weight: number; // 0 to 1
  score: number; // 0 to 100
  explanation: string;
  category: 'industry' | 'experience' | 'certifications' | 'budget' | 'technical';
}

export interface DealRoomTask {
  id: string;
  dealRoomId: string;
  title: string;
  completed: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: string;
  assignee: string;
}

export interface DealRoom {
  id: string;
  tenderId: string;
  companyId: string;
  fitScore: number;
  readinessScore: number;
  decision: DecisionType;
  stage: PipelineStageType;
  createdAt: string;
  updatedAt: string;
  tender?: Tender;
  factors?: FitScoreFactor[];
  tasks?: DealRoomTask[];
  notes?: string;
}

export interface Document {
  id: string;
  companyId: string;
  name: string;
  type: string;
  status: DocStatus;
  expiryDate: string | null;
  linkedTenderId: string | null;
  linkedTenderTitle?: string;
  fileSizeBytes?: number;
  lastVerifiedDate?: string;
  notes?: string;
  isBlockerForTender?: boolean;
}

export interface CopilotMessage {
  id: string;
  dealRoomId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  actionSuggestions?: Array<{
    label: string;
    prompt: string;
  }>;
}

export interface ActivityLog {
  id: string;
  dealRoomId?: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'fit_computed' | 'doc_updated' | 'stage_changed' | 'task_completed' | 'bid_created' | 'system';
}

export interface DocumentBlocker {
  documentId?: string;
  docName: string;
  status: DocStatus;
  reason: string;
  actionLabel: string;
  expiryDaysRemaining?: number;
}
