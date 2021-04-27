<template>
  <div v-if="isloading">is Loading</div>
  <div v-else>
    <table class="tableFixHead">
      <thead>
        <th>DisplayName</th>
        <th>Position</th>
      </thead>
      <tr v-for="vehicle in vehicles" :key="vehicle.EntityId" @dblclick="centerItem(vehicle)">
        <td>{{ vehicle.DisplayName }}</td>
        <td>
          {{ vehicle.Position.Latitude }}-{{ vehicle.Position.Longitude }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, onBeforeMount } from "vue";
import { IVehicle } from "@/models/IVehicle";
import BaseModelDataService from "@/services/BaseModelDataService";
import MapService from "@/services/MapService";

export default defineComponent({
  name: "object-browser",
  setup() {
    const vehicles: Ref<IVehicle[]> = ref([]);
    const isloading = ref(true);

    onBeforeMount(async () => {
      isloading.value = true;
      console.log("onBeforeMount");
      vehicles.value = await BaseModelDataService.getVehicles();
      console.log("vehiclecount: " + vehicles.value.length);

      const propNames = Object.getOwnPropertyNames(vehicles.value[0]);
      propNames.forEach((element) => {
        console.log("Prop: " + element);
      });

      isloading.value = false;
    });

    function centerItem(item: IVehicle){

      MapService.moveMapToPosition(item.Position);
    }

    return {
      vehicles,
      isloading,
      centerItem
    };
  },
});
</script>

<style scoped>
.tableFixHead {
  background: white;
}
.tableFixHead thead th {
  position: sticky;
  top: 0;
}
table {
  border-collapse: collapse;
  width: 100%;
  font-size: 10px;
}
th,
td {
  padding: 5px 16px;
  border: 1px solid #ccc;
}
th {
  background: #eee;
}

tr:hover{
  background: #eee;
}
</style>
