
import {IGeofence} from "./IGeofence"

export interface IGeofenceGroup{
    geofences :  Array<IGeofence>;
    name : string;
    visibleAtStartup : boolean;
}