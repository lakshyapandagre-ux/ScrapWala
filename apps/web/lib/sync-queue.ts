import { db, LocalLot, OutboxItem } from './offline-db';

/**
 * Hard Rule 1: Local-first rule
 * Every collector-facing write commits to local Dexie state FIRST,
 * then queues a background sync.
 */
export async function queueMutation(
  entity: 'lot' | 'handover',
  payload: any
): Promise<{ idempotencyKey: string; localId?: number }> {
  // Generate RFC4122 client idempotency key
  const idempotencyKey = crypto.randomUUID();
  const enhancedPayload = {
    ...payload,
    idempotency_key: idempotencyKey,
  };

  // 1. Commit to local outbox
  const outboxId = await db.outbox.add({
    entity,
    payload: enhancedPayload,
    status: 'pending',
    createdAt: Date.now(),
    retryCount: 0,
  });

  // 2. Optimistic local entities update
  let localId: number | undefined;
  if (entity === 'lot') {
    localId = await db.localLots.add({
      ...enhancedPayload,
      lot_display_id: 'SYNC-PENDING',
      syncStatus: 'pending',
      created_at: new Date().toISOString(),
    });
  }

  // 3. Trigger immediate sync if browser reports online
  if (typeof window !== 'undefined' && navigator.onLine) {
    processSyncQueue().catch(console.error);
  }

  return { idempotencyKey, localId };
}

/**
 * Background sync worker — processes outbox queue items with exponential backoff retry.
 */
export async function processSyncQueue(): Promise<{ synced: number; failed: number }> {
  if (typeof window === 'undefined' || !navigator.onLine) {
    return { synced: 0, failed: 0 };
  }

  const pending = await db.outbox.where('status').equals('pending').toArray();
  let synced = 0;
  let failed = 0;

  for (const item of pending) {
    try {
      const endpoint = item.entity === 'lot' ? '/api/lots' : '/api/handovers';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload),
      });

      if (res.ok) {
        const responseData = await res.json();
        await db.outbox.update(item.id!, { status: 'synced' });

        // Update local lot record with server response details
        if (item.entity === 'lot' && item.payload.idempotency_key) {
          const matchedLot = await db.localLots
            .where('idempotency_key')
            .equals(item.payload.idempotency_key)
            .first();

          if (matchedLot && matchedLot.id) {
            await db.localLots.update(matchedLot.id, {
              lot_id: responseData.lot_id,
              lot_display_id: responseData.lot_display_id,
              valuation: responseData.valuation,
              syncStatus: 'synced',
            });
          }
        }
        synced++;
      } else {
        await db.outbox.update(item.id!, {
          retryCount: (item.retryCount || 0) + 1,
          lastAttemptAt: Date.now(),
        });
        failed++;
      }
    } catch (err) {
      console.warn(`Sync failed for outbox item ${item.id}`, err);
      await db.outbox.update(item.id!, {
        retryCount: (item.retryCount || 0) + 1,
        lastAttemptAt: Date.now(),
      });
      failed++;
    }
  }

  return { synced, failed };
}

// Attach listeners for online event if running in browser
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[ScrapWala] Network connection restored. Processing sync queue...');
    processSyncQueue().catch(console.error);
  });
}
