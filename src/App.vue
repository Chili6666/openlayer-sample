<template>
  <div id="app">
    <div class="cell cell-map">
      <MapContainer
        :zoomlevel="14.6"
        :longitude="6.166084"
        :latitude="50.71366"
        :wrapX="false"
        :datalayers="sources"
        :vectorLayers="layers"
        @centerpoint="oncenterpointchanged"
        @zoomlevel="onzoomlevelchanged"
      />
    </div>

    <div class="volker-css-hack">
      {{ styleCacheCount }}
    </div>

    <div class="cell cell-edit">
      <div v-for="layer in layers" :key="layer.name">
        {{ layer.name }}
        <input type="checkbox" v-model="layer.isVisible" />
      </div>
    </div>
    <div class="cell cell-inspect">Inspect</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, onMounted, onBeforeMount } from "vue";
import MapContainer from "@/components/MapContainer.vue";
import { MbTileSource } from "./mapwrapper/MbTileSource";
import { IPosition } from "./mapwrapper/IPosition";
import { VehicleDataLayer } from "@/mapwrapper/VehicleDataLayer";
import { TerminalResourceDataLayer } from "@/mapwrapper/TerminalResourceDataLayer";
import { StandLabelDataLayer } from "@/mapwrapper/StandLabelDataLayer";
import { StandAllocationDataLayer } from "@/mapwrapper/StandAllocationDataLayer";
import { GeofenceDataLayer } from "@/mapwrapper/GeofenceDataLayer";

import StyleService from "@/services/StyleService";

import VectorLayer from "ol/layer/Vector";

export default defineComponent({
  name: "App",
  components: {
    MapContainer,
  },
  setup() {
    const layers: Ref<VectorLayer[]> = ref([]);
    const sources: Ref<MbTileSource[]> = ref([]);
    const styleCacheCount = ref(0);

    function oncenterpointchanged(centerpoint: IPosition) {
      //console.log('StyleService.numberOfStyles: ' + StyleService.numberOfStyles);
    styleCacheCount.value = StyleService.numberOfStyles;
    }

    function onzoomlevelchanged(zoomLevel: number) {
      //console.log("onzoomlevelchanged: " + zoomLevel);
    }

    function setupDataLayers(): void {
      let mbTileSource = new MbTileSource();
      mbTileSource.url = "./tiles/{z}/{x}/{y}.png";
      mbTileSource.maxZoom = 18;
      mbTileSource.minZoom = 3;
      sources.value.push(mbTileSource);
    }

    function setupDataVehicleLayer() {
      layers.value.push(new GeofenceDataLayer());
      layers.value.push(new TerminalResourceDataLayer());
      layers.value.push(new StandLabelDataLayer());
      layers.value.push(new StandAllocationDataLayer());
      layers.value.push(new VehicleDataLayer());
      layers.value.forEach((layer) => layer.init());
    }

    onBeforeMount(() => {
      console.log("onBeforeMount");
      setupDataLayers();
      setupDataVehicleLayer();
    });

    return {
      oncenterpointchanged,
      onzoomlevelchanged,
      sources,
      layers,
      styleCacheCount,
    };
  },
});
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  height: 100%;
  display: grid;
  grid-template-columns: 170vh;
  grid-auto-rows: 1fr;
  grid-gap: 1rem;
  box-sizing: border-box;
}

.cell {
  border-radius: 4px;
  background-color: lightgrey;
}

.cell-map {
  grid-column: 1;
  grid-row-start: 1;
  grid-row-end: 3;
}

.cell-edit {
  grid-column: 2;
  grid-row: 1;
}

.cell-inspect {
  grid-column: 2;
  grid-row: 2;
}

.volker-css-hack {
  background-color: aqua;
  position: absolute;
  bottom: 0;
  margin: 5px;
}
</style>