import { IStand } from "../../models/IStand";
import { ref, Ref } from "vue";
import BaseModelDataService from "@/services/BaseModelDataService";
import { MapItemVisualization } from "@/models/MapItemVisualization";
import StandLabelStyleFactory from "@/mapwrapper/datalayers/StandLabelStyleFactory";
import Feature from "ol/Feature";
import Geopoint from "ol/geom/Point";

import {
  positionToPoint,
  pointToArray,
  arrayToPosition,
} from "@/mapwrapper/MapHelper";
import { IStyleFactory } from "../IStyleFactory";
import { MapDataLayerBase } from "./MapDataLayerBase";

export class StandLabelDataLayer extends MapDataLayerBase {

  private _mapDataItems: Ref<IStand[]> = ref([]);

  public get name(): string {
    return 'Standlabels';
  }

  public get vehicles(): Ref<IStand[]> {
    return this._mapDataItems;
  }

  public get styleFactory(): IStyleFactory {
    return StandLabelStyleFactory;
  }

  async onSetupDataSource(): Promise<void> {
    this._mapDataItems.value = await BaseModelDataService.getStands();
    this._mapDataItems.value.forEach(item => this.addMapDataItem(item));
  }

  private addMapDataItem(dataItem: IStand): void {
    const mapPoint = pointToArray(positionToPoint(arrayToPosition([dataItem.LabelLongitude, dataItem.LabelLatitude])));
    const iconFeature = new Feature({
      geometry: new Geopoint(mapPoint),
    });

    iconFeature.set('mapDataItem', dataItem);
    iconFeature.setId(dataItem.EntityId);
    iconFeature.set('rotateWithView', this.rotateWithView);

    const pictogramId = this.computePictigramId(dataItem.PictogramId, dataItem.DisplayName);
    const mapItemVisualization = new MapItemVisualization(pictogramId);
    mapItemVisualization.direction = dataItem.LabelDirection * (Math.PI / 180);
    mapItemVisualization.textColor = "#000000";
    iconFeature.set('mapItemVisualization', mapItemVisualization);
    this.addFeature(iconFeature);
  }

  private computePictigramId(pictogramId: string, standName: string): string {
    if (standName.startsWith('B12'))
      return pictogramId + '_ORANGE';
    else if (standName.startsWith('B09'))
      return pictogramId + '_GREEN';
    else
      return pictogramId;
  }

}