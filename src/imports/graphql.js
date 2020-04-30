import axios from "axios";
import store from "@/store/index";

let callers = {};

export default async function(query, variables, progress, caller, endpoint) {
  // If a caller is specified, save the cancel token so same callers cancel the older one
  if (caller) {
    if (callers[caller]) {
      callers[caller].cancel();
    }
    callers[caller] = axios.CancelToken.source();
  }

  try {
    const res = await axios.post(
      endpoint || store.state.server + "/api/frontend",
      {
        query,
        variables,
      },
      {
        onUploadProgress: progress,
        cancelToken: caller ? callers[caller].token : null,
      }
    );

    let reply;
    let errors;

    if (res.data.Errors) {
      errors = res.data.Errors;
    } else {
      for (let prop in res.data.data) {
        reply = res.data.data[prop];
        errors = res.data.data[prop].errors;
      }
    }

    if (errors) {
      let unauthorized = errors.find((obj) => {
        return obj.message === "Unauthorized";
      });
      if (unauthorized) {
        store.dispatch("logout");
      } else {
        store.dispatch("notify", {
          message: errors[0].message,
          color: "error",
        });

        return "error";
      }
    } else if (store.getters.userType !== "superadmin")
      store.dispatch("setGroupVersion", reply.groupVersion);

    return res.data;
  } catch (e) {
    // if (axios.isCancel(e))
  }
}
