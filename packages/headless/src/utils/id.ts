/**
 * Returns a unique global id string
 */
// ⚠️ we make use of an IIFE to encapsulate the globalCounter so it can never accidentally be used somewhere else.
const nextId = (() => {
  let globalCounter = 0;
  return () => globalCounter++;
})();

/**
 * Creates a globally unique string using a counter.
 * The given name is the prefix.
 */
export const createId = (name: string) => `${name}-${nextId()}`;
