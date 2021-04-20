import { ITerminalResource } from "../models/ITerminalResource";
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

export class TerminalResourceDataLayer implements IMapDataLayer {

  private _vectorSource: VectorSource;
  private _vectorLayer: VectorLayer;
  private _mapDataItems: Ref<ITerminalResource[]> = ref([]);
  private _rotateWithView = true;

  private _counterStyle: Style;
  private _gateStyle: Style;
  private _baggageBeltStyle: Style;

  public set rotateWithView(value: boolean) {
    this._rotateWithView = value;
  }
  public get rotateWithView(): boolean {
    return this._rotateWithView;
  }

  public async init(): Promise<void> {
    this.setupStyles();
    this.setupDataLayer();
    this._mapDataItems.value = await BaseModelDataService.getTerminalResources();
    this._mapDataItems.value.forEach(item => this.addMapDataItem(item));
  }

  public getlayer(): VectorLayer {
    return this._vectorLayer;
  }

  public get name(): string {
    return 'Terminalresources';
  }

  public get isVisible(): boolean {
    return this._vectorLayer.getVisible();
  }

  public set isVisible(value: boolean) {
    this._vectorLayer.setVisible(value);
  }

  
  private setupStyles() {

    const counter = '<svg width="9.0" height="9.0" version="1.1" xmlns="http://www.w3.org/2000/svg">'
      + '<rect fill="%237588A6" width="9.0" height="9.0" />'
      + '</svg>';


    const gates = '<svg width="13.25" height="13.25" version="1.1" xmlns="http://www.w3.org/2000/svg">'
      + '<path  fill="yellow"  d="M 0.124756,0.124939L 13.1248,0.124939L 13.1248,13.125L 0.124756,13.1249L 0.124756,0.124939 Z" /> '
      + '</svg>';


    const baggageBelt = '<svg width="43.0" height="15.0" version="1.1" xmlns="http://www.w3.org/2000/svg">'
      + '<path  fill="%237588A6"  d="M 5.5,0.5L 35.5004,0.5C 38.262,0.5 40.5005,2.73859 40.5005,5.5L 40.5005,8.49927C 40.5005,11.2607 38.262,13.4993 35.5004,13.4993L 5.5,13.4993C 2.73865,13.4993 0.5,11.2607 0.5,8.49927L 0.5,5.5C 0.5,2.73859 2.73865,0.5 5.5,0.5 Z " /> '
      + '</svg>';


    this._counterStyle = new Style({
      image: new Icon({
        opacity: 1,
        src: "data:image/svg+xml;utf8," + counter,
        scale: 1.0,
        color: "#BBC4D3",
        rotateWithView: this._rotateWithView,
      }),
      text: new Text({
        text: '',
        rotateWithView: this._rotateWithView,
        fill: new Fill({
          color: '#000000',
        }),
        font: '4px sans-serif',
      })
    });


    this._gateStyle = new Style({
      image: new Icon({
        opacity: 1,
        src: "data:image/svg+xml;utf8," + gates,
        scale: 1.0,
        color: "#BBC4D3",
        rotateWithView: this._rotateWithView,
      }),
      text: new Text({
        text: '',
        rotateWithView: this._rotateWithView,
        fill: new Fill({
          color: '#000000',
        }),
        font: '4px sans-serif',
      })
    });

    this._baggageBeltStyle = new Style({
      image: new Icon({
        opacity: 1,
        src: "data:image/svg+xml;utf8," + baggageBelt,
        scale: 1.0,
        color: "#BBC4D3",
        rotateWithView: this._rotateWithView,
      }),
      text: new Text({
        text: '',
        rotateWithView: this._rotateWithView,
        fill: new Fill({
          color: '#000000',
        }),
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
        //for better performance
        const style = feature.get('style')
        style.getText().setText(feature.get('displayName'));
        style.getText().setScale(1.5 / resolution);
        style.getText().setRotation(feature.get('rotation'));
        style.getImage().setRotation(feature.get('rotation'));
        style.getImage().setScale(1.4 / resolution);
        return style
      },
      maxZoom: 20,
      minZoom: 14.5
    });
  }

  private addMapDataItem(mapDataItem: ITerminalResource): void {
    const mapPoint = pointToArray(positionToPoint(arrayToPosition([mapDataItem.Longitude, mapDataItem.Latitude])));
    const iconFeature = new Feature({
      geometry: new Geopoint(mapPoint),
    });

    iconFeature.set('displayName', mapDataItem.DisplayName);
    iconFeature.set('rotation', mapDataItem.Direction * (Math.PI / 180));
    iconFeature.set('rotateWithView', this.rotateWithView);

    if (mapDataItem.PictogramId === 'BAGGAGE_BELT')
      iconFeature.set('style', this._baggageBeltStyle);
    else if (mapDataItem.PictogramId === 'GATES')
      iconFeature.set('style', this._gateStyle);
    else if (mapDataItem.PictogramId === 'CI_COUNTER')
      iconFeature.set('style', this._counterStyle);
    else
      iconFeature.set('style', this._counterStyle);

    iconFeature.setId(mapDataItem.EntityId);

    this._vectorSource.addFeature(iconFeature);
  }

}