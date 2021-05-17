import { IStyleFactory } from "../IStyleFactory";
import Feature from "ol/Feature";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import Icon from "ol/style/Icon";
import { ITerminalResource } from "@/models/ITerminalResource";
import { MapItemVisualization } from "@/models/MapItemVisualization";
import StyleService from "@/services/StyleService";
import PictogramService from "@/services/PictogramService";

export class TerminalResourceStyleFactory implements IStyleFactory {

  createStyles(feature: Feature, resolution: number): Style[] {
    const mapDataItem: ITerminalResource = feature.get('mapDataItem');
    const mapItemVisualization: MapItemVisualization = feature.get('mapItemVisualization');
    const direction = (mapItemVisualization.direction !== undefined ? mapItemVisualization.direction : 0);
    const textFillColor = (mapItemVisualization.textFillColor !== undefined ? mapItemVisualization.textFillColor : 'transparent');
    const textColor = (mapItemVisualization.textColor !== undefined ? mapItemVisualization.textColor : '#000000');
    const fontSize = mapItemVisualization.fontSize;

    let style = StyleService.getStyle(mapItemVisualization.pictogramId, mapItemVisualization.toString());

    if (!style) {
      const shape = PictogramService.getPictogram(mapItemVisualization);
      style = new Style({
        image: new Icon({
          opacity: 1,
          src: "data:image/svg+xml;utf8," + shape,
          rotateWithView: feature.get('rotateWithView'),
        }),
        text: new Text({
          font: fontSize + ' sans-serif',
          rotateWithView: feature.get('rotateWithView'),
        }),
      })

      StyleService.setStyle(mapItemVisualization.pictogramId, mapItemVisualization.toString(), style);
    }

    //change colors and other relavent features
    //IMAGE--------------
    style.getImage().setScale(1 / resolution);
    style.getImage().setRotation(direction);
    //TEXT--------------
    style.getText().setFill(new Fill({ color: textColor }));
    style.getText().setBackgroundFill(new Fill({ color: textFillColor }));
    style.getText().setRotation(direction);
    style.getText().setScale(1 / resolution);
    style.getText().setText(mapDataItem.DisplayName);

    return [style];
  }
}

export default new TerminalResourceStyleFactory();
