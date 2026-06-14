import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MeiliSearch, Index } from 'meilisearch';
import type { Product } from '@pa/db';

interface ProductDoc {
  id: number;
  nameUz: string;
  nameRu: string;
  slug: string;
  descriptionUz: string;
  descriptionRu: string;
  categoryId: number;
  brandId: number | null;
  industries: string[];
  certificates: string[];
}

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private client?: MeiliSearch;
  private index?: Index<ProductDoc>;
  private ready = false;

  async onModuleInit(): Promise<void> {
    const host = process.env.MEILI_URL;
    if (!host) {
      this.logger.warn('MEILI_URL not set — search indexing disabled.');
      return;
    }
    try {
      this.client = new MeiliSearch({ host, apiKey: process.env.MEILI_KEY });
      this.index = this.client.index<ProductDoc>('products');
      await this.index.updateSettings({
        searchableAttributes: ['nameUz', 'nameRu', 'descriptionUz', 'descriptionRu'],
        filterableAttributes: ['categoryId', 'brandId', 'industries', 'certificates'],
        sortableAttributes: ['id'],
      });
      this.ready = true;
      this.logger.log('Meilisearch connected.');
    } catch (err) {
      this.logger.warn('Meilisearch unavailable — falling back to DB search.');
    }
  }

  get enabled(): boolean {
    return this.ready;
  }

  private toDoc(p: Product): ProductDoc {
    return {
      id: p.id,
      nameUz: p.nameUz,
      nameRu: p.nameRu,
      slug: p.slug,
      descriptionUz: p.descriptionUz ?? '',
      descriptionRu: p.descriptionRu ?? '',
      categoryId: p.categoryId,
      brandId: p.brandId,
      industries: p.industries,
      certificates: p.certificates,
    };
  }

  async upsert(product: Product): Promise<void> {
    if (!this.index) return;
    await this.index.addDocuments([this.toDoc(product)], { primaryKey: 'id' });
  }

  async remove(id: number): Promise<void> {
    if (!this.index) return;
    await this.index.deleteDocument(id);
  }

  async reindex(products: Product[]): Promise<void> {
    if (!this.index) return;
    await this.index.deleteAllDocuments();
    if (products.length) {
      await this.index.addDocuments(products.map((p) => this.toDoc(p)), { primaryKey: 'id' });
    }
  }

  /** Returns matching product ids in relevance order, or null if disabled. */
  async searchIds(query: string): Promise<number[] | null> {
    if (!this.index || !this.ready) return null;
    const res = await this.index.search(query, { limit: 200 });
    return res.hits.map((h) => h.id);
  }
}
