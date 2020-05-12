<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content
      ><LogMap
        :trackers-filter="trackersFilter"
        :asset-ref-id="assetRefId"
        :start-date="startDate"
        :end-date="endDate"
        @trackersList="onTrackersListReady"
        @actualDate="onActualDate"
        @loadEnd="onLoadEnd"
      ></LogMap>

      <Slider
        :loading="loading"
        :asset-ref-id="assetRefId"
        :actual-start-date="actualStartDate"
        :actual-end-date="actualEndDate"
        class="slider"
        @dateChanged="onDateChanged"
      ></Slider
    ></ion-content>
  </div>
</template>

<script>
import Slider from "@/views/overview/log/Slider";
import LogMap from "@/views/overview/log/LogMap";

export default {
  components: { Slider, LogMap },
  data() {
    return {
      trackersFilter: [],
      assetTrackers: [],
      startDate: "",
      endDate: "",
      actualStartDate: "",
      actualEndDate: "",
      loading: true,
    };
  },
  computed: {
    asset() {
      return this.$store.getters.getAssetById(this.assetRefId);
    },
    assetRefId() {
      return this.$route.params.assetRefId ? this.$route.params.assetRefId : "";
    },
  },
  methods: {
    onTrackersListReady(param) {
      this.assetTrackers = param.trackersList;
      this.trackersFilter = param.trackersList;
    },
    onDateChanged(dates) {
      if (dates.startDate === this.startDate && dates.endDate === this.endDate)
        return;
      this.startDate = dates.startDate;
      this.endDate = dates.endDate;
      this.loading = true;
    },
    onActualDate(date) {
      this.actualStartDate = date.startDate;
      this.actualEndDate = date.endDate;
    },
    onLoadEnd() {
      this.loading = false;
    },
  },
};
</script>
<style>
.log .v-expansion-panel-content__wrap {
  /* padding: 0px; */
}
.switch .v-input__slot {
  /* margin: 4px 10px 8px 0px !important; */
}
@media only screen and (max-width: 960px) {
  .slider {
    /* margin-bottom: 100px; */
  }
}
</style>
