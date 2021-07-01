<template>
  <div class="">
    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab v-for="item in items" :key="item.id">
        {{ item.text }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item.id">
        <AuthOptions :userType="tab + 1" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import AuthOptions from "@/components/forms/AuthOptions";
export default {
  components: {
    AuthOptions,
  },

  data() {
    return {
      tab: 0,
      items: [
        { id: 1, text: "Als Kunde anmelden" },
        { id: 2, text: "Als Restautant anmelden" },
      ],
    };
  },
};
</script>

<style>
.auth {
  max-width: 100%;
  margin: 0 auto;
}
</style>
