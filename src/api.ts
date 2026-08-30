import { 
  Company, 
  Tender, 
  DealRoom, 
  DealRoomTask, 
  Document, 
  CopilotMessage, 
  ActivityLog, 
  PipelineStageType,
  DocStatus
} from './types';

export const api = {
  // Dashboard Summary
  async getDashboardSummary(): Promise<any> {
    const res = await fetch('/api/dashboard');
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  // Company
  async getCompany(): Promise<Company> {
    const res = await fetch('/api/company');
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  async updateCompany(data: Partial<Company>): Promise<Company> {
    const res = await fetch('/api/company', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  // Tenders
  async getTenders(): Promise<Array<Tender & { fitScore: number; hasDealRoom: boolean; dealRoomId?: string }>> {
    const res = await fetch('/api/tenders');
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  async getTender(id: string): Promise<Tender & { factors: any[]; fitScore: number; dealRoomId?: string }> {
    const res = await fetch(`/api/tenders/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  async createTender(data: Partial<Tender>): Promise<Tender> {
    const res = await fetch('/api/tenders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  // Deal Rooms
  async getDealRooms(): Promise<DealRoom[]> {
    const res = await fetch('/api/deals');
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  async getDealRoom(id: string): Promise<DealRoom & { blockers: any[] }> {
    const res = await fetch(`/api/deals/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  async createDealRoom(tenderId: string): Promise<DealRoom> {
    const res = await fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenderId }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  async updateDealRoom(id: string, updates: Partial<DealRoom>): Promise<DealRoom> {
    const res = await fetch(`/api/deals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  async updateDealStage(dealId: string, stage: PipelineStageType): Promise<DealRoom> {
    const res = await fetch(`/api/pipeline/${dealId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  // Tasks
  async addTask(dealRoomId: string, task: { title: string; priority?: string; dueDate?: string; assignee?: string }): Promise<DealRoomTask> {
    const res = await fetch(`/api/deals/${dealRoomId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  async toggleTask(taskId: string): Promise<DealRoomTask> {
    const res = await fetch(`/api/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  async deleteTask(taskId: string): Promise<boolean> {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    return json.success;
  },

  // Documents
  async getDocuments(): Promise<{ documents: Document[]; blockers: any[] }> {
    const res = await fetch('/api/documents');
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return { documents: json.data, blockers: json.blockers };
  },

  async addDocument(doc: Partial<Document>): Promise<Document> {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  async updateDocumentStatus(id: string, status: DocStatus, expiryDate?: string | null): Promise<Document> {
    const res = await fetch(`/api/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, expiryDate }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  async deleteDocument(id: string): Promise<boolean> {
    const res = await fetch(`/api/documents/${id}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    return json.success;
  },

  // Copilot
  async getCopilotMessages(dealRoomId: string): Promise<CopilotMessage[]> {
    const res = await fetch(`/api/deals/${dealRoomId}/copilot/messages`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  async sendCopilotMessage(dealRoomId: string, message: string): Promise<CopilotMessage> {
    const res = await fetch(`/api/deals/${dealRoomId}/copilot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  // Analytics & Activities
  async getAnalytics(): Promise<any> {
    const res = await fetch('/api/analytics');
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  async getActivities(): Promise<ActivityLog[]> {
    const res = await fetch('/api/activities');
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json.data;
  },

  async resetSeed(): Promise<any> {
    const res = await fetch('/api/reset-seed', {
      method: 'POST',
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Xatolik yuz berdi');
    return json;
  }
};

export function formatUzs(amount: number): string {
  if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(2)} mlrd UZS`;
  }
  if (amount >= 1e6) {
    return `${(amount / 1e6).toFixed(1)} mln UZS`;
  }
  return `${amount.toLocaleString()} UZS`;
}

export function formatUzsFull(amount: number): string {
  return `${amount.toLocaleString('ru-RU')} UZS`;
}
