import { IStand } from "../models/IStand";
import { IMapDataLayer } from "@/mapwrapper/IMapDataLayer";
import { ref, Ref } from "vue";
import BaseModelDataService from "@/services/BaseModelDataService";
import PictogramService from "@/services/PictogramService";
import StyleService from "@/services/StyleService";

import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Geopoint from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";


import {
  positionToPoint,
  pointToArray,
  arrayToPosition,
} from "@/mapwrapper/MapHelper";

export class StandLabelDataLayer implements IMapDataLayer {

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
    this._mapDataItems.value.forEach(item => this.addMapDataItem(item));
  }

  public getlayer(): VectorLayer {
    return this._vectorLayer;
  }

  public get name(): string {
    return 'Standlabels';
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
      renderMode: 'vector',
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      source: this._vectorSource,
      style: function (feature, resolution)  {

        const mapDataItem: IStand = feature.get('mapDataItem');
        //const shapeFillcolor = feature.get('fillcolor'), ? : '#000000';


        let style = StyleService.getStyle(mapDataItem.PictogramId,feature.get('rotation'));
        
        if(!style){
          const shape =  PictogramService.getPictogram(mapDataItem.PictogramId);

          style = new Style({
            image: new Icon({
              opacity: 1,
              src: "data:image/svg+xml;utf8," + shape,
              color: "#BBC4D3",
             // scale: 1.4 / resolution,
              rotateWithView: feature.get('rotateWithView'),
              //rotation: feature.get('rotation'),
            }),
            text: new Text({
              text: mapDataItem.DisplayName,
              fill: new Fill({
                color: '#000000',
              }),
              rotateWithView: feature.get('rotateWithView'),
              //rotation: feature.get('rotation'),
              //scale: 1.4 / resolution,
              font: '8px sans-serif',
            }),
          })
          
          //change colors and other relavent features
          StyleService.setStyle(mapDataItem.PictogramId, feature.get('rotation'),style);
        }

        //IMAGE--------------
        style.getImage().setScale(1 / resolution);
      //  style.getImage().setRotation(feature.get('rotation'));

        //TEXT-----------
        //style.getText().setFill(new Fill({ color: '#FF0000' }));
        // if (shouldTint)
        //   style.getText().setBackgroundFill(new Fill({ color: '#FF0000' }));

     //   style.getText().setRotation(feature.get('rotation'));
        style.getText().setScale(1 / resolution);
        style.getText().setText(mapDataItem.DisplayName);

        return style;
      },
      maxZoom: 20,
      minZoom: 14.5
    });
  }

  private addMapDataItem(mapDataItem: IStand): void {
    const mapPoint = pointToArray(positionToPoint(arrayToPosition([mapDataItem.LabelLongitude, mapDataItem.LabelLatitude])));
    const iconFeature = new Feature({
      geometry: new Geopoint(mapPoint),
    });
    iconFeature.set('rotation', mapDataItem.LabelDirection * (Math.PI / 180));
    iconFeature.set('rotateWithView', this.rotateWithView);
    iconFeature.set('mapDataItem', mapDataItem);
    iconFeature.setId(mapDataItem.EntityId);
    this._vectorSource.addFeature(iconFeature);
  }
}