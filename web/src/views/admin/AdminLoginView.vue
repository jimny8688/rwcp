<template>
  <div class="page admin-page">
    <div class="login-card">
      <h1>管理后台</h1>
      <p>城市灵魂测评 · 密码管理</p>
      <input
        v-model="password"
        class="input input-light"
        type="password"
        placeholder="管理员密码"
        @keyup.enter="login"
      />
      <p v-if="error" class="error-text">{{ error }}</p>
      <button class="btn btn-primary" :disabled="loading" @click="login">
        {{ loading ? '登录中…' : '登录' }}
      </button>
      <router-link to="/" class="back">← 返回测评首页</router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { adminLogin, getAdminToken } from '../../api/admin.js';

const router = useRouter();
const password = ref('');
const error = ref('');
const loading = ref(false);

onMounted(() => {
  if (getAdminToken()) router.replace('/admin');
});

async function login() {
  error.value = '';
  loading.value = true;
  try {
    await adminLogin(password.value);
    router.replace('/admin');
  } catch (e) {
    error.value = e.message || '登录失败';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.admin-page {
  display: flex;
  align-items: center;
  min-height: calc(100vh - 32px);
}

.login-card {
  width: 100%;
  background: #fff;
  border-radius: 20px;
  padding: 28px 22px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
  color: #1a2332;
}

.login-card h1 {
  margin: 0 0 6px;
  font-size: 22px;
}

.login-card > p {
  margin: 0 0 20px;
  color: #64748b;
  font-size: 14px;
}

.login-card .btn {
  margin-top: 14px;
}

.back {
  display: block;
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
  color: #64748b;
  text-decoration: none;
}
</style>
