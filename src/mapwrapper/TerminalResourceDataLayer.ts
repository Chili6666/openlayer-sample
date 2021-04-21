import { ITerminalResource } from "../models/ITerminalResource";
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

export class TerminalResourceDataLayer implements IMapDataLayer {

  private _vectorSource: VectorSource;
  private _vectorLayer: VectorLayer;
  private _mapDataItems: Ref<ITerminalResource[]> = ref([]);
  private _rotateWithView = true;
  private _styles = new Map<string, Style>();

  public set rotateWithView(value: boolean) {
    this._rotateWithView = value;
  }
  public get rotateWithView(): boolean {
    return this._rotateWithView;
  }

  public async init(): Promise<void> {
    this.setupStyles();
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

  private setupStyles() {
    this._styles.set('CI_COUNTER', new Style({
      image: new Icon({
        opacity: 1,
        src: "data:image/svg+xml;utf8," + PictogramService.getPictogram('CI_COUNTER'),
        scale: 1.0,
        color: "#BBC4D3",
        rotateWithView: this._rotateWithView,
      }),
      text: new Text({
        text: '',
        rotateWithView: this._rotateWithView,
        fill: new Fill({
          color: '#000000',
        }),
        font: '4px sans-serif',
      })
    }));


    this._styles.set('GATES', new Style({
      image: new Icon({
        opacity: 1,
        src: "data:image/svg+xml;utf8," + PictogramService.getPictogram('GATES'),
        scale: 1.0,
        color: "#BBC4D3",
        rotateWithView: this._rotateWithView,
      }),
      text: new Text({
        text: '',
        rotateWithView: this._rotateWithView,
        fill: new Fill({
          color: '#000000',
        }),
        font: '4px sans-serif',
      })
    }));

    this._styles.set('BAGGAGE_BELT', new Style({
      image: new Icon({
        opacity: 1,
        src: "data:image/svg+xml;utf8," + PictogramService.getPictogram('BAGGAGE_BELT'),
        scale: 1.0,
        color: "#BBC4D3",
        rotateWithView: this._rotateWithView,
      }),
      text: new Text({
        text: '',
        rotateWithView: this._rotateWithView,
        fill: new Fill({
          color: '#000000',
        }),
      })
    }));


    this._styles.set('DEFAULT', new Style({
      image: new Icon({
        opacity: 1,
        src: "data:image/svg+xml;utf8," + PictogramService.getPictogram('DEFAULT'),
        scale: 1.0,
        color: "#BBC4D3",
        rotateWithView: this._rotateWithView,
      }),
      text: new Text({
        text: '',
        rotateWithView: this._rotateWithView,
        fill: new Fill({
          color: '#000000',
        }),
      })
    }));

  }

  private setupDataLayer(): void {
    this._vectorSource = new VectorSource();

    this._vectorLayer = new VectorLayer({
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      source: this._vectorSource,
      style: function (feature, resolution) {
        //for better performance
        const style = feature.get('style')
        style.getText().setText(feature.get('displayName'));
        style.getText().setScale(1.5 / resolution);
        style.getText().setRotation(feature.get('rotation'));
        style.getImage().setRotation(feature.get('rotation'));
        style.getImage().setScale(1.4 / resolution);
        return style
      },
      maxZoom: 20,
      minZoom: 14.5
    });
  }

  private addMapDataItem(mapDataItem: ITerminalResource): void {
    const mapPoint = pointToArray(positionToPoint(arrayToPosition([mapDataItem.Longitude, mapDataItem.Latitude])));
    const iconFeature = new Feature({
      geometry: new Geopoint(mapPoint),
    });

    iconFeature.set('displayName', mapDataItem.DisplayName);
    iconFeature.set('rotation', mapDataItem.Direction * (Math.PI / 180));
    iconFeature.set('rotateWithView', this.rotateWithView);

    if (this._styles.has(mapDataItem.PictogramId)) {
      iconFeature.set('style', this._styles.get(mapDataItem.PictogramId));
    }
    else {
      iconFeature.set('style', this._styles.get('DEFAULT'));
    }

    iconFeature.setId(mapDataItem.EntityId);

    this._vectorSource.addFeature(iconFeature);
  }

}