<template>
  <Loading v-if="isLoading" />
  <div v-else>
    <v-card v-for="position in orderPositions" :key="position.id">
      <v-card-title>Artikel: {{ position.title }}</v-card-title>
      <v-divider />
      <v-card-text>
        <div>
          <div>
            <span class="font-weight-bold">Ihre Notiz:</span>
            <span>{{ position.note }}</span>
          </div>
          <div>
            <span class="font-weight-bold">Preis:</span>
            <span>{{ position.price }} €</span>
          </div>
          <div>
            <span class="font-weight-bold">Anzahl:</span>
            <span>{{ position.amount }}</span>
          </div>
        </div>
      </v-card-text>
      <v-divider />
    </v-card>
  </div>
</template>

<script>
import { HTTP_SERVICE_INSTANCE } from "@/services/http.service.js";
import Loading from "@/components/loading/loading";
export default {
  components: {
    Loading,
  },
  data() {
    return {
      id: this.$route.params.id,
      orderPositions: [],
      isLoading: false,
    };
  },
  methods: {
    getOrderDetails: async function () {
      this.isLoading = true;
      try {
        let orderDetails = await HTTP_SERVICE_INSTANCE.get(
          `/orders/${this.id}`
        );

        this.orderPositions = orderDetails;

        //Prüfen, ob bereits Datenvorhanden sind
      } catch (error) {
        this.errorMessage = "Ein Fehler ist aufgetreten";
      }
      this.isLoading = false;
    },
  },
  mounted() {
    this.getOrderDetails();
  },
};
</script>

<style></style>
