import React, { useState } from 'react';
import { 
  FolderKanban, 
  Sparkles, 
  Radar, 
  ArrowRight, 
  ArrowLeft, 
  Building, 
  Calendar, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { DealRoom, PipelineStageType, Tender } from '../types';
import { api, formatUzs } from '../api';
import confetti from 'canvas-confetti';

interface PipelineViewProps {
  deals: DealRoom[];
  tenders: Tender[];
  onOpenDeal: (dealId: string) => void;
  onRefresh: () => void;
  openCreateBidModal: () => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  deals,
  tenders,
  onOpenDeal,
  onRefresh,
  openCreateBidModal,
}) => {
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  const columns: Array<{ id: PipelineStageType; title: string; color: string }> = [
    { id: 'DISCOVERED', title: '1. Topilgan (Discovered)', color: '#8ca0b3' },
    { id: 'ANALYZING', title: '2. Tahlil (Analyzing)', color: '#5eead4' },
    { id: 'PREPARING', title: '3. Tayyorlanmoqda (Preparing)', color: '#ffb020' },
    { id: 'SUBMITTED', title: '4. Topshirilgan (Submitted)', color: '#93c5fd' },
    { id: 'WON', title: '5. Yutilgan (Won ✓)', color: '#5eead4' },
    { id: 'LOST', title: '6. Rad etilgan (Lost ✕)', color: '#ff6b5c' },
  ];

  const handleMoveStage = async (dealId: string, newStage: PipelineStageType) => {
    try {
      await api.updateDealStage(dealId, newStage);
      onRefresh();
      if (newStage === 'WON') {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // safe fallback
        }
      }
    } catch (err: any) {
      alert('Bosqichni o‘zgartirishda xatolik: ' + err.message);
    }
  };

  const handleDragStart = (dealId: string) => {
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (stage: PipelineStageType) => {
    if (!draggedDealId) return;
    await handleMoveStage(draggedDealId, stage);
    setDraggedDealId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#1e3852] bg-grid-pattern">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold text-[#ffb020] bg-[#ffb020]/15 px-2 py-0.5 rounded border border-[#ffb020]/30 uppercase">
                BID PIPELINE // KANBAN BOSHQARUV
              </span>
              <span className="text-[#8ca0b3] font-mono text-xs">
                Jami {deals.length} ta faol arizalar
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#e8edf2]">
              Tender Ishtiroki va Takliflar Voronkasi
            </h1>
            <p className="text-xs text-[#8ca0b3] mt-1">
              Kartochkalarni surish orqali bosqichlarni o‘zgartiring yoki to‘liq tahlil uchun Deal Room ga kiring.
            </p>
          </div>

          <button
            onClick={openCreateBidModal}
            className="px-4 py-2 bg-[#ffb020] hover:bg-[#e69d19] text-[#0a1420] font-bold text-xs rounded transition-all flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ Yangi Taklif (Create Bid)</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
        {columns.map(col => {
          const colDeals = deals.filter(d => d.stage === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.id)}
              className="flex flex-col rounded-md bg-[#0f1e2e] border border-[#1a334d] p-3 min-w-[240px] min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#182f45]">
                <span className="font-mono text-[11px] font-bold text-[#e8edf2] truncate">
                  {col.title}
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#13253a] text-[#ffb020] border border-[#1e3852]">
                  {colDeals.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-2.5">
                {colDeals.map(deal => {
                  const tender = deal.tender;
                  const currentStageIdx = columns.findIndex(c => c.id === deal.stage);

                  return (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => handleDragStart(deal.id)}
                      className="p-3 rounded bg-[#13253a] border border-[#1e3852] hover:border-[#ffb020]/50 transition-all cursor-grab active:cursor-grabbing space-y-2 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#0c1826] text-[#5eead4] border border-[#1a334d] uppercase font-bold">
                          {tender?.sourcePortal || 'xarid.uz'}
                        </span>
                        <div className={`font-mono text-xs font-bold ${
                          deal.fitScore >= 85 ? 'text-[#ffb020]' : 'text-[#5eead4]'
                        }`}>
                          {deal.fitScore}% FIT
                        </div>
                      </div>

                      <h4 
                        onClick={() => onOpenDeal(deal.id)}
                        className="font-heading text-xs font-bold text-[#e8edf2] leading-snug hover:text-[#ffb020] cursor-pointer line-clamp-2"
                      >
                        {tender?.title || 'Tender Taklifi'}
                      </h4>

                      <div className="font-mono text-[11px] font-bold text-[#ffb020]">
                        {tender ? formatUzs(tender.budgetUzs) : '18.45 mlrd UZS'}
                      </div>

                      <div className="text-[10px] text-[#8ca0b3] truncate">
                        {tender?.agency}
                      </div>

                      {/* Card Footer with Quick Move Arrows & Open Button */}
                      <div className="pt-2 border-t border-[#182e44] flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {currentStageIdx > 0 && (
                            <button
                              onClick={() => handleMoveStage(deal.id, columns[currentStageIdx - 1].id)}
                              title="Oldingi bosqichga o‘tkazish"
                              className="p-1 rounded bg-[#0a1420] text-[#8ca0b3] hover:text-[#e8edf2] border border-[#1e3852]"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {currentStageIdx < columns.length - 1 && (
                            <button
                              onClick={() => handleMoveStage(deal.id, columns[currentStageIdx + 1].id)}
                              title="Keyingi bosqichga o‘tkazish"
                              className="p-1 rounded bg-[#0a1420] text-[#ffb020] hover:text-white border border-[#ffb020]/30"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => onOpenDeal(deal.id)}
                          className="font-mono text-[10px] text-[#ffb020] hover:underline flex items-center gap-0.5"
                        >
                          <Radar className="w-3 h-3" />
                          <span>Deal Room</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {colDeals.length === 0 && (
                  <div className="h-28 border border-dashed border-[#1a334d] rounded flex items-center justify-center text-[11px] font-mono text-[#5b738c]">
                    Kartochkani bu yerga suring
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
