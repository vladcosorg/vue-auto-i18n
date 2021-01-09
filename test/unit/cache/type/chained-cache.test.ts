import { CacheKey } from '../../../../src/cache/cache-key'
import { ChainedCache } from '../../../../src/cache/type/chained-cache'
import { InMemoryCache } from '../../../../src/cache/type/in-memory-cache'

test('When a value is found in a "slower" cache, it is raised to all previous caches', () => {
  const fastCache = new InMemoryCache()
  const slowCache = new InMemoryCache()
  const cacheKey = new CacheKey('foo')
  const chain = new ChainedCache(fastCache, slowCache)

  slowCache.set(cacheKey, 'bar')
  chain.get(cacheKey)
  expect(fastCache.get(cacheKey)).toEqual('bar')
})
