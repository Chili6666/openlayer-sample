import { IPictogram } from "@/models/IPictogram";
import { IStand } from "@/models/IStand";
import { ITerminalResource } from "@/models/ITerminalResource";
import { IVehicle } from "@/models/IVehicle";

class BaseModelDataService {

    private _pictogramData  = require('../assets/Pictograms.json');
    private _standData = require('../assets/Stands.json');
    private _terminalResourceData = require('../assets/TerminalResources.json');
    private _vehicleData = require('../assets/Vehicles.json');

    public getPictrograms = async (): Promise<IPictogram[]> => {
        return this._pictogramData.data.NativePictograms;
    };

    public getTerminalResources= async (): Promise<ITerminalResource[]> => {
        return this._terminalResourceData.data.TerminalResources;
    };

    public getVehicles= async (): Promise<IVehicle[]> => {
        return this._vehicleData.data.Vehicles;
    };

    public getStands= async (): Promise<IStand[]> => {
        return this._standData.data.Stands;
    };

}

export default new BaseModelDataService();