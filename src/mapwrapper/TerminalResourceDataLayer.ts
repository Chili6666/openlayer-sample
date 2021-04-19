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
  private _pictograms: Ref<IPictogram[]> = ref([]);
  private _rotateWithView = true;


  public set rotateWithView(value: boolean) {
    this._rotateWithView = value;
  }
  public get rotateWithView(): boolean {
    return this._rotateWithView;
  }

  public async init(): Promise<void> {
    this.setupDataLayer();
    this._pictograms.value = await BaseModelDataService.getPictrograms();
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

  private setupDataLayer(): void {
    this._vectorSource = new VectorSource();

    this._vectorLayer = new VectorLayer({
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      source: this._vectorSource,
      style: function (feature, resolution) {




        const counter = '<svg width="9.0" height="9.0" version="1.1" xmlns="http://www.w3.org/2000/svg">'
          + '<rect fill="%237588A6" width="9.0" height="9.0" />'
          + '</svg>';


        const gates = '<svg width="13.25" height="13.25" version="1.1" xmlns="http://www.w3.org/2000/svg">'
          + '<path  fill="yellow"  d="M 0.124756,0.124939L 13.1248,0.124939L 13.1248,13.125L 0.124756,13.1249L 0.124756,0.124939 Z" /> '
          + '</svg>';


        const baggageBelt = '<svg width="42.0" height="14.0" version="1.1" xmlns="http://www.w3.org/2000/svg">'
          + '<path  fill="%237588A6"  d="M 5.5,0.5L 35.5004,0.5C 38.262,0.5 40.5005,2.73859 40.5005,5.5L 40.5005,8.49927C 40.5005,11.2607 38.262,13.4993 35.5004,13.4993L 5.5,13.4993C 2.73865,13.4993 0.5,11.2607 0.5,8.49927L 0.5,5.5C 0.5,2.73859 2.73865,0.5 5.5,0.5 Z " /> '
          + '</svg>';

        let shape = '';
        if (feature.get('pictogramId') === "CI_COUNTER")
          shape = counter;
        else if (feature.get('pictogramId') === "GATES")
          shape = gates;
        else if (feature.get('pictogramId') === "BAGGAGE_BELT")
          shape = baggageBelt;
        else
          shape = counter;
        console.log(feature.get('pictogramId'));



        //console.log(feature.getId());
        return [new Style({
          image: new Icon({
            opacity: 1,
            src: "data:image/svg+xml;utf8," + shape,
            scale: 1.5 / resolution,
            // color: "yellow",
            rotateWithView: feature.get('rotateWithView'),
            rotation: feature.get('rotation'),
          }),
          text: new Text({
            text: feature.get('displayName'),
            fill: new Fill({
              color: '#000000',
            }),
            rotateWithView: feature.get('rotateWithView'),
            rotation: feature.get('rotation'),
          }),
        })];
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
    iconFeature.set('rotation',  mapDataItem.Direction * ( Math.PI/180));
    iconFeature.set('rotateWithView', this.rotateWithView);
    iconFeature.set('pictogramId', mapDataItem.PictogramId);
    iconFeature.setId(mapDataItem.EntityId);
    this._vectorSource.addFeature(iconFeature);
  }

}