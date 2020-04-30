import graphql from "@/imports/graphql";
import stringify from "@/imports/stringify";
import axios from "axios";
import router from "@/router";

export default {
  state: {
    users: [],
  },
  mutations: {
    saveUsers(state, users) {
      state.users = users;
    },
  },
  actions: {
    async getUsers(context, variables) {
      const res = await graphql(
        `
        query GetUsers {
          references_searchuser(
            limit: 2000,
            page: 1,
            token: "${context.rootState.token}"
          ){
            total
            result {
              id
              fullName
              groupName
              groupId
              email
              mobilePhoneNumber
              firstName
              middleName
              lastName
              createdDateTime
              version
              mobileCountryCode
              devices {
                id
                deviceName
                lastMobileInfo {
                  bluetoothEnabled
                  gpsEnabled
                  assignedTrackersFound: nanoLinksFound
                  lastConnectionDate: createdDate
                  phoneBrand
                  phoneManufacturer
                  versionName
                  phoneReleaseVersion
                }
              }
            }
            errors {
              errorKey
              message
            }
          }
        }
      `,
        variables
      );

      let users = res.data.references_searchuser.result;
      users = users.map((user) => {
        user.numDevices = user.devices.length;
        return user;
      });

      context.commit("saveUsers", users);
    },
    async getUsersOverview(context, variables) {
      const res = await graphql(
        `
        query GetUsers ($search: String, $limit: Int!, $page: Int!, $sort: [PSortKey], $groupIds: [String]) {
          references_searchuser(
            search: $search,
            limit: $limit,
            page: $page,
            sort: $sort,
            token: "${context.rootState.token}",
            groupIds: $groupIds
          ){
            total
            result {
              id
              fullName
              groupName
              email
              mobilePhoneNumber
              firstName
              middleName
              lastName
              createdDateTime
              version
              mobileCountryCode
              nanoLink {
                lastKnownAssetRecords {
                  l {
                    latitude
                    longitude
                  }
                }
              }
            }
            errors {
              message
            }
          }
        }
      `,
        variables,
        null,
        "users"
      );

      return res.data.references_searchuser;
    },
    async saveUser(context, { params, sendVerificationEmail, sendWelcomeSMS }) {
      delete params["devices"];
      delete params["fullName"];
      delete params["groupName"];
      const res = await graphql(`
        mutation {
          references_saveuser(update: ${stringify(params)}, token: "${
        context.rootState.token
      }", sendVerificationEmail: ${sendVerificationEmail}, sendWelcomeSMS: ${sendWelcomeSMS}) {
            result {
              version
              id
            }
            errors {
              message
              errorKey
            }
          }
        }
      `);

      return res.data.references_saveuser;
    },
    async createFirstUser(context, variables) {
      const res = await graphql(
        `
          mutation CreateFirstUser(
            $pwdCheck: String
            $mobilePhoneNumber: String
            $mobileCountryCode: String
            $firstName: String
            $middleName: String
            $lastName: String
            $email: String
            $token: String!
            $adminGroup: ObjectId!
          ) {
            references_saveuser(
              update: {
                mobilePhoneNumber: $mobilePhoneNumber
                mobileCountryCode: $mobileCountryCode
                firstName: $firstName
                middleName: $middleName
                lastName: $lastName
                email: $email
                groupId: $adminGroup
              }
              token: $token
              pwdCheck: $pwdCheck
            ) {
              result {
                version
                id
              }
              errors {
                message
                errorKey
              }
            }
          }
        `,
        variables,
        null,
        null,
        variables.server
      );

      return res.data.references_saveuser;
    },
    async verifyUserServer(context, params) {
      let server = params.server;
      let password = params.password;
      let token = params.token;

      try {
        const res = await axios.post(server + "/api/tempaccess", {
          query: `
            mutation {
              tempAccess_setpassword(password: "${password}", token: "${token}") {
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
                  stackTrace
                }
              }
            }
          `,
        });

        let data = res.data.data.tempAccess_setpassword.result;
        if (data) {
          context.commit("login", {
            access: data.settings.settings,
            token: data.token,
            server: server,
            user: data.user,
            customer: data.customer,
          });
          router.push({ name: "Dashboard" });
        }
      } catch (e) {}
    },
    async verifyUser(context, { password, token }) {
      let servers = await context.dispatch("getServers");

      let promises = servers.map((server) => {
        return context.dispatch("verifyUserServer", {
          server: server.url,
          password: password,
          token: token,
        });
      });
      await Promise.all(promises);

      if (!context.rootState.user) {
        context.dispatch("notify", {
          message: "Invalid token, verification failed.",
          color: "error",
        });
        return false;
      }
    },
    async getUser(context, { id }) {
      const res = await graphql(`
        {
          references_getuser(id: "${id}", token: "${context.rootState.token}") {
            result {
              id
              middleName
              groupId
              email
              mobileCountryCode
              mobilePhoneNumber
              firstName
              lastName
              version
              fullName
              groupName
              devices {
                lastMobileInfo {
                  phoneManufacturer
                  phoneBrand
                  phoneModel
                  createdDate
                  gpsEnabled
                  localDeviceTime
                    lastKnownLocation {
                      date
                    longitude
                      latitude
                      accuracy
                    }
                  location {
                    longitude
                    latitude
                    accuracy
                    date
                  }
                }
                code
                deviceName
                id
              }
            }
            errors {
              message
            }
          }
        }
      `);

      return res.data.references_getuser.result;
    },
    async deleteUser(context, { id, version }) {
      const res = await graphql(`
        mutation {
          references_deleteuser(id: "${id}", version: ${version}, token: "${context.rootState.token}") {
            result
          }
        }
      `);

      return res.data.references_deleteuser.result;
    },
    async resetPassword(context, variables) {
      const res = await graphql(
        `
        mutation ResetPassword($userId: ObjectId!, $lang: String!) {
          references_passwordreset(userId: $userId, token: "${context.rootState.token}", lang: $lang) {
            result
          }
        }
      `,
        variables
      );

      return res.data.references_passwordreset.result;
    },
    async forgotPassword(context, variables) {
      const res = await graphql(
        `
          query ForgotPassword($userToken: String, $lang: String) {
            auth_passwordreset(usertoken: $userToken, lang: $lang) {
              result
            }
          }
        `,
        variables,
        null,
        null,
        variables.server
      );

      return res.data.auth_passwordreset.result;
    },
    async getResetUrl(context, variables) {
      const res = await graphql(
        `
        mutation GetResetUrl($userId: ObjectId!) {
          references_passwordreseturl(userId: $userId, token: "${context.rootState.token}") {
            result
          }
        }
      `,
        variables
      );

      return res.data.references_passwordreseturl.result;
    },
    async resetPasswordLoginServer(context, variables) {
      try {
        const res = await axios.post(variables.server + "/api/frontend", {
          query: `
          query ResetPasswordLogin($email: String!) {
            auth_forgottenpassword(email: $email) {
              result
            }
          }`,
          variables,
        });

        let data = res.data.data.auth_forgottenpassword.result;

        if (data) {
          return data.map((token) => {
            return {
              token: token,
              server: variables.server,
            };
          });
        } else return undefined;
      } catch (e) {}
    },
    async resetPasswordLogin(context, variables) {
      let servers = await context.dispatch("getServers");
      let promises = servers.map((server) => {
        return context.dispatch("resetPasswordLoginServer", {
          server: server.url,
          email: variables.email,
        });
      });
      let res = await Promise.all(promises);
      return res;
    },
    async resendSMS(context, variables) {
      const res = await graphql(
        `
        mutation ResendSMS($userId: ObjectId!, $lang: String!) {
          references_welcomesms(userId: $userId, token: "${context.rootState.token}", lang: $lang) {
            result
          }
        }
      `,
        variables
      );

      return res.data.references_welcomesms.result;
    },
    async getReferencesByAsset(context, variables) {
      const res = await graphql(
        `
        query ReferencesByAsset($assetId: ObjectId!){
          assets_assetfoundby(
            id: $assetId,
            token: "${context.rootState.token}"
          ) {
            total
            result {
              latestFound
              position {
                latitude
                longitude
              }
              assetRecord {
                a
                r
              }
              detector {
                ... on QGateDevice {
                  id
                  deviceName
                  reference {
                    ... on QLocation {
                      id
                      name
                      __typename
                    }
                  }
                  __typename
                }
                ... on QMobileDevice {
                  id
                  deviceName
                  reference {
                    ... on QUser {
                      id
                      name:fullName
                      __typename
                    }
                  }
                  __typename            
                }
                ... on QGPSGateDevice {
                  id          
                  deviceName       
                  reference {
                    ... on QAsset {
                      id
                      name:brand
                      __typename
                    }
                  }
                  __typename   
                }
                ... on QTrackerDevice {
                  id          
                  deviceName       
                  reference {
                    ... on QAsset {
                      id
                      name:brand
                      __typename
                    }
                  }
                  __typename   
                }
              }
            }
            groupVersion
            errors {
              message
            }
          }
        }
      `,
        variables
      );

      return res.data.assets_assetfoundby.result;
    },
  },
};
