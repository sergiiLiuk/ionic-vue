import axios from "axios";

export default {
  methods: {
    getCountries() {
      return axios
        .get("https://language.nanolink.com/countrycodes.json")
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getPhoneCodes() {
      let countries = await this.getCountries();
      return countries.map((elem) => {
        return elem.dial_code;
      });
    },
  },
};
