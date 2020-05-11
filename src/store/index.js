import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import graphql from "@/imports/graphql";
// import {loginToken, parseServer} from '@/imports/helpers'
import { getField, updateField } from "vuex-map-fields";
// import systemSettings from "@/store/systemsettings";
// import groupSettings from "@/store/groupsettings";
import users from "@/store/users";
// import settings from "@/store/settings";
import assets from "@/store/assets";
import groups from "@/store/groups";
import locations from "@/store/locations";
// import categories from "@/store/categories";
// import dashboard from "@/store/dashboard";
// import service from "@/store/service";
// import warnings from "@/store/warnings";
// import gates from "@/store/gates";
// import reports from "@/store/reports";
// import search from "@/store/search";
// import statistics from "@/store/statistics";
// import documents from "@/store/documents";
// import log from "@/store/log";
// import jobs from "@/store/jobs";
// import trackers from "@/store/trackers";
// import beacons from "@/store/beacons";
import md5 from "md5";
import axios from "axios";

Vue.use(Vuex);

function mapAccessSettings(settings) {
  let s = {};
  settings.map((setting) => {
    // If setting is an access setting, and not a parent setting
    if (setting.id.startsWith("access.")) {
      // Trim the ID of the setting, and set it as the key of the new settings object
      s[setting.id.replace("access.", "")] = JSON.parse(
        setting.value.settingValue
      );
    }
  });

  let devicemap = settings.find((setting) => {
    return setting.id === "configuration.cloud.devicemapview.enable";
  });

  if (devicemap) s.devicemap = JSON.parse(devicemap.value.settingValue);

  return s;
}

const vuexLocalStorage = new VuexPersist({
  key: "vuex",
  storage: window.localStorage,
  reducer: (state) => ({
    token: state.token,
    user: state.user,
    customer: state.customer,
    companyName: state.companyName,
    dark: state.dark,
    lang: state.lang,
    access: state.access,
    server: state.server,
    groupVersion: state.groupVersion,
    cacheKey: state.cacheKey,
    assets: {
      assets: state.assets.assets,
    },
    users: {
      users: state.users.users,
    },
    locations: {
      locations: state.locations.locations,
    },
    // warnings: {
    //   warnings: state.warnings.warnings,
    // },
    // reports: {
    //   reports: state.reports.reports,
    // },
    groups: {
      groups: state.groups.groups,
    },
    // jobs: {
    //   jobs: state.jobs.jobs,
    // },
    // categories: {
    //   categories: state.categories.categories,
    // },
  }),
});

const initialState = () => ({
  token: "",
  showSideBar: false,
  server: null,
  user: null,
  customer: null,
  access: null,
  langAvailable: null,
  langData: null,
  rootLangData: null,
  lang: null,
  dark: false,
  groupVersion: 0,
  companyName: "",
  unsignedDocuments: false,
  cacheKey: null,
  logLimit: 20000,
  notification: {
    message: "",
    show: false,
    color: "primary",
  },
});

export default new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  state: initialState(),
  modules: {
    // systemSettings,
    // settings,
    // groupSettings,
    users,
    assets,
    groups,
    locations,
    // categories,
    // dashboard,
    // service,
    // warnings,
    // gates,
    // reports,
    // search,
    // statistics,
    // documents,
    // log,
    // jobs,
    // trackers,
    // beacons,
  },
  mutations: {
    updateField,
    login(state, params) {
      state.token = params.token;
      state.user = params.user;
      state.customer = params.customer;
      state.companyName = params.companyName;
      state.server = params.server;
      if (params.access) state.access = mapAccessSettings(params.access);
    },
    toggleSideBar(state) {
      state.showSideBar = !state.showSideBar;
    },
    setLangData(state, data) {
      state.langData = data;
    },
    setServer(state, server) {
      state.server = server;
    },
    setUserData(state, userData) {
      state.userData = userData;
    },
    setDefconData(state, defconData) {
      state.defconData = defconData;
    },
    logout(state) {
      const initial = initialState();
      // Removes everything in store except language data
      Object.keys(initial).forEach((key) => {
        if (!["langAvailable", "langData", "lang", "dark"].includes(key))
          state[key] = initial[key];
      });
    },
    setGroupVersion(state, groupVersion) {
      state.groupVersion = groupVersion;
    },
    setAccessSettings(state, settings) {
      state.access = settings;
    },
    saveLogCacheKey(state, key) {
      state.cacheKey = key;
    },
  },
  actions: {
    async getServers() {
      let res = await axios.get(process.env.VUE_APP_SERVER_URL);
      return res.data;
    },
    async loginServer(context, params) {
      let server = params.server;
      let email = params.email;
      let password = params.password;
      let res = await axios.post(server + "/api/frontend", {
        query: `{
            auth_login(pwdcheck: "${md5(email + "|" + password)}") {
              result {
                user {
                  fullName
                  id
                  groupName
                  email
                  mobileCountryCode
                  mobilePhoneNumber
                }
                settings {
                  groupName
                  settings {
                    id
                    name
                    value {
                      settingValue
                    }
                  }
                }
                customer {
                  id
                  companyName
									planId
									locationId
                }
                token
              }
              errors {
                message
              }
            }
          }`,
      });

      let data = res.data.data.auth_login.result;
      if (data) {
        context.commit("login", {
          access: data.settings.settings,
          server: server,
          token: data.token,
          user: data.user,
          customer: data.customer,
        });
      }
    },
    async login(context, creds) {
      let servers = await context.dispatch("getServers");
      let promises = servers.map((server) => {
        return context.dispatch("loginServer", {
          server: server.url,
          email: creds.email,
          password: creds.password,
        });
      });
      await Promise.all(promises);
      if (!context.state.user) {
        context.dispatch("notify", {
          message: context.state.langData.frontend.account.loginfailed,
          color: "error",
        });
        return false;
      }
    },
    async getRootLangData(context) {
      let langUrl =
        process.env.VUE_APP_LANGUAGE_URL +
        "/getlang.ashx?v=" +
        process.env.VUE_APP_BUILDVERSION +
        "&md5=&c=en";
      try {
        let res = await Vue.http.get(langUrl);
        context.state.rootLangData = res.body;
      } catch (e) {
        context.dispatch("notify", {
          message: "Failed to load languages?",
          color: "error",
        });
      }
    },
    async getLangData(context, lang) {
      let langUrl =
        process.env.VUE_APP_LANGUAGE_URL +
        "/getlang.ashx?v=" +
        process.env.VUE_APP_BUILDVERSION +
        "&md5=&c=" +
        lang;
      try {
        let res = await Vue.http.get(langUrl);
        context.state.langData = res.body;
        context.state.lang = lang;

        if (context.state.langData.frontend.account.login === "") {
          context.dispatch("notify", {
            message: "Selected language not supported, falling back to English",
            color: "error",
          });
          context.dispatch("getLangData", "en");
        }
      } catch (e) {
        context.dispatch("notify", {
          message: "Failed to load languages!",
          color: "error",
        });
      }
    },
    async getLanguages(context) {
      try {
        // Contact the language server for available languages
        let res = await axios.get(
          process.env.VUE_APP_LANGUAGE_URL +
            "/" +
            process.env.VUE_APP_BUILDVERSION +
            "/languagelist.json"
        );
        let languages = res.data;

        let lang = "en"; // Default language
        let langPref = context.state.lang || navigator.language.substring(0, 2); // Get preferred language

        // If avaiable languages includes the preferred one, use the preferred language, otherwise keep at default
        // Also map the language object from the server to a more template friendly style
        let langAvailable = languages.map((langObj) => {
          let langCode = Object.keys(langObj)[0];
          if (langCode === langPref) lang = langCode;

          return {
            lang: langCode,
            friendly: langObj[langCode].languagefriendly,
            friendlyen: langObj[langCode].languagefriendlyen,
            text:
              langObj[langCode].languagefriendly +
              " (" +
              langObj[langCode].languagefriendlyen +
              ")",
          };
        });
        // Set the store language to the found one
        context.state.lang = lang;
        context.state.langAvailable = langAvailable;
        // After finding correct language to use, get the language json

        if (lang !== "en") context.dispatch("getRootLangData");
        context.dispatch("getLangData", lang);
      } catch (e) {
        context.dispatch("notify", {
          message: "Error contacting language server",
          color: "error",
        });
      }
    },
    logout(context) {
      // Resets the locally stored data and rerenders
      window.localStorage.clear();
      context.commit("logout");
    },
    async getUserGroups(context) {
      let res = await graphql(`
        {
          usergroups_list(token: "${context.state.token}") {
            result {
              id
              name
              level
              parentId
            }
          }
        }
      `);
      return res.data.usergroups_list.result;
    },
    notify(context, { message, color }) {
      context.state.notification.show = true;
      context.state.notification.message = message;
      context.state.notification.color = color;
    },
    async getMySettings(context) {
      let res = await graphql(`
        {
          usergroups_mysettings(token: "${context.state.token}") {
            result {
              groupName
              settings {
                id
                name
                value {
                  settingValue
                }
              }
            }
          }
        }
      `);
      context.commit(
        "setAccessSettings",
        mapAccessSettings(res.data.usergroups_mysettings.result.settings)
      );
    },
    setGroupVersion(context, groupVersion) {
      if (groupVersion) {
        if (context.state.groupVersion !== groupVersion)
          context.dispatch("getMySettings");
        context.commit("setGroupVersion", groupVersion);
      }
    },
  },
  getters: {
    getField,
    userType: (state) => {
      let token = state.token;
      let chars = token.substring(48, 50);

      let val = parseInt(chars, 16);

      let userType = "";
      if (chars === "00") userType = "user";
      else if (val === 255) userType = "superadmin";
      else if (val & 1) userType = "admin";
      return userType;
    },
  },
});
