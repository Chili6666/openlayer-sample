import View from "ol/View";
import Map from "ol/Map";
import { IPosition } from "@/mapwrapper/IPosition";
import { pointToArray, positionToArray, positionToPoint } from "@/mapwrapper/MapHelper";

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

    public moveMapTo(position: IPosition, rotation : number, zoomLevel: number) {
        this.view.animate({
            center: pointToArray(positionToPoint(position)),
            duration: 1500,
            rotation: rotation,
            zoom: zoomLevel
        }, this.animationFinished);
    }

    public moveMapToPosition(position: IPosition) {
        this.view.animate({
            center: pointToArray(positionToPoint(position)),
            duration: 500,
        }, this.animationFinished);
    }

    private animationFinished(){
        console.log('animationFinished');
    }
}


export default new MapService();