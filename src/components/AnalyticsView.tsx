import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Award, Radar } from 'lucide-react';
import { api, formatUzs } from '../api';

const COLORS = ['#ffb020', '#5eead4', '#93c5fd', '#c084fc', '#f43f5e'];

export const AnalyticsView: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="p-12 text-center text-xs font-mono text-[#8ca0b3] bg-[#0f1e2e] border border-[#1e3852] rounded-md">
        <Radar className="w-8 h-8 text-[#ffb020] animate-spin mx-auto mb-2" />
        Analitika hisoblanmoqda...
      </div>
    );
  }

  const funnelData = analytics.funnel || [
    { stage: 'Discovered', stageUz: 'Topilgan', count: 8, valueUzs: 48000000000 },
    { stage: 'Analyzing', stageUz: 'Tahlil', count: 5, valueUzs: 34000000000 },
    { stage: 'Preparing', stageUz: 'Tayyorlanmoqda', count: 3, valueUzs: 26000000000 },
    { stage: 'Submitted', stageUz: 'Topshirilgan', count: 2, valueUzs: 18450000000 },
    { stage: 'Won', stageUz: 'Yutilgan', count: 4, valueUzs: 38200000000 },
  ];

  const categoryData = analytics.categoryData || [
    { name: 'Qurilish va Muhandislik', tendersCount: 3, budgetBillionUzs: 30.65 },
    { name: 'Energetika va Kommunal', tendersCount: 2, budgetBillionUzs: 15.70 },
    { name: 'IT va Dasturiy', tendersCount: 1, budgetBillionUzs: 5.40 },
  ];

  const portalStats = analytics.portalStats || [
    { portal: 'xarid.uz', count: 2 },
    { portal: 'uzex.uz', count: 1 },
    { portal: 'dxarid.uz', count: 1 },
    { portal: 'e-ID.uz', count: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#1e3852] bg-grid-pattern">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold text-[#5eead4] bg-[#5eead4]/15 px-2 py-0.5 rounded border border-[#5eead4]/30 uppercase">
                RADAR ANALYTICS // STATISTIKA
              </span>
              <span className="text-[#8ca0b3] font-mono text-xs">
                Real vaqt tahlili
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#e8edf2]">
              Tender Konversiyasi va Byudjet Tahlili
            </h1>
            <p className="text-xs text-[#8ca0b3] mt-1">
              Davlat xaridlari voronkasi (Funnel), sohalar bo‘yicha byudjet taqsimoti va yutuq samaradorligi ko‘rsatkichlari.
            </p>
          </div>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded bg-[#0f1e2e] border border-[#1a334d]">
          <span className="text-[11px] font-mono text-[#8ca0b3] uppercase">Jami Yutilgan Byudjet</span>
          <div className="font-mono text-2xl font-bold text-[#ffb020] mt-1">
            {formatUzs(analytics.totalWonValueUzs || 38200000000)}
          </div>
          <p className="text-[10px] text-[#8ca0b3] mt-1">4 ta yirik davlat loyihasi</p>
        </div>

        <div className="p-4 rounded bg-[#0f1e2e] border border-[#1a334d]">
          <span className="text-[11px] font-mono text-[#8ca0b3] uppercase">Voronka Konversiyasi</span>
          <div className="font-mono text-2xl font-bold text-[#5eead4] mt-1">
            50.0%
          </div>
          <p className="text-[10px] text-[#8ca0b3] mt-1">Topshirilgandan yutilgangacha</p>
        </div>

        <div className="p-4 rounded bg-[#0f1e2e] border border-[#1a334d]">
          <span className="text-[11px] font-mono text-[#8ca0b3] uppercase">O‘rtacha Moslik (Fit)</span>
          <div className="font-mono text-2xl font-bold text-[#ffb020] mt-1">
            {analytics.avgFitScore || 85}%
          </div>
          <p className="text-[10px] text-[#8ca0b3] mt-1">SME ixtisoslashuv darajasi</p>
        </div>

        <div className="p-4 rounded bg-[#0f1e2e] border border-[#1a334d]">
          <span className="text-[11px] font-mono text-[#8ca0b3] uppercase">Agregatsiya Qamrovi</span>
          <div className="font-mono text-2xl font-bold text-[#5eead4] mt-1">
            4 / 4 Portal
          </div>
          <p className="text-[10px] text-[#8ca0b3] mt-1">100% milliy xarid qamrovi</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Funnel Pipeline Chart */}
        <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#1a334d] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-[#e8edf2] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#ffb020]" />
              Tender Voronkasi (Discovered → Won)
            </h3>
            <span className="font-mono text-xs text-[#8ca0b3]">Arizalar soni</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#182e44" />
                <XAxis type="number" stroke="#8ca0b3" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis dataKey="stageUz" type="category" stroke="#8ca0b3" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#091422', borderColor: '#1e3852', borderRadius: '4px' }}
                  labelStyle={{ color: '#ffb020', fontFamily: 'Space Grotesk', fontWeight: 'bold' }}
                  itemStyle={{ color: '#e8edf2', fontFamily: 'JetBrains Mono', fontSize: '12px' }}
                  formatter={(value: any) => [`${value} ta tender`, 'Miqdori']}
                />
                <Bar dataKey="count" fill="#ffb020" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Distribution */}
        <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#1a334d] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-[#e8edf2] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#5eead4]" />
              Sohalar Bo‘yicha Byudjet Taqsimoti (mlrd UZS)
            </h3>
            <span className="font-mono text-xs text-[#5eead4]">mlrd UZS</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#182e44" />
                <XAxis dataKey="name" stroke="#8ca0b3" tick={{ fontSize: 10, fontFamily: 'Inter' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#8ca0b3" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#091422', borderColor: '#1e3852', borderRadius: '4px' }}
                  labelStyle={{ color: '#5eead4', fontFamily: 'Space Grotesk', fontWeight: 'bold' }}
                  itemStyle={{ color: '#e8edf2', fontFamily: 'JetBrains Mono', fontSize: '12px' }}
                  formatter={(value: any) => [`${value} mlrd UZS`, 'Byudjet']}
                />
                <Bar dataKey="budgetBillionUzs" fill="#5eead4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Portal Breakdown */}
        <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#1a334d] space-y-3">
          <h3 className="font-heading text-sm font-bold text-[#e8edf2]">
            Manba Portallari Ulushi
          </h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portalStats}
                  dataKey="count"
                  nameKey="portal"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={({ portal, percent }) => `${portal} (${(percent * 100).toFixed(0)}%)`}
                >
                  {portalStats.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#091422', borderColor: '#1e3852' }}
                  itemStyle={{ color: '#e8edf2', fontFamily: 'JetBrains Mono' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intelligence Insights Summary */}
        <div className="p-5 rounded-md bg-[#0f1e2e] border border-[#1a334d] space-y-3">
          <h3 className="font-heading text-sm font-bold text-[#e8edf2] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#ffb020]" />
            Algoritmik Xulosa & Tavsiyalar
          </h3>
          <div className="space-y-2.5 text-xs text-[#8ca0b3] leading-relaxed">
            <div className="p-3 rounded bg-[#13253a] border border-[#1e3852]">
              <strong className="text-[#5eead4] block mb-0.5">1. Asosiy Daromad Sohalari:</strong>
              Eng yuqori yutuq ehtimoli (94%) va eng katta byudjet massasi <strong>Qurilish va Muhandislik</strong> yo‘nalishidagi maktab hamda ijtimoiy obyektlar rekonstruktsiyasiga to‘g‘ri kelmoqda.
            </div>
            <div className="p-3 rounded bg-[#13253a] border border-[#1e3852]">
              <strong className="text-[#ffb020] block mb-0.5">2. Hujjat Blokirovkasi Xavfi:</strong>
              Moliya auditi va ISO 9001 sertifikatini vaqtida yangilash arizalar qabul qilinish ehtimolini 22% ga oshiradi.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
