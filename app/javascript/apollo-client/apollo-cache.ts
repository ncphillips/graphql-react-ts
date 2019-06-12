import { InMemoryCache, defaultDataIdFromObject } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";

const cache = new InMemoryCache({
  dataIdFromObject(object) {
    return defaultDataIdFromObject(object);
  }
});

declare let window: any;
const ORG_ID = window.orgId;

persistCache({
  cache,
  storage: window.localStorage,
  key: `apollo:${ORG_ID}`
});

export default cache;
