import Style from "ol/style/Style";

class StyleService {
    private styleCache = new Map<string, Style>();

    public getStyle(pictogramId: string, extension: string): Style | null {
        const styleKey = this.computeStyleKey(pictogramId, extension);
        if (this.styleCache.has(styleKey))
            return this.styleCache.get(styleKey);
        return null;
    }

    public containsStyle(pictogramId: string, extension: string) {
        const styleKey = this.computeStyleKey(pictogramId, extension);
        return this.styleCache.has(styleKey);
    }

    public setStyle(pictogramId: string, extension: string, style: Style): void {
        const styleKey = this.computeStyleKey(pictogramId, extension);
        if (this.styleCache.has(styleKey))
            return;
        this.styleCache.set(styleKey, style);
    }

    public get numberOfStyles(): number {
        return this.styleCache.size;
    }

    public clearCache() {
        this.styleCache.clear();
    }

    private computeStyleKey(pictogramId: string, extension: string): string {
        return (`${pictogramId}_${extension}`);
    }
}

export default new StyleService();