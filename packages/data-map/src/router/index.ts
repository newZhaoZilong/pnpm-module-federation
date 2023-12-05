import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import tablePage from "../views/tablePage.vue"
const routes: Array<RouteRecordRaw> = [
  {
    path: "tablePage",
    name: "tablePage",
    component: tablePage,
  },
  {
    path: "listPage",
    name: "listPage",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/listPage.vue"),
  },
];

// console.log('process',process);
// console.log('process.env',process.env);
// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

export default routes;
