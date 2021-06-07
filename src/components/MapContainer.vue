<template>
  <div ref="root" style="width: 100%; height: 100%">
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <SmartViewHost id="popup-content"></SmartViewHost>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, toRefs } from "vue";
import View from "ol/View";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import OSM from "ol/source/OSM";
import Overlay from "ol/Overlay";
import SmartViewHost from "@/components/SmartViewHost.vue";

import MapService from "@/services/MapService";

import { positionToPoint, pointToArray } from "@/mapwrapper/MapHelper";

// importing the OpenLayers stylesheet is required for having
// good looking buttons!
import "ol/ol.css";
import { MbTileSource } from "@/mapwrapper/MbTileSource";
import { IPosition } from "@/mapwrapper/IPosition";
import { IMapDataLayer } from "@/mapwrapper/IMapDataLayer";
import { IMapDataItem } from "@/models/IMapDataItem";

export default defineComponent({
  components: {
    SmartViewHost,
  },
  props: {
    zoomlevel: {
      type: Number,
      default: 0,
    },
    maxZoom: {
      type: Number,
      default: 20,
    },
    minZoom: {
      type: Number,
      default: 5,
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    wrapX: {
      type: Boolean,
      default: true,
    },
    tilelayers: {
      type: Array,
      default: () => [],
    },
    dataLayers: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    const root = ref(null);
    const { zoomlevel, latitude, longitude, tilelayers, dataLayers } =
      toRefs(props);
    const isDragging = ref(true);
    let internalMap = new Map();

    onMounted(() => {
      let centerpoint = positionToPoint({
        Longitude: longitude.value,
        Latitude: latitude.value,
      });

      let layers: Array<TileLayer> = new Array<TileLayer>();
      //    layers.push( new TileLayer({source: new OSM()}));

      createTileSources(tilelayers.value as Array<MbTileSource>, layers);
      let vl = dataLayers.value as Array<IMapDataLayer>;
      vl.forEach((datalayer) => layers.push(datalayer.getlayer()));

      // this is where we create the OpenLayers map
      internalMap = new Map({
        layers: layers,
      });

      // the map will be created using the 'root' ref
      internalMap.setTarget(root.value);

      internalMap.setView(
        new View({
          zoom: zoomlevel.value,
          center: pointToArray(centerpoint),
          constrainResolution: false,
          maxZoom: props.maxZoom,
          minZoom: props.minZoom,
          rotation: 0.0,
        })
      );

      /*
       Setup overlay for the smartview
       */
      const container = document.getElementById("popup");
      const content = document.getElementById("popup-content");
      const closer = document.getElementById("popup-closer");

      const popup = new Overlay({
        element: container,
        autpPan: true,
        autoPanAnimation: { duration: 250 },
      });

      internalMap.addOverlay(popup);

      /*
        Add a click handler to hide the popup.
        @return {boolean} Don't follow the href.
       */
      if (closer) {
        closer.onclick = function () {
          popup.setPosition(undefined);
          closer.blur();
          return false;
        };
      }

      internalMap.on("moveend", onMoveEnd);
      internalMap.on("movestart", onMoveStart);
      internalMap.on("pointermove", onMove);
      internalMap.on("singleclick", onSingleClick);
      MapService.initializeService(internalMap, popup, content);
    });

    function onMoveStart(value: any) {
      //console.log("onMoveStart");
      isDragging.value = true;
    }

    function onMove(value: any) {
      if (!isDragging.value) {
        // console.log("onMove");

        if (MapService.GetFeatureAtPixel(value.pixel)) {
          MapService.map.getTargetElement().style.cursor = "pointer";
        } else {
          MapService.map.getTargetElement().style.cursor = "";
        }
      }
    }

    function onMoveEnd(value: any) {
      // console.log("onMoveEnd");
      isDragging.value = false;
      context.emit("centerpoint", getCenterPoint());
      context.emit("zoomlevel", internalMap?.getView().getZoom());
    }

    function onSingleClick(value: any): void {
      isDragging.value = false;
      const mapDataItem: IMapDataItem = MapService.GetMapDataItemAtPixel(
        value.pixel
      );
      if (mapDataItem) {
        context.emit("mapDataitemSelected", mapDataItem, value.coordinate);
      }
    }

    function getCenterPoint(): IPosition {
      return MapService.centerPoint;
    }

    function createTileSources(
      datalayers: Array<MbTileSource>,
      tilelayers: Array<TileLayer>
    ) {
      for (let index = 0; index < datalayers.length; index++) {
        var datalayer = datalayers[index];

        var tileItemSource = new XYZ({
          url: datalayer.url,
          maxZoom: datalayer.maxZoom,
          minZoom: datalayer.minZoom,
          crossOrigin: datalayer.crossOrigin,
          wrapX: false,
        });

        var tileLayer: TileLayer = new TileLayer({ source: tileItemSource });
        tilelayers.push(tileLayer);
      }
    }

    return {
      root,
      isDragging,
    };
  },
});
</script>

<style scoped>
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}
</style>