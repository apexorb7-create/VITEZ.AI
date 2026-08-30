import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Radar, 
  ExternalLink, 
  Sparkles, 
  Calendar, 
  Building, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Layers,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Tender, TenderSource, TenderCategory } from '../types';
import { formatUzs, formatUzsFull } from '../api';

interface TendersListViewProps {
  tenders: Array<Tender & { fitScore: number; hasDealRoom: boolean; dealRoomId?: string }>;
  onOpenDeal: (dealId: string) => void;
  onCreateDeal: (tenderId: string) => void;
  openCreateBidModal: () => void;
}

export const TendersListView: React.FC<TendersListViewProps> = ({
  tenders,
  onOpenDeal,
  onCreateDeal,
  openCreateBidModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTenderForModal, setSelectedTenderForModal] = useState<Tender | null>(null);

  const sources: Array<{ id: string; label: string; count?: number }> = [
    { id: 'ALL', label: 'Barcha Portallar (4)' },
    { id: 'xarid.uz', label: 'xarid.uz' },
    { id: 'uzex.uz', label: 'uzex.uz' },
    { id: 'dxarid.uz', label: 'dxarid.uz' },
    { id: 'e-ID.uz', label: 'e-ID.uz' },
  ];

  const categories = [
    'ALL',
    'Qurilish va Muhandislik',
    'IT va Dasturiy Ta’minot',
    'Tibbiyot va Farmatsevtika',
    'Energetika va Kommunal',
    'Konsalting va Ta’lim',
  ];

  const filteredTenders = useMemo(() => {
    return tenders.filter(tender => {
      const matchesSearch = 
        tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.tenderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.requirements.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSource = selectedSource === 'ALL' || tender.sourcePortal === selectedSource;
      const matchesCategory = selectedCategory === 'ALL' || tender.category === selectedCategory;

      return matchesSearch && matchesSource && matchesCategory;
    });
  }, [tenders, searchQuery, selectedSource, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header & Source Aggregator Banner */}
      <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#1e3852] bg-grid-pattern">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] font-semibold text-[#5eead4] bg-[#5eead4]/15 px-2 py-0.5 rounded border border-[#5eead4]/30 uppercase">
                YAGONA MILLIY AGREGATOR
              </span>
              <span className="text-[#8ca0b3] font-mono text-xs">
                To&apos;rtta davlat portali bitta ekranda
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#e8edf2]">
              Milliy Ma&apos;lumotlar Markazi & Tenderlar Tarmoqlari
            </h1>
            <p className="text-xs text-[#8ca0b3] mt-1">
              Real vaqt rejimida yangilanuvchi ochiq davlat xaridlari. Har bir tender uchun real ma&apos;lumotlar bazasi asosida hisoblangan avtomatik Fit Score.
            </p>
          </div>

          <button
            onClick={openCreateBidModal}
            className="px-4 py-2 bg-[#ffb020] hover:bg-[#e69d19] text-[#0a1420] font-bold text-xs rounded transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tender Kiritish</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-md bg-[#0f1e2e] border border-[#1a334d] space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8ca0b3] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tender nomi, buyurtmachi tashkilot, talablar yoki tender raqami bo‘yicha qidiruv..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2] placeholder-[#5b738c] focus:outline-none focus:border-[#ffb020]"
          />
        </div>

        {/* Source Portal Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#162a3f]">
          <span className="text-xs font-mono text-[#8ca0b3] mr-2">Manba Portali:</span>
          {sources.map(src => (
            <button
              key={src.id}
              onClick={() => setSelectedSource(src.id)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                selectedSource === src.id
                  ? 'bg-[#ffb020] text-[#0a1420] font-bold shadow-[0_0_10px_rgba(255,176,32,0.25)]'
                  : 'bg-[#13253a] text-[#8ca0b3] hover:text-[#e8edf2] border border-[#1e3852]'
              }`}
            >
              {src.label}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[#8ca0b3] mr-2">Kategoriya:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded text-xs font-sans transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1e3b5c] text-[#5eead4] border border-[#5eead4]/40 font-medium'
                  : 'bg-[#102030] text-[#8ca0b3] hover:text-[#e8edf2] border border-[#182e44]'
              }`}
            >
              {cat === 'ALL' ? 'Barcha Sohalar' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-mono text-[#8ca0b3]">
        <span>Natijalar: <strong className="text-[#e8edf2]">{filteredTenders.length}</strong> ta tender topildi</span>
        <span className="flex items-center gap-1.5 text-[#5eead4]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4] animate-pulse"></span>
          Fit Score algoritmi faol
        </span>
      </div>

      {/* Tenders Grid / Cards */}
      <div className="space-y-3">
        {filteredTenders.map(tender => {
          const hasDeal = tender.hasDealRoom && tender.dealRoomId;
          const isFlagship = tender.id === 'tnd-1';

          return (
            <div
              key={tender.id}
              className={`p-4 lg:p-5 rounded-md bg-[#0f1e2e] border transition-all ${
                isFlagship 
                  ? 'border-[#ffb020]/60 bg-[#102234] shadow-[0_0_20px_rgba(255,176,32,0.08)]' 
                  : 'border-[#1a334d] hover:border-[#2b4c6e]'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Left Content */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Source tag */}
                    <span className={`font-mono text-[11px] px-2.5 py-0.5 rounded uppercase font-bold border ${
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

                    <span className="font-mono text-xs text-[#ffb020] bg-[#ffb020]/10 px-2 py-0.5 rounded border border-[#ffb020]/20">
                      № {tender.tenderNumber}
                    </span>

                    <span className="text-xs font-mono text-[#8ca0b3] bg-[#13253a] px-2 py-0.5 rounded border border-[#1e3852]">
                      {tender.category}
                    </span>

                    {isFlagship && (
                      <span className="font-mono text-[10px] bg-[#ffb020] text-[#0a1420] px-2 py-0.5 rounded font-bold">
                        ★ PITCH DECK TENDER (94% FIT)
                      </span>
                    )}
                  </div>

                  <h2 className="font-heading text-lg font-bold text-[#e8edf2] leading-snug">
                    {tender.title}
                  </h2>

                  <p className="text-xs text-[#8ca0b3] line-clamp-2">
                    {tender.description}
                  </p>

                  {/* Requirements Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-mono text-[#8ca0b3] mr-1">Talablar:</span>
                    {tender.requirements.slice(0, 3).map((req, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-[#13253a] text-[#8ca0b3] border border-[#1e3852]">
                        {req}
                      </span>
                    ))}
                    {tender.requirements.length > 3 && (
                      <span className="text-[11px] font-mono text-[#ffb020]">
                        +{tender.requirements.length - 3} ta
                      </span>
                    )}
                  </div>

                  {/* Metadata Bar */}
                  <div className="flex flex-wrap items-center gap-5 text-xs text-[#8ca0b3] pt-2 border-t border-[#172d42]">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#5eead4]" />
                      <span className="text-[#e8edf2]">{tender.agency}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8ca0b3]" />
                      <span>{tender.region}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[#ffb020]" />
                      <span>Tugash muddati: <strong className="text-[#e8edf2]">{new Date(tender.deadline).toLocaleDateString('uz-UZ')}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right Action / Fit Score HUD */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#1a334d] lg:min-w-[200px]">
                  {/* Budget box */}
                  <div className="text-left lg:text-right">
                    <div className="text-[10px] font-mono text-[#8ca0b3] uppercase">Boshlang‘ich Byudjet</div>
                    <div className="font-mono text-lg font-bold text-[#ffb020]">
                      {formatUzs(tender.budgetUzs)}
                    </div>
                    <div className="text-[10px] font-mono text-[#8ca0b3]">
                      Garov: {formatUzs(tender.earnestMoneyUzs)} (3%)
                    </div>
                  </div>

                  {/* Fit Score Badge */}
                  <div className="flex items-center gap-2">
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] font-mono text-[#8ca0b3] uppercase">Hisoblangan Fit</div>
                      <div className={`font-mono text-sm font-bold ${
                        tender.fitScore >= 85 ? 'text-[#ffb020]' : tender.fitScore >= 65 ? 'text-[#5eead4]' : 'text-[#ff6b5c]'
                      }`}>
                        {tender.fitScore >= 85 ? 'Yuqori Moslik' : tender.fitScore >= 65 ? 'O‘rtacha Moslik' : 'Past Moslik'}
                      </div>
                    </div>
                    <div className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 font-mono font-bold text-sm border ${
                      tender.fitScore >= 85 
                        ? 'bg-[#ffb020]/20 text-[#ffb020] border-[#ffb020]/50 shadow-[0_0_10px_rgba(255,176,32,0.2)]' 
                        : tender.fitScore >= 65 
                        ? 'bg-[#5eead4]/20 text-[#5eead4] border-[#5eead4]/50' 
                        : 'bg-[#ff6b5c]/20 text-[#ff6b5c] border-[#ff6b5c]/50'
                    }`}>
                      <Radar className="w-3.5 h-3.5" />
                      <span>{tender.fitScore}/100</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 w-full justify-end">
                    <button
                      onClick={() => setSelectedTenderForModal(tender)}
                      className="px-3 py-1.5 rounded bg-[#13253a] hover:bg-[#1a334d] text-xs font-mono text-[#8ca0b3] hover:text-[#e8edf2] border border-[#1e3852] transition-colors"
                    >
                      Batafsil
                    </button>

                    {hasDeal ? (
                      <button
                        onClick={() => onOpenDeal(tender.dealRoomId!)}
                        className="px-3.5 py-1.5 bg-[#152a3f] hover:bg-[#1c3855] text-[#ffb020] border border-[#ffb020]/40 font-mono text-xs rounded font-medium flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(255,176,32,0.15)]"
                      >
                        <Radar className="w-3.5 h-3.5" />
                        <span>Deal Room</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onCreateDeal(tender.id)}
                        className="px-3.5 py-1.5 bg-[#ffb020] hover:bg-[#e69d19] text-[#0a1420] font-bold text-xs rounded flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(255,176,32,0.25)]"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Taklif Yaratish</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal if clicked */}
      {selectedTenderForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0f1e2e] border border-[#1e3852] rounded-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs text-[#ffb020] bg-[#ffb020]/15 px-2 py-0.5 rounded border border-[#ffb020]/30">
                  {selectedTenderForModal.sourcePortal} • № {selectedTenderForModal.tenderNumber}
                </span>
                <h2 className="font-heading text-xl font-bold text-[#e8edf2] mt-2">
                  {selectedTenderForModal.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTenderForModal(null)}
                className="text-[#8ca0b3] hover:text-white font-mono text-lg px-2"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-[#0a1420] rounded border border-[#182e44] text-xs font-mono">
              <div>
                <span className="text-[#8ca0b3]">Buyurtmachi:</span>
                <div className="text-[#e8edf2] font-sans font-medium">{selectedTenderForModal.agency}</div>
              </div>
              <div>
                <span className="text-[#8ca0b3]">Boshlang‘ich Byudjet:</span>
                <div className="text-[#ffb020] font-bold">{formatUzsFull(selectedTenderForModal.budgetUzs)}</div>
              </div>
              <div>
                <span className="text-[#8ca0b3]">Bank Garovi (3%):</span>
                <div className="text-[#5eead4]">{formatUzsFull(selectedTenderForModal.earnestMoneyUzs)}</div>
              </div>
              <div>
                <span className="text-[#8ca0b3]">Topshirish muddati:</span>
                <div className="text-[#e8edf2]">{new Date(selectedTenderForModal.deadline).toLocaleString('uz-UZ')}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-mono text-[#8ca0b3] uppercase">Tavsif va Ishlar hajmi</h3>
              <p className="text-xs text-[#e8edf2] leading-relaxed p-3 rounded bg-[#13253a] border border-[#1e3852]">
                {selectedTenderForModal.description}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-mono text-[#8ca0b3] uppercase">Majburiy Talablar</h3>
              <ul className="space-y-1.5 text-xs text-[#e8edf2]">
                {selectedTenderForModal.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 rounded bg-[#091422] border border-[#162b40]">
                    <CheckCircle2 className="w-4 h-4 text-[#5eead4] shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e3852]">
              <button
                onClick={() => setSelectedTenderForModal(null)}
                className="px-4 py-2 bg-[#13253a] hover:bg-[#1a3452] text-xs font-mono text-[#8ca0b3] rounded"
              >
                Yopish
              </button>
              <button
                onClick={() => {
                  const tId = selectedTenderForModal.id;
                  setSelectedTenderForModal(null);
                  onCreateDeal(tId);
                }}
                className="px-4 py-2 bg-[#ffb020] hover:bg-[#e69d19] text-[#0a1420] font-bold text-xs rounded shadow-[0_0_10px_rgba(255,176,32,0.3)]"
              >
                Deal Room Ochish & Tahlil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
