<template>
  <div v-if="isloading">is Loading</div>
  <div v-else>
    <table class="tableFixHead">
      <thead>
        <th v-for="header in headers" :key="header">{{ header }}</th>
      </thead>
      <tr
        v-for="(vehicle, index) in vehicles"
        :key="index"
        @dblclick="centerItem(vehicle)"
      >
        <td v-for="header in headers" :key="header">{{ vehicle[header] }}</td>
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
    const headers: Ref<string[]> = ref([]);

    const isloading = ref(true);

    onBeforeMount(async () => {
      isloading.value = true;
      vehicles.value = await BaseModelDataService.getVehicles();

      headers.value.push("DisplayName");
      headers.value.push("TypeName");
      headers.value.push("OperationalStatusName");
      headers.value.push("Department");
      // const propNames = Object.getOwnPropertyNames(vehicles.value[0]);
      // propNames.forEach((element) => {
      //   headers.value.push(element);
      // });

      isloading.value = false;
    });

    function centerItem(item: IVehicle) {
      MapService.moveMapToPosition(item.Position);
    }

    return {
      vehicles,
      isloading,
      centerItem,
      headers,
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
  top: 17px;
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

tr:hover {
  background: #eee;
}
</style>
