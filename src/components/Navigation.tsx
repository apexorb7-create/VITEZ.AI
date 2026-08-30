import React from 'react';
import { 
  Radar, 
  LayoutDashboard, 
  Search, 
  FolderKanban, 
  FileText, 
  BarChart3, 
  Building2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Company } from '../types';

export type ActiveTab = 'command-center' | 'tenders' | 'deal-room' | 'documents' | 'pipeline' | 'analytics' | 'company';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  company: Company | null;
  activeDealId?: string;
  onResetSeed: () => void;
  openCreateBidModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  company,
  activeDealId,
  onResetSeed,
  openCreateBidModal,
}) => {
  const navItems = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard, badge: null },
    { id: 'tenders', label: 'Milliy Tenderlar', icon: Search, badge: '4 portal' },
    { id: 'deal-room', label: 'Deal Room', icon: Radar, badge: 'Flagship' },
    { id: 'documents', label: 'Document Vault', icon: FileText, badge: '2 bloker' },
    { id: 'pipeline', label: 'Bid Pipeline', icon: FolderKanban, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'company', label: 'Kompaniya Pasporti', icon: Building2, badge: null },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1e334a] bg-[#0c1826]/95 backdrop-blur-md">
      {/* Top HUD Status Bar */}
      <div className="flex items-center justify-between px-4 lg:px-8 py-2 border-b border-[#15263a] text-xs bg-[#09121d]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#13253a] border border-[#1e3852]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5eead4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5eead4]"></span>
            </span>
            <span className="font-mono text-[11px] text-[#5eead4] uppercase tracking-wider font-semibold">
              Live Radar: 4 Portal Sinxron
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[#8ca0b3] font-mono text-[11px]">
            <span className="text-[#3b536b]">|</span>
            <span>xarid.uz</span>
            <span className="text-[#3b536b]">•</span>
            <span>uzex.uz</span>
            <span className="text-[#3b536b]">•</span>
            <span>dxarid.uz</span>
            <span className="text-[#3b536b]">•</span>
            <span>e-ID.uz</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Company profile chip */}
          <div 
            onClick={() => setActiveTab('company')}
            className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#102030] hover:bg-[#14283d] border border-[#1e354d] cursor-pointer transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-[#ffb020]"></div>
            <span className="font-sans text-xs text-[#e8edf2] font-medium truncate max-w-[180px]">
              {company?.name || 'Tashkent Engineering Solutions'}
            </span>
            <span className="font-mono text-[10px] text-[#ffb020] bg-[#ffb020]/10 px-1.5 py-0.2 rounded border border-[#ffb020]/20">
              INN: {company?.taxId || '305918274'}
            </span>
          </div>

          {/* Reset Demo button */}
          <button
            onClick={onResetSeed}
            title="Dastlabki demo ma'lumotlarini qayta tiklash (Pitch deck holati)"
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-mono text-[#8ca0b3] hover:text-[#e8edf2] hover:bg-[#182c42] rounded border border-[#1e334a] transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-[#ffb020]" />
            <span className="hidden md:inline">Reset Seed</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 lg:px-8 flex items-center justify-between h-14">
        <div className="flex items-center gap-8">
          {/* Brand Identity */}
          <div 
            onClick={() => setActiveTab('command-center')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded bg-[#13253a] border border-[#ffb020]/40 flex items-center justify-center text-[#ffb020] shadow-[0_0_12px_rgba(255,176,32,0.15)] group-hover:border-[#ffb020] transition-colors">
              <Radar className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-lg tracking-wider text-[#e8edf2] group-hover:text-white">
                  VITEZ<span className="text-[#ffb020]">.AI</span>
                </span>
                <span className="font-mono text-[9px] px-1 py-0.5 rounded bg-[#ffb020]/15 text-[#ffb020] border border-[#ffb020]/30 font-semibold">
                  SME TENDER RADAR
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all relative ${
                    isActive 
                      ? 'bg-[#152a3f] text-[#ffb020] border border-[#ffb020]/30 shadow-[0_0_8px_rgba(255,176,32,0.1)]' 
                      : 'text-[#8ca0b3] hover:text-[#e8edf2] hover:bg-[#102235] border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#ffb020]' : 'text-[#8ca0b3]'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded border ${
                      item.badge === 'Flagship' 
                        ? 'bg-[#ffb020]/20 text-[#ffb020] border-[#ffb020]/40'
                        : item.badge.includes('bloker')
                        ? 'bg-[#ff6b5c]/20 text-[#ff6b5c] border-[#ff6b5c]/40'
                        : 'bg-[#13253a] text-[#8ca0b3] border-[#1e3852]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={openCreateBidModal}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-[#ffb020] hover:bg-[#e69d19] text-[#0a1420] font-semibold text-xs rounded transition-all shadow-[0_0_12px_rgba(255,176,32,0.25)] hover:shadow-[0_0_16px_rgba(255,176,32,0.4)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Taklif Kiritish (Create Bid)</span>
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Navigation Scroll */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 border-t border-[#15263a] gap-2 scrollbar-none">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium ${
                isActive 
                  ? 'bg-[#152a3f] text-[#ffb020] border border-[#ffb020]/30' 
                  : 'text-[#8ca0b3] hover:text-[#e8edf2] bg-[#0c1928] border border-[#192f45]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
