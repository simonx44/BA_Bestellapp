<template>
  <div class="mt-3 d-flex flex-column align-items-center container">
    <p class="">{{ views[currentView - 1].description }}</p>
    <div class="col-12">
      <Login class="" :userType="userType" v-if="currentView == 1" />
      <SignUp :userType="userType" v-if="currentView == 2" />
      <ResetPassword v-if="currentView == 3" @successfulReset="changeView(1)" />

      <v-divider></v-divider>
      <v-divider></v-divider>
      <div v-for="item in views" :key="item.id">
        <span
          class="option"
          v-if="currentView != item.id"
          @click="changeView(item.id)"
        >
          {{ item.description }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Login from "@/components/forms/Login";
import SignUp from "@/components/forms/SignUp";
import ResetPassword from "@/components/forms/ResetPassword";
export default {
  components: {
    Login,
    SignUp,
    ResetPassword,
  },
  props: ["userType"],
  data() {
    return {
      currentView: 1,
      views: [
        { id: 1, description: "Login" },
        { id: 2, description: "Registieren" },
        { id: 3, description: "Passwort zurücksetzen" },
      ],
    };
  },
  methods: {
    changeView: function (view) {
      this.currentView = view;
    },
  },
};
</script>

<style>
.option {
  color: rgb(121, 119, 96);
  display: inline-block;
  margin-bottom: 10px;
}
.option:hover {
  cursor: pointer;
}
</style>
