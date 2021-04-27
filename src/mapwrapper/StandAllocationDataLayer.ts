import { IStand } from "../models/IStand";
import { IStandAllocation } from "../models/IStandAllocation";
import { IMapDataLayer } from "@/mapwrapper/IMapDataLayer";
import { ref, Ref } from "vue";
import BaseModelDataService from "@/services/BaseModelDataService";
import PictogramService from "@/services/PictogramService";
import StyleService from "@/services/StyleService";
import { MapItemVisualization } from "@/models/MapItemVisualization";


import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Geopoint from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Circle from "ol/style/Circle";
import Text from "ol/style/Text";

import {
  positionToPoint,
  pointToArray,
  arrayToPosition,
} from "@/mapwrapper/MapHelper";

export class StandAllocationDataLayer implements IMapDataLayer {

  private _vectorSource: VectorSource;
  private _vectorLayer: VectorLayer;
  private _mapDataItems: Ref<IStand[]> = ref([]);
  private _rotateWithView = true;

  public set rotateWithView(value: boolean) {
    this._rotateWithView = value;
  }
  public get rotateWithView(): boolean {
    return this._rotateWithView;
  }

  public async init(): Promise<void> {
    this.setupDataLayer();
    this._mapDataItems.value = await BaseModelDataService.getStands();
    this._mapDataItems.value.forEach(item => {
      if (item.ActiveStandAllocations.length > 0)
        this.addMapDataItem2(item, item.ActiveStandAllocations[0]);
    });
  }

  public getlayer(): VectorLayer {
    return this._vectorLayer;
  }

  public get name(): string {
    return 'StandAllocations';
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
    const mapItemVisualization: MapItemVisualization = feature.get('mapItemVisualization');
    const direction = (mapItemVisualization.direction !== undefined ? mapItemVisualization.direction : 0);
    const standAllocation: IStandAllocation = feature.get('mapDataItem');


    let style = StyleService.getStyle(mapItemVisualization.pictogramId, mapItemVisualization.toString());
    let alertStyle = StyleService.getStyle(mapItemVisualization.pictogramId + 'STANDALLOCATION_ALERT', mapItemVisualization.toString());
    if (!alertStyle) {
      alertStyle = new Style({
        image: new Circle({
          radius: 5,
          stroke: new Stroke({
            color: '#fff',
          }),
          fill: new Fill({
            color: 'red',
          }),
        }),
        text: new Text({
          text: '1',
          fill: new Fill({
            color: '#fff',
          }),
        }),
      });
      console.log('create SA alertstyle');
      StyleService.setStyle(mapItemVisualization.pictogramId + 'STANDALLOCATION_ALERT', mapItemVisualization.toString(), alertStyle);
    }

    if (!style) {
      const shape = PictogramService.getPictogram(mapItemVisualization.pictogramId);
      style = new Style({
        image: new Icon({
          opacity: 1,
          src: "data:image/svg+xml;utf8," + shape,
          rotateWithView: feature.get('rotateWithView'),
          rotation: direction,
        }),
      });

      StyleService.setStyle(mapItemVisualization.pictogramId, mapItemVisualization.toString(), style);
    }

    //IMAGE--------------
    //change colors and other relavent features
    if(standAllocation.EntityId === 'StandAllocation.801782836'){
      style.getImage().setScale(1 / resolution);
      alertStyle.getImage().setScale(1 / resolution);
      return [style, alertStyle];
    }
    else{
      style.getImage().setScale(1 / resolution);
      return [style];
    }
  }

  private addMapDataItem2(mapDataItem: IStand, standAllocation: IStandAllocation): void {
    const mapPoint = pointToArray(positionToPoint(arrayToPosition([mapDataItem.StandAllocationLongitude, mapDataItem.StandAllocationLatitude])));
    const iconFeature = new Feature({
      geometry: new Geopoint(mapPoint),
    });

    iconFeature.set('mapDataItem', standAllocation);
    iconFeature.setId(standAllocation.EntityId);
    iconFeature.set('rotateWithView', this.rotateWithView);

    const pictogramId = this.computePictigramId("AIRCRAFT", mapDataItem.DisplayName/*,standAllocation.PictogramId*/);
    const mapItemVisualization = new MapItemVisualization(pictogramId);
    mapItemVisualization.direction = mapDataItem.StandAllocationDirection * (Math.PI / 180);
    mapItemVisualization.textColor = "#000000";
    iconFeature.set('mapItemVisualization', mapItemVisualization);
    this._vectorSource.addFeature(iconFeature);
  }

  computePictigramId(pictogramId: string, standName: string): string {
    if (standName.startsWith('A08') || standName.startsWith('A01'))
      return pictogramId + '_ORANGE';
    else if (standName.startsWith('A06'))
      return pictogramId + '_RED';
    else
      return pictogramId + '_GREEN';
  }

}