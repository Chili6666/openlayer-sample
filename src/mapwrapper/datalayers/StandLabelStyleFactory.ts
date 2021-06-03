import { IStyleFactory } from "../IStyleFactory";
import Feature from "ol/Feature";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import Icon from "ol/style/Icon";
import { MapItemVisualization } from "@/models/MapItemVisualization";
import StyleService from "@/services/StyleService";
import PictogramService from "@/services/PictogramService";
import { IStand } from "@/models/IStand";

export class StandLabelStyleFactory implements IStyleFactory {

    createStyles(feature: Feature, resolution: number): Style[] {
        const mapDataItem: IStand = feature.get('mapDataItem');
        const mapItemVisualization: MapItemVisualization = feature.get('mapItemVisualization');

        /***********************************************************************
        SETUP STANDLABEL STYLE
        ************************************************************************/
        let style = StyleService.getStyle(mapItemVisualization.pictogramId, mapItemVisualization.toString());
        if (!style) {
            const shape = PictogramService.getPictogram(mapItemVisualization);
            style = new Style({
                image: new Icon({
                    opacity: 1,
                    src: "data:image/svg+xml;utf8," + shape,
                    rotateWithView: mapItemVisualization.rotateWithView,
                    rotation: mapItemVisualization.direction,
                }),
                text: new Text({
                    rotateWithView: mapItemVisualization.rotateWithView,
                    rotation: mapItemVisualization.direction,
                    font: '8px sans-serif',
                }),
            })
            StyleService.setStyle(mapItemVisualization.pictogramId, mapItemVisualization.toString(), style);
        }

        //IMAGE--------------
        //change colors and other relavent features
        style.getImage().setScale(1 / resolution);
        style.getText().setFill(new Fill({ color: mapItemVisualization.textColor }));
        style.getText().setBackgroundFill(new Fill({ color: mapItemVisualization.textFillColor }));
        style.getText().setScale(1 / resolution);
        style.getText().setText(mapDataItem.DisplayName);

        return [style];
    }
}

export default new StandLabelStyleFactory();
