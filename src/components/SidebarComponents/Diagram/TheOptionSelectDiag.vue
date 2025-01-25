<style lang="scss">

.diag-option {
    height: calc(100vh-700px) !important;
    overflow-x: hidden;
    overflow-y: auto;
    margin-right: 0px;
    width: 280px;
    padding: 15px 0;

    &__section-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    &__section {
    }

    span {
        padding-left: 15px;
        padding-bottom: 4px;
        display: block;
        color: #3c4043;
        font-family: Roboto400;
        font-size: 14px;
    }

    &__img {
        display: grid;
        grid-template-columns: repeat(3,85px);
        padding-left: 15px !important;
        gap: 10px;
    }

    &__img-body {
        
        border: 1px solid #bdbdbd;
        cursor: pointer;
        margin: 0 23px 10px 0;
        overflow: hidden;
        padding: 2px 1px 1px 1px;
        position: relative;
        height: 45px;
        width: 67px;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover{
            border-color: #9e9e9e;
        }

        img {
            max-width: 100%;
            max-height: 100%;
        }
    }
}
</style>

<template>
    <div class="diag-option">
        <div class="diag-option__section-list scroll-custom">
            <div class="diag-option__section" v-for="(item, i) in options" :key="i">
                <span>{{item.name}}</span>
                <div class="diag-option__img">
                    <div 
                        class="diag-option__img-body"
                        v-for="(child, g) in item.childs" 
                        :key="g" 
                        @click="selectOpt(child)"
                        :style="{'outline': child.active ? '5px solid #c6dafc':'none'}"
                    >
                        <img :src="require('../../../assets/icons/diag/'+child.img+'.png')" alt="ctrl-z">
                        <q-tooltip class="custom-tooltip-menu" anchor="bottom middle" self="top middle" :offset="[10, 5]">
                            <span>{{child.name ? child.name : typeChart}}</span><br/>
                        </q-tooltip>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script lang="ts" setup>
import { EnumDiagName, EnumDiagType } from '@/enums/EnumsDiagramm';
import { ISettGraph } from '@/store/diagramm/types';
import { ref, defineEmits, defineProps, onMounted, watchEffect, watch} from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const emit = defineEmits(['selectOpt'])
const options = ref<IOption[]>([
    {
        id: 1,
        name: 'Графики',
        childs: [
            {
                id: 2,
                name: EnumDiagName.График,
                img: 'график4',
                active: false,
                icon: 'show_chart',
                accum: false
            },
            {
                id: 3,
                name: EnumDiagName.ГладкГрафик,
                img: 'графикГл4',
                active: false,
                icon: 'show_chart',
                accum: false
            },
            {
                id: 4,
                name: EnumDiagName.КомбДиаг,
                img: 'графикКомбо',
                active: false,
                icon: 'ssid_chart',
                accum: false
            }
        ]
    },
    {
        id: 5,
        name: 'С областями',
        childs: [
            {
                id: 6,
                name: EnumDiagName.ДиагОбл,
                img: 'область1',
                active: false,
                icon: 'area_chart',
                accum: false

            },
            {
                id: 7,
                name: EnumDiagName.ДиагОблНакоп,
                img: 'облнакоп',
                active: false,
                icon: 'area_chart',
                accum: true
            },
            {
                id: 8,
                name: EnumDiagName.НормирДиагОбл,
                img: 'нормиробл',
                active: false,
                icon: 'area_chart',
                accum: false
            },
            {
                id: 9,
                name: EnumDiagName.ДискрДиагОбл,
                img: 'областьдиск1',
                active: false,
                icon: 'area_chart',
                accum: true
            },
            {
                id: 10,
                name: EnumDiagName.ДискрДиагОблНакоп,
                img: 'дискрнакоп',
                active: false,
                icon: 'area_chart',
                accum: true
            },
            {
                id: 11,
                name: EnumDiagName.НормирДискрДиагОбл,
                img: 'нормирдискр',
                active: false,
                icon: 'area_chart',
                accum: false
            }
        ]
    },
    {
        id: 12,
        name: 'Столбчатые',
        childs: [
            {
                id: 13,
                name: EnumDiagName.СтолбДиаг,
                img: 'столб',
                active: false,
                icon:'bar_chart',
                accum: false
            },
            {
                id: 14,
                name: EnumDiagName.СтолбДиагНакоп,
                img: 'столбнакоп',
                active: false,
                icon:'stacked_bar_chart',
                accum: true
            },
            {
                id: 15,
                name: EnumDiagName.НормирСтолбДиаг,
                img: 'линейчнорм',
                active: false,
                icon:'bar_chart',
                accum: false
            }
        ]
    },
    {
        id: 16,
        name: 'Линейчатые',
        childs: [
            {
                id: 17,
                name: EnumDiagName.ЛинДиаг,
                img: 'линейч',
                active: false,
                icon: 'align_horizontal_left',
                accum: false
            },
            {
                id: 18,
                name: EnumDiagName.ЛинДиагНакоп,
                img: 'линейчнакоп',
                active: false,
                icon: 'align_horizontal_left',
                accum: true
            },
            {
                id: 19,
                name: EnumDiagName.НормирЛинДиаг,
                img: 'линейчнормир',
                active: false,
                icon: 'align_horizontal_left',
                accum: false
            }
        ]
    },
    {
        id: 20,
        name: 'Круговые',
        childs: [
            {
                id: 21,
                name:  EnumDiagName.КругДиаг,
                img: 'круг',
                active: false,
                icon: 'pie_chart_outline',
                accum: false
            },
            {
                id: 22,
                name: EnumDiagName.КольцДиаг,
                img: 'бубл',
                active: false,
                icon: 'pie_chart_outline',
                accum: false
            },
            /* {
                id: 23,
                name: 'Объемная круговая диаграмма',
                img: 'graph1',
                active: false,
                icon: 'pie_chart_outline'
            } */
        ]
    },
    {
        id: 24,
        name: 'Точечные',
        childs: [
            {
                id: 25,
                name: EnumDiagName.ТочечДиаг,
                img: 'точеч',
                active: false,
                icon: 'scatter_plot',
                accum: false
            },
            {
                id: 26,
                name: EnumDiagName.ПузДиаг,
                img: 'пузыр',
                active: false,
                icon: 'bubble_chart',
                accum: false
            }
        ]
    },
    /* {
        id: 27,
        name: 'Другие',
        childs: [
            {
                id: 28,
                name: 'Каскадная диаграмма',
                img: 'graph1',
                active: false,
                icon: 'waterfall_chart'
            },
            {
                id: 29,
                name: 'Гистограмма',
                img: 'graph1',
                active: false,
                icon: 'stacked_bar_chart'
            },
            {
                id: 30,
                name: 'Лепестковая диаграмма',
                img: 'graph1',
                active: false,
                icon: 'stacked_bar_chart'
            }
        ]
    }, */

])
const props = defineProps<{typeChart: string}>()
let typeChart = ref('')

watchEffect(()=>{
    for (const option of options.value) {
        if (option.childs) {
            for (const child of option.childs) {
                if (child.name === props.typeChart) {
                    child.active = true;
                    return;
                }
            }
        }
    }
})

function selectOpt(child: IOption) {
    emit('selectOpt', child)
    deactivateAll(options.value)
    child.active = true

    
    console.log('child', child.name)
    let sett: ISettGraph | null=null
    switch (child.name as EnumDiagName) {
        case EnumDiagName.График:
            console.log('case График')
            sett = {
                type: EnumDiagType.Line,
                diagName: EnumDiagName.График,
                tension: 0,
            }
            break;
        case EnumDiagName.ГладкГрафик:
            sett = {
                type: EnumDiagType.Line,
                diagName: EnumDiagName.ГладкГрафик,
                tension: 0.4,
            }
            break;
        case EnumDiagName.КомбДиаг:
            sett = {
                type: EnumDiagType.Line,
                diagName: EnumDiagName.КомбДиаг,
                
            }
            break;
        case EnumDiagName.ДиагОбл:
            sett = {
                type: EnumDiagType.Line,
                diagName: EnumDiagName.ДиагОбл,
                fill: true,
                opacity: true,
            }
            break;    
        case EnumDiagName.ДиагОблНакоп:
            sett = {
                type: EnumDiagType.Line,
                diagName: EnumDiagName.ДиагОблНакоп,
                fill: true,
                stacked: true,
            }
            break;
        case EnumDiagName.НормирДиагОбл:
            sett = {
                type: EnumDiagType.Line,
                diagName: EnumDiagName.НормирДиагОбл,
                fill: true,
                stacked: true,
                normir: true,
            }
            break;
        case EnumDiagName.ДискрДиагОбл:
            sett = {
                type: EnumDiagType.Line,
                diagName: EnumDiagName.ДискрДиагОбл,
                fill: true,
                stepped: true,
                opacity: true,
            }
            break;
        case EnumDiagName.ДискрДиагОблНакоп:
            sett = {
                type: EnumDiagType.Line,
                diagName: EnumDiagName.ДискрДиагОблНакоп,
                fill: true,
                stacked: true,
                stepped: true,
            }
            break;
        case EnumDiagName.НормирДискрДиагОбл:
            sett = {
                type: EnumDiagType.Line,
                diagName: EnumDiagName.НормирДискрДиагОбл,
                fill: true,
                stacked: true,
                stepped: true,
                normir: true,
            }
            break;
        case EnumDiagName.СтолбДиаг:
            sett = {
                type: EnumDiagType.Bar,
                diagName: EnumDiagName.СтолбДиаг,
            }
            break;
        case EnumDiagName.СтолбДиагНакоп:
            sett = {
                type: EnumDiagType.Bar,
                diagName: EnumDiagName.СтолбДиагНакоп,
                stacked: true,
            }
            break;
        case EnumDiagName.НормирСтолбДиаг:
            sett = {
                type: EnumDiagType.Bar,
                diagName: EnumDiagName.НормирСтолбДиаг,
                stacked: true,
                normir: true,
            }
            break;
        case EnumDiagName.ЛинДиаг:
            sett = {
                type: EnumDiagType.Bar,
                diagName: EnumDiagName.ЛинДиаг,
                slant: true
            }
            break;
        case EnumDiagName.ЛинДиагНакоп:
            sett = {
                type: EnumDiagType.Bar,
                diagName: EnumDiagName.ЛинДиагНакоп,
                tension: 0,
                stacked: true,
                slant: true
            }
            break;
        case EnumDiagName.НормирЛинДиаг:
            sett = {
                type: EnumDiagType.Bar,
                diagName: EnumDiagName.НормирЛинДиаг,
                stacked: true,
                normir: true,
                slant: true
            }
            break;
        case EnumDiagName.КругДиаг:
            sett = {
                type: EnumDiagType.Pie,
                diagName: EnumDiagName.КругДиаг,
   
            }
            break;
        case EnumDiagName.КольцДиаг:
            sett = {
                type: EnumDiagType.Doughnut,
                diagName: EnumDiagName.КольцДиаг,

            }
            break;
        case EnumDiagName.ТочечДиаг:
            sett = {
                type: EnumDiagType.Scatter,
                diagName: EnumDiagName.ТочечДиаг,
   
            }
            break;
        case EnumDiagName.ПузДиаг:
            sett = {
                type: EnumDiagType.Bubble,
                diagName: EnumDiagName.ПузДиаг,

            }
            break;
    }

    store.dispatch('setDiagType', sett)
}

interface IOption {
    id: number;
    //accum?: boolean;
    name: string
    childs?: IChildOption[]
    active?: boolean
    icon?: string
}

interface IChildOption {
    id: number
    accum: boolean //yfr
    name: string
    img: string
    active: boolean
    icon: string

}
function deactivateAll(options: IOption[]) {
    options.forEach(option => {
        option.active = false;
        if (option.childs) {
            deactivateAll(option.childs);
        }
    });
}
</script>