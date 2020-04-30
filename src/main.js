import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "./store";
import VueResource from "vue-resource";
import router from "./router";
import Ionic from "@ionic/vue";
import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";
import getKeyPath from "keypather/get";

Vue.use(Ionic);
Vue.use(VueResource);
Vue.config.productionTip = false;
Vue.mixin({
  methods: {
    langKey(key, fallback) {
      // If no key is specified yet, return the fallback
      if (!key) return fallback + " ˙˙";
      // Else check if the language key is in user lang and return it
      let val = getKeyPath(this.$store.state.langData, key);
      if (val) return val;
      // If key not in user lang, check root lang and return it marked
      val = getKeyPath(this.$store.state.rootLangData, key);
      if (val) return val + " ˙";
      // If neither in user nor root lang, and fallback is defined, return the fallback double marked
      if (fallback) return fallback + " ˙˙";
      // If not fallback defined, return the key
      return key;
    },
    hasAccess(key, group) {
      if (store.getters.userType === "superadmin") return true;
      if (group && group !== store.getters.userType) {
        return false;
      } else if (store.state.access) {
        return store.state.access[key];
      } else return "";
    },
    pad(item) {
      return new Array(item.level).join("—") + "  " + item.name;
    },
  },
});
new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
