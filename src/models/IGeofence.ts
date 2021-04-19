import { IGeoFencePoint } from "@/models/IGeoFencePoint";

export interface IGeofence {
    geoFencePoints: Array<IGeoFencePoint>;
    name: string;
    isClosed: false;
    id: string;
    hasLocation: boolean;
}