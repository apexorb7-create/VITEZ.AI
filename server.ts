import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db } from './server/dataStore.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// API Endpoints

// 1. Company Profile
app.get('/api/company', (req, res) => {
  try {
    const company = db.getCompany();
    res.json({ success: true, data: company });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/company', (req, res) => {
  try {
    const updated = db.updateCompany(req.body);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Tenders
app.get('/api/tenders', (req, res) => {
  try {
    const tenders = db.getTenders();
    // Attach computed mini fit score for each tender
    const populated = tenders.map(t => {
      const deal = db.getDealRoomByTenderId(t.id);
      const fitScore = deal ? deal.fitScore : db.computeFitScore(t.id);
      return {
        ...t,
        fitScore,
        hasDealRoom: !!deal,
        dealRoomId: deal?.id
      };
    });
    res.json({ success: true, data: populated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/tenders/:id', (req, res) => {
  try {
    const tender = db.getTenderById(req.params.id);
    if (!tender) return res.status(404).json({ success: false, error: 'Tender topilmadi' });
    const factors = db.getFactorsByTenderId(tender.id);
    const deal = db.getDealRoomByTenderId(tender.id);
    const fitScore = deal ? deal.fitScore : db.computeFitScore(tender.id);

    res.json({ 
      success: true, 
      data: {
        ...tender,
        factors,
        fitScore,
        dealRoomId: deal?.id
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/tenders', (req, res) => {
  try {
    const newTender = db.addTender(req.body);
    res.json({ success: true, data: newTender });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Deal Rooms
app.get('/api/deals', (req, res) => {
  try {
    const deals = db.getDealRooms();
    res.json({ success: true, data: deals });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/deals/:id', (req, res) => {
  try {
    const deal = db.getDealRoomById(req.params.id);
    if (!deal) return res.status(404).json({ success: false, error: 'Deal Room topilmadi' });
    const blockers = db.getDocumentBlockers(deal.id);
    res.json({ success: true, data: { ...deal, blockers } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/deals', (req, res) => {
  try {
    const { tenderId } = req.body;
    if (!tenderId) return res.status(400).json({ success: false, error: 'tenderId kiritilmadi' });
    const deal = db.createDealRoom(tenderId);
    res.json({ success: true, data: deal });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/deals/:id', (req, res) => {
  try {
    const updated = db.updateDealRoom(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Deal topilmadi' });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Tasks within Deal Room
app.post('/api/deals/:id/tasks', (req, res) => {
  try {
    const { title, priority, dueDate, assignee } = req.body;
    const task = db.addTask(req.params.id, title, priority || 'MEDIUM', dueDate || new Date().toISOString().split('T')[0], assignee || 'Mas’ul xodim');
    res.json({ success: true, data: task });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/tasks/:taskId/toggle', (req, res) => {
  try {
    const task = db.toggleTask(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, error: 'Vazifa topilmadi' });
    res.json({ success: true, data: task });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/tasks/:taskId', (req, res) => {
  try {
    const ok = db.deleteTask(req.params.taskId);
    res.json({ success: ok });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Document Vault
app.get('/api/documents', (req, res) => {
  try {
    const docs = db.getDocuments();
    const blockers = db.getDocumentBlockers();
    res.json({ success: true, data: docs, blockers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/documents', (req, res) => {
  try {
    const doc = db.addDocument(req.body);
    res.json({ success: true, data: doc });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/documents/:id', (req, res) => {
  try {
    const { status, expiryDate } = req.body;
    const updated = db.updateDocumentStatus(req.params.id, status, expiryDate);
    if (!updated) return res.status(404).json({ success: false, error: 'Hujjat topilmadi' });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/documents/:id', (req, res) => {
  try {
    const ok = db.deleteDocument(req.params.id);
    res.json({ success: ok });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Pipeline Stages (Kanban)
app.get('/api/pipeline', (req, res) => {
  try {
    const deals = db.getDealRooms();
    res.json({ success: true, data: deals });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/pipeline/:dealId/stage', (req, res) => {
  try {
    const { stage } = req.body;
    const updated = db.updateDealRoomStage(req.params.dealId, stage);
    if (!updated) return res.status(404).json({ success: false, error: 'Deal topilmadi' });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Copilot Messages
app.get('/api/deals/:id/copilot/messages', (req, res) => {
  try {
    const messages = db.getCopilotMessages(req.params.id);
    res.json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/deals/:id/copilot/chat', (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, error: 'Xabar matni bo‘sh' });

    // Save user message
    db.addCopilotMessage(req.params.id, 'user', message);

    // Generate grounded deterministic AI response
    const aiResponse = db.generateGroundedCopilotResponse(req.params.id, message);
    const assistantMsg = db.addCopilotMessage(req.params.id, 'assistant', aiResponse.content, aiResponse.actionSuggestions);

    res.json({ success: true, data: assistantMsg });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. Analytics & Dashboard Summary
app.get('/api/dashboard', (req, res) => {
  try {
    const analytics = db.getAnalytics();
    const tenders = db.getTenders();
    const deals = db.getDealRooms();
    const blockers = db.getDocumentBlockers();
    res.json({
      success: true,
      data: {
        summary: {
          activeTendersCount: tenders.length,
          activeDealsCount: deals.length,
          avgFitScore: 89,
          totalPipelineValueUzs: deals.reduce((acc, d) => acc + (d.tender?.budgetUzs || 0), 0) || 64850000000,
          criticalBlockersCount: blockers.length,
        },
        topTenders: tenders.slice(0, 3).map(t => {
          const deal = db.getDealRoomByTenderId(t.id);
          return {
            ...t,
            fitScore: deal ? deal.fitScore : db.computeFitScore(t.id),
            hasDealRoom: !!deal,
            dealRoomId: deal?.id
          };
        }),
        activeDeals: deals,
        blockers,
        analytics,
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/analytics', (req, res) => {
  try {
    const analytics = db.getAnalytics();
    res.json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. Activity Logs
app.get('/api/activities', (req, res) => {
  try {
    const activities = db.getActivities();
    res.json({ success: true, data: activities });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 10. Reset Seed
app.post('/api/reset-seed', (req, res) => {
  try {
    const data = db.resetSeed();
    res.json({ success: true, message: 'Ma’lumotlar bazasi qayta tiklandi', data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VITEZ.AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
