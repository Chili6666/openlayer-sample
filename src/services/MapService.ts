import View from "ol/View";
import Map from "ol/Map";
import { IPosition } from "@/mapwrapper/IPosition";
import Feature from "ol/Feature";
import { pointToArray, positionToArray, positionToPoint, pointToPosition, arrayToPoint } from "@/mapwrapper/MapHelper";
import { IMapDataItem } from "@/models/IMapDataItem";

class MapService {
    private internalMap;

    public initializeService(map: Map): void {
        this.internalMap = map;
    }

    public get map(): Map {
        return this.internalMap;
    }

    public get view(): View {
        return this.internalMap.getView();
    }

    public GetFeatureAtPixel(pixel): Feature {
        return this.internalMap.forEachFeatureAtPixel(
            pixel,
            (feature: Feature, layer: any) => {
                return feature;
            }
        );
    }

    public GetMapDataItemAtPixel(pixel): IMapDataItem {
        return this.internalMap.forEachFeatureAtPixel(
            pixel,
            (feature: Feature, layer: any) => {
                if(feature)
                    return feature.get('mapDataItem') as IMapDataItem;
                return null;
            }
        );
    }

    public get centerPoint(): IPosition {
        const view = this.internalMap?.getView();
        const center = view?.getCenter();
        return pointToPosition(arrayToPoint(center));
    }

    public moveMapTo(position: IPosition, rotation: number, zoomLevel: number) : void {
        this.view.animate({
            center: pointToArray(positionToPoint(position)),
            duration: 1500,
            rotation: rotation,
            zoom: zoomLevel
        }, this.animationFinished);
    }

    public moveMapToPosition(position: IPosition) : void {
        this.view.animate({
            center: pointToArray(positionToPoint(position)),
            duration: 500,
        }, this.animationFinished);
    }

    private animationFinished() : void {
        console.log('animationFinished');
    }


}


export default new MapService();