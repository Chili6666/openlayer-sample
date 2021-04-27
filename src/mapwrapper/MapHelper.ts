
import { fromLonLat, toLonLat, transform } from "ol/proj";
import { IPosition } from "@/mapwrapper/IPosition";
import { IPoint } from "@/mapwrapper/IPoint";


export function positionToPoint(position: IPosition): IPoint {
    return arrayToPoint(fromLonLat(positionToArray(position)));
}

export function pointToPosition(point: IPoint): IPosition {
    return arrayToPosition(toLonLat(pointToArray(point)));
}

export function pointToArray(point: IPoint) {
    return ([point.x, point.y])
}

export function positionToArray(position: IPosition) {
    return ([position.Longitude, position.Latitude])
}

export function arrayToPosition(value: [number, number]): IPosition {
    return {
        Longitude: value[0],
        Latitude: value[1]
    }
}

export function arrayToPoint(value: [number, number]): IPoint {
    return {
        x: value[0],
        y: value[1]
    }
}

