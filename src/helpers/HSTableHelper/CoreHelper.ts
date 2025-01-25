
import { storage } from '../../store/index'
import {instance} from '../InstanceHelper'

export function loadData(data: any[]) {
	storage.dispatch('setCountRow', data.length)
	
	const totalSummCostOne = data.reduce((accum: number,item: any) => accum + Number(item.CostOne), 0)
	const totalSummCostTwo = data.reduce((accum: number,item: any) => accum + Number(item.CostTwo), 0)
    storage.dispatch('setSummObject', {CostOneField: totalSummCostOne, CostTwoField: totalSummCostTwo})
	
	instance.loadData(data)
}
export function updateData(data: any[]) {
	storage.dispatch('setCountRow', data.length)
	
	const totalSummCostOne = data.reduce((accum: number,item: any) => accum + Number(item.CostOne), 0)
	const totalSummCostTwo = data.reduce((accum: number,item: any) => accum + Number(item.CostTwo), 0)
    storage.dispatch('setSummObject', {CostOneField: totalSummCostOne, CostTwoField: totalSummCostTwo})
	
	instance.updateData(data)
}
export function clearData() {
	instance.clear()
}
