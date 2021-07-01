import Vue from "vue";
import App from "./App.vue";
import store from "./store/store";
import router from "./router/router";
import vuetify from "./plugins/vuetify";
import Amplify from "aws-amplify";
import "@aws-amplify/ui-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "./styles/main.scss";

// Zur Nutzung von Bootstrap
Vue.use(BootstrapVue);
// BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: process.env.VUE_APP_REGION,
    userPoolId: process.env.VUE_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.VUE_APP_CLIENT_ID,
    oauth: {
      redirectSignIn: process.env.VUE_APP_URL, // muss nicht vorhanden sein, da Authentifizierung mittels AMPLIFY Bibliotheken implementiert wurde
      redirectSignOut: process.env.VUE_APP_URL,
      responseType: "code",
    },
  },
});

new Vue({
  store,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
