import { EnumColumnName, EnumColumnTableNumber } from "@/enums/EnumColumnValues"
import { EnumTypeField } from "@/enums/EnumsByFilter"
import { EnumAccumType, EnumDiagName, EnumDiagType, EnumJoinType, EnumUnionType } from "@/enums/EnumsDiagramm"

export interface ConfigData {
  config: any
  //dataMap: Map<EnumColumnTableNumber, any[]>,
  ranges: IRange[]
  params: IParam[]
  axisX: IParam | null
  accumType: EnumAccumType
  joinType: EnumJoinType
  unionType: EnumUnionType
  union: boolean
  type: EnumDiagType
  tension?: number
  fill?: boolean
  stepped?: boolean
  stacked?: boolean
  diagName: EnumDiagName
  normir?: boolean
  opacity?: boolean
  slant?: boolean

  bubbleUnion?: boolean
  bubbleParams: IBubbleObj[]
}

export interface IBubbleObj {
  name: string
  union: boolean,
  param?: IParam | null,
  data: number[]
}
type callback= ReturnType<()=>any>

export interface IDataset {
  type: string
  label: string
  data: any[]
  backgroundColor?: string | callback
  borderColor?: string
  borderRadius?: number
  datalabels?: any
  labels?: any[],
  value?: any
}

export interface IDiagram {
  type: string
  data: any
  options: any
}

export interface IRange {
 // typeValue: EnumTypeField
  from: number
  to: number
  textRange: string
  data: Map<EnumColumnTableNumber, any[]>
  active: boolean
}
export interface ISettGraph {
  type: EnumDiagType
  fill?: boolean,
  stepped?: boolean,
  stacked?: boolean,
  tension?: number,
  diagName:EnumDiagName,
  normir?: boolean
  opacity?: boolean
  slant?: boolean
}
export interface IRangeParam {
  from: number,
  to: number,
  textRange: string,
  numCols: number[]
}

export interface IParam {
  name: EnumColumnName | string,
  type: EnumTypeField,
  icon: string,
  label?: IParam,
  calcType?: EnumUnionType,
  colNum?: number,
  data?:number[]
}

export interface ISett {
  joinType: EnumJoinType,
  accumType: EnumAccumType,
}
/* export interface IObjParam {
  joinType: EnumJoinType,
  accumType: EnumAccumType,
} */