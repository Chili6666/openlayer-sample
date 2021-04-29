<template>
  <div class="container">
    <slot class="mapcell">mapcontrol</slot>
    <div class="objectbrowsercell">
      <slot name="objectBrowserSlot">object browser</slot>
      <div class="interactiveLegend-container">
        <slot name="interactiveLegendSlot">legend</slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr 20%;
  grid-template-columns: 100%;
}
.mapcell {
  background: white;
  grid-column-start: 1;
  grid-column-end: 5;
  grid-row-start: 1;
  grid-row-end: 2;
}

.objectbrowsercell {
  background: white;
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 2;
  grid-row-end: 3;
  overflow-y: auto;
  height: 100%;
}
.interactiveLegend-container {
    background-color: rgba(211, 211, 211, 0.8);
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translate(0px, -200px);
}
</style>