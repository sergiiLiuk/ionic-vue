<template>
  <div class="slider__container">
    <!-- <div ref="slider" class="wrapper mb-2">
      <svg :class="{disabled: loading}" class="slider-area" style="width: 100%; height: 100%;">
        <rect
          v-for="(bin, i) in bins"
          :key="i"
          :y="100 - height(bin.count, maxBin) + '%'"
          :x="widthPerBin * i "
          :width="widthPerBin"
          :height="height(bin.count, maxBin) + '%'"
          class="bin"
          :class="{ active: !loading }"
          @click="selectBin(i)"
					@mouseover="mouseover(bin)"
    			@mouseleave="mouseleave"
        >woo</rect>
				  <svg v-show="show" ref="tooltip" :x="tooltipX"  y="0" width="280px" height="20px">					 
							<rect width="100%" height="100%" fill="#d6d6d6" style="opacity:0.3" stroke="#6aa641" stroke-width="3" />
							<text v-text="toolTipText" x="50%" y="14px" fill="#000" font-size="0.8em" text-anchor="middle">foo</text>
					</svg>
			</svg>
 
      <div class="mask" :style="{width: leftThumbPosition + 'px'}"></div>
      <div class="mask" :style="{right: 0 + 'px', width: sliderWidth - rightThumbPosition + 'px'}"></div>

      <div
        id="thumb-left"
        class="d-none d-md-flex thumb"
        :class="{disabled: loading}"
        :style="{left: leftThumbPosition + 'px'}"
        @mousedown="!loading && startDrag('leftThumbPosition', $event)"
      >
        <div class="draggable left">
          <svg
            width="50"
            height="66"
            version="1.1"
            viewBox="0 0 8 8"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(0 -288)">
              <path
                d="m7.0215 288.79-2.0309 3.1525h-1.4898c-5.56e-4 0-8.95e-4 9e-3 -0.0015 9e-3h-0.62479c-0.96657 2.5e-4 -1.7444 0.90561-1.7444 2.0301v0.24138c0 1.1245 0.77783 2.0295 1.7444 2.0295h2.3783c0.04427 0 0.0877-4e-3 0.13112-8e-3h1.6071c0.01102 0 0.01992-0.14629 0.01992-0.32812v-3.6459c0-0.0508-2e-3 -0.0869-0.0033-0.12975z"
                fill="#333"
                stroke-width=".14274"
              />
              <path
                d="m3.1951 292.82v2.08h0.36447v-2.08zm0.64967 0v2.08h0.36447v-2.08zm0.62936 0v2.08h0.36447v-2.08z"
                fill="#fff"
                stroke-width=".49746"
              />
            </g>
          </svg>
        </div>
      </div>

      <div
        id="thumb-right"
        class="d-none d-md-flex thumb"
        :class="{disabled: loading}"
        :style="{left: rightThumbPosition + 15 + 'px'}"
        @mousedown="!loading && startDrag('rightThumbPosition', $event)"
      >
        <div class="draggable right">
          <svg
            width="50"
            height="65"
            version="1.1"
            viewBox="0 0 8 8"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(0 -288)">
              <path
                d="m7.0215 288.79-2.0309 3.1525h-1.4898c-5.56e-4 0-8.95e-4 9e-3 -0.0015 9e-3h-0.62479c-0.96657 2.5e-4 -1.7444 0.90561-1.7444 2.0301v0.24138c0 1.1245 0.77783 2.0295 1.7444 2.0295h2.3783c0.04427 0 0.0877-4e-3 0.13112-8e-3h1.6071c0.01102 0 0.01992-0.14629 0.01992-0.32812v-3.6459c0-0.0508-2e-3 -0.0869-0.0033-0.12975z"
                fill="#333"
                stroke-width=".14274"
              />
              <path
                d="m3.1951 292.82v2.08h0.36447v-2.08zm0.64967 0v2.08h0.36447v-2.08zm0.62936 0v2.08h0.36447v-2.08z"
                fill="#fff"
                stroke-width=".49746"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>


    <div class="dates">
			
      <div style="width:40%;" class="">
        <div class="label-title">{{langKey('frontend.log.fromdate')}}</div>
					<div v-show="!loading" class="d-flex">
						<v-icon class="mr-1">event</v-icon>
						<datetime 
							type="datetime" 
							v-model="startDate" 
							class="timepicker theme-primary"
							input-id="start-date"
							:min-datetime="minDatetime"
							:max-datetime="endDate"
							:format="formatDate(this.$store.state.lang)"
							>
							<template slot="button-cancel">
								<span class="btn__cancel">{{langKey('frontend.common.cancel')}}</span>
							</template>
							<template slot="button-confirm">
								{{langKey('common.ok')}}
							</template>
						</datetime>
					</div>
      </div>

      <div class="text-right">
        <div class="label-title">{{langKey('frontend.log.todate')}}</div>
					<div v-show="!loading" class="d-flex">						
						<datetime										
							type="datetime" 
							class="theme-primary"
							input-class="text-right"
							input-id="end-date"
							v-model="endDate" 
							:min-datetime="startDate"
							:max-datetime="maxDatetime"
							:format="formatDate(this.$store.state.lang)"
						>
						<template slot="button-cancel">
								<span class="btn__cancel">{{langKey('frontend.common.cancel')}}</span>
							</template>
							<template slot="button-confirm">
								{{langKey('common.ok')}}
							</template>
						</datetime>
						<v-icon class="ml-1">event</v-icon>
					</div>
      </div>
			
    </div> -->
  </div>
</template>

<script>
import moment from "moment";

// import { Datetime } from "vue-datetime";
// import { Settings } from "luxon";

// import "vue-datetime/dist/vue-datetime.css";

export default {
  components: {
    // datetime: Datetime,
  },
  props: {
    actualStartDate: {
      type: String,
    },
    actualEndDate: {
      type: String,
    },
    assetRefId: {
      type: String,
    },
    loading: {
      type: Boolean,
    },
  },
  data() {
    return {
      tooltipX: 0,
      toolTipText: "",
      show: false,
      minDatetime: "",
      maxDatetime: "",
      leftThumbPosition: 0,
      rightThumbPosition: 0,
      currentThumb: null,
      sliderWidth: "",
      bins: [],
      isThumbMoving: true,
      mouseDown: false,
      sliderContWidth: 0,
    };
  },
  computed: {
    maxBin() {
      return this.bins.reduce((prev, current) =>
        prev.count > current.count ? prev : current
      ).count;
    },
    widthPerBin() {
      return this.sliderContWidth / this.bins.length;
    },
    // startDate: {
    //   get: function() {
    //     return this.getSliderThumbDate(this.leftThumbPosition);
    //   },
    //   set: function(newStartDate) {
    //     if (!newStartDate) return;
    //     else if (moment(newStartDate).format() < this.minDatetime) {
    //       this.setThumbPosition(this.minDatetime, "leftThumbPosition");
    //       this.dateChanged(
    //         this.minDatetime,
    //         this.getSliderThumbDate(this.rightThumbPosition)
    //       );
    //     } else if (moment(newStartDate).format() > this.endDate) {
    //       this.setThumbPosition(moment(this.endDate), "leftThumbPosition");
    //       this.dateChanged(
    //         moment(this.endDate),
    //         this.getSliderThumbDate(this.rightThumbPosition)
    //       );
    //     } else {
    //       this.setThumbPosition(newStartDate, "leftThumbPosition");
    //       this.dateChanged(
    //         newStartDate,
    //         this.getSliderThumbDate(this.rightThumbPosition)
    //       );
    //     }
    //   },
    // },
    // endDate: {
    //   get: function() {
    //     return this.getSliderThumbDate(this.rightThumbPosition);
    //   },
    //   set: function(newEndDate) {
    //     if (!newEndDate) return;
    //     else if (moment(newEndDate).format() > this.maxDatetime) {
    //       this.setThumbPosition(this.maxDatetime, "rightThumbPosition");
    //       this.dateChanged(
    //         this.getSliderThumbDate(this.leftThumbPosition),
    //         this.maxDatetime
    //       );
    //     } else if (moment(newEndDate).format() < this.startDate) {
    //       this.setThumbPosition(moment(this.startDate), "rightThumbPosition");
    //       this.dateChanged(
    //         this.getSliderThumbDate(this.leftThumbPosition),
    //         moment(this.startDate)
    //       );
    //     } else {
    //       this.setThumbPosition(newEndDate, "rightThumbPosition");
    //       this.dateChanged(
    //         this.getSliderThumbDate(this.leftThumbPosition),
    //         newEndDate
    //       );
    //     }
    //   },
    // },
  },
  async created() {
    // Get all bins to calculate date range to show
    let initBins = [];
    if (!this.assetRefId)
      initBins = await this.$store.dispatch("getAssetRecordInitBins");
    else
      initBins = await this.$store.dispatch("getAssetRecordInitBinsByRefId", {
        detailLevel: "DETAIL_HOUR",
        assetRefId: this.assetRefId,
      });

    if (!initBins.result.length) return;

    let dates = this.calculateMaxTimeSpan(initBins.result.reverse());

    this.bins = await this.$store.dispatch("getAssetRecordBins", {
      fromDate: dates.startDate,
      toDate: dates.endDate,
      detailLevel: this.getDetailLevel(dates.bins),
      assetRefId: this.assetRefId,
    });

    this.dateChanged("2020-05-10T09:18:58+02:00", "2020-05-12T10:18:58+02:00");
    // this.minDatetime = this.getSliderThumbDate(this.leftThumbPosition);
    // this.maxDatetime = this.getSliderThumbDate(this.rightThumbPosition);
  },
  mounted() {
    // this.rightThumbPosition = this.$refs.slider.offsetWidth;
    // this.sliderWidth = this.$refs.slider.offsetWidth;
    // const slider = document.querySelector(".slider-area");
    // const thumbs = document.querySelectorAll(".draggable");
    // slider.addEventListener("mouseenter", () => {
    //   const masks = document.querySelectorAll(".mask");
    //   masks.forEach((mask) => {
    //     if (!this.isThumbMoving && !this.loading) {
    //       mask.style.display = "none";
    //       thumbs.forEach((thumb) => {
    //         thumb.style.display = "none";
    //       });
    //     }
    //   });
    // });
    // slider.addEventListener("mouseleave", () => {
    //   const masks = document.querySelectorAll(".mask");
    //   masks.forEach((mask) => {
    //     mask.style.display = "block";
    //     thumbs.forEach((thumb) => {
    //       thumb.style.display = "block";
    //     });
    //   });
    // });
    // document.addEventListener("mousemove", this.move);
    // document.addEventListener("mouseup", this.stopDrag);
    // this.sliderContWidth = this.$refs.slider.offsetWidth;
  },
  updated() {
    // Settings.defaultLocale = this.$store.state.lang;
  },
  methods: {
    // formatDate(langKey) {
    //   switch (langKey) {
    //     case "da":
    //       return "d. LLL y T";
    //     case "en":
    //       return "LLL d, y T a";
    //     case "nb":
    //       return "d. LLL. y kl. T";
    //     case "de":
    //       return "d. LLL. y T";
    //     case "nl":
    //       return "d LLL. y T";
    //     case "sv":
    //       return "d LLL y T";
    //     default:
    //       return "yyyy-MM-dd HH:mm";
    //   }
    // },
    getDetailLevel(numBins) {
      let detailLevel = "DETAIL_HOUR";
      if (numBins > 360 * 24) detailLevel = "DETAIL_MONTH";
      else if (numBins > 14 * 24) detailLevel = "DETAIL_DAY";
      return detailLevel;
    },
    // mouseover(bin) {
    //   this.show = true;
    //   this.tooltipX = this.placeToolTip();
    //   this.toolTipText =
    //     moment(bin.timeFromUTC)
    //       .locale(this.$store.state.lang)
    //       .local()
    //       .format("lll") +
    //     " - " +
    //     moment(bin.timeToUTC)
    //       .locale(this.$store.state.lang)
    //       .local()
    //       .format("lll");
    //   this.placeToolTip();
    // },
    // placeToolTip() {
    //   const contWidth = this.$refs.slider.offsetWidth;
    //   const tipWidth = this.$refs.tooltip.width.baseVal.value;
    //   return event.offsetX + tipWidth > contWidth
    //     ? event.offsetX - (event.offsetX + tipWidth - contWidth)
    //     : event.offsetX;
    // },
    // mouseleave() {
    //   this.show = false;
    // },
    selectBin(i) {
      if (this.loading) return;
      this.leftThumbPosition = this.widthPerBin * i;
      this.rightThumbPosition =
        parseFloat(i * this.widthPerBin) + parseFloat(this.widthPerBin);
      this.dateChanged(
        this.getSliderThumbDate(this.leftThumbPosition),
        this.getSliderThumbDate(this.rightThumbPosition)
      );
      this.isThumbMoving = false;
    },
    setThumbPosition(newDate, thumb) {
      this.isThumbMoving = false;

      const startDate = moment(this.bins[0].timeFromUTC).unix();
      const endDate = moment(this.bins[this.bins.length - 1].timeToUTC).unix();
      newDate = moment(newDate).unix();
      const diff = endDate - startDate;
      const pixInSec = this.sliderContWidth / diff;

      const leftPos = (newDate - startDate) * pixInSec;

      this[thumb] = leftPos;
    },
    getSliderThumbDate(position) {
      if (!this.bins.length) return;

      let startDate = moment(this.bins[0].timeFromUTC).unix();
      let endDate = moment(this.bins[this.bins.length - 1].timeToUTC).unix();
      let diff = endDate - startDate;

      const ratio = diff / this.sliderContWidth;

      let progress = startDate + Math.round(position * ratio);

      return moment.unix(progress).format();
    },
    height(val, max) {
      if (val === 0) return 0;
      let x = (val / max) * 100;
      return x > 2 ? x : 2;
    },
    startDrag(target) {
      this.currentThumb = target;
      this.mouseDown = true;
    },
    move(event) {
      if (!this.loading && this.mouseDown) {
        this.isThumbMoving = true;
        let containerLeft = this.$refs.slider.offsetLeft;
        let localLeft = event.clientX - containerLeft;
        this.currentThumb === "leftThumbPosition"
          ? (localLeft = localLeft + 20)
          : (localLeft = localLeft - 20);
        if (localLeft < 0) localLeft = 0;
        else if (localLeft > this.sliderContWidth)
          localLeft = this.sliderContWidth;

        if (
          this.currentThumb === "leftThumbPosition" &&
          localLeft > this.rightThumbPosition
        )
          return;

        if (
          this.currentThumb === "rightThumbPosition" &&
          localLeft < this.leftThumbPosition
        )
          return;
        this[this.currentThumb] = localLeft;
      }
    },
    stopDrag() {
      this.isThumbMoving = false;
      this.mouseDown = false;
      this.dateChanged(
        this.getSliderThumbDate(this.leftThumbPosition),
        this.getSliderThumbDate(this.rightThumbPosition)
      );
    },
    calculateMaxTimeSpan(bins) {
      let endDate = bins[0].timeToUTC; //
      let total = 0;
      let numHours = 0;
      for (let bin of bins) {
        // Check if next sum would be larger than wanted result size
        if (total + bin.count > this.$store.state.logLimit) break;
        else {
          total += bin.count;
          numHours++;
        }
      }
      return {
        startDate: moment(endDate)
          .subtract(numHours, "h")
          .utc()
          .format(),
        endDate: moment(endDate)
          .utc()
          .format(),
        bins: numHours,
      };
    },
    dateChanged(newStartDate, newEndDate) {
      console.log(newStartDate, newEndDate);
      this.$emit("dateChanged", {
        startDate: newStartDate
          ? moment(newStartDate)
              .utc()
              .format()
          : moment(this.startDate)
              .utc()
              .format(),
        endDate: newEndDate
          ? moment(newEndDate)
              .utc()
              .format()
          : moment(this.endDate)
              .utc()
              .format(),
      });
    },
  },
};
</script>

<style>
.slider__container {
  /* margin-bottom: 50px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  padding: 20px 40px 20px 40px; */
}
@media only screen and (max-width: 599px) {
  .slider__container {
    /* padding: 10px 5px 10px 5px; */
  }
  .vdatetime-input {
    /* font-size: 12px; */
  }
}
#start-date,
#end-date {
  /* border-bottom: 1px solid #ccc; */
}
#start-date:hover,
#end-date:hover {
  /* color: #6aa641;
  border-bottom: 1px solid #6aa641; */
}

.theme-primary .vdatetime-popup__header,
.theme-primary .vdatetime-calendar__month__day--selected > span > span,
.theme-primary .vdatetime-calendar__month__day--selected:hover > span > span {
  /* background: #6aa641; */
}

.theme-primary .vdatetime-year-picker__item--selected,
.theme-primary .vdatetime-time-picker__item--selected,
.theme-primary .vdatetime-popup__actions__button {
  /* color: #6aa641; */
}
.theme-primary .btn__cancel {
  /* color: #b0bec5; */
}
.bin.active:hover {
  /* fill: #9dd974; */
}
.thumb {
  position: relative;
}
.draggable {
  /* position: absolute;
  cursor: ew-resize; */
}
.draggable.left {
  /* bottom: -50px;
  left: -14px; */
}
.draggable.right {
  /* bottom: -50px;
  right: -44px;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1); */
}
.wrapper {
  /* width: 100%;
  background: #444;
  height: 200px;
  position: relative; */
}
.theme--light .wrapper {
  /* background: #fff; */
}
.thumb {
  /* position: absolute;
  height: 100%;
  top: 0;
  margin-left: -30px; */
}
#thumb-right {
  /* margin-left: -15px; */
}
.bin {
  /* fill: #6aa641;
  cursor: pointer; */
}
.label-title {
  /* font-size: 14px;
  color: #888; */
}
.mask {
  /* position: absolute;
  top: 0;
  height: 100%;
  width: 200px;
  background: #00000099; */
}
.theme--light .mask {
  /* background: #00000055; */
}
.dates {
  /* display: flex;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 15px; */
}
.disabled {
  /* cursor: default;
  opacity: 0.8; */
}
</style>
