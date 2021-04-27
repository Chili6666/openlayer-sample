import { ITerminalResource } from "../../models/ITerminalResource";
import { IMapDataLayer } from "@/mapwrapper/IMapDataLayer";
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

    iconFeature.set('mapDataItem', dataItem);
    iconFeature.setId(dataItem.EntityId);
    iconFeature.set('rotateWithView', this.rotateWithView);

    const pictogramId = this.computePictigramId(dataItem.PictogramId, dataItem.DisplayName);
    const mapItemVisualization = new MapItemVisualization(pictogramId);

    mapItemVisualization.direction = dataItem.Direction * (Math.PI / 180);
    mapItemVisualization.textColor = "#000000";

    if (dataItem.SubType === 'CARROUSELS')
      mapItemVisualization.fontSize = '10px';
    else
      mapItemVisualization.fontSize = '4px';


    iconFeature.set('mapItemVisualization', mapItemVisualization);
    this.addFeature(iconFeature);
  }

  computePictigramId(pictogramId: string, standName: string): string {
    if (standName.startsWith('01') || standName.startsWith('02') || standName.startsWith('03'))
      return pictogramId + '_ORANGE';
    else
      return pictogramId;
  }

}