import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Building, 
  DollarSign, 
  Calendar, 
  Layers, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { TenderSource, TenderCategory } from '../types';
import { api } from '../api';

interface CreateBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newDealRoomId: string) => void;
}

export const CreateBidModal: React.FC<CreateBidModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [agency, setAgency] = useState('');
  const [tenderNumber, setTenderNumber] = useState(`UZ-XARID-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [sourcePortal, setSourcePortal] = useState<TenderSource>('xarid.uz');
  const [category, setCategory] = useState<TenderCategory>('Qurilish va Muhandislik');
  const [budgetUzs, setBudgetUzs] = useState('14500000000');
  const [deadline, setDeadline] = useState('2026-09-30T18:00:00Z');
  const [region, setRegion] = useState('Toshkent sh.');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('Kamida 5 yillik tajriba, ISO 9001, 2-toifali litsenziya');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !agency.trim()) return;

    setLoading(true);
    try {
      // 1. Create tender in DB
      const newTender = await api.createTender({
        title,
        agency,
        tenderNumber,
        sourcePortal,
        category,
        budgetUzs: parseFloat(budgetUzs) || 10000000000,
        deadline,
        region,
        description: description || 'Davlat xaridlari talabnomasi doirasida obyektlar qurilishi va montaj ishlari.',
        requirements: requirements.split(',').map(s => s.trim()).filter(Boolean),
      });

      // 2. Create Deal Room for this tender
      const newDealRoom = await api.createDealRoom(newTender.id);

      onSuccess(newDealRoom.id);
    } catch (err: any) {
      alert('Tender/Taklif yaratishda xatolik: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#0f1e2e] border border-[#1e3852] rounded-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#182e44]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[#ffb020]/20 text-[#ffb020] border border-[#ffb020]/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-[#e8edf2]">
                Yangi Tender Kiritish & Taklif Yaratish
              </h2>
              <p className="text-[11px] font-mono text-[#8ca0b3]">
                Avtomatik Fit Score va hujjat blokerlari bilan Deal Room ochiladi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8ca0b3] hover:text-white font-mono text-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-mono text-[#8ca0b3] mb-1">Tender / Loyiha Nomi:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="masalan: Samarqand shahrida yangi tibbiyot markazi qurilishi"
              className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2] focus:outline-none focus:border-[#ffb020]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[#8ca0b3] mb-1">Buyurtmachi Tashkilot:</label>
              <input
                type="text"
                required
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                placeholder="masalan: Sog‘liqni Saqlash Vazirligi"
                className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2] focus:outline-none focus:border-[#ffb020]"
              />
            </div>

            <div>
              <label className="block font-mono text-[#8ca0b3] mb-1">Tender Raqami:</label>
              <input
                type="text"
                required
                value={tenderNumber}
                onChange={(e) => setTenderNumber(e.target.value)}
                className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs font-mono text-[#ffb020]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-mono text-[#8ca0b3] mb-1">Manba Portali:</label>
              <select
                value={sourcePortal}
                onChange={(e) => setSourcePortal(e.target.value as TenderSource)}
                className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs font-mono text-[#5eead4]"
              >
                <option value="xarid.uz">xarid.uz</option>
                <option value="uzex.uz">uzex.uz</option>
                <option value="dxarid.uz">dxarid.uz</option>
                <option value="e-ID.uz">e-ID.uz</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[#8ca0b3] mb-1">Soha / Kategoriya:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TenderCategory)}
                className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2]"
              >
                <option value="Qurilish va Muhandislik">Qurilish va Muhandislik</option>
                <option value="IT va Dasturiy Ta’minot">IT va Dasturiy Ta’minot</option>
                <option value="Tibbiyot va Farmatsevtika">Tibbiyot va Farmatsevtika</option>
                <option value="Energetika va Kommunal">Energetika va Kommunal</option>
                <option value="Konsalting va Ta’lim">Konsalting va Ta’lim</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[#8ca0b3] mb-1">Hudud:</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[#8ca0b3] mb-1">Boshlang‘ich Byudjet (UZS):</label>
              <input
                type="number"
                required
                value={budgetUzs}
                onChange={(e) => setBudgetUzs(e.target.value)}
                className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs font-mono text-[#ffb020] font-bold"
              />
            </div>

            <div>
              <label className="block font-mono text-[#8ca0b3] mb-1">Tugash Muddati:</label>
              <input
                type="date"
                value={deadline.split('T')[0]}
                onChange={(e) => setDeadline(e.target.value ? `${e.target.value}T18:00:00Z` : '2026-09-30T18:00:00Z')}
                className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2]"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[#8ca0b3] mb-1">Talablar (vergul bilan ajrating):</label>
            <input
              type="text"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="ISO 9001, 5 yil tajriba, 2-toifali litsenziya"
              className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2]"
            />
          </div>

          <div>
            <label className="block font-mono text-[#8ca0b3] mb-1">Qisqacha Tavsif:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ishlar hajmi va texnik shartlar..."
              className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#182e44]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#13253a] hover:bg-[#1a334d] text-xs font-mono text-[#8ca0b3] rounded"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#ffb020] hover:bg-[#e69d19] text-[#0a1420] font-bold text-xs font-mono rounded flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,176,32,0.3)]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Fit Score hisoblanmoqda...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Saqlash & Deal Room Ochish</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
