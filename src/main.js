import Vue from 'vue';
import App from './App.vue';
import router from '@/router/index';
import store from '@/store/index';
import naver from 'vue-naver-maps';
import { GridGlobal } from 'gridjs-vue';
import VCalendar from 'v-calendar';

Vue.config.productionTip = false;

// 네이버 지도 (삭졔 예정)
Vue.use(naver, {
  clientID: '801jndukm2',
  useGovAPI: false, //공공 클라우드 API 사용 (선택)
  subModules: '', // 서브모듈 (선택)
});

// 테이블 라이브러리
Vue.use(GridGlobal);

// 캘린더 라이브러리
// https://vcalendar.io/
Vue.use(VCalendar);

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app');
