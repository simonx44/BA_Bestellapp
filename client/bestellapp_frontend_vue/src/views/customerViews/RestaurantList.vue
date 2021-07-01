<template>
  <Loading v-if="isLoading" />
  <div
    class="d-flex justify-content-center"
    v-else-if="restaurants.length == 0"
  >
    <p>Keine Restaurants vorhanden</p>
  </div>
  <div v-else class="container">
    <div class="row">
      <div
        class="col-12 col-md-6 col-lg-4 restCard"
        v-for="item of restaurants"
        :key="item.id"
      >
        <RestaurantCard :info="item" />
      </div>
    </div>
  </div>
</template>

<script>
import RestaurantCard from "@/components/cards/RestaurantCard";
import { HTTP_SERVICE_INSTANCE } from "@/services/http.service.js";
import Loading from "@/components/loading/loading";
export default {
  components: { RestaurantCard, Loading },

  data() {
    return {
      restaurants: [],
      isLoading: false,
    };
  },

  methods: {
    getInitalData: async function () {
      this.isLoading = true;
      try {
        const result = await HTTP_SERVICE_INSTANCE.get(`/restaurants`);

        this.restaurants = [...result];
      } catch (error) {
        console.log(error);
      }
      this.isLoading = false;
    },
  },
  async mounted() {
    await this.getInitalData();
  },
};
</script>

<style>
</style>
