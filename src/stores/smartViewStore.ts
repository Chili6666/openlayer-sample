import { IMapDataItem } from '@/models/IMapDataItem';
import { reactive} from 'vue'
export class SmartviewStore {
    private _sdlKey = '';
    private _mapDataItem : IMapDataItem | null = null;

    public get sdlKey(): string {
        return this._sdlKey;
    }

    public set sdlKey(sdlKey: string) {
        this._sdlKey = sdlKey;
    }

    public get mapDataItem(): IMapDataItem |null {
        return this._mapDataItem;
    }

    public set mapDataItem(_mapDataItem: IMapDataItem | null) {
        this._mapDataItem = _mapDataItem;
    }
}


const reactiveStore = reactive(new SmartviewStore())
export default reactiveStore;
