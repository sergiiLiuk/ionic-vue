export default {
  methods: {
    presentAlert(header, message, buttons) {
      return this.$ionic.alertController
        .create({
          header: header,
          message: message,
          buttons: [buttons[0]],
        })
        .then((a) => a.present());
    },
  },
};
