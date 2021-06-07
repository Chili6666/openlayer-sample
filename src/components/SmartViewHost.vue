<template>
  <div>
    <h3>{{ reactiveStore.sdlKey }}</h3>
    <p>{{ reactiveStore.entityId }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted} from "vue";
import reactiveStore from "@/stores/smartViewStore"

export default defineComponent({
  name: "smartviewhost",
  setup() {
    onMounted(() => {
      console.log("smartviewhost mounted");
    });
    return {reactiveStore};
  },
});
</script>