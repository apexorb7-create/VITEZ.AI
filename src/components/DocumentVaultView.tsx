import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Trash2, 
  Plus, 
  ExternalLink,
  Filter,
  Search,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Document, DocStatus } from '../types';
import { api } from '../api';

interface DocumentVaultViewProps {
  documents: Document[];
  blockers: any[];
  onRefresh: () => void;
  onOpenDeal?: (dealId: string) => void;
}

export const DocumentVaultView: React.FC<DocumentVaultViewProps> = ({
  documents,
  blockers,
  onRefresh,
  onOpenDeal,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new doc
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('Litsenziya');
  const [docStatus, setDocStatus] = useState<DocStatus>('READY');
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const [docNotes, setDocNotes] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;
    try {
      setLoadingAction('create');
      await api.addDocument({
        name: docName,
        type: docType,
        status: docStatus,
        expiryDate: expiryDate || null,
        notes: docNotes,
        fileSizeBytes: 3500000,
      });
      setShowAddModal(false);
      setDocName('');
      setDocNotes('');
      onRefresh();
    } catch (err: any) {
      alert('Hujjat qo‘shishda xatolik: ' + err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: DocStatus) => {
    try {
      setLoadingAction(id);
      await api.updateDocumentStatus(id, newStatus, newStatus === 'READY' ? '2028-12-31T00:00:00Z' : undefined);
      onRefresh();
    } catch (err: any) {
      alert('Statusni yangilashda xatolik: ' + err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ushbu hujjatni o‘chirmoqchimisiz?')) return;
    try {
      await api.deleteDocument(id);
      onRefresh();
    } catch (err: any) {
      alert('O‘chirishda xatolik: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#1e3852] bg-grid-pattern">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold text-[#5eead4] bg-[#5eead4]/15 px-2 py-0.5 rounded border border-[#5eead4]/30 uppercase">
                DOCUMENT VAULT // RAQAMLI OMBOR
              </span>
              <span className="text-[#8ca0b3] font-mono text-xs">
                Jami {documents.length} ta hujjat
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#e8edf2]">
              Kompaniya Hujjatlar Ombori va Sertifikatlar Bazasi
            </h1>
            <p className="text-xs text-[#8ca0b3] mt-1">
              Barcha davlat xaridlari uchun litsenziyalar, sertifikatlar, moliyaviy audit va kafolat xatlarining yagona raqamli pasporti.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#ffb020] hover:bg-[#e69d19] text-[#0a1420] font-bold text-xs rounded transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Hujjat Yuklash (Upload)</span>
          </button>
        </div>
      </div>

      {/* Blocker Summary Alert */}
      {blockers.length > 0 && (
        <div className="p-4 rounded-md bg-[#181824] border border-[#ff6b5c]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#ff6b5c] shrink-0" />
            <div>
              <h3 className="font-sans text-xs font-bold text-[#ff6b5c]">
                Diqqat: {blockers.length} ta hujjat yangilanishi talab etiladi
              </h3>
              <p className="text-[11px] text-[#8ca0b3]">
                {blockers.map((b: any) => b.docName).join(', ')} bo‘yicha amal qilish muddati yoki yetishmovchilik aniqlangan.
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-[#ffb020] bg-[#ffb020]/10 px-2 py-1 rounded border border-[#ffb020]/20 whitespace-nowrap">
            Readiness ga ta’siri: -22%
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-md bg-[#0f1e2e] border border-[#1a334d] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8ca0b3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Hujjat nomi yoki turi bo‘yicha qidiruv..."
            className="w-full pl-9 pr-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2] placeholder-[#5b738c] focus:outline-none focus:border-[#ffb020]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#8ca0b3]">Status:</span>
          {['ALL', 'READY', 'EXPIRING', 'MISSING', 'REVIEW'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                filterStatus === st
                  ? 'bg-[#ffb020] text-[#0a1420] font-bold'
                  : 'bg-[#13253a] text-[#8ca0b3] hover:text-[#e8edf2] border border-[#1e3852]'
              }`}
            >
              {st === 'ALL' ? 'Barchasi' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded-md bg-[#0f1e2e] border border-[#1a334d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0c1826] border-b border-[#1a334d] font-mono text-[#8ca0b3] uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Hujjat Nomi & Turi</th>
                <th className="py-3 px-4">Holati (Status)</th>
                <th className="py-3 px-4">Amal Qilish Muddati</th>
                <th className="py-3 px-4">Bog‘langan Tender</th>
                <th className="py-3 px-4">Oxirgi Tekshiruv</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162a3f]">
              {filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-[#122438] transition-colors">
                  {/* Name & Type */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-[#13253a] text-[#5eead4] border border-[#1e3852]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-[#e8edf2]">{doc.name}</div>
                        <div className="font-mono text-[10px] text-[#8ca0b3]">{doc.type}</div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border inline-flex items-center gap-1 ${
                      doc.status === 'READY'
                        ? 'bg-[#5eead4]/15 text-[#5eead4] border-[#5eead4]/30'
                        : doc.status === 'EXPIRING'
                        ? 'bg-[#ffb020]/15 text-[#ffb020] border-[#ffb020]/30'
                        : 'bg-[#ff6b5c]/15 text-[#ff6b5c] border-[#ff6b5c]/30'
                    }`}>
                      {doc.status === 'READY' && <CheckCircle2 className="w-3 h-3" />}
                      {doc.status === 'EXPIRING' && <Clock className="w-3 h-3" />}
                      {doc.status === 'MISSING' && <AlertTriangle className="w-3 h-3" />}
                      {doc.status === 'REVIEW' && <RefreshCw className="w-3 h-3" />}
                      <span>{doc.status}</span>
                    </span>
                  </td>

                  {/* Expiry Date */}
                  <td className="py-3.5 px-4 font-mono text-[#e8edf2]">
                    {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString('uz-UZ') : 'Muddatsiz'}
                  </td>

                  {/* Linked Tender */}
                  <td className="py-3.5 px-4 text-[#8ca0b3]">
                    {doc.linkedTenderTitle ? (
                      <span className="text-[#5eead4] font-medium truncate block max-w-[200px]">
                        {doc.linkedTenderTitle}
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] text-[#5b738c]">Umumiy portfel</span>
                    )}
                  </td>

                  {/* Last Verified */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#8ca0b3]">
                    {doc.lastVerifiedDate || '2026-08-26'}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {doc.status !== 'READY' && (
                        <button
                          onClick={() => handleUpdateStatus(doc.id, 'READY')}
                          className="px-2 py-1 bg-[#5eead4] hover:bg-[#4dd2bd] text-[#0a1420] font-bold font-mono text-[10px] rounded transition-colors"
                        >
                          Mark Ready
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1 text-[#8ca0b3] hover:text-[#ff6b5c] rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0f1e2e] border border-[#1e3852] rounded-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-[#e8edf2]">
                Yangi Hujjat Qo‘shish (Document Vault)
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8ca0b3] hover:text-white font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono text-[#8ca0b3] mb-1">Hujjat Nomi:</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="masalan: ISO 9001:2015 Sifat Menejmenti Sertifikati"
                  className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2] focus:outline-none focus:border-[#ffb020]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[#8ca0b3] mb-1">Hujjat Turi:</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2]"
                  >
                    <option value="Litsenziya">Litsenziya</option>
                    <option value="Sertifikat">Sertifikat</option>
                    <option value="Moliyaviy hisobot">Moliyaviy hisobot</option>
                    <option value="Bank kafolati">Bank kafolati</option>
                    <option value="Davlat soliq ma’lumotnomasi">Davlat soliq ma’lumotnomasi</option>
                    <option value="Tavsiyanomalar">Tavsiyanomalar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[#8ca0b3] mb-1">Holat (Status):</label>
                  <select
                    value={docStatus}
                    onChange={(e) => setDocStatus(e.target.value as DocStatus)}
                    className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2]"
                  >
                    <option value="READY">READY (Tasdiqlangan)</option>
                    <option value="EXPIRING">EXPIRING (Muddati tugamoqda)</option>
                    <option value="MISSING">MISSING (Mavjud emas)</option>
                    <option value="REVIEW">REVIEW (Tekshiruvda)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[#8ca0b3] mb-1">Amal Qilish Muddati:</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2]"
                />
              </div>

              <div>
                <label className="block font-mono text-[#8ca0b3] mb-1">Qo‘shimcha Izoh / Tasdiq raqami:</label>
                <textarea
                  value={docNotes}
                  onChange={(e) => setDocNotes(e.target.value)}
                  rows={2}
                  placeholder="Elektron raqamli imzo yoki reyestr raqami..."
                  className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#1e3852]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#13253a] text-[#8ca0b3] rounded font-mono"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={loadingAction === 'create'}
                  className="px-4 py-2 bg-[#ffb020] hover:bg-[#e69d19] text-[#0a1420] font-bold rounded font-mono"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
