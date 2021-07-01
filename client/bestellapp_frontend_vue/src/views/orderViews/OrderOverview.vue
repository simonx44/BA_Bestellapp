<template>
  <Loading v-if="isLoading" />
  <v-card v-else color="basil" class="h-100">
    <v-card-title class="text-center justify-center py-6">
      <h1 v-if="isCustomer" class="font-weight-bold display-3">
        Bestellverlauf
      </h1>
      <h1 v-else class="font-weight-bold display-3">Bestellungen</h1>
    </v-card-title>

    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab v-for="(value, key) in orders" :key="value.title">
        {{ orders[key].title }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="value in orders" :key="value.title">
        <div class="mt-5 d-flex flex-column align-items-center w-100">
          <h3 v-if="value.data.length == 0">Keine Bestellungen vorhanden</h3>
          <OrderListCard
            @stateChange="updateOrderState"
            v-else
            v-for="(item, i) in value.data"
            :key="i"
            :index="i"
            :order="item"
            :isCustomer="isCustomer"
            :isLoading="isLoadingState"
          />
        </div>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import OrderListCard from "@/components/order/OrderListCard";
import Loading from "@/components/loading/loading";
import { HTTP_SERVICE_INSTANCE } from "@/services/http.service.js";
export default {
  components: {
    OrderListCard,
    Loading,
  },
  data() {
    return {
      tab: 0,
      isCustomer: false,
      errorMessage: "",
      isLoading: false,
      isLoadingState: false,
      orders: [
        { title: "Offene Bestellungen", data: [] },
        { title: "Abgeschlossene Bestellungen", data: [] },
      ],
    };
  },
  methods: {
    updateOrderState: async function (payload) {
      this.isLoadingState = true;
      try {
        await HTTP_SERVICE_INSTANCE.put(`/orders/${payload.id}`);
        if (payload.state === "CLOSED") {
          const [order] = this.orders[0].data.splice(payload.index, 1);
          order.state = "CLOSED";

          this.orders[1].data.splice(0, 0, order);
        } else {
          this.orders[0].data[payload.index].state = payload.state;
        }
      } catch (error) {
        this.errorMessage = "Ein Fehler ist aufgetreten";
      }
      this.isLoadingState = false;
    },
    getUserData: async function () {
      this.isLoading = true;
      try {
        const user = this.$store.getters.getCurrentUser;
        let result = await HTTP_SERVICE_INSTANCE.get(
          `/customers/${user.id}/orders`
        );

        this.orders[0].data = [
          ...result["OPEN"],
          ...result["READY"],
          ...result["QUEUE"],
        ];
        this.orders[1].data = [...result["CLOSED"]];

        //Prüfen, ob bereits Datenvorhanden sind
      } catch (error) {
        this.errorMessage = "Ein Fehler ist aufgetreten";
      }
      this.isLoading = false;
    },
    getRestaurantData: async function (id) {
      try {
        let result = await HTTP_SERVICE_INSTANCE.get(
          `/restaurants/${id}/orders`
        );

        this.orders[0].data = [
          ...result["OPEN"],
          ...result["READY"],
          ...result["QUEUE"],
        ];
        this.orders[1].data = [...result["CLOSED"]];

        //Prüfen, ob bereits Datenvorhanden sind
      } catch (error) {
        this.errorMessage = "Ein Fehler ist aufgetreten";
      }
    },
  },
  async mounted() {
    this.isLoading = true;
    const user = this.$store.getters.getCurrentUser;
    if (user && user.isCustomer) {
      this.isCustomer = true;
      await this.getUserData(user.id);
    } else if (!user.isCustomer) {
      this.isCustomer = false;
      await this.getRestaurantData(user.id);
    }

    this.isLoading = false;
  },
};
</script>

<style>
.test {
  width: 100%;
}
</style>
