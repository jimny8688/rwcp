import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import QuizView from './views/QuizView.vue';
import ResultView from './views/ResultView.vue';
import AdminLoginView from './views/admin/AdminLoginView.vue';
import AdminDashboardView from './views/admin/AdminDashboardView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/quiz', name: 'quiz', component: QuizView },
    { path: '/result', name: 'result-local', component: ResultView },
    { path: '/r/:id', name: 'result-share', component: ResultView, props: true },
    { path: '/admin/login', name: 'admin-login', component: AdminLoginView },
    { path: '/admin', name: 'admin', component: AdminDashboardView }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
