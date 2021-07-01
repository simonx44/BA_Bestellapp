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
          In den Warenkorb
        </v-btn>
      </template>

      <v-card
        ><v-card-title class="headline grey lighten-2">
          {{ title }}
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text class="d-flex flex-column justify-content-center">
          <span>Artikel: {{ title }}</span>
          <v-select
            v-model="amount"
            :items="[1, 2, 3, 4, 5]"
            label="Anzahl"
            outlined
          ></v-select>
          <v-textarea label="Extrawünsche" v-model="note"> </v-textarea>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <TheButton text="In den Warenkorb" @click="addToChart" />
          <TheButton text="Schließen" @click="close" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TheButton from "@/components/dialog/TheButton.vue";
export default {
  props: ["title", "width"],
  components: { TheButton },
  data() {
    return {
      note: "",
      amount: 1,
      dialog: false,
    };
  },
  methods: {
    addToChart: function () {
      this.$emit("addToCart", { amount: this.amount, note: this.note });
      this.dialog = false;
      this.note = "";
      this.amount = 1;
    },
    close: function () {
      this.note = "";
      this.amount = 1;
      this.dialog = false;
    },
  },
};
</script>

<style></style>
