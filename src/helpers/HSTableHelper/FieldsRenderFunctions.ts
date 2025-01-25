import Handsontable from "handsontable";
import {renderTestCell,renderTestCheckboxCell,renderTextCell, renderTestDropdownCell} from '../Renderers'

export function renderTest(instance: Handsontable, td: HTMLTableCellElement, row: number, col: number, prop: string, value: any): any {
    return renderTestCell(td, value, row, col)
}
export function renderText(instance: Handsontable, td: HTMLTableCellElement, row: number, col: number, prop: string, value: any): any {
    return renderTextCell(instance, td, value, row, col)
}
export function renderTestCheckbox(instance: Handsontable, td: HTMLTableCellElement, row: number, col: number, prop: string, value: any, cellProperties: any): any {
    return renderTestCheckboxCell(instance, td, row, col, prop,value, cellProperties)
}
export function renderTestDropdown(instance: Handsontable, td: HTMLTableCellElement, row: number, col: number, prop: string, value: any, cellProperties: any): any {
    return renderTestDropdownCell(instance, td, row, col, prop,value, cellProperties)
}
