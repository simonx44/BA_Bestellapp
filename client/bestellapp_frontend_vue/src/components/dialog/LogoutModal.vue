<template>
  <v-dialog v-model="isOpen" max-width="50%" heigth="90%">
    <v-card
      ><v-card-title class="headline grey lighten-2"> Abmelden </v-card-title>

      <v-card-text> Wirklich abmelden? </v-card-text>
      <TheButton text="Abbrechen" @click="closeModal" />
      <TheButton link="/" text="Logout" @click="signOut" />
    </v-card>
  </v-dialog>
</template>

<script>
import { Auth } from "aws-amplify";
import TheButton from "@/components/dialog/TheButton.vue";
export default {
  components: {
    TheButton,
  },
  props: ["isOpen"],
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    signOut: async function () {
      this.$emit("closeModal");
      try {
        await Auth.signOut();
        this.$store.commit("setCurrentUser", undefined);
      } catch (error) {
        console.log("error signing out: ", error);
      }
    },
  },
  mounted() {},
};
</script>

<style></style>
