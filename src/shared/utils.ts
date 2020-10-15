/**
 * Async variation of the Array.map method
 * @param arr The array to map
 * @param asyncCallback The async callback method
 */
export async function asyncMap<T = any, R = any>(arr: T[], asyncCallback: (el: T) => Promise<R>): Promise<R[]> {
  const promises = arr.map(asyncCallback);
  return Promise.all(promises);
}