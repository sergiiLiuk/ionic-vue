<template>
  <div>
    <div style="position: relative;" class=" ">
      <div id="map"></div>
      <div id="map-caption">
        <div class="res__text  black--text  ">
          {{ total }} {{ langKey("frontend.log.results") }}
        </div>
        <div v-if="total !== filteredTotal" class="caption  ">
          {{ total - filteredTotal }}
          {{ langKey("frontend.log.withoutlocation") }}
        </div>
      </div>
    </div>
    <!-- <v-progress-linear v-visible="mapLoading" class="my-1" indeterminate></v-progress-linear> -->
  </div>
</template>

<script>
import ClusterMap from "@/imports/map/LogCluster";

let map;

export default {
  name: "LogMap",
  props: {
    trackersFilter: {
      type: Array,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    assetRefId: {
      type: String,
    },
  },
  data() {
    return {
      logResults: [],
      total: 0,
      filteredTotal: 0,
      filteredResults: 0,
      mapLoading: true,
    };
  },
  watch: {
    trackersFilter: {
      handler: function() {
        this.update();
      },
      deep: true,
    },
    startDate() {
      this.update();
    },
    endDate() {
      this.update();
    },
  },
  async created() {
    await this.$store
      .dispatch("getAssetLog", {
        startDate: this.startDate,
        endDate: this.endDate,
        assetRefId: this.assetRefId,
      })
      .then((result) => {
        this.logResults = result;
        this.update();
      });

    const trackersList = [
      ...new Set(this.logResults.map((tracker) => tracker.V)),
    ];

    this.$emit("trackersList", {
      trackersList,
    });
  },
  mounted() {
    map = new ClusterMap({
      type: "FeatureCollection",
      features: [],
    });
  },
  methods: {
    mapReady() {
      if (map.ready) {
        let geo = {
          type: "FeatureCollection",
          features: this.filteredResults.map((record) => {
            return {
              type: "Feature",
              geometry: record.L,
            };
          }),
        };
        map.update(geo);
        this.mapLoading = false;
        this.$emit("loadEnd");
      } else {
        setTimeout(this.mapReady, 500);
      }
    },
    filterByArrayParam(arr, params) {
      return arr.filter((obj) => params.includes(obj.V));
    },
    filterByDate(arr, startDate, endDate) {
      return arr.filter((bin) => bin.D >= startDate && bin.D <= endDate);
    },
    async update() {
      this.mapLoading = true;

      let results = this.filterByDate(
        this.logResults,
        this.startDate,
        this.endDate
      );

      results = this.filterByArrayParam(results, this.trackersFilter);

      if (
        typeof results[0] !== "undefined" ||
        typeof results[results.length - 1] !== "undefined"
      ) {
        let endDate = results[0].D;
        let startDate = results[results.length - 1].D;
        this.$emit("actualDate", {
          startDate,
          endDate,
        });
      } else {
        this.mapLoading = false;
        console.log(this.$options.name, "->", "not log data");
      }
      this.filteredResults = results.filter((record) => record.L);

      this.total = results.length;
      this.filteredTotal = this.filteredResults.length;
      this.mapReady();
    },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 310px;
}

#map-caption {
  position: absolute;
  top: 0px;
}
@media only screen and (max-width: 960px) {
  .res__text {
    font-size: 25px !important;
  }
}
</style>
