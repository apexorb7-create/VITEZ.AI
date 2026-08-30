/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Navigation, ActiveTab } from './components/Navigation';
import { Footer } from './components/Footer';
import { CommandCenterView } from './components/CommandCenterView';
import { TendersListView } from './components/TendersListView';
import { DealRoomView } from './components/DealRoomView';
import { DocumentVaultView } from './components/DocumentVaultView';
import { PipelineView } from './components/PipelineView';
import { AnalyticsView } from './components/AnalyticsView';
import { CompanyPassportView } from './components/CompanyPassportView';
import { CreateBidModal } from './components/CreateBidModal';
import { api } from './api';
import { Tender, DealRoom, Document, Company } from './types';
import { Radar } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('command-center');
  const [activeDealId, setActiveDealId] = useState<string>('deal-1');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Global app data state
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [tenders, setTenders] = useState<any[]>([]);
  const [dealRooms, setDealRooms] = useState<DealRoom[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [blockers, setBlockers] = useState<any[]>([]);

  const loadAllData = async () => {
    try {
      const [dash, tnds, deals, docRes, comp, acts] = await Promise.all([
        api.getDashboardSummary().catch(() => null),
        api.getTenders().catch(() => []),
        api.getDealRooms().catch(() => []),
        api.getDocuments().catch(() => ({ documents: [], blockers: [] })),
        api.getCompany().catch(() => null),
        api.getActivities().catch(() => []),
      ]);

      if (dash) setDashboardData(dash);
      if (tnds && tnds.length > 0) setTenders(tnds);
      if (deals && deals.length > 0) setDealRooms(deals);
      if (docRes && docRes.documents) setDocuments(docRes.documents);
      if (comp) setCompany(comp);
      if (acts && acts.length > 0) setActivities(acts);
      setBlockers(dash?.blockers || docRes?.blockers || []);

      // If activeDealId not set or not found, set to first deal
      if (deals && deals.length > 0 && (!activeDealId || !deals.some((d: any) => d.id === activeDealId))) {
        setActiveDealId(deals[0].id);
      }
    } catch (err) {
      console.error('Failed to load VITEZ data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleResetSeed = async () => {
    if (!confirm('Barcha ma’lumotlarni dastlabki demo holatiga qaytarishni xohlaysizmi?')) return;
    try {
      await api.resetSeed();
      await loadAllData();
    } catch (err: any) {
      alert('Tiklashda xatolik: ' + err.message);
    }
  };

  const handleOpenDeal = (dealId: string) => {
    setActiveDealId(dealId);
    setActiveTab('deal-room');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateDealFromTender = async (tenderId: string) => {
    try {
      const deal = await api.createDealRoom(tenderId);
      await loadAllData();
      handleOpenDeal(deal.id);
    } catch (err: any) {
      alert('Deal Room ochishda xatolik: ' + err.message);
    }
  };

  const handleCreateBidSuccess = async (newDealId: string) => {
    setIsCreateModalOpen(false);
    await loadAllData();
    handleOpenDeal(newDealId);
  };

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-[#0a1420] text-[#e8edf2] flex flex-col items-center justify-center space-y-4 font-mono">
        <Radar className="w-12 h-12 text-[#ffb020] animate-spin" />
        <div className="text-center space-y-1">
          <div className="font-heading text-xl font-bold tracking-widest text-[#ffb020]">
            VITEZ.AI // XARID INTELLIGENCE
          </div>
          <div className="text-xs text-[#8ca0b3]">
            Milliy tenderlar tarmog‘i yuklanmoqda...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1420] text-[#e8edf2] flex flex-col font-sans selection:bg-[#ffb020] selection:text-[#0a1420]">
      {/* Top HUD Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        company={company}
        activeDealId={activeDealId}
        onResetSeed={handleResetSeed}
        openCreateBidModal={() => setIsCreateModalOpen(true)}
      />

      {/* Main Screen Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'command-center' && (
          <CommandCenterView
            tenders={tenders}
            deals={dealRooms}
            blockers={blockers}
            activities={activities}
            onOpenDeal={handleOpenDeal}
            onCreateDeal={handleCreateDealFromTender}
            onNavigateTab={setActiveTab}
            openCreateBidModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {activeTab === 'tenders' && (
          <TendersListView
            tenders={tenders}
            onOpenDeal={handleOpenDeal}
            onCreateDeal={handleCreateDealFromTender}
            openCreateBidModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {activeTab === 'deal-room' && (
          <DealRoomView
            dealId={activeDealId || 'deal-1'}
            onNavigateTab={setActiveTab}
            onRefreshGlobalData={loadAllData}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentVaultView
            documents={documents}
            blockers={blockers}
            onRefresh={loadAllData}
            onOpenDeal={handleOpenDeal}
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineView
            deals={dealRooms}
            tenders={tenders}
            onOpenDeal={handleOpenDeal}
            onRefresh={loadAllData}
            openCreateBidModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView />
        )}

        {activeTab === 'company' && (
          <CompanyPassportView
            company={company}
            onCompanyUpdated={(updated) => {
              setCompany(updated);
              loadAllData();
            }}
          />
        )}
      </main>

      {/* Trust & Transparency Footer on every screen */}
      <Footer />

      {/* Global Create Bid Modal */}
      <CreateBidModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateBidSuccess}
      />
    </div>
  );
}
