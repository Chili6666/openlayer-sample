import { IStyleFactory } from "../IStyleFactory";
import Feature from "ol/Feature";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import Icon from "ol/style/Icon";
import Circle from "ol/style/Circle";
import { IVehicle } from "@/models/IVehicle";
import { MapItemVisualization } from "@/models/MapItemVisualization";
import StyleService from "@/services/StyleService";
import PictogramService from "@/services/PictogramService";
import MapService from "@/services/MapService";

export class VehicleStyleFactory implements IStyleFactory {

    createStyles(feature: Feature, resolution: number): Style[] {
        const mapDataItem: IVehicle = feature.get('mapDataItem');
        const mapItemVisualization: MapItemVisualization = feature.get('mapItemVisualization');

        const zoomLevel = MapService.view.getZoomForResolution(resolution);
        feature.set('resolution', resolution);
        feature.set('zoomLevel', zoomLevel);

        /***********************************************************************
        SETUP ALERT STYLE
        ************************************************************************/
        let alertStyle = StyleService.getStyle('VEHICLE_ALERT', '');
        if (!alertStyle) {
            alertStyle = new Style({
                image: new Circle({
                    radius: 14,
                    stroke: new Stroke({
                        color: 'white',
                    }),
                    fill: new Fill({
                        color: [255, 0, 0, .3],
                    }),
                })
            });
            StyleService.setStyle('VEHICLE_ALERT', '', alertStyle);
        }
        //DON'T DO THIS!!!!! Serializing a Style is very CPU intensive
        //feature.set('alertstyle', alertStyle);
        feature.set('alertstyleAnimationDuration', 3000);


        /***********************************************************************
        SETUP VEHICLE STYLE
        ************************************************************************/
        let style: any = StyleService.getStyle(mapItemVisualization.pictogramId, mapItemVisualization.toString());
        if (!style) {

            const shape = PictogramService.getPictogram(mapItemVisualization);
            style = new Style({
                image: new Icon({
                    opacity: 1,
                    src: "data:image/svg+xml;utf8," + shape,
                }),
                text: new Text({
                    padding: [1, 1, 1, 1],//should be resolution dependent
                    font: '10px sans-serif',
                }),
            })
            StyleService.setStyle(mapItemVisualization.pictogramId, mapItemVisualization.toString(), style);
        }


        if (zoomLevel > 14 ) {
            const scaleFactor = 1 / resolution + 1;
            style.getImage().setScale(scaleFactor);
            style.getText().setOffsetY(16 * scaleFactor);
            style.getText().setOffsetX(16 * scaleFactor);

            if (mapDataItem.Occurrences.length > 0) {

                alertStyle.getImage().setScale(scaleFactor);
                style.getText().setBackgroundFill(new Fill({ color: 'red' }));
            }
        }

        style.getText().setFill(new Fill({ color: mapItemVisualization.textColor }));
        style.getText().setBackgroundFill(new Fill({ color: mapItemVisualization.textFillColor }));
        style.getText().setText(mapDataItem.DisplayName);

        if (mapDataItem.Occurrences.length > 0) 
            return [alertStyle, style];
        return [style];
    }

}

export default new VehicleStyleFactory();