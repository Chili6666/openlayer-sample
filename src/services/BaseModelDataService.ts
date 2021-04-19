import { IGeofence } from "@/models/IGeofence";
import { IGeofenceGroup } from "@/models/IGeofenceGroup";
import { IPictogram } from "@/models/IPictogram";
import { IStand } from "@/models/IStand";
import { ITerminalResource } from "@/models/ITerminalResource";
import { IVehicle } from "@/models/IVehicle";

class BaseModelDataService {

    private _pictogramData = require('../assets/Pictograms.json');
    private _standData = require('../assets/Stands.json');
    private _terminalResourceData = require('../assets/TerminalResources.json');
    private _vehicleData = require('../assets/Vehicles.json');
    private _geofenceGroupsRawData = require('../assets/Geofences.json');
    private _geofenceGroups: IGeofenceGroup[] = [];
    private _geofencesInitialized = false;

    public getPictrograms = async (): Promise<IPictogram[]> => {
        return this._pictogramData.data.NativePictograms;
    };

    public getTerminalResources = async (): Promise<ITerminalResource[]> => {
        return this._terminalResourceData.data.TerminalResources;
    };

    public getVehicles = async (): Promise<IVehicle[]> => {
        return this._vehicleData.data.Vehicles;
    };

    public getStands = async (): Promise<IStand[]> => {
        return this._standData.data.Stands;
    };

    public getGeofenceGroups = async (): Promise<IGeofenceGroup[]> => {

        if (!this._geofencesInitialized) {
            this._geofencesInitialized = true;
            this._geofenceGroups = this._geofenceGroupsRawData.DataMessage.map(geofencegroup => {
                return {
                    name: geofencegroup.Name,
                    visibleAtStartup: geofencegroup.VisibleAtStartup,
                    geofences: geofencegroup.GeoFences.map(geofence => {
                        return {
                            name: geofence.Name,
                            isClosed: geofence.IsClosed,
                            id: geofence.Id,
                            hasLocation: geofence.HasLocation,
                            geoFencePoints: geofence.GeoFencePoints.map(point => {
                                return {
                                    latitude: point.Latitude,
                                    longitude: point.Longitude,
                                }
                            })
                        }
                    })
                }
            });    
        }
        return this._geofenceGroups;
    };
}

export default new BaseModelDataService();