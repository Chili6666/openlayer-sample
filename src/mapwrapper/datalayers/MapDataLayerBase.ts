import { IMapDataLayer } from "../IMapDataLayer";


import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Feature from "ol/Feature";
import { IStyleFactory } from "../IStyleFactory";

export abstract class MapDataLayerBase implements IMapDataLayer {

    private _vectorSource: VectorSource;
    private _vectorLayer: VectorLayer;
    private _rotateWithView = true;

    public set rotateWithView(value: boolean) {
        this._rotateWithView = value;
    }
    public get rotateWithView(): boolean {
        return this._rotateWithView;
    }

    public getlayer(): VectorLayer {
        return this._vectorLayer;
    }

    public async init(): Promise<void> {
        this.setupDataLayer();
        this.onSetupDataSource && this.onSetupDataSource();
    }
    public addFeature(feature : Feature){
        this._vectorSource.addFeature(feature);
    }

    public removeFeature(feature : Feature){
        this._vectorSource.removeFeature(feature);
    }

    abstract name: string;

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
      //  this._vectorLayer.setStyle(this.createStyles);
      this._vectorLayer.setStyle(this.styleFactory.createStyles)
    }

    abstract styleFactory : IStyleFactory;

    protected onSetupDataSource?():void; 
}