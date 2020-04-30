<template>
  <div id="app">
    <ion-app>
      <template v-if="langData">
        <Login v-if="!token"></Login>
        <Layout v-else-if="langData" />
      </template>
    </ion-app>
    <ion-menu-controller id="main-content"></ion-menu-controller>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Layout from "@/components/layout/Layout";
import Login from "@/views/login/Login";
export default {
  components: { Login, Layout },
  computed: {
    ...mapState(["langData", "token"]),
  },
  async beforeCreate() {
    this.$store.dispatch("getLanguages");
    //this.$store.dispatch("getServers");
  },
  async mounted() {
    if (this.$store.state.user && this.$store.state.user.id) {
      this.$store.dispatch("getMySettings");
    }
  },
};
</script>
<style>
:root {
  --ion-color-primary: #6aa641;
  --ion-color-success: #6aa641;
  --ion-color-danger: #b71c1c;
  --ion-color-secondary: #b0bec5;
}
</style>
