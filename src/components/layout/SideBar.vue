<template>
  <ion-menu side="end" content-id="main-content">
    <ion-header>
      <ion-toolbar translucent>
        <ion-title>Menu</ion-title>
        <ion-menu-toggle padding>X</ion-menu-toggle>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item
          menu-close
          v-for="link in navLinks"
          :key="link.name"
          @click="$router.push({ name: link.name }).catch(() => {})"
        >
          <ion-icon :name="link.icon" slot="start"></ion-icon>
          <ion-label>{{ link.name }}</ion-label>
        </ion-item>
        <ion-item menu-close @click="logout">
          <ion-icon name="exit" slot="start"></ion-icon>
          <ion-label>Signout</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      navLinks: [
        { name: "Dashboard", icon: "home" },
        { name: "Overview", icon: "list" },
        { name: "Search", icon: "search" },
        { name: "Map", icon: "map" },
        { name: "Admin", icon: "settings" },
        { name: "Account", icon: "person" },
      ],
    };
  },

  mounted() {},
  methods: { ...mapMutations(["logout"]) },
};
</script>
