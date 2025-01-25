<style lang="css">
.create-configdata {
    background-color: #fff;
    min-width: 80%;
    max-height: 90%;
    gap: 20px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.create-configdata__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid var(--table-grey-color);
}

.create-configdata__content {
    min-height: 100%;
    font-family: Roboto400;
    overflow: auto;
}
.create-configdata__actions {
    display: flex;
    flex-direction: row;
    gap: 15px;
}

.setting-configdata {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.setting-configdata__checkboxs {
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
}
.setting-configdata__dates {
    display: grid;
    grid-template-columns: 50% 50%;
}
.create-configdata__input {
    margin-top: 30px;
    width: 75%;
}

</style>

<template>
    <div class="create-configdata">
        <div class="create-configdata__header">
                <div style="white-space: nowrap;" class="text-h6 ">Создание и настройка конфигурации данных <small style="color: var(--text-hint)">(?: Окно для настройки отбора данных из базы данных, чтобы получить только нужные данные по текущей работе)</small></div>
                <q-btn flat round dense icon="close" v-close-popup/>
            </div>
            <div class="create-configdata__content">
                <div class="create-configdata__setting setting-configdata">
                    <q-select
                        style="max-height: 60px; max-width: 100%"
                        filled
                        square
                        v-model="modelSelectBrand"
                        :options="optionsBrandList"
                        label="Брэнд"
                        multiple
                        outlined
                        dense
                        use-chips
                        stack-label
                        emit-value
                        map-options
                        class="select-scrollbar"
                    >
                        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                        <q-item v-bind="itemProps">
                            <q-item-section>
                            <q-item-label v-html="opt" />
                            </q-item-section>
                            <q-item-section side>
                            <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                            </q-item-section>
                        </q-item>
                        </template>
                    </q-select>
                    <q-select
                        square
                        style="max-height: 60px; max-width: 100%"
                        filled
                        v-model="modelSelectStatus"
                        :options="optionsStatusList"
                        label="Статус"
                        multiple
                        outlined
                        dense
                        use-chips
                        stack-label
                        emit-value
                        map-options
                        class=""
                    >
                        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                        <q-item v-bind="itemProps">
                            <q-item-section>
                            <q-item-label v-html="opt" />
                            </q-item-section>
                            <q-item-section side>
                            <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                            </q-item-section>
                        </q-item>
                        </template>
                    </q-select>

                    <div class="setting-configdata__checkboxs">
                        <q-checkbox v-model="precentModel1" label="Настройка 1" />
                        <q-checkbox v-model="precentModel2" label="Настройка 2" />
                        <q-checkbox v-model="precentModel3" label="Настройка 3" />
                        <q-checkbox v-model="precentModel4" label="Настройка 4" />
                    </div>
                    <div class="setting-configdata__dates">
                        <div class="q-pa-md" >
                            <div class="q-pb-sm">
                            Период (Дата Выпуска) от {{ modelDate1.from }} до {{ modelDate1.to }}
                            </div>
                            <q-date v-model="modelDate1" range />
                        </div>
                        <div class="q-pa-md">
                            <div class="q-pb-sm">
                                Период (Дата Продаж) от {{ modelDate2.from }} до {{ modelDate2.to }}
                            </div>
                            <q-date v-model="modelDate2" range />
                        </div>
                        </div>
                </div>
                <div class="hr-custom"></div>
                <div class="create-configdata__input">
                    <q-input square v-model="createdConfigDataName" dense label="Название конфигурации">
                        <template v-slot:append>
                            <q-icon v-show="createdConfigDataName.length" name="close" @click="createdConfigDataName = ''" class="cursor-pointer" />
                        </template>
                    </q-input>
                </div>
            </div>
            <div class="create-configdata__actions">
                <button  :disabled="!createdConfigDataName.length" class="btn" @click.stop="createConfigData()">Сохранить</button>
            </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue';
import {brands, statuses} from '../../enums/Lists'
import { startOfTomorrow, startOfYesterday } from "date-fns";
import { useStore } from 'vuex'
import {IConfigData} from '../../types/TabPanelsTypes'

const store = useStore()

function createConfigData() {
    newConfigData.name = createdConfigDataName.value

    store.dispatch('createConfigData', newConfigData)

    createdConfigDataName.value = ''
}

let createdConfigDataName = ref<string>('')
const newConfigData: IConfigData = {id: String(new Date().getTime()), name: ''}

let today = new Date().toLocaleDateString().split('.').reverse().join('/')
let tommorow = startOfTomorrow().toLocaleDateString().split('.').reverse().join('/')
let yesterday = startOfYesterday().toLocaleDateString().split('.').reverse().join('/')

let precentModel1 = ref(false)
let precentModel2 = ref(true)
let precentModel3 = ref(false)
let precentModel4 = ref(true)

let modelDate1 = ref({ from: yesterday, to:  tommorow })
let modelDate2 = ref({ from: yesterday, to:  tommorow })

let modelSelectBrand = ref([...brands.filter(r=> r)])
let optionsBrandList = ref([...brands.filter(r=> r)])

let modelSelectStatus = ref([...statuses.filter(r=> r)])
let optionsStatusList = ref([...statuses.filter(r=> r)])
</script>