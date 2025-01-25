<style lang="scss">
.diag-view {
    position: absolute;
    inset: 0;
    padding: 10px;
    display: grid;
    place-items: center;
    
    &__body {
        position: relative;
        width: 100%;
        height: 100%;
        min-width: 100%;
        min-height: 100%;
    }

    &__menu {
        position: absolute;
        top: -5px;
        right: -8px;
    }

    &__nodata {
        height: 100%;
        display: flex;
        align-items: center;
        pointer-events: all;
        overflow: hidden;

        span {
            color: #9e9e9e;
            text-align: center;
            font-size: 56px;
            letter-spacing: 0.4px;
            line-height: 54px;
            font-family: GoogleSans-Regular;
            word-break: break-word;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 6;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}

</style>

<template>
    <div class="diag-view">
        <div class="diag-view__body">
            <TheDiagMenu @saveAsPDF="saveAsPDF" @deleteDiag="deleteDiag"></TheDiagMenu>
            <canvas v-show="haveData && axis==='x'" id="chart-example">x</canvas>
            <canvas v-show="haveData && axis==='y'" id="chart-ex">y</canvas>
            <div v-if="!haveData" class="diag-view__nodata">
                <span>Добавьте диапазон данных, который нужно визуализировать</span> 
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { EnumDiagType } from "@/enums/EnumsDiagramm";
import { Chart, ChartData, ChartOptions, layouts, registerables } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ChartAnnot from 'chartjs-plugin-annotation';
import TheDiagMenu from '../SidebarComponents/Diagram/TheDiagMenu.vue';
import { jsPDF} from "jspdf" ;
import { computed, defineProps, nextTick, onMounted, reactive, ref, toRaw, watch, watchEffect } from "vue";
import { useStore } from "vuex";
Chart.register(...registerables, ChartDataLabels, ChartAnnot)
const store = useStore()
var myChart: Chart 
var myChart2: Chart 

onMounted(() => {
    const canvas = document.getElementById('chart-example') as HTMLCanvasElement;
    const canvas2 = document.getElementById('chart-ex') as HTMLCanvasElement;
    if (canvas) myChart = new Chart(canvas, chartObject.value)
    if (canvas2) myChart2 = new Chart(canvas2, chartObject2.value)

    store.dispatch('updateConfig')
})

const props = defineProps<{
    coord: any
}>() 

const config = computed(() => store.getters.config)
let haveData = ref(false)
let chartObject = ref<any>({})
let chartObject2 = ref<any>({})

let axis=ref<'x'|'y'>('x')

watch(config, (conf:any)=>{
    console.log('watch conf', conf)
    if (!conf || Object.keys(conf).length==1) return

    if (conf.type==EnumDiagType.Bubble) {
        if (conf.datasets[0].data.length && conf.datasets[0].data[0].x==-1 || conf.datasets[0].data.length && conf.datasets[0].data[0].y==-1) {
            haveData.value = false
        } else {
            haveData.value = true
        }

        if (!myChart) return

        axis.value='x'
        opt.scales.x.grid.display=false
        opt.scales.y.grid.display=true

        myChart.data = conf
        console.log('conf', conf)
        myChart.options = optbub

        setTimeout(() => {nextTick(()=>{myChart.update()})})

    } else {
        opt.scales.x.ticks.display = conf.xTickDisplay ?? true

        if (conf.type==EnumDiagType.Pie || conf.type==EnumDiagType.Doughnut) {
            opt.scales.x.display=false
            opt.scales.y.display=false
        } else{
            opt.scales.x.display=true
            opt.scales.y.display=true
        }

        haveData.value = conf.datasets.length > 0 ? true : false

        /* if (conf.lblsX3 && conf.lblsX3.length && !conf.lblsX3.every((r:any)=>r=='')) {
            opt.scales.x3.display=true
        } else {
            opt.scales.x3.display=false
        } */

        if (conf.indexAxis=='x') {
            //XXXXX
            if (!myChart) return

            axis.value='x'
            opt.scales.x.grid.display=false
            opt.scales.y.grid.display=true

            opt.scales.y.border.display=false
            opt.scales.x.border.display=true
            
            myChart.data = conf
            myChart.options = {...optionsX, ...opt}
            setTimeout(() => {nextTick(()=>{myChart?.update()})})
        } else {
            //YYYYYY
            if (!myChart2) return
            axis.value='y'
            opt.scales.y.grid.display=false
            opt.scales.x.grid.display=true

            opt.scales.x.border.display=false
            opt.scales.y.border.display=true

            myChart2.data = conf
            myChart2.options = {...optionsY, ...opt}
            setTimeout(() => {nextTick(()=>{myChart2?.update()})})
        }
    }
})

const optionsY = reactive<any>({indexAxis: 'y'})
let optionsX = reactive<any>({indexAxis: 'x'})

const opt = reactive<any>({
    layout: {padding: {top:20}},
    animation: false,
    normalized: true,
    responsive: true,
    devicePixelRatio: 2,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'top',
            align: 'center',
            maxWidth: 8,
            fullSize: true
            /* title: {
                display: false,
                text: 'title ##',
            } */
        },
        decimation: {
            enabled: true,
            threshold:5
        },
        annotation: {
            annotations: {
            }
        }
    },
    elements: {
        bar: {
            borderWidth: 2,
        },
        arc: {
        }
    },
    scales: {
        y: {
            display: true,
            grid: {
                display: false,
                offset: false,
            },
            border: {
                display: false,
                color: '#333333',
                width:2
            },
            ticks: {
                z: 1,
                color: 'black',
                font: {
                    family: 'GoogleSans-Regular',
                }
            },
        },
        x: {
            display: true,
            border: {
                display: false,
                color: '#333333',
                width:2
            },
            grid: {
                display: false,
                offset: false,
                
            },
            ticks: {
                display: false,
                z: 1,
                color: 'black',
                font: {
                    family: 'GoogleSans-Regular',
                }
            },
        },
        x2: {
            grid: {
                display: false,
                offset: false
            },
            position: 'center',
            offset: true,
            alignToPixels: true,
            ticks: {
                crossAlign: 'far',                
                z: 2,
                textStrokeWidth: 3,
                textStrokeColor: 'white',
                labelOffset: 10,
                minRotation: 90,
                color: '#999999',
                font: {
                    family: 'GoogleSans-Regular',
                },
                callback: function(value:any, index:any) {
                    return `${config.value.xlabels[index]}`
                }
            },
            border: {
                display: false
            }
        }
    }

})
const optbub = reactive<any>({
    animation: false,
    normalized: true,
    responsive: true,
    devicePixelRatio: 2,
    maintainAspectRatio: false,
    /* plugins: {
        legend: {
            display: false,
            position: 'top',
            title: {
                display: false,
                text: '',
            }
        },
    }, */

    elements: {
    },

    scales: {
        y: {
            display: true,
            ticks: {
                z: 1,
                color: 'black',
                font: {
                    family: 'GoogleSans-Regular',
                }
            },
        },
        x: {
            display: true,
            ticks: {
                //display: false,
                z: 1,
                color: 'black',
                font: {
                    family: 'GoogleSans-Regular',
                }
            }
        }
    }

})

watchEffect(() => {
    let coor = {...props.coord}
    if (axis.value=='x') {
        if (!myChart) return
        myChart.options.aspectRatio=coor.w/coor.h
        setTimeout(() => {nextTick(()=>{myChart?.resize()})})
    } else {
        if (!myChart2) return
        myChart2.options.aspectRatio=coor.w/coor.h
        setTimeout(() => {nextTick(()=>{myChart2?.resize()})})
    }
})

function deleteDiag() {
    myChart.destroy()
    myChart2.destroy()
    console.log('deleteDiag')
    store.dispatch('resetStateDiag')
}

function saveAsPDF() {
    let canvas 
    if (config.value.indexAxis=='x') {
        canvas = document.getElementById('chart-example') as HTMLCanvasElement;
    } else {
        canvas = document.getElementById('chart-ex') as HTMLCanvasElement;
    }

    const imgData = canvas.toDataURL('image/png')
    const w=canvas.width-10
    const h=canvas.height-10

    const pdf = new jsPDF({
        orientation: 'landscape', // Ландшафтная ориентация
        unit: 'px',
        format: [w, h]
    });

    pdf.addImage(imgData,'PNG',0,0,w,h);
    pdf.save('график.pdf')
}

</script>