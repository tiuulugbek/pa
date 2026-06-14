import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { existsSync } from 'fs';
import PDFDocument from 'pdfkit';
import type { Brand, Category, Product } from '@pa/db';

type Locale = 'uz' | 'ru' | 'en';
type ProductFull = Product & { brand: Brand | null; category: Category | null };

interface Spec {
  label: string;
  value: string;
}

// Brand palette.
const BLUE_DARK = '#0A4DB8';
const BLUE_MID = '#1A7FE8';
const TEXT_DARK = '#0D1B3E';
const TEXT_MID = '#334E7B';
const BG = '#EBF4FF';

const T: Record<Locale, Record<string, string>> = {
  uz: {
    datasheet: 'TEXNIK MAʼLUMOTNOMA',
    brand: 'Brend',
    category: 'Kategoriya',
    specifications: 'Texnik xususiyatlar',
    certificates: 'Sertifikatlar',
    industries: 'Qoʻllaniladigan sohalar',
    description: 'Tavsif',
    contact: 'Aloqa uchun',
    generated: 'Ushbu hujjat avtomatik tarzda yaratildi',
  },
  ru: {
    datasheet: 'ТЕХНИЧЕСКИЙ ЛИСТ',
    brand: 'Бренд',
    category: 'Категория',
    specifications: 'Технические характеристики',
    certificates: 'Сертификаты',
    industries: 'Области применения',
    description: 'Описание',
    contact: 'Контакты',
    generated: 'Документ сформирован автоматически',
  },
  en: {
    datasheet: 'TECHNICAL DATASHEET',
    brand: 'Brand',
    category: 'Category',
    specifications: 'Specifications',
    certificates: 'Certificates',
    industries: 'Industries',
    description: 'Description',
    contact: 'Contact',
    generated: 'This document was generated automatically',
  },
};

const INDUSTRY_LABELS: Record<string, Record<Locale, string>> = {
  oil_gas: { uz: 'Neft va gaz', ru: 'Нефть и газ', en: 'Oil & Gas' },
  chemical: { uz: 'Kimyo', ru: 'Химия', en: 'Chemical' },
  mining: { uz: 'Togʻ-kon', ru: 'Горнодобыча', en: 'Mining' },
  energy: { uz: 'Energetika', ru: 'Энергетика', en: 'Energy' },
  food: { uz: 'Oziq-ovqat', ru: 'Пищевая', en: 'Food & Beverage' },
  water: { uz: 'Suv taʼminoti', ru: 'Водоснабжение', en: 'Water' },
};

@Injectable()
export class DatasheetService {
  private fontReg = join(process.cwd(), 'assets', 'fonts', 'DejaVuSans.ttf');
  private fontBold = join(process.cwd(), 'assets', 'fonts', 'DejaVuSans-Bold.ttf');

  private pick(p: ProductFull, field: 'name' | 'description', locale: Locale): string {
    const suffix = locale === 'ru' ? 'Ru' : locale === 'en' ? 'En' : 'Uz';
    const key = `${field}${suffix}` as keyof ProductFull;
    const val = p[key] as string | null | undefined;
    if (val) return val;
    return (p[`${field}Uz` as keyof ProductFull] as string | null) ?? '';
  }

  private catName(c: Category | null, locale: Locale): string {
    if (!c) return '';
    const suffix = locale === 'ru' ? 'Ru' : locale === 'en' ? 'En' : 'Uz';
    return (c[`name${suffix}` as keyof Category] as string | null) ?? c.nameUz;
  }

  /** Builds a branded A4 datasheet PDF for the product and returns it as a Buffer. */
  async build(product: ProductFull, locale: Locale): Promise<Buffer> {
    const t = T[locale];
    const hasFonts = existsSync(this.fontReg) && existsSync(this.fontBold);

    const doc = new PDFDocument({ size: 'A4', margin: 0 });
    if (hasFonts) {
      doc.registerFont('reg', this.fontReg);
      doc.registerFont('bold', this.fontBold);
    }
    const reg = hasFonts ? 'reg' : 'Helvetica';
    const bold = hasFonts ? 'bold' : 'Helvetica-Bold';

    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    const done = new Promise<Buffer>((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

    const pageW = doc.page.width;
    const M = 48;
    const contentW = pageW - M * 2;

    // ---------- Header band ----------
    doc.rect(0, 0, pageW, 110).fill(BLUE_DARK);
    doc.roundedRect(M, 32, 46, 46, 8).fill('#ffffff');
    doc.font(bold).fontSize(22).fillColor(BLUE_DARK).text('PA', M, 44, { width: 46, align: 'center' });
    doc.font(bold).fontSize(20).fillColor('#ffffff').text('Power Automation', M + 60, 38);
    doc.font(reg).fontSize(10).fillColor('#cfe2ff').text('powerautomation.uz', M + 60, 64);
    doc.font(bold).fontSize(11).fillColor('#9fc6ff').text(t.datasheet, M, 44, {
      width: contentW,
      align: 'right',
    });

    let y = 140;

    // ---------- Brand + title ----------
    if (product.brand?.name) {
      doc.font(bold).fontSize(11).fillColor(BLUE_MID).text(product.brand.name.toUpperCase(), M, y);
      y += 16;
    }
    doc.font(bold).fontSize(22).fillColor(TEXT_DARK).text(this.pick(product, 'name', locale), M, y, {
      width: contentW,
    });
    y = doc.y + 6;

    // category + badge line
    const metaParts: string[] = [];
    const cat = this.catName(product.category, locale);
    if (cat) metaParts.push(`${t.category}: ${cat}`);
    if (product.badge) metaParts.push(product.badge);
    if (metaParts.length) {
      doc.font(reg).fontSize(10).fillColor(TEXT_MID).text(metaParts.join('   •   '), M, y);
      y = doc.y + 12;
    }

    // ---------- Description ----------
    const desc = this.pick(product, 'description', locale);
    if (desc) {
      doc.font(bold).fontSize(12).fillColor(TEXT_DARK).text(t.description, M, y);
      y = doc.y + 4;
      doc.font(reg).fontSize(10.5).fillColor(TEXT_MID).text(desc, M, y, { width: contentW, lineGap: 2 });
      y = doc.y + 16;
    }

    // ---------- Specifications table ----------
    const specs = (product.specifications as Spec[] | null) ?? [];
    if (specs.length) {
      doc.font(bold).fontSize(13).fillColor(TEXT_DARK).text(t.specifications, M, y);
      y = doc.y + 8;
      const rowH = 24;
      const labelW = contentW * 0.45;
      specs.forEach((s, i) => {
        if (y + rowH > doc.page.height - 110) {
          doc.addPage({ size: 'A4', margin: 0 });
          y = 60;
        }
        if (i % 2 === 0) doc.rect(M, y, contentW, rowH).fill(BG);
        doc.font(reg).fontSize(10).fillColor(TEXT_MID).text(s.label, M + 10, y + 7, { width: labelW - 16 });
        doc.font(bold).fontSize(10).fillColor(TEXT_DARK).text(s.value, M + labelW, y + 7, {
          width: contentW - labelW - 10,
        });
        y += rowH;
      });
      y += 16;
    }

    // ---------- Certificates ----------
    if (product.certificates.length) {
      doc.font(bold).fontSize(12).fillColor(TEXT_DARK).text(t.certificates, M, y);
      y = doc.y + 8;
      let x = M;
      for (const c of product.certificates) {
        const w = doc.font(bold).fontSize(10).widthOfString(c) + 20;
        if (x + w > pageW - M) {
          x = M;
          y += 26;
        }
        doc.roundedRect(x, y, w, 20, 6).fill('#e7f7ee');
        doc.fillColor('#1a7a47').font(bold).fontSize(10).text(c, x + 10, y + 5);
        x += w + 8;
      }
      y += 32;
    }

    // ---------- Industries ----------
    if (product.industries.length) {
      doc.font(bold).fontSize(12).fillColor(TEXT_DARK).text(t.industries, M, y);
      y = doc.y + 6;
      const labels = product.industries.map((k) => INDUSTRY_LABELS[k]?.[locale] ?? k);
      doc.font(reg).fontSize(10.5).fillColor(TEXT_MID).text(labels.join('   •   '), M, y, { width: contentW });
    }

    // ---------- Footer band ----------
    const fy = doc.page.height - 70;
    doc.rect(0, fy, pageW, 70).fill(BLUE_DARK);
    doc.font(bold).fontSize(10).fillColor('#ffffff').text(t.contact, M, fy + 14);
    doc
      .font(reg)
      .fontSize(9.5)
      .fillColor('#cfe2ff')
      .text('+998 71 200 00 00   •   info@powerautomation.uz   •   @power_automation_bot', M, fy + 30, {
        width: contentW,
      });
    doc.font(reg).fontSize(8).fillColor('#7facdf').text(t.generated, M, fy + 48, { width: contentW });

    doc.end();
    return done;
  }
}
