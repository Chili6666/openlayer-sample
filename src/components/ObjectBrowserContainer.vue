<template>
  <div class="container">
    <div class="container-header">Vehicles</div>
  </div>
  <!-- Simple Tabcontrol: 
  https://v3.vuejs.org/guide/component-dynamic-async.html#dynamic-components-with-keep-alive
   -->
  <slot>objectbrowser</slot>
</template>

<style scoped>

.container {
  background-color: #9196A5;
  position: sticky;
  top: 0;
}
.container-header {
  color: white;
}
</style>