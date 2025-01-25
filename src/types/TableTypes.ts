import {EnumTypeBrand, EnumTypeBrandRow} from '../enums/EnumColumnValues'
export interface IModelData {
  Guid: string;
  TypeRow: string;
  Name: string;
  Brand: string;
  ProductionDate: string | null;
  CostOne: number;
  CostTwo: number;
  Percent: number;
  Present: boolean;
  Status: string;
  Comments: string;
}

//TypeRow: EnumTypeBrand | EnumTypeBrandRow;//