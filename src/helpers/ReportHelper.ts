
import { instance } from './InstanceHelper'
import XLSXtypes from 'xlsx/types';
import XLSX from 'xlsx';
import {listEnumColumnName, EnumColumnTableNumber, EnumFieldName} from '../enums/EnumColumnValues'
import {loadData} from './HSTableHelper/CoreHelper'

export async function importExcelReport() {
    const pickerOpts: any = {
        types: [
            {
                description: "docs",
                accept: {
                    "docs/*": [".xlsx", ".xls"],
                },
            },
        ],
        excludeAcceptAllOption: true,
        multiple: false
    };

    try {
        const [fileHandle] = await window.showOpenFilePicker(pickerOpts)

        const fileData = await fileHandle.getFile();
        const file = await fileData.arrayBuffer();

        const workbook: XLSXtypes.WorkBook = XLSX.read(file);
        const sheetName: string = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        const rawData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
        const table = XLSX.utils.sheet_to_html(worksheet);
        
        //slice(1) чтобы отсечь строки с названиями колонок
        const dataLoad: any = rawData.slice(EnumColumnTableNumber.Type).map((row: any) => {
            return {
               /*  Guid: row[EnumColumnTableNumber.Guid], */
                Type: row[EnumColumnTableNumber.Type], 
                Name: row[EnumColumnTableNumber.Name], 
                Brand: row[EnumColumnTableNumber.Brand], 
                ProductionDate: row[EnumColumnTableNumber.ProductionDate], 
                CostOne: row[EnumColumnTableNumber.CostOne], 
                CostTwo: row[EnumColumnTableNumber.CostTwo], 
                Percent: row[EnumColumnTableNumber.Percent], 
                Present: row[EnumColumnTableNumber.Present], 
                Status: row[EnumColumnTableNumber.Status],
                Comments: row[EnumColumnTableNumber.Comments]
            }
        })
        
        //получение таблицы в виде html
        
        console.log('sheet_to_html', table)
        //loadData(dataLoad)
    } catch (error) {
        console.log('error', error)
    }
}

export function exportExcelReport() {
    const data: any[] = (instance?.getData()).map((item: any[]) => {
        //все поля кроме Guid
        //return item.slice(1)
        return item
    }) 

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Лист 1");
    //slice(1) потому что не нужна колонка для Guid, так как их нет в выгрузке 
    //XLSX.utils.sheet_add_aoa(worksheet, [listEnumColumnName.slice(1)], { origin: "A1" });
    XLSX.utils.sheet_add_aoa(worksheet, [listEnumColumnName], { origin: "A1" });
    //let columnsWidth: any[] = listEnumColumnName.slice(1).map((el) => {
        const columnsWidth: any[] = listEnumColumnName.map((el) => {
        return { wch: 20 }
    })
    
    worksheet["!cols"] = columnsWidth;
    
    XLSX.writeFile(workbook, "Конфигурация 1.xlsx", { compression: true });
}

