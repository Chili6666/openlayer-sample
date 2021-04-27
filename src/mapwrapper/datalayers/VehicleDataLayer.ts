import { MapDataLayerBase } from "./MapDataLayerBase";
import { ref, Ref } from "vue";
import { IVehicle } from "@/models/IVehicle";
import BaseModelDataService from "@/services/BaseModelDataService";
import { MapItemVisualization } from "@/models/MapItemVisualization";
import Feature from "ol/Feature";
import Geopoint from "ol/geom/Point";

import {
    positionToPoint,
    pointToArray,
    arrayToPosition,
} from "@/mapwrapper/MapHelper";

import VehicleStyleFactory from "./VehicleStyleFactory";
import { IStyleFactory } from "../IStyleFactory";

export class VehicleDataLayer extends MapDataLayerBase {

    private _mapDataItems: Ref<IVehicle[]> = ref([]);

    public get name(): string {
        return 'Vehicles';
    }

    public get vehicles(): Ref<IVehicle[]> {
        return this._mapDataItems;
    }

    public get styleFactory(): IStyleFactory {
        return VehicleStyleFactory;
    }

    async onSetupDataSource(): Promise<void> {
        this._mapDataItems.value = await BaseModelDataService.getVehicles();
        this._mapDataItems.value.forEach(item => this.addMapDataItem(item));
    }

    private addMapDataItem(dataItem: IVehicle): void {
        const mapPoint = pointToArray(positionToPoint(arrayToPosition([dataItem.Position.Longitude, dataItem.Position.Latitude])));
        const iconFeature = new Feature({
            geometry: new Geopoint(mapPoint),
        });

        iconFeature.set('mapDataItem', dataItem);
        iconFeature.setId(dataItem.EntityId);

        const mapItemVisualization = new MapItemVisualization(dataItem.PictogramId);
        mapItemVisualization.direction = dataItem.Direction;
        mapItemVisualization.textFillColor = '#FFFFFF';
        mapItemVisualization.textColor = "#000000"
        iconFeature.set('mapItemVisualization', mapItemVisualization);
        this.addFeature(iconFeature);
    }
}