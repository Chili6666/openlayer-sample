import View from "ol/View";
import Map from "ol/Map";
import Overlay from "ol/Overlay";
import Feature from "ol/Feature";

import { IPosition } from "@/mapwrapper/IPosition";
import { pointToArray, positionToPoint, pointToPosition, arrayToPoint } from "@/mapwrapper/MapHelper";
import { IMapDataItem } from "@/models/IMapDataItem";
import reactiveStore from "@/stores/smartViewStore"

class MapService {
    private internalMap: Map;
    private overlay: Overlay;
    private smartViewHost: any;

    public initializeService(map: Map, overlay: Overlay, smartViewHost: any): void {
        this.internalMap = map;
        this.overlay = overlay;
        this.smartViewHost = smartViewHost;
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
                if (feature)
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

    public moveMapTo(position: IPosition, rotation: number, zoomLevel: number): void {
        this.view.animate({
            center: pointToArray(positionToPoint(position)),
            duration: 1500,
            rotation: rotation,
            zoom: zoomLevel
        }, this.animationFinished);
    }

    public moveMapToPosition(position: IPosition): void {
        this.view.animate({
            center: pointToArray(positionToPoint(position)),
            duration: 500,
        }, this.animationFinished);
    }

    public showOverlayForDataItem(mapDataItem: IMapDataItem, coordinate: any) {
        if (!this.overlay) return;
        if (!this.smartViewHost) return;
        if (!mapDataItem) return;
        if (!coordinate) return;

        //TODO Replace this with real mapDataItem based Smartview   
        // this.smartViewContainer.innerHTML = '<p>You clicked Item:</p><code>' + mapDataItem.EntityId + '</code>';

        // this.smartViewHost.sdlKeyd = "SDL KEY";

        //  console.log('inner' +  this.smartViewHost.innerHTML);

        //  this.smartViewHost.entityId = "mapDataItem.EntityId";

        reactiveStore.sdlKey = 'SDL Key is not defined';
        reactiveStore.entityId = mapDataItem.EntityId;

        this.overlay.setPosition(coordinate);

    }

    private animationFinished(): void {
        console.log('animationFinished');
    }


}


export default new MapService();