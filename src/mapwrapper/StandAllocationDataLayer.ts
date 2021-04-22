import { IStand } from "../models/IStand";
import { IStandAllocation } from "../models/IStandAllocation";
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
        this.addMapDataItem(item, item.ActiveStandAllocations[0]);
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
      style: function (feature, resolution) {

        const mapDataItem: IStand = feature.get('mapDataItem');
        let style = StyleService.getStyle(mapDataItem.PictogramId, feature.get('rotation'));
        if (!style) {
          const shape = PictogramService.getPictogram('AIRCRAFT');

          style = new Style({
            image: new Icon({
              opacity: 1,
              src: "data:image/svg+xml;utf8," + shape,
           //   scale: 1 / resolution,
              rotateWithView: true,
           //   rotation: feature.get('rotation'),
            }),
          })

          //change colors and other relavent features
          StyleService.setStyle(mapDataItem.PictogramId, feature.get('rotation'), style);
        }


        //IMAGE--------------
        style.getImage().setScale(1 / resolution);
       // style.getImage().setRotation(feature.get('rotation'));

        //TEXT-----------
        //style.getText().setFill(new Fill({ color: '#FF0000' }));
        // if (shouldTint)
        //   style.getText().setBackgroundFill(new Fill({ color: '#FF0000' }));

       // style.getText().setRotation(feature.get('rotation'));
     //   style.getText().setScale(1 / resolution);
    //    style.getText().setText(mapDataItem.DisplayName);

        return style;
      },
      maxZoom: 20,
      minZoom: 14.5
    });
  }

  private addMapDataItem(mapDataItem: IStand, standAllocation: IStandAllocation): void {
    const mapPoint = pointToArray(positionToPoint(arrayToPosition([mapDataItem.StandAllocationLongitude, mapDataItem.StandAllocationLatitude])));
    const iconFeature = new Feature({
      geometry: new Geopoint(mapPoint),
    });

    iconFeature.set('mapDataItem', standAllocation);
    iconFeature.set('rotation', mapDataItem.StandAllocationDirection * (Math.PI / 180));

    iconFeature.setId(standAllocation.EntityId);
    this._vectorSource.addFeature(iconFeature);
  }

}