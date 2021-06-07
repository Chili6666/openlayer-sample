import { IPosition } from "../mapwrapper/IPosition";
import { IMapDataItem } from "./IMapDataItem";
import { IOccurrence } from "./IOccurrence";

export interface IVehicle extends IMapDataItem {
    Direction: number;
    PictogramId: string;
    Position: IPosition;
    DisplayName: string;
    Occurrences: IOccurrence[];
    TypeName: string;
    OperationalStatusName: string;
    Department: string;
    Velocity: number;
}