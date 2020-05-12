<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button @click="save">
            <ion-icon name="save"></ion-icon>
          </ion-button>
          <ion-button @click="remove(form)">
            <ion-icon name="trash"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form v-if="form" onsubmit="processForm(event)">
        <ion-list lines="full" class="ion-no-margin ion-no-padding">
          <ion-list-header>{{ langKey("frontend.common.basicsettings") }}</ion-list-header>

          <ion-item>
            <ion-label position="stacked">
              {{ langKey("frontend.users.firstname") }}
              <ion-text color="danger">*</ion-text>
            </ion-label>
            <ion-input
              v-bind:value="form.firstName"
              v-on:ionChange="form.firstName = $event.target.value"
              required
              type="text"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">
              {{ langKey("frontend.users.middlename") }}
              <ion-text color="danger">*</ion-text>
            </ion-label>
            <ion-input
              v-bind:value="form.middleName"
              v-on:ionChange="form.middleName = $event.target.value"
              required
              type="text"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">
              {{ langKey("frontend.users.lastname") }}
              <ion-text color="danger">*</ion-text>
            </ion-label>
            <ion-input
              v-bind:value="form.lastName"
              v-on:ionChange="form.surName = $event.target.value"
              required
              type="text"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">
              {{ langKey("frontend.common.countrycode") }}
              <ion-text color="danger">*</ion-text>
            </ion-label>

            <ion-select
              :value="form.mobileCountryCode"
              @ionChange="form.mobileCountryCode = $event.target.value"
              interface="popover"
            >
              <ion-select-option
                v-for="(code, index) in countryCodes"
                :key="index"
                :value="code"
              >{{ code }}</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">
              {{ langKey("frontend.common.phone") }}
              <ion-text color="danger">*</ion-text>
            </ion-label>
            <ion-input
              v-bind:value="form.mobilePhoneNumber"
              v-on:ionChange="form.mobilePhoneNumber = $event.target.value"
              required
              type="text"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">
              {{ langKey("frontend.common.email") }}
              <ion-text color="danger">*</ion-text>
            </ion-label>
            <ion-input
              v-bind:value="form.email"
              v-on:ionChange="form.email = $event.target.value"
              required
              type="text"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">
              {{ langKey("frontend.common.group") }}
              <ion-text color="danger">*</ion-text>
            </ion-label>
            <ion-select
              :value="form.groupName"
              @ionChange="form.groupName = $event.target.value"
              interface="popover"
            >
              <ion-select-option
                v-for="(group, index) in groups"
                :key="index"
                :value="group.name"
              >{{ group.name }}</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>
      </form>
    </ion-content>
  </div>
</template>
<script>
import phoneInfo from "@/mixins/phone-info";
import alerts from "@/mixins/alerts.js";
export default {
  mixins: [phoneInfo, alerts],
  data() {
    return {
      form: null,
      countryCodes: [],
      groups: []
    };
  },
  async created() {
    this.form = await this.$store.dispatch("getUser", {
      id: this.$route.params.id
    });
    this.countryCodes = await this.getPhoneCodes();
    this.getGroups();
  },
  methods: {
    async getGroups() {
      let res = await this.$store.dispatch("getGroups");
      if (this.$store.getters.userType === "superadmin") res.result.shift();
      this.groups = res.result;
    },
    async save() {
      console.log(this.form);
      this.presentAlert("Status", "New user was created - Fake", ["OK"]);
      this.$router.push({
        name: "AdminUserViewInfo",
        params: { id: "5bd81be778419309b4eef181" }
      });
      // if (this.$refs.form.validate()) {
      //   let res = await this.$store.dispatch("saveUser", {
      //     params: removeFalsy(this.form),
      //     sendVerificationEmail: this.sendVerificationEmail,
      //     sendWelcomeSMS: this.sendWelcomeText,
      //   });
      //   if (!res.errors) {
      //     this.preventLeave = false;
      //     this.$store.dispatch("notify", {
      //       message: this.langKey("frontend.users.savedmessage"),
      //       color: "primary",
      //     });
      //     this.$router
      //       .replace({ name: "AdminUsersView", params: { id: res.result.id } })
      //       .catch(() => {});
      //   } else {
      //     this.phoneunique = !res.errors.some((error) => {
      //       return error.errorKey === "errors.mobilenumberalreadyinuse";
      //     });
      //     this.$refs.form.validate();
      //     this.$store.dispatch("notify", {
      //       message: this.langKey("frontend.users.createderrormessage"),
      //       color: "error",
      //     });
      //   }
      //}
    },
    async remove(item) {
      if (item) {
        console.log(item);
        // await this.$store.dispatch("deleteUser", {
        //   id: item.id,
        //   version: item.version,
        // });
        this.presentAlert(
          "Status",
          this.langKey("frontend.users.deletedmessage"),
          ["OK"]
        );
      }
      this.$router.push({ name: "Users" });
    }
  }
};
</script>
<style></style>
