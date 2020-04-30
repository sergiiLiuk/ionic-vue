import graphql from "@/imports/graphql";
import stringify from "@/imports/stringify";

function parseLocation(obj) {
  let lat = obj.lat;
  let lon = obj.lon;

  obj.fixedGPSPosition = {
    date: new Date().toISOString(),
    longitude: parseFloat(lon),
    latitude: parseFloat(lat),
    altitude: 0.0,
    speed: 0.0,
    bearing: 0.0,
    accuracy: 0.0,
  };

  delete obj["lat"];
  delete obj["lon"];
}

function unParseLocation(obj) {
  if (obj.fixedGPSPosition) {
    obj.lat = obj.fixedGPSPosition.latitude;
    obj.lon = obj.fixedGPSPosition.longitude;
  }

  delete obj["fixedGPSPosition"];
}

export default {
  state: {
    locations: [],
  },
  mutations: {
    saveLocations(state, locations) {
      state.locations = locations;
    },
  },
  actions: {
    async getLocation(context, { id }) {
      const res = await graphql(`
        {
          references_getlocation(id: "${id}", token: "${context.rootState.token}") {
            result {
              name
              groupName
              devices {
                deviceName
                id
                lastGateInfo {
                  createdDate
                  nanoLinksFound
                }
              }
              address {
                house_number
                road
                city
                country
                village
                state
                county
                postcode
              }
              createdDate
              groupId
              id
              version
              fixedGPSPosition {
                longitude
                latitude
              }
            }
          }
        }
      `);

      unParseLocation(res.data.references_getlocation.result);
      return res.data.references_getlocation.result;
    },
    async getLocations(context, variables) {
      const res = await graphql(
        `
        query Locations {
          references_searchlocation(
            limit: 2000,
            page: 1,
            token: "${context.rootState.token}"
          ) {
            groupVersion
            total
            result {
              id
              name
              createdDate
              version
              groupName
              groupId
              devices {
                id
                deviceName
                lastGateInfo{
                  nanoLinksFound
                  unassignedTrackersFound: allTagsFound
                  assignedTrackersFound: nanoLinksFound
                  lastConnectionDate:createdDate
                  bluetoothMac
                  versionName
                }
              }
              installationTime: createdDateTime
              address {
                house_number
                road
                city
                country
                village
                state
                county
                postcode
              }
              createdDate
              groupId
              id
              version
              fixedGPSPosition {
                longitude
                latitude
              }
            }
          }
        }
      `,
        variables
      );

      let locations = [];
      if (res) locations = res.data.references_searchlocation.result;

      locations = locations.map((location) => {
        location.numGates = location.devices.length;
        return location;
      });

      context.commit("saveLocations", locations);
    },
    async getLocationsOverview(context, variables) {
      const res = await graphql(
        `
        query Locations($search: String, $limit: Int!, $page: Int!, $sort: [PSortKey]){
          references_searchlocation(
            search: $search,
            limit: $limit,
            page: $page,
            sort: $sort,
            token: "${context.rootState.token}"
          ) {
            groupVersion
            total
            result {
              id
              name
              createdDate
              version
              groupName
              fixedGPSPosition {
                latitude
                longitude
              }
              address {
                house_number
                road
                city
                country
                village
                state
                county
                postcode
              }
            }
          }
        }
      `,
        variables,
        null,
        "locations"
      );

      return res.data.references_searchlocation;
    },
    async saveLocation(context, params) {
      delete params["groupName"];
      delete params["fixedGPSPosition"];
      delete params["devices"];
      delete params["createdDate"];
      parseLocation(params);
      const res = await graphql(`
        mutation {
          references_savelocation(update: ${stringify(params)}, token: "${
        context.rootState.token
      }") {
            result {
              id
              version
            }
            errors {
              message
              errorKey
            }
          }
        }
      `);
      return res.data.references_savelocation.result;
    },
    async deleteLocation(context, { id, version }) {
      const res = await graphql(`
        mutation {
          references_deletelocation(id: "${id}", version: ${version}, token: "${context.rootState.token}") {
            result
          }
        }
      `);

      return res.data.references_deletelocation.result;
    },
  },
};
