<template>
  <div>
    <v-dialog v-model="dialog" max-width="500">
      <v-card
        ><v-card-title class="headline grey lighten-2">
          Warenkorb löschen
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text class="d-flex flex-column justify-content-center">
          {{ deleteMessage }}
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <TheButton text="Warenkorb leeren" @click="clearCart" />
          <TheButton text="Schließen" @click="dialog = false" />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div v-for="(value, key) in menu" :key="key">
      <div class="mt-5">
        <h3 v-if="value.length > 0">
          {{ key === "unknown" ? "Keine Kategorie vorhanden" : key }}:
        </h3>
        <div v-for="(item, index) in menu[key]" :key="index" class="mt-2">
          <MenuItem :item="item" @putInCart="addToCart" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheButton from "@/components/dialog/TheButton.vue";
import MenuItem from "@/components/cards/MenuItem";

export default {
  components: { MenuItem, TheButton },
  data() {
    return {
      dialog: false,
      deleteMessage:
        "Im Warenkorb befinden sich Artikel eines anderen Restaurants. Eine Bestellung kann nur einem Restaurant zugewiesen werden. Wenn Sie fortfahren werden sämtliche Artiel eines anderen Restaurants gelöscht",
    };
  },
  props: ["menu", "id"],
  methods: {
    clearCart() {
      this.$store.commit("setRestaurantToCart", this.id);
      this.dialog = false;
    },
    addToCart: function (payload) {
      const state = this.$store.getters.getShoppingCart;

      //Warenkorb leer
      if (!state.restaurantid) {
        this.$store.commit("setRestaurantToCart", this.id);
      } else if (state.restaurantid !== this.id) {
        this.dialog = true;
        return;
      }
      // Item in den Warenkorb
      this.addItemToCart(payload);
    },
    addItemToCart(payload) {
      const { id, amount, title, price, note } = payload;
      this.$store.commit("addItemToCart", {
        product: { id, amount, title, price, note },
      });
    },
  },
};
</script>

<style></style>
