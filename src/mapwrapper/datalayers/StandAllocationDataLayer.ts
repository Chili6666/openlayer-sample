import { IStand } from "../../models/IStand";
import { IStandAllocation } from "../../models/IStandAllocation";
import { ref, Ref } from "vue";
import BaseModelDataService from "@/services/BaseModelDataService";
import { MapItemVisualization } from "@/models/MapItemVisualization";
import StandAllocationStyleFactory from "@/mapwrapper/datalayers/StandAllocationStyleFactory";
import Feature from "ol/Feature";
import Geopoint from "ol/geom/Point";

import {
  positionToPoint,
  pointToArray,
  arrayToPosition,
} from "@/mapwrapper/MapHelper";
import { MapDataLayerBase } from "./MapDataLayerBase";
import { IStyleFactory } from "../IStyleFactory";

export class StandAllocationDataLayer extends MapDataLayerBase {

  private _mapDataItems: Ref<IStand[]> = ref([]);

  public get name(): string {
    return 'Standlabels';
  }

  public get vehicles(): Ref<IStand[]> {
    return this._mapDataItems;
  }

  public get styleFactory(): IStyleFactory {
    return StandAllocationStyleFactory;
  }

  async onSetupDataSource(): Promise<void> {
    this._mapDataItems.value = await BaseModelDataService.getStands();
    this._mapDataItems.value.forEach(item => {
      if (item.ActiveStandAllocations.length > 0)
        this.addMapDataItem(item, item.ActiveStandAllocations[0]);
    });
  }

  private addMapDataItem(mapDataItem: IStand, standAllocation: IStandAllocation): void {
    const mapPoint = pointToArray(positionToPoint(arrayToPosition([mapDataItem.StandAllocationLongitude, mapDataItem.StandAllocationLatitude])));
    const iconFeature = new Feature({
      geometry: new Geopoint(mapPoint),
    });

    iconFeature.set('mapDataItem', standAllocation);
    iconFeature.setId(standAllocation.EntityId);
    iconFeature.set('rotateWithView', this.rotateWithView);

    const pictogramId = this.computePictigramId("AIRCRAFT", mapDataItem.DisplayName/*,standAllocation.PictogramId*/);
    const mapItemVisualization = new MapItemVisualization(pictogramId);
    mapItemVisualization.direction = mapDataItem.StandAllocationDirection * (Math.PI / 180);
    mapItemVisualization.textColor = "#000000";
    iconFeature.set('mapItemVisualization', mapItemVisualization);
    this.addFeature(iconFeature);
  }

  computePictigramId(pictogramId: string, standName: string): string {
    if (standName.startsWith('A08') || standName.startsWith('A01'))
      return pictogramId + '_ORANGE';
    else if (standName.startsWith('A06'))
      return pictogramId + '_RED';
    else
      return pictogramId + '_GREEN';
  }

}