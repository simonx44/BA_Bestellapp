import axios from "axios";
import { Auth } from "aws-amplify";

class HttpService {
  constructor() {
    this.BASE_URL = process.env.VUE_APP_API_ROOT;
  }
  getUserToken = () => {
    return new Promise((resolve, reject) => {
      Auth.currentSession()
        .then((res) => {
          if (res) {
            let idToken = res.getIdToken();

            let jwt = idToken.getJwtToken();
            resolve({ error: null, token: jwt });
          }
        })
        .catch((error) => {
          reject({ error: error, token: null });
        });
    });
  };

  get = (url) => {
    return new Promise((resolve, reject) => {
      this.getUserToken().then((data) => {
        const { error, token } = data;
        if (error) {
          this.$store.commit("setCurrentUser", undefined);
          reject(error);
        } else {
          axios
            .get(this.BASE_URL + url, {
              headers: {
                Authorization: "Bearer " + token,
              },
            })
            .then((response) => {
              if (response.status === 200) {
                resolve(response.data);
              } else {
                throw new Error("Error");
              }
            })
            .catch((err) => {
              throw new Error("Error", err);
            });
        }
      });
    });
  };

  /*   put = (url, payload) => {}; */

  put = (url, payload) => {
    return new Promise((resolve, reject) => {
      this.getUserToken().then((data) => {
        const { error, token } = data;
        if (error) {
          this.$store.commit("setCurrentUser", undefined);
          reject(error);
        } else {
          axios
            .put(this.BASE_URL + url, payload, {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              if (response.status === 200) {
                resolve(response.data);
              } else {
                throw new Error("Error");
              }
            })
            .catch((err) => {
              reject(err);
            });
        }
      });
    });
  };

  post = (url, payload) => {
    return new Promise((resolve, reject) => {
      this.getUserToken().then((data) => {
        const { error, token } = data;
        if (error) {
          this.$store.commit("setCurrentUser", undefined);
          reject(error);
        } else {
          axios
            .post(this.BASE_URL + url, payload, {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              if (response.status === 200) {
                resolve(response.data);
              } else {
                throw new Error("Error");
              }
            })
            .catch((err) => {
              // Session id nicht mehr gültig
              reject(err);
            });
        }
      });
    });
  };
  delete = (url) => {
    return new Promise((resolve, reject) => {
      this.getUserToken().then((data) => {
        const { error, token } = data;
        if (error) {
          this.$store.commit("setCurrentUser", undefined);
          reject(error);
        } else {
          axios
            .delete(this.BASE_URL + url, {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              if (response.status === 200) {
                resolve(response.data);
              } else {
                throw new Error("Error");
              }
            })
            .catch((err) => {
              reject(err);
            });
        }
      });
    });
  };
  uploadFileToS3 = () => {
    /*   axios
  .put(url, file,{
    headers: {
      Authorization: "Bearer " + token,
      'Content-Type': 'application/json',
    },
  })
  .then((response) => {
    if (response.status === 200) {
      resolve(response.data);
    } else {
      throw new Error("Error");
    }
  })
  .catch((err) => {

    // Session id nicht mehr gültig
    reject(err);
  });
 */
  };
}

const HTTP_SERVICE_INSTANCE = new HttpService();

export { HTTP_SERVICE_INSTANCE };
