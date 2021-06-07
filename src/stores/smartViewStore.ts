import { reactive} from 'vue'
export class SmartviewStore {
    private _sdlKey = '';
    private _entityId = '';

    public get sdlKey(): string {
        return this._sdlKey;
    }

    public set sdlKey(sdlKey: string) {
        this._sdlKey = sdlKey;
    }

    public get entityId(): string {
        return this._entityId;
    }

    public set entityId(_entityId: string) {
        this._entityId = _entityId;
    }
}


const reactiveStore = reactive(new SmartviewStore())
export default reactiveStore;
