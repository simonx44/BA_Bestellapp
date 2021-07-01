<template>
  <v-navigation-drawer v-if="width" app right bottom mobile-breakpoint="sm">
    <div
      style="
        max-height: 100vh;
        height: 100%;
        display: flex;
        flex-direction: column;
      "
    >
      <header
        style="
          flex: 1;
          max-height: calc(100% - 100px);
          display: flex;
          flex-direction: column;
        "
      >
        <v-list-item style="flex: 0">
          <v-list-item-content>
            <v-list-item-title class="title"> Warenkorb </v-list-item-title>
            <v-list-item-subtitle>
              Restaurant: {{ restaurantId }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <!-- Artikel -->
        <div class="cart-wrapper" v-if="items.length > 0">
          <v-divider />
          <v-list>
            <v-list-item
              v-for="item in items"
              :key="item.id"
              class="d-flex flex-column justify-content-center text-center"
            >
              <v-list-item-content>
                <div class="mb-2">
                  <v-list-item-title>Gericht:</v-list-item-title>
                  <v-list-item-subtitle>{{ item.title }}</v-list-item-subtitle>
                </div>
                <div class="mb-2">
                  <v-list-item-title>Anzahl:</v-list-item-title>
                  <v-list-item-subtitle>{{ item.amount }}</v-list-item-subtitle>
                </div>
                <div class="mb-2">
                  <v-list-item-title>Preis:</v-list-item-title>
                  <v-list-item-subtitle
                    >{{ item.amount * item.price }} €</v-list-item-subtitle
                  >
                </div>
                <v-btn outlined color="black" @click="deleteItem(item.id)">
                  <v-icon size="30" color="grey darken-2"> mdi-delete </v-icon>
                </v-btn>
                <v-divider />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
        <div v-else>
          <v-divider />
          <v-list-item
            class="d-flex flex-column justify-content-center text-center"
          >
            <v-list-item-title>Keine Artikel ausgewählt</v-list-item-title>
          </v-list-item>
        </div>
      </header>

      <div
        style="flex-basis: 100px; background: rgba(0, 0, 0, 0.54)"
        class="pt-2"
      >
        <div class="d-flex flex-column align-items-center">
          <TheButton
            class="mb-2"
            text="Warenkorb leeren"
            @click="deleteAll"
            style="width: 80%; background: white"
          />
          <TheButton
            class="mb-2"
            text="Bestellen"
            @click="isOrderModalOpen = true"
            style="width: 80%; background: white"
            :disabled="items.length == 0"
          />
        </div>
        <OrderModal
          :items="items"
          :isOpen="isOrderModalOpen"
          @close="isOrderModalOpen = false"
          @completeOrder="completeOrder"
          @closeOrder="closeOrder"
          :state="state"
          :message="message"
        />
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import OrderModal from "@/components/dialog/OrderModal.vue";
import TheButton from "@/components/dialog/TheButton.vue";
import { HTTP_SERVICE_INSTANCE } from "@/services/http.service.js";
export default {
  components: { TheButton, OrderModal },
  data() {
    return {
      state: 0, /// State für Bestellmodul 0 -> Anzeigen, 1-> Bestellung anlegen -> 2 -> Statusmeldung, 3 -> Fehler
      isOrderModalOpen: false,
      items: [],
      restaurantId: undefined,
      message: "",
    };
  },
  methods: {
    deleteItem: function (id) {
      this.$store.commit("deleteItem", id);
    },
    deleteAll: function () {
      this.$store.commit("deleteShoppingCart");
    },
    completeOrder: async function () {
      this.state = 1;

      if (this.items.length == 0) {
        this.state = 3;
        this.message = "Keine Waren im Einkaufskorb";
        return;
      } else if (!this.restaurantId) {
        this.state = 3;
        this.message = "Kein Restaurant vorhanden";
        return;
      }

      try {
        const user = this.$store.getters.getCurrentUser;

        const body = {
          customerId: user.id,
          restaurantId: this.restaurantId,
          items: this.items,
        };

        await HTTP_SERVICE_INSTANCE.post(`/orders`, body);
        this.state = 2;
      } catch {
        this.state = 3;
        this.message = "Keine Waren im Einkaufskorb";
      }
    },
    closeOrder: function () {
      this.isOrderModalOpen = false;
      this.state = 0;
      this.items = [];
      this.restaurantId = undefined;
      this.message = "";
      this.deleteAll();
    },
  },
  watch: {
    "$store.state.shoppingCart"(value) {
      if (value.restaurantid !== this.restaurantId) {
        this.restaurantId = value.restaurantid;
      }
      const updatedItems = [];
      for (const key in value.items) {
        const item = value.items[key];
        updatedItems.push(item);
      }
      this.items = updatedItems;
    },
  },
  computed: {
    width() {
      const { breakpoint } = this.$vuetify;

      return breakpoint.smAndUp;
    },
  },
};
</script>

<style></style>
