<template>
  <TheButton text="Abmelden" @click="signOut" />
</template>

<script>
import TheButton from "@/components/dialog/TheButton.vue";
import { Auth } from "aws-amplify";

export default {
  components: {
    TheButton,
  },
  methods: {
    signOut: async function () {
      try {
        await Auth.signOut();
        this.$store.commit("setCurrentUser", undefined);
      } catch (error) {
        console.log("error signing out: ", error);
      }
    },
  },
};
</script>

<style></style>
