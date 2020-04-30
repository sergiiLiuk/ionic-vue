import graphql from '@/imports/graphql'

export default {
  state: {
    assets: []
  },
  mutations: {
    saveAssets(state, assets) {
      state.assets = assets
    }
  },
  getters: {
    getAssetById: state => id => {
      return state.assets.find(asset => asset.id === id)
    },
    assetsWithPosition: state => {
      return state.assets.filter(asset => {
        let location = asset.nanoLink?.lastKnownAssetRecords?.l
        if (!location) return false
        else return true
      })
    },
    assetsAsGeoJson: (state, getters) => {
      let features = getters.assetsWithPosition.map(item => {
        return {
          type: 'feature',
          properties: {
            id: item.id,
            brand: item.brand,
            model: item.model
          },
          geometry: {
            type: 'Point',
            coordinates: [
              item.nanoLink.lastKnownAssetRecords.l.longitude,
              item.nanoLink.lastKnownAssetRecords.l.latitude
            ]
          }
        }
      })

      return {
        features,
        type: 'FeatureCollection'
      }
    }
  },
  actions: {
    async getNewAssetListForReal(context, variables) {
      const res = await graphql(
        `
        query Assets {
          assets_search(
            limit: 2000,
            page: 1,
            token: "${context.rootState.token}"
          ) {
            total
            result {
              categories {
                name
                id
              }
              id
              brand
              model
              serviceStatus
              serviceDue
              serial
              createdDateTime
              version
              description
              keyWords
              assetWatch
              enabledWatches
              disabledWatches
              serviceData {
                ... on QServiceDataPeriodic {
                  servicePlan {
                    name
                  }
                  servicePlanId
                }
                ... on QServiceDataOneshot {
                  servicePlan {
                    name
                  }
                  servicePlanId
                }
              }
              trackers {
                type
                vID
              }
              nanoLink {
                tagType
                createdDateTime
                vID
                isManualTag
                lastKnownAssetRecordsByAny {
                  d
                }
                lastKnownAssetRecords {
                  a
                  d
                  l {
                    latitude
                    longitude
                  }
                }
              }
              documents {
                id
              }
            }
            errors {
              message
            }
            groupVersion
          }
        }
      `,
        variables,
        null,
        'assets'
      )

      let assets = []
      if (res) assets = res.data.assets_search.result
      assets = assets.map(asset => {
        asset.categories = asset.categories ? asset.categories : []
        asset.watches = {
          enabled: asset.enabledWatches,
          disabled: asset.disabledWatches
        }
        asset.documents = asset.documents?.length || 0
        if (asset.trackers.length == 0) asset.trackers = [{ type: 'NONE' }]
        return asset
      })
      context.commit('saveAssets', assets)
    },
    async getAssetsOverview(context, variables) {
      const res = await graphql(
        `
        query AssetsOverview($sort: [PSortKey], $limit: Int!, $page: Int!, $search: String, $categoryIds: [String], $servicePlanIds: [String], $serviceStatus: [Int!]){
          assets_search(
            limit: $limit,
            page: $page,
            sort: $sort,
            search: $search,
            categoryIds: $categoryIds,
            serviceStatus: $serviceStatus,
            servicePlanIds: $servicePlanIds,
            token: "${context.rootState.token}"
          ) {
            total
            result {
              categories {
                name
              }
              id
              brand
              model
              serviceStatus
              serviceDue
              serial
              createdDateTime
              version
              description
              keyWords
              assetWatch
              serviceData {
                ... on QServiceDataPeriodic {
                  id
                }
                ... on QServiceDataOneshot {
                  id
                }
                ... on QServiceDataWarranty {
                  id
                }
              }
              documents {
                id
              }
              nanoLink {
                isManualTag
                id
                vID
                lastKnownAssetRecords {
                  a
                  d
                  l {
                    latitude
                    longitude
                  }
                  device {
                    ... on QMobileDevice {
                      id
                      deviceName
                      reference {
                        ... on QUser {
                          id
                          fullName
                          __typename
                        }
                      }
                      __typename
                    }
                    ... on QGateDevice {
                      id
                      deviceName
                      reference {
                        ... on QLocation {
                          id
                          name
                          __typename
                        }
                        __typename
                      }
                      __typename
                    }
                  }
                }
                lastKnownAssetRecordsByGate {
                  a
                  d
                  l {
                    latitude
                    longitude
                  }
                  device {
                    ... on QGateDevice {
                      deviceName
                      reference {
                        ... on QLocation {
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
                          name
                          id
                        }
                      }
                    }
                  }
                }
                lastKnownAssetRecordsByPerson {
                  d
                  l {
                    latitude
                    longitude
                  }
                  device {
                    ... on QMobileDevice {
                      deviceName
                      lastMobileInfo {
                        phoneManufacturer
                        phoneBrand
                        phoneModel
                      }
                      reference {
                        ... on QUser {
                          id
                          fullName
                          mobileCountryCode
                          mobilePhoneNumber
                          email
                        }
                      }
                    }
                  }
                }
                lastKnownAssetRecordsByManual {
                  d
                  l {
                    latitude
                    longitude
                  }
                  device {
                    ... on QMobileDevice {
                      deviceName
                      lastMobileInfo {
                        phoneManufacturer
                        phoneBrand
                        phoneModel
                      }
                      reference {
                        ... on QUser {
                          id
                          fullName
                          mobileCountryCode
                          mobilePhoneNumber
                          email
                        }
                      }
                    }
                  }
                }
              }
            }
            errors {
              message
            }
            groupVersion
          }
        }
      `,
        variables,
        null,
        'assets'
      )

      if (res) return res.data.assets_search
      else return undefined
    },
    async getAssetsFoundByPerson(context, variables) {
      const res = await graphql(
        `
        query AssetsFoundByPerson($referenceId: ObjectId!){
          links_list_foundby_person(
            timeout: 84600,
            refId: $referenceId,
            token: "${context.rootState.token}"
          ) {
            total
            result {
              ... on QAsset {
                id
                brand
                model      
                nanoLink {       
                  lastKnownAssetRecordsByPerson{
                    d
                    device{
                      ... on QMobileDevice {
                        id
                        deviceName
                        __typename
                      }
                    }
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
        variables
      )
      return res.data.links_list_foundby_person.result
    },
    async getAssetsFoundByLocation(context, variables) {
      const res = await graphql(
        `
        query AssetsFoundByLocation($referenceId: ObjectId!){
          links_list_foundby_location(
            timeout: 84600,
            refId: $referenceId,
            token: "${context.rootState.token}"
          ) {
            total
            result {
              ... on QAsset {
                id
                brand
                model
                nanoLink {       
                  lastKnownAssetRecordsByGate{
                    d
                    device{
                      ... on QGateDevice {
                        id
                        deviceName
                        __typename
                      }
                    }
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
        variables
      )
      let assetsWithProps = res.data.links_list_foundby_location.result.filter(
        asset => Object.keys(asset).length > 0
      )
      return assetsWithProps
    },
    async getAssetsFoundByAsset(context, variables) {
      const res = await graphql(
        `
        query AssetsFoundByAsset($referenceId: ObjectId!){
          links_list_foundby_asset(
            timeout: 84600,
            refId: $referenceId,
            token: "${context.rootState.token}"
          ) {
            total
            result {
              ... on QAsset {
                id
                brand
                model
                trackers{
                  model
                  state {
                    ... on QTrackerStateLegacy {                    
                      lastKnownAssetRecordsByAsset {
                        d
                        device {
                          ... on QGPSGateDevice {
                              deviceName
                              reference {
                                ... on QAsset {
                                    id
                                    brand
                                    model
                                    __typename
                                }
                              }
                          }
                        }
                      }
                    }
                  }
                  type
                  vID
                }
                nanoLink {       
                  lastKnownAssetRecordsByAsset{
                    d
                    device{
                      ... on QGPSGateDevice {
                        id
                        deviceName
                        __typename
                      }
                    }
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
        variables
      )
      return res.data.links_list_foundby_asset.result
    },
    async getAsset(context, variables) {
      const res = await graphql(
        `
        query Asset($id: ObjectId!){
          assets_get(id: $id, token: "${context.rootState.token}") {
            result {
              id
              brand
              model
              serial
              keyWords
              description
              version
              assetWatch
              createdDateTime
              image {
                dataBase64
                contentType
              }
              jobs {
                ... on QJobAssetFound {
                  id
                  version
                  disabled
                  groups {
                    groupName
                  }
                  references {
                    ... on QUser {
                      fullName
                    }
                  }
                }
              }
              categories {
                id
                name
              }
              trackers{
                model
                state {
                  ... on QTrackerStateLegacy {  
                    lastKnownAssetRecords {
                      d
                    }                 
                    lastKnownAssetRecordsByAsset {
                      d
                      device {
                        ... on QGPSGateDevice {
                            deviceName
                            reference {
                              ... on QAsset {
                                  id
                                  brand
                                  model
                                  __typename
                              }
                            }
                        }
                      }
                    }
                      lastKnownAssetRecordsByGate {
                        d
                        device {
                          ... on QGateDevice {
                              deviceName
                              reference {
                                ... on QLocation {
                                    id
                                    name
                                    __typename
                                }
                              }
                          }
                        }
                      }
                      lastKnownAssetRecordsByPerson {
                        d
                        device {
                          ... on QMobileDevice {
                              deviceName
                              reference {
                                ... on QUser {
                                    id
                                    fullName
                                    __typename
                                }
                              }
                          }
                        }
                      }
                  }
                }
                type
                vID
              }
              nanoLink {
                vID
                id
                isManualTag
                tagType
                lastKnownAssetRecordsByAny {
                  l {
                    latitude
                    longitude
                  }
                  d
                  r
                }
                lastKnownAssetRecords {
                  d
                  p
                  device {
                    ... on QMobileDevice {
                      id
                      deviceName
                      reference {
                        ... on QUser {
                          id
                          fullName
                          __typename
                        }
                      }
                      __typename
                    }
                    ... on QGateDevice {
                      id
                      deviceName
                      reference {
                        ... on QLocation {
                          id
                          name
                          __typename
                        }
                        __typename
                      }
                      __typename
                    }
                  }
                  a
                  r
                  l {
                    latitude
                    longitude
                  }
                }
                lastKnownAssetRecordsByManual {
                  d
                  device {
                    ... on QMobileDevice {
                      __typename
                      reference {
                        ... on QUser {
                          __typename
                          id
                          fullName
                        }
                      }
                    }
                  }
                }
                lastKnownAssetRecordsByAsset{
                  d
                  device{
                    ... on QGPSGateDevice { 
                      __typename                     
                      deviceName
                      reference {
                        ... on QAsset {
                          id
                          brand
                          model
                          __typename
                        }
                      }
                    }                   
                  }
                }
                lastKnownAssetRecordsByGate {
                  d
                  device {
                    ... on QGateDevice {
                      __typename
                      deviceName
                      reference {
                        ... on QLocation {
                          __typename
                          id
                          name
                        }
                      }
                    }
                  }
                }
                lastKnownAssetRecordsByPerson {
                  d
                  device {
                    ... on QMobileDevice {
                      id
                      deviceName
                      reference {
                        ... on QUser {
                          id
                          fullName
                          __typename
                        }
                      }
                      __typename
                    }
                  }
                }
              }
              documents {
                name
                url
                id
                name
                mimeType
                createdDate
              }
              serviceDue
              serviceData {
                ... on QServiceDataPeriodic {
                  serviceWasPerformed
                  id
                  lastLog {
                    eventCode
                  }
                  servicePlanId
                  servicePlan {
                    name
                    description
                  }
                  lastServiceDate
                  period
                  intervalType
                  dueSlackInDays
                  servicePlanId
                  startDate
                  due
                }
                ... on QServiceDataOneshot {
                  serviceWasPerformed
                  id
                  lastLog {
                    eventCode
                  }
                  servicePlanId
                  servicePlan {
                    name
                    description
                  }
                  dueSlackInDays
                  servicePlanId
                  due
                }
                ... on QServiceDataWarranty {
                  serviceWasPerformed
                  id
                  lastLog {
                    eventCode
                  }
                  servicePlanId
                  servicePlan {
                    name
                    description
                  }
                  dueSlackInDays
                  purchaseDate
                  due
                  warrantyInMonths
                  servicePlanId
                }
                __typename
              }
            }
          }
        }
      `,
        variables
      )

      let asset = res.data.assets_get.result
      asset.jobs = asset.jobs.map(job => {
        job.enabled = !job.disabled
        return job
      })
      return res.data.assets_get.result
    },
    async getAssetsMap(context, variables) {
      const res = await graphql(
        `
        query Assets($maxDistance: Float, $latitude: Float!, $longitude: Float!, $sort: [PSortKey], $limit: Int!, $page: Int!, $search: String, $categoryIds: [String]){
          assets_searchgeo(
            latitude: $latitude,
            longitude: $longitude,
            maxDistance: $maxDistance,
            limit: $limit,
            page: $page,
            sort: $sort,
            search: $search,
            categoryIds: $categoryIds,
            token: "${context.rootState.token}"
          ) {
            total
            result {
              categories {
                name
              }
              id
              brand
              model
              serviceStatus
              serviceDue
              serial
              createdDateTime
              distance
              nanoLink {
                lastKnownAssetRecords {
                  a
                }
              }
            }
            errors {
              message
            }
            groupVersion
          }
        }
      `,
        variables
      )

      return res.data.assets_searchgeo
    },
    async getAssetsLocations(context, variables) {
      const res = await graphql(
        `
        query Assets($maxDistance: Float, $latitude: Float!, $longitude: Float!, $sort: [PSortKey], $limit: Int!, $page: Int!, $search: String, $categoryIds: [String]){
          assets_searchgeo(
            latitude: $latitude,
            longitude: $longitude,
            maxDistance: $maxDistance,
            limit: $limit,
            page: $page,
            sort: $sort,
            search: $search,
            categoryIds: $categoryIds,
            token: "${context.rootState.token}"
          ) {
            total
            result {
              id
              nanoLink {
                lastKnownAssetRecords {
                  l {
                    longitude
                    latitude
                  }
                }
              }
            }
            errors {
              message
            }
            groupVersion
          }
        }
      `,
        variables
      )

      return res.data.assets_searchgeo
    },
    async getAssetsBox(context, variables) {
      const res = await graphql(
        `
        query Assets($box: PGeoPositionBox, $maxDistance: Float, $latitude: Float!, $longitude: Float!, $sort: [PSortKey], $limit: Int!, $page: Int!, $search: String, $categoryIds: [String]){
          assets_searchgeo(
            box: $box,
            latitude: $latitude,
            longitude: $longitude,
            maxDistance: $maxDistance,
            limit: $limit,
            page: $page,
            sort: $sort,
            search: $search,
            categoryIds: $categoryIds,
            token: "${context.rootState.token}"
          ) {
            total
            result {
              categories {
                name
              }
              id
              brand
              model
              serviceStatus
              serviceDue
              serial
              createdDateTime
              distance
              nanoLink {
                lastKnownAssetRecords {
                  a
                }
              }
            }
            errors {
              message
            }
            groupVersion
          }
        }
      `,
        variables
      )

      return res.data.assets_searchgeo
    },
    async getAssetsGeo(context, variables) {
      const res = await graphql(
        `
        query Assets($maxDistance: Float, $latitude: Float!, $longitude: Float!, $sort: [PSortKey], $limit: Int!, $page: Int!, $search: String, $categoryIds: [String]){
          assets_searchgeo(
            latitude: $latitude,
            longitude: $longitude,
            maxDistance: $maxDistance,
            limit: $limit,
            page: $page,
            sort: $sort,
            search: $search,
            categoryIds: $categoryIds,
            token: "${context.rootState.token}"
          ) {
            total
            result {
              id
              nanoLink {
                lastKnownAssetRecords {
                  l {
                    longitude
                    latitude
                  }
                }
              }
            }
            errors {
              message
            }
            groupVersion
          }
        }
      `,
        variables
      )

      let foo = res.data.assets_searchgeo
      if (!foo.result) foo.result = []
      let geostuff = foo.result.map(item => {
        return {
          type: 'feature',
          properties: {
            id: item.id
          },
          geometry: {
            type: 'Point',
            coordinates: [
              item.nanoLink.lastKnownAssetRecords.l.longitude,
              item.nanoLink.lastKnownAssetRecords.l.latitude
            ]
          }
        }
      })

      let omfg = {
        features: geostuff,
        type: 'FeatureCollection'
      }

      return omfg
    },
    async saveAsset(context, params) {
      const res = await graphql(
        `
        mutation {
          assets_savetoolasset(
            update: ${params.doc},
            token: "${context.rootState.token}"
          ) {
            result {
              id
              version
              documents {
                name
                url
                id
              }
            }
            errors {
              message
              stackTrace
            }
          }
        }
      `,
        {},
        params.progress
      )

      return res.data.assets_savetoolasset.result
    },
    async deleteAsset(context, params) {
      const res = await graphql(`
        mutation {
          assets_deleteasset(
            id: "${params.id}",
            version: ${params.version}
            token: "${context.rootState.token}"
          ) {
            groupVersion
            result
            errors {
              message
            }
          }
        }
      `)

      return res.data.assets_deleteasset.result
    },
    async setWatch(context, params) {
      const res = await graphql(`
        mutation {
          assets_setwatch(
            assetId: "${params.assetId}",
            watch: ${params.watch}
            token: "${context.rootState.token}"
          ) {
            groupVersion
            result {
              id
            }
            errors {
              message
            }
          }
        }
      `)

      return res.data.assets_setwatch.result
    }
  }
}
