<template>
  <ion-menu side="end" content-id="main-content">
    <ion-header>
      <ion-toolbar translucent>
        <ion-title>Menu</ion-title>
        <ion-menu-toggle padding>X</ion-menu-toggle>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div v-for="item in navLinks">
        <ion-menu-toggle v-if="item.children.length == 0">
          <ion-item
            routerDirection="root"
            routerLinkActive="active"
            @click="$router.push({ name: item.name }).catch(() => {})"
          >
            <ion-icon :name="item.icon" slot="start"></ion-icon>
            <ion-label>{{ item.name }}</ion-label>
          </ion-item>
        </ion-menu-toggle>
        <ion-item v-else @click="item.open = !item.open">
          <ion-icon v-if="!item.open" slot="end" name="arrow-forward"></ion-icon>
          <ion-icon v-if="item.open" slot="end" name="arrow-down"></ion-icon>
          <ion-label>{{ item.name }}</ion-label>
          <ion-icon :name="item.icon" slot="start"></ion-icon>
        </ion-item>
        <ion-list v-if="item.open">
          <ion-menu-toggle>
            <ion-item
              class="sub-item"
              routerDirection="root"
              routerLinkActive="active"
              v-for="subItem in item.children"
              @click="$router.push({ name: subItem.name }).catch(() => {})"
            >
              <ion-label>{{ subItem.name }}</ion-label>
            </ion-item>
          </ion-menu-toggle>
        </ion-list>
      </div>
      <div>
        <ion-item menu-close @click="logout">
          <ion-icon name="exit" slot="start"></ion-icon>
          <ion-label>Signout</ion-label>
        </ion-item>
      </div>
    </ion-content>
  </ion-menu>
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      navLinks: [
        { name: "Dashboard", icon: "home", children: [], open: false },
        {
          name: "Overview",
          icon: "list",
          children: [
            { name: "OverviewAssets" },
            { name: "OverviewUsers" },
            { name: "OverviewLocations" },
            { name: "OverviewLog" }
          ],
          open: false
        },
        { name: "Search", icon: "search", children: [], open: false },
        { name: "Map", icon: "map", children: [], open: false },
        {
          name: "Admin",
          icon: "settings",
          open: false,
          children: [
            {
              name: "AdminAssets"
            },
            {
              name: "AdminCategories"
            },
            {
              name: "AdminService"
            },
            {
              name: "AdminGroups"
            },
            {
              name: "AdminUsers"
            },
            {
              name: "AdminLocations"
            },
            {
              name: "AdminWarnings"
            },
            {
              name: "AdminReports"
            }
          ]
        },
        { name: "Account", icon: "person", children: [], open: false }
      ]
    };
  },

  mounted() {},
  methods: { ...mapMutations(["logout"]) }
};
</script>
<style scoped>
.active {
  --ion-text-color: var(--ion-color-primary);
}
.active-parent {
  font-weight: 500;
  color: red;
}
.sub-item {
  padding-left: 70px;
}
</style>
