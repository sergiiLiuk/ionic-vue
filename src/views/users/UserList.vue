<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
          <!-- <ion-menu-button></ion-menu-button> -->
        </ion-buttons>
        <ion-title>Users</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item v-for="user in users" :key="user.id">
          <ion-label>
            <h2>{{ user.fullName }}</h2>
            <h3>{{ user.mobilePhoneNumber }}</h3>
            <h3>{{ user.numDevices }}</h3>
            <p>{{ user.createdDateTime }}</p>
          </ion-label>
          <ion-button @click="presentActionSheet" expand="block"
            >Action</ion-button
          >
        </ion-item>
      </ion-list>
    </ion-content>
  </div>
</template>
<script>
export default {
  name: "UserList",
  async created() {
    await this.$store.dispatch("getUsers");
  },
  computed: {
    users() {
      return this.$store.state.users.users;
    },
  },
  methods: {
    presentActionSheet() {
      return this.$ionic.actionSheetController
        .create({
          header: "User",
          buttons: [
            {
              text: "More details",
              handler: () => {
                console.log("Mode details clicked");
              },
            },
            {
              text: "Edit",
              handler: () => {
                console.log("Edit clicked");
              },
            },
            {
              text: "Delete",
              role: "destructive",
              handler: () => {
                console.log("Delete clicked");
              },
            },
          ],
        })
        .then((a) => a.present());
    },
  },
};
</script>
