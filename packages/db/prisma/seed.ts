import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface Spec {
  label: string;
  value: string;
}

interface SeedProduct {
  nameUz: string;
  nameRu: string;
  nameEn: string;
  slug: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  category: string;
  brand: string;
  certificates: string[];
  industries: string[];
  badge: string | null;
  isFeatured: boolean;
  specifications: Spec[];
}

async function main() {
  console.log('🌱 Seeding Power Automation database...');

  await prisma.inquiry.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.newsPost.deleteMany();
  await prisma.project.deleteMany();
  await prisma.adminUser.deleteMany();

  // ---------------- Admin ----------------
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.adminUser.create({ data: { username: 'admin', password: passwordHash } });
  console.log('✅ Admin user created (admin / admin123)');

  // ---------------- Brands ----------------
  const brandData = [
    { name: 'Emerson', country: 'AQSh', website: 'https://www.emerson.com', logo: '/uploads/brands/emerson.svg' },
    { name: 'Yokogawa', country: 'Yaponiya', website: 'https://www.yokogawa.com', logo: '/uploads/brands/yokogawa.svg' },
    { name: 'ABB', country: 'Shveytsariya', website: 'https://www.abb.com', logo: '/uploads/brands/abb.svg' },
    { name: 'Endress+Hauser', country: 'Shveytsariya', website: 'https://www.endress.com', logo: '/uploads/brands/endress.svg' },
    { name: 'Honeywell', country: 'AQSh', website: 'https://www.honeywell.com', logo: '/uploads/brands/honeywell.svg' },
    { name: 'Siemens', country: 'Germaniya', website: 'https://www.siemens.com', logo: '/uploads/brands/siemens.svg' },
    { name: 'Bürkert', country: 'Germaniya', website: 'https://www.burkert.com', logo: '/uploads/brands/burkert.svg' },
  ];
  const brands: Record<string, number> = {};
  for (const b of brandData) {
    const created = await prisma.brand.create({ data: b });
    brands[b.name] = created.id;
  }
  console.log(`✅ ${brandData.length} brands created`);

  // ---------------- Categories ----------------
  const categoryTree = [
    {
      nameUz: 'KIP (Oʻlchov asboblari)', nameRu: 'КИП (Измерительные приборы)', nameEn: 'Instrumentation', slug: 'kip', icon: 'gauge',
      children: [
        { nameUz: 'Bosim oʻlchagichlar', nameRu: 'Датчики давления', nameEn: 'Pressure transmitters', slug: 'bosim-olchagichlar' },
        { nameUz: 'Sarf oʻlchagichlar', nameRu: 'Расходомеры', nameEn: 'Flow meters', slug: 'sarf-olchagichlar' },
        { nameUz: 'Harorat oʻlchagichlar', nameRu: 'Датчики температуры', nameEn: 'Temperature sensors', slug: 'harorat-olchagichlar' },
        { nameUz: 'Saviya oʻlchagichlar', nameRu: 'Уровнемеры', nameEn: 'Level sensors', slug: 'saviya-olchagichlar' },
        { nameUz: 'Analizatorlar', nameRu: 'Анализаторы', nameEn: 'Analyzers', slug: 'analizatorlar' },
      ],
    },
    {
      nameUz: 'Klapanlar va pnevmatika', nameRu: 'Клапаны и пневматика', nameEn: 'Valves & Pneumatics', slug: 'klapanlar-pnevmatika', icon: 'valve',
      children: [
        { nameUz: 'Boshqaruv klapanlari', nameRu: 'Регулирующие клапаны', nameEn: 'Control valves', slug: 'boshqaruv-klapanlari' },
        { nameUz: 'Pozitsionerlar', nameRu: 'Позиционеры', nameEn: 'Positioners', slug: 'pozitsionerlar' },
      ],
    },
    {
      nameUz: 'Avtomatlashtirish tizimlari', nameRu: 'Системы автоматизации', nameEn: 'Automation systems', slug: 'avtomatlashtirish', icon: 'cpu',
      children: [
        { nameUz: 'PLK kontrollerlar', nameRu: 'ПЛК контроллеры', nameEn: 'PLC controllers', slug: 'plk-kontrollerlar' },
        { nameUz: 'DCS tizimlari', nameRu: 'DCS системы', nameEn: 'DCS systems', slug: 'dcs-tizimlari' },
        { nameUz: 'SCADA dasturlari', nameRu: 'SCADA системы', nameEn: 'SCADA software', slug: 'scada-tizimlari' },
      ],
    },
    {
      nameUz: 'Xavfsizlik tizimlari', nameRu: 'Системы безопасности', nameEn: 'Safety systems', slug: 'xavfsizlik', icon: 'shield',
      children: [
        { nameUz: 'Gaz detektorlari', nameRu: 'Газоанализаторы', nameEn: 'Gas detectors', slug: 'gaz-detektorlari' },
        { nameUz: 'Yongʻin signalizatsiyasi', nameRu: 'Пожарная сигнализация', nameEn: 'Fire & gas systems', slug: 'yongin-signalizatsiya' },
      ],
    },
    {
      nameUz: 'Dasturiy taʼminot', nameRu: 'Программное обеспечение', nameEn: 'Software', slug: 'dasturiy-taminot', icon: 'code',
      children: [
        { nameUz: 'HMI/SCADA dasturlari', nameRu: 'HMI/SCADA ПО', nameEn: 'HMI/SCADA software', slug: 'hmi-scada' },
        { nameUz: 'Tarixiy maʼlumotlar (Historian)', nameRu: 'Historian', nameEn: 'Historian', slug: 'historian' },
      ],
    },
    {
      nameUz: 'Elektr uskunalar', nameRu: 'Электрооборудование', nameEn: 'Electrical equipment', slug: 'elektr-uskunalar', icon: 'bolt',
      children: [
        { nameUz: 'Chastotali oʻzgartirgichlar', nameRu: 'Частотные преобразователи', nameEn: 'Variable frequency drives', slug: 'chastotali-ozgartirgichlar' },
        { nameUz: 'Yumshoq ishga tushirgichlar', nameRu: 'Устройства плавного пуска', nameEn: 'Soft starters', slug: 'yumshoq-ishga-tushirgich' },
      ],
    },
  ];

  const catIds: Record<string, number> = {};
  let order = 0;
  for (const parent of categoryTree) {
    const p = await prisma.category.create({
      data: { nameUz: parent.nameUz, nameRu: parent.nameRu, nameEn: parent.nameEn, slug: parent.slug, icon: parent.icon, order: order++ },
    });
    catIds[parent.slug] = p.id;
    let childOrder = 0;
    for (const child of parent.children) {
      const c = await prisma.category.create({
        data: { nameUz: child.nameUz, nameRu: child.nameRu, nameEn: child.nameEn, slug: child.slug, parentId: p.id, order: childOrder++ },
      });
      catIds[child.slug] = c.id;
    }
  }
  console.log('✅ Categories created');

  // ---------------- Products ----------------
  const products: SeedProduct[] = [
    // ---- PRESSURE ----
    {
      nameUz: 'Yokogawa EJA110E differensial bosim transmitteri', nameRu: 'Yokogawa EJA110E преобразователь дифференциального давления', nameEn: 'Yokogawa EJA110E Differential Pressure Transmitter',
      slug: 'yokogawa-eja110e', category: 'bosim-olchagichlar', brand: 'Yokogawa', certificates: ['ATEX', 'IECEx', 'GOST'], industries: ['oil_gas', 'chemical'], badge: 'Sertifikatlangan', isFeatured: true,
      descriptionUz: 'DPharp sensori asosidagi yuqori aniqlikdagi differensial bosim transmitteri. ±0.04% aniqlik, HART/BRAIN.',
      descriptionRu: 'Высокоточный преобразователь дифференциального давления на сенсоре DPharp. Точность ±0.04%, HART/BRAIN.',
      descriptionEn: 'High-accuracy differential pressure transmitter based on the DPharp sensor. ±0.04% accuracy, HART/BRAIN protocol.',
      specifications: [
        { label: 'Oʻlchov diapazoni', value: '0.5 ... 100 kPa' }, { label: 'Aniqlik', value: '±0.04%' },
        { label: 'Chiqish signali', value: '4-20 mA + HART' }, { label: 'Ish harorati', value: '-40 ... +120 °C' },
        { label: 'Himoya darajasi', value: 'IP67' }, { label: 'Korpus materiali', value: '316L SS' },
      ],
    },
    {
      nameUz: 'Emerson Rosemount 3051S bosim transmitteri', nameRu: 'Emerson Rosemount 3051S преобразователь давления', nameEn: 'Emerson Rosemount 3051S Pressure Transmitter',
      slug: 'emerson-rosemount-3051s', category: 'bosim-olchagichlar', brand: 'Emerson', certificates: ['ATEX', 'IECEx', 'GOST', 'CE'], industries: ['oil_gas', 'chemical', 'energy'], badge: 'Koʻp buyurilgan', isFeatured: true,
      descriptionUz: 'Sanoat standarti. Coplanar texnologiyasi, ±0.025% aniqlik, 200:1 turndown.',
      descriptionRu: 'Промышленный стандарт. Технология Coplanar, точность ±0.025%, диапазон 200:1.',
      descriptionEn: 'Industry-standard transmitter. Coplanar technology, ±0.025% accuracy, 200:1 turndown.',
      specifications: [
        { label: 'Oʻlchov diapazoni', value: '0 ... 68.9 MPa' }, { label: 'Aniqlik', value: '±0.025%' },
        { label: 'Turndown', value: '200:1' }, { label: 'Chiqish', value: '4-20 mA HART / FOUNDATION Fieldbus' }, { label: 'Himoya', value: 'IP66/IP68' },
      ],
    },
    {
      nameUz: 'Endress+Hauser Cerabar PMP71B bosim transmitteri', nameRu: 'Endress+Hauser Cerabar PMP71B преобразователь давления', nameEn: 'Endress+Hauser Cerabar PMP71B Pressure Transmitter',
      slug: 'endress-cerabar-pmp71b', category: 'bosim-olchagichlar', brand: 'Endress+Hauser', certificates: ['ATEX', 'IECEx', 'GOST'], industries: ['chemical', 'oil_gas', 'food'], badge: 'Yangi', isFeatured: true,
      descriptionUz: 'Metall membranali absolyut va gauge bosim transmitteri. Heartbeat Technology bilan.',
      descriptionRu: 'Преобразователь абсолютного и избыточного давления с металлической мембраной. Heartbeat Technology.',
      descriptionEn: 'Absolute and gauge pressure transmitter with metallic diaphragm. Heartbeat Technology diagnostics.',
      specifications: [
        { label: 'Oʻlchov diapazoni', value: '0 ... 70 MPa' }, { label: 'Aniqlik', value: '±0.05%' },
        { label: 'Chiqish', value: '4-20 mA HART, PROFINET' }, { label: 'Ish harorati', value: '-40 ... +150 °C' }, { label: 'Himoya', value: 'IP66/68' },
      ],
    },
    {
      nameUz: 'Siemens SITRANS P320 bosim transmitteri', nameRu: 'Siemens SITRANS P320 преобразователь давления', nameEn: 'Siemens SITRANS P320 Pressure Transmitter',
      slug: 'siemens-sitrans-p320', category: 'bosim-olchagichlar', brand: 'Siemens', certificates: ['ATEX', 'IECEx', 'CE'], industries: ['oil_gas', 'chemical', 'energy'], badge: null, isFeatured: false,
      descriptionUz: 'SIL2/3 sertifikatlangan raqamli bosim transmitteri, gauge va absolyut versiyalarda.',
      descriptionRu: 'Цифровой преобразователь давления с сертификацией SIL2/3, избыточное и абсолютное исполнение.',
      descriptionEn: 'Digital pressure transmitter with SIL2/3 certification, gauge and absolute versions.',
      specifications: [
        { label: 'Diapazon', value: '0.01 ... 70 MPa' }, { label: 'Aniqlik', value: '±0.05%' },
        { label: 'Chiqish', value: '4-20 mA HART' }, { label: 'SIL', value: 'SIL2/SIL3' }, { label: 'Himoya', value: 'IP66/68' },
      ],
    },
    {
      nameUz: 'ABB 266HSH gidrostatik bosim transmitteri', nameRu: 'ABB 266HSH гидростатический преобразователь', nameEn: 'ABB 266HSH Hydrostatic Pressure Transmitter',
      slug: 'abb-266hsh', category: 'bosim-olchagichlar', brand: 'ABB', certificates: ['ATEX', 'IECEx', 'GOST'], industries: ['water', 'chemical'], badge: null, isFeatured: false,
      descriptionUz: 'Gidrostatik saviya va bosimni oʻlchash uchun. Diafragma seal opsiyalari bilan.',
      descriptionRu: 'Для измерения гидростатического уровня и давления. С опциями разделительных мембран.',
      descriptionEn: 'For hydrostatic level and pressure measurement. Available with diaphragm seal options.',
      specifications: [
        { label: 'Diapazon', value: '0 ... 4 MPa' }, { label: 'Aniqlik', value: '±0.04%' },
        { label: 'Chiqish', value: '4-20 mA HART, PROFIBUS PA' }, { label: 'Himoya', value: 'IP67' },
      ],
    },
    {
      nameUz: 'Yokogawa EJX910A multivariable transmitter', nameRu: 'Yokogawa EJX910A многопараметрический преобразователь', nameEn: 'Yokogawa EJX910A Multivariable Transmitter',
      slug: 'yokogawa-ejx910a', category: 'bosim-olchagichlar', brand: 'Yokogawa', certificates: ['ATEX', 'IECEx', 'GOST'], industries: ['oil_gas'], badge: null, isFeatured: false,
      descriptionUz: 'Differensial bosim, statik bosim va haroratni bir vaqtda oʻlchaydi. Massa sarfini hisoblaydi.',
      descriptionRu: 'Одновременно измеряет ДД, статическое давление и температуру. Вычисляет массовый расход.',
      descriptionEn: 'Simultaneously measures differential pressure, static pressure and temperature. Computes mass flow.',
      specifications: [
        { label: 'Oʻlchovlar', value: 'DP + SP + T (multivariable)' }, { label: 'Aniqlik', value: '±0.04%' },
        { label: 'Chiqish', value: '4-20 mA HART, FOUNDATION Fieldbus' }, { label: 'Himoya', value: 'IP66/67' },
      ],
    },
    // ---- FLOW ----
    {
      nameUz: 'Endress+Hauser Promass F 300 Coriolis sarf oʻlchagich', nameRu: 'Endress+Hauser Promass F 300 кориолисовый расходомер', nameEn: 'Endress+Hauser Promass F 300 Coriolis Flowmeter',
      slug: 'endress-promass-f300', category: 'sarf-olchagichlar', brand: 'Endress+Hauser', certificates: ['ATEX', 'IECEx', 'GOST'], industries: ['oil_gas', 'chemical', 'food'], badge: 'Yangi', isFeatured: true,
      descriptionUz: 'Coriolis prinsipidagi massa sarf oʻlchagich, ±0.05% aniqlik. Heartbeat Technology bilan.',
      descriptionRu: 'Массовый расходомер на принципе Кориолиса, точность ±0.05%. С Heartbeat Technology.',
      descriptionEn: 'Coriolis mass flowmeter, ±0.05% accuracy. With Heartbeat Technology diagnostics.',
      specifications: [
        { label: 'Prinsip', value: 'Coriolis (massa)' }, { label: 'Aniqlik', value: '±0.05%' }, { label: 'Diametr', value: 'DN 8 ... 250' },
        { label: 'Maks. bosim', value: '100 bar' }, { label: 'Chiqish', value: '4-20 mA HART, PROFIBUS, Modbus' }, { label: 'Harorat', value: '-50 ... +205 °C' },
      ],
    },
    {
      nameUz: 'Emerson Micro Motion 5700 Coriolis sarf oʻlchagich', nameRu: 'Emerson Micro Motion 5700 кориолисовый расходомер', nameEn: 'Emerson Micro Motion 5700 Coriolis Flowmeter',
      slug: 'emerson-micromotion-5700', category: 'sarf-olchagichlar', brand: 'Emerson', certificates: ['ATEX', 'IECEx', 'GOST'], industries: ['oil_gas', 'chemical'], badge: 'Koʻp buyurilgan', isFeatured: true,
      descriptionUz: 'Yuqori unumdorlikdagi Coriolis transmitteri. Smart Meter Verification bilan.',
      descriptionRu: 'Высокопроизводительный кориолисовый трансмиттер. Со Smart Meter Verification.',
      descriptionEn: 'High-performance Coriolis transmitter. With Smart Meter Verification.',
      specifications: [
        { label: 'Prinsip', value: 'Coriolis (massa/zichlik)' }, { label: 'Aniqlik', value: '±0.05%' },
        { label: 'Chiqish', value: '4-20 mA, Modbus, Ethernet/IP' }, { label: 'Display', value: '4-qatorli rangli LCD' }, { label: 'Himoya', value: 'IP66/67' },
      ],
    },
    {
      nameUz: 'Yokogawa AXG elektromagnit sarf oʻlchagich', nameRu: 'Yokogawa AXG электромагнитный расходомер', nameEn: 'Yokogawa AXG Magnetic Flowmeter',
      slug: 'yokogawa-axg-magnetic', category: 'sarf-olchagichlar', brand: 'Yokogawa', certificates: ['GOST', 'CE'], industries: ['water', 'chemical', 'food'], badge: null, isFeatured: false,
      descriptionUz: 'Oʻtkazuvchan suyuqliklar uchun elektromagnit sarf oʻlchagich. Dual frequency excitation.',
      descriptionRu: 'Электромагнитный расходомер для проводящих жидкостей. Двухчастотное возбуждение.',
      descriptionEn: 'Electromagnetic flowmeter for conductive liquids. Dual-frequency excitation.',
      specifications: [
        { label: 'Prinsip', value: 'Elektromagnit' }, { label: 'Aniqlik', value: '±0.35%' }, { label: 'Diametr', value: 'DN 2.5 ... 400' },
        { label: 'Chiqish', value: '4-20 mA HART, Modbus' }, { label: 'Lining', value: 'PFA / poliuretan' },
      ],
    },
    {
      nameUz: 'Endress+Hauser Proline Promag W400 elektromagnit sarf oʻlchagich', nameRu: 'Endress+Hauser Promag W400 электромагнитный расходомер', nameEn: 'Endress+Hauser Promag W400 Electromagnetic Flowmeter',
      slug: 'endress-promag-w400', category: 'sarf-olchagichlar', brand: 'Endress+Hauser', certificates: ['GOST', 'CE'], industries: ['water'], badge: null, isFeatured: false,
      descriptionUz: 'Suv va oqava suv uchun elektromagnit sarf oʻlchagich. DN 25 dan DN 2400 gacha.',
      descriptionRu: 'Электромагнитный расходомер для воды и сточных вод. От DN 25 до DN 2400.',
      descriptionEn: 'Electromagnetic flowmeter for water and wastewater. From DN 25 up to DN 2400.',
      specifications: [
        { label: 'Prinsip', value: 'Elektromagnit' }, { label: 'Aniqlik', value: '±0.5%' }, { label: 'Diametr', value: 'DN 25 ... 2400' },
        { label: 'Chiqish', value: '4-20 mA HART, Modbus, EtherNet/IP' }, { label: 'Himoya', value: 'IP68' },
      ],
    },
    {
      nameUz: 'Emerson Rosemount 8800 Vortex sarf oʻlchagich', nameRu: 'Emerson Rosemount 8800 вихревой расходомер', nameEn: 'Emerson Rosemount 8800 Vortex Flowmeter',
      slug: 'emerson-rosemount-8800', category: 'sarf-olchagichlar', brand: 'Emerson', certificates: ['ATEX', 'IECEx', 'GOST'], industries: ['oil_gas', 'energy'], badge: null, isFeatured: false,
      descriptionUz: 'Bugʻ, gaz va suyuqlik sarfi uchun vortex oʻlchagich. Gasketsiz dizayn.',
      descriptionRu: 'Вихревой расходомер для пара, газа и жидкости. Безпрокладочная конструкция.',
      descriptionEn: 'Vortex flowmeter for steam, gas and liquid. Gasket-free design.',
      specifications: [
        { label: 'Prinsip', value: 'Vortex' }, { label: 'Aniqlik', value: '±0.65% (suyuqlik)' }, { label: 'Diametr', value: 'DN 15 ... 300' },
        { label: 'Maks. harorat', value: '+427 °C' }, { label: 'Chiqish', value: '4-20 mA HART' },
      ],
    },
    {
      nameUz: 'Siemens SITRANS FUS1010 ultratovush sarf oʻlchagich', nameRu: 'Siemens SITRANS FUS1010 ультразвуковой расходомер', nameEn: 'Siemens SITRANS FUS1010 Ultrasonic Flowmeter',
      slug: 'siemens-fus1010', category: 'sarf-olchagichlar', brand: 'Siemens', certificates: ['CE', 'GOST'], industries: ['oil_gas', 'water'], badge: null, isFeatured: false,
      descriptionUz: 'Clamp-on ultratovush sarf oʻlchagich — quvurni kesmasdan oʻrnatiladi.',
      descriptionRu: 'Накладной ультразвуковой расходомер — монтаж без врезки в трубу.',
      descriptionEn: 'Clamp-on ultrasonic flowmeter — installs without cutting into the pipe.',
      specifications: [
        { label: 'Prinsip', value: 'Transit-time ultratovush (clamp-on)' }, { label: 'Aniqlik', value: '±0.5 ... 1%' },
        { label: 'Quvur diametri', value: 'DN 6 ... 9000' }, { label: 'Chiqish', value: '4-20 mA, Modbus' },
      ],
    },
    // ---- TEMPERATURE ----
    {
      nameUz: 'Endress+Hauser TMT82 harorat transmitteri', nameRu: 'Endress+Hauser TMT82 преобразователь температуры', nameEn: 'Endress+Hauser TMT82 Temperature Transmitter',
      slug: 'endress-tmt82', category: 'harorat-olchagichlar', brand: 'Endress+Hauser', certificates: ['ATEX', 'IECEx', 'GOST'], industries: ['oil_gas', 'chemical', 'energy'], badge: null, isFeatured: false,
      descriptionUz: 'Ikki kanalli harorat transmitteri, RTD va termojuft kirishlari. HART 7, SIL2/3.',
      descriptionRu: 'Двухканальный преобразователь температуры, входы RTD и ТП. HART 7, SIL2/3.',
      descriptionEn: 'Dual-channel temperature transmitter with RTD and thermocouple inputs. HART 7, SIL2/3.',
      specifications: [
        { label: 'Kirish', value: 'RTD (Pt100), TC' }, { label: 'Aniqlik', value: '±0.1 °C' }, { label: 'Kanallar', value: '2' },
        { label: 'Chiqish', value: '4-20 mA + HART 7' }, { label: 'SIL', value: 'SIL2/SIL3' },
      ],
    },
    {
      nameUz: 'Emerson Rosemount 644 harorat transmitteri', nameRu: 'Emerson Rosemount 644 преобразователь температуры', nameEn: 'Emerson Rosemount 644 Temperature Transmitter',
      slug: 'emerson-rosemount-644', category: 'harorat-olchagichlar', brand: 'Emerson', certificates: ['ATEX', 'IECEx', 'GOST', 'CE'], industries: ['oil_gas', 'chemical'], badge: 'Koʻp buyurilgan', isFeatured: false,
      descriptionUz: 'Bosh yoki reyka oʻrnatma harorat transmitteri. Sensor-Matching texnologiyasi.',
      descriptionRu: 'Преобразователь температуры для монтажа в головку или на рейку. Технология Sensor-Matching.',
      descriptionEn: 'Head or rail-mount temperature transmitter. Sensor-Matching technology.',
      specifications: [
        { label: 'Kirish', value: 'RTD, TC, mV, Ω' }, { label: 'Aniqlik', value: '±0.1 °C' },
        { label: 'Chiqish', value: '4-20 mA HART / FOUNDATION Fieldbus' }, { label: 'Himoya', value: 'IP66/68' },
      ],
    },
    {
      nameUz: 'Yokogawa YTA710 harorat transmitteri', nameRu: 'Yokogawa YTA710 преобразователь температуры', nameEn: 'Yokogawa YTA710 Temperature Transmitter',
      slug: 'yokogawa-yta710', category: 'harorat-olchagichlar', brand: 'Yokogawa', certificates: ['ATEX', 'IECEx', 'GOST'], industries: ['oil_gas', 'energy'], badge: null, isFeatured: false,
      descriptionUz: 'Yuqori barqarorlikdagi harorat transmitteri. Ikki kirish va multi-sensor qoʻllab-quvvatlaydi.',
      descriptionRu: 'Высокостабильный преобразователь температуры. Поддержка двух входов и мульти-сенсоров.',
      descriptionEn: 'High-stability temperature transmitter. Supports dual input and multi-sensor configuration.',
      specifications: [
        { label: 'Kirish', value: 'RTD, TC (2 kanal)' }, { label: 'Aniqlik', value: '±0.1 °C' },
        { label: 'Chiqish', value: '4-20 mA HART, FOUNDATION Fieldbus' }, { label: 'Himoya', value: 'IP67' },
      ],
    },
    {
      nameUz: 'Endress+Hauser iTHERM TM411 harorat sensori', nameRu: 'Endress+Hauser iTHERM TM411 датчик температуры', nameEn: 'Endress+Hauser iTHERM TM411 Temperature Sensor',
      slug: 'endress-itherm-tm411', category: 'harorat-olchagichlar', brand: 'Endress+Hauser', certificates: ['GOST', 'CE'], industries: ['food', 'chemical'], badge: null, isFeatured: false,
      descriptionUz: 'Gigiyenik va sanoat jarayonlari uchun tez javob beruvchi RTD harorat sensori.',
      descriptionRu: 'Быстродействующий RTD датчик температуры для гигиенических и промышленных процессов.',
      descriptionEn: 'Fast-response RTD temperature sensor for hygienic and industrial processes.',
      specifications: [
        { label: 'Sensor', value: 'Pt100 (1×/2×)' }, { label: 'Diapazon', value: '-200 ... +600 °C' },
        { label: 'Javob vaqti', value: 't90 < 1.5 s' }, { label: 'Material', value: '316L / 904L' },
      ],
    },
    // ---- LEVEL ----
    {
      nameUz: 'Endress+Hauser Micropilot FMR60 radar saviya oʻlchagich', nameRu: 'Endress+Hauser Micropilot FMR60 радарный уровнемер', nameEn: 'Endress+Hauser Micropilot FMR60 Radar Level',
      slug: 'endress-micropilot-fmr60', category: 'saviya-olchagichlar', brand: 'Endress+Hauser', certificates: ['ATEX', 'IECEx', 'GOST'], industries: ['oil_gas', 'chemical'], badge: 'Sertifikatlangan', isFeatured: true,
      descriptionUz: '80 GHz FMCW radar saviya oʻlchagich. Suyuqliklar uchun, fokuslangan signal.',
      descriptionRu: '80 ГГц FMCW радарный уровнемер для жидкостей. Сфокусированный сигнал.',
      descriptionEn: '80 GHz FMCW radar level transmitter for liquids. Focused signal beam.',
      specifications: [
        { label: 'Prinsip', value: '80 GHz FMCW radar' }, { label: 'Diapazon', value: '0 ... 40 m' }, { label: 'Aniqlik', value: '±1 mm' },
        { label: 'Chiqish', value: '4-20 mA HART, PROFIBUS PA' }, { label: 'Harorat', value: '-40 ... +200 °C' },
      ],
    },
    {
      nameUz: 'Emerson Rosemount 5408 radar saviya oʻlchagich', nameRu: 'Emerson Rosemount 5408 радарный уровнемер', nameEn: 'Emerson Rosemount 5408 Radar Level',
      slug: 'emerson-rosemount-5408', category: 'saviya-olchagichlar', brand: 'Emerson', certificates: ['ATEX', 'IECEx', 'GOST'], industries: ['oil_gas', 'chemical'], badge: null, isFeatured: false,
      descriptionUz: 'Uzluksiz FMCW radar saviya oʻlchagich. 2-simli, past quvvat sarfi.',
      descriptionRu: 'Непрерывный FMCW радарный уровнемер. 2-проводной, низкое энергопотребление.',
      descriptionEn: 'Continuous FMCW radar level transmitter. 2-wire, low power consumption.',
      specifications: [
        { label: 'Prinsip', value: 'FMCW radar' }, { label: 'Diapazon', value: '0 ... 40 m' }, { label: 'Aniqlik', value: '±2 mm' },
        { label: 'Chiqish', value: '4-20 mA HART' }, { label: 'Antenna', value: 'Cone / process seal' },
      ],
    },
    {
      nameUz: 'Siemens SITRANS LR560 radar saviya oʻlchagich', nameRu: 'Siemens SITRANS LR560 радарный уровнемер', nameEn: 'Siemens SITRANS LR560 Radar Level',
      slug: 'siemens-sitrans-lr560', category: 'saviya-olchagichlar', brand: 'Siemens', certificates: ['ATEX', 'CE', 'GOST'], industries: ['mining', 'food'], badge: null, isFeatured: false,
      descriptionUz: '78 GHz radar — quruq qattiq materiallar (sement, donlar) saviyasini oʻlchaydi.',
      descriptionRu: '78 ГГц радар — измерение уровня сыпучих материалов (цемент, зерно).',
      descriptionEn: '78 GHz radar for level of dry bulk solids (cement, grain).',
      specifications: [
        { label: 'Prinsip', value: '78 GHz radar' }, { label: 'Diapazon', value: '0 ... 100 m' }, { label: 'Nur burchagi', value: '4°' },
        { label: 'Chiqish', value: '4-20 mA HART' }, { label: 'Harorat', value: '-40 ... +200 °C' },
      ],
    },
    {
      nameUz: 'Endress+Hauser Liquiphant FTL51 vibratsion saviya rele', nameRu: 'Endress+Hauser Liquiphant FTL51 вибрационный сигнализатор уровня', nameEn: 'Endress+Hauser Liquiphant FTL51 Vibronic Level Switch',
      slug: 'endress-liquiphant-ftl51', category: 'saviya-olchagichlar', brand: 'Endress+Hauser', certificates: ['ATEX', 'IECEx', 'GOST'], industries: ['chemical', 'oil_gas'], badge: null, isFeatured: false,
      descriptionUz: 'Suyuqliklar uchun nuqtali saviya rele (vibratsion vilka). Limit detection.',
      descriptionRu: 'Точечный сигнализатор уровня для жидкостей (вибрационная вилка). Limit detection.',
      descriptionEn: 'Point level switch for liquids (vibrating fork). Limit detection.',
      specifications: [
        { label: 'Prinsip', value: 'Vibronic vilka' }, { label: 'Harorat', value: '-50 ... +150 °C' },
        { label: 'Bosim', value: '-1 ... 100 bar' }, { label: 'Chiqish', value: 'Relay / PNP / NAMUR' },
      ],
    },
    {
      nameUz: 'Emerson Rosemount 2120 vibratsion saviya rele', nameRu: 'Emerson Rosemount 2120 вибрационный сигнализатор уровня', nameEn: 'Emerson Rosemount 2120 Vibrating Fork Level Switch',
      slug: 'emerson-rosemount-2120', category: 'saviya-olchagichlar', brand: 'Emerson', certificates: ['ATEX', 'IECEx'], industries: ['chemical', 'water'], badge: null, isFeatured: false,
      descriptionUz: 'Vibratsion vilka prinsipidagi saviya signalizatori. Sozlanmaydigan, ishonchli.',
      descriptionRu: 'Сигнализатор уровня на принципе вибрационной вилки. Без настройки, надёжный.',
      descriptionEn: 'Vibrating fork level switch. No calibration required, highly reliable.',
      specifications: [
        { label: 'Prinsip', value: 'Vibrating fork' }, { label: 'Harorat', value: '-40 ... +150 °C' },
        { label: 'Chiqish', value: 'Relay / PNP / NAMUR' }, { label: 'Himoya', value: 'IP66/67' },
      ],
    },
    // ---- VALVES & POSITIONERS ----
    {
      nameUz: 'Emerson Fisher GX boshqaruv klapani', nameRu: 'Emerson Fisher GX регулирующий клапан', nameEn: 'Emerson Fisher GX Control Valve',
      slug: 'emerson-fisher-gx', category: 'boshqaruv-klapanlari', brand: 'Emerson', certificates: ['ATEX', 'GOST', 'CE'], industries: ['oil_gas', 'chemical'], badge: 'Sertifikatlangan', isFeatured: false,
      descriptionUz: 'Kompakt boshqaruv klapani va pnevmatik aktuator. FIELDVUE DVC6200 bilan.',
      descriptionRu: 'Компактный регулирующий клапан с пневмоприводом. С FIELDVUE DVC6200.',
      descriptionEn: 'Compact control valve with integrated pneumatic actuator. With FIELDVUE DVC6200.',
      specifications: [
        { label: 'Oʻlcham', value: 'DN 25 ... 100' }, { label: 'Bosim klassi', value: 'PN 10 ... 40 (CL150-300)' },
        { label: 'Korpus', value: 'Uglerodli poʻlat / 316 SS' }, { label: 'Aktuator', value: 'Pnevmatik diafragma' },
      ],
    },
    {
      nameUz: 'Emerson Fisher easy-e ED boshqaruv klapani', nameRu: 'Emerson Fisher easy-e ED регулирующий клапан', nameEn: 'Emerson Fisher easy-e ED Control Valve',
      slug: 'emerson-fisher-easy-e', category: 'boshqaruv-klapanlari', brand: 'Emerson', certificates: ['ATEX', 'GOST'], industries: ['oil_gas', 'energy'], badge: null, isFeatured: false,
      descriptionUz: 'Globe-tipidagi koʻp maqsadli boshqaruv klapani. Keng oʻlcham va trim variantlari.',
      descriptionRu: 'Многоцелевой регулирующий клапан типа globe. Широкий выбор размеров и тримов.',
      descriptionEn: 'Versatile globe-style control valve. Wide range of sizes and trim options.',
      specifications: [
        { label: 'Oʻlcham', value: 'DN 25 ... 600' }, { label: 'Bosim klassi', value: 'CL150 ... CL2500' },
        { label: 'Trim', value: 'Linear / equal percentage' }, { label: 'Korpus', value: 'WCC / 316 SS' },
      ],
    },
    {
      nameUz: 'Bürkert Type 8696 boshqaruv klapani', nameRu: 'Bürkert Type 8696 регулирующий клапан', nameEn: 'Bürkert Type 8696 Control Valve',
      slug: 'burkert-type-8696', category: 'boshqaruv-klapanlari', brand: 'Bürkert', certificates: ['CE'], industries: ['food', 'chemical', 'water'], badge: 'Yangi', isFeatured: false,
      descriptionUz: 'Gigiyenik jarayonlar uchun integratsiyalashgan pozitsionerli boshqaruv klapani.',
      descriptionRu: 'Регулирующий клапан с интегрированным позиционером для гигиенических процессов.',
      descriptionEn: 'Control valve with integrated positioner for hygienic processes.',
      specifications: [
        { label: 'Oʻlcham', value: 'DN 8 ... 50' }, { label: 'Boshqaruv', value: 'Integratsiyalashgan pozitsioner' },
        { label: 'Interfeys', value: 'AS-i, PROFIBUS, 4-20 mA' }, { label: 'Material', value: '316L SS' },
      ],
    },
    {
      nameUz: 'Bürkert Type 2301 pnevmatik jarayon klapani', nameRu: 'Bürkert Type 2301 пневматический процессный клапан', nameEn: 'Bürkert Type 2301 Pneumatic Process Valve',
      slug: 'burkert-type-2301', category: 'boshqaruv-klapanlari', brand: 'Bürkert', certificates: ['CE'], industries: ['food', 'water'], badge: null, isFeatured: false,
      descriptionUz: 'Pnevmatik aktuatorli burchak-oʻrindiqli klapan. Steriliziatsiya va CIP uchun.',
      descriptionRu: 'Угловой седельный клапан с пневмоприводом. Для стерилизации и CIP.',
      descriptionEn: 'Angle-seat valve with pneumatic actuator. For sterilization and CIP.',
      specifications: [
        { label: 'Oʻlcham', value: 'DN 8 ... 65' }, { label: 'Bosim', value: '0 ... 16 bar' },
        { label: 'Aktuator', value: 'Pnevmatik (bir/ikki taʼsirli)' }, { label: 'Material', value: '316L SS' },
      ],
    },
    {
      nameUz: 'Siemens SIPART PS2 raqamli pozitsioner', nameRu: 'Siemens SIPART PS2 цифровой позиционер', nameEn: 'Siemens SIPART PS2 Digital Positioner',
      slug: 'siemens-sipart-ps2', category: 'pozitsionerlar', brand: 'Siemens', certificates: ['ATEX', 'IECEx', 'CE'], industries: ['oil_gas', 'chemical'], badge: 'Koʻp buyurilgan', isFeatured: true,
      descriptionUz: 'Lineer va aylanma aktuatorlar uchun raqamli pozitsioner. Avtomatik sozlash.',
      descriptionRu: 'Цифровой позиционер для линейных и поворотных приводов. Автонастройка.',
      descriptionEn: 'Digital positioner for linear and rotary actuators. Automatic commissioning.',
      specifications: [
        { label: 'Aktuator', value: 'Lineer / aylanma' }, { label: 'Chiqish', value: '4-20 mA HART, PROFIBUS PA, FF' },
        { label: 'Havo sarfi', value: 'Past (energiya tejovchi)' }, { label: 'SIL', value: 'SIL2' },
      ],
    },
    {
      nameUz: 'Emerson Fisher FIELDVUE DVC6200 pozitsioner', nameRu: 'Emerson Fisher FIELDVUE DVC6200 позиционер', nameEn: 'Emerson Fisher FIELDVUE DVC6200 Positioner',
      slug: 'emerson-dvc6200', category: 'pozitsionerlar', brand: 'Emerson', certificates: ['ATEX', 'IECEx', 'GOST'], industries: ['oil_gas', 'chemical', 'energy'], badge: null, isFeatured: false,
      descriptionUz: 'Raqamli klapan boshqaruvchisi. valveLink diagnostikasi va PlantWeb integratsiyasi.',
      descriptionRu: 'Цифровой контроллер клапана. Диагностика valveLink и интеграция PlantWeb.',
      descriptionEn: 'Digital valve controller. valveLink diagnostics and PlantWeb integration.',
      specifications: [
        { label: 'Aktuator', value: 'Lineer / aylanma' }, { label: 'Chiqish', value: '4-20 mA HART, FOUNDATION Fieldbus' },
        { label: 'Diagnostika', value: 'valveLink' }, { label: 'SIL', value: 'SIL2/3' },
      ],
    },
    // ---- ANALYZERS / GAS DETECTION ----
    {
      nameUz: 'Honeywell Searchpoint Optima Plus gaz detektori', nameRu: 'Honeywell Searchpoint Optima Plus газоанализатор', nameEn: 'Honeywell Searchpoint Optima Plus Gas Detector',
      slug: 'honeywell-optima-plus', category: 'gaz-detektorlari', brand: 'Honeywell', certificates: ['ATEX', 'IECEx', 'GOST'], industries: ['oil_gas', 'chemical'], badge: 'Sertifikatlangan', isFeatured: true,
      descriptionUz: 'Infraqizil nuqtali yonuvchi gaz detektori. SIL2, 316 SS korpus.',
      descriptionRu: 'Инфракрасный точечный детектор горючих газов. SIL2, корпус 316 SS.',
      descriptionEn: 'Infrared point detector for combustible gases. SIL2, 316 SS housing.',
      specifications: [
        { label: 'Aniqlash', value: 'Infraqizil (IR), yonuvchi' }, { label: 'Diapazon', value: '0 ... 100% LEL' },
        { label: 'Javob', value: 'T90 < 4 s' }, { label: 'Chiqish', value: '4-20 mA, HART, Modbus' }, { label: 'SIL', value: 'SIL2' },
      ],
    },
    {
      nameUz: 'Honeywell Sieger Apex gaz detektori', nameRu: 'Honeywell Sieger Apex газоанализатор', nameEn: 'Honeywell Sieger Apex Gas Detector',
      slug: 'honeywell-sieger-apex', category: 'gaz-detektorlari', brand: 'Honeywell', certificates: ['ATEX', 'IECEx'], industries: ['oil_gas', 'chemical'], badge: null, isFeatured: false,
      descriptionUz: 'Toksik va yonuvchi gazlar uchun sensori almashtiriladigan detektor.',
      descriptionRu: 'Детектор с заменяемым сенсором для токсичных и горючих газов.',
      descriptionEn: 'Detector with replaceable sensor cartridge for toxic and combustible gases.',
      specifications: [
        { label: 'Gazlar', value: 'Yonuvchi, toksik (H2S, CO va b.)' }, { label: 'Sensor', value: 'Katalitik / elektrokimyoviy' },
        { label: 'Chiqish', value: '4-20 mA, Modbus' }, { label: 'Korpus', value: '316 SS, IP66/67' },
      ],
    },
    {
      nameUz: 'Emerson Rosemount X-STREAM gaz analizatori', nameRu: 'Emerson Rosemount X-STREAM газоанализатор', nameEn: 'Emerson Rosemount X-STREAM Gas Analyzer',
      slug: 'emerson-xstream', category: 'analizatorlar', brand: 'Emerson', certificates: ['ATEX', 'CE'], industries: ['energy', 'chemical'], badge: null, isFeatured: false,
      descriptionUz: 'Koʻp komponentli uzluksiz gaz analizatori (CEMS). NDIR, UV, O2 oʻlchovlari.',
      descriptionRu: 'Многокомпонентный непрерывный газоанализатор (CEMS). NDIR, UV, O2.',
      descriptionEn: 'Multi-component continuous gas analyzer (CEMS). NDIR, UV, O2 measurements.',
      specifications: [
        { label: 'Komponentlar', value: 'CO, CO2, NO, SO2, O2, CH4' }, { label: 'Texnologiya', value: 'NDIR / UV / paramagnit O2' },
        { label: 'Chiqish', value: '4-20 mA, Modbus, Ethernet' }, { label: 'Ilova', value: 'CEMS / proses' },
      ],
    },
    {
      nameUz: 'Yokogawa SENCOM SC450G pH analizatori', nameRu: 'Yokogawa SENCOM SC450G pH анализатор', nameEn: 'Yokogawa SENCOM SC450G pH Analyzer',
      slug: 'yokogawa-sc450g', category: 'analizatorlar', brand: 'Yokogawa', certificates: ['CE', 'GOST'], industries: ['water', 'chemical'], badge: null, isFeatured: false,
      descriptionUz: 'Aqlli SENCOM raqamli sensorli pH/ORP analizatori transmitteri.',
      descriptionRu: 'Анализатор pH/ORP с интеллектуальным цифровым сенсором SENCOM.',
      descriptionEn: 'pH/ORP analyzer transmitter with intelligent SENCOM digital sensor.',
      specifications: [
        { label: 'Oʻlchov', value: 'pH / ORP' }, { label: 'Sensor', value: 'SENCOM raqamli' },
        { label: 'Chiqish', value: '4-20 mA HART, Modbus' }, { label: 'Himoya', value: 'IP66' },
      ],
    },
    {
      nameUz: 'Endress+Hauser Liquiline CM44 analizatori', nameRu: 'Endress+Hauser Liquiline CM44 анализатор', nameEn: 'Endress+Hauser Liquiline CM44 Analyzer',
      slug: 'endress-liquiline-cm44', category: 'analizatorlar', brand: 'Endress+Hauser', certificates: ['GOST', 'CE'], industries: ['water', 'chemical', 'food'], badge: null, isFeatured: false,
      descriptionUz: 'Koʻp parametrli suyuqlik analizatori. pH, oʻtkazuvchanlik, O2, loyqalik. Memosens.',
      descriptionRu: 'Многопараметрический анализатор жидкости. pH, проводимость, O2, мутность. Memosens.',
      descriptionEn: 'Multiparameter liquid analyzer. pH, conductivity, O2, turbidity. Memosens sensors.',
      specifications: [
        { label: 'Parametrlar', value: 'pH/ORP, oʻtkazuvchanlik, O2, loyqalik' }, { label: 'Kanallar', value: '1 ... 8' },
        { label: 'Sensor', value: 'Memosens (raqamli)' }, { label: 'Chiqish', value: '4-20 mA, HART, PROFIBUS, Modbus' },
      ],
    },
    // ---- AUTOMATION / ELECTRICAL ----
    {
      nameUz: 'ABB AC500 PM590 PLK kontroller', nameRu: 'ABB AC500 PM590 ПЛК контроллер', nameEn: 'ABB AC500 PM590 PLC Controller',
      slug: 'abb-ac500-pm590', category: 'plk-kontrollerlar', brand: 'ABB', certificates: ['CE', 'GOST'], industries: ['energy', 'mining', 'water'], badge: 'Koʻp buyurilgan', isFeatured: true,
      descriptionUz: 'Yuqori unumdorlikdagi PLK protsessor moduli. 4 MB xotira, Modbus/PROFINET/EtherCAT.',
      descriptionRu: 'Высокопроизводительный процессорный модуль ПЛК. 4 МБ, Modbus/PROFINET/EtherCAT.',
      descriptionEn: 'High-performance PLC processor module. 4 MB memory, Modbus/PROFINET/EtherCAT.',
      specifications: [
        { label: 'Xotira', value: '4 MB' }, { label: 'Interfeyslar', value: '2× Ethernet, RS-232/485' },
        { label: 'Protokollar', value: 'Modbus TCP/RTU, PROFINET, EtherCAT' }, { label: 'Harorat', value: '-40 ... +70 °C' },
      ],
    },
    {
      nameUz: 'Yokogawa CENTUM VP DCS tizimi', nameRu: 'Yokogawa CENTUM VP DCS система', nameEn: 'Yokogawa CENTUM VP DCS',
      slug: 'yokogawa-centum-vp', category: 'dcs-tizimlari', brand: 'Yokogawa', certificates: ['IECEx', 'GOST'], industries: ['oil_gas', 'chemical', 'energy'], badge: null, isFeatured: false,
      descriptionUz: 'Korxona miqyosidagi taqsimlangan boshqaruv tizimi (DCS). Yuqori ishonchlilik.',
      descriptionRu: 'Распределённая система управления (DCS) корпоративного масштаба. Высокая надёжность.',
      descriptionEn: 'Enterprise-scale distributed control system (DCS). High reliability.',
      specifications: [
        { label: 'Tur', value: 'DCS' }, { label: 'Maks. teglar', value: '1 000 000+' },
        { label: 'Ortiqchalik', value: 'Toʻliq dublikatsiya' }, { label: 'Tarmoq', value: 'Vnet/IP' },
      ],
    },
    {
      nameUz: 'ABB ACS880 chastotali oʻzgartirgich', nameRu: 'ABB ACS880 частотный преобразователь', nameEn: 'ABB ACS880 Variable Frequency Drive',
      slug: 'abb-acs880', category: 'chastotali-ozgartirgichlar', brand: 'ABB', certificates: ['CE', 'GOST'], industries: ['mining', 'energy', 'water'], badge: 'Koʻp buyurilgan', isFeatured: false,
      descriptionUz: 'Sanoat drayveri (VFD), 0.55 dan 6000 kW gacha. Direct Torque Control (DTC).',
      descriptionRu: 'Промышленный привод (ЧРП) от 0.55 до 6000 кВт. Direct Torque Control (DTC).',
      descriptionEn: 'Industrial drive (VFD) from 0.55 to 6000 kW. Direct Torque Control (DTC).',
      specifications: [
        { label: 'Quvvat', value: '0.55 ... 6000 kW' }, { label: 'Kuchlanish', value: '380 ... 690 V' },
        { label: 'Boshqaruv', value: 'DTC' }, { label: 'Fieldbus', value: 'PROFINET, EtherNet/IP, Modbus' },
      ],
    },
    {
      nameUz: 'Siemens SINAMICS G120 chastotali oʻzgartirgich', nameRu: 'Siemens SINAMICS G120 частотный преобразователь', nameEn: 'Siemens SINAMICS G120 Variable Frequency Drive',
      slug: 'siemens-sinamics-g120', category: 'chastotali-ozgartirgichlar', brand: 'Siemens', certificates: ['CE', 'GOST'], industries: ['water', 'energy'], badge: null, isFeatured: false,
      descriptionUz: 'Modulli chastota oʻzgartirgich nasos, ventilyator va konveyerlar uchun.',
      descriptionRu: 'Модульный частотный преобразователь для насосов, вентиляторов и конвейеров.',
      descriptionEn: 'Modular variable frequency drive for pumps, fans and conveyors.',
      specifications: [
        { label: 'Quvvat', value: '0.37 ... 250 kW' }, { label: 'Kuchlanish', value: '380 ... 480 V' },
        { label: 'Boshqaruv', value: 'Vektorli / U/f' }, { label: 'Fieldbus', value: 'PROFINET, PROFIBUS, Modbus' },
      ],
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        nameUz: p.nameUz, nameRu: p.nameRu, nameEn: p.nameEn, slug: p.slug,
        descriptionUz: p.descriptionUz, descriptionRu: p.descriptionRu, descriptionEn: p.descriptionEn,
        categoryId: catIds[p.category], brandId: brands[p.brand],
        images: [`/uploads/products/${p.slug}.webp`],
        documents: [] as unknown as Prisma.InputJsonValue,
        specifications: p.specifications as unknown as Prisma.InputJsonValue,
        certificates: p.certificates, industries: p.industries,
        badge: p.badge, isActive: true, isFeatured: p.isFeatured,
      },
    });
  }
  console.log(`✅ ${products.length} products created`);

  // ---------------- News ----------------
  await prisma.newsPost.createMany({
    data: [
      {
        titleUz: 'Power Automation Shoʻrtan gaz-kimyo majmuasiga uskuna yetkazib berdi',
        titleRu: 'Power Automation поставила оборудование на Шуртанский ГХК',
        titleEn: 'Power Automation supplies equipment to Shurtan Gas Chemical Complex',
        slug: 'shortan-loyihasi',
        bodyUz: 'Power Automation MCHJ Shoʻrtan gaz-kimyo majmuasini modernizatsiya qilish doirasida Emerson Rosemount bosim transmitterlari va Fisher boshqaruv klapanlarini yetkazib berdi. 200 dan ortiq oʻlchov nuqtasi jihozlandi. Barcha uskunalar ATEX va IECEx sertifikatlariga ega.',
        bodyRu: 'ООО Power Automation в рамках модернизации Шуртанского ГХК поставила преобразователи давления Emerson Rosemount и регулирующие клапаны Fisher. Оснащено более 200 измерительных точек. Всё оборудование имеет сертификаты ATEX и IECEx.',
        bodyEn: 'As part of the Shurtan Gas Chemical Complex modernization, Power Automation supplied Emerson Rosemount pressure transmitters and Fisher control valves. More than 200 measurement points were equipped. All equipment carries ATEX and IECEx certifications.',
        thumbnail: '/uploads/news/shortan.webp', category: 'Loyiha', isPublished: true, publishedAt: new Date('2026-03-15'),
      },
      {
        titleUz: 'Coriolis sarf oʻlchagichlarini tanlash: amaliy qoʻllanma',
        titleRu: 'Как выбрать кориолисовый расходомер: практическое руководство',
        titleEn: 'How to choose a Coriolis flowmeter: a practical guide',
        slug: 'coriolis-tanlash-qollanma',
        bodyUz: 'Coriolis prinsipiga asoslangan massa sarf oʻlchagichlari neft-gaz va kimyo sanoatida eng aniq oʻlchov vositalaridan biridir. Ushbu maqolada quvur diametri, suyuqlik xususiyatlari va bosim sharoitlariga qarab toʻgʻri model tanlash boʻyicha maslahatlar berilgan.',
        bodyRu: 'Массовые расходомеры на принципе Кориолиса — одни из самых точных средств измерения. В статье — советы по выбору модели в зависимости от диаметра трубы, свойств жидкости и давления.',
        bodyEn: 'Coriolis mass flowmeters are among the most accurate instruments in oil & gas and chemical industries. This article covers how to select the right model based on pipe diameter, fluid properties and pressure conditions.',
        thumbnail: '/uploads/news/coriolis.webp', category: 'Texnik maqola', isPublished: true, publishedAt: new Date('2026-04-20'),
      },
    ],
  });
  console.log('✅ 2 news posts created');

  // ---------------- Projects ----------------
  await prisma.project.createMany({
    data: [
      {
        titleUz: 'Ustyurt gaz-kimyo majmuasi avtomatlashtirish',
        titleRu: 'Автоматизация Устюртского газохимического комплекса',
        titleEn: 'Ustyurt Gas Chemical Complex automation',
        slug: 'ustyurt-gxk',
        descUz: 'Ustyurt gaz-kimyo majmuasida Yokogawa CENTUM VP DCS tizimi asosida texnologik jarayonlarni boshqarish tizimi joriy etildi. 50 000 dan ortiq teg, toʻliq ortiqchalik va integratsiyalashgan xavfsizlik tizimi (SIS) oʻrnatildi.',
        descRu: 'На Устюртском ГХК внедрена АСУ ТП на базе Yokogawa CENTUM VP DCS. Установлено более 50 000 тегов, полное резервирование и интегрированная система безопасности (SIS).',
        descEn: 'A process control system based on Yokogawa CENTUM VP DCS was deployed at the Ustyurt Gas Chemical Complex. Over 50,000 tags, full redundancy and an integrated safety system (SIS) were installed.',
        industry: 'oil_gas', location: 'Qoraqalpogʻiston, Oʻzbekiston', year: 2024,
        images: ['/uploads/projects/ustyurt-1.webp', '/uploads/projects/ustyurt-2.webp'],
      },
      {
        titleUz: 'Olmaliq KMK suv tozalash tizimi monitoringi',
        titleRu: 'Мониторинг системы водоочистки Алмалыкского ГМК',
        titleEn: 'Almalyk MMC water treatment monitoring',
        slug: 'olmaliq-suv-monitoring',
        descUz: 'Olmaliq kon-metallurgiya kombinatida suv tozalash inshootlarini monitoring qilish uchun Endress+Hauser Liquiline analizatorlari va ABB ACS880 chastotali oʻzgartirgichlari oʻrnatildi. Real vaqtda pH, oʻtkazuvchanlik va sarf nazorati taʼminlandi.',
        descRu: 'На Алмалыкском ГМК для мониторинга водоочистных сооружений установлены анализаторы Endress+Hauser Liquiline и приводы ABB ACS880. Обеспечен контроль pH, проводимости и расхода в реальном времени.',
        descEn: 'At the Almalyk Mining and Metallurgical Combine, Endress+Hauser Liquiline analyzers and ABB ACS880 drives were installed to monitor water treatment facilities. Real-time control of pH, conductivity and flow was achieved.',
        industry: 'mining', location: 'Olmaliq, Oʻzbekiston', year: 2025,
        images: ['/uploads/projects/olmaliq-1.webp'],
      },
    ],
  });
  console.log('✅ 2 projects created');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
