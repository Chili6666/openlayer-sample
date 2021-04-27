import { IVehicle } from "../models/IVehicle";
import { IMapDataLayer } from "@/mapwrapper/IMapDataLayer";
import { MapItemVisualization } from "@/models/MapItemVisualization";
import { ref, Ref } from "vue";
import BaseModelDataService from "@/services/BaseModelDataService";
import PictogramService from "@/services/PictogramService";
import StyleService from "@/services/StyleService";


import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Geopoint from "ol/geom/Point";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import Icon from "ol/style/Icon";
import Circle from "ol/style/Circle";


import {
  positionToPoint,
  pointToArray,
  arrayToPosition,
} from "@/mapwrapper/MapHelper";

export class VehicleDataLayer implements IMapDataLayer {

  private _vectorSource: VectorSource;
  private _vectorLayer: VectorLayer;
  private _mapDataItems: Ref<IVehicle[]> = ref([]);
  private _rotateWithView = false;

  constructor() {
    console.log('constructor');
    this._rotateWithView = false;
  }

  public get vehicles() : Ref<IVehicle[]>{
      return this._mapDataItems;
  }

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

  public get name(): string {
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
    this._vectorLayer = new VectorLayer({
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      source: this._vectorSource,
      maxZoom: 20,
      minZoom: 14.5
    });
    this._vectorLayer.setStyle(this.createStyles);
  }

  private createStyles(feature: Feature, resolution: number): Style[] {
    const mapDataItem: IVehicle = feature.get('mapDataItem');
    const mapItemVisualization: MapItemVisualization = feature.get('mapItemVisualization');
    const textFillColor = (mapItemVisualization.textFillColor !== undefined ? mapItemVisualization.textFillColor : '#000000');
    const textColor = (mapItemVisualization.textColor !== undefined ? mapItemVisualization.textColor : '#FFFFFF');

    let alertStyle = StyleService.getStyle('VEHICLE_ALERT', '');
    if (!alertStyle) {
      alertStyle = new Style({
        image: new Circle({
          radius: 15,
          stroke: new Stroke({
            color: '#fff',
          }),
          fill: new Fill({
            color: 'red',
          }),
        })
      });
      console.log('create V alertstyle');
      StyleService.setStyle('VEHICLE_ALERT', '', alertStyle);
    }

    let style = StyleService.getStyle(mapItemVisualization.pictogramId, mapItemVisualization.toString());

    if (!style) {
      const shape = PictogramService.getPictogram(mapItemVisualization.pictogramId);
      style = new Style({
        image: new Icon({
          opacity: 1,
          src: "data:image/svg+xml;utf8," + shape,
        }),
        text: new Text({
          padding: [3, 3, 3, 3],//should be resolution dependent
          font: '4px sans-serif',
        }),
      })
      StyleService.setStyle(mapItemVisualization.pictogramId, mapItemVisualization.toString(), style);
    }

    //IMAGE--------------
    //change colors and other relavent features
    style.getImage().setScale(1 / resolution);

    style.getText().setFill(new Fill({ color: textColor }));
    style.getText().setBackgroundFill(new Fill({ color: textFillColor }));
    style.getText().setOffsetY(16 * 1 / resolution);
    style.getText().setOffsetX(16 * 1 / resolution);
    style.getText().setScale(1 / resolution);
    style.getText().setText(mapDataItem.DisplayName);

    if (mapDataItem.Occurrences.length > 0) {
      alertStyle.getImage().setScale(1 / resolution);
      style.getText().setBackgroundFill(new Fill({ color: 'red' }));
      return [alertStyle, style];
    }
    else
      return [style];
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
    this._vectorSource.addFeature(iconFeature);
  }
}