import { MutationTree } from 'vuex';
import {  ConfigData, IRangeParam , IRange, ISett, IParam, IDataset, ISettGraph} from './types';
import { instance } from '@/helpers/InstanceHelper';
import { EnumColumnTableNumber } from '@/enums/EnumColumnValues';
import { toRaw } from 'vue';
import { EnumAccumType, EnumDiagName, EnumDiagType, EnumJoinType, EnumUnionType } from '@/enums/EnumsDiagramm';
import { findMedian } from '@/helpers/DiagramHelper';
import { EnumTypeField } from '@/enums/EnumsByFilter';

function getColor(idx: number,clrIdx:number,type:EnumDiagType, opacity:boolean | undefined, opac: number) {
 // console.log('getColor', clrIdx, type, opacity, opac)
  if (type==EnumDiagType.Bar || type==EnumDiagType.Scatter) {
    return getRgba(clrIdx, opac)
  } else if (opacity) {
    return  getRgbaOpac(clrIdx, opac)
  } else {
    return getRgbaBack(clrIdx, opac)
  }
}

function getRgba(clrIdx:number, opac: number) {
  const hexColor = colors[clrIdx].border
  const r = parseInt(hexColor.substring(1, 3), 16)
  const g = parseInt(hexColor.substring(3, 5), 16)
  const b = parseInt(hexColor.substring(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opac})`
}

function getRgbaBack(clrIdx:number, opac: number) {
  const hexColor = colors[clrIdx].back
  const r = parseInt(hexColor.substring(1, 3), 16)
  const g = parseInt(hexColor.substring(3, 5), 16)
  const b = parseInt(hexColor.substring(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opac})`
}

function getRgbaOpac(clrIdx:number, opac: number) {
  return colors[clrIdx].opac.replace('0.5', String(opac/2))
}

function rescaleArray(arr:number[]) {
  const minVal = Math.min(...arr);
  const maxVal = Math.max(...arr);
  if (minVal === maxVal) return Array(arr.length).fill(minVal)

  // Определяем множитель для преобразования
  const multiplier = 30 / maxVal;

  // Преобразуем каждый элемент массива
  return arr.map(x => Math.round(x * multiplier));
}
const colors = [
  {border: '#4285f4', back: '#c6dafc', opac: 'rgba(66, 133, 244, 0.5)'},
  {border: '#ea4335', back: '#f9c6c2', opac: 'rgba(234, 67, 53, 0.5)'},
  {border: '#fbbc04', back: '#feebb3', opac: 'rgba(251, 188, 4, 0.5)'},

  {border: '#34a853', back: '#c2e5cb', opac: 'rgba(52, 168, 83, 0.5)'},
  {border: '#ff6d01', back: '#ffd3b2', opac: 'rgba(255, 109, 1, 0.5)'},
  {border: '#46bdc6', back: '#c7ebee', opac: 'rgba(70, 189, 198, 0.5)'},
  {border: '#7baaf7', back: '#d7e5fd', opac: 'rgba(123, 170, 247, 0.5)'},
  {border: '#f07b72', back: '#fad7d4', opac: 'rgba(240, 123, 114, 0.5)'}
]
function calcPercentages(arrs: any[]) {
  const length = arrs[0].length
  const resultArrays: any[] = Array.from({ length: arrs.length }, () => [])

  for (let i=0;i<length;i++) {
    let sum=0
    for (let j=0;j<arrs.length;j++) {
      sum+=arrs[j][i];
    }
    for (let j=0;j<arrs.length;j++) {
      resultArrays[j].push(+((arrs[j][i]/sum)*100).toFixed(2))
    }
  }
  return resultArrays
}

export const mutations: MutationTree<ConfigData> = {
  
  UPDATE_CONFIG(state: ConfigData) {
    
    if (state.diagName==EnumDiagName.ПузДиаг) {
    //ДЛЯ ПУЗЫРЬКОВОЙ ДИАГРАММЫ
      state.config = null
      let lng=0

      console.log('ДЛЯ ПУЗЫРЬКОВОЙ ДИАГРАММЫ', )
      if (state.ranges.length) {

/*         if (state.bubbleUnion) {
          console.log('state.unionType',state.bubbleUnion )
        } else { */

          const bubbleParams = structuredClone(state.bubbleParams)
          if (bubbleParams) {
            bubbleParams.forEach((el: any) => {

              const colNum = el.param?.colNum ?? -1
              if (colNum!==-1) {
                let data = state.ranges[0].data.get(colNum as EnumColumnTableNumber) as any[]
                
                const dt=new Date(data[0])
                if (data && String(dt) != 'Invalid Date' && dt.toISOString().substring(0,10) != '1970-01-01') {
                  data=data.map(el=> new Date(el).getTime() / 1000 / 60 / 60 / 24 + 25569)
                }

                if (data && data.length > lng) {
                  lng=data.length
                }

                el.data = data ?? []
              }
            })
          }

          //params
          let params:any[] = []
          if (bubbleParams[3].data.length) {
            params = [...bubbleParams[3].data]
          } else {
            params = new Array(lng).fill('')
          }

          let datasets:IDataset[]=[]
          console.log('params', params)
          if (params.every((el,_,arr)=>el==arr[0])) {
            //значит все эл-ты масс одинаковы

            //xyr
            const data = bubbleParams[1].data.map((x: number, idx: number) => ({
              x: x,
              y: bubbleParams[2].data[idx] ?? -1,
              r: bubbleParams[4].data[idx] ?? 20
            }))

            //идентиф-ры
            let labels=[]
            if (bubbleParams[0].data.length) {
              labels = [...bubbleParams[0].data]
            } else {
              labels = new Array(data.length).fill('')
            }


            datasets = [{
              type: state.type,
              label: '',
              data: data,
              backgroundColor: colors[0].border
            }]

            console.log('ысе эл-ты масс одинаковы')
            state.config = {
              labels: labels,
              datasets: datasets,
              indexAxis:'x',
              type: state.type,
            }
          } else {
            //значит среди параметров есть разнве значения (99% случаев)

            //идентиф-ры
            let labels:any[]=[]
            if (bubbleParams[0].data.length) {
              labels = [...bubbleParams[0].data]
            } else {
              labels = new Array(params.length).fill('')
            }
            //обход всех параметров
            let opac = 1.2
            let clrIdx = -1

            for (const [idx,param] of params.entries()) {

              if (Number.isInteger(idx/colors.length-1)) {
                clrIdx=0
                opac -=0.2
              } else {
                clrIdx++
              }

              //есчть такое нзачение уже было то пуш коорд в дата
              const dataset = datasets.find(el=>el.value==param)
              if (dataset) {
                dataset.data.push({
                  x: bubbleParams[1].data[idx] ?? -1,
                  y: bubbleParams[2].data[idx] ?? -1,
                  r: bubbleParams[4].data[idx] ?? 20,
                  id: idx
                })
              } else {
                
                //если уникальное значение
                const data=[]
                data.push({
                  x: bubbleParams[1].data[idx] ?? -1,
                  y: bubbleParams[2].data[idx] ?? -1,
                  r: bubbleParams[4].data[idx] ?? 20,
                  id: idx
                })


                datasets.push({
                  label: `${params[idx]}`,
                  value: param,
                  type: state.type,
                  
                  data: data,
                  backgroundColor: getRgba(clrIdx, opac) ,

                  datalabels: {
                    color: 'black',

                    textStrokeColor: 'white',
                    textShadowBlur: 1,
                    textShadowColor: 'white',
                    textStrokeWidth: 3,
                    clip: false,
                    clamp: false,
                    formatter: ()=> labels[idx] ?? '',
                    font:{family: 'GoogleSans-Regular', size: 14}
                  }

                })
              }
            }

            if (state.bubbleUnion) {
              datasets.forEach((el:any)=>{
                const data = el.data.reduce((acc:any, currentObj:any) => {
                    acc.x = (acc.x || 0) + currentObj.x;
                    acc.y = (acc.y || 0) + currentObj.y;
                    acc.r = (acc.r || 0) + currentObj.r;
                    return acc;
                }, {})
                el.data=[{...data, id:0}]
              })

              //labels=[...new Set(labels)] 
            }

            //надо пересчитать R размеры
            let sizes = [...bubbleParams[4].data].filter(a=>a)
            if (sizes.length) {
              sizes = rescaleArray(sizes)
            }

            datasets.forEach(el=>{
              if(el.data.length) {
                el.data.forEach(els=>{
                  els.r = sizes[els.id] ?? 20
                })
              }
            })

            
    
            state.config = {
              labels: labels,
              datasets: datasets,
              type: state.type,
              indexAxis: "x",
            }
            
            
          }
        
      } else {
        //если нет диапазонов
        state.config = {
          labels: null,
          datasets: [],
          indexAxis:'x',
          type: undefined
        }
      }
    } else {
    //ДЛЯ ОСТАЛЬНЫХ
      if (state.normir) {

        const arrs= []

        for (const param of state.params) {
          let rawData = state.ranges[0].data.get(param.colNum as EnumColumnTableNumber) as number[]
          if (rawData && new Date(rawData[0]).toISOString().substring(0,10) !== '1970-01-01') {
            rawData=rawData.map(el=> new Date(el).getTime() / 1000 / 60 / 60 / 24 + 25569 )
          }
          if (rawData) arrs.push(rawData)
        }

        if (arrs.length) {
          const res:any[]=calcPercentages(arrs)
          const clone=structuredClone(state.params)
          clone.forEach((el:any, idx:any) => el.data=res[idx])
          state.params=clone
        }
      } 

      const datasets: IDataset[] = []
      state.config = null

      if (state.ranges.length) {
      
        if (state.union) {
          //С ОБЬЕДИНЕНИЕМ
          const lbls: any[]=state.ranges[0].data.get(state.axisX?.colNum as EnumColumnTableNumber) as any[]
          const unical: any[]=[...new Set(lbls)]
  

          let opac = 1
          let clrIdx = -1

          for (const [idx,param] of state.params.entries()) {
            if (idx!==0 && Number.isInteger(idx/colors.length-1)) {
              clrIdx=0
              opac -=0.2
            } else {
              clrIdx++
            }
            //const rawData = state.ranges[0].data.get(param.colNum as EnumColumnTableNumber) as any[]
            let rawData = state.normir
                      ? param.data as any[]
                      : state.ranges[0].data.get(param.colNum as EnumColumnTableNumber) as any[]
            
            /* const dt=new Date(data[0])
            if (rawData && new Date(rawData[0]).toISOString().substring(0,10) !== '1970-01-01') {
              rawData=rawData.map(el=> new Date(el).getTime() / 1000 / 60 / 60 / 24 + 25569 )
            } */
            const dt=new Date(rawData[0])
                if (rawData && String(dt) != 'Invalid Date' && dt.toISOString().substring(0,10) != '1970-01-01') {
                  rawData=rawData.map(el=> new Date(el).getTime() / 1000 / 60 / 60 / 24 + 25569)
                }

            const data = []
            
            let res=0
            switch (param.calcType) {
              case EnumUnionType.Количество:
                for (const label of unical) {
                  res = rawData.reduce((acc,cur,i) => {
                    if (lbls[i]==label) return acc+1
                    return acc
                  }, 0);
  
                  data.push(res)
                }
                break;
              case EnumUnionType.Максимум:
                for (const label of unical) {
                  const res=rawData.reduce((max,cur,i) => {
                    if (lbls[i]==label && cur > max) return cur
                    return max
                  }, -Infinity)
  
                  data.push(res)
                }
                break;
              case EnumUnionType.Минимум:
                for (const label of unical) {
                  const res = rawData.reduce((min,cur,i) => {
                      if (lbls[i]==label && (cur < min || isNaN(min))) {
                          return cur;
                      }
                      return min;
                  }, NaN)
                  
                  data.push(res)
                }
                break;
              case EnumUnionType.Медиана:
                for (const label of unical) {
                  const res =rawData.reduce((acc,cur,i) => {
                    if (lbls[i]==label) acc.push(cur)
                    return acc
                  }, [])
                  const median = findMedian(res)
  
                  data.push(median)
                }
                break;
              case EnumUnionType.Среднее:
                for (const label of unical) {
                  const res =rawData.reduce((acc,cur,i) => {
                    if (lbls[i]==label) {
                      acc.sum += cur
                      acc.count++
                    }
                    return acc
                  }, { sum: 0, count: 0 })
                  const average = res.count ? res.sum / res.count : 0
  
                  data.push(average)
                }
                break;
              case EnumUnionType.Сумма:
                for (const label of unical) {
                  res = rawData.reduce((acc, cur, i) => {
                    if (lbls[i]==label) return acc+cur
                    return acc;
                  }, 0);
                  data.push(res)
                }
  
              break;
              default:res = 0
              break;
            }
  
            const labels = new Array(unical.length).fill('')
  
            //console.log('datadata', data)
  
            let type: EnumDiagType = state.type
            let order=1
            if (idx==0 && state.diagName==EnumDiagName.КомбДиаг) {
              //если комб диаг,то первый датасет будет столбчатым остальные графики
              type=EnumDiagType.Bar
              order=2
            }
            
            datasets.push({
              pointRadius: type==EnumDiagType.Scatter ? 5 : 3,
              type: type,
              label: '',
              data: data,
              backgroundColor: getColor(idx,clrIdx,type, state.opacity, opac),
              borderColor: getColor(idx,clrIdx,type, state.opacity, opac),
              borderRadius: 2,
              labels: labels,
              tension: state.tension,
              fill: state.fill,
              stepped: state.stepped,
              stack: state.stacked?true:undefined,
  
              datalabels: {
                color: getColor(idx,clrIdx,type, state.opacity, opac),
                anchor: (ctx: any) => {
                  if (state.stacked || state.slant || (type==EnumDiagType.Pie || type==EnumDiagType.Doughnut)) {
                    return 'center'
                  } else {
                    return 'end'
                  }
                },
                align: (ctx: any) => {
                  if (state.stacked || state.slant || (type==EnumDiagType.Pie || type==EnumDiagType.Doughnut)) {
                    return 'center'
                  } 
                  else  {
                    return 'top'
                  }
                },
                textStrokeColor: 'white',
                textShadowBlur: 1,
                textShadowColor: 'white',
                textStrokeWidth: 3,
                clip: true,
                clamp: true,
                formatter: (_:any,ctx:any)=>labels ? labels[ctx.dataIndex]:'',
                font:{family: 'GoogleSans-Regular', size: 14}
              }
            } as unknown as IDataset)
          }  
          
          state.config = {
            labels: unical,
            datasets: datasets,
            xlabels:  new Array(unical.length).fill(''),
            indexAxis:state.slant?'y':'x',
            type: state.type,

          }
  
        } else {
          //БЕЗ ОБЬЕДИНЕНИЯ
          let lng = 0
              
          let opac = 1.2
          let clrIdx = -1

          for (const [idx,param] of state.params.entries()) {
            
            if (idx!==0 && Number.isInteger(idx/colors.length-1)) {
              clrIdx=0
              opac -=0.2
            } else {
              clrIdx++
            }

            //length
            let data = state.normir
                      ? param.data
                      : state.ranges[0].data.get(param.colNum as EnumColumnTableNumber) as any[]
            
            //преобраз даты в число
            if (data && new Date(data[0]).toISOString().substring(0,10) !== '1970-01-01') {
              data=data.map(el=> new Date(el).getTime() / 1000 / 60 / 60 / 24 + 25569 )
            }

            const labels= state.ranges[0].data.get(param.label?.colNum as EnumColumnTableNumber) as any[]
  
            if (data && data.length) lng=data.length 
            
            let type: EnumDiagType = state.type
            let order=1
            if (idx==0 && state.diagName==EnumDiagName.КомбДиаг) {
              //если комб диаг,то первый датасет будет столбчатым остальные графики
  
              type=EnumDiagType.Bar
              order=2
            }
            
            datasets.push({
              pointRadius: type==EnumDiagType.Scatter ? 5 : 3,
              order: order,
              type: type,
              label: '',
              data: data,
              backgroundColor: (type==EnumDiagType.Pie || type==EnumDiagType.Doughnut) ? 
                              colors.map(el=>el.border)
                              :
                              getColor(idx,clrIdx,type, state.opacity, opac),
  
              borderColor: state.type==EnumDiagType.Pie || state.type==EnumDiagType.Doughnut ? undefined : getRgba(clrIdx, opac),
              borderRadius: 2,
              labels: labels,
              tension: state.tension,
              fill: state.fill,
              stack: state.stacked?true:undefined,
              stepped: state.stepped,
              borderWidth: 1,
  
              datalabels: {
                color: getRgba(clrIdx, opac),
                anchor: (context: any) => {
                  if (state.stacked || state.slant || (type==EnumDiagType.Pie || type==EnumDiagType.Doughnut)) {
                    return 'center'
                  } else {
                    return 'end'
                  }
                },
                align: (context: any) => {
                  if (state.stacked || state.slant || (type==EnumDiagType.Pie || type==EnumDiagType.Doughnut)) {
                    return 'center'
                  } 
                  else  {
                    return 'top'
                  }
                },
                //align: 'top',
                textStrokeColor: 'white',
                textShadowBlur: 1,
                textShadowColor: 'white',
                textStrokeWidth: 3,
                clip: false,
                clamp: true,
                formatter: (_:any,ctx:any)=>labels ? labels[ctx.dataIndex]:'',
                font:{family: 'GoogleSans-Regular', size: 14}
              }
            } as unknown as IDataset)
          }
      
          //для осьX
          let lbls: any[]= toRaw(state.ranges[0].data.get(state.axisX?.colNum as EnumColumnTableNumber)) as any[] ?? new Array(lng).fill('')
          const xlbls = toRaw(state.ranges[0].data.get(state.axisX?.label?.colNum as EnumColumnTableNumber) as any[]) ?? new Array(lng).fill('')
  
  
          console.log('state.axisX', state.axisX)
          let xTickDisplay=true
          if (state.type==EnumDiagType.Scatter && !state.axisX) {
            lbls = Array.from({length: lbls.length}, (_, i) => i)
            xTickDisplay=false
          }
        
          state.config = {
            labels: lbls,
            datasets: datasets,
            xlabels: xlbls,
            indexAxis:state.slant?'y':'x',
            type: state.type,
            xTickDisplay:xTickDisplay
          }
        }
  
      } else {
        //если нет диапазонов
        state.config = {
          labels: null,
          datasets: [],
          indexAxis:'x',
          type: undefined
        }
      }
    }
  },

  DELETE_RANGE(state: ConfigData, range: string) {
    const idx = state.ranges.findIndex(el=>el.textRange===range)
    state.ranges.splice(idx, 1)
  },
  ADD_DATA_AT_COL(state: ConfigData, col: number) {
    if (!state.ranges.length) return

    const data = (instance.getData() as any[])
    for (const range of state.ranges) {
      const dt = data.slice(range.from, range.to).map((el: any)=> el[col])
      range.data.set(col, dt)
    }
  },
  DEL_DATA_AT_COL(state: ConfigData, col: number) {
    if (!state.ranges.length) return

   
    for (const range of state.ranges) {
      range.data.delete(col)
    }

    //console.log('DEL_DATA_AT_COL')
  },
  ADD_RANGE(state: ConfigData, rangeObj: IRangeParam) {
    const data = (instance.getData() as any[])
    const obj: IRange = {
      from: rangeObj.from,
      to: rangeObj.to,
      textRange: rangeObj.textRange,
      data: new Map([]),
      active: true
    }

    state.ranges.push(obj)
    for (const range of state.ranges) {
      for (const col of rangeObj.numCols) {
        const dt = data.slice(range.from, range.to).map((el: any)=> el[col])
        range.data.set(col, dt)
      }
    }
  },
  SET_SETTINGS(state: ConfigData, sett: ISett) {
    state.accumType = sett.accumType
    state.joinType = sett.joinType
    
  },
  SET_PARAMS(state: ConfigData, obj: any) {
    state.union = obj.union
    state.unionType = obj.unionType
    state.params = obj.params
  },
  SET_BUBBLE_SETT(state: ConfigData, obj: any) {
    //console.log('SET_BUBBLE_SETT', obj)
    state.bubbleUnion= obj.union
    state.bubbleParams = obj.params
  },

  SET_AXISX(state: ConfigData, axisX: IParam) {
    state.axisX = axisX
  },
  SET_UNION(state: ConfigData, val: boolean) {
    state.union = val
  },
  SET_UNION_BUBBLE(state: ConfigData, val: boolean) {
    state.bubbleUnion = val
  },
  SET_DIAG_TYPE(state: ConfigData, sett: ISettGraph) {
    state.type=sett.type
    state.tension = sett.tension==undefined ? state.tension:sett.tension
    state.fill=sett.fill  ?? false
    state.stepped=sett.stepped ?? false
    state.stacked=sett.stacked ?? false
    state.diagName=sett.diagName
    state.normir=sett.normir ?? false
    state.opacity=sett.opacity ?? false
    state.slant=sett.slant ?? false
    
  },
  RESET_STATE_DIAG(state: ConfigData) {
    console.log('RESET_STATE_DIAG')

    state.config= {indexAxis:'x'}
    state.ranges=[]
    state.params=[]
    state.axisX=null
    state.union=false
    state.unionType=EnumUnionType.Сумма
    state.accumType=EnumAccumType.Нет
    state.joinType=EnumJoinType.Погоризонтали
    state.type=EnumDiagType.Bar
    state.tension=0,
    state.fill=false
    state.stepped=false
    state.stacked=false
    state.diagName=EnumDiagName.СтолбДиаг
    state.normir=false
    state.opacity=false
    state.slant= false
    state.bubbleUnion= false
    state.bubbleParams=[]
  },
  
}

