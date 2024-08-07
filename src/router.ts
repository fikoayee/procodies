import { createRouter, createWebHistory } from "vue-router";
import Landing from "./pages/Landing.vue";
import NotFound from "./pages/NotFound.vue";

const routes = [
  { path: "/", name: "Landing", component: Landing },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
