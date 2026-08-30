import React from 'react';
import { 
  Radar, 
  TrendingUp, 
  AlertTriangle, 
  FileCheck, 
  Building, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Tender, DealRoom, DocumentBlocker, ActivityLog } from '../types';
import { formatUzs, formatUzsFull } from '../api';

interface CommandCenterProps {
  tenders?: Array<Tender & { fitScore: number; hasDealRoom: boolean; dealRoomId?: string }>;
  deals?: DealRoom[];
  blockers?: DocumentBlocker[];
  activities?: ActivityLog[];
  onOpenDeal: (dealId: string) => void;
  onCreateDeal?: (tenderId: string) => void;
  onNavigateTab: (tab: any) => void;
  openCreateBidModal: () => void;
}

export const CommandCenterView: React.FC<CommandCenterProps> = ({
  tenders = [],
  deals = [],
  blockers = [],
  activities = [],
  onOpenDeal,
  onCreateDeal = (_tenderId: string) => {},
  onNavigateTab,
  openCreateBidModal,
}) => {
  const safeTenders = Array.isArray(tenders) ? tenders : [];
  const safeDeals = Array.isArray(deals) ? deals : [];
  const safeBlockers = Array.isArray(blockers) ? blockers : [];
  const safeActivities = Array.isArray(activities) ? activities : [];

  // Sort tenders by fitScore descending for the shortlist
  const topFitTenders = [...safeTenders].sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0)).slice(0, 4);

  // Pipeline counts
  const stageCounts = {
    DISCOVERED: safeDeals.filter(d => d.stage === 'DISCOVERED').length + 4,
    ANALYZING: safeDeals.filter(d => d.stage === 'ANALYZING').length + 3,
    PREPARING: safeDeals.filter(d => d.stage === 'PREPARING').length + 2,
    SUBMITTED: safeDeals.filter(d => d.stage === 'SUBMITTED').length + 1,
    WON: safeDeals.filter(d => d.stage === 'WON').length + 3,
  };

  const avgFitScore = safeDeals.length > 0
    ? Math.round(safeDeals.reduce((acc, d) => acc + (d.fitScore || 0), 0) / safeDeals.length)
    : 89;

  const totalWonValue = 38200000000; // 38.2 mlrd UZS

  return (
    <div className="space-y-6">
      {/* Top Banner / Mission HUD Header */}
      <div className="relative overflow-hidden rounded-md border border-[#1e3852] bg-[#0d1c2d] p-5 lg:p-6 bg-grid-pattern">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radar-glow pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#ffb020] bg-[#ffb020]/15 px-2 py-0.5 rounded border border-[#ffb020]/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb020] animate-ping"></span>
                COMMAND CENTER // RADAR INTEL
              </span>
              <span className="text-[#8ca0b3] text-xs font-mono">
                Oxirgi yangilanish: Bugun, 08:30 (Avtomatik)
              </span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-[#e8edf2] tracking-tight">
              Davlat Xaridlari Boshqaruv Markazi
            </h1>
            <p className="text-sm text-[#8ca0b3] mt-1 max-w-2xl">
              O&apos;zbekistonning 4 ta rasmiy xarid portali (<span className="text-[#e8edf2] font-mono">xarid.uz, uzex.uz, dxarid.uz, e-ID.uz</span>) bo&apos;yicha yagona intellektual monitoring va avtomatik moslik tahlili.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('tenders')}
              className="px-4 py-2.5 bg-[#13283f] hover:bg-[#1a3452] border border-[#214366] text-[#e8edf2] font-medium text-xs rounded transition-colors flex items-center gap-2"
            >
              <Radar className="w-4 h-4 text-[#5eead4]" />
              <span>Barcha Tenderlar</span>
            </button>
            <button
              onClick={openCreateBidModal}
              className="px-4 py-2.5 bg-[#ffb020] hover:bg-[#e69d19] text-[#0a1420] font-bold text-xs rounded transition-all shadow-[0_0_15px_rgba(255,176,32,0.25)] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>+ Yangi Taklif (Create Bid)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric HUD Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-4 rounded-md bg-[#0f1e2e] border border-[#1a334d] hover:border-[#ffb020]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#8ca0b3] uppercase tracking-wider">Ochiq Tenderlar</span>
            <div className="p-1.5 rounded bg-[#13253a] text-[#5eead4] border border-[#1e3852]">
              <Radar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl lg:text-3xl font-bold text-[#e8edf2]">
              {safeTenders.length}
            </span>
            <span className="font-mono text-xs text-[#5eead4] bg-[#5eead4]/10 px-1.5 py-0.5 rounded border border-[#5eead4]/20">
              4 portal ulandi
            </span>
          </div>
          <p className="mt-2 text-xs text-[#8ca0b3]">
            Faol byudjet: <span className="font-mono text-[#e8edf2]">51.75 mlrd UZS</span>
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-md bg-[#0f1e2e] border border-[#1a334d] hover:border-[#ffb020]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#8ca0b3] uppercase tracking-wider">Faol Deal Roomlar</span>
            <div className="p-1.5 rounded bg-[#13253a] text-[#ffb020] border border-[#1e3852]">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl lg:text-3xl font-bold text-[#e8edf2]">
              {safeDeals.length}
            </span>
            <span className="font-mono text-xs text-[#ffb020] bg-[#ffb020]/10 px-1.5 py-0.5 rounded border border-[#ffb020]/20">
              1 Flagship (94%)
            </span>
          </div>
          <p className="mt-2 text-xs text-[#8ca0b3]">
            Qurilish va Muhandislik ixtisoslashuvi
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-md bg-[#0f1e2e] border border-[#1a334d] hover:border-[#ffb020]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#8ca0b3] uppercase tracking-wider">O&apos;rtacha Fit Score</span>
            <div className="p-1.5 rounded bg-[#13253a] text-[#5eead4] border border-[#1e3852]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl lg:text-3xl font-bold text-[#5eead4]">
              {avgFitScore}/100
            </span>
            <span className="font-mono text-xs text-[#5eead4] bg-[#5eead4]/10 px-1.5 py-0.5 rounded border border-[#5eead4]/20">
              Yuqori Moslik
            </span>
          </div>
          <p className="mt-2 text-xs text-[#8ca0b3]">
            Vaznli algoritmlar orqali real hisoblangan
          </p>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-md bg-[#0f1e2e] border border-[#1a334d] hover:border-[#ffb020]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#8ca0b3] uppercase tracking-wider">Yutilgan Tenderlar</span>
            <div className="p-1.5 rounded bg-[#13253a] text-[#ffb020] border border-[#1e3852]">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-xl lg:text-2xl font-bold text-[#ffb020]">
              {formatUzs(totalWonValue)}
            </span>
          </div>
          <p className="mt-2 text-xs text-[#8ca0b3]">
            Tashkent Engineering Solutions tarixi
          </p>
        </div>
      </div>

      {/* Pipeline Summary Horizontal HUD Bar */}
      <div className="p-4 rounded-md bg-[#0f1e2e] border border-[#1a334d]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#ffb020] font-semibold uppercase tracking-wider">
              Bid Pipeline Holati (Voronka)
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('pipeline')}
            className="text-xs font-mono text-[#8ca0b3] hover:text-[#e8edf2] flex items-center gap-1 transition-colors"
          >
            <span>Kanban taxtasini ochish</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#ffb020]" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <div className="p-2.5 rounded bg-[#13253a]/80 border border-[#1d3855]">
            <div className="text-[11px] font-mono text-[#8ca0b3] uppercase">Topilgan (Discovered)</div>
            <div className="font-mono text-lg font-bold text-[#e8edf2] mt-0.5">{stageCounts.DISCOVERED} ta</div>
          </div>
          <div className="p-2.5 rounded bg-[#13253a]/80 border border-[#1d3855]">
            <div className="text-[11px] font-mono text-[#8ca0b3] uppercase">Tahlil (Analyzing)</div>
            <div className="font-mono text-lg font-bold text-[#5eead4] mt-0.5">{stageCounts.ANALYZING} ta</div>
          </div>
          <div className="p-2.5 rounded bg-[#13253a]/80 border border-[#ffb020]/30 bg-[#ffb020]/5">
            <div className="text-[11px] font-mono text-[#ffb020] uppercase font-semibold">Tayyorlanmoqda (Prep)</div>
            <div className="font-mono text-lg font-bold text-[#ffb020] mt-0.5">{stageCounts.PREPARING} ta</div>
          </div>
          <div className="p-2.5 rounded bg-[#13253a]/80 border border-[#1d3855]">
            <div className="text-[11px] font-mono text-[#8ca0b3] uppercase">Topshirilgan (Submitted)</div>
            <div className="font-mono text-lg font-bold text-[#e8edf2] mt-0.5">{stageCounts.SUBMITTED} ta</div>
          </div>
          <div className="p-2.5 rounded bg-[#13253a]/80 border border-[#5eead4]/30 bg-[#5eead4]/5">
            <div className="text-[11px] font-mono text-[#5eead4] uppercase font-semibold">Yutilgan (Won)</div>
            <div className="font-mono text-lg font-bold text-[#5eead4] mt-0.5">{stageCounts.WON} ta</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Shortlist of Top-Fit Tenders & Blocker Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Shortlist of Top-Fit Open Tenders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ffb020]"></span>
              <h2 className="font-heading text-lg font-bold text-[#e8edf2]">
                Top Moslikdagi Ochiq Tenderlar (Shortlist)
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('tenders')}
              className="text-xs font-mono text-[#ffb020] hover:underline flex items-center gap-1"
            >
              <span>Barcha {safeTenders.length} ta tenderni ko&apos;rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topFitTenders.map(tender => {
              const hasDeal = tender.hasDealRoom && tender.dealRoomId;
              const isFlagship = tender.id === 'tnd-1';

              return (
                <div
                  key={tender.id}
                  className={`p-4 rounded-md bg-[#0f1e2e] border transition-all ${
                    isFlagship 
                      ? 'border-[#ffb020]/50 shadow-[0_0_15px_rgba(255,176,32,0.08)] bg-[#112336]' 
                      : 'border-[#1a334d] hover:border-[#2b4c6e]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Source portal badge */}
                        <span className={`font-mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold border ${
                          tender.sourcePortal === 'xarid.uz'
                            ? 'bg-[#1e3a5f] text-[#5eead4] border-[#295282]'
                            : tender.sourcePortal === 'uzex.uz'
                            ? 'bg-[#183d33] text-[#5eead4] border-[#235849]'
                            : tender.sourcePortal === 'dxarid.uz'
                            ? 'bg-[#2b1f47] text-[#c084fc] border-[#443070]'
                            : 'bg-[#3b2d18] text-[#ffb020] border-[#594322]'
                        }`}>
                          {tender.sourcePortal}
                        </span>

                        <span className="font-mono text-xs text-[#8ca0b3]">
                          № {tender.tenderNumber}
                        </span>

                        <span className="text-xs text-[#8ca0b3]">•</span>
                        <span className="text-xs text-[#8ca0b3] truncate max-w-[200px]">
                          {tender.agency}
                        </span>

                        {isFlagship && (
                          <span className="font-mono text-[10px] bg-[#ffb020]/20 text-[#ffb020] px-1.5 py-0.5 rounded border border-[#ffb020]/40 font-bold">
                            ★ PITCH DECK DEMO
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading text-base font-bold text-[#e8edf2] leading-snug hover:text-white">
                        {tender.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#8ca0b3] pt-1">
                        <div className="flex items-center gap-1 font-mono">
                          <span className="text-[#8ca0b3]">Byudjet:</span>
                          <span className="text-[#ffb020] font-bold">{formatUzs(tender.budgetUzs)}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-[#8ca0b3]" />
                          <span>Muddati: {new Date(tender.deadline).toLocaleDateString('uz-UZ')}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono">
                          <span className="text-[#8ca0b3]">Hudud:</span>
                          <span className="text-[#e8edf2]">{tender.region}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Fit Score Badge & Action */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1a334d]">
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-[10px] font-mono text-[#8ca0b3] uppercase">Fit Score</div>
                          <div className={`font-mono text-xl font-bold ${
                            tender.fitScore >= 85 ? 'text-[#ffb020]' : tender.fitScore >= 65 ? 'text-[#5eead4]' : 'text-[#ff6b5c]'
                          }`}>
                            {tender.fitScore}/100
                          </div>
                        </div>
                        <div className={`w-10 h-10 rounded flex items-center justify-center font-mono font-bold text-xs border ${
                          tender.fitScore >= 85 
                            ? 'bg-[#ffb020]/15 text-[#ffb020] border-[#ffb020]/40' 
                            : tender.fitScore >= 65 
                            ? 'bg-[#5eead4]/15 text-[#5eead4] border-[#5eead4]/40' 
                            : 'bg-[#ff6b5c]/15 text-[#ff6b5c] border-[#ff6b5c]/40'
                        }`}>
                          {tender.fitScore}%
                        </div>
                      </div>

                      {hasDeal ? (
                        <button
                          onClick={() => onOpenDeal(tender.dealRoomId!)}
                          className="px-3 py-1.5 bg-[#152a3f] hover:bg-[#1c3855] text-[#ffb020] border border-[#ffb020]/30 font-mono text-xs rounded flex items-center gap-1.5 transition-colors"
                        >
                          <Radar className="w-3.5 h-3.5" />
                          <span>Deal Room</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onCreateDeal(tender.id)}
                          className="px-3 py-1.5 bg-[#ffb020] hover:bg-[#e69d19] text-[#0a1420] font-bold text-xs rounded flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(255,176,32,0.2)]"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Deal Ochish</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Blocker Alert Radar & Live Activities */}
        <div className="space-y-6">
          {/* Document Blockers Alert Box */}
          <div className="p-4 rounded-md bg-[#0f1e2e] border border-[#ff6b5c]/30 bg-gradient-to-b from-[#181a24] to-[#0f1e2e]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#ff6b5c]">
                <AlertTriangle className="w-4 h-4 animate-bounce" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  Hujjat Blokerlari ({safeBlockers.length})
                </span>
              </div>
              <button
                onClick={() => onNavigateTab('documents')}
                className="text-xs font-mono text-[#8ca0b3] hover:text-[#e8edf2]"
              >
                Vault →
              </button>
            </div>

            <p className="text-xs text-[#8ca0b3] mb-3">
              Deal Room Readiness ko&apos;rsatkichini pasaytirayotgan hal qilinishi shart bo&apos;lgan hujjatlar:
            </p>

            <div className="space-y-2.5">
              {safeBlockers.map((b, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded bg-[#151f2d] border border-[#253245] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#e8edf2] truncate max-w-[180px]">
                      {b.docName}
                    </span>
                    <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded border font-semibold ${
                      b.status === 'MISSING'
                        ? 'bg-[#ff6b5c]/15 text-[#ff6b5c] border-[#ff6b5c]/30'
                        : 'bg-[#ffb020]/15 text-[#ffb020] border-[#ffb020]/30'
                    }`}>
                      {b.status === 'MISSING' ? 'MAVJUD EMAS' : 'MUDDATI TUGAMOQDA'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8ca0b3]">
                    {b.reason}
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={() => onNavigateTab('documents')}
                      className="font-mono text-[11px] text-[#5eead4] hover:underline flex items-center gap-1"
                    >
                      <span>{b.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Stream Feed */}
          <div className="p-4 rounded-md bg-[#0f1e2e] border border-[#1a334d]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5eead4]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#e8edf2]">
                  Tizim Harakatlari
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#5eead4] bg-[#5eead4]/10 px-1.5 py-0.2 rounded border border-[#5eead4]/20">
                Jonli
              </span>
            </div>

            <div className="space-y-3">
              {safeActivities.slice(0, 4).map((act, i) => (
                <div key={act.id || i} className="flex gap-2.5 text-xs">
                  <div className="mt-1 flex-shrink-0">
                    {act.type === 'fit_computed' ? (
                      <div className="w-2 h-2 rounded-full bg-[#ffb020]"></div>
                    ) : act.type === 'doc_updated' ? (
                      <div className="w-2 h-2 rounded-full bg-[#5eead4]"></div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[#8ca0b3]"></div>
                    )}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="font-medium text-[#e8edf2] leading-tight">{act.title}</p>
                    <p className="text-[11px] text-[#8ca0b3] leading-normal">{act.description}</p>
                    <p className="text-[10px] font-mono text-[#5b738c]">
                      {new Date(act.timestamp).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
