<template>
<div class="hotspot-header">Hotspots</div>
  <div class="hotspot-container">
    <div v-for="hotspot in hotspots" :key="hotspot.name">
      <button @click="centerMap(hotspot)" class="hotspot-item">
        {{ hotspot.name }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, onBeforeMount } from "vue";
import { IHotspot } from "@/models/IHotspot";
import { IPosition } from "@/mapwrapper/IPosition";
import MapService from "@/services/MapService";

export default defineComponent({
  setup() {
    const hotspots: Ref<IHotspot[]> = ref([]);
    function setupHotspots() {
      hotspots.value.push({
        name: "Cargo Building",
        zoomLevel: 17.5,
        rotation: 0,
        latitude: 50.7132415418885,
        longitude: 6.14946633704491,
      });

      hotspots.value.push({
        name: "Catering",
        zoomLevel: 17.5,
        rotation: 0,
        latitude: 50.705504302133,
        longitude: 6.18197519364334,
      });

      hotspots.value.push({
        name: "Baggage Belts",
        zoomLevel: 17.5,
        rotation: 0,
        latitude: 50.7081073508369,
        longitude: 6.15725131650809,
      });

      hotspots.value.push({
        name: "Airport",
        zoomLevel: 17.5,
        rotation: 331,
        latitude: 50.7093288026181,
        longitude: 6.15741728568067,
      });
    }

    onBeforeMount(async () => {
      setupHotspots();
    });

    function centerMap(item: IHotspot) {
      let pos: IPosition = {
        Latitude: item.latitude,
        Longitude: item.longitude,
      };
      MapService.moveMapTo(pos, item.rotation, item.zoomLevel);
    }

    return {
      centerMap,
      hotspots,
    };
  },
});
</script>

<style scoped>

.hotspot-header{
  color:white;
  border-color: black;
  background-color: #444455DD;
  height: 16px;
  text-align: center;
  font-size: 12px;
  padding: 2px;
}

.hotspot-container {
  background-color: white;
  border-color: #444455DD; 
  border-style: solid;
  border-width: 1px;
  padding: 1px;
  display: flex;
}

.hotspot-item {
  margin: 3px;
  height: 40px;
  width: 65px;
  background-color: #65799c;
  color: white;
  font-size: 10px;
}

.hotspot-item:hover {
  background-color: #b8b8b8;
}
</style>