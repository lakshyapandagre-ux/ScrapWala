import Dexie, { Table } from 'dexie';

export interface OutboxItem {
  id?: number;
  entity: 'lot' | 'handover';
  payload: any;
  status: 'pending' | 'synced' | 'failed';
  createdAt: number;
  lastAttemptAt?: number;
  retryCount?: number;
}

export interface LocalLot {
  id?: number;
  lot_id?: string;
  lot_display_id?: string;
  collector_id: string;
  material_category: string;
  approximate_weight: number;
  unit: string;
  status: string;
  gps_lat?: number;
  gps_lng?: number;
  photos: string[];
  valuation?: any;
  idempotency_key: string;
  syncStatus: 'synced' | 'pending' | 'failed';
  created_at: string;
}

class ScrapWalaOfflineDB extends Dexie {
  outbox!: Table<OutboxItem, number>;
  localLots!: Table<LocalLot, number>;

  constructor() {
    super('ScrapWalaDB');
    this.version(1).stores({
      outbox: '++id, entity, status, createdAt',
      localLots: '++id, lot_id, idempotency_key, syncStatus, created_at'
    });
  }
}

export const db = new ScrapWalaOfflineDB();
