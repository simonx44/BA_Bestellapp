<template>
  <v-card outlined class="w-75 mb-5">
    <v-card-text color="black">
      <div>
        <div v-if="isCustomer">
          <span class="font-weight-bold"> Restaurant: </span>

          <span>{{ order.info.restaurant.name }}</span>
          <div>
            <span class="font-weight-bold"> Email: </span>
            <span>{{ order.info.restaurant.email }}</span>
          </div>
        </div>
        <div v-else>
          <span class="font-weight-bold"> Kundeninformationen: </span>
          <span>{{
            order.info.customer.name !== "undefined undefined"
              ? order.info.customer.name
              : "Kein Name eingetragen"
          }}</span>
          <div>
            <span class="font-weight-bold">Email: </span>
            <span>{{ order.info.customer.email }}</span>
          </div>
        </div>

        <div>
          <span class="font-weight-bold">Bestelldatum: </span>
          <span>{{ order.date }}</span>
        </div>
        <div>
          <span class="font-weight-bold">Preis: </span>
          <span>{{ order.totalPrice }} €</span>
        </div>
        <div>
          <span class="font-weight-bold">Status: </span>
          <span>{{ order.state }}</span>
        </div>
      </div>
    </v-card-text>

    <Loading v-if="isLoading" />
    <div v-else>
      <v-card-actions
        v-if="!changeStateMode"
        class="d-flex flex-column justify-content-center"
        style="width: 100%"
      >
        <TheButton
          v-if="!isCustomer"
          text="Bestellstatus ändern"
          style="width: 80%"
          @click="changeStateMode = true"
        />
        <router-link
          :to="`/orders/${order.id}`"
          style="width: 100%"
          class="d-flex justify-content-center"
        >
          <TheButton text="Bestelldetails" style="width: 80%" class="mt-3" />
        </router-link>
      </v-card-actions>
      <v-card-actions
        v-else
        class="d-flex flex-column justify-content-center"
        style="width: 100%"
      >
        <p>
          Ändern auf:
          <span class="font-weight-bold">{{
            stateTransition[order.state].title
          }}</span>
        </p>
        <TheButton
          text="Abbrechen"
          style="width: 80%"
          @click="changeStateMode = false"
        />
        <TheButton
          v-if="order.state !== 'CLOSED'"
          text="Speichern"
          class="mt-3"
          style="width: 80%"
          @click="saveChanges(order.id, stateTransition[order.state].nextState)"
        />
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import Loading from "@/components/loading/loading";
import TheButton from "@/components/dialog/TheButton.vue";
export default {
  data() {
    return {
      changeStateMode: false,
      stateTransition: {
        OPEN: { title: "IN WARTESCHLANGE", nextState: "QUEUE" },
        QUEUE: { title: "ZUR ABHOLUNG BEREIT", nextState: "READY" },
        READY: { title: "BESTELLUNG SCHLESSEN", nextState: "CLOSED" },
        CLOSED: {
          title: "BESTELLUNG ABGESCHLOSSEN - Keine Änderungen möglich",
          nextState: "",
        },
      },
    };
  },
  components: { TheButton, Loading },
  props: ["order", "isCustomer", "index", "isLoading"],
  methods: {
    saveChanges(id, state) {
      this.$emit("stateChange", { id, state, index: this.index });
      this.changeStateMode = false;
    },
  },
  mounted() {},
};
</script>

<style scoped></style>
