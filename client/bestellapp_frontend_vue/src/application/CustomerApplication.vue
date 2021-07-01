<template>
  <div>
    <v-app-bar app color="white" flat class="hidden-sm-and-down">
      <v-tabs centered class="ml-n9" color="grey darken-1">
        <v-tab v-for="link in links" link :to="link.href" :key="link.title">
          {{ link.title }}
        </v-tab>
        <v-tab @click="logoutRequest = true"> Abmelden </v-tab>
      </v-tabs>
    </v-app-bar>

    <v-app-bar app color="white" flat class="hidden-md-and-up">
      <v-tabs centered class="ml-n9 tabs1212" color="grey darken-1">
        <v-tab v-for="link in links" link :to="link.href" :key="link.title">
          {{ link.title }}
        </v-tab>
        <v-tab link to="/cart"> Warenkorb </v-tab>
        <v-tab @click="logoutRequest = true"> Abmelden </v-tab>
      </v-tabs>
    </v-app-bar>

    <ShoppingCartNav />
    <LogoutModal :isOpen="logoutRequest" @closeModal="logoutRequest = false" />
    <v-content :class="$style.mainContent">
      <v-container class="px-4 py-0 fill-height container" fluid>
        <v-row class="fill-height">
          <v-col>
            <transition name="fade">
              <router-view></router-view>
            </transition>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
//import Logout from "@/components/forms/Logout";
import ShoppingCartNav from "@/components/shoppingCart/ShoppingCartNav";
import LogoutModal from "@/components/dialog/LogoutModal";
export default {
  components: {
    //  Logout,
    ShoppingCartNav,
    LogoutModal,
  },

  data: () => ({
    logoutRequest: false,
    links: [
      {
        title: "Restaurants",
        href: "/",
      },
      {
        title: "Bestellübersicht",
        href: "/orders",
      },
      {
        title: "Kundenprofil",
        href: "/customerprofil",
      },
    ],
    isLoading: false,
  }),
};
</script>

<style module lang="scss">
.mainContent {
  background: #e2dedd;
  min-height: 100vh;
  overflow: hidden;
  width: 100%;
}
.container {
  max-width: 100% !important;
  width: 100% !important;
}
</style>
