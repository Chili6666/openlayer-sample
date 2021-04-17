import { IPosition } from "../mapwrapper/IPosition";

export interface IVehicle {
    EntityId: string;
    Direction: number;
    PictogramId: string;
    Position: IPosition;
}