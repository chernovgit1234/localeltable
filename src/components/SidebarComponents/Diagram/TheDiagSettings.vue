<style lang="scss">

.diag-sett {
    padding: 15px 0;
    color: #202124;

    &__body {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    &__label-section {
        color: #3c4043;
        font-family: Roboto700;
        font-size: 14px;
        font-weight: 500;
        display: block;
        margin-bottom: 8px;
    }

    &__cheks {
        display: flex;
        flex-direction: column;

        /* padding: 0;
        margin: 0; */
    }

    &__check {
        margin-bottom: -8px;
    }
}

.def-type-hart {
    color: #202124 !important;
    font-family: Roboto400 !important;
    left: 0px;
    position: absolute;
    top: 11px;
    width: 200px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.add-range {
    padding: 4px;
    &:hover{
        background-color: #f3f5f5;
        border-radius: 50%;
        
    }

}

.diag-param-btn {
    
&__btn {
    display: block;
    user-select: none;
    padding-left: 20px;
    border: 1px solid #dadce0;
    height: 40px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    cursor: pointer;
   /*  margin-top: 8px; */

    span {
        color: #5f6368;
        font-weight: 500;
        font-family: Roboto700;
        font-size: 14px;
    }
}

&__list {
    user-select: none;
    overflow-y: auto;
    padding: 8px 0;
    border: 1px solid transparent;
    border-radius: 4px;
    box-shadow: 0 2px 6px 2px rgba(60, 64, 67, .15);
    width: 240px;
}

&__item {
    height: 30px;
    word-break: break-word;
    font-family: Roboto400;
    color: #202124;
    font-size: 14px;
    letter-spacing: .2px;
    line-height: 3px;
    cursor: pointer;
    display: flex;

    align-items: center;
    &:hover{
        background-color: #f1f3f4;    
    }
    span {
        padding-left: 6px;
    }
}

}

.diag-param {

    &__body {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        user-select: none;
        /* margin-bottom: 8px; */
    }

    /* &__item-body {
        display: flex;
        
    } */

    &__item {

        display: inline-block;
        border-radius: 36px;
        height: 36px;
        display: flex;
        background-color: #f1f3f4;
        align-items: center; 
        gap: 5px;
        padding: 0 10px;
        /* margin: 6px 0 2px 0; */
        
        span {
            display: inline-block;
            flex: 1 1 auto;
            color: #424242;
            font-size: 14px;
            font-family: Roboto400;
            line-height: 14px;
        }
    }

    &__label-body {
        width: 80%;
        margin-left: auto;
        margin-bottom: 8px;

        span {
            color: #80868b;
            font-size: 14px;
            font-family: Roboto700;

        }
    }

    &__label {
        border-radius: 36px;
        height: 36px;
        display: flex;
        background-color: #f1f3f4;
        align-items: center; 
        gap: 5px;
        padding: 0 10px;

        span {
            display: inline-block;
            flex: 1 1 auto;
            color: #424242;
            font-size: 14px;
            font-family: Roboto400;
        }
    }

    &__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
    }

    &__union {
        border: 1px solid #dadce0;
        display: flex;
        align-items: center;
        padding-left: 6px;
        cursor: pointer;
        border-radius: 4px;
        /* margin-bottom: 5px; */
        span {
            font-family: Roboto400;
            font-size: 14px;
            color: #202124;
        }

        &:hover{
            background-color: #f7f8f8;
        }
        
    }

    &__icon-end {
        display: flex;
        align-items: center;

        span {
            font-style: italic;
            color: #616161;
        }
    }
}

.param-menu {

&__list {
    display: flex;
    flex-direction: column;
    user-select: none;
    overflow-y: auto;
    padding: 8px 0;
    border: 1px solid transparent;
    border-radius: 4px;
    box-shadow: 0 2px 6px 2px rgba(60, 64, 67, .15);
    width: 200px;
}

&__item {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 30px;
    word-break: break-word;
    font-family: Roboto400;
    color: #202124;
    font-size: 14px;
    

    &:hover{
        background-color: #f1f3f4;    
    }
}
}

.union-params {
    width: 140px;
    
    &__item {
        display: flex;
        align-items: center;
        cursor: pointer;
        height: 30px; 
        color: #202124;
        font-size: 14px;
        letter-spacing: .2px;
        line-height: 20px; 
        display: flex; 
        padding-left: 14px;

        &:hover{
            background-color: #f1f3f4;    
        }
    }
}
</style>

<template>
    <div class="diag-sett" >
        <div class="diag-sett__body" >
            <div>
                <span class="diag-sett__label-section">Тип диаграммы</span>
                <q-select 
                    outlined
                    options-dense
                    dense
                    modelValue
                    :options="options"
                >
                    <template v-slot:prepend>
                        <q-icon style="color: #737373;" :name="iconChart" />
                    </template>
                    <template v-slot:default>
                        <span class="def-type-hart">{{typeChart}}</span>
                    </template>
                    <template v-slot:option>
                        <TheOptionSelectDiag @selectOpt="selectOpt" :typeChart="typeChart"></TheOptionSelectDiag>
                    </template>
                </q-select>
            </div>
            <!-- <div v-if="accum">
                <span class="form-create-rule__label-small">Накопление</span>
                <q-select 
                    menu-anchor="top start"
                    :menu-offset="[ 0, 20 ]" 
                    outlined
                    v-model="accumType" 
                    :options="[EnumAccumType.Нет, EnumAccumType.Стандартная, EnumAccumType.Нормированная]" 
                    dense 
                    options-dense
                />
            </div> -->
            <div>
                <span class="diag-sett__label-section">Данные</span>
                <span class="form-create-rule__label-small">Использовать данные из столбцов... </span>
                <q-select 
                    use-chips
                    multiple
                    outlined
                    :model-value="rangeFields.map(el=>el.name)" 
                    :options="fields.map(el=>el.name)" 
                    dense 
                    options-dense

                    @remove="removeField($event)"
                    @add="addField($event)"
                />
            </div>
            <div>
                <span class="form-create-rule__label-small">В диапазоне строк... </span>
                <q-field borderless dense outlined>
                    <template v-slot:control>
                        <div class="self-center full-width no-outline" tabindex="0">
                            <q-chip 
                                v-for="(range, i) in ranges"
                                :key="i"
                                removable 
                                @remove="deleteRange(i, range)"
                            >{{range}}</q-chip>
                        </div>
                    </template>
                    <template v-slot:append>
                        <div>
                            <q-icon style="cursor: pointer;" @click.stop="addRange"  name="add" class="add-range" />
                            <q-tooltip class="custom-tooltip-menu" anchor="bottom middle" self="top middle" :offset="[10, 5]">
                                <span>Добавить диапазон</span><br/>
                            </q-tooltip>
                        </div>
                    </template>
                </q-field>
            </div>
            <div v-if="ranges.length>1">
                <span class="form-create-rule__label-small">Объединить диапазоны</span>
                <q-select 
                    outlined
                    v-model="joinType" 
                    :options="[EnumJoinType.Повертикали, EnumJoinType.Погоризонтали]" 
                    dense 
                    options-dense
                />
            </div>
            <div v-if="typeDiag==EnumDiagType.Bubble" class="diag-param__body">
                <div class="diag-param__list">
                    <div class="diag-param__item-body" v-for="(item, i) in bubbleObj" :key="i" >
                        <span class="diag-sett__label-section">{{item.name}}</span>
                        
                        <div>
                            <div class="diag-param__item" v-if="item.param">
                                <q-icon 
                                    @show.stop 
                                    :name="item.param.icon" 
                                    color="grey-8" 
                                    :size="item.param.icon==='123' ? 'lg': 'xs'" 
                                    style="cursor: pointer;width: 40px;" 
                                /> 
                                <span @show.stop>{{item.param.name}}</span>
                                <q-menu auto-close>
                                    <div class="diag-param-btn__list">
                                        <div v-if="item.name=='Идентификатор'" >
                                            <div class="diag-param-btn__item" v-for="(field, j) in filterStrPrms(rangeFields)" :key="j" @click="item.param=field">
                                                <q-icon style="width: 40px;" :name="field.icon" size="xs" /> 
                                                <span>{{field.name}}</span>
                                            </div>
                                        </div>
                                        <div v-else-if="item.name=='Параметры'">
                                            <div class="diag-param-btn__item" v-for="(field, f) in rangeFields" :key="f" @click="item.param=field">
                                                <q-icon style="width: 40px;" :name="field.icon" :size="field.icon==='123' ? 'md': 'xs'" /> 
                                                <span>{{field.name}}</span>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <div class="diag-param-btn__item" v-for="(field, g) in filterParams(rangeFields)" :key="g" @click="item.param=field">
                                                <q-icon style="width: 40px;" :name="field.icon" :size="field.icon==='123' ? 'md': 'xs'" /> 
                                                <span>{{field.name}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </q-menu> 
                                
                                <div class="diag-param__icon-end">
                                    <q-icon color="grey-6" name="more_vert" size="sm" style="cursor: pointer;">
                                        <q-menu auto-close>
                                            <div class="param-menu__list">
                                                <div class="param-menu__item" @click="item.param=null">Удалить</div>
                                            </div>
                                        </q-menu>
                                    </q-icon>
                                </div>
                            </div>
                            <div class="diag-param-btn diag-param-btn__btn" v-else>
                                <span>{{item.name}}</span>
                                <q-menu>
                                    <div class="diag-param-btn__list">
                                        <div v-if="item.name=='Идентификатор'">
                                            <div class="diag-param-btn__item" v-for="(field, j) in filterStrPrms(rangeFields)" :key="j" @click="item.param=field">
                                                <q-icon style="width: 40px;" :name="field.icon" size="xs" /> 
                                                <span>{{field.name}}</span>
                                            </div>
                                        </div>
                                        <div v-else-if="item.name=='Параметры'">
                                            <div class="diag-param-btn__item" v-for="(field, f) in rangeFields" :key="f" @click="item.param=field">
                                                <q-icon style="width: 40px;" :name="field.icon" :size="field.icon==='123' ? 'md': 'xs'" /> 
                                                <span>{{field.name}}</span>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <div class="diag-param-btn__item" v-for="(field, g) in filterParams(rangeFields)" :key="g" @click="item.param=field">
                                                <q-icon style="width: 40px;" :name="field.icon" :size="field.icon==='123' ? 'md': 'xs'" /> 
                                                <span>{{field.name}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </q-menu> 
                            </div>
                        </div>

                        <div style="margin-top: 8px;" v-if="item.union">
                            <q-checkbox v-model="unionBubble" label="Объединить" />
                        </div>
                    </div>
                </div>
                

            </div>
            <div v-else class="diag-sett__body">
                <div v-show="showAxisDiv">
                    <span  class="diag-sett__label-section">{{indexAxis}}</span>
                    <div class="">
                        <div class="diag-param__item-body" v-if="axisX">
                            <div class="diag-param__item">
                                <q-icon 
                                    @show.stop 
                                    :name="axisX?.icon" 
                                    color="grey-8" 
                                    :size="axisX?.icon==='123' ? 'lg': 'xs'" 
                                    style="cursor: pointer;width: 40px;" 
                                /> 
                                <span @show.stop>{{axisX?.name}}</span>
                                <q-menu auto-close>
                                    <div class="diag-param-btn__list">
                                        <div class="diag-param-btn__item" v-for="(field, j) in rangeFields" :key="j" @click="changeAxisX(field)">
                                            <q-icon style="width: 40px;" :name="field.icon" :size="field.icon==='123' ? 'md': 'xs'" /> 
                                            <span>{{field.name}}</span>
                                        </div>
                                    </div>
                                </q-menu> 
                                
                                <div>
                                    <q-icon color="grey-6" name="more_vert" size="sm" style="cursor: pointer;">
                                        <q-menu auto-close>
                                            <div class="param-menu__list">
                                                <div class="param-menu__item" @click="axisX=null, union=false">Удалить</div>
                                                <div v-if="axisX?.label" @click="delete axisX.label" class="param-menu__item">Удалить ярлык</div>
                                                <div v-if="!axisX.label && !union"  class="param-menu__item" @click="axisX.label = {...rangeFields[0]}">Добавить ярлык</div>
                                            </div>
                                        </q-menu>
                                    </q-icon>
                                </div>
                            </div>
                            <div v-if="axisX?.label" class="diag-param__label-body">
                                <span>Ярлык</span>
                                <div class="diag-param__label"> 
                                    <q-icon 
                                        @show.stop 
                                        :name="axisX?.label.icon" 
                                        color="grey-8" 
                                        :size="axisX?.label.icon==='123' ? 'lg': 'xs'" 
                                        style="cursor: pointer;width: 40px;" 
                                    /> 
                                    <span @show.stop>{{axisX?.label.name}}</span>
                                    <q-menu auto-close>
                                        <div class="diag-param-btn__list">
                                            <div class="diag-param-btn__item" v-for="(field, j) in rangeFields" :key="j" @click="axisX.label = {...rangeFields[j]}">
                                                <q-icon style="width: 40px;" :name="field.icon" :size="field.icon==='123' ? 'md': 'xs'" /> 
                                                <span>{{field.name}}</span>
                                            </div>
                                        </div>
                                    </q-menu> 
                                    
                                    <div>
                                        <q-icon @click="delete axisX?.label" color="grey-8" name="cancel" size="xs" style="cursor: pointer;"></q-icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="diag-param-btn__btn" v-else>
                            <span>{{indexAxis}}</span>
                            <q-menu auto-close>
                                <div class="diag-param-btn__list">
                                    <div class="diag-param-btn__item" v-for="(field, j) in rangeFields" :key="j" @click="axisX = {...field}">
                                        <q-icon style="width: 40px;" :name="field.icon" :size="field.icon==='123' ? 'md': 'xs'" /> 
                                        <span>{{field.name}}</span>
                                    </div>
                                </div>
                            </q-menu> 
                        </div>
                        
                    </div> 
                    <div style="margin-top: 8px;" v-show="axisX">
                        <q-checkbox v-model="union" label="Объединить"/>
                    </div>
                </div>
                <div class="diag-param">
                    <div class="diag-param__head">
                        <span :style="{'margin-bottom': union ? '0px':'8px'}" style="margin: 0;" class="diag-sett__label-section">Параметры</span>
                        <div v-show="unionTrue" class="diag-param__union">
                            <span>{{unionType}}</span>
                            <q-icon size="sm" name="arrow_drop_down"/>
                            <q-menu auto-close>
                                <div class="union-params">
                                    <div class="union-params__item" v-for="(union, j) in unionTypes" :key="j" @click="selectUnion(union)">
                                        <span>{{union}}</span>
                                    </div>
                                </div>
                            </q-menu> 
                            <q-tooltip class="custom-tooltip-menu" anchor="bottom middle" self="top middle" :offset="[10, 5]">
                                <span>Тип подсчета</span>
                            </q-tooltip>
                        </div>
                    </div>

                    <div class="diag-param__body">
                        <div class="diag-param__list" v-show="params.length"> 
                            <div class="diag-param__item-body" v-for="(param, i) in params"  :key="i">
                                <div class="diag-param__item">
                                    <q-icon 
                                        @show.stop 
                                        :name="param.icon" 
                                        color="grey-8" 
                                        :size="param.icon==='123' ? 'lg': 'xs'" 
                                        style="cursor: pointer;width: 40px;" 
                                    /> 
                                    <span @show.stop>{{param.name}}</span>
                                    <q-menu auto-close>
                                        <div class="diag-param-btn__list">
                                            <div class="diag-param-btn__item" v-for="(field, j) in filterParams(rangeFields)" :key="j" @click="changeParam(field, i)">
                                                <q-icon style="width: 40px;" :name="field.icon" :size="field.icon==='123' ? 'md': 'xs'" /> 
                                                <span>{{field.name}}</span>
                                            </div>
                                        </div>
                                    </q-menu> 
                                    
                                    <div class="diag-param__icon-end">
                                        <div v-show="unionTrue">
                                            <span>{{param.calcType}}</span>
                                            <q-menu auto-close v-if="param.type!=EnumTypeField.Boolean && param.type!=EnumTypeField.String">
                                                <div class="union-params">
                                                    <div class="union-params__item" v-for="(union, j) in unionTypes" :key="j" @click="selectUnionP(union, i)">
                                                        <span>{{union}}</span>
                                                    </div>
                                                </div>
                                            </q-menu> 
                                        </div>
                                        
                                        <q-icon color="grey-6" name="more_vert" size="sm" style="cursor: pointer;">
                                            <q-menu auto-close>
                                                <div class="param-menu__list">
                                                    <div class="param-menu__item" @click="params.splice(i, 1)">Удалить</div>
                                                    <div class="param-menu__item" @click="params=[]">Сбросить все параметры</div>
                                                    <div v-if="param.label" @click="delete param.label" class="param-menu__item">Удалить ярлык</div>
                                                    <div v-if="!param.label && !union" class="param-menu__item" @click="param.label = {...rangeFields[0]}">Добавить ярлык</div>
                                                </div>
                                            </q-menu>
                                        </q-icon>
                                    </div>
                                </div>
                                <div v-if="param.label && !union" class="diag-param__label-body">
                                    <span>Ярлык</span>
                                    <div class="diag-param__label"> 
                                        <q-icon 
                                            @show.stop 
                                            :name="param.label.icon" 
                                            color="grey-8" 
                                            :size="param.label.icon==='123' ? 'lg': 'xs'" 
                                            style="cursor: pointer;width: 40px;" 
                                        /> 
                                        <span @show.stop>{{param.label.name}}</span>
                                        <q-menu auto-close>
                                            <div class="diag-param-btn__list">
                                                <div class="diag-param-btn__item" v-for="(field, j) in rangeFields" :key="j" @click="param.label = {...rangeFields[j]}">
                                                    <q-icon style="width: 40px;" :name="field.icon" :size="field.icon==='123' ? 'md': 'xs'" /> 
                                                    <span>{{field.name}}</span>
                                                </div>
                                            </div>
                                        </q-menu> 
                                        
                                        <div>
                                            <q-icon @click="delete param.label" color="grey-8" name="cancel" size="xs" style="cursor: pointer;"></q-icon>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="diag-param-btn diag-param-btn__btn">
                            <span>Параметр</span>
                            <q-menu>
                                <div class="diag-param-btn__list">
                                    <div class="diag-param-btn__item" v-for="(range, i) in filterParams(rangeFields)" :key="i" @click="params.push({...range, calcType: EnumUnionType.Сумма})" v-close-popup>
                                        <q-icon style="width: 40px;" :name="range.icon" :size="range.icon==='123' ? 'md': 'xs'" color="grey-8" /> 
                                        <span>{{range.name}}</span>
                                    </div>
                                </div>
                            </q-menu> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, toRaw, watch} from 'vue'
import TheOptionSelectDiag from './TheOptionSelectDiag.vue';
import { getEnumStringValues } from '@/enums/EnumsCommon';
import { EnumColumnName } from '@/enums/EnumColumnValues';
import { instance } from '@/helpers/InstanceHelper';

import {CellRange} from 'handsontable';
import { getColNum, getFieldType, getIconName, getRusNameByColNum, getRusNames } from '@/helpers/ColumnsHelper';
import { EnumTypeField } from '@/enums/EnumsByFilter';
import { useStore } from 'vuex';
import { EnumAccumType, EnumDiagName, EnumJoinType, EnumUnionType, EnumDiagType } from '@/enums/EnumsDiagramm';
import { IBubbleObj, IParam } from '@/store/diagramm/types';
import { BubbleController } from 'chart.js';
const store = useStore()

onMounted(()=>{
    addRange()
    //создание параметров
    initRanges()
})


function deleteRange(idx: number, range:string) {
    ranges.value.splice(idx,1)
    store.dispatch('deleteRange', range)
}
function changeAxisX(fld: IParam) {
    if (axisX.value) {
        let field = {...fld}
        axisX.value.name=field.name
        axisX.value.icon=field.icon
        axisX.value.type=field.type
        axisX.value.colNum=field.colNum
    }
}
function changeParam(fld: IParam, idx: number) {
    let field = {...fld}
    params.value[idx].name=field.name
    params.value[idx].icon=field.icon
    params.value[idx].type=field.type
    params.value[idx].colNum=field.colNum
}

function filterParams(params: IParam[]): IParam[]  {
    return params.filter(el=> el.type === EnumTypeField.Number || el.type === EnumTypeField.Date)
}

function filterStrPrms(params: IParam[]): IParam[]  {
    return params.filter(el=> el.type === EnumTypeField.String)
}

//функции селекта
function addField(event: any) {
    
    let fieldType = getFieldType(event.value) as EnumTypeField
    let colNum = getColNum(event.value)
    rangeFields.value.push({name: event.value, icon: getIconName(fieldType), type: fieldType, colNum})

    store.dispatch('addDataAtCol', colNum)
}
function removeField(event: any) {
    let name = event.value
    console.log('2sname', name)
    rangeFields.value.splice(event.index, 1)
    params.value = params.value.filter(el=>el.name!==name)
    params.value.forEach((esl: IParam)=> {
        if (esl.label?.name===name) delete esl.label
    })

    if (axisX.value?.name === name) {
        axisX.value = null
    }
    if (axisX.value?.label?.name === name) {
        delete axisX.value?.label
    }

    bubbleObj.value.forEach(el=>{
        if (el.param && el.param.name==name) {
            el.param=null
        }
    })

    store.dispatch('deleteDataAtCol',  getColNum(event.value))
}


let bubbleObj=ref<IBubbleObj[]>([
    {name:'Идентификатор',union: true,param: null, data:[]},
    {name:'Ось X',union:false,param:null, data:[]},
    {name:'Ось Y',union:false,param:null, data:[]},
    {name:'Параметры',union:false,param:null, data:[]},
    {name:'Размер',union:false,param:null, data:[]}
])

let unionTypes = ref<EnumUnionType[]>([...getEnumStringValues(EnumUnionType) as EnumUnionType[]])
let unionType = ref<EnumUnionType >(EnumUnionType.Сумма)

let unionBubble = ref(false)

let union = ref(false)
let label = ref(false)
let heading = ref(false)
let rowCol = ref(false)

let params = ref<IParam[]>([])
let axisX = ref<IParam | null>(null)
let accumType = ref(EnumAccumType.Нет)
let accum = ref(true)
let joinType = ref(EnumJoinType.Погоризонтали)
let ranges = ref<string[]>([])
let rangeFields = ref<IParam[]>([])

let unionTrue = computed(() => union.value && params.value.length && axisX.value)

let typeDiag = computed(() => store.getters.typeDiag)

const showAxisDiv = computed(() =>  {
    if (typeDiag.value==EnumDiagType.Pie || typeDiag.value==EnumDiagType.Doughnut) {
        return false
    } else {
        return true
    }
})
const indexAxis = computed(() => store.getters.indexAxis=='x' ? 'Ось Х' : 'Ось Y')

/* watch(typeDiag,(val:any)=>{
    console.log('watch--typeDiag', val)
}) */


watch(union, (val:boolean)=>{
    if (val && params.value.length) {
        for (const [idx, param] of params.value.entries()) {
            if (param.label) params.value.splice(idx+1, 0, {...param.label, calcType: EnumUnionType.Количество})
        }
    } else if (!val && params.value.length) {
        for (const [idx, param] of params.value.entries()) {
            if (param.type==EnumTypeField.Boolean || param.type==EnumTypeField.String) params.value.splice(idx, 1)
        }
    }

    store.dispatch('setUnion',val)
})



watch(params, (val:IParam[])=>{
    store.dispatch('setParams',{params: val, union: union.value, unionType: unionType.value})
}, {deep: true, immediate: true})

watch(axisX,(val:IParam | null)=>{
    store.dispatch('setAxisX',val)
})

watch(unionBubble,(val:boolean)=>{
    store.dispatch('setUnionBubble',val)
})

watch([joinType,accumType ], ([val1, val2])=>{
    store.dispatch('setSettings', {joinType: val1, accumType: val2})
}, {immediate: true})


function initRanges() {
    const paramTypes = [EnumTypeField.Number, EnumTypeField.Date] 
    const labelTypes = [EnumTypeField.String, EnumTypeField.Boolean] 

    if (!rangeFields.value.length) {
        //если нет выделенных колонок
        return
    }  else {
        for (const [idx, rang] of rangeFields.value.entries()) {
            let range = {...rang}

            if (~paramTypes.indexOf(range.type)) {
                params.value.push({...range, calcType: EnumUnionType.Сумма})
            } else if (~labelTypes.indexOf(range.type)) {

                if (params.value.length) {
                    params.value[params.value.length-1].label = range
                } else {
                    //если массив params пуст, то запись в осьХ
                    if (axisX.value) {
                        axisX.value.label = range
                    } else {
                        axisX.value = range
                    }
                }
            }

            //иниц=ия bubble
            if (idx==0 && range.type==EnumTypeField.String) {
                bubbleObj.value[0].param=range
            } else if ((idx==1 || idx==2 || idx==4) && (range.type==EnumTypeField.Number || range.type==EnumTypeField.Date)){
                bubbleObj.value[idx].param=range
            } else if (idx==3) {
                bubbleObj.value[idx].param=range
            }

        }
    }

    
}

watch(bubbleObj, (val:IBubbleObj[])=>{
    store.dispatch('setBubbleSett',{params: val, union: unionBubble.value, unionType: unionBubble.value})
}, {deep: true, immediate: true})

let fields = ref<IParam[]>(getRusNames() as IParam[])

let typeChart = ref<EnumDiagName>(EnumDiagName.СтолбДиаг)
let iconChart = ref('bar_chart')

function addRange() {
    const obj: CellRange[] = instance.getSelectedRange()

    if (!obj) return

    let from = obj[0].from.row === -1 ? obj[0].from.row+2 : obj[0].from.row+1
    let to = obj[0].to.row+1

    //перем-ые для отрезания из масссива
    let fromSlice, toSlice
    
    let text = ''
    //перед пушом на проверить является ли выбранный диап часть другого
    if (from > to) {
        fromSlice = to
        toSlice = from
        text=`${to}:${from}`
    } else {
        fromSlice = from
        toSlice = to
        text=`${from}:${to}`
    }

    //добавление диапазона
    if (!~ranges.value.indexOf(text)) ranges.value.push(text)
    //ranges.value.push(text)
    //cols
    let numCols: number[] = []
    obj.forEach((cell: CellRange)=>{
        numCols.push(...(getRange(cell.from.col, cell.to.col)))
    })

    //добавление колонок которых нет, чтобы не было дублей
    getRusNameByColNum(numCols).forEach((el => {
        if (!~rangeFields.value.map(el=>el.name).indexOf(el.name)) {
            console.log('el', el)
            rangeFields.value.push(el)
        }
    }))
    //отправить массив числе и получить массив названий колонок

    //диапазон один бех слияний (!) пока что
    //получаю данные в стэйте

    //дополучить прошлые колонки если они есть
    let cols = rangeFields.value.map(el=>el.colNum) as number[]
    if (cols.length) numCols.push(...cols)

    
    store.dispatch('addRange', {from: fromSlice-1, to: toSlice, textRange: text, numCols})
}
function getRange(start: number, end: number) {
    if (start > end) {
        let temp = start;
        start = end;
        end = temp;
    }
    const result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
}  

function selectOpt(opt: any) {
    //только текст на селекте 
    typeChart.value = opt.name
    //иконка на селекте
    iconChart.value = opt.icon
    //накопление только у определенных групп графиков (бар и лайн)
    accum.value = opt.accum ? true : false 

    //store.dispatch
    //console.log('selectOpt', opt)
}

function selectUnion(union: EnumUnionType) {
    unionType.value = union
    params.value.forEach(el=>  {
        if (el.type==EnumTypeField.Number || el.type==EnumTypeField.Date)  el.calcType=union
    })

}
function selectUnionP(union: EnumUnionType, idx: number) {
    params.value[idx].calcType=union
}

let options=[{value:'',html:true}]


</script>