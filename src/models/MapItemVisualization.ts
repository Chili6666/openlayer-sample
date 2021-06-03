import { IMapItemVisualization } from "./IMapItemVisualization";

export class MapItemVisualization implements IMapItemVisualization {
    private _direction = 0;
    private _pictogramId: string;
    private _textFillColor = "transparent";
    private _textColor = 'black';
    private _fontSize = '10px';
    private _fillColor!: string;
    private _rotateWithView = false;

    constructor(pictogramId: string) {
        this._pictogramId = pictogramId;
    }

    public get pictogramId(): string {
        return this._pictogramId;
    }

    public get direction(): number {
        return this._direction;
    }

    public set direction(value: number) {
        this._direction = value;
    }

    public get textFillColor(): string {
        return this._textFillColor;
    }

    public set textFillColor(value: string) {
        this._textFillColor = value;
    }

    public get textColor(): string {
        return this._textColor;
    }

    public set textColor(value: string) {
        this._textColor = value;
    }

    public get fontSize(): string {
        return this._fontSize;
    }

    public set fontSize(value: string) {
        this._fontSize = value;
    }

    public get fillColor(): string {
        return this._fillColor;
    }

    public set fillColor(value: string) {
        this._fillColor = value;
    }
    
    public get rotateWithView(): boolean {
        return this._rotateWithView;
    }

    public set rotateWithView(value: boolean) {
        this._rotateWithView = value;
    }
    

    //identifier
    public toString(): string {
        return `${this._pictogramId}_${this._direction}_${this._textFillColor}_${this._textColor}_${this._fontSize}_${this._fillColor}`;
    }
}