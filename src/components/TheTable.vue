<template>
    <div class="table-wrapper">
		<div class="table-wrapper__board" @mousedown="closeContextMenu()">
		
		<TheTabPanelFormulaTest></TheTabPanelFormulaTest> 
		<!-- <div class="table-wrapper__board-left">
			<span class="table-wrapper__text">Показано строк: {{ countRowComputed }}</span>
		</div> -->
		<!-- <the-fast-filters
		@sort="sort" 
		@resetFastFilter="clearAllFilter()"
		></the-fast-filters> -->
			
		<!-- <div class="table-wrapper__board-right">
		<div class="icon-wrapper-with-tooltip" v-if="fastFilterNames.length">
			<img style="width: 100%;height: 100%;" class="cursor-carret_none" src="../assets/icons/filter-edit.svg" @click.stop />
			<q-tooltip class="custom-tooltip" >
			<span class="cursor-carret_none">Управление быстрыми фильтрами</span><br/>
			</q-tooltip>
		</div>
		<div class="icon-wrapper-with-tooltip" v-if="isHaveActiveFilter && thereIsAnActiveFastFilter === false">
			<img style="width: 100%;height: 100%;" class="cursor-carret_none" src="../assets/icons/filter-add.svg" @click.stop="addGlobalFilter()"/>
			<q-tooltip class="custom-tooltip"  >
			<span class="cursor-carret_none">Добавить быстрый фильтр</span><br/>
			</q-tooltip>
		</div>
		<img v-else class="cursor-carret_none disabled-element" src="../assets/icons/filter-add-freeze.svg" @click.stop/>
		<div class="icon-wrapper-with-tooltip" v-if="isHaveActiveFilter">
			<img style="width: 100%;height: 100%;" class="cursor-carret_none" src="../assets/icons/filter-remove.svg" @click.stop="clearAllFilter()"/>
			<q-tooltip class="custom-tooltip" >
			<span class="cursor-carret_none">Сбросить все фильтры</span><br/>
			</q-tooltip>
		</div>

		</div> -->
		</div>
		<div class="table-wrapper__table" id="hs-table-container">
			<TheContextMenu 
				id="context-menu" 
				v-show="visibleContextMenu"
				:selectColumn="selectColumn"
				:selectRow="selectRow"
				@showStoryRowFromContextMenu="showStoryRow"
				@deleteRowsFromContextMenu="deleteRows"
				@hiddenColumnsHideFromContextMenu="hiddenColumnsHide"
				@applyFormulaFromContextMenu="applyFormulaFromContextMenu"
				@resetFormulaFromContextMenu="resetFormulaFromContextMenu"
			></TheContextMenu>
			<TheValidPopup></TheValidPopup>
			<div id="tooltip-text"></div>
			<div id="hs-table" oncontextmenu="return!1"></div>
			<div id="tooltip-header">
				
			<the-autofilter 
				@click.stop 
				@sort="sort"
				@updateAfterClearAutofilter="updateAfterClearAutofilter"
				:valuesAutofilter="valuesAutofilter"
				:applliedAutofilter="applliedAutofilter"
			>
			</the-autofilter>
			</div>
			<canvas v-show="false" id="canvas-ht"></canvas>
		</div>
    </div>
</template>
<script lang="ts" setup>
import axios from 'axios'
import {nestedHighHeader,nestedHighHeaderGroup,nestedSearchRowHeader, fieldsInfoMap, propsRangeNameMap, IField} from '../helpers/ColumnsHelper'
import {EnumTypeBrand, EnumTypeBrandRow, EnumColumnName, EnumColumnNumber, EnumFieldName, EnumColumnTableNumber, listEnumColumnName} from '../enums/EnumColumnValues'
import { renderAfterGetColHeader } from '../helpers/HooksHeaderMethods' 
import { visibleContextMenu, visibleSidebar } from '@/helpers/States/StateDialogs';
import TheMainPresets from './TheMainPresets.vue'
import TheFastFilters from './TheFastFilters.vue'
import TheAutofilter from './TheAutofilter.vue'
import TheContextMenu from './TheContextMenu.vue'
import TheValidPopup from './TheValidPopup.vue'

import { IModelData } from '../types/TableTypes' 
import { useStore } from 'vuex'
import Handsontable from "handsontable";
import { onMounted, ref, reactive, computed, defineEmits, toRaw, watch} from 'vue';
/* import { registerAllModules } from 'handsontable/registry'; */
import 'handsontable/dist/handsontable.full.css';

import {IAutofilter} from '../types/AutofilterTypes'
import {EnumRuleAutofilter, EnumTypeField} from '../enums/EnumsByFilter'
import {EnumEmptyString, ISearchByColumnMetadata} from '../types/OtherTypes'
import ContentControllerUrls from '../Urls/ContentUrls'
import 'handsontable/languages/ru-RU'
import { utils, writeFileXLSX } from 'xlsx';
import XLSXtypes from 'xlsx/types';
import XLSX from 'xlsx';
import {instance, initInstance} from '../helpers/InstanceHelper'
import { LocalStorageHandler } from '../utils/LocalStorageHandler';
import TheTabPanelFormulaTest from './TabsComponents/TheTabPanelFormulaTest.vue'
import { IUserFormula } from '@/helpers/HSFormula/Types'
import {loadData, updateData} from '../helpers/HSTableHelper/CoreHelper'
import { renderTestDropdown , renderTest,renderText, renderTestCheckbox} from '../helpers/HSTableHelper/FieldsRenderFunctions'
import {beforeChangeHook, afterChangeHook} from '../helpers/HooksChangeDataMethods'
import { EnumMouseClick } from '@/enums/EnumsCommon'
import {setDataAtRowPropFromContextMenu} from '@/helpers/HSFormula/analizatorFormula/CalculateMethods'
import { IColumnConfifuration } from '@/types/LocalStorageTypes'
import { visibleDropDownMenu, visibleDropDownSettingsMenu } from '@/helpers/States/StateDialogs'
import { dataValue } from '@/store/Data';
import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

const emit = defineEmits([
	'changeTableSize', 
	'showPopupCreateFilterName',
	'showPopupShowStoryRow'
])

const store = useStore()

const fastFilterNames = computed<string[]>(() => store.getters.fastFilterNames)
const hiddenColumns = computed(() => store.getters.hiddenColumns)
const isHaveActiveFilter = computed(() => store.getters.isHaveActiveFilter)
const thereIsAnActiveFastFilter = computed(() => store.getters.thereIsAnActiveFastFilter)
const selectedColumn = computed(() => store.getters.selectedColumn)
const columnSearchMetadata = computed(() => store.getters.columnSearchMetadata)
const posFixedColumn = ref((LocalStorageHandler.getItem('posFixedColumn')))
const showGroupRowLocal = ref((LocalStorageHandler.getItem('headerColumnsConfifuration') as IColumnConfifuration).activeGroupRow)  
const showSearchRowLocal = ref((LocalStorageHandler.getItem('headerColumnsConfifuration') as IColumnConfifuration).activeSearchRow)

const nestedHeadersComputed = computed(() => {
	if (showGroupRowLocal.value === true && showSearchRowLocal.value === true) {
	return [nestedHighHeaderGroup,nestedSearchRowHeader, nestedHighHeader]
	} else if (showGroupRowLocal.value === false && showSearchRowLocal.value === true) {
		return [nestedSearchRowHeader, nestedHighHeader]
	} else if (showGroupRowLocal.value === true && showSearchRowLocal.value === false) {
		return [nestedHighHeaderGroup, nestedHighHeader]
	} else {
		return [nestedHighHeader]
	}
})

onMounted(() => {
	window.addEventListener("visibilitychange", function() {
		if (document.hidden){
			visibleContextMenu.value = false
			visibleDropDownMenu.value = false
			if (visibleDropDownSettingsMenu.value) visibleDropDownSettingsMenu.value = false
		}
	});

	getData()
})

watch(hiddenColumns, (hiddenColumns: number[]) => {	
	updateSettingHiddenColumns(hiddenColumns)
})
watch(columnSearchMetadata, (newValue: ISearchByColumnMetadata) => {	
	search(newValue)
})

//перем. для управления пропсом в быстр фильтр
let valuesAutofilter = ref<any[]>([])
let applliedAutofilter = ref<boolean | null>(null)
let selectRow = ref(0)
let selectColumn = ref(0)
let highlightedRows = ref(1)
let highlightedColumns = ref(1)
let idsDeletedRows = ref<string[]>([])

function closeContextMenu() {
    visibleContextMenu.value = false
}

function updateSettingHiddenColumns(hiddenColumns: number[]) {
	const hiddenColumnsPlugin = instance.getPlugin('HiddenColumns');
	let activeColumns: number[] = [...fieldsInfoMap.keys()].reduce( (acc: number[], item: number) => {
		if (!hiddenColumns.includes(item)) acc.push(item); 
			return acc;
	} , []);

	//показ активных и скрытие неактивныхv текст
	hiddenColumnsPlugin.showColumns(activeColumns)
    hiddenColumnsPlugin.hideColumns([...hiddenColumns])

	//формальное обновление
	instance.updateSettings({colWidths: [0.1,0.1,0.1]})
}

function hiddenColumnsHide() {
//закрыть контекстное меню
	let selectedColumnsLocal: number[] = []
	let selectedRangeLocal: any[] = instance.getSelectedRange() as any[]

	selectedRangeLocal.forEach((range: any) => {
		let from = Number(range.from.col)
		let to = Number(range.to.col)

		if (from === to) {
		selectedColumnsLocal.push(from)
		} else {
			for (var i = from; i <= to; i++) {
				selectedColumnsLocal.push(i)
			}
		}
	})

    let selectedColumns = [...new Set(selectedColumnsLocal)]
	//актуализация пресета
	store.dispatch('updateHiddenColumnsForActivePreset', selectedColumns)
	//обновление настройки 
	updateSettingHiddenColumns(selectedColumns)
}

function hiddenColumnsShow() {
	let selectedColumnsLocal: number[] = []
	let selectedRangeLocal: any[] = instance.getSelectedRange() as any[]

	selectedRangeLocal.forEach((range: any) => {
		let from = Number(range.from.col)
		let to = Number(range.to.col)
		//только диапазоны
		if (from !== to) {
			for (var i = from; i <= to; i++) {
				selectedColumnsLocal.push(i)
			}
		}
	})

	let selectedColumns = [...new Set(selectedColumnsLocal)]
	//актуализация пресета
	store.dispatch('updateShowedColumnsForActivePreset', selectedColumns)
	//отображение колонок
	const hiddenColumnsPlugin = instance.getPlugin('HiddenColumns');
	hiddenColumnsPlugin.showColumns(selectedColumns)
	//формальное обновление
	instance.updateSettings({colWidths: [0.1,0.1,0.1]})
}

function applyFormulaFromContextMenu() {
    setDataAtRowPropFromContextMenu(selectColumn.value)
}
function resetFormulaFromContextMenu() {
	store.dispatch('deleteFormulaObject', selectColumn.value as EnumColumnTableNumber )

	setTimeout(() => {
		//переотрисовать колонку, формальный способ , хак
		instance.updateSettings({colWidths: [0.1,0.1,0.1]})
	});
}

  let isReturnSelection = ref(false)
	async function deleteRows(selectedRows: number[]) {

		//const selectedRows: number[] = [...new Set(options.map((el: any) => el.end.row as number))] as number[]
		if (!confirm(`Вы действительно хотите удалить выбранные строки (${selectedRows.length})?`)) return

		const guidsRows: string[] = selectedRows.map((row: number) => instance.getDataAtCell(row, EnumColumnTableNumber.Guid))
		const idxsRows = selectedRows.map((row: number) => [row, 1])

		//let succesResponse: Awaited<Promise<boolean>> = await deleteRowsFetch(guidsRows)
		//если запрос неудачный то отмена
		//if (!succesResponse) return
		await instance.alter('remove_row', idxsRows)
    //блокировка afterSelection
    isReturnSelection.value = true
    console.log('alter(remove_row')
    //после удаления закрыть меню и очистить выбранные строки
    closeContextMenu()
    store.dispatch('clearSelectedRowsRange')
    
		if (dataValue.length !== instance.countRows()) {
			//если есть отбор
			guidsRows.forEach((guid: string) => {
				const idxRowByGuid: number = dataValue.findIndex((value: IModelData) => value.Guid === guid)
				dataValue.splice(idxRowByGuid, 1) 
			})
		}
	}
	
	
const columnsSettings = ref([
	{ data: EnumFieldName.Type, readOnly: false, width: 100, renderer: 'renderText' },
	{ data: EnumFieldName.Name, width: 200, readOnly: false, renderer: 'renderText'},
	{ data: EnumFieldName.Brand,
		readOnly: false,
		width: 350,
		type: 'dropdown',
		source: fieldsInfoMap.get(EnumColumnTableNumber.Brand)?.options,
		strict: true,
		filter: true,
		sortByRelevance: true,
		trimDropdown: true,
		renderer: 'renderTestDropdown',
	},
	{ data: EnumFieldName.ProductionDate,width: 350, readOnly: false, type: 'date',dateFormat: 'YYYY-MM-DD',correctFormat: true,
		defaultDate: new Date(),
		renderer: 'renderTest',
		datePickerConfig: {
			firstDay: 0,
			showWeekNumber: true
		}
	},
	{ data: EnumFieldName.CostOne, readOnly: false, width: 350, type: "numeric", renderer: 'renderTest'},
	{ data: EnumFieldName.CostTwo, readOnly: false, width: 350, type: "numeric", renderer: 'renderTest'},
	{ data: EnumFieldName.Percent, width: 350, type: "numeric", renderer: 'renderTest', readOnly: false},
	{ data: EnumFieldName.Present, readOnly: false, width: 50, type: 'checkbox',renderer: 'renderTestCheckbox' ,checkedTemplate: 'true',uncheckedTemplate: 'false',
	},
	{   data: EnumFieldName.Status, 
		readOnly: false,
		width: 350,
		type: 'dropdown',
		source: fieldsInfoMap.get(EnumColumnTableNumber.Status)?.options,
		strict: true,
		filter: true,
		sortByRelevance: true,
		trimDropdown: true,
		renderer: 'renderTestDropdown',
	},
	{ data: EnumFieldName.Comments, width: 350, readOnly: false, renderer: 'renderText',}
])
	
	function initCustomData() {
		dataValue.forEach((row: IModelData, index: number) => {
			row.ProductionDate = String(String(row.ProductionDate).slice(0, 10))
		})
	}

	async function getData() {
			
		initCustomData()
		
		await store.dispatch('initAutofilter', dataValue)
		
		const container: HTMLElement | null = document.getElementById("hs-table");

		Handsontable.renderers.registerRenderer('renderTest', renderTest)
		Handsontable.renderers.registerRenderer('renderText', renderText)
		Handsontable.renderers.registerRenderer('renderTestDropdown', renderTestDropdown)
		Handsontable.renderers.registerRenderer('renderTestCheckbox', renderTestCheckbox)

		if (container) {
			initInstance(new Handsontable(container, hotSettings) as Handsontable)
		}
		
		loadData(dataValue)
		//выбор ячейки
		//instance.selectCell(10, 4)
	}

	function showStoryRow(idRow: string) {
		closeContextMenu()
		emit('showPopupShowStoryRow', idRow)
	}

    function search(columnSearchMetadata: ISearchByColumnMetadata) {
		//начать поиск если есть данные для поиска value не falsy
		if (columnSearchMetadata !== null && columnSearchMetadata.value !== EnumEmptyString.EmptyStringValue) {
			//перед поиском очистить все фильтры
			clearAllFilterBeforeStartSearch()

			const fileldName: any = toRaw(columnSearchMetadata.fieldName)
			const searchValue: string = toRaw(columnSearchMetadata.value).toLocaleLowerCase()
			//columnSearchMetadata 
			let sort = [...dataValue]
			sort = sort.filter((el: any) => (~el[fileldName].toLocaleLowerCase().indexOf(searchValue)) )
			
			loadData(sort)
		} else {
			loadData(dataValue)
		}
	}

	function sort(autofilterList:  Map<number | string, IAutofilter>) {
	//нужно сделать поиск 
		let sort = [...dataValue]
	
		for (let elFilter of autofilterList.values() ) {
			
			if (elFilter.applied === true) {

				const rule: string = elFilter.appliedRule
				const fileldType: EnumTypeField = elFilter.fieldType
				
				sort = sort.filter((el: any) => {
					switch (fileldType) {
						case  EnumTypeField.String:
							//замена "Пустые строки" на ""
							{
								const inxEmptyString: number = elFilter.values.indexOf(EnumEmptyString.EmptyString)
								if (~inxEmptyString) {
									elFilter.values[inxEmptyString] = EnumEmptyString.EmptyStringValue
								}

								if (elFilter.values.some((searchvalue: string) => searchvalue === el[elFilter.columnName])) {
									return el
								}
							}
							break
						case  EnumTypeField.Number:
						{
							const minValue = elFilter.values[0]
							const maxValue = elFilter.values[1]
                            const dataValue = el[elFilter.columnName]

							switch (rule) {
								case  EnumRuleAutofilter.equally:
									if (Number(dataValue) === Number(minValue)) {
										return el
									}
								break
								case  EnumRuleAutofilter.morethan:
									if (Number(dataValue) > Number(minValue)) {
										return el
									}
								break
								case  EnumRuleAutofilter.lessthan:
									if (Number(dataValue) < Number(minValue)) {
										return el
									}
								break
								case  EnumRuleAutofilter.between:
									if (Number(dataValue) >= Number(minValue) && Number(dataValue) <= Number(maxValue)) {
										return el
									}
								break
							}
						}
						break
						case  EnumTypeField.Date:
						{
							//для isRangeRuleType === false min и max это одно и то же число
							//для isRangeRuleType === true min и max это разные
							let minValue = elFilter.filterValues[0].split('/').join('-')
							let maxValue = elFilter.filterValues[1].split('/').join('-')
							const timeMinValue = new Date(minValue).getTime()
							const timeMaxValue = new Date(maxValue).getTime()
							const dataValue = new Date(el[elFilter.columnName]).getTime()

							//значения null пропускаются
							if (el[elFilter.columnName] === null) return

							switch (rule) {
								case  EnumRuleAutofilter.equally:
								case  EnumRuleAutofilter.today:
								case  EnumRuleAutofilter.tomorrow:
								case  EnumRuleAutofilter.yesterday:
									if (dataValue === timeMinValue) {
										return el
									}
									break
								case  EnumRuleAutofilter.after:
									if (dataValue > timeMinValue) {
										return el
									}
									break
								case  EnumRuleAutofilter.before:
									if (dataValue < timeMinValue) {
										return el
									}
									break
								case  EnumRuleAutofilter.between:
								case  EnumRuleAutofilter.upthisweek:
								case  EnumRuleAutofilter.thismonth:
								case  EnumRuleAutofilter.thisyear:
									if (timeMinValue <= dataValue && timeMaxValue >= dataValue) {
										return el
									}
									break
							}
						}
						break
					}
				})
			}
		}
		
		//обновляем автофильтры и шапку и загружаем в таблицу данные
		loadData(sort)
		store.dispatch('updateAutofilter', sort)
		
		///актуализация данных (values) последнего выбранного автофильтра
		actualizationValuesAutofilterLocal()
		
		updateHeaderSettingsWithoutChange()
		
    }
	function updateHeaderSettingsWithoutChange() {
		///переотрисовка шапки без изменений
		instance.updateSettings({colWidths: [0.1,0.1,0.1]})
	}

    function actualizationValuesAutofilterLocal() {
		///актуализация данных (values) последнего выбранного автофильтра
		valuesAutofilter.value = (store.getters.autofilterByColNum(selectedColumn.value) as IAutofilter).values
	}
	function actualizationAppliedAutofilterLocal() {
		///актуализация  (appllied) последнего выбранного автофильтра
		applliedAutofilter.value = false
	}
	
    function updateAfterClearAutofilter(newObject: IAutofilter) {
	
		let columnName = newObject.columnName
		/* let columnNum = newObject.columnNum */

		let sort = [...dataValue]
		let autofilterList: Map<number, IAutofilter> = store.getters.autofilterList

		for (let elFilter of autofilterList.values()) {
        if (columnName !== elFilter.columnName) {
				if (elFilter.applied === true) {
                    
					const rule: string = elFilter.appliedRule
					const fileldType: EnumTypeField = elFilter.fieldType

					sort = sort.filter((el: any) => {
						switch (fileldType) {
							case  EnumTypeField.String:
								
								//замена "Пустые строки" на ""
								{
									const inxEmptyString: number = elFilter.filterValues.indexOf(EnumEmptyString.EmptyString)
									if (~inxEmptyString) {
										elFilter.filterValues[inxEmptyString] = EnumEmptyString.EmptyStringValue
									}

									if (elFilter.filterValues.some((searchvalue: string) => searchvalue === el[elFilter.columnName])) {
										return el
									}
								}
								break
							case  EnumTypeField.Number:
							{
								const minValue = elFilter.values[0]
								const maxValue = elFilter.values[1]
								const dataValue = el[elFilter.columnName]
							
								switch (rule) {
									case  EnumRuleAutofilter.equally:
										if (Number(dataValue) === Number(minValue)) {
											return el
										}
									break
									case  EnumRuleAutofilter.morethan:
										if (Number(dataValue) > Number(minValue)) {
											return el
										}
									break
									case  EnumRuleAutofilter.lessthan:
										if (Number(dataValue) < Number(minValue)) {
											return el
										}
									break
									case  EnumRuleAutofilter.between:
										if (Number(dataValue) >= Number(minValue) && Number(dataValue) <= Number(maxValue)) {
											return el
										}
									break
								}
							}
							break
							case  EnumTypeField.Date:
						{
							//для isRangeRuleType === false min и max это одно и то же число
							//для isRangeRuleType === true min и max это разные
							let minValue = elFilter.filterValues[0].split('/').join('-')
							let maxValue = elFilter.filterValues[1].split('/').join('-')
							const timeMinValue = new Date(minValue).getTime()
							const timeMaxValue = new Date(maxValue).getTime()
							const dataValue = new Date(el[elFilter.columnName]).getTime()

							//значения null пропускаются
							if (el[elFilter.columnName] === null) return

							switch (rule) {
								case  EnumRuleAutofilter.equally:
								case  EnumRuleAutofilter.today:
								case  EnumRuleAutofilter.tomorrow:
								case  EnumRuleAutofilter.yesterday:
									if (dataValue === timeMinValue) {
										return el
									}
									break
								case  EnumRuleAutofilter.after:
									if (dataValue > timeMinValue) {
										return el
									}
									break
								case  EnumRuleAutofilter.before:
									if (dataValue < timeMinValue) {
										return el
									}
									break
								case  EnumRuleAutofilter.between:
								case  EnumRuleAutofilter.upthisweek:
								case  EnumRuleAutofilter.thismonth:
								case  EnumRuleAutofilter.thisyear:
									if (timeMinValue <= dataValue && timeMaxValue >= dataValue) {
										return el
									}
									break
							}
						}
						break
						}
					})
				}
		}
		}

		loadData(sort)
		store.dispatch('updateAutofilter', sort)

		actualizationValuesAutofilterLocal()
    
		let newObjectAutofilter = {
			...newObject,
			filterValues: [],
			values: valuesAutofilter.value
		}

		store.dispatch('updateObjectAutofilter', newObjectAutofilter)
		
        //при сбросе фильтра values не должен быть пучтым [] 
		updateHeaderSettingsWithoutChange()
	}

	function addGlobalFilter() {
		emit('showPopupCreateFilterName')
	}
	function clearAllFilterBeforeStartSearch() {
		if (thereIsAnActiveFastFilter.value === true) {
			store.dispatch('deactivatedFastFilter')
		}  
		
		if (isHaveActiveFilter.value === true){
			
			store.dispatch('deactivatedAutofilters')

			store.dispatch('updateAutofilter', dataValue)
			actualizationValuesAutofilterLocal()
		actualizationAppliedAutofilterLocal()
		}

		//обнов шапку
		updateHeaderSettingsWithoutChange()
	}
	function clearAllFilter() {

		//убрать признак активности быстрого фильтра (сработало только если оно первее выполняется в коде)
		if (thereIsAnActiveFastFilter.value === true) {
			store.dispatch('deactivatedFastFilter')
		}

		loadData(dataValue)
		
		if (thereIsAnActiveFastFilter.value === false) {
			store.dispatch('deactivatedAutofilters')
		}

		store.dispatch('updateAutofilter', dataValue)

		actualizationValuesAutofilterLocal()
		actualizationAppliedAutofilterLocal()

		//обнов шапку
		updateHeaderSettingsWithoutChange()
		
	}

	const visibleUpperPanel = computed(() => store.getters.visibleUpperPanel)
	let htHeight = ref(visibleUpperPanel.value ? window.innerHeight - 130 : window.innerHeight - 85)
	let htWidth = ref(window.innerWidth)
	
	watch(visibleSidebar, (value: any) => {
		htWidth.value = value === true ? window.innerWidth - 335 : window.innerWidth
		instance.updateSettings({height: htHeight.value, width: htWidth.value})
	})
	watch(visibleUpperPanel, (value: any) => {
		htHeight.value = value === true ? window.innerHeight - 130 : window.innerHeight - 85
		instance.updateSettings({height: htHeight.value, width: htWidth.value})
	})

	let isEditByFormula = ref(false)
	let selectedRowsRange = ref<any[]>([])
	let selectedRowsLocal = ref<any[]>([])


	const hotSettings: any = reactive({ 
		afterScroll: (_:any)=>{
            store.dispatch('resetValid')
		},
		
		beforeChange: (changes: any[], source:any) => {
			return beforeChangeHook(changes, selectColumn.value)
		},
		beforeAutofill: function(selectionData: any, sourceRange: any, targetRange: any, direction: string) {

			/* if ( 
				selectColumn.value === EnumColumnTableNumber.Type ||
				selectColumn.value === EnumColumnTableNumber.Comments) {
				return false
			}

			let fromRow = targetRange.from.row
			let toRow = targetRange.to.row
			let typeProject: string = instance.getDataAtCell(selectRow.value, EnumColumnTableNumber.Type)
			
			if (fromRow <= toRow) {
				for (var i = fromRow; i <= toRow; i++) {
					let typeProject: string = instance.getDataAtCell(i, EnumColumnTableNumber.Type)

					if (
						typeProject === EnumTypeBrand.brand && (
						selectColumn.value === EnumColumnTableNumber.Name
					)) {
						instance.setCellMeta(i, selectColumn.value, 'readOnly', true)
					}
				}
			} */
		},
		beforePaste: function(data: any[], coords: any[]) {
			/* console.log('beforePaste', data)
			console.log('coords', coords) */
			//НЕ ИСПОЛЬЗУЕТСЯ. ВСЁ В beforeChange
			
			/* let lengthRow: number = data.length
            let startRow: number = coords[0].startRow
			let startCol: number = coords[0].startCol
			let endRow: number = startRow + lengthRow - 1
            
            if (
				startCol === EnumColumnTableNumber.Type ||
				startCol === EnumColumnTableNumber.Comments) {
				return false
			}

			for (var i = startRow; i <= endRow; i++) {
				let typeProject: string = instance.getDataAtCell(i, 1)
				if (
					typeProject === EnumTypeBrand.brand && (
					selectColumn.value === EnumColumnTableNumber.Name
				)) {
					instance.setCellMeta(i, selectColumn.value, 'readOnly', true)
				}
			} */
		},

		columnSorting: false,
		outsideClickDeselects: false,
        copyPaste: true,
		undo: true,
		redo: true,
		fragmentSelection: false,
		fillHandle: 'vertical',
		data: dataValue,
		rowHeaders: true,
		colHeaders: true,
		nestedHeaders: nestedHeadersComputed.value,
		fixedColumnsStart: posFixedColumn.value,
		height: htHeight,
		width: htWidth,
		/* columnSorting: {
			indicator: true, // disable indicator for the first column,
			sortEmptyCells: false,
			headerAction: true, // clicks on the first column won't sort
		}, */
		activeHeaderClassName: 'activeHeaderClass',
		currentRowClassName: 'currentRowClass',
		currentHeaderClassName: 'currentHeaderClass',
		currentColClassName: 'currentColClass',
		invalidCellClassName: 'invalidCellClassName',
		//readOnlyCellClassName: 'readOnlyCellClassName',
		readOnlyCellClassName: 'is-readOnly',
		placeholderCellClassName: 'has-placeholder',
		className: "custom-class-name",
		persistentState: true,
		/* contextMenu: contextMenu, */
		manualColumnResize: true,
		autoRowSize: false,
        autoColumnSize: false,
		rowHeights: 16,
		autoWrapRow: true,
		autoWrapCol: true,
		manualRowMove: true,
		columns: columnsSettings,
		hiddenColumns: {
			columns: hiddenColumns,
			indicators: true,
			copyPasteEnabled: false
		},
		collapsibleColumns: false,
		renderAllColumns: false,
		licenseKey: 'non-commercial-and-evaluation',
		language: 'ru-RU',
		afterOnCellMouseUp,

		afterGetColHeader: (column: number, td: HTMLTableCellElement, row: number) => renderAfterGetColHeader(column, td, row),
		afterRemoveRow: function(index: any, amount: any, physicalRows: any, source: any) {
			//перед удалением строки посчитать строки
			store.dispatch('setCountRow',  instance.countRows())
		},
		beforeCreateRow: (index: any, amount: any, source: any) => source === 'Autofill.fill' ? false : true,
		afterChange: (changes: any[], source: any) => {
		//*работа с формулами после редактирования 
			if (isEditByFormula.value === true) {
				//если изменение был по формуле , то сброс хука 
				isEditByFormula.value = false
				return
			} else {
				//работа с формулами после редактирования 
				if (changes) afterChangeHook(changes)
			}
		},
    
		
		afterSetDataAtRowProp: function() {
			//если код попал сюда то было изменение через метод SetDataAtRowProp 
			isEditByFormula.value = true
		},
		beforeSelectRows: (from: any, to: any, highlight: any) => {
			//не блокировать afterSelection
			//console.log('beforeSelectRows')
			isReturnSelection.value = false
		},
		afterSelection: function(row: number, column: number) {
			//console.log('11afterSelection', row)
			setTimeout(() => {
			if (isReturnSelection.value === true) return 
			selectedRowsLocal.value = (instance.getSelected() as any[]).map(item => item[0])
			
			store.dispatch('setSelectedRow', selectedRowsLocal.value)
			selectRow.value = row
			selectColumn.value = column
			//не удалять!!!
			store.dispatch('setSelectedData', {row, column})
			});
			
			/* //selectColumn
			store.dispatch('selectColumn', column) */
			
		},
		beforeHighlightingRowHeader: function(row: number, headerLevel: any, highlightMeta: any) {
			//изза этого 
			//if (codeMouseClick.value === EnumMouseClick.Right) return  
				store.dispatch('setHighlightedDataByRow', {row: row, selectionHeight: highlightMeta.selectionHeight})
				highlightedRows.value = Number(highlightMeta.selectionHeight)
			},
		beforeHighlightingColumnHeader: function(column: number, headerLevel: any, highlightMeta: any) {
			/* console.log('beforeHighlightingColumnHeader', column) */
			//if (codeMouseClick.value === EnumMouseClick.Right) return 
			store.dispatch('setHighlightedDataByColumn', {column: column, selectionWidth: highlightMeta.selectionWidth})
			highlightedColumns.value = Number(highlightMeta.selectionWidth)
		},

		beforeBeginEditing,
		beforeOnCellMouseDown,

        disableVisualSelection: false
	})

    const countRowComputed = computed(() => store.getters.countRow)

    let codeMouseClick = ref<number>(EnumMouseClick.Left)

	function afterOnCellMouseUp(event: any, coords: any, td: HTMLTableCellElement, controller: any) {
		console.log('afterOnCellMouseUp')
		if (coords.col === -1) return
		const contextMenu = document.getElementById('context-menu')
		
		if (event.button == EnumMouseClick.Right) {
			codeMouseClick.value = EnumMouseClick.Right
			visibleContextMenu.value = true

			if (contextMenu && (event.clientY || event.clientX) !== 0) {
				if (window.innerWidth - event.clientX > contextMenu.offsetWidth + 10) {
				contextMenu.style.left = `${event.clientX+1}px`
				} else {
				contextMenu.style.left = `${event.clientX - contextMenu.offsetWidth + 1}px`
				}

				if (window.innerHeight - event.clientY > contextMenu.offsetHeight + 10) {
				contextMenu.style.top = `${event.clientY+1}px`
				} else {
				contextMenu.style.top = `${event.clientY - contextMenu.offsetHeight + 1}px`
				}
			}
		} else {
			codeMouseClick.value = EnumMouseClick.Left
			visibleContextMenu.value = false

			//перезапись номера колонки выше только при левой кнопке мыши  (для всех строк)
			store.dispatch('setSelectedColumn', coords.col)

			//перезапись номера колонки выше только при левой кнопке мыши (только для строк шапки)
			if (coords.row < 0) store.dispatch('setSelectedColumnHeaderClickLeft', coords.col)
		}

		//запись текущей колонки для правой и левой кнопки
		store.dispatch('setSelectedColumnCommonUse', coords.col)
		
	}
	
	function beforeBeginEditing(row: number, col: number) {
		//console.log('BeginEditing')
		/* let typeProject: string = instance.getDataAtCell(row, EnumColumnTableNumber.Type)
		if (typeProject === EnumTypeBrand.brand) {
			instance.setCellMeta(row, col, 'readOnly', true)
			return false
		} */
	}
	function beforeOnCellMouseDown(event: any, coords: any, td: HTMLTableCellElement, controller: any) {
		/* console.log('OnCellMouseDown') */
		/* let typeProject: string = instance.getDataAtCell(coords.row, EnumColumnTableNumber.Type)
		let col = coords.col
		let row = coords.row

		if (typeProject === EnumTypeBrand.brand && col === EnumColumnTableNumber.Name) {
			console.log('setCellMeta')
			instance.setCellMeta(row, col, 'readOnly', true)
		} */
	}
</script>

<style lang="scss">

.ht__manualRowMove--backlight {
  height: 20px !important;
  color: red !important;
  background-color: #f9a21d;
}
.ht__manualRowMove--guideline {
  color: rgb(255, 0, 0) !important;
  background-color: #f9a21d;
}
.corner {
  background-color: #0b57d0 !important;
  border-radius: 100% !important;
}
//#4b89ff
//#1a73e8
/* .htBorders .wtBorder  {
  z-index: 103 !important;
} */

.htBorders .fill {
	background-color: transparent !important;
	outline-style: dashed;
	outline-color: #aaa8a8;
	outline-color: #aaa8a8;
	z-index: 102 !important;
	outline-width: 0.1px;
}

.htDatepickerHolder .pika-title{
color: #202124 !important;
font-family: GoogleSans-Medium !important;
} 
.htDatepickerHolder .pika-button {
color: #202124 !important;
font-family: GoogleSans-Medium !important;
background-color: #fafafa!important;  
} 

.htDatepickerHolder .pika-button:hover {
color: #ffffff !important;
background-color: #1976d2!important;  
} 

.ht_clone_top_left_corner::after, .ht_clone_inline_start::after {
content: '' !important;
position: absolute !important;
height: 100% !important;
right: -1px;
top: 0 !important;
border-right:4px solid #c7c7c7;
z-index: 100 !important;
/* display: none; */
}

.htFocusCatcher {
  border: 1px solid red !important; 
}
.currentRowClass  .rowHeader {
  font-weight: bold;
}
.currentColClass  .colHeader {
  font-weight: bold;
}
.arrowAfterHiddenColumn:hover {
  border: 1px solid #202124 !important;
  background-color: white !important;
}
.arrowBeforeHiddenColumn:hover {
  border: 1px solid #202124 !important;
  background-color: white !important;
}
.afterHiddenColumn .arrowAfterHiddenColumn {
  width: 20px !important;
  min-height: 12px !important; 
  position: absolute !important; 
  left: 0px !important; 
  top: 7px !important; 
  z-index: 100 !important;
  cursor: pointer;
  position: relative;
}

.beforeHiddenColumn .arrowBeforeHiddenColumn {
  width: 20px !important;
  min-height: 12px !important; 
  position: absolute !important; 
  right: 0px !important; 
  top: 7px !important; 
  z-index: 100 !important;
  cursor: pointer;
  position: relative;
}

.arrowAfterHiddenColumn:after {
  content: "▶";
  position: absolute;
  top: -4px;
  left: 1px;
  font-size: 6px;
  display: none;
}
.arrowBeforeHiddenColumn:before {
  content: "◀";
  right: 6px;
  top: -4px;
  position: absolute;
  font-size: 6px;
  display: none;
}
.arrowBeforeHiddenColumn:hover:after {
  transition: all 0.2s ease 0s;
  display: block;
}
.arrowAfterHiddenColumn:hover:after {
  transition: all 0.2s ease 0s;
  display: none;
}

tr[aria-rowindex="1"] th.afterHiddenColumn::before,
tr[aria-rowindex="2"] th.afterHiddenColumn::before,
tr[aria-rowindex="3"] th.afterHiddenColumn::before {
  display: none !important;
}


.handsontable tr[aria-rowindex="1"] th.beforeHiddenColumn::after,
.handsontable tr[aria-rowindex="2"] th.beforeHiddenColumn::after,
.handsontable tr[aria-rowindex="3"] th.beforeHiddenColumn::after {
  color: #202124 !important;
  width: 10px !important;
  z-index: 100 !important;
  height: 20px;
  right: 0 !important;
  cursor: pointer;
}

.handsontable tr[aria-rowindex="1"] th.afterHiddenColumn::before,
.handsontable tr[aria-rowindex="2"] th.afterHiddenColumn::before,
.handsontable tr[aria-rowindex="3"] th.afterHiddenColumn::before {
  color: transparent !important;
  width: 10px !important;
  z-index: 100 !important;
  height: 20px;
  left: 0 !important;
  cursor: pointer !important;
  z-index: 0 !important;
}

.handsontable *, .handsontable :focus-visible {
  transition: none !important;
}

.area {
 background-color: rgba(0, 166, 255, 0.011) !important;
}

.htCheckboxRendererInput {
	-webkit-appearance: none !important;
	background-color: var(--ligthest-grey-color) !important;
	border: 1px solid #cacece !important;
	cursor: pointer;
	padding: 0px 8px 3px 8px !important;
	border-radius: 3px !important;
	display: inline-block !important;
	position: relative !important;
	margin-top: -2.5px !important	;
}

.htCheckboxRendererInput:checked {
	background-color: #e9ecee !important;
	border: 1px solid #adb8c0 !important;
	color: var(--dark-icon-color) !important;
}
.htCheckboxRendererInput:checked:after {
	content: '\2714' !important;
	font-size: 13px !important;
	position: absolute !important;
	top: -2px !important;
	left: 3px !important;
	color: var(--dark-icon-color) !important;
}
.handsontableInput {
    resize: both !important;
}
.has-placeholder {
color: rgba(255, 255, 255, 0.37) !important;
}

.htItemWrapper:hover{
	background-color: rgb(245, 245, 245) !important;
}
.htItemWrapper {
	cursor: pointer !important;
	margin: -4px -6px 0px -6px !important;
	padding: 7px 12px 7px 8px !important;
	text-align: left !important;
	background-color: #fff !important;
	font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
	font-size: 12px !important;
}
.htCommentTextArea {
	font-family: 'Roboto400' !important;
	font-weight: 400 !important;
	min-width: 500px !important;
	min-height: 100px !important;
	max-width: 600px !important;
	max-height: 700px !important;
	background-color: white;
	font-size: 16px !important;
	-webkit-box-shadow: 0px 0px 6px 2px rgba(34, 60, 80, 0.18) !important;
	-moz-box-shadow: 0px 0px 6px 2px rgba(34, 60, 80, 0.18) !important;
	box-shadow: 0px 0px 6px 2px rgba(34, 60, 80, 0.18) !important;
	padding: 12px !important;
	border-radius: 4px !important;
	letter-spacing: 0.5px;
}

.htAutocompleteArrow {
	color: #d1d2d3 !important;
}

/* .is-readOnly {
background-color: #eceff1 !important;
background-color: #1f9ff5 !important;
color: #1f9ff5 !important;
} */

/* .invalidCellClassName {
background-color: #ff0000 !important;
} */
#tooltip-header {
background-color: rgb(255, 255, 255);
padding: 5px;
z-index: 1001 !important;
position: fixed;
display: none;

height: auto;
width: auto;
white-space: normal !important;
-webkit-box-shadow: 0px 0px 6px 2px rgba(34, 60, 80, 0.18);
-moz-box-shadow: 0px 0px 6px 2px rgba(34, 60, 80, 0.18);
box-shadow: 0px 0px 6px 2px rgba(34, 60, 80, 0.18);
}
.material {
font-style: normal !important;
color: var(--main-text-color);
}

.material:hover {
font-style: normal !important;
color: #6eaecc ;
cursor: pointer !important;
}

.table-wrapper {
  /* border: 1px solid red; */
	background-color: #fff !important;
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 3px;
}
.table-wrapper__table {
  
}
.table-wrapper__board {

  /* border: 1px solid red;  */
	padding: 3px 10px 0px 10px;
  
	display: flex;
	align-items: center;
	flex-direction: row;
	justify-content: space-between;
}
.table-wrapper__board-right {
	display: flex;
	flex-direction: row;
	gap: 18px;
	font-style: normal !important;
  height: 34px;
}
.table-wrapper__text {
	color: var(--main-text-color);
	font-family: 'Roboto400';
	white-space: nowrap;
	user-select: none;
}

/* .activeHeaderClass {
  background-color: #2c7cfd !important;
} */
.handsontable th {
	background-color: white;
	vertical-align: middle;
  position: relative;
  color: #202124 !important;
  font-family: GoogleSans-Regular !important; 
  z-index: 10 !important;
}

.colHeader {
  vertical-align: middle !important;
  color: #202124 !important;
  font-family: GoogleSans-Regular !important; 
  font-size: 11px !important;
  text-transform: uppercase;
  letter-spacing: 0.3px !important;
}
.currentHeaderClass {
  background-color: #d3e3fd !important;
}

.activeHeaderClass {
	background-color: #0b57d0 !important;
}

.activeHeaderClass span {
  color: #ffffff !important;
}

.handsontable td {
  cursor: cell !important;
  border-color: #e1e1e1 !important;
}
.handsontable td br {
	display: none !important;
}
.handsontable td,
.handsontable tr {
	overflow: hidden !important;
	text-overflow: ellipsis !important;
	text-align: center !important;
	vertical-align: central !important;
	height: 16px !important;
  max-height: 16px !important;
	white-space: nowrap  !important; 
	-webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  font-family: Arial-Regular !important;

}

.wtHider {
  border-bottom: 1px solid #cccccc !important; 
}

#tooltip-text {
  word-break:break-all;
  background-color: white !important;
  font-size: 13px;
  letter-spacing: 0.25px !important;
  padding: 8px 10px;
  z-index: 1000 !important;
  position: fixed;
  display: none;
  max-width: 100%;
  height: auto;
  font-family: Arial-Regular !important;
  color: #202124;
  
  -webkit-box-shadow: 0px 0px 10px 2px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 0px 10px 2px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 0px 10px 2px rgba(34, 60, 80, 0.2);
  user-select: none;
  border-radius: 4px;
}

  </style>
