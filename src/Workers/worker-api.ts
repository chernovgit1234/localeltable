
import * as Comlink from 'comlink'
const  _worker: any = Comlink.wrap(new Worker(new URL("./worker.ts", import.meta.url)));

export const setDataAtRowPropFn = _worker.setDataAtRowPropFn

