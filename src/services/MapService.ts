import View from "ol/View";
import Map from "ol/Map";

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
}


export default new MapService();