import { IStand } from "../models/IStand";
import { IMapDataLayer } from "@/mapwrapper/IMapDataLayer";
import { ref, Ref } from "vue";
import BaseModelDataService from "@/services/BaseModelDataService";
import { IPictogram } from "@/models/IPictogram";

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
  private _pictograms: Ref<IPictogram[]> = ref([]);
  private _rotateWithView = true;
  private _style: Style;

  private icon = '<svg width="22.5" height="13.9" version="1.1" xmlns="http://www.w3.org/2000/svg">'
    + '<rect fill="%23ffffff" width="22.5" height="13.9" />'
    + '</svg>';

  public set rotateWithView(value: boolean) {
    this._rotateWithView = value;
  }
  public get rotateWithView(): boolean {
    return this._rotateWithView;
  }

  public async init(): Promise<void> {
    this.setupStyle();
    this.setupDataLayer();
    this._pictograms.value = await BaseModelDataService.getPictrograms();
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

  private setupStyle(){
    this._style = new Style({
      image: new Icon({
        opacity: 1,
        src: "data:image/svg+xml;utf8," + this.icon,
        scale: 1.0,
        color: "#BBC4D3",
        rotateWithView: this._rotateWithView,
      }),
      text: new Text({
        text: 'B1',
        rotateWithView: this._rotateWithView,
        fill: new Fill({
          color: '#000000',
        }),
        font: '8px sans-serif',
      })
    });
  }

  private setupDataLayer(): void {
    this._vectorSource = new VectorSource();

    this._vectorLayer = new VectorLayer({
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      source: this._vectorSource,
      style: function (feature, resolution) {
        //console.log(feature.getId());
        //for better performance
        const style = feature.get('style')
        style.getText().setText(feature.get('displayName'));
        style.getText().setScale(1.4 / resolution);
        style.getText().setRotation(feature.get('rotation'));
        style.getImage().setRotation(feature.get('rotation'));
        style.getImage().setScale(1.4 / resolution);
        return style
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
    
    iconFeature.set('displayName', mapDataItem.DisplayName);
    iconFeature.set('rotation', mapDataItem.LabelDirection * (Math.PI / 180));
    iconFeature.set('shape', this.icon);
    iconFeature.set('rotateWithView', this.rotateWithView);
    iconFeature.set('style', this._style);
    iconFeature.setId(mapDataItem.EntityId);

    this._vectorSource.addFeature(iconFeature);
  }

}