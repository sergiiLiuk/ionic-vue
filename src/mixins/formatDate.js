import moment from "moment";

export default {
  methods: {
    subtractTime(time, subtractValue) {
      return (
        moment(time).format() >
        moment()
          .subtract(subtractValue, "minutes")
          .format()
      );
    },
    formatDate(date) {
      if (!date) return "";
      return moment(date)
        .locale(this.$store.state.lang)
        .format("lll");
    },
    formatDateFromNow(date) {
      if (!date) return "";

      let before = moment(date);
      let now = moment();
      let difference = moment.duration(now.diff(before));
      return (
        Math.ceil(difference.asMonths()) +
        " " +
        this.langKey("frontend.common.months")
      );
    },
    formatLongDateFromNow(date) {
      if (!date) return "";

      return moment(date)
        .locale(this.$store.state.lang)
        .fromNow();
    },
    formatDay(date) {
      if (!date) return "";
      return moment(date)
        .locale(this.$store.state.lang)
        .format("ll");
    },
  },
};
