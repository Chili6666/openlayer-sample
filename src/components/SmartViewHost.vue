

<script>
// we can not use '<script lang="ts">' because we receive the propertynames from the upcoming SDL

import { defineComponent, h, reactive } from "vue";

import reactiveStore from "@/stores/smartViewStore";

export default defineComponent({
  name: "smartviewhost",
  setup() {
    const state = reactive({
      count: 0,
    });

    function increment() {
      state.count++;
    }

    // return the render function
    /*  return () =>
     h(
        'div',
        {
          onClick: increment
        },
        state.count
      ) */

    // return () =>
    //   h("div", {}, [
    //     h("h1", {}, "Render Functions are awesome"),
    //     h("p", {}, "Some text"),
    //   ]);

    return () =>
      h("div", {}, [
        h( "h2", { style: "color:purple" }, reactiveStore.mapDataItem?.DisplayName ),
        h( "p", {}, "OperationalName: " + reactiveStore.mapDataItem?.OperationalStatusName ),
        h("p", {}, "Department: " + reactiveStore.mapDataItem?.Department),
      ]);
  },
});
</script>