import View from "ol/View";
import Map from "ol/Map";
import Overlay from "ol/Overlay";
import Feature from "ol/Feature";

import { IPosition } from "@/mapwrapper/IPosition";
import { pointToArray, positionToPoint, pointToPosition, arrayToPoint } from "@/mapwrapper/MapHelper";
import { IMapDataItem } from "@/models/IMapDataItem";

class MapService {
    private internalMap:Map;
    private overlay: Overlay;
    private smartViewContainer : any;

    public initializeService(map: Map, overlay: Overlay, container : any): void {
        this.internalMap = map;
        this.overlay = overlay;
        this.smartViewContainer = container;
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

    public showOverlayForDataItem(mapDataItem: IMapDataItem, coordinate: any){
        if(!this.overlay) return;
        if(!this.smartViewContainer) return;
        if(!mapDataItem) return;
        if(!coordinate) return;

        //TODO Replace this with real mapDataItem based Smartview   
        this.smartViewContainer.innerHTML = '<p>You clicked Item:</p><code>' + mapDataItem.EntityId + '</code>';
        this.overlay.setPosition(coordinate);

    }

    private animationFinished() : void {
        console.log('animationFinished');
    }


}


export default new MapService();