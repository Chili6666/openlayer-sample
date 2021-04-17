export class MbTileSource {
    private _url = '';
    private _maxZoom = 21;
    private _minZoom = 0;
    private _crossOrigin = '';

    public get url(){
        return this._url;
    }

    public set url(value: string){
        this._url = value;
    }

    public get maxZoom(){
        return this._maxZoom;
    }

    public set maxZoom(value: number){
        this._maxZoom = value;
    }

    public get minZoom(){
        return this._minZoom;
    }

    public set minZoom(value: number){
        this._minZoom = value;
    }

    public get crossOrigin(){
        return this._crossOrigin;
    }

    public set crossOrigin(value: string){
        this._crossOrigin = value;
    }
}