<template>
  <div>
    <ion-searchbar
      :value="state.search"
      @ionChange="state.search = $event.target.value"
      placeholder="Filter Users"
    ></ion-searchbar>
    <div class="wrap-collabsible">
      <input id="collapsible-settings" class="toggle" type="checkbox" />
      <label for="collapsible-settings" class="lbl-toggle">Settings</label>
      <div class="collapsible-content">
        <div class="content-inner">
          <ion-list>
            <ion-item>
              <ion-label>Columns</ion-label>
              <ion-select
                id="columns"
                @ionChange="state.settings.columns = $event.target.value"
                multiple="true"
                ok-text="Okay"
                cancel-text="Dismiss"
              >
                <ion-select-option v-for="header in headers" :value="header.name">{{ header.text }}</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-list>
        </div>
      </div>
    </div>
    <div class="wrap-collabsible">
      <input id="collapsible-filter" class="toggle" type="checkbox" />
      <label for="collapsible-filter" class="lbl-toggle">Filter</label>
      <div class="collapsible-content">
        <div class="content-inner">
          <ion-list>
            <ion-item>
              <ion-label>{{langKey('frontend.common.groups')}}</ion-label>
              <ion-select
                id="columns-filters"
                @ionChange="state.filters.groups = $event.target.value"
                multiple="true"
                ok-text="Okay"
                cancel-text="Dismiss"
              >
                <ion-select-option v-for="group in groups" :value="group.id">{{ group.name }}</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label>{{langKey('frontend.common.devices') }}</ion-label>
              <ion-label>
                <p>Has no devices</p>
              </ion-label>
              <ion-checkbox @ionChange="state.filters.noDevices = !state.filters.noDevices"></ion-checkbox>
            </ion-item>
            <div class="ion-padding">
              <ion-button
                expand="full"
                color="primary"
                @click="clearFilters()"
              >{{langKey('frontend.table.clearfilters')}}</ion-button>
            </div>
          </ion-list>
        </div>
      </div>
    </div>
    <ion-card v-for="item in filteredResults" :key="item.id">
      <ion-card-header>
        <ion-card-title class="card-title">
          {{
          item["fullName"]
          }}
        </ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-row>
          <ion-col>
            <ion-row
              v-for="(value, propertyName) in item"
              v-if="
                (value || value == 0) &&
                  state.settings.columns.includes(propertyName)
              "
            >
              <ion-col
                size="auto"
                v-for="header in headers"
                v-if="header.value && header.value === propertyName"
              >
                <ion-text color="dark">{{ header.text }} :</ion-text>
              </ion-col>
              <ion-col size="auto">
                {{
                propertyName === "createdDateTime" ? formatDate(value) : value
                }}
              </ion-col>
            </ion-row>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="auto">
            <slot v-bind:item="item" name="actions"></slot>
          </ion-col>
        </ion-row>
      </ion-card-content>
    </ion-card>
  </div>
</template>
<script>
import formatDate from "@/mixins/formatDate";
export default {
  mixins: [formatDate],
  props: {
    results: {
      type: Object
    },
    state: {
      type: Object
    },
    headers: {
      type: Array
    },
    initFilters: {
      type: Object
    },
    loading: {
      type: Boolean
    }
  },
  mounted() {
    const selectColumns = document.querySelector("#columns");
    selectColumns.value = this.state.settings.columns;

    const selectFilters = document.querySelector("#columns-filters");
    selectFilters.value = this.state.filters.noDevices;

    this.getGroups();
  },
  computed: {
    groups() {
      return this.$store.state.groups.groups;
    },
    filteredResults() {
      return this.results.all();
    }
  },
  methods: {
    async getGroups() {
      await this.$store.dispatch("getGroupsForReal");
    },
    clearFilters() {
      this.state.filters = Object.assign({}, this.initFilters);
    }
  }
};
</script>
<style scoped>
.card-title {
  font-size: 1.3rem;
}
.list-ios {
  margin-bottom: 0px;
}
.wrap-collabsible {
  margin: 0px 13px 0 13px;
  margin-bottom: 1.2rem 0;
}

input[type="checkbox"] {
  display: none;
}

.lbl-toggle {
  display: block;

  font-weight: bold;
  font-family: monospace;
  font-size: 1.2rem;
  text-transform: uppercase;
  text-align: center;

  padding: 1rem;

  color: #000;
  background: #ededed;

  cursor: pointer;

  border-radius: 7px;
  transition: all 0.25s ease-out;
}

.lbl-toggle:hover {
  color: #000;
}

.lbl-toggle::before {
  content: " ";
  display: inline-block;

  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid currentColor;
  vertical-align: middle;
  margin-right: 0.7rem;
  transform: translateY(-2px);

  transition: transform 0.2s ease-out;
}

.toggle:checked + .lbl-toggle::before {
  transform: rotate(90deg) translateX(-3px);
}

.collapsible-content {
  max-height: 0px;
  overflow: hidden;
  transition: max-height 0.25s ease-in-out;
}

.toggle:checked + .lbl-toggle + .collapsible-content {
  max-height: 100vh;
}

.toggle:checked + .lbl-toggle {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.collapsible-content .content-inner {
  background: #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
  border-bottom-left-radius: 7px;
  border-bottom-right-radius: 7px;
  padding: 0.5rem 1rem;
}
</style>
