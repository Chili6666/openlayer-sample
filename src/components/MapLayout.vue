<template>
  <div>
    <slot>mapcontrol</slot>
    <div class="hotspots-container">
      <slot name="hotSpotSlot">hotspots</slot>
    </div>
    <div class="debugdisplay-container">
      <slot name="debugDisplaySlot">debug display</slot>
    </div>

  </div>
</template>

<style scoped>
.hotspots-container {
  position: fixed;
  top: 0;
  left: 50%;
}

.debugdisplay-container {
  background-color: rgba(211, 211, 211, 0.7);
  position: absolute;
  top: 40px;
  right: 0;
  margin: 5px;
}


</style>