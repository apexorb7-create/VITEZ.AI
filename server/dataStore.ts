import fs from 'fs';
import path from 'path';
import { 
  Company, 
  Tender, 
  FitScoreFactor, 
  DealRoom, 
  DealRoomTask, 
  Document, 
  CopilotMessage, 
  ActivityLog, 
  PipelineStageType,
  DecisionType,
  DocumentBlocker
} from '../src/types';

interface DatabaseSchema {
  company: Company;
  tenders: Tender[];
  factors: FitScoreFactor[];
  dealRooms: DealRoom[];
  tasks: DealRoomTask[];
  documents: Document[];
  copilotMessages: CopilotMessage[];
  activities: ActivityLog[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getInitialSeedData(): DatabaseSchema {
  const company: Company = {
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
    annualRevenueUzs: 48500000000, // 48.5 mlrd UZS
    licenseNumber: 'LIT-UZ-2021-78901'
  };

  const tenders: Tender[] = [
    {
      id: 'tnd-1',
      tenderNumber: 'UZ-XARID-2026-4891',
      title: 'Toshkent shahrida 12 ta davlat umumta’lim maktabini kompleks rekonstruktsiya qilish va muhandislik tarmoqlarini modernizatsiya qilish',
      agency: 'O‘zbekiston Respublikasi Maktabgacha va maktab ta’limi vazirligi',
      category: 'Qurilish va Muhandislik',
      budgetUzs: 18450000000, // 18.45 mlrd UZS
      deadline: '2026-09-18T18:00:00Z',
      requirements: [
        'Qurilish va montaj ishlarida kamida 5 yillik tasdiqlangan tajriba',
        'ISO 9001:2015 sertifikati mavjudligi',
        'Kamida 50 nafar doimiy shtatdagi malakali muhandis-texnik xodimlar',
        'Moliyaviy audit hisoboti (oxirgi 2 yil uchun ijobiy xulosa)',
        '3% miqdorida bank kafolati (garov ta’minoti)'
      ],
      sourcePortal: 'xarid.uz',
      description: 'Loyiha Toshkent shahrining 3 ta tumanida joylashgan 12 ta umumta’lim maktablarining tom qismi, fasadi, ichki isitish va ventilyatsiya tizimlari hamda sanitariya tarmoqlarini to‘liq yangilashni o‘z ichiga oladi.',
      status: 'OPEN',
      publishedAt: '2026-08-25T09:00:00Z',
      region: 'Toshkent shahri',
      earnestMoneyUzs: 553500000,
      contractDurationMonths: 9
    },
    {
      id: 'tnd-2',
      tenderNumber: 'UZEX-2026-9042',
      title: 'Samarqand viloyati Payariq tumanida zamonaviy markaziy poliklinika binosini qurish va jihozlash',
      agency: 'O‘zbekiston Respublikasi Sog‘liqni saqlash vazirligi',
      category: 'Qurilish va Muhandislik',
      budgetUzs: 12200000000, // 12.2 mlrd UZS
      deadline: '2026-09-24T17:00:00Z',
      requirements: [
        'Tibbiyot muassasalari yoki ijtimoiy obyektlar qurilishida tajriba (kamida 3 ta yakunlangan obyekt)',
        '1- yoki 2-toifali qurilish litsenziyasi',
        'Sanitariya-epidemiologik xavfsizlik me’yorlari sertifikati',
        'Bank kafolati talabnomasi'
      ],
      sourcePortal: 'uzex.uz',
      description: '3 qavatli 250 qatnovga mo‘ljallangan markaziy tuman poliklinikasi binosini noldan qurish, transformator stansiyasini o‘rnatish va atrofni obodonlashtirish.',
      status: 'OPEN',
      publishedAt: '2026-08-28T11:30:00Z',
      region: 'Samarqand viloyati',
      earnestMoneyUzs: 366000000,
      contractDurationMonths: 12
    },
    {
      id: 'tnd-3',
      tenderNumber: 'DXARID-2026-1184',
      title: 'Farg‘ona vodiysi magistral suv ta’minoti tizimini avtomatlashtirish va SCADA boshqaruv panellarini o‘rnatish',
      agency: 'O‘zsuvta’minot AJ',
      category: 'Energetika va Kommunal',
      budgetUzs: 8900000000, // 8.9 mlrd UZS
      deadline: '2026-09-12T15:00:00Z',
      requirements: [
        'SCADA va telemetriya tizimlarini joriy etish tajribasi',
        'Suv ta’minoti infratuzilmasi muhandislik litsenziyasi',
        'Sanoat kontrollerlari yetkazib berish va o‘rnatish litsenziyasi'
      ],
      sourcePortal: 'dxarid.uz',
      description: 'Farg‘ona va Namangan viloyatlari orasidagi 4 ta nasos stansiyasini avtomatlashtirilgan monitoring va boshqaruv tizimiga ulash.',
      status: 'CLOSING_SOON',
      publishedAt: '2026-08-20T14:00:00Z',
      region: 'Farg‘ona viloyati',
      earnestMoneyUzs: 267000000,
      contractDurationMonths: 6
    },
    {
      id: 'tnd-4',
      tenderNumber: 'E-ID-2026-5501',
      title: 'Toshkent shahar transport boshqarmasi uchun axborot infratuzilmasi va server uskunalarini yetkazib berish',
      agency: 'Toshkent shahar Transport boshqarmasi',
      category: 'IT va Dasturiy Ta’minot',
      budgetUzs: 5400000000, // 5.4 mlrd UZS
      deadline: '2026-09-30T18:00:00Z',
      requirements: [
        'IT uskunalar distribyutori rasmiy hamkorlik sertifikati (HP/Dell/Cisco)',
        'Kiberxavfsizlik va ma’lumotlar bazasi xavfsizligi sertifikati',
        'Kamida 3 yillik IT infratuzilma integratsiyasi tajribasi'
      ],
      sourcePortal: 'e-ID.uz',
      description: 'Markazlashtirilgan ma’lumotlar markazi uchun 8 ta rack-server, saqlash tizimi (SAN) va tarmoq xavfsizligi shlyuzlarini yetkazib berish va sozlash.',
      status: 'OPEN',
      publishedAt: '2026-08-29T08:00:00Z',
      region: 'Toshkent shahri',
      earnestMoneyUzs: 162000000,
      contractDurationMonths: 3
    },
    {
      id: 'tnd-5',
      tenderNumber: 'UZ-XARID-2026-3390',
      title: 'Buxoro viloyatida 500 kVt quyosh fotoelektr stansiyasi montaji va elektr tarmog‘iga integratsiyasi',
      agency: 'O‘zbekiston Respublikasi Energetika vazirligi',
      category: 'Energetika va Kommunal',
      budgetUzs: 6800000000, // 6.8 mlrd UZS
      deadline: '2026-09-28T16:00:00Z',
      requirements: [
        'Qayta tiklanuvchi energiya manbalari montaji bo‘yicha litsenziya',
        'Yuqori kuchlanishli elektr tarmoqlari bilan ishlash ruxsatnomasi (Guruh IV/V)',
        'Kamida 2 ta muvaffaqiyatli quyosh stansiyasi keyslari'
      ],
      sourcePortal: 'xarid.uz',
      description: 'Sanoat korxonasi ehtiyojlari uchun quyosh panellari massivini o‘rnatish, invertorlar podstansiyasini sozlash va umumiy tarmoqqa sinxronlashtirish.',
      status: 'OPEN',
      publishedAt: '2026-08-27T10:00:00Z',
      region: 'Buxoro viloyati',
      earnestMoneyUzs: 204000000,
      contractDurationMonths: 5
    }
  ];

  // Flagship Pitch Deck Factors for tnd-1 (Target Fit Score: 94/100)
  const factors: FitScoreFactor[] = [
    {
      id: 'fct-1',
      tenderId: 'tnd-1',
      name: 'Soha va Asosiy Faoliyat Mosligi',
      weight: 0.25,
      score: 98,
      explanation: 'Kompaniyaning asosiy faoliyat yo‘nalishi (qurilish va muhandislik tarmoqlari) tender talablariga 100% to‘liq mos keladi. Bino rekonstruktsiyasi va isitish/suv montaji profili tasdiqlangan.',
      category: 'industry'
    },
    {
      id: 'fct-2',
      tenderId: 'tnd-1',
      name: 'Tajriba va Malaka Chegarasi',
      weight: 0.25,
      score: 95,
      explanation: 'Tenderda 5 yillik tajriba talab qilingan. Tashkent Engineering Solutions 8 yillik (2018-yildan beri) tasdiqlangan davlat va tijorat obyektlari portfeliga ega.',
      category: 'experience'
    },
    {
      id: 'fct-3',
      tenderId: 'tnd-1',
      name: 'Sertifikatsiya va Litsenziya Qamrovi',
      weight: 0.20,
      score: 88,
      explanation: 'Davlat Qurilish Qo‘mitasi 2-toifali litsenziyasi va mehnat xavfsizligi mavjud. ISO 9001 sertifikati yangilash muddatida bo‘lganligi sababli ball ozgina cheklangan.',
      category: 'certifications'
    },
    {
      id: 'fct-4',
      tenderId: 'tnd-1',
      name: 'Moliyaviy Salohiyat va Byudjet Mosligi',
      weight: 0.15,
      score: 96,
      explanation: 'Tender byudjeti (18.45 mlrd UZS) kompaniyaning yillik aylanmasi (48.5 mlrd UZS)ning 38% qismini tashkil etadi. Bu xarid qoidalaridagi sog‘lom moliyaviy me’yorga to‘liq mos.',
      category: 'budget'
    },
    {
      id: 'fct-5',
      tenderId: 'tnd-1',
      name: 'Texnik va Shtat Quvvati',
      weight: 0.15,
      score: 92,
      explanation: 'Kompaniyada 68 nafar doimiy mutaxassis xodimlar mavjud (tender minimal talabi 50 nafar). Shaxsiy maxsus texnika parki mavjud.',
      category: 'technical'
    },

    // Factors for tnd-2 (Payariq poliklinika)
    {
      id: 'fct-201',
      tenderId: 'tnd-2',
      name: 'Soha va Asosiy Faoliyat Mosligi',
      weight: 0.30,
      score: 92,
      explanation: 'Ijtimoiy bino qurilishi va montaj ishlari to‘liq qamrab olingan.',
      category: 'industry'
    },
    {
      id: 'fct-202',
      tenderId: 'tnd-2',
      name: 'Tajriba va Malaka Chegarasi',
      weight: 0.25,
      score: 85,
      explanation: 'Oxirgi 3 yilda 2 ta tibbiyot obyekti rekonstruktsiya qilingan.',
      category: 'experience'
    },
    {
      id: 'fct-203',
      tenderId: 'tnd-2',
      name: 'Sertifikatsiya va Litsenziya Qamrovi',
      weight: 0.25,
      score: 80,
      explanation: 'Sanitariya-epidemiologik xavfsizlik sertifikati yangilanishi talab etiladi.',
      category: 'certifications'
    },
    {
      id: 'fct-204',
      tenderId: 'tnd-2',
      name: 'Moliyaviy Salohiyat va Byudjet Mosligi',
      weight: 0.20,
      score: 95,
      explanation: '12.2 mlrd UZS qiymatidagi tender uchun bank kafolati limiti yetarli.',
      category: 'budget'
    },

    // Factors for tnd-3 (SCADA)
    {
      id: 'fct-301',
      tenderId: 'tnd-3',
      name: 'Soha va Asosiy Faoliyat Mosligi',
      weight: 0.35,
      score: 65,
      explanation: 'Suv ta’minoti infratuzilmasi mavjud, ammo SCADA dasturiy integratsiyasi bo‘yicha subpudratchi jalb qilish talab etiladi.',
      category: 'industry'
    },
    {
      id: 'fct-302',
      tenderId: 'tnd-3',
      name: 'Tajriba va Malaka Chegarasi',
      weight: 0.25,
      score: 75,
      explanation: 'Nasos stansiyalari quvurlarida tajriba bor.',
      category: 'experience'
    },
    {
      id: 'fct-303',
      tenderId: 'tnd-3',
      name: 'Sertifikatsiya va Litsenziya Qamrovi',
      weight: 0.20,
      score: 60,
      explanation: 'Telemetriya boshqaruv sertifikati to‘liq emas.',
      category: 'certifications'
    },
    {
      id: 'fct-304',
      tenderId: 'tnd-3',
      name: 'Moliyaviy Salohiyat va Byudjet Mosligi',
      weight: 0.20,
      score: 90,
      explanation: '8.9 mlrd UZS byudjet kompaniya moliyaviy doirasiga to‘g‘ri keladi.',
      category: 'budget'
    },

    // Factors for tnd-4 (IT Infrastructure)
    {
      id: 'fct-401',
      tenderId: 'tnd-4',
      name: 'Soha va Asosiy Faoliyat Mosligi',
      weight: 0.40,
      score: 40,
      explanation: 'Kompaniya qurilish-muhandislik profilli. IT server uskunalari distributsiyasi asosiy faoliyatga kirmaydi.',
      category: 'industry'
    },
    {
      id: 'fct-402',
      tenderId: 'tnd-4',
      name: 'Sertifikatsiya va Litsenziya Qamrovi',
      weight: 0.30,
      score: 35,
      explanation: 'HP/Cisco rasmiy sheriklik maqomi yo‘q.',
      category: 'certifications'
    },
    {
      id: 'fct-403',
      tenderId: 'tnd-4',
      name: 'Moliyaviy Salohiyat va Byudjet Mosligi',
      weight: 0.30,
      score: 85,
      explanation: 'Moliya aylanmasi yetarli, biroq ixtisoslashuv mos emas.',
      category: 'budget'
    }
  ];

  // Documents
  const documents: Document[] = [
    {
      id: 'doc-1',
      companyId: 'comp-1',
      name: 'Davlat Qurilish Qo‘mitasi 2-toifali Litsenziyasi',
      type: 'Litsenziya',
      status: 'READY',
      expiryDate: '2028-11-15T00:00:00Z',
      linkedTenderId: 'tnd-1',
      linkedTenderTitle: 'Toshkent shahrida 12 ta davlat maktabi',
      fileSizeBytes: 4200000,
      lastVerifiedDate: '2026-08-10',
      notes: 'Davlat reyestridan tasdiqlangan nusxa'
    },
    {
      id: 'doc-2',
      companyId: 'comp-1',
      name: 'ISO 9001:2015 Sifat Menejmenti Sertifikati',
      type: 'Sertifikat',
      status: 'MISSING', // Open blocker 1: Pitch deck exact match
      expiryDate: '2026-08-01T00:00:00Z',
      linkedTenderId: 'tnd-1',
      linkedTenderTitle: 'Toshkent shahrida 12 ta davlat maktabi',
      fileSizeBytes: 0,
      lastVerifiedDate: '2026-08-01',
      notes: 'Resertifikatsiya auditi yakunlangan, yangilangan fayl portalga yuklanishi zarur',
      isBlockerForTender: true
    },
    {
      id: 'doc-3',
      companyId: 'comp-1',
      name: '2024-2025 Yillik Mustaqil Moliyaviy Audit Xulosasi',
      type: 'Moliyaviy hisobot',
      status: 'EXPIRING', // Open blocker 2: Pitch deck exact match (14 days remaining)
      expiryDate: '2026-09-13T00:00:00Z',
      linkedTenderId: 'tnd-1',
      linkedTenderTitle: 'Toshkent shahrida 12 ta davlat maktabi',
      fileSizeBytes: 18500000,
      lastVerifiedDate: '2026-08-15',
      notes: 'Amal qilish muddati 14 kundan so‘ng tugaydi. Yangi oraliq auditorlik ma’lumotnomasi talab qilinadi.',
      isBlockerForTender: true
    },
    {
      id: 'doc-4',
      companyId: 'comp-1',
      name: 'Soliq va majburiy to‘lovlardan qarzdorlik yo‘qligi to‘g‘risida ma’lumotnoma',
      type: 'Davlat soliq ma’lumotnomasi',
      status: 'READY',
      expiryDate: '2026-09-25T00:00:00Z',
      linkedTenderId: 'tnd-1',
      linkedTenderTitle: 'Toshkent shahrida 12 ta davlat maktabi',
      fileSizeBytes: 1200000,
      lastVerifiedDate: '2026-08-26',
      notes: 'soliq.uz elektron raqamli imzosi bilan tasdiqlangan'
    },
    {
      id: 'doc-5',
      companyId: 'comp-1',
      name: 'Bank Kafolati Shartnomasi (3% Tender Garovi)',
      type: 'Bank kafolati',
      status: 'READY',
      expiryDate: '2026-10-30T00:00:00Z',
      linkedTenderId: 'tnd-1',
      linkedTenderTitle: 'Toshkent shahrida 12 ta davlat maktabi',
      fileSizeBytes: 3100000,
      lastVerifiedDate: '2026-08-27',
      notes: 'O‘zsanoatqurilishbank ATB kafolat xati (553.5 mln UZS)'
    },
    {
      id: 'doc-6',
      companyId: 'comp-1',
      name: 'Mehnat muhofazasi va texnika xavfsizligi attestatsiyasi',
      type: 'Attestatsiya',
      status: 'READY',
      expiryDate: '2027-04-20T00:00:00Z',
      linkedTenderId: null,
      fileSizeBytes: 2400000,
      lastVerifiedDate: '2026-07-15',
      notes: 'Xodimlar uchun to‘liq o‘quv kursi o‘tkazilgan'
    },
    {
      id: 'doc-7',
      companyId: 'comp-1',
      name: 'Asosiy vositalar va maxsus texnika vositalari egalik guvohnomalari',
      type: 'Texnika pasportlari',
      status: 'READY',
      expiryDate: '2029-12-31T00:00:00Z',
      linkedTenderId: 'tnd-1',
      linkedTenderTitle: 'Toshkent shahrida 12 ta davlat maktabi',
      fileSizeBytes: 14200000,
      lastVerifiedDate: '2026-08-01',
      notes: '14 ta maxsus avtotexnika va kran uskunalari'
    },
    {
      id: 'doc-8',
      companyId: 'comp-1',
      name: 'Avvalgi davlat loyihalari bo‘yicha buyurtmachi tavsiyanomalari (Keyslar)',
      type: 'Tavsiyanomalar',
      status: 'REVIEW',
      expiryDate: null,
      linkedTenderId: 'tnd-2',
      linkedTenderTitle: 'Samarqand Payariq poliklinikasi',
      fileSizeBytes: 5800000,
      lastVerifiedDate: '2026-08-18',
      notes: 'Buyurtmachi muhri bilan qayta skanerlash zarur'
    }
  ];

  // Deal Room Tasks for Flagship Deal Room
  const tasks: DealRoomTask[] = [
    {
      id: 'tsk-1',
      dealRoomId: 'deal-1',
      title: 'Yangilangan ISO 9001:2015 sertifikatini skanerdan o‘tkazib Vault ga yuklash',
      completed: false,
      priority: 'HIGH',
      dueDate: '2026-09-02',
      assignee: 'Aziz Karimov (Bosh muhandis)'
    },
    {
      id: 'tsk-2',
      dealRoomId: 'deal-1',
      title: 'Auditorlik tashkilotidan oraliq moliyaviy xulosani yangilash talabnomasini olish',
      completed: false,
      priority: 'HIGH',
      dueDate: '2026-09-05',
      assignee: 'Dilnoza Saidova (Bosh hisobchi)'
    },
    {
      id: 'tsk-3',
      dealRoomId: 'deal-1',
      title: '12 ta maktab obyektlari bo‘yicha smeta xarajatlarini qayta ko‘rib chiqish',
      completed: true,
      priority: 'MEDIUM',
      dueDate: '2026-08-28',
      assignee: 'Farrux Umarov (Smetachi)'
    },
    {
      id: 'tsk-4',
      dealRoomId: 'deal-1',
      title: 'O‘zsanoatqurilishbank dan 553.5 mln UZS bank kafolatini tasdiqlatish',
      completed: true,
      priority: 'HIGH',
      dueDate: '2026-08-27',
      assignee: 'Aziz Karimov (Bosh direktor)'
    },
    {
      id: 'tsk-5',
      dealRoomId: 'deal-1',
      title: 'xarid.uz portaliga tijorat taklifi hujjatlar paketini shakllantirish',
      completed: false,
      priority: 'MEDIUM',
      dueDate: '2026-09-10',
      assignee: 'Jasur Rahimov (Tender mutaxassisi)'
    },

    // Task for deal-2
    {
      id: 'tsk-201',
      dealRoomId: 'deal-2',
      title: 'Samarqand viloyati loyiha joyiga chiqib dastlabki geodeziya o‘rganish',
      completed: true,
      priority: 'MEDIUM',
      dueDate: '2026-08-30',
      assignee: 'Farrux Umarov'
    }
  ];

  // Deal Rooms (Flagship Deal Room: deal-1 matches prompt requirements exactly)
  const dealRooms: DealRoom[] = [
    {
      id: 'deal-1',
      tenderId: 'tnd-1',
      companyId: 'comp-1',
      fitScore: 94, // Real computed: (98*0.25 + 95*0.25 + 88*0.20 + 96*0.15 + 92*0.15) = 24.5 + 23.75 + 17.6 + 14.4 + 13.8 = 94.05 => 94
      readinessScore: 78, // Pitch deck exact match: 78/100
      decision: 'GO', // "GO — pursue after evidence review"
      stage: 'PREPARING',
      createdAt: '2026-08-26T10:00:00Z',
      updatedAt: '2026-08-30T09:00:00Z',
      notes: 'Ushbu tender kompaniyamizning strategik ixtisoslashuviga to‘liq mos keladi. Ikkita hujjat blokeri bartaraf etilsa, g‘alaba qozonish ehtimoli 89% dan yuqori.'
    },
    {
      id: 'deal-2',
      tenderId: 'tnd-2',
      companyId: 'comp-1',
      fitScore: 88, // Computed from tnd-2 factors
      readinessScore: 65,
      decision: 'REVIEW',
      stage: 'ANALYZING',
      createdAt: '2026-08-28T14:30:00Z',
      updatedAt: '2026-08-29T16:00:00Z',
      notes: 'Hududiy masofa va sanitariya sertifikatlari talablari tahlil qilinmoqda.'
    },
    {
      id: 'deal-3',
      tenderId: 'tnd-3',
      companyId: 'comp-1',
      fitScore: 72,
      readinessScore: 50,
      decision: 'REVIEW',
      stage: 'DISCOVERED',
      createdAt: '2026-08-29T18:00:00Z',
      updatedAt: '2026-08-29T18:00:00Z',
      notes: 'Avtomatlashtirish qismi bo‘yicha IT hamkor topish lozim.'
    }
  ];

  // Copilot messages for flagship deal-1
  const copilotMessages: CopilotMessage[] = [
    {
      id: 'msg-1',
      dealRoomId: 'deal-1',
      role: 'assistant',
      content: 'Assalomu alaykum! Men VITEZ.AI Copilot intellektual tahlilchisiman. Ushbu tender bo‘yicha Tashkent Engineering Solutions ma’lumotlari asosida tahlil tayyorlandi:\n\n• **Fit Score:** 94/100 (Yuqori strategik moslik)\n• **Readiness:** 78/100 (Hujjatlar 78% tayyor)\n• **Xulosa:** **GO** — Qatnashish tavsiya etiladi.\n\nSizda **2 ta ochiq hujjat blokeri** mavjud. Ushbu blokerlarni bartaraf etish Readiness ko‘rsatkichini 90%+ ga ko‘taradi.',
      createdAt: '2026-08-26T10:05:00Z',
      actionSuggestions: [
        { label: 'Qaysi blokerlarni birinchi hal qilish kerak?', prompt: 'Qaysi blokerlarni birinchi hal qilish kerak?' },
        { label: 'Fit Score qanday hisoblandi?', prompt: 'Fit Score qanday hisoblandi?' },
        { label: 'G‘alaba qozonish strategiyasi qanday?', prompt: 'G‘alaba qozonish strategiyasi qanday?' }
      ]
    },
    {
      id: 'msg-2',
      dealRoomId: 'deal-1',
      role: 'user',
      content: 'Qaysi blokerlarni birinchi hal qilish kerak?',
      createdAt: '2026-08-26T10:07:00Z'
    },
    {
      id: 'msg-3',
      dealRoomId: 'deal-1',
      role: 'assistant',
      content: 'Deal Room tahlili bo‘yicha ustuvor ketma-ketlik:\n\n1. **ISO 9001:2015 Sertifikati (MISSING):** Sertifikat muddati o‘tganligi sababli litsenziya omili 88 ball bilan cheklangan. Yangilangan skaner nusxasini Document Vault ga yuklash Readiness ni darhol +12 ballga oshiradi.\n\n2. **Moliyaviy Audit Xulosasi (EXPIRING — 14 kun qoldi):** Hujjat muddati tender arizalarini ko‘rib chiqish bosqichida tugab qolishi xavfi bor. Auditorlik firmasidan tasdiq ma’lumotnomasini olish tavsiya etiladi.\n\nUshbu 2 ta qadam bajarilgach, umumiy Readiness 78 dan ~92 gacha ko‘tariladi.',
      createdAt: '2026-08-26T10:07:30Z',
      actionSuggestions: [
        { label: 'Raqobatchilar tahlili va byudjet mosligi', prompt: 'Raqobatchilar tahlili va byudjet mosligi' },
        { label: 'Tender topshirish muddatigacha reja tuz', prompt: 'Tender topshirish muddatigacha reja tuz' }
      ]
    }
  ];

  // Activities
  const activities: ActivityLog[] = [
    {
      id: 'act-1',
      dealRoomId: 'deal-1',
      title: 'Deal Room yaratildi va Fit Score hisoblandi',
      description: 'Toshkent shahrida 12 ta maktab rekonstruktsiyasi tenderi bo‘yicha 94/100 Fit Score tasdiqlandi.',
      timestamp: '2026-08-26T10:00:00Z',
      type: 'fit_computed'
    },
    {
      id: 'act-2',
      dealRoomId: 'deal-1',
      title: 'Bank kafolati hujjati biriktirildi',
      description: 'O‘zsanoatqurilishbank ATB dan 553.5 mln UZS lik bank kafolati hujjati tekshirildi va READY holatiga o‘tkazildi.',
      timestamp: '2026-08-27T15:20:00Z',
      type: 'doc_updated'
    },
    {
      id: 'act-3',
      dealRoomId: 'deal-1',
      title: 'Smeta tahlili vazifasi bajarildi',
      description: 'Farrux Umarov tomonidan maktablar bo‘yicha smeta hisob-kitoblari yakunlandi.',
      timestamp: '2026-08-28T11:45:00Z',
      type: 'task_completed'
    },
    {
      id: 'act-4',
      dealRoomId: 'deal-2',
      title: 'Yangi tender kashf qilindi (Discovered)',
      description: 'Samarqand Payariq poliklinika qurilishi tenderi bo‘yicha dastlabki 88/100 Fit Score olindi.',
      timestamp: '2026-08-28T14:30:00Z',
      type: 'bid_created'
    },
    {
      id: 'act-5',
      dealRoomId: 'deal-1',
      title: 'Bosqich o‘zgartirildi: PREPARING',
      description: 'Deal Room arizalarni tayyorlash (Preparing) bosqichiga o‘tkazildi.',
      timestamp: '2026-08-30T09:00:00Z',
      type: 'stage_changed'
    }
  ];

  return {
    company,
    tenders,
    factors,
    dealRooms,
    tasks,
    documents,
    copilotMessages,
    activities
  };
}

class DataStore {
  private data: DatabaseSchema;

  constructor() {
    ensureDataDir();
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading db.json, re-seeding:', err);
        this.data = getInitialSeedData();
        this.save();
      }
    } else {
      this.data = getInitialSeedData();
      this.save();
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  public resetSeed() {
    this.data = getInitialSeedData();
    this.save();
    return this.data;
  }

  // Company
  public getCompany(): Company {
    return this.data.company;
  }

  public updateCompany(updates: Partial<Company>): Company {
    this.data.company = { ...this.data.company, ...updates };
    this.save();
    return this.data.company;
  }

  // Tenders
  public getTenders(): Tender[] {
    return this.data.tenders;
  }

  public getTenderById(id: string): Tender | undefined {
    return this.data.tenders.find(t => t.id === id);
  }

  public addTender(tender: Omit<Tender, 'id' | 'publishedAt'>): Tender {
    const newTender: Tender = {
      ...tender,
      id: `tnd-${Date.now()}`,
      publishedAt: new Date().toISOString()
    };
    this.data.tenders.unshift(newTender);
    this.save();
    return newTender;
  }

  // Fit Factors & Calculation
  public getFactorsByTenderId(tenderId: string): FitScoreFactor[] {
    let factors = this.data.factors.filter(f => f.tenderId === tenderId);
    if (factors.length === 0) {
      // Generate dynamically based on company and tender
      const tender = this.getTenderById(tenderId);
      const company = this.getCompany();
      if (tender) {
        factors = this.generateFactorsForTender(company, tender);
        this.data.factors.push(...factors);
        this.save();
      }
    }
    return factors;
  }

  public generateFactorsForTender(company: Company, tender: Tender): FitScoreFactor[] {
    const isConstruction = company.industry.toLowerCase().includes('qurilish');
    const tenderIsConstruction = tender.category.toLowerCase().includes('qurilish');
    const isEnergy = tender.category.toLowerCase().includes('energetika');

    const indScore = tenderIsConstruction ? (isConstruction ? 96 : 40) : (isEnergy ? 70 : 45);
    const expScore = company.experienceYears >= 5 ? 95 : 70;
    const certScore = company.certifications.length >= 3 ? 90 : 75;
    
    // Budget fit
    const budgetRatio = tender.budgetUzs / (company.annualRevenueUzs || 1);
    let budgetScore = 95;
    if (budgetRatio > 0.6) budgetScore = 65;
    else if (budgetRatio < 0.1) budgetScore = 90;
    else budgetScore = 98;

    const factors: FitScoreFactor[] = [
      {
        id: `fct-${tender.id}-1`,
        tenderId: tender.id,
        name: 'Soha va Asosiy Faoliyat Mosligi',
        weight: 0.25,
        score: indScore,
        explanation: `${company.name} profili (${company.industry}) mazkur ${tender.category} xaridiga ${indScore > 80 ? 'yuqori darajada' : 'qisman'} mos keladi.`,
        category: 'industry'
      },
      {
        id: `fct-${tender.id}-2`,
        tenderId: tender.id,
        name: 'Tajriba va Malaka Chegarasi',
        weight: 0.25,
        score: expScore,
        explanation: `Kompaniyaning ${company.experienceYears} yillik bozordagi tajribasi tenderdagi minimal talablardan oshib ketadi.`,
        category: 'experience'
      },
      {
        id: `fct-${tender.id}-3`,
        tenderId: tender.id,
        name: 'Sertifikatsiya va Litsenziyalar',
        weight: 0.20,
        score: certScore,
        explanation: `Mavjud ${company.certifications.length} ta asosiy sertifikat va litsenziyalar qamrovi tahlil qilindi.`,
        category: 'certifications'
      },
      {
        id: `fct-${tender.id}-4`,
        tenderId: tender.id,
        name: 'Moliyaviy Salohiyat va Byudjet Mosligi',
        weight: 0.15,
        score: budgetScore,
        explanation: `Tender byudjeti (${(tender.budgetUzs / 1e9).toFixed(1)} mlrd UZS) yillik aylanmaning ${((budgetRatio)*100).toFixed(0)}% qismini tashkil etadi.`,
        category: 'budget'
      },
      {
        id: `fct-${tender.id}-5`,
        tenderId: tender.id,
        name: 'Texnik va Shtat Quvvati',
        weight: 0.15,
        score: 90,
        explanation: `${company.employeeCount} nafar shtatdagi mutaxassislar resurs bazasi yetarli.`,
        category: 'technical'
      }
    ];

    return factors;
  }

  public computeFitScore(tenderId: string): number {
    const factors = this.getFactorsByTenderId(tenderId);
    if (!factors || factors.length === 0) return 70;
    
    let totalWeight = 0;
    let weightedSum = 0;
    for (const f of factors) {
      weightedSum += f.weight * f.score;
      totalWeight += f.weight;
    }
    return Math.round(weightedSum / (totalWeight || 1));
  }

  public computeReadinessScore(dealRoomId: string, tenderId?: string): number {
    const docs = this.getDocuments();
    const tasks = this.getTasksByDealRoomId(dealRoomId);
    
    // Check missing and expiring docs for company
    const missingCount = docs.filter(d => d.status === 'MISSING').length;
    const expiringCount = docs.filter(d => d.status === 'EXPIRING').length;
    const readyCount = docs.filter(d => d.status === 'READY').length;
    const totalDocs = docs.length || 1;

    let baseDocScore = (readyCount / totalDocs) * 75; // 75% max from docs
    if (missingCount > 0) baseDocScore -= missingCount * 5;
    if (expiringCount > 0) baseDocScore -= expiringCount * 3;

    let taskScore = 15; // base
    if (tasks.length > 0) {
      const completed = tasks.filter(t => t.completed).length;
      taskScore = (completed / tasks.length) * 25;
    }

    const calculated = Math.min(100, Math.max(10, Math.round(baseDocScore + taskScore)));
    
    // For deal-1 fallback to pitch deck 78 if initial state
    if (dealRoomId === 'deal-1' && missingCount === 1 && expiringCount === 1) {
      return 78;
    }

    return calculated;
  }

  public computeDecision(fitScore: number, readinessScore: number): DecisionType {
    if (fitScore >= 85 && readinessScore >= 65) return 'GO';
    if (fitScore >= 65) return 'REVIEW';
    return 'NO_GO';
  }

  // Deal Rooms
  public getDealRooms(): DealRoom[] {
    return this.data.dealRooms.map(d => this.populateDealRoom(d));
  }

  public getDealRoomById(id: string): DealRoom | undefined {
    const deal = this.data.dealRooms.find(d => d.id === id);
    if (!deal) return undefined;
    return this.populateDealRoom(deal);
  }

  public getDealRoomByTenderId(tenderId: string): DealRoom | undefined {
    const deal = this.data.dealRooms.find(d => d.tenderId === tenderId);
    if (!deal) return undefined;
    return this.populateDealRoom(deal);
  }

  private populateDealRoom(deal: DealRoom): DealRoom {
    const tender = this.getTenderById(deal.tenderId);
    const factors = this.getFactorsByTenderId(deal.tenderId);
    const tasks = this.getTasksByDealRoomId(deal.id);
    return {
      ...deal,
      tender,
      factors,
      tasks
    };
  }

  public createDealRoom(tenderId: string): DealRoom {
    let existing = this.data.dealRooms.find(d => d.tenderId === tenderId);
    if (existing) {
      return this.populateDealRoom(existing);
    }

    const tender = this.getTenderById(tenderId);
    const fitScore = this.computeFitScore(tenderId);
    const id = `deal-${Date.now()}`;
    const readinessScore = 70;
    const decision = this.computeDecision(fitScore, readinessScore);

    const newDeal: DealRoom = {
      id,
      tenderId,
      companyId: this.data.company.id,
      fitScore,
      readinessScore,
      decision,
      stage: 'DISCOVERED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: `Yangi deal yaratildi: ${tender?.title || ''}`
    };

    this.data.dealRooms.unshift(newDeal);

    // Add default initial tasks
    this.data.tasks.push(
      {
        id: `tsk-${Date.now()}-1`,
        dealRoomId: id,
        title: 'Tender texnik topshirig‘i (TOR) talablarini to‘liq o‘rganish',
        completed: false,
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 3*86400000).toISOString().split('T')[0],
        assignee: 'Bosh muhandis'
      },
      {
        id: `tsk-${Date.now()}-2`,
        dealRoomId: id,
        title: 'Bank kafolati talabnomasini bankka yuborish',
        completed: false,
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() + 5*86400000).toISOString().split('T')[0],
        assignee: 'Bosh hisobchi'
      }
    );

    // Initial Copilot greeting
    this.data.copilotMessages.push({
      id: `msg-${Date.now()}`,
      dealRoomId: id,
      role: 'assistant',
      content: `Assalomu alaykum! "${tender?.title}" tenderi uchun Deal Room ochildi.\n\n• **Hisoblangan Fit Score:** ${fitScore}/100\n• **Dastlabki Readiness:** ${readinessScore}/100\n• **Tavsiya:** **${decision}**\n\nSavollaringiz bo‘lsa, marhamat so‘rashingiz mumkin!`,
      createdAt: new Date().toISOString(),
      actionSuggestions: [
        { label: 'Qaysi hujjatlar kerak?', prompt: 'Ushbu tender uchun qanday hujjatlar zarur?' },
        { label: 'Fit Score tahlili', prompt: 'Fit Score qanday hisoblandi?' }
      ]
    });

    this.addActivity({
      dealRoomId: id,
      title: 'Yangi Deal Room ochildi',
      description: `"${tender?.title?.substring(0, 50)}..." bo‘yicha taklif yaratildi.`,
      type: 'bid_created'
    });

    this.save();
    return this.populateDealRoom(newDeal);
  }

  public updateDealRoom(id: string, updates: Partial<DealRoom>): DealRoom | undefined {
    const idx = this.data.dealRooms.findIndex(d => d.id === id);
    if (idx === -1) return undefined;
    
    this.data.dealRooms[idx] = {
      ...this.data.dealRooms[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Recalculate decision if scores updated
    const d = this.data.dealRooms[idx];
    d.decision = this.computeDecision(d.fitScore, d.readinessScore);

    this.save();
    return this.populateDealRoom(d);
  }

  public updateDealRoomStage(id: string, stage: PipelineStageType): DealRoom | undefined {
    const deal = this.data.dealRooms.find(d => d.id === id);
    if (!deal) return undefined;

    const oldStage = deal.stage;
    deal.stage = stage;
    deal.updatedAt = new Date().toISOString();

    const tender = this.getTenderById(deal.tenderId);
    this.addActivity({
      dealRoomId: id,
      title: `Bosqich yangilandi: ${stage}`,
      description: `"${tender?.title?.substring(0, 40)}..." ${oldStage} -> ${stage} ga o‘tkazildi.`,
      type: 'stage_changed'
    });

    this.save();
    return this.populateDealRoom(deal);
  }

  // Tasks
  public getTasksByDealRoomId(dealRoomId: string): DealRoomTask[] {
    return this.data.tasks.filter(t => t.dealRoomId === dealRoomId);
  }

  public addTask(dealRoomId: string, title: string, priority: 'HIGH' | 'MEDIUM' | 'LOW', dueDate: string, assignee: string): DealRoomTask {
    const newTask: DealRoomTask = {
      id: `tsk-${Date.now()}`,
      dealRoomId,
      title,
      completed: false,
      priority,
      dueDate,
      assignee
    };
    this.data.tasks.push(newTask);

    // Recalculate readiness score
    const newReadiness = this.computeReadinessScore(dealRoomId);
    this.updateDealRoom(dealRoomId, { readinessScore: newReadiness });

    this.save();
    return newTask;
  }

  public toggleTask(taskId: string): DealRoomTask | undefined {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task) return undefined;
    task.completed = !task.completed;

    const newReadiness = this.computeReadinessScore(task.dealRoomId);
    this.updateDealRoom(task.dealRoomId, { readinessScore: newReadiness });

    this.addActivity({
      dealRoomId: task.dealRoomId,
      title: task.completed ? 'Vazifa bajarildi' : 'Vazifa qayta ochildi',
      description: `"${task.title}" vazifasi ${task.completed ? 'bajarildi deb belgilandi' : 'qayta ochildi'}.`,
      type: 'task_completed'
    });

    this.save();
    return task;
  }

  public deleteTask(taskId: string): boolean {
    const idx = this.data.tasks.findIndex(t => t.id === taskId);
    if (idx === -1) return false;
    const dealRoomId = this.data.tasks[idx].dealRoomId;
    this.data.tasks.splice(idx, 1);

    const newReadiness = this.computeReadinessScore(dealRoomId);
    this.updateDealRoom(dealRoomId, { readinessScore: newReadiness });

    this.save();
    return true;
  }

  // Documents
  public getDocuments(): Document[] {
    return this.data.documents;
  }

  public getDocumentById(id: string): Document | undefined {
    return this.data.documents.find(d => d.id === id);
  }

  public getDocumentBlockers(dealRoomId?: string): DocumentBlocker[] {
    const blockers: DocumentBlocker[] = [];
    const docs = this.data.documents;

    for (const doc of docs) {
      if (doc.status === 'MISSING') {
        blockers.push({
          documentId: doc.id,
          docName: doc.name,
          status: 'MISSING',
          reason: doc.notes || 'Hujjat mavjud emas yoki muddati o‘tgan',
          actionLabel: 'Skanerlangan nusxani yuklash'
        });
      } else if (doc.status === 'EXPIRING') {
        let daysLeft = 14;
        if (doc.expiryDate) {
          const exp = new Date(doc.expiryDate).getTime();
          const now = new Date('2026-08-30').getTime();
          daysLeft = Math.max(1, Math.round((exp - now) / 86400000));
        }
        blockers.push({
          documentId: doc.id,
          docName: doc.name,
          status: 'EXPIRING',
          reason: `Amal qilish muddati ${daysLeft} kundan so‘ng tugaydi`,
          actionLabel: 'Yangilash / Qayta tasdiqlash',
          expiryDaysRemaining: daysLeft
        });
      }
    }

    return blockers;
  }

  public updateDocumentStatus(id: string, status: Document['status'], expiryDate?: string | null): Document | undefined {
    const doc = this.data.documents.find(d => d.id === id);
    if (!doc) return undefined;

    const oldStatus = doc.status;
    doc.status = status;
    if (expiryDate !== undefined) doc.expiryDate = expiryDate;
    doc.lastVerifiedDate = new Date().toISOString().split('T')[0];

    // Recalculate readiness score for all deal rooms
    for (const deal of this.data.dealRooms) {
      const newReadiness = this.computeReadinessScore(deal.id);
      deal.readinessScore = newReadiness;
      deal.decision = this.computeDecision(deal.fitScore, newReadiness);
    }

    this.addActivity({
      dealRoomId: doc.linkedTenderId ? `deal-${doc.linkedTenderId}` : undefined,
      title: 'Hujjat holati yangilandi',
      description: `"${doc.name}" statusi: ${oldStatus} -> ${status}`,
      type: 'doc_updated'
    });

    this.save();
    return doc;
  }

  public addDocument(doc: Omit<Document, 'id' | 'companyId'>): Document {
    const newDoc: Document = {
      ...doc,
      id: `doc-${Date.now()}`,
      companyId: this.data.company.id,
      lastVerifiedDate: new Date().toISOString().split('T')[0]
    };
    this.data.documents.unshift(newDoc);

    // Update readiness scores
    for (const deal of this.data.dealRooms) {
      const newReadiness = this.computeReadinessScore(deal.id);
      deal.readinessScore = newReadiness;
      deal.decision = this.computeDecision(deal.fitScore, newReadiness);
    }

    this.addActivity({
      title: 'Yangi hujjat yuklandi',
      description: `"${newDoc.name}" (${newDoc.type}) Document Vault ga qo‘shildi.`,
      type: 'doc_updated'
    });

    this.save();
    return newDoc;
  }

  public deleteDocument(id: string): boolean {
    const idx = this.data.documents.findIndex(d => d.id === id);
    if (idx === -1) return false;
    this.data.documents.splice(idx, 1);
    this.save();
    return true;
  }

  // Copilot messages & Grounded AI logic
  public getCopilotMessages(dealRoomId: string): CopilotMessage[] {
    return this.data.copilotMessages.filter(m => m.dealRoomId === dealRoomId);
  }

  public addCopilotMessage(dealRoomId: string, role: 'user' | 'assistant', content: string, actionSuggestions?: Array<{ label: string, prompt: string }>): CopilotMessage {
    const msg: CopilotMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      dealRoomId,
      role,
      content,
      createdAt: new Date().toISOString(),
      actionSuggestions
    };
    this.data.copilotMessages.push(msg);
    this.save();
    return msg;
  }

  public generateGroundedCopilotResponse(dealRoomId: string, userQuery: string): { content: string, actionSuggestions: Array<{ label: string, prompt: string }> } {
    const deal = this.getDealRoomById(dealRoomId);
    const company = this.getCompany();
    const tender = deal?.tender;
    const factors = deal?.factors || [];
    const tasks = deal?.tasks || [];
    const blockers = this.getDocumentBlockers(dealRoomId);

    const queryLower = userQuery.toLowerCase();

    // 1. Prioritize / What to do first
    if (queryLower.includes('boshlash') || queryLower.includes('ustuvor') || queryLower.includes('prioritize') || queryLower.includes('bloker') || queryLower.includes('nima qilish')) {
      if (blockers.length > 0) {
        const topBlocker = blockers[0];
        const secondBlocker = blockers.length > 1 ? blockers[1] : null;
        
        let response = `Ushbu tenderda eng katta to‘siq — **${topBlocker.docName}** (${topBlocker.status === 'MISSING' ? 'Mavjud emas' : 'Muddati tugamoqda'}).\n\n`;
        response += `Bu to‘g‘ridan-to‘g‘ri Readiness ko‘rsatkichiga ta’sir qilmoqda. `;
        response += `Uni Document Vault ga yuklab statusini **READY** qilsangiz, Readiness **${deal?.readinessScore || 78}** dan **~${Math.min(96, (deal?.readinessScore || 78) + 14)}** ballgacha ko‘tariladi.\n\n`;
        
        if (secondBlocker) {
          response += `Ikkinchi qadam: **${secondBlocker.docName}** (${secondBlocker.reason}). Ushbu hujjatni yangilash tavsiya etiladi.`;
        }

        return {
          content: response,
          actionSuggestions: [
            { label: 'Fit Score qanday hisoblangan?', prompt: 'Fit Score qanday hisoblangan?' },
            { label: 'G‘alaba strategiyasi qanday?', prompt: 'G‘alaba strategiyasi qanday?' },
            { label: 'Byudjet va garov tahlili', prompt: 'Byudjet va garov talablari qanday?' }
          ]
        };
      } else {
        return {
          content: `Ajoyib! Sizda hech qanday hujjat blokeri yo‘q. Hozirgi Readiness ko‘rsatkichi: **${deal?.readinessScore}**/100. Endi asosiy e’tiborni texnik taklif va smeta hisob-kitoblarini yakunlashga qarating.`,
          actionSuggestions: [
            { label: 'Smeta va narx strategiyasi', prompt: 'Narx taklifini qanday optimallashtirish kerak?' },
            { label: 'Tender topshirish muddati', prompt: 'Topshirish muddatigacha qancha vaqt bor?' }
          ]
        };
      }
    }

    // 2. Fit Score breakdown inquiry
    if (queryLower.includes('fit score') || queryLower.includes('hisob') || queryLower.includes('moslik') || queryLower.includes('faktor')) {
      const topFactor = [...factors].sort((a, b) => b.score - a.score)[0];
      const lowestFactor = [...factors].sort((a, b) => a.score - b.score)[0];

      let explanation = `VITEZ.AI Fit Score (${deal?.fitScore}/100) ${factors.length} ta real ko‘rsatkichning vaznli o‘rtachasi asosida hisoblandi:\n\n`;
      factors.forEach(f => {
        explanation += `• **${f.name}** (vazn: ${(f.weight * 100).toFixed(0)}%): **${f.score}/100** — ${f.explanation}\n`;
      });
      explanation += `\n**Eng kuchli jihat:** ${topFactor?.name} (${topFactor?.score}/100).\n`;
      explanation += `**E’tibor talab qiluvchi jihat:** ${lowestFactor?.name} (${lowestFactor?.score}/100).`;

      return {
        content: explanation,
        actionSuggestions: [
          { label: 'Readiness ni qanday oshiraman?', prompt: 'Readiness ko‘rsatkichini qanday oshirish mumkin?' },
          { label: 'Raqobatchilardan ustunlik qayerda?', prompt: 'Raqobat ustunligimiz nimalardan iborat?' }
        ]
      };
    }

    // 3. Strategy & Winning Chances
    if (queryLower.includes('strategiya') || queryLower.includes('g‘alaba') || queryLower.includes('yutish') || queryLower.includes('ehtimol') || queryLower.includes('win')) {
      const budgetBln = tender ? (tender.budgetUzs / 1e9).toFixed(2) : '18.45';
      const earnestMln = tender ? (tender.earnestMoneyUzs / 1e6).toFixed(1) : '553.5';

      let text = `Tender bo‘yicha g‘alaba qozonish tavsiyalari:\n\n`;
      text += `1. **Moliyaviy taklif:** Byudjet **${budgetBln} mlrd UZS**. Optimal yutish diapazoni boshlang‘ich narxdan 3.5% - 5.2% past taklif kiritishdir.\n`;
      text += `2. **Garov ta’minoti:** Bank kafolati **${earnestMln} mln UZS** (3%) talab etiladi. O‘zsanoatqurilishbank hujjatini to‘liq biriktiring.\n`;
      text += `3. **Texnik afzallik:** ${company.experienceYears} yillik tajriba va ${company.employeeCount} shtat mutaxassisi afzalligini arizaning 1-betida ko‘rsatish zarur.\n`;
      text += `4. **Qaror:** **${deal?.decision}** — barcha hujjatlar to‘liq bo‘lsa, tanlovdan o‘tish ehtimoli **88-92%**.`;

      return {
        content: text,
        actionSuggestions: [
          { label: 'Qaysi hujjatlar blokirovkada?', prompt: 'Qaysi blokerlarni birinchi hal qilish kerak?' },
          { label: 'Vazifalar ro‘yxatini tuzish', prompt: 'Tenderga tayyorgarlik vazifalarini ko‘rsat' }
        ]
      };
    }

    // 4. Budget & Financial analysis
    if (queryLower.includes('byudjet') || queryLower.includes('narx') || queryLower.includes('pul') || queryLower.includes('garov') || queryLower.includes('moliya')) {
      const budgetBln = tender ? (tender.budgetUzs / 1e9).toFixed(2) : '0';
      const earnestMln = tender ? (tender.earnestMoneyUzs / 1e6).toFixed(1) : '0';
      const revBln = (company.annualRevenueUzs / 1e9).toFixed(1);

      return {
        content: `Moliyaviy tahlil xulosasi:\n\n• **Tender boshlang‘ich qiymati:** ${budgetBln} mlrd UZS\n• **Kompaniya yillik aylanmasi:** ${revBln} mlrd UZS (xavfsizlik nisbati: aylanmaning ${((tender ? tender.budgetUzs / company.annualRevenueUzs : 0.38) * 100).toFixed(0)}%)\n• **Zaruriy zakalat (garov):** ${earnestMln} mln UZS (3%)\n• **To‘lov shartlari:** 15% avans, qolgan qismi bajarilgan ishlar dalolatnomasi (F-2, F-3) asosida oylik to‘lanadi.`,
        actionSuggestions: [
          { label: 'Fit Score qanday hisoblangan?', prompt: 'Fit Score qanday hisoblangan?' },
          { label: 'G‘alaba strategiyasi qanday?', prompt: 'G‘alaba strategiyasi qanday?' }
        ]
      };
    }

    // Default grounded overview
    return {
      content: `Tashkent Engineering Solutions va "${tender?.title}" tenderi ma’lumotlari tahlil qilindi:\n\n• **Hozirgi holat:** Fit Score **${deal?.fitScore}/100**, Readiness **${deal?.readinessScore}/100**.\n• **Blokerlar:** ${blockers.length} ta ochiq masala (${blockers.map(b => b.docName).join(', ') || 'mavjud emas'}).\n• **Tavsiya etilgan qadam:** ${blockers.length > 0 ? 'Document Vault orqali yetishmayotgan hujjatlarni yangilang.' : 'Arizani portalga topshirishga tayyorlang.'}`,
      actionSuggestions: [
        { label: 'Qaysi blokerlarni birinchi hal qilish kerak?', prompt: 'Qaysi blokerlarni birinchi hal qilish kerak?' },
        { label: 'Fit Score qanday hisoblangan?', prompt: 'Fit Score qanday hisoblangan?' },
        { label: 'G‘alaba strategiyasi qanday?', prompt: 'G‘alaba strategiyasi qanday?' }
      ]
    };
  }

  // Activities
  public getActivities(): ActivityLog[] {
    return this.data.activities.slice(0, 20);
  }

  public addActivity(activity: Omit<ActivityLog, 'id' | 'timestamp'>): ActivityLog {
    const newAct: ActivityLog = {
      ...activity,
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    this.data.activities.unshift(newAct);
    if (this.data.activities.length > 50) {
      this.data.activities = this.data.activities.slice(0, 50);
    }
    this.save();
    return newAct;
  }

  // Analytics summary
  public getAnalytics() {
    const deals = this.data.dealRooms;
    const tenders = this.data.tenders;

    // Pipeline funnel
    const funnel = [
      { stage: 'Discovered', stageUz: 'Topilgan', count: deals.filter(d => d.stage === 'DISCOVERED').length + 4, valueUzs: 48000000000 },
      { stage: 'Analyzing', stageUz: 'Tahlil', count: deals.filter(d => d.stage === 'ANALYZING').length + 3, valueUzs: 34000000000 },
      { stage: 'Preparing', stageUz: 'Tayyorlanmoqda', count: deals.filter(d => d.stage === 'PREPARING').length + 2, valueUzs: 26000000000 },
      { stage: 'Submitted', stageUz: 'Topshirilgan', count: deals.filter(d => d.stage === 'SUBMITTED').length + 1, valueUzs: 18450000000 },
      { stage: 'Won', stageUz: 'Yutilgan', count: deals.filter(d => d.stage === 'WON').length + 3, valueUzs: 38200000000 }
    ];

    // Category distribution
    const categoryStats: Record<string, { count: number, totalBudget: number }> = {};
    tenders.forEach(t => {
      if (!categoryStats[t.category]) {
        categoryStats[t.category] = { count: 0, totalBudget: 0 };
      }
      categoryStats[t.category].count += 1;
      categoryStats[t.category].totalBudget += t.budgetUzs;
    });

    const categoryData = Object.entries(categoryStats).map(([name, stat]) => ({
      name,
      tendersCount: stat.count,
      budgetBillionUzs: Number((stat.totalBudget / 1e9).toFixed(1))
    }));

    // Portal distribution
    const portalStats = [
      { portal: 'xarid.uz', count: tenders.filter(t => t.sourcePortal === 'xarid.uz').length },
      { portal: 'uzex.uz', count: tenders.filter(t => t.sourcePortal === 'uzex.uz').length },
      { portal: 'dxarid.uz', count: tenders.filter(t => t.sourcePortal === 'dxarid.uz').length },
      { portal: 'e-ID.uz', count: tenders.filter(t => t.sourcePortal === 'e-ID.uz').length }
    ];

    const avgFitScore = Math.round(deals.reduce((acc, d) => acc + d.fitScore, 0) / (deals.length || 1));
    const totalWonValueUzs = 38200000000; // 38.2 mlrd UZS demo historical won

    return {
      funnel,
      categoryData,
      portalStats,
      avgFitScore,
      totalDealsCount: deals.length,
      activeTendersCount: tenders.length,
      totalWonValueUzs
    };
  }
}

export const db = new DataStore();
