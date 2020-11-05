import axios from "axios";

//Return preconfigured axios instance for req from client/server
export default ({ req }) => {
  if (typeof window === "undefined") {
    console.log("From Server");
    return axios.create({
      baseURL: "http://ingress-nginx-controller.kube-system.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    console.log("From Client")
    return axios;
  }
};
