<template>
  <div class="container">
    <div class="container-header">Vehicles</div>
  </div>
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