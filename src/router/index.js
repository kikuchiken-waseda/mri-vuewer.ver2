import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Vuewer from "../views/Vuewer.vue";
import MetaManager from "../views/MetaManager.vue";
import Setting from "../views/Setting.vue";
import Demo from "../views/Demo.vue";
import VideoPngConverter from "@/views/convarters/VideoPngConverter";
import VideoWavConverter from "@/views/convarters/VideoWavConverter";
import AviMp4Converter from "@/views/convarters/AviMp4Converter.vue";
import example from "./example.js";

Vue.use(VueRouter);

export const routes = [
  {
    path: "/",
    name: "Home",
    icon: "mdi-home",
    component: Home
  },
  {
    path: "/mata",
    name: "Meta",
    icon: "mdi-database-search",
    component: MetaManager
  },
  { path: "/convarters/video2png", component: VideoPngConverter },
  { path: "/convarters/video2wav", component: VideoWavConverter },
  { path: "/convarters/avi2mp4", component: AviMp4Converter },
  { path: "/files/", component: Vuewer },
  { path: "/files/:id", component: Vuewer },
  {
    path: "/demo",
    name: "Demo",
    icon: "mdi-code-brackets",
    component: Demo
  },
  {
    path: "/setting",
    name: "Setting",
    icon: "mdi-cog",
    component: Setting
  },
  {
    path: "/about",
    icon: "mdi-information",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  ...example
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
