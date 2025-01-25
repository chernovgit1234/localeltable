<style lang="scss" scoped>

.input__fade-enter-active, .input__fade-leave-active {
  transition: opacity .3s;
}

.input__fade-enter, .input__fade-leave-to {
  opacity: 0;
}

.sett-preset {
  padding: 20px 0;
  color: #202124;

  &__body {
    display: flex;
    flex-direction: column;
    padding: 0 5px;
    gap: 20px;
  }
  &__header {
    display: inline-flex;
    flex-wrap: nowrap;
    padding: 0 5px;
  }

  &__header-label {
    color: #3c4043;
    font-family: Roboto400;
    font-size: 14px;
  }

  &__header-active {
    background-color: #fff0d1;
    font-family: Roboto700;
    color: #3c4043;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__item-label {

    color: #3c4043;
    font-family: Roboto400;
    font-size: 14px;
    white-space: nowrap;
  }

  &__item {
    margin-left: -20px;
  }

  &__items {
    height: 500px;
    overflow-y: auto;
    //border: 1px solid #dddfe3;
    border-top: 1px solid #dddfe3;
    border-bottom: 1px solid #dddfe3;
  }

  &__actions {
    padding: 0 5px;
  }
}

.input-class-custom {
  color: #3c4043 !important;
  font-family: Roboto400 !important;
}

.q-input {
  border-radius: 0px !important;
}

.q-field {
  border-radius: 0px !important;
}


</style>

<template>
    <div class="sett-preset">
      <div class="sett-preset__body">
        <div class="sett-preset__header">
          <span class="sett-preset__header-label">Активный пресет:&ensp;</span>
          <span class="sett-preset__header-active">{{ presetLocale.name }}</span>
        </div>
        <div class="sett-preset__list">
          <q-item dense tag="label" clickable class="sett-preset__item" >
            <q-checkbox @click="selectAll()" v-model="selectedAll"/>
            <q-item-section>
              <span class="sett-preset__item-label">Выбрать все ({{ columnsData.length }})</span>
            </q-item-section>
          </q-item>
          <q-list dense class="sett-preset__items scroll-custom">
              <q-item v-for="(item, i) in columnsData" :key="i" tag="label" clickable class="sett-preset__item">
                <q-checkbox v-model="item.selected" />
                <q-item-section>
                    <span class="sett-preset__item-label">{{ item.name }}</span>
                </q-item-section>
              </q-item>
          </q-list>
        </div>
        
        <div class="sett-preset__actions">
          <div class="action-section" style="margin-bottom: 20px;">
            <div class="action-section__body">
              <button class="btn-custom" @click="applySettings()">Сохранить</button>
              <button :disabled="visibleCreateForm" class="btn-light-custom-unboard" @click="visibleCreateForm = true">
                <span style="content: \002B;"></span>
                <span class="actions-icon"> Создать пресет</span>
              </button>
            </div>
          </div>
          <transition name="input__fade">
            <div v-if="visibleCreateForm">
              <div class="sett-preset__create-preset">
                <q-input 
                  outlined 
                  bottom-slots
                  bg-color="white"
                  v-model="createdPresetName" 
                  :color="hintTxt" 
                  input-class="input-class-custom"
                  dense 
                >
                  <template v-slot:append>
                    <q-icon color="grey-9"  v-show="createdPresetName.length" name="close" @click="createdPresetName = ''" class="cursor-pointer" />
                  </template>
                  <template v-slot:hint>
                    <div :style="clrTxt" style="margin-left: -10px;margin-top: -5px;">{{ inpTxt}}</div>
                  </template>
                </q-input>
              </div>
              <div class="action-section" style="margin-top: 5px;">
                  <div class="action-section__body">
                      <button class="btn-light-custom" @click="cancelCreate()">Отмена</button>
                      <button class="btn-custom" @click="createPreset()" :disabled="createdPresetName.length < 2 || !freePresetName">Сохранить</button>
                  </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import {EnumColumnNumber, EnumColumnName, EnumColumnTableNumber} from '../enums/EnumColumnValues'
import { watchEffect, reactive, toRaw, onMounted, ref , watch, computed } from 'vue';
import { useStore } from 'vuex'
import {IPreset} from '../types/PresetTypes'

const store = useStore()

interface IPresetListColumn {
  num: number,
  numCol: number,
  name: string,
  selected: boolean | null
}

let selectedAll =  ref<boolean>(false)
let visibleCreateForm =  ref<boolean>(false)
let createdPresetName =  ref<string>('')
const freePresetName = ref<boolean>(true)

const inpTxt = computed(() => {
  return freePresetName.value === true ? 'Введите название пресета' : 'Название уже используется'
})

const hintTxt = computed(() => {
  return freePresetName.value === true ? 'primary' : 'red-6'
})
const clrTxt = computed(() => {
  return freePresetName.value === true ? 'color: #646464' : 'color: #d93025'
})

const presetLocale = reactive<IPreset>({
  id: '',
  name: 'По умолчанию',
  hiddenColumns: [],
  active: false,
  userId: '',
  public: false,
  isDefault: false
})

const columnsData = reactive<IPresetListColumn[]>([
  {
    num: EnumColumnNumber.Type,
    numCol: EnumColumnTableNumber.Type,
    name: EnumColumnName.Type,
    selected: true
  },
  {
    num: EnumColumnNumber.Name,
    numCol: EnumColumnTableNumber.Name,
    name: EnumColumnName.Name,
    selected: true
  },
  {
    num: EnumColumnNumber.Brand,
    numCol: EnumColumnTableNumber.Brand,
    name: EnumColumnName.Brand,
    selected: true
  },
  {
    num: EnumColumnNumber.ProductionDate,
    numCol: EnumColumnTableNumber.ProductionDate,
    name: EnumColumnName.ProductionDate,
    selected: true
  },
  {
    num: EnumColumnNumber.CostOne,
    numCol: EnumColumnTableNumber.CostOne,
    name: EnumColumnName.CostOne,
    selected: true
  },
  {
    num: EnumColumnNumber.CostTwo,
    numCol: EnumColumnTableNumber.CostTwo,
    name: EnumColumnName.CostTwo,
    selected: true
  },
  {
    num: EnumColumnNumber.Percent,
    numCol: EnumColumnTableNumber.Percent,
    name: EnumColumnName.Percent,
    selected: true
  },
  {
    num: EnumColumnNumber.Present,
    numCol: EnumColumnTableNumber.Present,
    name: EnumColumnName.Present,
    selected: true
  },
  {
    num: EnumColumnNumber.Status,
    numCol: EnumColumnTableNumber.Status,
    name: EnumColumnName.Status,
    selected: true
  },
  {
    num: EnumColumnNumber.Comments,
    numCol: EnumColumnTableNumber.Comments,
    name: EnumColumnName.Comments,
    selected: true
  }
])

onMounted(()=> {
  let preset = toRaw(store.getters.activePreset) as IPreset

  presetLocale.id = preset.id
  presetLocale.name = preset.name
  presetLocale.hiddenColumns = preset.hiddenColumns
  presetLocale.active = preset.active
  presetLocale.userId = preset.userId
  presetLocale.public = preset.public
  presetLocale.isDefault = preset.isDefault

  columnsData.forEach((colData: IPresetListColumn) => {
    if (presetLocale.hiddenColumns.some((col: number) => col === colData.numCol)) {
      colData.selected = false
    }
  })
})

watch(createdPresetName, ( newValue: string ) => {
  freePresetName.value = store.getters.freePresetName(newValue)
})

watchEffect(() => {
  columnsData.every((col: IPresetListColumn) => col.selected === true) ? selectedAll.value = true : selectedAll.value = false
})

function selectAll() {
  selectedAll.value === true ? columnsData.forEach((col: IPresetListColumn)=> col.selected = true) : columnsData.forEach((col: IPresetListColumn)=> col.selected = false)
}

function createPreset() {
  const newPreset: IPreset = {
    id: String(new Date().valueOf()),
    name: createdPresetName.value,
    hiddenColumns: columnsData.map((colData: IPresetListColumn) => {

    if (colData.selected === false) {
      return colData.numCol
    }
  }).filter(colData => colData) as number[],
    active: false,
    userId: String(new Date().valueOf() + 1),
    public: presetLocale.public,
    isDefault: false
  }

  store.dispatch('createPreset', newPreset)

  createdPresetName.value = ''
}

function cancelCreate() {
  visibleCreateForm.value = false
  createdPresetName.value = ''
}

function applySettings() {

  //массив с номерами скрытых колонок
  let hiddenColumns = columnsData.filter((colData: IPresetListColumn) => colData.selected === false).map((colData: IPresetListColumn) => colData.numCol) as number[]

  presetLocale.hiddenColumns = hiddenColumns

  const preset = toRaw(presetLocale) as IPreset
  store.dispatch('applySettingPreset', preset)
}
</script>
