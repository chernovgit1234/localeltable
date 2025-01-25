import {EnumColumnNumber, EnumColumnName, EnumColumnTableNumber, EnumFieldName, EnumColumnNameRange} from '../enums/EnumColumnValues'
import {EnumTypeCell, EnumTypeField} from '../enums/EnumsByFilter'

import {reactive, ref} from 'vue'

export interface IField {
	fieldName: EnumFieldName,
	fieldType: EnumTypeField,
	typeCell?: EnumTypeCell,
	fieldTypeForHeader: EnumTypeField,
	columnName: string,
	colNum: number,
	options?: any[]
} 

export interface IPropsRangeNameMapValue {
	fieldName: EnumFieldName,
	psevdoName: string,
	type: string,
	rangeName: EnumColumnNameRange
	
} 

export const nestedHighHeaderGroup = reactive([ 
	{ label: ''},
	{ label: 'Группа колонок 1', colspan: 3 },
	{ label: 'Группа колонок 2', colspan: 4 },
	{ label: 'Группа колонок 3', colspan: 2 }
])

export const nestedHighHeader: EnumColumnName[] = [ 
	/* EnumColumnName.Guid, */
	EnumColumnName.Type,
	EnumColumnName.Name,
	EnumColumnName.Brand,
	EnumColumnName.ProductionDate,
	EnumColumnName.CostOne,
	EnumColumnName.CostTwo,
	EnumColumnName.Percent,
	EnumColumnName.Present,
	EnumColumnName.Status,
	EnumColumnName.Comments  
]

export const nestedHighHeaderRange: EnumColumnNameRange[] = [ 
	/* EnumColumnNameRange.Guid, */
	EnumColumnNameRange.Type,
	EnumColumnNameRange.Name,
	EnumColumnNameRange.Brand,
	EnumColumnNameRange.ProductionDate,
	EnumColumnNameRange.CostOne,
	EnumColumnNameRange.CostTwo,
	EnumColumnNameRange.Percent,
	EnumColumnNameRange.Present,
	EnumColumnNameRange.Status,
	EnumColumnNameRange.Comments  
]

export const nameFieldsArray: EnumFieldName[] = [ 
	EnumFieldName.Type,
	EnumFieldName.Name,
	EnumFieldName.Brand,
	EnumFieldName.ProductionDate,
	EnumFieldName.CostOne,
	EnumFieldName.CostTwo,
	EnumFieldName.Percent,
	EnumFieldName.Present,
	EnumFieldName.Status,
	EnumFieldName.Comments  
]

export const nestedSearchRowHeader = nestedHighHeader.length
//export const nestedSearchRowHeader = reactive<any[]>(new Array(nestedHighHeader.length)); 

export const propsRangeNameMap: Map<string, string> = new Map([
	[EnumColumnNameRange.Type, EnumFieldName.Type],
	[EnumColumnNameRange.Name, EnumFieldName.Name],
	[EnumColumnNameRange.Brand, EnumFieldName.Brand],
	[EnumColumnNameRange.ProductionDate, EnumFieldName.ProductionDate],
	[EnumColumnNameRange.CostOne, EnumFieldName.CostOne],
	[EnumColumnNameRange.CostTwo, EnumFieldName.CostTwo],
	[EnumColumnNameRange.Percent, EnumFieldName.Percent],
	[EnumColumnNameRange.Present, EnumFieldName.Present],
	[EnumColumnNameRange.Status, EnumFieldName.Status],
	[EnumColumnNameRange.Comments, EnumFieldName.Comments]
])


export const propsRangeNameMapFull: Map<EnumColumnNameRange, IPropsRangeNameMapValue> = new Map([
	[
		EnumColumnNameRange.Type, 
		{
			rangeName: EnumColumnNameRange.Type,
			fieldName: EnumFieldName.Type,
			psevdoName: 'AAAA',
			type: 'String'
		}
	],
	[
		EnumColumnNameRange.Name, 
		{
			rangeName: EnumColumnNameRange.Name,
			fieldName: EnumFieldName.Name,
			psevdoName: 'BBBB',
			type: 'String'
		}
	],
	[
		EnumColumnNameRange.Brand, 
		{
			rangeName: EnumColumnNameRange.Brand,
			fieldName: EnumFieldName.Brand,
			psevdoName: 'CCCC',
			type: 'String'
		}
	],
	[
		EnumColumnNameRange.ProductionDate, 
		{
			rangeName: EnumColumnNameRange.ProductionDate,
			fieldName: EnumFieldName.ProductionDate,
			psevdoName: 'DDDD',
			type: 'Date' //временно тип число вместо строки
		}
	],
	[
		EnumColumnNameRange.CostOne, 
		{
			rangeName: EnumColumnNameRange.CostOne,
			fieldName: EnumFieldName.CostOne,
			psevdoName: 'EEEE',
			type: 'Number'
		}
	],
	[
		EnumColumnNameRange.CostTwo, 
		{
			rangeName: EnumColumnNameRange.CostTwo,
			fieldName: EnumFieldName.CostTwo,
			psevdoName: 'FFFF',
			type: 'Number'
		}
	],
	[
		EnumColumnNameRange.Percent, 
		{
			rangeName: EnumColumnNameRange.Percent,
			fieldName: EnumFieldName.Percent,
			psevdoName: 'GGGG',
			type: 'Number'
		}
	],
	[
		EnumColumnNameRange.Present, 
		{
			rangeName: EnumColumnNameRange.Present,
			fieldName: EnumFieldName.Present,
			psevdoName: 'HHHH',
			type: 'Boolean'
		}
	],
	[
		EnumColumnNameRange.Status, 
		{
			rangeName: EnumColumnNameRange.Status,
			fieldName: EnumFieldName.Status,
			psevdoName: 'JJJJ',
			type: 'String'
		}
	],
	[
		EnumColumnNameRange.Comments, 
		{
			rangeName: EnumColumnNameRange.Comments,
			fieldName: EnumFieldName.Comments,
			psevdoName: 'KKKK',
			type: 'String'
		}
	]
])

export function getRusNameByColNum(cols: number[]): any[] {
	return [...Array.from([...new Set(cols)])].filter(el=>el!==-1).map(col=> {
        const obj = fieldsInfoMap.get(col)
		if (obj) return {name: obj.columnName, icon: getIconName(obj.fieldType), type: obj.fieldType, colNum: col }
	})
}

export function getFieldType(name: EnumColumnName) {
    return Array.from(fieldsInfoMap.values()).find(el=>el.columnName===name)?.fieldType
}

export function getColNum(name: EnumColumnName): number {
    return Array.from(fieldsInfoMap.values()).find(el=>el.columnName===name)?.colNum as number
}

export function getIconName(type: EnumTypeField) {
	if (type === EnumTypeField.Number) {
		return '123'
	} else if (type === EnumTypeField.String) {
		return 'format_size'
	} else if (type === EnumTypeField.Boolean) {
		return 'flaky'
	} else if (type === EnumTypeField.Date) {
		return 'calendar_today'
	} else {
		return 'star'
	}



}
export function getRusNames(): any[] {
	return [...Array.from(fieldsInfoMap.values())].map(value=> {
		return {name: value.columnName, type: value.fieldType}
	})
}
export const fieldsInfoMap = <Map<EnumColumnTableNumber, IField>> (new Map([
	[
		EnumColumnTableNumber.Type,
		{
			fieldName: EnumFieldName.Type,
			fieldTypeForHeader: EnumTypeField.String,
			fieldType: EnumTypeField.String,
			columnName: EnumColumnName.Type,
			colNum: EnumColumnNumber.Type,
			typeCell: EnumTypeCell.String
		} 
	],
	[
		EnumColumnTableNumber.Name,
		{
			fieldName: EnumFieldName.Name,
			fieldTypeForHeader: EnumTypeField.String,
			fieldType: EnumTypeField.String,
			columnName: EnumColumnName.Name,
			colNum: EnumColumnNumber.Name,
			typeCell: EnumTypeCell.String
		} 
	],
	[
		EnumColumnTableNumber.Brand,
		{
			fieldName: EnumFieldName.Brand,
			fieldTypeForHeader: EnumTypeField.String,
			fieldType: EnumTypeField.String,
			columnName: EnumColumnName.Brand,
			colNum: EnumColumnNumber.Brand,
			options: ['Hyundai Motors', 'Audi', 'BMW', 'Ferrari', 'Ford', 'General Motors', 'Honda', 'Infiniti', 'Lexus', 'Mazda', 'Mercedes-Benz', 'Nissan', 'Mitsubishi Motors', 'Porsche', 'Subaru','Tata Motors','Toyota','Volkswagen','Volvo'],
			typeCell: EnumTypeCell.Dropdown
		}
	],
	[
		EnumColumnTableNumber.ProductionDate,
		{
			fieldName: EnumFieldName.ProductionDate,
			fieldType: EnumTypeField.Date,
			fieldTypeForHeader: EnumTypeField.Date,
			columnName: EnumColumnName.ProductionDate,
			colNum: EnumColumnNumber.ProductionDate,
			typeCell: EnumTypeCell.Date,
		} 
	],
	[
		EnumColumnTableNumber.CostOne,
		{
			fieldName: EnumFieldName.CostOne,
			fieldType: EnumTypeField.Number,
			fieldTypeForHeader: EnumTypeField.Number,
			columnName: EnumColumnName.CostOne,
			colNum: EnumColumnNumber.CostOne,
			typeCell: EnumTypeCell.Number,
		} 
	],
	[
		EnumColumnTableNumber.CostTwo,
		{
			fieldName: EnumFieldName.CostTwo,
			fieldType: EnumTypeField.Number,
			fieldTypeForHeader: EnumTypeField.Number,
			columnName: EnumColumnName.CostTwo,
			colNum: EnumColumnNumber.CostTwo,
			typeCell: EnumTypeCell.Number,
		} 
	],
	[
		EnumColumnTableNumber.Percent,
		{
			fieldName: EnumFieldName.Percent,
			fieldType: EnumTypeField.Number,
			fieldTypeForHeader: EnumTypeField.Number,
			columnName: EnumColumnName.Percent,
			colNum: EnumColumnNumber.Percent,
			typeCell: EnumTypeCell.Number,
		} 
	],
	[
		EnumColumnTableNumber.Present,
		{
			fieldName: EnumFieldName.Present,
			fieldType: EnumTypeField.Boolean,
			fieldTypeForHeader: EnumTypeField.Boolean,
			columnName: EnumColumnName.Present,
			colNum: EnumColumnNumber.Present,
			typeCell: EnumTypeCell.Boolean,
		} 
	],
	[
		EnumColumnTableNumber.Status,
		{
			fieldName: EnumFieldName.Status,
			fieldType: EnumTypeField.String,
			fieldTypeForHeader: EnumTypeField.String,
			columnName: EnumColumnName.Status,
			colNum: EnumColumnNumber.Status,
			typeCell: EnumTypeCell.Dropdown,
			options: ['активный', 'аннулирован', 'возвращен', 'завершен']

		} 
	],
	[
		EnumColumnTableNumber.Comments,
		{
			fieldName: EnumFieldName.Comments,
			fieldType: EnumTypeField.String,
			fieldTypeForHeader: EnumTypeField.String,
			columnName: EnumColumnName.Comments,
			colNum: EnumColumnNumber.Comments,
			typeCell: EnumTypeCell.String,
		} 
	]
]) ) 
