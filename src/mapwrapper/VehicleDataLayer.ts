import { IVehicle } from "../models/IVehicle";
import { IMapDataLayer } from "@/mapwrapper/IMapDataLayer";
import { ref, Ref } from "vue";
import BaseModelDataService from "@/services/BaseModelDataService";
import PictogramService from "@/services/PictogramService";

import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Geopoint from "ol/geom/Point";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import Icon from "ol/style/Icon";

import {
  positionToPoint,
  pointToArray,
  arrayToPosition,
} from "@/mapwrapper/MapHelper";

export class VehicleDataLayer implements IMapDataLayer {

  // private _style: Style;
  private _vectorSource: VectorSource;
  private _vectorLayer: VectorLayer;
  private _mapDataItems: Ref<IVehicle[]> = ref([]);
  private _rotateWithView = false;

  public set rotateWithView(value: boolean) {
    this._rotateWithView = value;
  }
  public get rotateWithView(): boolean {
    return this._rotateWithView;
  }

  public async init(): Promise<void> {
    this.setupDataLayer();
    this._mapDataItems.value = await BaseModelDataService.getVehicles();
    this._mapDataItems.value.forEach(item => this.addMapDataItem(item));
  }

  public getlayer(): VectorLayer {
    return this._vectorLayer;
  }

  public get name(): string{
    return 'Vehicles';
  }

  public get isVisible(): boolean {
    return this._vectorLayer.getVisible();
  }

  public set isVisible(value: boolean) {
    this._vectorLayer.setVisible(value);
  }

  private setupDataLayer(): void {
    this._vectorSource = new VectorSource();

    const styleCache = {};

    this._vectorLayer = new VectorLayer({
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      source: this._vectorSource,
      style: function (feature, resolution)  {

        const mapDataItem: IVehicle = feature.get('mapDataItem');
        //3 we won't create a style for every resolution.
        const styleKey = resolution.toFixed(3) + '_' + mapDataItem.EntityId;

        let style = styleCache[styleKey];
        if(!style){
          const shape =  PictogramService.getPictogram(mapDataItem.PictogramId);

          style = new Style({
            image: new Icon({
              opacity: 1,
              src: "data:image/svg+xml;utf8," + shape,
              scale: 1.5 / resolution,

            }),
            text: new Text({
              text: mapDataItem.EntityId,
              fill: new Fill({
                color: '#000000',
              }),
              scale: 1.5 / resolution,
              font: '4px sans-serif',
              offsetX:0,
              offsetY:13 * 1.5 / resolution,
            }),
          })

          //change colors and other relavent features
          styleCache[styleKey] = style;
        }

        return style;
      },
      maxZoom: 20,
      minZoom: 14.5
    });
  }

  // private setupWithCluster(): void {
  //   this._style = new Style({
  //     image: new Icon({
  //       opacity: 1,
  //       src: "data:image/svg+xml;utf8," + this.fuel,
  //       scale: 1.0,
  //       color: "#ff0000",
  //       rotateWithView: this._rotateWithView
  //     }),
  //   });

  //   const styleCache = {};

  //   this._vectorSource = new VectorSource();

  //   const clusterSource = new Cluster({
  //     distance: 50,
  //     source: this._vectorSource,
  //   });

  //   this._vectorLayer = new VectorLayer({
  //     source: clusterSource,

  //     style: function (feature, resolution) {
  //       const size = feature.get('features').length;
  //       let style = styleCache[size];
  //       if (!style) {
  //         style = new Style({
  //           image: new Circle({
  //             radius: 10,
  //             stroke: new Stroke({
  //               color: '#fff',
  //             }),
  //             fill: new Fill({
  //               color: '#3399CC',
  //             }),
  //           }),
  //           text: new Text({
  //             text: size.toString(),
  //             fill: new Fill({
  //               color: '#fff',
  //             }),
  //           }),
  //         });
  //         styleCache[size] = style;
  //       }
  //       style.getImage().setScale(1.4 / resolution);

  //       return style;
  //     },
  //   });
  // }

  private addMapDataItem(mapDataItem: IVehicle): void {
    const mapPoint = pointToArray(positionToPoint(arrayToPosition([mapDataItem.Position.Longitude, mapDataItem.Position.Latitude])));
    const iconFeature = new Feature({
      geometry: new Geopoint(mapPoint),
    });
    iconFeature.set('mapDataItem', mapDataItem);
    iconFeature.setId(mapDataItem.EntityId);
    this._vectorSource.addFeature(iconFeature);
  }
}