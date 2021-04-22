import { IMapItemVisualization } from "./IMapItemVisualization";

export class MapItemVisualization implements IMapItemVisualization {
    private _direction = 0;
    private _pictogramId: string;
    private _shapeFillColor!: string;
    private _shapeStrokeColor!: string;
    private _textFillColor!: string;
    private _textColor!: string;

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

    public get shapeFillColor(): string {
        return this._shapeFillColor;
    }

    public set shapeFillColor(value: string) {
        this._shapeFillColor = value;
    }

    public get shapeStrokeColor(): string {
        return this._shapeStrokeColor;
    }

    public set shapeStrokeColor(value: string) {
        this._shapeStrokeColor = value;
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

    public toString(): string {
        return `${this._pictogramId}_${this._direction}_${this._shapeFillColor}_${this._shapeStrokeColor}_${this._textFillColor}_${this._textColor}`;
    }
}