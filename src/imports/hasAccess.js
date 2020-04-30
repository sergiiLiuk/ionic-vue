import store from "@/store";

export default function(key, group) {
  if (store.getters.userType === "superadmin") return true;
  if (group && group !== store.getters.userType) {
    return false;
  } else return store.state.access[key];
}
