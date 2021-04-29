import { IMapDataItem } from "./IMapDataItem";

export interface ITerminalResource  extends IMapDataItem {
    Id: string;
    Direction: number;
    Latitude: number;
    Longitude: number;
    DisplayName: string;
    PictogramId: string;
    SubType : string;
}