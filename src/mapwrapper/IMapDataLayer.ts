import VectorLayer from "ol/layer/Vector";

export interface IMapDataLayer{
    getlayer() : VectorLayer ;
    name : string;
    isVisible : boolean;
}
