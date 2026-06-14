export const COMPANY = {
  name: 'Power Automation MCHJ',
  shortName: 'Power Automation',
  phone: '+998 71 200 00 00',
  phoneHref: '+998712000000',
  email: 'info@powerautomation.uz',
  telegram: process.env.NEXT_PUBLIC_TELEGRAM_BOT || '@power_automation_bot',
  addressUz: 'Toshkent sh., Mirzo Ulugʻbek tumani, Buyuk Ipak Yoʻli koʻchasi, 1',
  addressRu: 'г. Ташкент, Мирзо-Улугбекский район, ул. Буюк Ипак Йули, 1',
  addressEn: 'Buyuk Ipak Yuli St. 1, Mirzo Ulugbek district, Tashkent, Uzbekistan',
  siteUrl: 'https://powerautomation.uz',
};

export const CERTIFICATES = ['ATEX', 'IECEx', 'GOST', 'CE', 'ISO9001'] as const;
