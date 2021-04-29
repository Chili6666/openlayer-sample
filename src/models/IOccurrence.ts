import { IMapDataItem } from "./IMapDataItem";

export interface IOccurrence  extends IMapDataItem  {
    Id: string;
    MessageText: string;
    IsClosed: Boolean
}