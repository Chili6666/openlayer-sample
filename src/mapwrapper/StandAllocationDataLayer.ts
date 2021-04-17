import { IStand } from "../models/IStand";
import { IMapDataLayer } from "@/mapwrapper/IMapDataLayer";
import { ref, Ref } from "vue";
import BaseModelDataService from "@/services/BaseModelDataService";
import { IPictogram } from "@/models/IPictogram";

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

  private _style: Style;
  private _vectorSource: VectorSource;
  private _vectorLayer: VectorLayer;
  private _mapDataItems: Ref<IStand[]> = ref([]);
  private _pictograms: Ref<IPictogram[]> = ref([]);
  private _rotateWithView = true;

  private fuel =
    '<svg width="17" height="17" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M 8.38092,0.38092C 12.7993,0.38092 16.3809,3.96265 16.3809,8.38092C 16.3809,12.7992 12.7993,16.3809 8.38092,16.3809C 3.96265,16.3809 0.38092,12.7992 0.38092,8.38092C 0.38092,3.96265 3.96265,0.38092 8.38092,0.38092 Z" ' +
    'stroke="black" fill="transparent"/>' +
    '<path d="M 5.51642,3.32526L 9.02832,3.32526C 9.60107,3.32526 10.0652,3.78955 10.0652,4.3623L 10.0632,8.19348L 10.363,8.20801L 10.9428,8.31244C 11.1011,8.37006 11.2128,8.45642 11.2957,8.56268C 11.3784,8.66888 11.4324,8.79492 11.4829,8.97858L 11.5963,9.64111L 11.6071,10.3505L 11.6971,11.0238C 11.7457,11.2182 11.8105,11.3658 11.8753,11.4451C 11.9402,11.5243 12.0049,11.5351 12.086,11.5405L 12.3272,11.5099C 12.3903,11.4739 12.419,11.4019 12.4659,11.2957L 12.6207,10.8671L 12.6945,10.138L 12.6982,9.07581L 12.6963,8.35925L 12.1039,7.76147L 11.7295,7.32404C 11.6448,7.19257 11.5981,7.06293 11.5782,6.80011L 11.5728,5.74506L 11.0345,5.19537L 10.6006,4.74408C 10.4962,4.61444 10.4458,4.50641 10.4476,4.40918C 10.4494,4.31195 10.5034,4.22559 10.5538,4.16797L 10.7158,4.06171C 10.7807,4.04193 10.8635,4.03113 10.9661,4.08514C 11.0688,4.13916 11.1912,4.258 11.5044,4.58026L 12.6404,5.7757L 13.186,6.422L 13.3714,6.76227C 13.4092,6.88293 13.4308,7.03412 13.441,7.56348L 13.4422,9.58887L 13.3894,10.6961L 13.2436,11.3785L 12.9987,11.8951C 12.9123,12.0176 12.8295,12.0752 12.7161,12.1346L 12.3074,12.2822C 12.1562,12.3093 11.9977,12.3021 11.8591,12.2733L 11.5044,12.1256L 11.2505,11.8591L 11.0237,11.4432L 10.9031,10.8311L 10.8347,10.0641L 10.8095,9.54205L 10.7698,9.18921C 10.7483,9.10815 10.7158,9.07574 10.6582,9.04156L 10.3972,8.94794L 10.0628,8.91357L 10.061,12.2805L 10.4127,12.2805C 10.6418,12.2805 10.8276,12.4662 10.8276,12.6953L 10.8276,13.0366L 3.71967,13.0366L 3.71967,12.6953C 3.71967,12.4662 3.90546,12.2805 4.13446,12.2805L 4.45654,12.2805L 4.47949,4.3623C 4.47949,3.78955 4.94379,3.32526 5.51642,3.32526 Z M 5.6333,4.06708C 5.40424,4.06708 5.21851,4.25281 5.21851,4.48187L 5.21851,6.63013C 5.21851,6.85919 5.40424,7.04492 5.6333,7.04492L 8.91089,7.04492C 9.13995,7.04492 9.32568,6.85919 9.32568,6.63013L 9.32568,4.48187C 9.32568,4.25281 9.13995,4.06708 8.91089,4.06708L 5.6333,4.06708 Z " ' +
    'stroke="black" fill="%23ffffff"/>' +
    "</svg>";


  public set rotateWithView(value: boolean) {
    this._rotateWithView = value;
  }
  public get rotateWithView(): boolean {
    return this._rotateWithView;
  }

  public async init(): Promise<void> {
    this.setupWithoutCluster();
    this._pictograms.value = await BaseModelDataService.getPictrograms();
    this._mapDataItems.value = await BaseModelDataService.getStands();
    this._mapDataItems.value.forEach(item => {
      if(item.ActiveStandAllocations.length > 0 )
        return this.addMapDataItem([item.StandAllocationLongitude, item.StandAllocationLatitude]);
    });
  }

  public getlayer(): VectorLayer {
    return this._vectorLayer;
  }

  private setupWithoutCluster(): void {
    this._style = new Style({
      image: new Icon({
        opacity: 1,
        src: "data:image/svg+xml;utf8," + this.fuel,
        scale: 1.0,
        color: "#00ff00",
        rotateWithView: this._rotateWithView
      }),
      // text: new Text({
      //   text: 'B1',
      //   fill: new Fill({
      //     color: '#fff',
      //   }),
      // }),
    });

    this._vectorSource = new VectorSource();
    this._vectorLayer = new VectorLayer({
      source: this._vectorSource,
    });
  }

  private addMapDataItem(mapDataItem: [number, number]): void {
    const mapPoint = pointToArray(positionToPoint(arrayToPosition([mapDataItem[0], mapDataItem[1]])));
    const iconFeature = new Feature({
      geometry: new Geopoint(mapPoint),
    });
    iconFeature.setStyle(this._style);
    this._vectorSource.addFeature(iconFeature);
  }

}