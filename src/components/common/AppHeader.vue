<template>
  <header v-if="isUserLogin">
    <div class="vertical-menu">
      <template v-if="isUserLogin">
        <div>
          <router-link class="link" to="#" disabled>
            <img :src="require('@/assets/images/menu_icon.png')" />
          </router-link>
          <router-link class="link" to="/delivery/search">
            <img :src="require('@/assets/images/delivery_search_basic.png')" />
            <span class="menu-title">배송조회</span>
          </router-link>
          <router-link class="link" to="/delivery/history">
            <img :src="require('@/assets/images/delivery_history_basic.png')" />
            <span class="menu-title">배송기록</span>
          </router-link>
          <router-link class="link" to="/delivery/management">
            <img
              :src="require('@/assets/images/delivery_management_basic.png')"
            />
            <span class="menu-title">배송관리</span>
          </router-link>
          <router-link class="link" to="/setting">
            <img :src="require('@/assets/images/setting_basic.png')" />
            <span class="menu-title">설정</span>
          </router-link>
        </div>
      </template>
      <template v-if="isUserLogin">
        <div>
          <a class="link" @click="logoutUser">
            <img :src="require('@/assets/images/logout_icon.png')" />
            <span class="menu-title">로그아웃</span>
          </a>
        </div>
      </template>
    </div>
  </header>
</template>

<script>
import { deleteCookie } from '@/utils/cookies';
export default {
  computed: {
    isUserLogin() {
      return this.$store.getters.isLogin;
    },
    getGroup() {
      return this.$store.getters.getGroup;
    },
    logoLink() {
      return this.$store.getters.isLogin ? '/delivery/search' : '/login';
    },
  },
  methods: {
    logoutUser() {
      this.$store.commit('clearUsername');
      this.$store.commit('clearToken');
      this.$store.commit('clearGroup');
      deleteCookie('tts_access_token');
      deleteCookie('tts_refresh_token');
      deleteCookie('tts_user');
      deleteCookie('tts_group');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
header {
  justify-content: space-between;
  border-right: 1px solid lightgray;
  box-shadow: 5px 10px 5px rgba(21, 21, 21, 0.15);
  z-index: 1;
  height: 100%;
}
.link {
  display: table;
  font-size: 0.8rem;
  padding: 10px 8px;
  color: white;
  text-align: center;
}
.menu-title {
  display: block;
  font-size: 0.7rem;
  width: 100%;
  text-align: 'center';
}
.vertical-menu {
  width: 70px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.vertical-menu a {
  color: black; /* Black text color */
  display: block; /* Make the links appear below each other */
  padding: 20px 10px;
  text-decoration: none;
}

.vertical-menu a:hover {
  background-color: #ccc; /* Dark grey background on mouse-over */
}

.vertical-menu a.active {
  background-color: #04aa6d; /* Add a green color to the "active/current" link */
  color: white;
}
.router-link-exact-active {
  background-color: lightgray;
}
</style>
