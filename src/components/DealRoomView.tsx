import React, { useState, useEffect, useRef } from 'react';
import { 
  Radar, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Bot, 
  Send, 
  Plus, 
  Trash2, 
  FileText, 
  ExternalLink, 
  Sparkles, 
  CheckSquare, 
  Square, 
  Upload, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Building,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { 
  DealRoom, 
  FitScoreFactor, 
  DealRoomTask, 
  CopilotMessage, 
  PipelineStageType,
  DocumentBlocker
} from '../types';
import { api, formatUzs, formatUzsFull } from '../api';
import confetti from 'canvas-confetti';

interface DealRoomViewProps {
  dealId: string;
  onNavigateTab: (tab: any) => void;
  onRefreshGlobalData: () => void;
}

export const DealRoomView: React.FC<DealRoomViewProps> = ({
  dealId,
  onNavigateTab,
  onRefreshGlobalData,
}) => {
  const [deal, setDeal] = useState<(DealRoom & { blockers: DocumentBlocker[] }) | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Copilot state
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Task form state
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Bosh muhandis');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Expand factors toggle
  const [expandedFactors, setExpandedFactors] = useState(true);

  // Quick document fix modal/state
  const [updatingDocId, setUpdatingDocId] = useState<string | null>(null);

  const fetchDealData = async () => {
    try {
      setLoading(true);
      const data = await api.getDealRoom(dealId);
      setDeal(data);
      const msgs = await api.getCopilotMessages(dealId);
      setCopilotMessages(msgs);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Deal Room ma’lumotlarini yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dealId) {
      fetchDealData();
    }
  }, [dealId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages]);

  const handleStageChange = async (newStage: PipelineStageType) => {
    if (!deal) return;
    try {
      const updated = await api.updateDealStage(deal.id, newStage);
      setDeal(prev => prev ? { ...prev, stage: updated.stage } : null);
      onRefreshGlobalData();
      if (newStage === 'WON') {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      alert('Bosqichni o‘zgartirishda xatolik: ' + err.message);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await api.toggleTask(taskId);
      await fetchDealData();
      onRefreshGlobalData();
    } catch (err: any) {
      alert('Vazifani o‘zgartirishda xatolik: ' + err.message);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !deal) return;
    try {
      await api.addTask(deal.id, {
        title: newTaskTitle,
        priority: newTaskPriority,
        dueDate: newTaskDueDate || new Date(Date.now() + 5*86400000).toISOString().split('T')[0],
        assignee: newTaskAssignee
      });
      setNewTaskTitle('');
      setShowAddTask(false);
      await fetchDealData();
      onRefreshGlobalData();
    } catch (err: any) {
      alert('Vazifa qo‘shishda xatolik: ' + err.message);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      await fetchDealData();
      onRefreshGlobalData();
    } catch (err: any) {
      alert('Vazifani o‘chirishda xatolik: ' + err.message);
    }
  };

  const handleResolveBlocker = async (docId?: string) => {
    if (!docId) {
      onNavigateTab('documents');
      return;
    }
    try {
      setUpdatingDocId(docId);
      // Mark document as READY and update expiry to future
      await api.updateDocumentStatus(docId, 'READY', '2028-12-31T00:00:00Z');
      
      // Auto-trigger Copilot acknowledgement
      await api.sendCopilotMessage(
        dealId,
        `Hujjat blokeri (${docId}) bartaraf etildi va statusi READY ga o‘tkazildi. Endi Readiness ko‘rsatkichini qayta baholang.`
      );

      await fetchDealData();
      onRefreshGlobalData();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // Safe fallback if canvas not available
      }
    } catch (err: any) {
      alert('Hujjatni yangilashda xatolik: ' + err.message);
    } finally {
      setUpdatingDocId(null);
    }
  };

  const handleSendCopilot = async (messageText: string) => {
    const text = messageText || chatInput;
    if (!text.trim() || !deal) return;

    // Optimistically add user msg
    const userTempMsg: CopilotMessage = {
      id: `temp-${Date.now()}`,
      dealRoomId: deal.id,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString()
    };
    setCopilotMessages(prev => [...prev, userTempMsg]);
    setChatInput('');
    setCopilotLoading(true);

    try {
      const assistantMsg = await api.sendCopilotMessage(deal.id, text);
      setCopilotMessages(prev => [...prev.filter(m => m.id !== userTempMsg.id), userTempMsg, assistantMsg]);
    } catch (err: any) {
      alert('Copilot bilan aloqada xatolik: ' + err.message);
    } finally {
      setCopilotLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center space-y-3 bg-[#0f1e2e] border border-[#1e3852] rounded-md">
        <Radar className="w-8 h-8 text-[#ffb020] animate-spin mx-auto" />
        <p className="font-mono text-xs text-[#8ca0b3]">Deal Room tahlili va Fit Score yuklanmoqda...</p>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="p-8 text-center space-y-3 bg-[#0f1e2e] border border-[#ff6b5c]/40 rounded-md">
        <AlertTriangle className="w-8 h-8 text-[#ff6b5c] mx-auto" />
        <h2 className="font-heading text-lg font-bold text-[#e8edf2]">Deal Room topilmadi</h2>
        <p className="text-xs text-[#8ca0b3]">{error || 'Iltimos, boshqa tenderni tanlang.'}</p>
        <button
          onClick={() => onNavigateTab('tenders')}
          className="px-4 py-2 bg-[#13253a] hover:bg-[#1a334d] text-xs font-mono text-[#ffb020] rounded border border-[#1e3852]"
        >
          Tenderlar Ro‘yxatiga Qaytish
        </button>
      </div>
    );
  }

  const tender = deal.tender;
  const factors = deal.factors || [];
  const tasks = deal.tasks || [];
  const blockers = deal.blockers || [];

  const completedTasksCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-5 lg:p-6 rounded-md bg-[#0f1e2e] border border-[#1e3852] bg-grid-pattern relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 relative z-10">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#ffb020] bg-[#ffb020]/15 px-2.5 py-0.5 rounded border border-[#ffb020]/30 uppercase flex items-center gap-1.5">
                <Radar className="w-3.5 h-3.5" />
                DEAL ROOM // MOSLIK VA TAYYORGARLIK
              </span>

              {tender?.sourcePortal && (
                <span className="font-mono text-xs px-2 py-0.5 rounded uppercase font-bold bg-[#1e3a5f] text-[#5eead4] border border-[#295282]">
                  {tender.sourcePortal}
                </span>
              )}

              <span className="font-mono text-xs text-[#8ca0b3]">
                № {tender?.tenderNumber || 'UZ-XARID-2026-4891'}
              </span>

              <span className="font-mono text-xs text-[#8ca0b3] bg-[#13253a] px-2 py-0.5 rounded border border-[#1e3852]">
                {tender?.category}
              </span>
            </div>

            <h1 className="font-heading text-xl lg:text-2xl font-bold text-[#e8edf2] leading-snug">
              {tender?.title || 'Toshkent shahrida 12 ta davlat maktabini kompleks rekonstruktsiya qilish'}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#8ca0b3] pt-1">
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#5eead4]" />
                <span className="text-[#e8edf2]">{tender?.agency}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-[#8ca0b3]">Byudjet:</span>
                <span className="text-[#ffb020] font-bold">{tender ? formatUzs(tender.budgetUzs) : '18.45 mlrd UZS'}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#8ca0b3]" />
                <span>Muddati: {tender ? new Date(tender.deadline).toLocaleDateString('uz-UZ') : '18.09.2026'}</span>
              </div>
            </div>
          </div>

          {/* Pipeline Stage Switcher */}
          <div className="p-3 rounded bg-[#091422] border border-[#1e3852] shrink-0 space-y-1.5">
            <div className="text-[10px] font-mono text-[#8ca0b3] uppercase">Pipeline Bosqichi:</div>
            <select
              value={deal.stage}
              onChange={(e) => handleStageChange(e.target.value as PipelineStageType)}
              className="w-full bg-[#13253a] border border-[#214366] text-xs font-mono text-[#ffb020] font-bold rounded px-2.5 py-1.5 focus:outline-none focus:border-[#ffb020]"
            >
              <option value="DISCOVERED">1. DISCOVERED (Topilgan)</option>
              <option value="ANALYZING">2. ANALYZING (Tahlil qilinmoqda)</option>
              <option value="PREPARING">3. PREPARING (Tayyorlanmoqda)</option>
              <option value="SUBMITTED">4. SUBMITTED (Topshirilgan)</option>
              <option value="WON">5. WON (Yutilgan ✓)</option>
              <option value="LOST">6. LOST (Rad etilgan ✕)</option>
            </select>
          </div>
        </div>
      </div>

      {/* CORE DUAL METRICS & DECISION HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Large Fit Score */}
        <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#ffb020]/40 shadow-[0_0_20px_rgba(255,176,32,0.08)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radar className="w-4 h-4 text-[#ffb020]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#ffb020]">
                Fit Score (Moslik)
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#5eead4] bg-[#5eead4]/10 px-1.5 py-0.2 rounded border border-[#5eead4]/20">
              5 omil o‘rtachasi
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-mono text-4xl lg:text-5xl font-extrabold text-[#ffb020]">
              {deal.fitScore}
            </span>
            <span className="font-mono text-lg text-[#8ca0b3]">/ 100</span>
            <span className="font-mono text-xs text-[#5eead4] font-medium ml-auto">
              Strategik Mos
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#13253a] h-2.5 rounded-full overflow-hidden border border-[#1e3852]">
            <div 
              className="h-full bg-gradient-to-r from-[#ffb020] to-[#5eead4] rounded-full transition-all duration-500"
              style={{ width: `${deal.fitScore}%` }}
            ></div>
          </div>

          <p className="text-[11px] text-[#8ca0b3]">
            Kompaniya tajribasi, shtati va litsenziyalari mazkur tender talablariga 94% muvofiq.
          </p>
        </div>

        {/* Metric 2: Readiness Score */}
        <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#5eead4]/40 shadow-[0_0_20px_rgba(94,234,212,0.08)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5eead4]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#5eead4]">
                Readiness Score (Tayyorgarlik)
              </span>
            </div>
            <span className={`font-mono text-[11px] px-1.5 py-0.2 rounded border ${
              blockers.length > 0
                ? 'bg-[#ff6b5c]/15 text-[#ff6b5c] border-[#ff6b5c]/30'
                : 'bg-[#5eead4]/15 text-[#5eead4] border-[#5eead4]/30'
            }`}>
              {blockers.length} ta bloker
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className={`font-mono text-4xl lg:text-5xl font-extrabold ${
              deal.readinessScore >= 80 ? 'text-[#5eead4]' : deal.readinessScore >= 60 ? 'text-[#ffb020]' : 'text-[#ff6b5c]'
            }`}>
              {deal.readinessScore}
            </span>
            <span className="font-mono text-lg text-[#8ca0b3]">/ 100</span>
            <span className="font-mono text-xs text-[#8ca0b3] font-medium ml-auto">
              Hujjat & Vazifalar
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#13253a] h-2.5 rounded-full overflow-hidden border border-[#1e3852]">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                deal.readinessScore >= 80 ? 'bg-[#5eead4]' : 'bg-[#ffb020]'
              }`}
              style={{ width: `${deal.readinessScore}%` }}
            ></div>
          </div>

          <p className="text-[11px] text-[#8ca0b3]">
            {blockers.length > 0 
              ? `${blockers.length} ta ochiq hujjat yangilansa, ko‘rsatkich ~92 gacha oshadi.` 
              : 'Barcha zarur hujjatlar va tasdiqlar to‘liq tayyor.'}
          </p>
        </div>

        {/* Metric 3: Automated Decision Badge */}
        <div className={`p-5 rounded-md border flex flex-col justify-between ${
          deal.decision === 'GO'
            ? 'bg-[#102422] border-[#5eead4]/50 shadow-[0_0_20px_rgba(94,234,212,0.12)]'
            : deal.decision === 'REVIEW'
            ? 'bg-[#241e10] border-[#ffb020]/50'
            : 'bg-[#241214] border-[#ff6b5c]/50'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#8ca0b3]">
                Algoritmik Qaror
              </span>
              <span className="font-mono text-[10px] text-[#8ca0b3]">Avtomatik Tavsiya</span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-4 py-1.5 rounded font-mono font-extrabold text-2xl tracking-widest border ${
                deal.decision === 'GO'
                  ? 'bg-[#5eead4]/20 text-[#5eead4] border-[#5eead4]/50 shadow-[0_0_12px_rgba(94,234,212,0.3)]'
                  : deal.decision === 'REVIEW'
                  ? 'bg-[#ffb020]/20 text-[#ffb020] border-[#ffb020]/50'
                  : 'bg-[#ff6b5c]/20 text-[#ff6b5c] border-[#ff6b5c]/50'
              }`}>
                {deal.decision}
              </div>
              <div className="text-xs font-sans font-medium text-[#e8edf2]">
                {deal.decision === 'GO'
                  ? 'Qatnashish tavsiya etiladi (Evidence review)'
                  : deal.decision === 'REVIEW'
                  ? 'Qo‘shimcha tahlil talab etiladi'
                  : 'Qatnashish tavsiya etilmaydi'}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1e3852] text-[11px] font-mono text-[#8ca0b3]">
            Qaror mezoni: Fit &gt;= 85 va Readiness &gt;= 70
          </div>
        </div>
      </div>

      {/* Main Grid: Breakdown & Tasks on Left, Copilot on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Transparent Factor Breakdown, Document Blockers, Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 1: TRANSPARENT FIT SCORE FACTOR BREAKDOWN */}
          <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#1a334d] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffb020]"></span>
                <h2 className="font-heading text-base font-bold text-[#e8edf2]">
                  Fit Score Omillari va Shaffof Hisob-kitob (Transparency Engine)
                </h2>
              </div>
              <button
                onClick={() => setExpandedFactors(!expandedFactors)}
                className="text-xs font-mono text-[#ffb020] hover:underline flex items-center gap-1"
              >
                <span>{expandedFactors ? 'Yopish' : 'Barcha omillarni ochish'}</span>
                {expandedFactors ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="text-xs text-[#8ca0b3]">
              VITEZ.AI barcha ballarni ochiq omillar va ularning vaznlari asosida hisoblaydi. Hech qanday yashirin yoki feyk raqamlar ishlatilmaydi:
            </p>

            {expandedFactors && (
              <div className="space-y-3 pt-1">
                {factors.map((factor, index) => (
                  <div
                    key={factor.id || index}
                    className="p-3.5 rounded bg-[#13253a]/70 border border-[#1e3852] hover:border-[#284c70] transition-colors space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#ffb020] font-bold">
                          0{index + 1}.
                        </span>
                        <h3 className="font-sans text-xs font-bold text-[#e8edf2]">
                          {factor.name}
                        </h3>
                        <span className="font-mono text-[10px] text-[#8ca0b3] bg-[#0c1826] px-1.5 py-0.2 rounded border border-[#1a334d]">
                          vazn: {(factor.weight * 100).toFixed(0)}%
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-[#0a1420] h-2 rounded-full overflow-hidden border border-[#1e3852]">
                          <div 
                            className={`h-full rounded-full ${
                              factor.score >= 90 ? 'bg-[#5eead4]' : factor.score >= 75 ? 'bg-[#ffb020]' : 'bg-[#ff6b5c]'
                            }`}
                            style={{ width: `${factor.score}%` }}
                          ></div>
                        </div>
                        <span className={`font-mono text-xs font-bold ${
                          factor.score >= 90 ? 'text-[#5eead4]' : factor.score >= 75 ? 'text-[#ffb020]' : 'text-[#ff6b5c]'
                        }`}>
                          {factor.score}/100
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#8ca0b3] leading-relaxed pl-5 border-l border-[#1e3852]">
                      {factor.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: DOCUMENT BLOCKERS (Core feature from Pitch Deck) */}
          <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#ff6b5c]/40 bg-gradient-to-br from-[#1a1c29] to-[#0f1e2e] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#ff6b5c]">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
                <h2 className="font-heading text-base font-bold text-[#e8edf2]">
                  Hujjat Blokerlari (Document Blockers)
                </h2>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#ff6b5c]/15 text-[#ff6b5c] border border-[#ff6b5c]/30 font-bold">
                {blockers.length} ta ochiq to‘siq
              </span>
            </div>

            <p className="text-xs text-[#8ca0b3]">
              Quyidagi hujjatlar mazkur tender talabnomasi uchun to‘g‘ridan-to‘g‘ri to‘siq hisoblanadi. Har birini yangilash darhol Readiness ko‘rsatkichini oshiradi:
            </p>

            {blockers.length === 0 ? (
              <div className="p-4 rounded bg-[#13253a] border border-[#5eead4]/40 text-xs text-[#5eead4] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Barcha majburiy hujjatlar joyida va tasdiqlangan! Blokerlar mavjud emas.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {blockers.map((b, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded bg-[#131f2d] border border-[#243347] space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#ff6b5c] shrink-0" />
                        <span className="font-medium text-xs text-[#e8edf2]">
                          {b.docName}
                        </span>
                      </div>
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded border font-bold uppercase self-start sm:self-auto ${
                        b.status === 'MISSING'
                          ? 'bg-[#ff6b5c]/20 text-[#ff6b5c] border-[#ff6b5c]/40'
                          : 'bg-[#ffb020]/20 text-[#ffb020] border-[#ffb020]/40'
                      }`}>
                        {b.status === 'MISSING' ? 'Mavjud emas (Missing)' : `Muddati tugamoqda (${b.expiryDaysRemaining || 14} kun)`}
                      </span>
                    </div>

                    <p className="text-xs text-[#8ca0b3]">
                      {b.reason}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1e3044]">
                      <span className="text-[11px] font-mono text-[#8ca0b3]">
                        Ta&apos;sir: <strong className="text-[#5eead4]">+12..14 ball Readiness</strong>
                      </span>
                      <button
                        onClick={() => handleResolveBlocker(b.documentId)}
                        disabled={updatingDocId === b.documentId}
                        className="px-3 py-1.5 bg-[#5eead4] hover:bg-[#48d5bf] text-[#0a1420] font-bold text-xs rounded font-mono flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(94,234,212,0.3)]"
                      >
                        {updatingDocId === b.documentId ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>{b.actionLabel} (Mark Ready)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 3: TENDER PREPARATION TASK LIST */}
          <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#1a334d] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#5eead4]" />
                <h2 className="font-heading text-base font-bold text-[#e8edf2]">
                  Tender Vazifalari ({completedTasksCount}/{tasks.length})
                </h2>
              </div>
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="text-xs font-mono text-[#ffb020] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Vazifa qo‘shish</span>
              </button>
            </div>

            {/* Add task inline form */}
            {showAddTask && (
              <form onSubmit={handleAddTask} className="p-3.5 rounded bg-[#13253a] border border-[#1e3852] space-y-3">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Vazifa nomi (masalan: Garov pulini to‘lash, Smetani tasdiqlash)..."
                  className="w-full px-3 py-2 bg-[#0a1420] border border-[#1e3852] rounded text-xs text-[#e8edf2] placeholder-[#5b738c] focus:outline-none focus:border-[#ffb020]"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-[#8ca0b3]">Mas’ul:</label>
                    <input
                      type="text"
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#0a1420] border border-[#1e3852] rounded text-xs text-[#e8edf2]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[#8ca0b3]">Muhimlik:</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-[#0a1420] border border-[#1e3852] rounded text-xs text-[#e8edf2]"
                    >
                      <option value="HIGH">Yuqori (HIGH)</option>
                      <option value="MEDIUM">O‘rta (MEDIUM)</option>
                      <option value="LOW">Oddiy (LOW)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[#8ca0b3]">Muddat:</label>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#0a1420] border border-[#1e3852] rounded text-xs text-[#e8edf2]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTask(false)}
                    className="px-3 py-1 bg-[#1a2d42] text-xs font-mono text-[#8ca0b3] rounded"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#ffb020] text-[#0a1420] font-bold text-xs rounded"
                  >
                    Saqlash
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`p-3 rounded border flex items-center justify-between gap-3 transition-colors ${
                    task.completed 
                      ? 'bg-[#10202e]/60 border-[#182e42] opacity-75' 
                      : 'bg-[#13253a] border-[#1e3852] hover:border-[#27486b]'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="text-[#ffb020] hover:text-[#5eead4] transition-colors"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-5 h-5 text-[#5eead4]" />
                      ) : (
                        <Square className="w-5 h-5 text-[#8ca0b3]" />
                      )}
                    </button>
                    <div>
                      <p className={`text-xs font-medium ${task.completed ? 'line-through text-[#8ca0b3]' : 'text-[#e8edf2]'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-[#8ca0b3] mt-0.5">
                        <span>Mas’ul: {task.assignee}</span>
                        <span>•</span>
                        <span>Muddat: {task.dueDate}</span>
                        <span>•</span>
                        <span className={`px-1 rounded ${
                          task.priority === 'HIGH' ? 'text-[#ff6b5c] bg-[#ff6b5c]/10' : 'text-[#ffb020] bg-[#ffb020]/10'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-[#8ca0b3] hover:text-[#ff6b5c] p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Embedded Grounded Copilot Panel (Screen 4) */}
        <div className="space-y-4">
          <div className="p-4 rounded-md bg-[#0f1e2e] border border-[#1e3852] flex flex-col h-[750px] shadow-[0_0_25px_rgba(0,0,0,0.3)]">
            {/* Copilot Header */}
            <div className="pb-3 border-b border-[#1a334d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#ffb020]/15 border border-[#ffb020]/40 flex items-center justify-center text-[#ffb020]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-[#e8edf2] flex items-center gap-1.5">
                    VITEZ Copilot
                    <span className="font-mono text-[9px] bg-[#5eead4]/15 text-[#5eead4] px-1 py-0.2 rounded border border-[#5eead4]/30">
                      Grounded AI
                    </span>
                  </h3>
                  <p className="text-[10px] font-mono text-[#8ca0b3]">
                    Deal Room ma’lumotlariga to‘liq bog‘langan
                  </p>
                </div>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5eead4] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5eead4]"></span>
              </span>
            </div>

            {/* Quick Grounded Question Prompts */}
            <div className="py-2.5 border-b border-[#16293d] space-y-1.5">
              <div className="text-[10px] font-mono text-[#8ca0b3] uppercase">Tezkor Tahlil Savollari:</div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleSendCopilot('Qaysi blokerlarni birinchi hal qilish kerak?')}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-[#13253a] hover:bg-[#1a3452] text-[#ffb020] border border-[#ffb020]/30 transition-colors"
                >
                  ⚡ Qaysi blokerlarni birinchi hal qilay?
                </button>
                <button
                  onClick={() => handleSendCopilot('Fit Score qanday hisoblandi?')}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-[#13253a] hover:bg-[#1a3452] text-[#5eead4] border border-[#5eead4]/30 transition-colors"
                >
                  📊 Fit Score qanday hisoblandi?
                </button>
                <button
                  onClick={() => handleSendCopilot('G‘alaba qozonish strategiyasi qanday?')}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-[#13253a] hover:bg-[#1a3452] text-[#e8edf2] border border-[#1e3852] transition-colors"
                >
                  🎯 G‘alaba strategiyasi
                </button>
                <button
                  onClick={() => handleSendCopilot('Byudjet va garov talablari qanday?')}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-[#13253a] hover:bg-[#1a3452] text-[#8ca0b3] border border-[#1e3852] transition-colors"
                >
                  💰 Byudjet va garov
                </button>
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
              {copilotMessages.map((msg, i) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id || i}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[92%] p-3 rounded-md leading-relaxed whitespace-pre-wrap ${
                        isAssistant
                          ? 'bg-[#13253a] text-[#e8edf2] border border-[#1e3852]'
                          : 'bg-[#ffb020] text-[#0a1420] font-medium'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Action suggestions chips if returned */}
                    {isAssistant && msg.actionSuggestions && msg.actionSuggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {msg.actionSuggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendCopilot(sug.prompt)}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#091422] text-[#5eead4] hover:bg-[#13253a] border border-[#5eead4]/30 transition-colors"
                          >
                            ↳ {sug.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[9px] font-mono text-[#5b738c] mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}

              {copilotLoading && (
                <div className="flex items-center gap-2 p-3 bg-[#13253a] rounded border border-[#1e3852] text-xs text-[#ffb020] font-mono">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Ma’lumotlar bazasi va faktorlar tahlil qilinmoqda...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendCopilot(chatInput);
              }}
              className="pt-2 border-t border-[#1a334d] flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Copilot dan so‘rang (masalan: Nimadan boshlash kerak?)..."
                className="flex-1 px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2] placeholder-[#5b738c] focus:outline-none focus:border-[#ffb020]"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || copilotLoading}
                className="p-2 bg-[#ffb020] hover:bg-[#e69d19] disabled:opacity-50 text-[#0a1420] rounded font-bold transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
