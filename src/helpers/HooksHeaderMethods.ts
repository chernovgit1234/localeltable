
import { storage } from '../store/index'
import { EnumColumnTableNumber, getFieldNameByColumnNum } from '../enums/EnumColumnValues'
import { fieldsInfoMap } from './ColumnsHelper'
import {EnumTypeField} from '../enums/EnumsByFilter'
import {ISearchByColumnMetadata} from '../types/OtherTypes'
import { EnumEmptyString } from '../enums/EnumsCommon'
import { EnumFieldName} from '../enums/EnumColumnValues'
import { LocalStorageHandler } from '../utils/LocalStorageHandler';
import { instance } from './InstanceHelper'
import { HiddenColumns } from 'handsontable/plugins'
import { IColumnConfifuration } from '@/types/LocalStorageTypes'

export function renderAfterGetColHeader(column: number, td: HTMLTableCellElement, row: number): any {

    const colorGroupRowColumn1 = LocalStorageHandler.getItem('colorGroupRowColumn1') ?? '#ffffff'
	const colorGroupRowColumn2 = LocalStorageHandler.getItem('colorGroupRowColumn2') ?? '#ffffff'
	const colorGroupRowColumn3 = LocalStorageHandler.getItem('colorGroupRowColumn3') ?? '#ffffff'
	
	const headerColumnsConfifuration = LocalStorageHandler.getItem('headerColumnsConfifuration') as IColumnConfifuration

	const isActiveGroupRow = headerColumnsConfifuration?.activeGroupRow
	const isActiveSearchRow = headerColumnsConfifuration?.activeSearchRow

	const visibleOneRow: boolean = (!isActiveGroupRow && !isActiveSearchRow) as boolean
	const visibleTwoRow: boolean = ((!isActiveGroupRow && isActiveSearchRow) || (isActiveGroupRow && !isActiveSearchRow)) as boolean
	const visibleAllRow: boolean = (isActiveGroupRow && isActiveSearchRow) as boolean

	if ((row === 1 && visibleAllRow) || (row === 0 && !isActiveGroupRow && isActiveSearchRow)) {
		//стили для строки поиска
		td.style.cssText = 'position: relative; border-bottom-color: transparent;height: 25px !important;'
	} else {
        //стили для остальных строк
        td.style.cssText = 'position: relative; border-bottom-color: transparent;height: 20px !important;padding: 0 25px;'
	}

	let applied = false
	if (column > EnumColumnTableNumber.Numbs) applied = storage.getters.appliedAutofilterByColNum(column)

	const fieldTypeForHeader: EnumTypeField = fieldsInfoMap.get(column)?.fieldTypeForHeader as EnumTypeField
	const fieldName: EnumFieldName = fieldsInfoMap.get(column)?.fieldName as EnumFieldName
  
	//треугольник в углу
	if (column === EnumColumnTableNumber.Numbs){
		if ((row === 2 && visibleAllRow) || (row === 1 && visibleTwoRow) || (row === 0 && visibleOneRow)) {
			td.style.cssText = 'position: relative; display: grid; place-items: center; cursor: pointer'
			
			if (td.children.length === 1) {
			
				const img = document.createElement("img")
				img.src = require('@/assets/icons/triangle.svg')
				img.style.cssText = 'position: absolute; width: 14px;height: 14px;cursor: default;cursor:pointer;'

				td.appendChild(img)
			}
			
			return td;
		}
		//очистить в строках 0 и 1 , когда все строки активны
		if ((row === 1 && visibleAllRow) || (row === 0 && visibleTwoRow)) {
			td.innerHTML = ''
		}
    }

	//настройка строки 0 групповая
	if (row === 0 && isActiveGroupRow) {
		if ((column >= EnumColumnTableNumber.Name && column <= EnumColumnTableNumber.CostOne) || 
		(column >= EnumColumnTableNumber.CostOne && column <= EnumColumnTableNumber.Present) || 
		(column >= EnumColumnTableNumber.Present)) {
			td.style.cssText = 'border-bottom: 1px solid #cccccc;'
			td.style.borderBottom = '1px solid #cccccc;'
		} 
		if (column >= 1 && column <= 4) {
			td.style.backgroundColor = colorGroupRowColumn1
		} 
		if (column >= 4 && column <= 7) {
			td.style.backgroundColor = colorGroupRowColumn2
		} 
		if (column >= 7) {
			td.style.backgroundColor = colorGroupRowColumn3
		} 

		const imgOld = td.querySelector('img')
		if (imgOld) imgOld.remove()
	}

	//настройка строки ПОИСКА
	const valueSearchedColumn: string = storage.getters.valueSearchedColumn //перем - value поисковика
	if ((row === 1 && visibleAllRow ) || (row === 0 && visibleTwoRow && isActiveSearchRow)) {
		const fieldNameSearchedColumn: string = storage.getters.fieldNameSearchedColumn
		const fieldNameByColumnNum = getFieldNameByColumnNum(column)
		td.innerText = ''

		//отрисовка 1 строки (средней)
		switch (fieldTypeForHeader) {
			case EnumTypeField.String:
			{
				const spanSearch = document.createElement("span")
				spanSearch.classList.add('material-icons-round')
				spanSearch.classList.add('material')

				const input = document.createElement("input") 
				input.type = 'text'
				
				input.style.cssText = 'padding: 0 5px 0 5px; overflow: hidden; text-overflow:ellipsis;  border: 1px solid #e6e6e6; font-size: 12px; position: absolute; width: calc(100% - 36px);max-height: 20px !important; left: 3px;top: 2.5px; color: #474a51; font-family: Roboto400 !important; font-weight: 400 !important;'

				if (fieldNameSearchedColumn && fieldNameSearchedColumn === fieldNameByColumnNum) {
				//если есть активный поиск по колонке 
					spanSearch.innerText = 'close'
					spanSearch.style.cssText = 'position: absolute; width: 23px;height: 23px; right: 3px; top: 2px; color: #474a51; border: 1px solid #e6e6e6;background-color: #ffb961;'
					//f7981d ffb961
					input.value = valueSearchedColumn
					input.title = valueSearchedColumn

					spanSearch.onclick = function(event: Event) {
						//сброс поиска					
						storage.dispatch('resetSearch')
					}
				} else {
					spanSearch.innerText = 'search'
					spanSearch.style.cssText = 'display: grid; place-items: left; position: absolute; width: 20px; height: 20px; right: 3px; top: 2.5px; color: var(--hs-th-color); border: 1px solid #e6e6e6;background-color: var(--ligth-grey-color);'
					
					spanSearch.onclick = function(event: Event) {
						if (!input.value) return
						
						const metadata: ISearchByColumnMetadata = {value: input.value, fieldName: fieldNameByColumnNum, column}
						storage.dispatch('setSearchMetadata', metadata)
					}
					//вставка  input
					
				}

				if ((row === 1 && isActiveGroupRow && isActiveSearchRow ) || (row === 0 && !isActiveGroupRow && isActiveSearchRow ) ) {
					//&& column > EnumColumnTableNumber.Type - удалили из услвоий сверху
					if (td.children.length === 0) {
						td.appendChild(input)
						td.appendChild(spanSearch)
					}
				}	
			}
			break 
			case EnumTypeField.Number:
				{

					/* const summObject = storage.getters.summObject
					const spanSymbol = document.createElement("span")
					const spanResultSumm = document.createElement("span")

					spanSymbol.innerText = '∑'
					spanSymbol.style.cssText = 'position: absolute; top: 3px;left: 4px;font-size: 18px; color: #AFDAFC'
		
					spanResultSumm.style.cssText = 'position: absolute; top: 4px;left: 30%;right: 70%;font-size: 13px; color: #AFDAFC; letter-spacing: 0.3px;font-family: Roboto400'
					
					switch(fieldName) {
						case EnumFieldName.CostOne:
							spanResultSumm.innerText = new Intl.NumberFormat("ru", { style: 'currency', currency: 'RUB' }).format(summObject.CostOneField)
							break
						case EnumFieldName.CostTwo:
							spanResultSumm.innerText = new Intl.NumberFormat("ru", { style: 'currency', currency: 'RUB' }).format(summObject.CostTwoField)
							break
					}

					if ((row === 1 && column > EnumColumnTableNumber.Type && isActiveGroupRow && isActiveSearchRow ) || (row === 0 && column > EnumColumnTableNumber.Type && !isActiveGroupRow && isActiveSearchRow ) ) {
						if (td.children.length === 0) {
							td.appendChild(spanSymbol)
						td.appendChild(spanResultSumm)
						}
						
					} */
				}
				//return td
				break
			case EnumTypeField.Date:
				
				//return td
				break
			case EnumTypeField.Other:
				
				//return td
				break
		}

		const imgOld = td.querySelector('img')
		if (imgOld) imgOld.remove()
    }
	//настройка строки ФИЛЬТРОВ
	if ((row === 2 && visibleAllRow) || (row === 1 && visibleTwoRow) || (row === 0 && visibleOneRow)) {
		const img = document.createElement("img") as HTMLImageElement
		
		applied === true ? img.src = require('@/assets/icons/filter-list-active.svg') : img.src = require('@/assets/icons/filter-list.svg');

		const tooltip = document.getElementById('tooltip-header') as HTMLDivElement
		const hsTable: any = document.getElementById('hs-table')

		//если есть значение, то надо отключить указатель мыши фильтра
		if (valueSearchedColumn) {
			img.style.cssText = 'position: absolute; width: 22px; height: 22px; cursor: default; left: 0px; top: 1.5px'
		} else {
			img.style.cssText = 'position: absolute; width: 22px; height: 22px; cursor: pointer; left: 0px; top: 1.5px'
		}

		img.onclick = function (event: Event) {
			//если поиск актив,то не открывать автофильтр 
			if (valueSearchedColumn) return

			storage.dispatch('selectColumn', column)
			event.stopPropagation()
			tooltip.style.display = 'block'
			tooltip.style.left = `${img.getBoundingClientRect().right + 7}px`
			tooltip.style.top = `${img.getBoundingClientRect().top}px`
		}

		hsTable.onclick = function () {
			tooltip.style.display = 'none'
		}

		document.onmousedown = function () {
			const closeableAutofilter = storage.getters.closeableAutofilter
			if (closeableAutofilter === true) tooltip.style.display = 'none'
		}


		const colHeader = td.querySelector('.colHeader') as HTMLSpanElement
		if (colHeader) colHeader.style.marginTop = '1.5px'

		//чтобы был актиыный фильтр, надо удалить старый и вставить новый активный
		const imgOld = td.querySelector('img')
		if (imgOld) imgOld.remove()
			
		if (!td.querySelector('img') && fieldTypeForHeader !== EnumTypeField.Other) {
			td.appendChild(img)
		}
	}

	//настройка СТРЕЛОК 
	if (visibleAllRow) {
		if (row === 2 && td.classList.contains('beforeHiddenColumn') && td.querySelector('.arrowBeforeHiddenColumn') === null) {
			td = addArrowBeforeHiddenColumnClass(td)
		} else if (row === 0 || row === 1){
			if (td.classList.contains('beforeHiddenColumn')) td.classList.remove('beforeHiddenColumn')	
		}
	} else if (visibleTwoRow) {
		if (row === 1 && td.classList.contains('beforeHiddenColumn') && td.querySelector('.arrowBeforeHiddenColumn') === null) {
			td = addArrowBeforeHiddenColumnClass(td)
		} else if (row === 0){
			if (td.classList.contains('beforeHiddenColumn')) td.classList.remove('beforeHiddenColumn')	
		}
		
	} else {
		//только 1
		td = addArrowBeforeHiddenColumnClass(td)
	}

	function addArrowBeforeHiddenColumnClass(td: any) {
		if (td.classList.contains('beforeHiddenColumn') && td.querySelector('.arrowBeforeHiddenColumn') === null) {
			td.style.position = 'relative'
			const div = document.createElement('div')
			div.addEventListener('click', (event: any) => {
				const hiddenColumnsPlugin = instance.getPlugin('HiddenColumns');
				hiddenColumnsPlugin.showColumn(column+1)
				storage.dispatch('updateShowedColumnsAtColumn', column+1)
				instance.updateSettings({colWidths: [0.1,0.1,0.1]})
			})
			div.classList.add('arrowBeforeHiddenColumn')
			td.append(div)
		} 
		return td
	}

    return td
}