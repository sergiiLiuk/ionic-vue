import Vue from "vue";

import { IonicVueRouter } from "@ionic/vue";
import hasAccess from "@/imports/hasAccess";
import { EventBus } from "@/mixins/event-bus";

import admin from "@/router/admin";
import users from "@/router/users";
import overview from "@/router/overview";

const Dashboard = () => import("@/views/Dashboard");
const Map = () => import("@/views/Map");
const Overview = () => import("@/views/Overview");
const Search = () => import("@/views/Search");
const Admin = () => import("@/views/Admin");
const Account = () => import("@/views/Account");
const ForgotPassword = () => import("@/views/login/ForgotPassword.vue");
const Restricted = () => import("@/views/Restricted");
const NotFound = () => import("@/views/NotFound");

Vue.use(IonicVueRouter);

const routes = [
  ...users,
  ...overview,
  ...admin,
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/map",
    name: "Map",
    component: Map,
  },
  {
    path: "/overview",
    name: "Overview",
    component: Overview,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  },
  {
    path: "/account",
    name: "Account",
    component: Account,
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
  },
  {
    path: "/forgotpassword",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/restricted",
    name: "Restricted",
    component: Restricted,
  },
  { path: "*", component: NotFound },
];

const router = new IonicVueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  EventBus.$emit("pagechanged");

  if (to.meta.access || to.meta.userType) {
    let access = hasAccess(to.meta.access, to.meta.userType);
    if (access) next();
    else next("restricted");
  } else next();
});

export default router;
