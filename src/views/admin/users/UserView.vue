<template>
  <ion-tabs @IonTabsWillChange="beforeTabChange" @IonTabsDidChange="afterTabChange">
    <ion-tab tab="info">
      <ion-header translucent>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Info</ion-title>
          <ion-buttons slot="primary">
            <ion-button
              @click="
                $router
                  .push({
                    name: 'UserEdit',
                    params: { id: $route.params.id },
                  })
                  .catch(() => {})
              "
            >
              <ion-icon name="create"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content fullscreen class="ion-padding">
        <ion-list v-if="user">
          <ion-list-header>{{ langKey("frontend.common.basicinformation") }}</ion-list-header>

          <ion-item>
            <ion-label>
              <p>{{ langKey("frontend.users.firstname") }}</p>
              <h2>{{ user.firstName }}</h2>
            </ion-label>
          </ion-item>
          <ion-item v-show="user.middleName">
            <ion-label>
              <p>{{ langKey("frontend.users.middlename") }}</p>
              <h2>{{ user.middleName }}</h2>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <p>{{ langKey("frontend.users.lastname") }}</p>
              <h2>{{ user.lastName }}</h2>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <p>{{ langKey("frontend.common.phone") }}</p>
              <h2>{{ user.mobileCountryCode }} {{ user.mobilePhoneNumber }}</h2>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <p>{{ langKey("frontend.common.email") }}</p>
              <h2>{{ user.email }}</h2>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <p>{{ langKey("frontend.common.group") }}</p>
              <h2>{{ user.groupName }}</h2>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-tab>

    <ion-tab tab="assets">
      <ion-header translucent>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>{{ langKey("frontend.common.assets") }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content fullscreen class="ion-padding">
        <ion-list>
          <ion-list-header>{{ langKey("frontend.common.assets") }}</ion-list-header>
          <ion-item v-if="assets.length > 0">
            <ion-label v-for="asset in assets">{{ assets }}</ion-label>
          </ion-item>
          <ion-item v-else>
            <ion-label>{{ langKey("frontend.users.noassets") }}</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-tab>

    <ion-tab tab="devices">
      <ion-header translucent>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>{{ langKey("frontend.common.devices") }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content fullscreen class="ion-padding">
        <ion-list>
          <ion-list-header>{{ langKey("frontend.common.devices") }}</ion-list-header>
          <template v-if="user.devices.length > 0">
            <ion-item v-for="device in user.devices">
              <ion-label>
                <p>{{ langKey("frontend.devices.manufacturer") }}</p>
                <h3>{{ device.lastMobileInfo.phoneManufacturer }}</h3>
                <p>{{ langKey("frontend.devices.model") }}</p>
                <h3>{{ device.lastMobileInfo.phoneModel }}</h3>
                <p>{{ langKey("frontend.devices.lasthearddate") }}</p>
                <h3>{{ formatDate(device.lastMobileInfo.createdDate) }}</h3>
                <p>{{ langKey("frontend.devices.lastlocationdate") }}</p>
                <h3>{{ formatDate(device.lastMobileInfo.location.date) }}</h3>
                <p>{{ langKey("frontend.assets.gpsaccuracy") }}</p>
                <h3>{{ device.lastMobileInfo.location.accuracy }}</h3>
              </ion-label>
            </ion-item>
          </template>
          <ion-item v-else>
            <ion-label>{{ langKey("frontend.users.nodevices") }}</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-tab>

    <ion-tab-bar slot="bottom">
      <ion-tab-button
        selected
        :to="{ name: 'AdminUserViewInfo', params: { id: $route.params.id } }"
        tab="info"
      >
        <ion-label>Info</ion-label>
        <ion-icon name="information-circle-outline"></ion-icon>
      </ion-tab-button>
      <ion-tab-button
        :to="{ name: 'AdminUserViewAssets', params: { id: $route.params.id } }"
        tab="assets"
      >
        <ion-label>{{ langKey("frontend.common.assets") }}</ion-label>
        <ion-icon name="briefcase"></ion-icon>
      </ion-tab-button>
      <ion-tab-button
        :to="{ name: 'AdminUserViewDevices', params: { id: $route.params.id } }"
        tab="devices"
      >
        <ion-label>{{ langKey("frontend.common.devices") }}</ion-label>
        <ion-icon name="construct"></ion-icon>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</template>
<script>
import formatDate from "@/mixins/formatDate";
export default {
  mixins: [formatDate],
  data() {
    return {
      user: {
        devices: {
          length: 0
        }
      },
      assets: []
    };
  },
  async created() {
    await this.getUser();
  },
  methods: {
    async getUser() {
      this.user = await this.$store.dispatch("getUser", {
        id: this.$route.params.id
      });

      this.getAssets(this.user);
    },
    async getAssets(user) {
      this.assets = await this.$store.dispatch("getAssetsFoundByPerson", {
        referenceId: user.id
      });
    },
    beforeTabChange() {
      //console.log("beforeTabChange");
    },
    afterTabChange() {
      //console.log("afterTabChange");
    }
  }
};
</script>
