<template>
  <div>
    <SideBar />
    <div class="ion-page" id="main-content">
      <ion-vue-router />
    </div>
  </div>
  <!-- <ion-page class="ion-page" id="main-content">
    
    <SideBar />

    <!-- <Confirm ref="confirm"></Confirm>
    <ConfirmLeave ref="confirmLeave"></ConfirmLeave> -->

  <!--<ion-content>
      <keep-alive
        include="AssetMap,Assets,Users,Locations,Search,Warnings,Beacon,GPSTracker,GPSGate,MobDevice,LanGate"
      >
        <ion-vue-router />
      </keep-alive>
    </ion-content>
  </ion-page> -->
</template>

<script>
import SideBar from "@/components/layout/SideBar";
// import Confirm from "@/components/common/Confirm";
// import ConfirmLeave from "@/components/common/ConfirmLeave";

export default {
  components: {
    SideBar,
    // Confirm,
    // ConfirmLeave,
  },
  mounted() {
    // this.$root.$confirm = this.$refs.confirm.open;
    // this.$root.$confirmLeave = this.$refs.confirmLeave.open;
  },
};
</script>

<style>
#main-container {
  max-width: 1200px !important;
}

@media print {
  #main-container {
    max-width: 100% !important;
  }
}
</style>
