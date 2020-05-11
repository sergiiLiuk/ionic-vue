import graphql from "@/imports/graphql";

export default {
  state: {
    groups: [],
  },
  mutations: {
    saveGroups(state, groups) {
      state.groups = groups;
    },
  },
  actions: {
    async getGroups(context) {
      let res = await graphql(`{
        usergroups_list(token: "${context.rootState.token}") {
          version
          result {
            id
            parentId
            name
            level
          }
        }
      }`);

      return res.data.usergroups_list;
    },
    async getGroupsForReal(context) {
      let res = await graphql(`{
        usergroups_list(token: "${context.rootState.token}") {
          version
          result {
            id
            parentId
            name
            level
          }
        }
      }`);

      let groups = [];
      if (res) groups = res.data.usergroups_list.result;
      context.commit("saveGroups", groups);
    },
    async createGroup(context, params) {
      let res = await graphql(
        `
        mutation CreateGroup($id: ObjectId, $parentId: ObjectId, $name: String, $version: Int!){
          usergroups_save(
            update: {
              id: $id,
              parentId: $parentId,
              name: $name
            },
            version: $version,
            token: "${context.rootState.token}"
          ) {
            version
            groupVersion
          }
        }
      `,
        params
      );

      return res.data.usergroups_save.version;
    },
    async deleteGroup(context, params) {
      let res = await graphql(
        `
        mutation DeleteGroup($id: ObjectId!, $version: Int!){
          usergroups_delete(
            id: $id,
            version: $version,
            token: "${context.rootState.token}"
          ) {
            errors {
              message
            }
            version
            groupVersion
          }
        }
      `,
        params
      );

      return res.data.usergroups_delete.version;
    },
  },
};
