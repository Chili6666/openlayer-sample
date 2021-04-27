import Feature from "ol/Feature";
import Style from "ol/style/Style";

export interface IStyleFactory{
    
    createStyles(feature: Feature, resolution: number): Style[];
}