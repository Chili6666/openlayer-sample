import Style from "ol/style/Style";
//import MapService from "@/services/MapService";

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



    // public getStyle(pictogramId: string, entityId: string): Style | null {
    //     const styleKey = this.computeStyleKey(pictogramId, entityId);
    //     if (this.styleCache.has(styleKey))
    //         return this.styleCache.get(styleKey);
    //     return null;
    // }


    // public getStyle(pictogramId: string, entityId: string, resolution: number): Style | null {
    //     const styleKey = this.computeStyleKey(pictogramId, entityId, resolution);
    //     if (this.styleCache.has(styleKey))
    //         return this.styleCache.get(styleKey);
    //     return null;
    // }




    // private computeStyleKey(pictogramId: string, entityId: string, resolution: number): string {
    //     //const parts = resolution.toString().split(".");
    //     //console.log(parts[1].length);
    //     //return (`${pictogramId}_${entityId}_${resolution.toFixed(3)}`)
    //     //return (`${pictogramId}_${entityId}_${parts[0]}${parts[1].substr(0, 3)}`)


    //  //   return (`${pictogramId}_${entityId}_${MapService.view.getZoom().toFixed(3)}`)

    //   //  const pp = Math.ceil(MapService.view.getZoom().toFixed(2) / 0.1) * 0.1;
    //   //  return (`${pictogramId}_${entityId}_${pp}`)

    //     return (`${pictogramId}`)

    // }
}

export default new StyleService();