import React, { useState } from 'react';
import { 
  Building2, 
  Save, 
  Plus, 
  X, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Users, 
  Calendar, 
  CreditCard,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { Company } from '../types';
import { api, formatUzsFull } from '../api';

interface CompanyPassportViewProps {
  company: Company | null;
  onCompanyUpdated: (updated: Company) => void;
}

export const CompanyPassportView: React.FC<CompanyPassportViewProps> = ({
  company,
  onCompanyUpdated,
}) => {
  const [formData, setFormData] = useState<Company>(() => {
    return company || {
      id: 'comp-1',
      name: 'Tashkent Engineering Solutions MChJ',
      industry: 'Qurilish va Muhandislik Tarmoqlari',
      capabilities: [
        'Bino va inshootlar qurilishi hamda rekonstruktsiyasi',
        'Muhandislik kommunikatsiya tarmoqlari (suv, kanalizatsiya, isitish)',
        'Yuqori bosimli quvur tizimlari montaji',
        'Bosh pudrat boshqaruvi va texnik nazorat',
        'BIM loyihalash va 3D modellash'
      ],
      certifications: [
        'ISO 9001:2015 Sifat menejmenti',
        'Davlat Qurilish Qo‘mitasi 2-toifali Litsenziyasi (№QUR-2021-8842)',
        'Mehnat xavfsizligi va muhofazasi sertifikati (OHSAS 18001)'
      ],
      employeeCount: 68,
      foundedYear: 2018,
      experienceYears: 8,
      taxId: '305918274',
      address: 'Toshkent sh., Mirzo Ulug‘bek tumani, Mustaqillik shoh ko‘chasi, 42-uy',
      annualRevenueUzs: 48500000000,
      licenseNumber: 'LIT-UZ-2021-78901'
    };
  });

  const [newCapability, setNewCapability] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddCapability = () => {
    if (!newCapability.trim()) return;
    setFormData(prev => ({
      ...prev,
      capabilities: [...prev.capabilities, newCapability.trim()]
    }));
    setNewCapability('');
  };

  const handleRemoveCapability = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter((_, i) => i !== idx)
    }));
  };

  const handleAddCertification = () => {
    if (!newCertification.trim()) return;
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCertification.trim()]
    }));
    setNewCertification('');
  };

  const handleRemoveCertification = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await api.updateCompany(formData);
      onCompanyUpdated(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert('Kompaniya profilini saqlashda xatolik: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#1e3852] bg-grid-pattern">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold text-[#ffb020] bg-[#ffb020]/15 px-2 py-0.5 rounded border border-[#ffb020]/30 uppercase">
                COMPANY PASSPORT // PROFIL VA MAQOM
              </span>
              <span className="text-[#8ca0b3] font-mono text-xs">
                STIR / INN: {formData.taxId}
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#e8edf2]">
              Kompaniya Pasporti va Malaka Profili
            </h1>
            <p className="text-xs text-[#8ca0b3] mt-1">
              Bu yerdagi barcha ma’lumotlar davlat tenderlarida Fit Score algoritmi tomonidan tahlil qilinadi va avtomatik reyting chiqariladi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#5eead4]/15 text-[#5eead4] border border-[#5eead4]/30 font-bold">
              Tasdiqlangan Pudratchi ✓
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Basic & Legal Info */}
          <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#1a334d] space-y-4">
            <h2 className="font-heading text-sm font-bold text-[#e8edf2] flex items-center gap-2 pb-2 border-b border-[#182e44]">
              <Building2 className="w-4 h-4 text-[#ffb020]" />
              Asosiy Tashkiliy Ma’lumotlar
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-mono text-[#8ca0b3] mb-1">Kompaniya Nomi:</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2] focus:outline-none focus:border-[#ffb020]"
                />
              </div>

              <div>
                <label className="block font-mono text-[#8ca0b3] mb-1">Asosiy Soha va Faoliyat Yo‘nalishi:</label>
                <input
                  type="text"
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2] focus:outline-none focus:border-[#ffb020]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[#8ca0b3] mb-1">STIR / INN:</label>
                  <input
                    type="text"
                    required
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs font-mono text-[#ffb020] focus:outline-none focus:border-[#ffb020]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[#8ca0b3] mb-1">Litsenziya Raqami:</label>
                  <input
                    type="text"
                    value={formData.licenseNumber || ''}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs font-mono text-[#5eead4] focus:outline-none focus:border-[#ffb020]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[#8ca0b3] mb-1">Yuridik Manzil:</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2] focus:outline-none focus:border-[#ffb020]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Experience, Staff & Financial Capacity */}
          <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#1a334d] space-y-4">
            <h2 className="font-heading text-sm font-bold text-[#e8edf2] flex items-center gap-2 pb-2 border-b border-[#182e44]">
              <Award className="w-4 h-4 text-[#5eead4]" />
              Tajriba, Shtat va Moliyaviy Salohiyat
            </h2>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[#8ca0b3] mb-1">Tashkil Topgan Yili:</label>
                  <input
                    type="number"
                    value={formData.foundedYear}
                    onChange={(e) => setFormData({ ...formData, foundedYear: parseInt(e.target.value) || 2018 })}
                    className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs font-mono text-[#e8edf2]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[#8ca0b3] mb-1">Tajriba (yil):</label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 8 })}
                    className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs font-mono text-[#5eead4] font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[#8ca0b3] mb-1">Shtatdagi Xodimlar:</label>
                  <input
                    type="number"
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({ ...formData, employeeCount: parseInt(e.target.value) || 68 })}
                    className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs font-mono text-[#e8edf2]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[#8ca0b3] mb-1">Yillik Aylanma (UZS):</label>
                  <input
                    type="number"
                    value={formData.annualRevenueUzs}
                    onChange={(e) => setFormData({ ...formData, annualRevenueUzs: parseFloat(e.target.value) || 48500000000 })}
                    className="w-full px-3 py-2 bg-[#091422] border border-[#1e3852] rounded text-xs font-mono text-[#ffb020] font-bold"
                  />
                </div>
              </div>

              <div className="p-3 rounded bg-[#13253a] border border-[#1e3852] text-[11px] font-mono text-[#8ca0b3]">
                Yillik aylanma ko‘rsatkichi: <strong className="text-[#ffb020]">{formatUzsFull(formData.annualRevenueUzs)}</strong> (~{(formData.annualRevenueUzs / 1e9).toFixed(1)} mlrd UZS)
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Capabilities & Certifications Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Capabilities */}
          <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#1a334d] space-y-3">
            <h3 className="font-heading text-sm font-bold text-[#e8edf2] flex items-center justify-between">
              <span>Faoliyat Qobiliyatlari (Capabilities)</span>
              <span className="font-mono text-xs text-[#8ca0b3]">{formData.capabilities.length} ta</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCapability}
                onChange={(e) => setNewCapability(e.target.value)}
                placeholder="Yangi qobiliyat qo‘shish..."
                className="flex-1 px-3 py-1.5 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2] focus:outline-none focus:border-[#ffb020]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCapability();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCapability}
                className="px-3 py-1.5 bg-[#13253a] hover:bg-[#1a3452] text-[#ffb020] border border-[#ffb020]/30 font-bold text-xs rounded"
              >
                Qo‘shish
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {formData.capabilities.map((cap, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-[#13253a] border border-[#1e3852] text-xs">
                  <span className="text-[#e8edf2]">{cap}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCapability(i)}
                    className="text-[#8ca0b3] hover:text-[#ff6b5c] p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#1a334d] space-y-3">
            <h3 className="font-heading text-sm font-bold text-[#e8edf2] flex items-center justify-between">
              <span>Mavjud Sertifikatlar & Litsenziyalar</span>
              <span className="font-mono text-xs text-[#5eead4]">{formData.certifications.length} ta</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="masalan: ISO 9001:2015, OHSAS 18001..."
                className="flex-1 px-3 py-1.5 bg-[#091422] border border-[#1e3852] rounded text-xs text-[#e8edf2] focus:outline-none focus:border-[#ffb020]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCertification();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCertification}
                className="px-3 py-1.5 bg-[#13253a] hover:bg-[#1a3452] text-[#5eead4] border border-[#5eead4]/30 font-bold text-xs rounded"
              >
                Qo‘shish
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {formData.certifications.map((cert, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-[#13253a] border border-[#1e3852] text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5eead4]" />
                    <span className="text-[#e8edf2]">{cert}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCertification(i)}
                    className="text-[#8ca0b3] hover:text-[#ff6b5c] p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between p-4 rounded-md bg-[#0f1e2e] border border-[#1a334d]">
          {saveSuccess ? (
            <div className="flex items-center gap-2 text-xs font-mono text-[#5eead4]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ma’lumotlar bazada muvaffaqiyatli yangilandi va Fit Score qayta hisoblandi!</span>
            </div>
          ) : (
            <span className="text-xs font-mono text-[#8ca0b3]">
              O‘zgarishlar barcha tenderlardagi moslik ko‘rsatkichlarini real vaqtda yangilaydi.
            </span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#ffb020] hover:bg-[#e69d19] text-[#0a1420] font-bold text-xs rounded flex items-center gap-2 font-mono transition-all shadow-[0_0_15px_rgba(255,176,32,0.3)]"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>O‘zgarishlarni Saqlash</span>
          </button>
        </div>
      </form>
    </div>
  );
};
