<style lang="scss">

.form-create-rule {
    &__body {
        margin-top: 10px;
        padding: 0 15px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    &__label-section {
        color: #3c4043;
        font-family: Roboto700;
        font-size: 14px;
        font-weight: 500;
        display: block;
        margin-bottom: 8px;
    }

    &__label {
    }

    &__label-small {
        color: #646464;
        font-family: Roboto400;
        font-size: 12px;
        line-height: 14px;
        display: block;
        margin-bottom: 6px;
    }

    &__format-section {
    }
}

.inputs-section {
    margin-top: 8px;

    &__text-type {
        width: 75%;
    }

    &__date-type {
        width: 75%;
    }

    &__text-number {
        width: 45%;
    }

    &__date-numbers {
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }
}

.form-format-section {

    &__format-picker {
    
        height: 36px; 
        width: 100%;
        background-color: #afdafc;
        text-align: center;
        padding: 5px;
        font-family: Roboto400;
        user-select: none;
        border: 1px solid #d8d8d8;
        color: rgb(0, 0, 0);
        border-radius:  4px 4px 0 0 !important;

        span {
            display: inline-block;
            vertical-align: middle;
        } 
    }


    &__pickers-body {

    }
    &__format-menu-setting {

    }
}

.format-menu-setting {
    min-height: 38px;
    background-color: #fff;
    border: 1px solid #d8d8d8;
    border-radius: 0 0 4px 4px !important;
    border-top: none;
    box-sizing: border-box;
    margin: 6px 0;
    margin-top: 0;
    padding: 0 2px;
    width: 100%;
    display: flex;
    align-items: center;

    &__body {
        padding: 5px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        gap:2px;
    }

    &__btns {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap:2px;
    }

    &__img-body {
        cursor: pointer;
        border-radius: 4px;
        padding: 2px 2px 1px 2px;
        background-color: transparent;

        &:hover {
            background-color: #dfe5eb !important;
            transition: background-color 0.2s ease 0s;
        }

        &_btn-wrapper {
            background-color: transparent;
            width: 24px;
            height: 24px;
        }
    }

    &__img {
        
    }

    &__pickers {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap:2px;
    }
}

.action-section {
    &__body {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }
}


</style>

<template>
    <div class="form-create-rule">
        <div class="form-create-rule__body">
            <div>
                <span class="label-section">Применить к столбцу</span>
                <q-select 
                    outlined
                    v-model="appliedFieldName" 
                    :options="fieldNames" 
                    dense 
                    options-dense
                    disable-tab-selection
                ></q-select>
            </div>
            <div>
                <span class="label-section">Правила форматирования</span>
                <span class="label-small">Применить форматирование, если...</span>
                <q-select 
                    outlined
                    v-model="appliedRuleObject" 
                    :options="optionsFormattingRules" 
                    dense 
                    options-dense
                    disable-tab-selection
                ></q-select>
                <div class="inputs-section" v-if="typeInputs !== EnumTypeFormattingRuleInputs.Default">
                        <div class="inputs-section__body">
                            <div class="inputs-section__text-type" v-if="typeInputs === EnumTypeFormattingRuleInputs.Text">
                                <q-input v-model="formTextValue"  no-error-icon class="mp-0" :error="formTextValueError" type="text" outlined dense placeholder="Значение" />
                            </div>
                            <div class="inputs-section__date-type" v-else-if="typeInputs === EnumTypeFormattingRuleInputs.Date">
                                <q-input no-error-icon class="mp-0" :error="formDateValueError" type="date" outlined dense v-model="formDateValue" placeholder="Значение" />
                            </div>
                            <div class="inputs-section__text-number" v-else-if="typeInputs === EnumTypeFormattingRuleInputs.Number">
                                <q-input no-error-icon class="mp-0" :error="formNumberValueError" type="number" outlined dense v-model.number="formNumberValue" placeholder="Значение" />
                            </div>
                            <div class="inputs-section__date-numbers"  v-else-if="typeInputs === EnumTypeFormattingRuleInputs.Numbers">
                                <q-input no-error-icon class="mp-0" :error="formNumber1ValueError" type="number" outlined dense v-model.number="formNumber1Value" placeholder="Значение от" />
                                <q-input no-error-icon class="mp-0" :error="formNumber2ValueError" type="number" outlined dense v-model.number="formNumber2Value" placeholder="Значение до" />
                            </div>
                        </div>
                </div>
            </div>
            <div class="form-create-rule__format-section form-format-section">
                <span class="label-small">Формат</span>
                <div class="form-format-section__pickers-body">
                    <div class="form-format-section__format-picker" :style="styleFormattingCell">
                        <span>Текст ячейки</span>
                    </div>
                    <div class="form-format-section__format-menu-setting format-menu-setting">
                        <div class="format-menu-setting__body">
                            <div class="format-menu-setting__btns">
                                <div class="format-menu-setting__img-body" @click="formattingObject.formattingBoldActive=!formattingObject.formattingBoldActive" :style="{'background-color': formattingObject.formattingBoldActive ? '#ddddff':'transparent'}">
                                    <q-icon size="24px" name="format_bold"></q-icon>
                                </div>
                                <div class="format-menu-setting__img-body" @click="formattingObject.formattingItalicActive=!formattingObject.formattingItalicActive" :style="{'background-color': formattingObject.formattingItalicActive ? '#ddddff':'transparent'}">
                                    <q-icon size="24px" name="format_italic"></q-icon>
                                </div>
                                <div class="format-menu-setting__img-body" @click="formattingObject.formattingUnderlinedActive=!formattingObject.formattingUnderlinedActive" :style="{'background-color': formattingObject.formattingUnderlinedActive ? '#ddddff':'transparent'}">
                                    <q-icon size="24px" name="format_underlined"></q-icon>
                                </div>
                                <div class="format-menu-setting__img-body" @click="formattingObject.formattingStrikethroughActive=!formattingObject.formattingStrikethroughActive" :style="{'background-color': formattingObject.formattingStrikethroughActive ? '#ddddff':'transparent'}">
                                    <q-icon size="24px" name="strikethrough_s"></q-icon>
                                </div>
                                <div 
                                    class="format-menu-setting__img-body" 
                                    @click="formattingObject.formattingAlignPosition.left=!formattingObject.formattingAlignPosition.left, selectAlignPosition(formattingObject.formattingAlignPosition.left, 'left')" 
                                    :style="{'background-color': formattingObject.formattingAlignPosition.left ? '#ddddff':'transparent'}"
                                >
                                    <q-icon size="24px" name="format_align_left"></q-icon>
                                </div>
                                <div 
                                    class="format-menu-setting__img-body" 
                                    @click="formattingObject.formattingAlignPosition.center=!formattingObject.formattingAlignPosition.center, selectAlignPosition(formattingObject.formattingAlignPosition.center, 'center')" 
                                    :style="{'background-color': formattingObject.formattingAlignPosition.center ? '#ddddff':'transparent'}">
                                    <q-icon size="24px" name="format_align_center"></q-icon>
                                </div>
                                <div 
                                    class="format-menu-setting__img-body" 
                                    @click="formattingObject.formattingAlignPosition.right=!formattingObject.formattingAlignPosition.right, selectAlignPosition(formattingObject.formattingAlignPosition.right, 'right')" 
                                    :style="{'background-color': formattingObject.formattingAlignPosition.right ? '#ddddff':'transparent'}"
                                >
                                    <q-icon size="24px" name="format_align_right"></q-icon>
                                </div>
                                <div class="format-menu-setting__img-body" @click="formattingObject.formattingTextColorActive=!formattingObject.formattingTextColorActive" :style="{'background-color': formattingObject.formattingTextColorActive ? '#ddddff':'transparent'}">
                                    <button class="format-menu-setting__img-body_btn-wrapper">
                                    <svg width="20" height="20" :style="{'fill': formattingObject.formattingColorText}" viewBox="0 0 24 24"><path d="M0 20h24v4H0z" ></path>
                                        <path d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z" fill="#444746"></path>
                                    </svg>
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-color v-model="formattingObject.formattingColorText" />
                                    </q-popup-proxy>
                                </button>
                                </div>
                                <div class="format-menu-setting__img-body" :style="{'background-color': formattingObject.formattingFillColorActive ? '#ddddff':'transparent'}" @click="formattingObject.formattingFillColorActive=!formattingObject.formattingFillColorActive">
                                    <button class="format-menu-setting__img-body_btn-wrapper">
                                        <svg  width="20" height="20" fill="#444746" viewBox="0 0 24 24">
                                            <path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z" fill="#444746"></path>
                                            <path d="M0 20h24v4H0z" :style="{'fill': formattingObject.formattingBackgroundCell}"></path>
                                        </svg>
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-color v-model="formattingObject.formattingBackgroundCell" />
                                        </q-popup-proxy>
                                    </button>
                                </div>
                            </div>
                        </div>                
                    </div>
                </div>
            </div>
            <div class="action-section">
                <div class="action-section__body">
                    <button class="btn-light-custom" @click="emit('closeFormRule')">Отмена</button>
                    <button class="btn-custom" @click="addRule">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang=ts>
import { EnumColumnName } from '@/enums/EnumColumnValues';
import {fieldsInfoMap, IField} from '../../../helpers/ColumnsHelper'
import { useStore } from 'vuex'
import { ref,watch,defineExpose,defineEmits} from 'vue';
import { onMounted } from 'vue';
import { instance } from '@/helpers/InstanceHelper';
import { EnumRuleFormatting } from '@/enums/EnumsByRules';
import { EnumTypeField } from '@/enums/EnumsByFilter';
import { IConditionFormattingRules, IFormattingRules, IPaylAddRule } from '@/types/FormattingTypes';
import { optionsFormattingRules } from '@/helpers/Formatting/FormattingRuleHelper';
import { EnumTypeFormattingRuleInputs } from '@/enums/EnumsByTabPanel';
import { getEnumStringValues } from '@/enums/EnumsCommon';

const emit = defineEmits(['closeFormRule'])
const store = useStore()

defineExpose({
    clearFormattingSettings, createNewRule, editRule
})

let colNum = ref<number>(0)
let editMode = ref(false)

let formTextValue = ref<string>('')
let formDateValue = ref<string | number>('')
let formNumberValue = ref<number | null>(null)
let formNumber1Value = ref<number | null>(null)
let formNumber2Value = ref<number | null>(null)

let formTextValueError = ref<boolean>(false)
let formDateValueError = ref<boolean>(false)
let formNumberValueError = ref<boolean>(false)
let formNumber1ValueError = ref<boolean>(false)
let formNumber2ValueError = ref<boolean>(false)

const styleFormattingCellDefault = {
    'font-weight': 'normal',
    'font-style': 'normal',
    'text-decoration': 'none',
    'color': '#373737',
    'background-color': '#afdafc',
    'text-align': 'center'
}

let styleFormattingCell = ref<any>(styleFormattingCellDefault)

const formattingObject = ref<any>({
    formattingUnderlinedActive: false,
    formattingItalicActive: false,
    formattingBoldActive: false,
    formattingStrikethroughActive: false,
    formattingTextColorActive: false,
    formattingFillColorActive: false,
    formattingColorText: '#373737',
    formattingBackgroundCell: '#afdafc',
    formattingAlignPosition: {
        left: false,
        center: true,
        right: false,
    }
})

let IdByEditingRule = ref('')
let appliedFieldName = ref<EnumColumnName>(EnumColumnName.Type)
let appliedFieldType = ref<EnumTypeField>(EnumTypeField.String)
let appliedRule = ref<any | EnumRuleFormatting | EnumRuleFormatting>(EnumRuleFormatting.includedata)
let appliedRuleObject = ref<any | EnumRuleFormatting | IFormattingRules>(EnumRuleFormatting.includedata)
    
let typeInputs = ref<EnumTypeFormattingRuleInputs>(EnumTypeFormattingRuleInputs.Default)
const fieldNames=getEnumStringValues(EnumColumnName)

onMounted(() => {

    setTimeout(() => {
        const selected: any[] = instance.getSelected()
        const endCol = selected[0][3] as number
        const nameField: EnumColumnName | undefined = (fieldsInfoMap.get(endCol) as IField).columnName as EnumColumnName
        const typeField: EnumTypeField | undefined = (fieldsInfoMap.get(endCol) as IField).fieldType as EnumTypeField

        colNum.value = endCol
        
        if (nameField) appliedFieldName.value = nameField
        if (typeField) appliedFieldType.value = typeField
    });
    
})

function selectAlignPosition(alignPos: any, position: string) {
    
    for (let Key in formattingObject.value.formattingAlignPosition) {
        if (Object.prototype.hasOwnProperty.call(formattingObject.value.formattingAlignPosition, Key) === true) {
            if (alignPos && Key !== position) {
                formattingObject.value.formattingAlignPosition[Key] = false 
            } else { 
                if (formattingObject.value.formattingAlignPosition[Key]!==alignPos) formattingObject.value.formattingAlignPosition[Key] = false
            }
        }
    }
}

watch(formattingObject, (newValue: any) => {

let textDecoration = ''
if (newValue.formattingUnderlinedActive && newValue.formattingStrikethroughActive) {
    textDecoration = 'underline line-through'
} else if (newValue.formattingUnderlinedActive && !newValue.formattingStrikethroughActive) {
    textDecoration = 'underline'
} else if (!newValue.formattingUnderlinedActive && newValue.formattingStrikethroughActive) {
    textDecoration = 'line-through'
} else {
    textDecoration = 'none'
}

let textAlign = 'center'
if (newValue.formattingAlignPosition.left) {
    textAlign = 'left'
} else if (newValue.formattingAlignPosition.center){
    textAlign = 'center'
} else if (newValue.formattingAlignPosition.right){
    textAlign = 'right'
}

styleFormattingCell.value = {
    'font-weight': newValue.formattingBoldActive ? 'bold' : 'normal',
    'font-style': newValue.formattingItalicActive ? 'italic' : 'normal',
    'text-decoration': textDecoration,
    'color': newValue.formattingTextColorActive ? newValue.formattingColorText : '#373737',
    'background-color': newValue.formattingFillColorActive ? newValue.formattingBackgroundCell : '#afdafc',
    'text-align': textAlign
}
}, {deep: true})

watch(appliedFieldName, (newValue: EnumColumnName) => {
    
    //при выборе другой колонки, устанавливается первое общее правило 
    appliedRule.value = EnumRuleFormatting.includedata

    //добавил строку 16.12.2024 когда делал комп создания правила валидации
    //appliedRuleObject.value = EnumRuleFormatting.includedata

    let appliedFieldTypeLocal: EnumTypeField | null= null
    
    fieldsInfoMap.forEach((value) => {
        if (newValue === value.columnName) {
            appliedFieldTypeLocal = value.fieldType
            appliedFieldType.value = value.fieldType
            colNum.value = value.colNum
        }
    });

    //заморозка правил
    optionsFormattingRules.map((rule: IFormattingRules) => {
        rule.disable = false
        //заморозить все правила с другими типами
        if (rule.type !== appliedFieldTypeLocal) {
            rule.disable = true
        } 

        if (rule.type === EnumTypeField.NoType) {
            rule.disable = false
        }

        return rule
    })
}, {immediate: false})


watch(appliedRuleObject, (newValue: IFormattingRules) => {

    appliedRule.value = newValue.value

    if (newValue.value === EnumRuleFormatting.includedata || newValue.value === EnumRuleFormatting.noincludedata) {
        typeInputs.value = EnumTypeFormattingRuleInputs.Default
    } else if (newValue.value === EnumRuleFormatting.textinclude || 
            newValue.value === EnumRuleFormatting.textnoinclude ||
            newValue.value === EnumRuleFormatting.textstartswith ||
            newValue.value === EnumRuleFormatting.textendswith ||
            newValue.value === EnumRuleFormatting.textaccurate) {
        typeInputs.value = EnumTypeFormattingRuleInputs.Text
    }
    else if (newValue.value === EnumRuleFormatting.numberequalto || 
            newValue.value === EnumRuleFormatting.numbernotequalto ||
            newValue.value === EnumRuleFormatting.numbermorethan ||
            newValue.value === EnumRuleFormatting.numbermorethanorequalto ||
            newValue.value === EnumRuleFormatting.numberlessthan ||
            newValue.value === EnumRuleFormatting.numberlessthanorequalto) {
        typeInputs.value = EnumTypeFormattingRuleInputs.Number
    }
    else if (newValue.value === EnumRuleFormatting.numberbetween || newValue.value === EnumRuleFormatting.numbernobetween) {
        typeInputs.value = EnumTypeFormattingRuleInputs.Numbers
    }
    else if (newValue.value === EnumRuleFormatting.dateequalto || 
            newValue.value === EnumRuleFormatting.datebefore ||
            newValue.value === EnumRuleFormatting.dateafter) {
        typeInputs.value = EnumTypeFormattingRuleInputs.Date
    } else {
        typeInputs.value = EnumTypeFormattingRuleInputs.Default
    }
})

function addRule() {
    //очистить ошибки
    clearFormErrorValues()

    let isError = false

    if (typeInputs.value === EnumTypeFormattingRuleInputs.Text && !formTextValue.value) {
        formTextValueError.value = true
        isError = true
    } else if (typeInputs.value === EnumTypeFormattingRuleInputs.Date && !formDateValue.value) {
        formDateValueError.value = true
        isError = true
    } else if (typeInputs.value === EnumTypeFormattingRuleInputs.Number && !formNumberValue.value) {
        formNumberValueError.value = true
        isError = true
    } else if (typeInputs.value === EnumTypeFormattingRuleInputs.Numbers && !formNumber1Value.value) {
        formNumber1ValueError.value = true
        isError = true
    } else if (typeInputs.value === EnumTypeFormattingRuleInputs.Numbers && !formNumber2Value.value) {
        formNumber2ValueError.value = true
        isError = true
    }

    if (isError) {
        return
    } else {
        //если не тошибки то создать правило
        let jsCondition = ''

        switch (appliedRule.value) {
            case EnumRuleFormatting.includedata:
                if (appliedFieldType.value === EnumTypeField.Number) {
                    jsCondition = 'value !== null && value !== undefined'
                } else {
                    jsCondition = 'value'
                }
                break;
            case EnumRuleFormatting.noincludedata:
                if (appliedFieldType.value === EnumTypeField.Number) {
                    jsCondition = 'value === null || value === undefined'
                } else {
                    jsCondition = '!value'
                }
                break;
            case EnumRuleFormatting.textinclude:
                jsCondition = `value.includes("${formTextValue.value}")`
                break;
            case EnumRuleFormatting.textnoinclude:
                jsCondition = `!value.includes("${formTextValue.value}")`
                break;
            case EnumRuleFormatting.textstartswith:
                jsCondition = `value.startsWith("${formTextValue.value}")`
                break;
            case EnumRuleFormatting.textendswith:
                jsCondition = `value.endsWith("${formTextValue.value}")`
                break;
            case EnumRuleFormatting.textaccurate:
                jsCondition = `value === "${formTextValue.value}"`
                break;

            case EnumRuleFormatting.numberequalto:
                jsCondition = `value === ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numbernotequalto:
                jsCondition = `value !== ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numbermorethan:
                jsCondition = `value > ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numberlessthan:
                jsCondition = `value < ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numbermorethanorequalto:
                jsCondition = `value >= ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numberlessthanorequalto:
                jsCondition = `value <= ${formNumberValue.value}`
                break;
            case EnumRuleFormatting.numberbetween:
                jsCondition = `value > ${formNumber1Value.value} && value < ${formNumber2Value.value}`
                break;
            case EnumRuleFormatting.numbernobetween:
                jsCondition = `value < ${formNumber1Value.value} || value > ${formNumber2Value.value}`
                break;
            case EnumRuleFormatting.dateequalto:
                jsCondition = `new Date(value).getTime() === new Date("${formDateValue.value}").getTime()`
                break;
            case EnumRuleFormatting.datebefore:
                jsCondition = `new Date(value).getTime() < new Date("${formDateValue.value}").getTime()`
                break;
            case EnumRuleFormatting.dateafter:
                jsCondition = `new Date(value).getTime() > new Date("${formDateValue.value}").getTime()`
                break;
        }

        let value1: string | number | boolean, value2: number, textRule: string

        switch (typeInputs.value) {
            case EnumTypeFormattingRuleInputs.Default:
                textRule = `${appliedRule.value}`
                break;
            case EnumTypeFormattingRuleInputs.Text:
                value1 = formTextValue.value as string
                textRule = `${appliedRule.value} "${value1}"`
                break;
            case EnumTypeFormattingRuleInputs.Number:
                value1 = formNumberValue.value as number
                textRule = `${appliedRule.value} "${value1}"`
                break;
            case EnumTypeFormattingRuleInputs.Date:
                value1 = formDateValue.value as string
                textRule = `${appliedRule.value} "${value1}"`
                break;
            case EnumTypeFormattingRuleInputs.Numbers:
                value1 = formNumber1Value.value as number
                value2 = formNumber2Value.value as number
                if (appliedRule.value === EnumRuleFormatting.numberbetween) {
                    textRule = `От ${value1} до ${value2}`
                } else if (appliedRule.value === EnumRuleFormatting.numbernobetween) {
                    textRule = `Меньше ${value1} или больше ${value2}`
                }
                break;
        }
    
        let newRule: IConditionFormattingRules
    
        setTimeout(() => {
            newRule = {
                id: editMode.value ? IdByEditingRule.value : String(new Date().getTime()),
                style: styleFormattingCell.value,
                jsCode: jsCondition,
                fieldName: appliedFieldName.value,
                fieldType: appliedFieldType.value,
                appliedRule: appliedRule.value,
                appliedRuleObject:  appliedRuleObject.value,
                typeInputs: typeInputs.value,
                textRule: textRule,
                value1,
                value2,
                isMacros: false,
                styleConfig: formattingObject.value
            }
            console.log('format---newRule', newRule)

            if (editMode.value === true) {
                store.dispatch('editFormatRule', {columnNumber: colNum.value, rule: newRule} as IPaylAddRule)
            } else {
                store.dispatch('addFormatRule', {columnNumber: colNum.value, rule: newRule} as IPaylAddRule)
            }

            emit('closeFormRule')
            instance.render()  
        })
    }
}
function editRule(rule: IConditionFormattingRules) {
    if (rule && rule.id) {
        
        editMode.value = true
        IdByEditingRule.value = rule.id
        appliedFieldName.value = rule.fieldName
        appliedFieldType.value = rule.fieldType
        appliedRuleObject.value = rule.appliedRuleObject
        appliedRule.value = rule.appliedRule
        styleFormattingCell.value = rule.style
        formattingObject.value = structuredClone(rule.styleConfig)
        typeInputs.value = rule.typeInputs
        
        switch (typeInputs.value) {
            case EnumTypeFormattingRuleInputs.Text:
                formTextValue.value = rule.value1 as string
                break;
            case EnumTypeFormattingRuleInputs.Number:
                formNumberValue.value = rule.value1 as number
                break;
            case EnumTypeFormattingRuleInputs.Date:
                formDateValue.value = rule.value1 as string
                break;
            case EnumTypeFormattingRuleInputs.Numbers:
                formNumber1Value.value = rule.value1 as number
                formNumber2Value.value = rule.value2 as number
                break;
        }
    }
}
function createNewRule() {
    IdByEditingRule.value = ''
    editMode.value = false
}

function clearFormattingSettings() {
    appliedFieldName.value = EnumColumnName.Type
    appliedFieldType.value = EnumTypeField.String
    appliedRule.value = EnumRuleFormatting.includedata
    appliedRuleObject.value = EnumRuleFormatting.includedata
    typeInputs.value = EnumTypeFormattingRuleInputs.Default
    IdByEditingRule.value = ''
    editMode.value = false
    styleFormattingCell.value = styleFormattingCellDefault
    formTextValue.value = ''
    formDateValue.value = ''
    formNumberValue.value = null
    formNumber1Value.value = null
    formNumber2Value.value = null

    formattingObject.value = {
        formattingUnderlinedActive: false,
        formattingItalicActive: false,
        formattingBoldActive: false,
        formattingStrikethroughActive: false,
        formattingTextColorActive: false,
        formattingFillColorActive: false,
        formattingColorText: '#373737',
        formattingBackgroundCell: '#afdafc',
        formattingAlignPosition: {
            left: false,
            center: true,
            right: false,
        }
    }
}

function clearFormErrorValues() {
    formTextValueError.value = false
    formDateValueError.value = false
    formNumberValueError.value = false
    formNumber1ValueError.value = false
    formNumber2ValueError.value = false
}
</script>

