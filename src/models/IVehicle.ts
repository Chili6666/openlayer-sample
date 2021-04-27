import { IPosition } from "../mapwrapper/IPosition";
import { IOccurrence } from "./IOccurrence";

export interface IVehicle {
    EntityId: string;
    Direction: number;
    PictogramId: string;
    Position: IPosition;
    DisplayName: string;
    Occurrences : IOccurrence[];
}