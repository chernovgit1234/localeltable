
import Handsontable from 'handsontable';
import {EnumTypeBrand, EnumColumnTableNumber} from '../enums/EnumColumnValues'
import highlightWords from 'highlight-words';
import { storage } from '@/store';
import { instance } from './InstanceHelper';
import { IConditionFormattingRules } from '@/types/FormattingTypes';
import { ISearchByColumnMetadata } from '@/types/OtherTypes';

export function renderTestDropdownCell(this: any, instance: Handsontable, td: HTMLTableCellElement, row: number, column: number, prop: string, value: any, cellProperties: any) {
  const arrow = document.createElement("span")
  arrow.classList.add('material-icons-sharp')
  arrow.innerText = 'arrow_drop_down'
  arrow.style.cssText = 'position: absolute; font-size: 20px;right: 1px; top: -2px; color:#474a51'

  const div: HTMLDivElement = document.createElement('div') as HTMLDivElement
  div.style.cssText = 'background-color:#e8eaed;border-radius:12px;position:absolute;inset:0;top:2.5px;height:16px;width: 98%;left: 2px'

  td.style.cssText ='height:20px;position:relative;'

  const span = document.createElement('span')
  span.style.cssText='display: block; margin-top: -2.5px; margin-left: 5px; width: 87%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;'
  span.innerText = value

  const rules: IConditionFormattingRules[] | undefined = storage.getters.getRulesByColumn(column)

  if (rules && rules.length) {
    rules.slice().reverse().forEach((rule: IConditionFormattingRules) => {
      if (eval(`${rule.jsCode}`)) {  

        for (const [key, value] of Object.entries(rule.style)) {
          div.style.setProperty(`${key}`, `${value}`, 'important');
        }
      }
    })
  }

  Handsontable.renderers.DropdownRenderer.apply(this, [instance, td, row, column, prop, value, cellProperties])

  div.append(span)
  div.append(arrow)
  td.append(div)
  
  return td
}
export function renderTestCheckboxCell(this: any, instance: Handsontable, td: HTMLTableCellElement, row: number, column: number, prop: string, value: any, cellProperties: any) {
  td.innerText = value

  const rules: IConditionFormattingRules[] | undefined = storage.getters.getRulesByColumn(column)

  if (rules && rules.length) {
    rules.slice().reverse().forEach((rule: IConditionFormattingRules) => {
      if (eval(`${rule.jsCode}`)) {  

        for (const [key, value] of Object.entries(rule.style)) {
          td.style.setProperty(`${key}`, `${value}`, 'important');
        }
      }
    })
  }

  Handsontable.renderers.CheckboxRenderer.apply(this, [instance, td, row, column, prop, value, cellProperties]);
  return td
}
export function renderTestCell(td: HTMLTableCellElement, value: any, row: number, column: number) {
  
  td.innerText = value
  
  const rules: IConditionFormattingRules[] | undefined = storage.getters.getRulesByColumn(column)

  if (rules && rules.length) {
    rules.slice().reverse().forEach((rule: IConditionFormattingRules) => {
      if (eval(`${rule.jsCode}`)) {  

        for (const [key, value] of Object.entries(rule.style)) {
          td.style.setProperty(`${key}`, `${value}`, 'important');
        }
      }
    })
  }

  return td
}
export function renderTextCell(instance: Handsontable, td: HTMLTableCellElement, value: any, row: number, column: number) {

  td.innerHTML = ''

  const text: string = value
  const query = (storage.getters.columnSearchMetadata as ISearchByColumnMetadata).value
  const columnSearched = (storage.getters.columnSearchMetadata as ISearchByColumnMetadata).column

  if (columnSearched === column) {
    const chunks: any = highlightWords({text, query, matchExactly: true })
  
    const createItem = (text: string, match: boolean, index: any) => {
    const el: HTMLSpanElement = document.createElement('span')
  
    if (text === query || (!match && text === query)) {
      el.style.backgroundColor = '#ffff00'
    }
  
    el.innerHTML = text
    el.id = index
  
    return el
  }
  
  if (chunks.length) {
    chunks.forEach((el: any, match: boolean, index: any) => {
      td.appendChild(createItem(el.text, match, index))
    })
  } else {
    td.innerText = value
  }
  } else {
    td.innerText = value
  }

  const tooltip = document.getElementById('tooltip-text') as HTMLDivElement
  const canvas: any = document.getElementById('canvas-ht')
  const ctx = canvas.getContext('2d')

  td.onmouseover = function () {
    const valueWidth: number = ctx.measureText(value).width + 50
    const tdWidth: number = td.offsetWidth
    if (valueWidth < tdWidth) return

    const overWidth =  td.getBoundingClientRect().right + tdWidth >  document.documentElement.offsetWidth
    
    if (overWidth === true) {
      tooltip.style.right = `${document.documentElement.offsetWidth - td.getBoundingClientRect().left}px`
      tooltip.style.left = 'auto'
      tooltip.style.maxWidth = `${document.documentElement.offsetWidth - td.getBoundingClientRect().left + tdWidth}px`
    } else {
      tooltip.style.left = `${td.getBoundingClientRect().right}px`
      tooltip.style.right = 'auto'
      tooltip.style.maxWidth = `${document.documentElement.offsetWidth - td.getBoundingClientRect().right -20}px`
    }

    tooltip.style.display = 'block'
    tooltip.innerHTML = td.innerHTML.toString()
    tooltip.style.top = `${td.getBoundingClientRect().top}px`
  }

  td.onmouseout = function () {
    tooltip.style.display = 'none'
    tooltip.innerHTML = ''
  }
  
  const rules: IConditionFormattingRules[] | undefined = storage.getters.getRulesByColumn(column)

  if (rules && rules.length) {
    rules.slice().reverse().forEach((rule: IConditionFormattingRules) => {
      if (eval(`${rule.jsCode}`)) {  
        for (const [key, value] of Object.entries(rule.style)) {
          td.style.setProperty(`${key}`, `${value}`, 'important');
        }
      }
    })
  }

  return td
}

/* export function renderTdCommon(instance: Handsontable,row: number,col: number, td: HTMLTableCellElement, value: string): HTMLTableCellElement {
  const div: HTMLDivElement = document.createElement('div') as HTMLDivElement
  td.innerHTML = ''

  const typeProject: string = instance.getDataAtCell(row, EnumColumnTableNumber.Type)

  td.style.zIndex = '1'
  td.style.position = 'relative'
  td.style.padding = '0px'
  td.style.margin = '0px'

  div.style.paddingLeft = '4px'
  div.style.overflow = 'hidden'
  div.style.textOverflow = 'ellipsis'
  div.style.textAlign = 'left'
  
  if (typeProject === EnumTypeBrand.brand) {
    div.style.zIndex = '-1'
    div.style.backgroundColor = '#eceff1'
  }

  const text: string = value
  const query: string = storage.getters.valueSearchedColumn.trim()
  const chunks: any = highlightWords({
    text, query, matchExactly: true
  })

  const createItem = (text: string, match: boolean, index: any) => {
    const el: HTMLSpanElement = document.createElement('span')

    if (text === query || (!match && text === query)) {
      el.style.backgroundColor = '#ffff00'
    }

    el.innerHTML = text
    el.id = index

    return el
  }

  if (chunks.length) {
    chunks.forEach((el: any, match: boolean, index: any) => {
      div.appendChild(createItem(el.text, match, index))
    })
  } else {
    div.innerText = value
  }
  
  td.prepend(div)
  return td
} */

/* export async function renderTypeNumber( row: number,col: number, td: HTMLTableCellElement, value: number,prop: string, error?: boolean) {
  if (error === true) {
    td.style.backgroundColor = '#ff6666'
    td.style.transition = 'all 0.3s ease 0s'
    
  } else {
    td.style.backgroundColor = 'white'
    td.style.transition = 'all 0.3s ease 0s'
    td.style.position='relative'
  }
  
  td.style.verticalAlign = 'middle'
  td.style.textAlign = 'right'

  td.innerText = new Intl.NumberFormat("ru", { style: 'currency', currency: 'RUB' }).format(value)
  const isActiveFormula: IUserFormula | undefined = (storage.getters.formulasList as Map<number, IUserFormula>).get(col)
  
  if (isActiveFormula) {
    const span: HTMLSpanElement = document.createElement('div') as HTMLDivElement
    span.innerText = `fx`
    span.style.cssText = 'color: #bababa;position: absolute;height: 100%; left: 2px; top: -3px; font-family: LibertinusSans-Italic !important'
    td.prepend(span)
  }

  return td
}

export function renderTypeDropdown( row: number, td: HTMLTableCellElement, value: string, error?: boolean): HTMLTableCellElement {

  if (error === true) {
    td.style.backgroundColor = '#ff6666'
    td.style.transition = 'all 0.3s ease 0s'
  } else {
    td.style.backgroundColor = 'white'
    td.style.transition = 'all 0.3s ease 0s'
  }

  td.style.verticalAlign = 'middle'
  
  td.innerText = value

  return td
} */
