import Vue from 'vue';
import Vuex from 'vuex';
import {
  getGroupromCookie,
  getAccessTokenFromCookie,
  getRefreshTokenFromCookie,
  getUserFromCookie,
  saveGroupToCookie,
  saveAccessTokenToCookie,
  saveRefreshTokenToCookie,
  saveUserToCookie,
} from '@/utils/cookies';
import { loginUser } from '@/api/member';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    group: getGroupromCookie() || '',
    username: getUserFromCookie() || '',
    accessToken: getAccessTokenFromCookie() || '',
    refreshToken: getRefreshTokenFromCookie() || '',
  },
  getters: {
    isLogin(state) {
      return state.accessToken !== '';
    },
    getGroup(state) {
      return state.group !== '사용자';
    },
  },
  mutations: {
    setGroup(state, group) {
      state.group = group;
    },
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
    },
    setRefreshToken(state, refreshToken) {
      state.refreshToken = refreshToken;
    },
    setUsername(state, username) {
      state.username = username;
    },
    clearGroup(state) {
      state.group = '';
    },
    clearToken(state) {
      state.accessToken = '';
      state.refreshToken = '';
    },
    clearUsername(state) {
      state.username = '';
    },
  },
  actions: {
    async LOGIN({ commit }, loginData) {
      const { data } = await loginUser(loginData);
      const result = data.data;

      commit('setGroup', result.memberGroup);
      commit('setAccessToken', result.accessToken);
      commit('setRefreshToken', result.refreshToken);
      commit('setUsername', result.username);

      saveGroupToCookie(result.memberGroup);
      saveAccessTokenToCookie(result.accessToken);
      saveRefreshTokenToCookie(result.refreshToken);
      saveUserToCookie(result.username);
      return data;
    },
  },
});
