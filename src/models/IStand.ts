import { IMapDataItem } from "./IMapDataItem";
import { IStandAllocation } from "./IStandAllocation";

export interface IStand  extends IMapDataItem {
    DisplayName: string
    LabelDirection: number
    LabelLatitude: number
    LabelLongitude: number
    PictogramId: string
    StandAllocationDirection: number
    StandAllocationLatitude: number
    StandAllocationLongitude: number
    ActiveStandAllocations: IStandAllocation[];
    PlannedStandAllocations: IStandAllocation[];
}