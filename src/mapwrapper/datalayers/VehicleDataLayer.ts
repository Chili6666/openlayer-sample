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
import { IPosition } from "../IPosition";

export class VehicleDataLayer extends MapDataLayerBase {

    private _mapDataItems: Ref<IVehicle[]> = ref([]);
    private _interval = 0;

    public get name(): string {
        return 'Vehicles';
    }

    public get vehicles(): Ref<IVehicle[]> {
        return this._mapDataItems;
    }

    public get styleFactory(): IStyleFactory {
        return VehicleStyleFactory;
    }

    public async onSetupDataSource(): Promise<void> {
        this._mapDataItems.value = await BaseModelDataService.getVehicles();
        this._mapDataItems.value.forEach(item => this.addMapDataItem(item));
        //console.log(this._mapDataItems.value.length);
        //setTimeout(this.updatePositions, 5000);

        this._interval = setInterval(() => {

            const id = 'Vehicle.BUS5 - 80';
            const vehicleFeature = this.getFeatureById(id)
            if (vehicleFeature) {
                const mapDataItem: IVehicle = vehicleFeature.get('mapDataItem');
                //const zz2 = vehicleFeature.getGeometry().getCoordinates();

                const newPosition: IPosition = { Latitude: mapDataItem.Position.Latitude + 0.0001, Longitude: mapDataItem.Position.Longitude + 0.0001 }
                mapDataItem.Position = newPosition;
                vehicleFeature.getGeometry().setCoordinates(pointToArray(positionToPoint(mapDataItem.Position)));
            }
            else {
                console.log(`Vehicle with id: ${id} not found.`);
            }

        }, 1000);
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


    private updatePositions() {
        const id = 'Vehicle.BUS5 - 80';
        console.log(this._mapDataItems.value.length);
        //    clearInterval(this._interVal);

        const vehicleFeature = this.getFeatureById(id)


        if (vehicleFeature) {
            const mapDataItem: IVehicle = vehicleFeature.get('mapDataItem');
            //const zz2 = vehicleFeature.getGeometry().getCoordinates();

            const newPosition: IPosition = { Latitude: mapDataItem.Position.Latitude + 0.001, Longitude: mapDataItem.Position.Longitude + 0.001 }
            mapDataItem.Position = newPosition;
            vehicleFeature.getGeometry().setCoordinates(pointToArray(positionToPoint(mapDataItem.Position)));
        }
        else {
            console.log(`Vehicle with id: ${id} not found.`);
        }


        //setTimeout(this.updatePositions, 1000);
    }
}