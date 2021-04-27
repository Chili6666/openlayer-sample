import { ITerminalResource } from "../models/ITerminalResource";
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
      maxZoom: 20,
      minZoom: 14.5
    });

    this._vectorLayer.setStyle(this.createStyles);
  }

  private createStyles(feature: Feature, resolution: number): Style[] {
    const mapDataItem: ITerminalResource = feature.get('mapDataItem');
    const mapItemVisualization: MapItemVisualization = feature.get('mapItemVisualization');
    const direction = (mapItemVisualization.direction !== undefined ? mapItemVisualization.direction : 0);
    const textFillColor = (mapItemVisualization.textFillColor !== undefined ? mapItemVisualization.textFillColor : 'transparent');
    const textColor = (mapItemVisualization.textColor !== undefined ? mapItemVisualization.textColor : '#000000');
    const fontSize = mapItemVisualization.fontSize;
    

    let style = StyleService.getStyle(mapItemVisualization.pictogramId, mapItemVisualization.toString());

    if (!style) {
      const shape = PictogramService.getPictogram(mapItemVisualization.pictogramId);
      style = new Style({
        image: new Icon({
          opacity: 1,
          src: "data:image/svg+xml;utf8," + shape,
          rotateWithView: feature.get('rotateWithView'),
        }),
        text: new Text({
          font: fontSize + ' sans-serif',
          rotateWithView: feature.get('rotateWithView'),
        }),
      })

      StyleService.setStyle(mapItemVisualization.pictogramId, mapItemVisualization.toString(), style);
    }

    //change colors and other relavent features
    //IMAGE--------------
    style.getImage().setScale(1 / resolution);
    style.getImage().setRotation(direction);
    //TEXT--------------
    style.getText().setFill(new Fill({ color: textColor }));
    style.getText().setBackgroundFill(new Fill({ color: textFillColor }));
    style.getText().setRotation(direction);
    style.getText().setScale(1 / resolution);
    style.getText().setText(mapDataItem.DisplayName);

    return [style];
  }

  private addMapDataItem(dataItem: ITerminalResource): void {
    const mapPoint = pointToArray(positionToPoint(arrayToPosition([dataItem.Longitude, dataItem.Latitude])));
    const iconFeature = new Feature({
      geometry: new Geopoint(mapPoint),
    });

    iconFeature.set('mapDataItem', dataItem);
    iconFeature.setId(dataItem.EntityId);
    iconFeature.set('rotateWithView', this.rotateWithView);

    const pictogramId = this.computePictigramId(dataItem.PictogramId, dataItem.DisplayName);
    const mapItemVisualization = new MapItemVisualization(pictogramId);

    mapItemVisualization.direction = dataItem.Direction * (Math.PI / 180);
    mapItemVisualization.textColor = "#000000";

    if(dataItem.SubType === 'CARROUSELS')
      mapItemVisualization.fontSize ='10px';
    else 
      mapItemVisualization.fontSize ='4px';


    iconFeature.set('mapItemVisualization', mapItemVisualization);
    this._vectorSource.addFeature(iconFeature);
  }

  computePictigramId(pictogramId: string, standName : string) : string{
    if (standName.startsWith('01') || standName.startsWith('02') || standName.startsWith('03'))
      return pictogramId + '_ORANGE';
    else
      return pictogramId;
  }

}