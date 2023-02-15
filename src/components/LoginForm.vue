<template>
  <div class="contents">
    <div class="login-container">
      <div class="login-menu">
        <span class="login">Login</span>
      </div>
      <div class="form-wrapper form-wrapper-sm">
        <div class="image">
          <img :src="require('@/assets/images/login_person.png')" />
        </div>
        <form @submit.prevent="submitForm" class="form">
          <div class="input-container">
            <img :src="require('@/assets/images/login_icon.png')" />
            <input
              id="loginId"
              placeholder="ID"
              type="text"
              v-model="loginId"
            />
          </div>
          <div class="input-container">
            <img :src="require('@/assets/images/password_icon.png')" />
            <input
              id="password"
              placeholder="PASSWORD"
              type="password"
              v-model="password"
            />
          </div>
          <button
            class="btn"
            type="submit"
            :disabled="!loginId || !password"
            :class="!loginId || !password ? 'disabled' : null"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import sha256 from 'crypto-js/sha256';

export default {
  data() {
    return {
      loginId: '',
      password: '',
    };
  },
  methods: {
    async submitForm() {
      try {
        const loginData = {
          loginId: this.loginId,
          password: String(sha256(this.password)),
        };

        await this.$store.dispatch('LOGIN', loginData);
        this.$router.push('/delivery/search');

        this.initForm();
      } catch (error) {
        alert(error.response.data.message);
      }
    },
    initForm() {
      this.loginId = '';
      this.password = '';
    },
  },
};
</script>

<style scoped>
.login {
  font-size: 1.5rem;
  padding-bottom: 12px;
  border-bottom: 3px solid #5172f6;
}
.login-menu {
  padding: 20px 0 0 40px;
  height: 60px;
  display: flex;
  align-items: end;
}
.image {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}
.login-container {
  max-width: 400px;
  margin: auto;
  height: 600px;
  border-radius: 32px;
  box-shadow: 0 2px 8px rgba(81, 114, 246, 0.33);
}
.form-wrapper.form-wrapper-sm {
  max-width: 400px;
  bottom: 0px;
  height: 540px;
  align-items: center;
  border-radius: 32px;
  padding: 30px 40px 20px 40px;
  box-shadow: 0 2px 8px rgba(81, 114, 246, 0.33);
  margin: 0;
}
.form-wrapper-sm .page-header {
  padding: 0px 0 20px;
}
.form {
  width: 100%;
}
input {
  margin: 0;
  border: 0;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);
  font-size: 1rem;
}
input:focus {
  outline: none;
}
input::placeholder {
  color: lightgray;
}
.input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  padding: 2px 14px;
  border: 1px solid #5172f6;
}
.btn {
  background-color: #5172f6;
  width: 100%;
  color: white;
  padding: 10px;
  margin-top: 32px;
  font-size: 1.2rem;
  border-radius: 2px;
}
</style>
