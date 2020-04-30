<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Admin</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col v-for="item in components" :key="item.name"
            ><ion-card @click="$router.push({ name: item.name })">
              <ion-card-header class="ion-text-center">
                <ion-icon size="large" :name="item.icon"></ion-icon>
                <ion-card-subtitle>{{ item.name }}</ion-card-subtitle>
              </ion-card-header>
            </ion-card></ion-col
          >
        </ion-row></ion-grid
      >
    </ion-content>
  </div>
</template>
<script>
export default {
  name: "Admin",
  data() {
    return {
      components: [
        { name: "Assets", icon: "hammer" },
        { name: "Categories", icon: "list" },
        { name: "Service", icon: "search" },
        { name: "Groups", icon: "people" },
        { name: "Users", icon: "contact" },
        { name: "Locations", icon: "compass" },
        { name: "Warnings", icon: "alert" },
        { name: "Reports", icon: "document" },
        { name: "Emails", icon: "mail" },
        { name: "Hardware", icon: "speedometer" },
      ],
    };
  },
};
</script>
