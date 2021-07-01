<template>
  <Loading v-if="isLoading" />
  <div v-else>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">
          {{ options[0].title }}
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="step > 2" step="2">
          {{ options[1].title }}
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3"> {{ options[2].title }} </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mb-12">
            <v-card-title> {{ options[0].description }}</v-card-title>
            <v-divider />
            <v-card-text>
              <MenuCategoryList
                v-for="(category, value) in options[0].data"
                :key="value"
                :category="category"
                :index="value"
                @categoryChanged="changeCategory"
              />
              <div class="d-flex flex-column align-items-center">
                <TheButton
                  class="mx-1"
                  @click="addCategory()"
                  icon="mdi-plus"
                />
              </div>
            </v-card-text>
          </v-card>

          <div v-if="errorMessage">
            <p>{{ this.errorMessage }}</p>
          </div>

          <v-btn
            color="primary"
            @click="nextStep"
            :disabled="isNextStepAvailable"
          >
            <span v-if="!isSaving"> Sichern und weiter</span>
            <span v-else>
              <v-progress-circular
                indeterminate
                color="white"
              ></v-progress-circular
            ></span>
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card class="mb-12">
            <v-card-title> {{ options[1].description }}</v-card-title>
            <v-divider />
            <v-card-text v-for="(category, key) of options[1].data" :key="key">
              <h3 class="">{{ key }}:</h3>
              <MenuItem
                v-for="(item, index) in category"
                :key="index"
                :categories="options[0].data"
                :item="item"
                :index="index"
                :initalCategory="key"
                @itemChanged="changeItem"
              />

              <div
                v-if="key && key !== `unknown`"
                class="d-flex flex-column align-items-center"
              >
                <TheButton class="mx-1" @click="addItem(key)" icon="mdi-plus" />
              </div>

              <v-divider />
            </v-card-text>
          </v-card>

          <div v-if="errorMessage">
            <p>{{ this.errorMessage }}</p>
          </div>

          <v-btn
            color="primary"
            @click="nextStep"
            :disabled="isNextStepAvailable"
          >
            Vorschau anzeigen
          </v-btn>

          <v-btn text @click="previousStep"> Zurück </v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card class="mb-12">
            <v-card-title> {{ options[2].description }}</v-card-title>
            <v-divider />
            <v-card-text> <Preview :menu="options[1].data" /> </v-card-text>
          </v-card>
          <v-btn color="primary" @click="step = 1"> Abschließen </v-btn>

          <v-btn text @click="previousStep"> Zurück </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import MenuCategoryList from "@/components/menu/MenuCategoryList.vue";
import MenuItem from "@/components/menu/MenuItem.vue";
import Preview from "@/components/menu/Preview";
import TheButton from "@/components/dialog/TheButton.vue";
import Loading from "@/components/loading/loading";
import { HTTP_SERVICE_INSTANCE } from "@/services/http.service.js";
export default {
  components: {
    MenuCategoryList,
    MenuItem,
    Preview,
    Loading,
    TheButton,
  },
  data() {
    return {
      isSaving: false,
      step: 1,
      errorMessage: "",
      isLoading: false,
      options: [
        {
          data: [],
          title: "Kategorien",
          description:
            "Erstellen Sie Kategorien für die unterschiedlichen Angebote Ihrer Karte",
        },
        {
          data: [],
          title: "Speisen",
          description: "Erstellen Sie für die Gerichte für Ihre Speisekarte",
        },
        {
          title: "Vorschau",
          description: "Vorschau Ihrer erstellten Speisekarte",
        },
      ],
    };
  },
  computed: {
    isNextStepAvailable: function () {
      return this.errorMessage ? true : false;
    },
  },
  methods: {
    previousStep: function () {
      this.step = this.step > 1 ? this.step - 1 : this.step;
    },
    nextStep: async function () {
      this.isSaving = true;
      if (this.step == 1) {
        if (this.checkCategoryStep()) {
          await this.saveCategories();
          await this.createMenuItems();
          this.step = 2;
        }
      } else if (this.step == 2) {
        if (this.checkMenuStep()) {
          this.step = 3;
        }
      }
      this.isSaving = false;
    },
    checkCategoryStep: function () {
      const categories = this.options[0].data;
      if (categories.length == 0) {
        this.errorMessage = "Keine Kategorie vorhanden ";
        return false;
      } else if (categories.includes("")) {
        this.errorMessage = "Es müssen alle Kategorien befüllt sein";
        return false;
      }
      return true;
    },
    checkMenuStep: function () {
      const items = this.options[1].data;

      for (const category in items) {
        const list = items[category];
        if (category === "unknown" && items[category].length > 0) {
          this.errorMessage = `Alle Elemente müssen eine gültige Kategorie zugewiesen werden (unknwon nicht möglich)`;
          return false;
        }

        for (const element of list) {
          const { title, description, category, price } = element;
          if (!title || !description || !category || !price) {
            this.errorMessage = `Element innerhalb der Kategorie ${category} ist besitzt fehlende Felder`;
            return false;
          }
        }
      }
      return true;
    },
    addCategory: function () {
      this.options[0].data.push("");
    },
    addItem: function (category) {
      const item = {
        title: "",
        description: "",
        category: category,
        price: null,
        tag: "NEW",
        id: null,
      };
      this.options[1].data[category].push(item);
    },
    changeCategory: function (payload) {
      const { index, action, category } = payload;

      this.isLoading = true;

      switch (action) {
        case "DELETE":
          this.options[0].data.splice(index, 1);
          break;

        case "SAVE":
          this.options[0].data[index] = category;

          break;
        default:
          break;
      }
      this.isLoading = false;
      this.errorMessage = false;
    },

    changeItem: async function (payload) {
      const { index, item, category, action } = payload;

      this.isLoading = true;

      switch (action) {
        case "DELETE": {
          const itemToDelete = this.options[1].data[category][index];

          if (itemToDelete.tag != "NEW") {
            try {
              const user = this.$store.getters.getCurrentUser;
              await HTTP_SERVICE_INSTANCE.delete(
                `/menu/${user.id}/items/${itemToDelete.id}`
              );
            } catch (error) {
              console.log("Fehler");
            }
          }
          this.options[1].data[category].splice(index, 1);
          break;
        }

        case "SAVE":
          if (item.tag === "NEW") {
            try {
              const user = this.$store.getters.getCurrentUser;
              const result = await HTTP_SERVICE_INSTANCE.post(
                `/menu/${user.id}/items`,
                item
              );
              item.tag = "DB";
              item.id = result.id;
            } catch (error) {
              console.log("Fehler");
            }
          } else {
            //lokale Verarbeitung
            //Prüfung auf Änderungen der Kategorie
            try {
              const user = this.$store.getters.getCurrentUser;
              const res = await HTTP_SERVICE_INSTANCE.put(
                `/menu/${user.id}/items/${item.id}`,
                item
              );

              item.tag = "DB";
            } catch (error) {
              console.log("Fehler");
            }
          }
          if (item.category == category) {
            this.options[1].data[category][index] = item;
          } else {
            this.options[1].data[category].splice(index, 1);
            this.options[1].data[item.category].push(item);
          }
          break;
        default:
          break;
      }
      this.isLoading = false;
      this.errorMessage = false;
    },
    saveCategories() {
      return new Promise((resolve, reject) => {
        const user = this.$store.getters.getCurrentUser;
        const categories = this.options[0].data;
        HTTP_SERVICE_INSTANCE.put(`/menu/${user.id}/categories`, {
          categories: categories,
        })
          .then((result) => {
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject();
          });
      });
    },
    createMenuItems: async function () {
      const items = {};
      const categories = this.options[0].data;

      try {
        const user = this.$store.getters.getCurrentUser;
        var result = await HTTP_SERVICE_INSTANCE.get(`/menu/${user.id}/items`);

        const resultItems = result.Items;

        for (const category of categories) {
          items[category] = [];
        }
        items.unknown = [];

        for (const item of resultItems) {
          item.tag = "DB";
          if (categories.includes(item.category)) {
            items[item.category].push(item);
          } else {
            items.unknown.push(item);
          }
        }
        this.options[1].data = items;
      } catch (error) {
        this.errorMessage = "Interner Fehler";
      }
    },
    async getCategories() {
      this.isLoading = true;
      const user = this.$store.getters.getCurrentUser;
      try {
        const result = await HTTP_SERVICE_INSTANCE.get(
          `/menu/${user.id}/categories`
        );

        if (result.Item) {
          if ("categories" in result.Item) {
            this.options[0].data = result.Item.categories;
          }
        } else {
          this.options[0].data = [];
        }
      } catch (error) {
        this.errorMessage = "Ein Fehler ist aufgetreten";
      }
      this.isLoading = false;
    },
    async getMenuItems() {},
  },
  mounted() {
    this.getCategories();
  },
};
</script>

<style></style>
