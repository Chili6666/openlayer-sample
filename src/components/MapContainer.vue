<template>
  <div ref="root" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, toRefs } from "vue";
import View from "ol/View";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import OSM from "ol/source/OSM";
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
    datalayers: {
      type: Array,
      default: () => [],
    },
    vectorLayers: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    const root = ref(null);
    const { zoomlevel, latitude, longitude, datalayers, vectorLayers } = toRefs(
      props
    );
    const isDragging = ref(true);
    let internalMap = new Map();

    onMounted(() => {
      let centerpoint = positionToPoint({
        Longitude: longitude.value,
        Latitude: latitude.value,
      });

      let tileLayers: Array<TileLayer> = new Array<TileLayer>();
       tileLayers.push( new TileLayer({source: new OSM()}));

      createTileSources(datalayers.value as Array<MbTileSource>, tileLayers);
      let vl = vectorLayers.value as Array<IMapDataLayer>;
      vl.forEach((datalayer) => tileLayers.push(datalayer.getlayer()));

      // this is where we create the OpenLayers map
      internalMap = new Map({
        // the map will be created using the 'root' ref
        //target: root.value,
        layers: tileLayers,
      });

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

      internalMap.on("moveend", onMoveEnd);
      internalMap.on("movestart", onMoveStart);
      internalMap.on("pointermove", onMove);
      internalMap.on("singleclick", onSingleClick);
      MapService.initializeService(internalMap);
    });

    function onMoveStart(value: any) {
      //console.log("onMoveStart");
      isDragging.value = true;
    }

    function onMove(value: any) {
      if (isDragging.value) {
        // console.log("onMove");
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
        context.emit("mapDataitemSelected", mapDataItem);
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