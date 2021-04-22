import { ITerminalResource } from "../models/ITerminalResource";
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

export class TerminalResourceDataLayer implements IMapDataLayer {

  private _vectorSource: VectorSource;
  private _vectorLayer: VectorLayer;
  private _mapDataItems: Ref<ITerminalResource[]> = ref([]);
  private _rotateWithView = true;


  public set rotateWithView(value: boolean) {
    this._rotateWithView = value;
  }
  public get rotateWithView(): boolean {
    return this._rotateWithView;
  }

  public async init(): Promise<void> {
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

  private setupDataLayer(): void {
    this._vectorSource = new VectorSource();

    this._vectorLayer = new VectorLayer({
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      source: this._vectorSource,
      // style: function (feature, resolution)  {

      //   const mapDataItem: ITerminalResource = feature.get('mapDataItem');
      //   let style = StyleService.getStyle(mapDataItem.PictogramId, mapDataItem.EntityId, resolution);
      //   if(!style){
      //     const shape =  PictogramService.getPictogram(mapDataItem.PictogramId);

      //     style = new Style({
      //       image: new Icon({
      //         opacity: 1,
      //         src: "data:image/svg+xml;utf8," + shape,
      //         scale: 1.5 / resolution,
      //         rotateWithView: feature.get('rotateWithView'),
      //         rotation: feature.get('rotation'),
      //       }),
      //       text: new Text({
      //         text: mapDataItem.DisplayName,
      //         fill: new Fill({
      //           color: '#91A0B8',
      //         }),
      //         rotateWithView: feature.get('rotateWithView'),
      //         rotation: feature.get('rotation'),
      //         scale: 1.5 / resolution,
      //         font: '4px sans-serif',
      //       }),
      //     })

      //     //change colors and other relavent features
      //     StyleService.setStyle(mapDataItem.PictogramId, mapDataItem.EntityId, resolution, style);
      //   }

      //   return style;
      //},
      maxZoom: 20,
      minZoom: 14.5
    });

    this._vectorLayer.setStyle(this.createStyle);
  }

  private createStyle(feature: Feature, resolution: number): Style {
    const mapDataItem: ITerminalResource = feature.get('mapDataItem');
    const shouldTint: boolean = feature.get('shouldTint');

    let style = StyleService.getStyle(mapDataItem.PictogramId, `${shouldTint}`);

    if (!style) {
      console.log("TerminalResourceDataLayer - create new style");
      const shape = PictogramService.getPictogram(mapDataItem.PictogramId);
      style = new Style({
        image: new Icon({
          opacity: 1,
          src: "data:image/svg+xml;utf8," + shape,
          rotateWithView: true,
        }),
        text: new Text({
          text: mapDataItem.EntityId,
          fill: new Fill({
            color: '#91A0B8',
          }),
          font: '4px sans-serif',
          rotateWithView: true,
        }),
      })
      StyleService.setStyle(mapDataItem.PictogramId, `${shouldTint}`,style);
    }

    //IMAGE--------------
    style.getImage().setScale(1 / resolution);
    style.getImage().setRotation(feature.get('rotation'));

    //TEXT-----------
    //style.getText().setFill(new Fill({ color: '#FF0000' }));
    if (shouldTint)
      style.getText().setBackgroundFill(new Fill({ color: '#FF0000' }));

    style.getText().setRotation(feature.get('rotation'));
    style.getText().setScale(1 / resolution);
    style.getText().setText(mapDataItem.DisplayName);
    return style;
  }

  private addMapDataItem(mapDataItem: ITerminalResource): void {
    const mapPoint = pointToArray(positionToPoint(arrayToPosition([mapDataItem.Longitude, mapDataItem.Latitude])));
    const iconFeature = new Feature({
      geometry: new Geopoint(mapPoint),
    });
    iconFeature.set('rotation', mapDataItem.Direction * (Math.PI / 180));
    iconFeature.set('rotateWithView', this.rotateWithView);
    iconFeature.set('mapDataItem', mapDataItem);

    if (mapDataItem.DisplayName === "01")
      iconFeature.set('shouldTint', true);
    else
      iconFeature.set('shouldTint', false);

    iconFeature.setId(mapDataItem.EntityId);
    this._vectorSource.addFeature(iconFeature);
  }
}