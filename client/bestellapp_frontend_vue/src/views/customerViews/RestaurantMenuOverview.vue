<template>
  <Loading v-if="isLoading" />
  <div v-else>
    <div class="container" v-if="!menuItems">Keine Daten vorhanden</div>
    <div v-else>
      <MenuList :id="id" :menu="menuItems" />
    </div>
  </div>
</template>

<script>
import MenuList from "@/components/menuList/MenuList";
import Loading from "@/components/loading/loading";
import { HTTP_SERVICE_INSTANCE } from "@/services/http.service.js";
export default {
  components: {
    MenuList,
    Loading,
  },
  data() {
    return {
      id: this.$route.params.id,
      restaurantInfo: {},
      isLoading: false,
      errorMessage: "",
      menuItems: null,
    };
  },
  methods: {
    async getRestaurantMenu() {
      try {
        const items = {};
        let result = await HTTP_SERVICE_INSTANCE.get(
          `/menu/${this.id}/categories`
        );
        //Prüfen, ob bereits Daten vorhanden sind
        if (result.Item) {
          for (const category of result.Item.categories) {
            items[category] = [];
          }
          items["unknown"] = [];
        } else {
          this.menuItems = undefined;
          this.errorMessage = "Es wurde noch keine Speisekarte angelegt";
          return;
        }
        result = await HTTP_SERVICE_INSTANCE.get(`/menu/${this.id}/items`);

        for (const item of result.Items) {
          if (items[item.category]) {
            items[item.category].push(item);
          } else {
            items["unknown"].push(item);
          }
        }
        this.menuItems = items;
      } catch (error) {
        console.log(error);
        this.errorMessage = "Ein Fehler ist aufgetreten";
      }
    },
  },
  async mounted() {
    this.isLoading = true;
    await this.getRestaurantMenu();
    this.isLoading = false;
  },
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
</style>
