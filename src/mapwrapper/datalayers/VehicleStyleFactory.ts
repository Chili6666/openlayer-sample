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

export class VehicleStyleFactory implements IStyleFactory {

    createStyles(feature: Feature, resolution: number): Style[] {
        const mapDataItem: IVehicle = feature.get('mapDataItem');
        const mapItemVisualization: MapItemVisualization = feature.get('mapItemVisualization');
        const textFillColor = (mapItemVisualization.textFillColor !== undefined ? mapItemVisualization.textFillColor : '#000000');
        const textColor = (mapItemVisualization.textColor !== undefined ? mapItemVisualization.textColor : '#FFFFFF');

        let alertStyle = StyleService.getStyle('VEHICLE_ALERT', '');
        if (!alertStyle) {
            alertStyle = new Style({
                image: new Circle({
                    radius: 15,
                    stroke: new Stroke({
                        color: '#fff',
                    }),
                    fill: new Fill({
                        color: 'red',
                    }),
                })
            });
            console.log('create V alertstyle');
            StyleService.setStyle('VEHICLE_ALERT', '', alertStyle);
        }

        let style = StyleService.getStyle(mapItemVisualization.pictogramId, mapItemVisualization.toString());

        if (!style) {
            const shape = PictogramService.getPictogram(mapItemVisualization.pictogramId);
            style = new Style({
                image: new Icon({
                    opacity: 1,
                    src: "data:image/svg+xml;utf8," + shape,
                }),
                text: new Text({
                    padding: [3, 3, 3, 3],//should be resolution dependent
                    font: '4px sans-serif',
                }),
            })
            StyleService.setStyle(mapItemVisualization.pictogramId, mapItemVisualization.toString(), style);
        }

        //IMAGE--------------
        //change colors and other relavent features
        style.getImage().setScale(1 / resolution);

        style.getText().setFill(new Fill({ color: textColor }));
        style.getText().setBackgroundFill(new Fill({ color: textFillColor }));
        style.getText().setOffsetY(16 * 1 / resolution);
        style.getText().setOffsetX(16 * 1 / resolution);
        style.getText().setScale(1 / resolution);
        style.getText().setText(mapDataItem.DisplayName);

        if (mapDataItem.Occurrences.length > 0) {
            alertStyle.getImage().setScale(1 / resolution);
            style.getText().setBackgroundFill(new Fill({ color: 'red' }));
            return [alertStyle, style];
        }
        else
            return [style];
    }
}

export default new VehicleStyleFactory();