type CacheEntry = {
  value: any;
  expiresAt: number | null;
};

class InMemoryCache {
  private store: Map<string, CacheEntry> = new Map();
  private hits = 0;
  private misses = 0;

  get(key: string) {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses += 1;
      return undefined;
    }
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.misses += 1;
      return undefined;
    }
    this.hits += 1;
    return entry.value;
  }

  set(key: string, value: any, ttlSeconds?: number) {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, { value, expiresAt });
  }

  del(key: string) {
    this.store.delete(key);
  }

  // delete keys that start with a prefix
  delPrefix(prefix: string) {
    for (const key of Array.from(this.store.keys())) {
      if (key.startsWith(prefix)) this.store.delete(key);
    }
  }

  clear() {
    this.store.clear();
  }

  getStats() {
    return {
      hits: this.hits,
      misses: this.misses,
      keys: this.store.size,
    };
  }
}

export default new InMemoryCache();
