<template>
  <v-app id="inspire">
    <div
      class="d-flex justify-content-center justify-content-end"
      style="max-height: 100%"
      v-if="isLoading"
    >
      <v-progress-circular
        :size="100"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
    <div v-else>
      <div v-if="isUserLogedIn">
        <CustomerApplication v-if="isUserCustomer" />
        <RestaurantApplication v-else />
      </div>

      <AuthView v-else />
    </div>
  </v-app>
</template>

<script>
import AuthView from "@/views/AuthView";
import CustomerApplication from "@/application/CustomerApplication";
import RestaurantApplication from "@/application/RestaurantApplication";
import { Auth } from "aws-amplify";

export default {
  components: {
    AuthView,
    CustomerApplication,
    RestaurantApplication,
  },
  data: () => ({
    isLoading: false,
  }),
  computed: {
    isUserLogedIn: function () {
      const user = this.$store.getters.getCurrentUser;
      return user;
    },
    isUserCustomer: function () {
      const user = this.$store.getters.getCurrentUser;
      return user.isCustomer;
    },
  },
  methods: {
    // In Cookie nach angemeldeten Nutzer suchen
    // Ist dieser vorhanden, wird Nutzer eingeloggt
    getUser: async function () {
      try {
        this.isLoading = true;
        const user = await Auth.currentUserInfo();
        if (Object.keys(user).length > 0) {
          const { attributes } = user;

          const isCustomer = attributes["custom:isCustomer"] === "true";

          this.$store.commit("setCurrentUser", {
            id: attributes.sub,
            email: attributes.email,
            isCustomer: isCustomer,
          });
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      } catch {
        this.$store.commit("setCurrentUser", undefined);
        this.isLoading = false;
      }
    },
  },
  async mounted() {
    this.getUser();
  },
};
</script>
