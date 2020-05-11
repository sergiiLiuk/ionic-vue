<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" routerDirection="root"></ion-back-button>
          <!-- <ion-menu-button></ion-menu-button> -->
        </ion-buttons>

        <ion-title>Users</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="$router.push({ name: 'UserCreate' }).catch(() => {})">
            <ion-icon class="add" name="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <FilteredList
        :state.sync="state"
        :headers="headers"
        :initFilters="initFilters"
        :results="filteredResults"
        :loading="loading"
      >
        <template slot="actions" slot-scope="props">
          <ion-button @click="presentActionSheet(props.item)" size="small">Action</ion-button>
        </template>
      </FilteredList>
    </ion-content>
  </div>
</template>
<script>
import search from "@/imports/search";
import mingo from "mingo";
import alerts from "@/mixins/alerts.js";
import FilteredList from "@/components/FilteredList";

const initSettings = {
  columns: [
    "firstName",
    "middleName",
    "lastName",
    "mobilePhoneNumber",
    "email",
    "createdDateTime",
    "numDevices"
  ],
  view: 0,
  sortBy: "createdDateTime",
  descending: false,
  results: "10",
  title: ""
};

const initFilters = {
  groups: [],
  noDevices: false
};
export default {
  mixins: [alerts],
  name: "UserList",
  components: { FilteredList },
  data() {
    return {
      state: {
        search: "",
        page: 1,
        version: 1,
        settings: Object.assign({}, initSettings),
        filters: Object.assign({}, initFilters)
      },
      initFilters: Object.assign({}, initFilters),
      loading: true
    };
  },
  async created() {
    this.getData();
  },
  computed: {
    results() {
      return this.$store.state.users.users;
    },
    headers() {
      return [
        {
          text: this.langKey("frontend.users.firstname"),
          value: "firstName",
          name: "firstName"
        },
        {
          text: this.langKey("frontend.users.middlename"),
          value: "middleName",
          name: "middleName"
        },
        {
          text: this.langKey("frontend.users.lastname"),
          value: "lastName",
          name: "lastName"
        },
        {
          text: this.langKey("frontend.common.group"),
          value: "groupName",
          name: "groupName"
        },
        {
          text: this.langKey("frontend.common.phone"),
          value: "mobilePhoneNumber",
          name: "mobilePhoneNumber"
        },
        {
          text: this.langKey("frontend.common.email"),
          value: "email",
          name: "email"
        },
        {
          text: this.langKey("frontend.common.devices"),
          value: "numDevices",
          name: "numDevices"
        },
        {
          text: this.langKey("frontend.common.created"),
          value: "createdDateTime",
          name: "createdDateTime",
          format: val => {
            return this.formatDate(val);
          }
        }
      ];
    },
    filteredResults() {
      let res = search({
        list: this.results,
        search: this.state.search,
        fields: [
          "firstName",
          "lastName",
          "middleName",
          "email",
          "mobilePhoneNumber",
          "groupName"
        ]
      });

      let query = {};

      if (this.state.filters.groups.length) {
        query["groupId"] = {
          $in: this.state.filters.groups
        };
      }

      if (this.state.filters.noDevices) {
        query["numDevices"] = {
          $lt: 1
        };
      }

      let sortObj = {};
      sortObj[this.state.settings.sortBy] = this.state.settings.descending
        ? -1
        : 1;
      return mingo.find(res, query).sort(sortObj);
    }
  },
  methods: {
    async getData() {
      await this.$store.dispatch("getUsers");
    },
    presentActionSheet(item) {
      return this.$ionic.actionSheetController
        .create({
          header: "User",
          buttons: [
            {
              text: "More details",
              handler: () => {
                this.$router.push({
                  name: "AdminUserViewInfo",
                  params: { id: item.id }
                });
              }
            },
            {
              text: "Edit",
              handler: () => {
                this.$router
                  .push({
                    name: "UserEdit",
                    params: { id: item.id }
                  })
                  .catch(() => {});
              }
            },
            {
              text: "Delete",
              role: "destructive",
              handler: () => {
                this.presentAlertConfirm(item);
              }
            }
          ]
        })
        .then(a => a.present());
    },
    presentAlertConfirm(data) {
      return this.$ionic.alertController
        .create({
          header: "Confirm!",
          message: `Delete <strong>${data.fullName}</strong>?`,
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
              handler: () => {}
            },
            {
              text: "Okay",
              handler: () => {
                this.remove(data);
              }
            }
          ]
        })
        .then(a => a.present());
    },
    async remove(item) {
      if (item) {
        // await this.$store.dispatch("deleteUser", {
        //   id: item.id,
        //   version: item.version,
        // });
        this.presentAlert(
          "Status",
          this.langKey("frontend.users.deletedmessage"),
          ["OK"]
        );
        this.getData();
      }
    }
  }
};
</script>
<style scoped>
.add {
  font-size: 2rem;
}
</style>
