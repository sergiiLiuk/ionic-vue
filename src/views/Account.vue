<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Account</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list v-if="$store.state.user">
        <ion-item>
          <ion-label>
            <p>{{ langKey("frontend.common.name") }}</p>
            <h2>{{ $store.state.user.fullName }}</h2>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <p>{{ langKey("frontend.common.group") }}</p>
            <h2>{{ $store.state.user.groupName }}</h2>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label v-if="$store.state.customer">
            <p>{{ langKey("frontend.common.company") }}</p>
            <h2>{{ $store.state.customer.companyName }}</h2>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-radio-group
          allow-empty-selection="true"
          :value="lang"
          @ionChange="lang = $event.target.value"
        >
          <ion-list-header>
            <ion-label>Language</ion-label>
          </ion-list-header>
          <ion-item v-for="langObj in langAvailable" :key="langObj.lang">
            <ion-label
              v-text="langObj.friendly + ' (' + langObj.friendlyen + ')'"
            >
            </ion-label>
            <ion-radio
              slot="start"
              color="success"
              :value="langObj.lang"
            ></ion-radio>
          </ion-item>
        </ion-radio-group>
      </ion-list>
      <ion-item-divider>
        <ion-label>Enviroment</ion-label>
        <ion-note slot="end" v-text="appEnv"></ion-note>
      </ion-item-divider>
      <ion-item-divider>
        <ion-label>Version</ion-label>
        <ion-note slot="end" v-text="appVersion"></ion-note>
      </ion-item-divider>
      <ion-item-divider>
        <ion-label>Revision</ion-label>
        <ion-note slot="end" v-text="appRevision"></ion-note>
      </ion-item-divider>
    </ion-content>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { mapFields } from "vuex-map-fields";
export default {
  methods: {},
  computed: {
    ...mapState(["langAvailable", "langData", "userData"]),
    ...mapFields(["dark", "lang"]),
    ...mapGetters(["userType"]),
    appVersion() {
      return (
        process.env.VUE_APP_BUILDVERSION + "." + process.env.VUE_APP_BUILDNUMBER
      );
    },
    appRevision() {
      return process.env.VUE_APP_BUILDREVISIONSHORT;
    },
    appEnv() {
      return process.env.NODE_ENV;
    },
    userInfo() {
      if (this.userType === "user" && this.userData) {
        return this.userData.fullName + " - " + this.userData.groupName;
      } else if (this.userType === "superadmin") return "Superadmin";
      else return null;
    },
  },
  watch: {
    lang(lang) {
      console.log("ae");
      this.$store.dispatch("getLangData", lang);
    },
  },
};
</script>
