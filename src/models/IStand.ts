import { IStandAllocation } from "./IStandAllocation";

export interface IStand {
    EntityId: string
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