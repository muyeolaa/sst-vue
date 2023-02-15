<template>
  <div class="main">
    <div class="half">
      <img class="logo" :src="require('@/assets/images/logo.png')" />
      <img :src="require('@/assets/images/login_title.png')" />
    </div>
    <div class="half">
      <LoginForm></LoginForm>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';
export default {
  components: { LoginForm },
};
</script>

<style scoped>
.main {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-image: url('@/assets/images/login_background.png');
  display: flex;
}
.half {
  width: 50%;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo {
  position: fixed;
  left: 30px;
  top: 30px;
}
h2 {
  text-align: center;
  font-weight: 100;
  margin: 0;
}
</style>
