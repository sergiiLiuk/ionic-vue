import graphql from "@/imports/graphql";
import axios from "axios";

export default {
  actions: {
    async getAssetLog(params) {
      let res = await axios.post(this.state.server + "/api/rest/assetlog", {
        token: this.state.token,
        limit: this.state.logLimit,
        fromDateUTC: params.startDate,
        toDateUTC: params.endDate,
        referenceId: params.assetRefId,
      });
      return res.data.results;
    },
    async getAssetRecordInitBins(context, params) {
      let res = await graphql(
        `
        query GetAssetRecordBins {
          assets_assetrecordlog(
            token: "${context.rootState.token}",
            timeZoneDeltaHours: 1,
            detailLevel: "DETAIL_HOUR"
          ) {
            result {
              count
              timeFromUTC
              timeToUTC
            }
            total
            errors {
              message
            }
          }
        }
      `,
        params
      );

      return res.data.assets_assetrecordlog;
    },
    async getAssetRecordInitBinsByRefId(context, params) {
      let res = await graphql(
        `
        query GetAssetRecordBins ($assetRefId: ObjectId, $detailLevel: String!) {
          assets_assetrecordlog(
            token: "${context.rootState.token}",
            timeZoneDeltaHours: 1,
            referenceId: $assetRefId,
            detailLevel: $detailLevel
          ) {
            result {
              count
              timeFromUTC
              timeToUTC
            }
            total
            errors {
              message
            }
          }
        }
      `,
        params
      );
      return res.data.assets_assetrecordlog;
    },
    // async getAssetRecordInitBinsByVID(context, params) {
    // 	let res = await graphql(`
    //     query GetAssetRecordBins ($assetVid: [String], $detailLevel: String!) {
    //       assets_assetrecordlog(
    //         token: "${context.rootState.token}",
    //         timeZoneDeltaHours: 1,
    //         assetVIDs: $assetVid,
    //         detailLevel: $detailLevel
    //       ) {
    //         result {
    //           count
    //           timeFromUTC
    //           timeToUTC
    //         }
    //         total
    //         errors {
    //           message
    //         }
    //       }
    //     }
    //   `, params)

    // 	return res.data.assets_assetrecordlog
    // },
    async getAssetRecordBins(context, params) {
      let res = await graphql(
        `
        query GetAssetRecordBins($fromDate: DateTime, $toDate: DateTime, $assetVid: [String], $detailLevel: String!) {
          assets_assetrecordlog(
            token: "${context.rootState.token}",
            timeZoneDeltaHours: 1,
            assetVIDs: $assetVid,
            detailLevel: $detailLevel,
            fromDateUTC: $fromDate,
            toDateUTC: $toDate            
          ) {
            result {
              count
              timeFromUTC
              timeToUTC
            }
            total
            errors {
              message
            }
          }
        }
      `,
        params
      );

      return res.data.assets_assetrecordlog.result;
    },
    async getAssetRecords(context, params) {
      let res = await graphql(
        `
        query GetAssetRecords ($limit: Int!, $fromDate: Date, $toDate: Date){
          assets_assetrecords(
            fromDateUTC: $fromDate,
            toDateUTC: $toDate,
            limit: $limit,
            token: "${context.rootState.token}",
            page: 1
          ) {
            result {
              d
              l {
                latitude
                longitude
              }
            }
            total
            errors {
              message
            }
          }
        }
      `,
        params
      );

      return res.data.assets_assetrecords;
    },
  },
};
