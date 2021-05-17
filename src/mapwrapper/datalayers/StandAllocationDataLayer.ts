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


    const mapItemVisualization = new MapItemVisualization('AIRCRAFT' /*standAllocation.PictogramId*/);
    mapItemVisualization.direction = mapDataItem.StandAllocationDirection * (Math.PI / 180);
    mapItemVisualization.textColor = "#000000";
    this.fakeFillColorDataItem(mapItemVisualization, mapDataItem);


    iconFeature.setId(standAllocation.EntityId);
    iconFeature.set('mapDataItem', standAllocation);
    iconFeature.set('rotateWithView', this.rotateWithView);
    iconFeature.set('mapItemVisualization', mapItemVisualization);
    this.addFeature(iconFeature);
  }

  private fakeFillColorDataItem(mapItemVisualization: MapItemVisualization, mapDataItem: IStand): void {
    if (mapDataItem.DisplayName.startsWith('A08') || mapDataItem.DisplayName.startsWith('A01'))
      mapItemVisualization.fillColor = 'ORANGE';
    else if (mapDataItem.DisplayName.startsWith('A06'))
      mapItemVisualization.fillColor = 'Red';
    else
      mapItemVisualization.fillColor = '%2346ff46';
  }

}