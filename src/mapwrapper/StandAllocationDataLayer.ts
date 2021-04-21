import { IStand } from "../models/IStand";
import { IMapDataLayer } from "@/mapwrapper/IMapDataLayer";
import { ref, Ref } from "vue";
import BaseModelDataService from "@/services/BaseModelDataService";
import PictogramService from "@/services/PictogramService";

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

export class StandAllocationDataLayer implements IMapDataLayer {

  private _style: Style;
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
    this.setupStyle() ;
    this.setupDataLayer();
    this._mapDataItems.value = await BaseModelDataService.getStands();
    this._mapDataItems.value.forEach(item => {
      if (item.ActiveStandAllocations.length > 0)
        this.addMapDataItem([item.StandAllocationLongitude, item.StandAllocationLatitude], item.ActiveStandAllocations[0].EntityId, item.StandAllocationDirection, item.ActiveStandAllocations[0].EntityId);
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

  private setupStyle() {
    const pictogram = PictogramService.getPictogram('OFFPIER_STAND_RECT');

     this._style = new Style({
      image: new Icon({
        opacity: 1,
        src: "data:image/svg+xml;utf8," + PictogramService.getPictogram('AIRCRAFT'),
        scale: 1.0,
        color: "#00ff00",
        rotateWithView: this._rotateWithView
      }),
      // text: new Text({
      //   text: '',
      //   fill: new Fill({
      //     color: '#fff',
      //   }),
      // }),
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
        // style.getText().setText(feature.get('displayName'));
        // style.getText().setScale(1.4 / resolution);
        // style.getText().setRotation(feature.get('rotation'));

        style.getImage().setRotation(feature.get('rotation'));
        style.getImage().setScale(1.4 / resolution);
        return style
      },
      maxZoom: 20.0,
      minZoom: 13.0
    });
  }

  private addMapDataItem(mapDataItem: [number, number], displayName: string, direction: number, entityId: string): void {
    const mapPoint = pointToArray(positionToPoint(arrayToPosition([mapDataItem[0], mapDataItem[1]])));
    const iconFeature = new Feature({
      geometry: new Geopoint(mapPoint),
    });
    iconFeature.set('displayName', displayName);
    iconFeature.set('rotation', direction * (Math.PI / 180));
    iconFeature.set('rotateWithView', this.rotateWithView);
    iconFeature.set('style', this._style);
    iconFeature.setId(entityId);
    this._vectorSource.addFeature(iconFeature);
  }

}