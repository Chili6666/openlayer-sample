import { MapDataLayerBase } from "./MapDataLayerBase";
import { ref, Ref } from "vue";
import { IVehicle } from "@/models/IVehicle";
import BaseModelDataService from "@/services/BaseModelDataService";
import { MapItemVisualization } from "@/models/MapItemVisualization";
import Feature from "ol/Feature";
import Geopoint from "ol/geom/Point";
import { getVectorContext } from 'ol/render';
import { easeOut } from 'ol/easing';
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";

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

       // let start = new Date().getTime();

        this._interval = setInterval(() => {
            const id = 'Vehicle.BUS5 - 80';
            const vehicleFeature = this.getFeatureById(id)
            if (vehicleFeature) {
                const mapDataItem: IVehicle = vehicleFeature.get('mapDataItem');
                const newPosition: IPosition = { Latitude: mapDataItem.Position.Latitude + 0.0001, Longitude: mapDataItem.Position.Longitude + 0.0001 }
                mapDataItem.Position = newPosition;
                mapDataItem.Velocity = 4;
                vehicleFeature.getGeometry().setCoordinates(pointToArray(positionToPoint(mapDataItem.Position)));
            }
            else {
                console.log(`Vehicle with id: ${id} not found.`);
            }
        }, 1000);

        //attach to renderevent
        //const listenerKey = this.getlayer().on('postrender', this.animate);
       // this.getlayer().on('postrender', (event) => {
            // this._mapDataItems.value.forEach(item => {
            //     if (item.Occurrences) {
            //         if (item.Occurrences.length > 0) {
            //             const feature = this.getFeatureById(item.EntityId)
            //             if (feature) {

            //                 const alertStyle = feature.get('alertstyle');
            //                 const duration = feature.get('alertstyleAnimationDuration');
            //                 if (!feature.getGeometry()) return
            //                 if (!alertStyle) return
            //                 const alertCircle = alertStyle.getImage() as Circle;

            //                 const frameState = event.frameState;
            //                 const elapsed = frameState.time - start;
            //                 const elapsedRatio = elapsed / duration;

            //                 if (feature.get('zoomLevel') > 14 && feature.get('zoomLevel') < 18) {
            //                     const radius = (easeOut(elapsedRatio) * 15 + 5) * (1 / feature.get('resolution') + 1);
            //                     alertCircle.setRadius(radius);
            //                 }
            //                 else if (feature.get('zoomLevel') > 18) {
            //                     const radius = (easeOut(elapsedRatio) * 15 + 5) * 1.7;
            //                     alertCircle.setRadius(radius);
            //                 }

            //                 if (elapsed > duration) {
            //                     start = new Date().getTime();
            //                 }
            //             }
            //         }
            //     }
            // });
      //  });

    }

    private addMapDataItem(dataItem: IVehicle): void {

        const mapPoint = pointToArray(positionToPoint(arrayToPosition([dataItem.Position.Longitude, dataItem.Position.Latitude])));
        const feature = new Feature({
            geometry: new Geopoint(mapPoint),
        });

        const mapItemVisualization = new MapItemVisualization(dataItem.PictogramId);
        mapItemVisualization.direction = dataItem.Direction;
        mapItemVisualization.textFillColor = '#FFFFFF';
        mapItemVisualization.textColor = "#000000"
        //fake fillcolor
        this.fakeFillColorForVehicle(mapItemVisualization, dataItem);

        feature.setId(dataItem.EntityId);
        feature.set('mapDataItem', dataItem);
        feature.set('mapItemVisualization', mapItemVisualization);
        this.addFeature(feature);
    }

    private fakeFillColorForVehicle(mapItemVisualization: MapItemVisualization, vehicle: IVehicle): void {
        if (vehicle.OperationalStatusName === 'Parking')
            mapItemVisualization.fillColor = 'ORANGE';
        else if (vehicle.OperationalStatusName === 'LOADING')
            mapItemVisualization.fillColor = 'GREEN';
        else if (vehicle.OperationalStatusName === 'Working')
            mapItemVisualization.fillColor = 'YELLOW';
        else
            mapItemVisualization.fillColor = '%23FEFEFE';
    }
}
