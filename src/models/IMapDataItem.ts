import { IPosition } from "../mapwrapper/IPosition";

export interface IMapDataItem{
    Position: IPosition;
    Direction: number;
    PictogramId: string;
}