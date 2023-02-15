<template>
  <div class="base">
    <AppHeader></AppHeader>
    <div class="app-contents">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import AppHeader from './components/common/AppHeader.vue';
export default {
  components: { AppHeader },
};
</script>

<style>
@import './css/reset.css';
@import './css/common.css';

.base {
  display: flex;
  height: 100vh;
}
.gridjs-td {
  font-size: 0.72rem;
}
.gridjs-th-content {
  font-size: 0.72rem;
}
.gridjs-summary {
  font-size: 0.72rem;
}
</style>
