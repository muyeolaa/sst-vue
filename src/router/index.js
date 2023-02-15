import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/index';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/naver',
      component: () => import('@/views/NaverMapPage.vue'),
    },
    {
      path: '/login',
      component: () => import('@/views/LoginPage.vue'),
    },
    {
      path: '/delivery/search',
      component: () => import('@/views/DeliverySearchPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/temp',
      component: () => import('@/views/TempNaverMapPage.vue'),
    },
    {
      path: '/delivery/history',
      component: () => import('@/views/DeliveryHistoryPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/delivery/location/:carNumber',
      component: () => import('@/views/DeliveryLocationPage.vue'),
      meta: { auth: false },
    },
    {
      path: '/delivery/:customerSlipNumber/confirmation',
      component: () => import('@/views/DeliveryConfirmationPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/delivery/management',
      component: () => import('@/views/DeliveryManagementPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/setting',
      component: () => import('@/views/SettingPage.vue'),
      meta: { auth: true },
    },
    {
      path: '*',
      component: () => import('@/views/NotFoundPage.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.auth && !store.getters.isLogin) {
    next('/login');
    return;
  } else if (store.getters.isLogin && to.path == '/login') {
    next('/delivery/search');
    return;
  }
  next();
});

export default router;
