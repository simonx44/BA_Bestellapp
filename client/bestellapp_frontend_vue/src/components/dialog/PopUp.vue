<template>
  <div class="text-center mt-3">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ma-2"
          outlined
          color="black"
          :style="`width: ${width}`"
          v-bind="attrs"
          v-on="on"
        >
          {{ title }}
        </v-btn>
      </template>

      <v-card
        ><v-card-title class="headline grey lighten-2">
          {{ title }}
        </v-card-title>

        <v-divider></v-divider>
        <slot> </slot>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <TheButton text="Schließen" @click="dialog = false" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TheButton from "@/components/dialog/TheButton.vue";
export default {
  props: ["title", "width", "type"],
  components: { TheButton },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    addToChart: function () {},
  },
};
</script>

<style></style>
