<template>
  <div class="app-shell">
    <CityBackdrop v-if="!isAdmin" :show-floaters="showFloaters" />
    <router-view v-slot="{ Component, route }">
      <transition name="route-fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import CityBackdrop from './components/CityBackdrop.vue';

const route = useRoute();
const showFloaters = computed(() => route.name === 'home' || route.name === 'quiz');
const isAdmin = computed(() => String(route.name || '').startsWith('admin'));

watch(
  isAdmin,
  (v) => {
    document.body.classList.toggle('admin-route', v);
  },
  { immediate: true }
);
</script>
