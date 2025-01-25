import Handsontable from 'handsontable';
import { reactive } from 'vue';


export let instance: any = reactive<any>({})

export function initInstance(newHandsontable: any) {
    instance = newHandsontable as Handsontable;
}

export function getData() { 
    return instance?.getData(2,2,3,5)   
}

