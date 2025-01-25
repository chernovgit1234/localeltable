
export interface ConfigData {
  configDataList: IConfigData[]
}

export interface IConfigData {
  id: string,
  name: string,
  settings?: {}
}