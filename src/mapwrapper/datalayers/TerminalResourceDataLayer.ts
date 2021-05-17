import { ITerminalResource } from "../../models/ITerminalResource";
import { ref, Ref } from "vue";
import BaseModelDataService from "@/services/BaseModelDataService";
import { MapItemVisualization } from "@/models/MapItemVisualization";
import TerminalResourceStyleFactory from "@/mapwrapper/datalayers/TerminalResourceStyleFactory";

import Feature from "ol/Feature";
import Geopoint from "ol/geom/Point";

import {
  positionToPoint,
  pointToArray,
  arrayToPosition,
} from "@/mapwrapper/MapHelper";
import { MapDataLayerBase } from "./MapDataLayerBase";
import { IStyleFactory } from "../IStyleFactory";

export class TerminalResourceDataLayer extends MapDataLayerBase {

  private _mapDataItems: Ref<ITerminalResource[]> = ref([]);

  public get name(): string {
    return 'Terminalresources';
  }

  public get terminalResources(): Ref<ITerminalResource[]> {
    return this._mapDataItems;
  }

  public get styleFactory(): IStyleFactory {
    return TerminalResourceStyleFactory;
  }

  async onSetupDataSource(): Promise<void> {
    this._mapDataItems.value = await BaseModelDataService.getTerminalResources();
    this._mapDataItems.value.forEach(item => this.addMapDataItem(item));
  }

  private addMapDataItem(dataItem: ITerminalResource): void {

    const mapPoint = pointToArray(positionToPoint(arrayToPosition([dataItem.Longitude, dataItem.Latitude])));
    const iconFeature = new Feature({
      geometry: new Geopoint(mapPoint),
    });


    const mapItemVisualization = new MapItemVisualization(dataItem.PictogramId);
    mapItemVisualization.direction = dataItem.Direction * (Math.PI / 180);
    mapItemVisualization.textColor = "#C6D6F1";
    this.fakeFillColorDataItem(mapItemVisualization, dataItem);


    iconFeature.setId(dataItem.EntityId);
    iconFeature.set('mapDataItem', dataItem);
    iconFeature.set('rotateWithView', this.rotateWithView);
    iconFeature.set('mapItemVisualization', mapItemVisualization);
    this.addFeature(iconFeature);
  }

  private fakeFillColorDataItem(mapItemVisualization: MapItemVisualization, mapDataItem: ITerminalResource): void {
    if (mapDataItem.DisplayName.startsWith('01') || mapDataItem.DisplayName.startsWith('02') || mapDataItem.DisplayName.startsWith('03'))
      mapItemVisualization.fillColor = 'ORANGE';
    else
      mapItemVisualization.fillColor = '%237588A6';

    if (mapDataItem.SubType === 'CARROUSELS')
      mapItemVisualization.fontSize = '10px';
    else
      mapItemVisualization.fontSize = '4px';

  }

}