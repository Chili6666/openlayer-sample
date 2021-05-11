import { IMapDataLayer } from "@/mapwrapper/IMapDataLayer";
import { IGeofenceGroup } from "@/models/IGeofenceGroup";
import { IGeofence } from "@/models/IGeofence";

import BaseModelDataService from "@/services/BaseModelDataService";

import { ref, Ref } from "vue";

import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon"
import { fromLonLat } from "ol/proj";

export class GeofenceDataLayer implements IMapDataLayer {

  private _vectorSource: VectorSource;
  private _vectorLayer: VectorLayer;
  private _style: Style;
  private _mapDataItems: Ref<IGeofenceGroup[]> = ref([]);

  public async init(): Promise<void> {
    this.setupMapItems();
    this._mapDataItems.value = await BaseModelDataService.getGeofenceGroups();

    this._mapDataItems.value.forEach(geofenceGroup => {
      if (geofenceGroup.geofences) {
        geofenceGroup.geofences.forEach(geofence => {
          this.addGeofence(geofence);
        })
      }
    });
  }

  public getlayer(): VectorLayer {
    return this._vectorLayer;
  }

  public get name(): string {
    return 'Geofences';
  }

  public get isVisible(): boolean {
    return this._vectorLayer.getVisible();
  }

  public set isVisible(value: boolean) {
    this._vectorLayer.setVisible(value);
  }

  private setupMapItems(): void {

    this._style = new Style({
      stroke: new Stroke({
        color: 'rgba(255,0,0,1.0)',
        width: 1
      }),
      fill: new Fill({
        color: 'rgba(253,184,184,0.5)'
      })
    });

    this._vectorSource = new VectorSource();
    this._vectorLayer = new VectorLayer({
      source: this._vectorSource,
      // maxZoom: 20,
      // minZoom: 14.5
    });
  }


  private addGeofence(geofence: IGeofence): void {
    if (geofence && geofence.geoFencePoints) {
      const polygonpoints: Array<[number, number]> = new Array<[number, number]>();
      geofence.geoFencePoints.forEach(geofencePoint => {
        polygonpoints.push(fromLonLat([geofencePoint.longitude, geofencePoint.latitude]));
      });
      this.addFeature(polygonpoints);
    }
  }

  private addFeature(polygonpoints: Array<[number, number]>): void {
    const feature = new Feature({
      //name: 'My Polygon',
      geometry: new Polygon([polygonpoints]),
    });

    feature.setStyle(this._style);
    this._vectorSource.addFeature(feature);
  }
}