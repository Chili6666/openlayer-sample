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

    this._vectorLayer.setStyle(this.createStyle);
  }

  private createStyle(feature: Feature, resolution: number): Style {
    const mapDataItem: ITerminalResource = feature.get('mapDataItem');
    const mapItemVisualization: MapItemVisualization = feature.get('mapItemVisualization');
    const shape = PictogramService.getPictogram(mapDataItem.PictogramId);
    const direction = (mapItemVisualization.direction !== undefined ? mapItemVisualization.direction : 0);
    const shapeFillColor = (mapItemVisualization.shapeFillColor !== undefined ? mapItemVisualization.shapeFillColor : '');
    const shapeStrokeColor = (mapItemVisualization.shapeStrokeColor !== undefined ? mapItemVisualization.shapeStrokeColor : 'black');
    const textFillColor = (mapItemVisualization.textFillColor !== undefined ? mapItemVisualization.textFillColor : 'transparent');
    const textColor = (mapItemVisualization.textColor !== undefined ? mapItemVisualization.textColor : '#000000');

    let style = StyleService.getStyle(mapDataItem.PictogramId, mapItemVisualization.toString());

    if (!style) {
       console.log("TerminalResourceDataLayer - create new style");
      style = new Style({
        image: new Icon({
          opacity: 1,
          src: "data:image/svg+xml;utf8," + shape,
          rotateWithView: feature.get('rotateWithView'),
         // color: 'orange',
        }),
        text: new Text({
          font: '4px sans-serif',
          rotateWithView: feature.get('rotateWithView'),
        }),
      })

      StyleService.setStyle(mapDataItem.PictogramId, mapItemVisualization.toString(), style);
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

    return style;
  }


  private addMapDataItem(dataItem: ITerminalResource): void {
    const mapPoint = pointToArray(positionToPoint(arrayToPosition([dataItem.Longitude, dataItem.Latitude])));
    const iconFeature = new Feature({
      geometry: new Geopoint(mapPoint),
    });

    iconFeature.set('mapDataItem', dataItem);
    iconFeature.setId(dataItem.EntityId);
    iconFeature.set('rotateWithView', this.rotateWithView);

    const mapItemVisualization = new MapItemVisualization(dataItem.PictogramId);
    mapItemVisualization.direction = dataItem.Direction * (Math.PI / 180);
    mapItemVisualization.textColor = "#000000";
    mapItemVisualization.shapeFillColor = "#7588A6";
    iconFeature.set('mapItemVisualization', mapItemVisualization);
    this._vectorSource.addFeature(iconFeature);
  }
}