<template>
  <div id="app">
    <Layout>
      <template v-slot:default>
        <MapLayout>
          <template v-slot:default>
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
          </template>
          <template v-slot:hotSpotSlot>
            <HotspotViewer />
          </template>
          <template v-slot:debugDisplaySlot>
            <div>
             Zoom: {{zoom}}
            </div>
            <div>
              Styles: {{ styleCacheCount }}
            </div>
            <div>
              <div v-for="layer in layers" :key="layer.name">
                <input type="checkbox" v-model="layer.isVisible" />
                {{ layer.name }}
              </div>
            </div>
          </template>
        </MapLayout>
      </template>
      <template v-slot:objectBrowserSlot>
        <ObjectBrowserContainer>
          <template v-slot:default>
            <ObjectBrowser/>
          </template>
        </ObjectBrowserContainer>
      </template>
    </Layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, onBeforeMount } from "vue";
import MapContainer from "@/components/MapContainer.vue";
import Layout from "@/components/Layout.vue";
import ObjectBrowser from "@/components/ObjectBrowser.vue";
import HotspotViewer from "@/components/HotspotViewer.vue";
import MapLayout from "@/components/MapLayout.vue";
import ObjectBrowserContainer from "@/components/ObjectBrowserContainer.vue";

import { MbTileSource } from "./mapwrapper/MbTileSource";
import { IPosition } from "./mapwrapper/IPosition";
import { VehicleDataLayer } from "@/mapwrapper/datalayers/VehicleDataLayer";
import { TerminalResourceDataLayer } from "@/mapwrapper/datalayers/TerminalResourceDataLayer";
import { StandLabelDataLayer } from "@/mapwrapper/datalayers/StandLabelDataLayer";
import { StandAllocationDataLayer } from "@/mapwrapper/datalayers/StandAllocationDataLayer";
import { GeofenceDataLayer } from "@/mapwrapper/GeofenceDataLayer";

import StyleService from "@/services/StyleService";

import VectorLayer from "ol/layer/Vector";

export default defineComponent({
  name: "App",
  components: {
    MapContainer,
    Layout,
    ObjectBrowser,
    HotspotViewer,
    MapLayout,
    ObjectBrowserContainer,
  },
  setup() {
    const layers: Ref<VectorLayer[]> = ref([]);
    const sources: Ref<MbTileSource[]> = ref([]);
    const styleCacheCount = ref(0);
    const isloading = ref(true);
    const zoom = ref('');

    function oncenterpointchanged(centerpoint: IPosition) {
      //console.log('StyleService.numberOfStyles: ' + StyleService.numberOfStyles);
      styleCacheCount.value = StyleService.numberOfStyles;
    }

    function onzoomlevelchanged(zoomLevel: number) {
      zoom.value = zoomLevel.toFixed(2);
    }

    function setupMapBackgroundLayers(): void {
      let mbTileSource = new MbTileSource();
      mbTileSource.url = "./tiles/{z}/{x}/{y}.png";
      mbTileSource.maxZoom = 18;
      mbTileSource.minZoom = 3;
      sources.value.push(mbTileSource);
    }

    function setupDataLayers() {
      layers.value.push(new GeofenceDataLayer());
      layers.value.push(new TerminalResourceDataLayer());
      layers.value.push(new StandLabelDataLayer());
      layers.value.push(new StandAllocationDataLayer());
      layers.value.push(new VehicleDataLayer());

      layers.value.forEach((layer) => layer.init());
    }

    onBeforeMount(async () => {
      isloading.value = true;
      console.log("onBeforeMount");
      setupMapBackgroundLayers();
      setupDataLayers();
      isloading.value = false;
    });

    return {
      oncenterpointchanged,
      onzoomlevelchanged,
      sources,
      layers,
      styleCacheCount,
      isloading,
      zoom,
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
  width: 100%;
}
</style>