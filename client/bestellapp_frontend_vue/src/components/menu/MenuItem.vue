<template>
  <div class="menuTIem">
    <div class="">
      <div v-if="mode === 0" class="row">
        <div class="col-12 col-md-8">
          <div>
            <span class="mr-2 font-weight-bold"> Name: </span>
            <span>{{ item.title }} </span>
          </div>
          <div>
            <span class="mr-2 font-weight-bold"> Beschreibung: </span>
            <div class="mr-2">{{ this.item.description }}</div>
          </div>
          <div class="d-flex font-weight-bold">
            <span class="mr-2"> Kategorie: </span>
            <span>{{ item.category }}</span>
          </div>
          <div class="d-flex">
            <span class="mr-2 font-weight-bold"> Preis: </span>
            <div>{{ item.price }} €</div>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <TheButton @click="changeMode" text="Edit" class="mx-auto" />
          <TheButton class="ml-3" @click="deleteCategory" text="Delete" />
        </div>
      </div>
      <div v-else>
        <h2>Artikel bearbeiten:</h2>
        <div v-if="errorMessage">Fehler: {{ this.errorMessage }}</div>
        <div>
          <v-text-field type="text" label="Name" v-model="title"></v-text-field>
          <v-textarea
            clearable
            label="Beschreibung"
            v-model="description"
          ></v-textarea>
          <v-select
            :items="categories"
            v-model="category"
            filled
            label="Kategorie"
            dense
          ></v-select>
          <v-text-field
            type="number"
            label="Preis in €"
            v-model="price"
          ></v-text-field>
          <div>
            <TheButton @click="changeMode" text="Anzeigen" class="mx-auto" />
            <TheButton class="ml-3" @click="safeChange" text="Save" />
          </div>
        </div>
      </div>
    </div>
    <v-divider />
  </div>
</template>

<script>
import TheButton from "@/components/dialog/TheButton.vue";
export default {
  components: {
    TheButton,
  },
  props: ["categories", "index", "item", "initalCategory"],
  data: () => {
    return {
      mode: 0, // 0 -> Anzeigen, 1-> Edit
      price: null,
      description: "",
      title: "",
      category: "",

      errorMessage: "",
      rules: {
        /*   regex: (v) =>
          CATEGORY_REGEX.test(v) ||
          "Eine Kategory besteht nur aus einem Wort ohne Sonderzeichen",
      }, */
      },
    };
  },
  methods: {
    changeMode: function () {
      this.mode = this.mode === 0 ? 1 : 0;
    },

    safeChange() {
      if (
        !this.category ||
        !this.category == "unknown" ||
        !this.description ||
        !this.title ||
        !this.price
      ) {
        this.errorMessage =
          "Bitte alles ausfüllen - Kategorie muss vorhanden sein";
        return;
      }

      if (!this.categories.includes(this.category)) {
        this.errorMessage = "Keine gültige Kategorie";
        return;
      }

      this.$emit("itemChanged", {
        index: this.index,
        category: this.initalCategory,
        item: {
          title: this.title,
          description: this.description,
          category: this.category,
          price: this.price,
          tag: this.item.tag,
          id: this.item.id,
        },
        action: "SAVE",
      });
      this.errorMessage = "";
      this.changeMode();
    },
    deleteCategory() {
      this.$emit("itemChanged", {
        index: this.index,
        category: this.initalCategory,
        action: "DELETE",
      });
    },
  },
  mounted: function () {
    this.price = this.item.price;
    this.description = this.item.description;
    this.title = this.item.title;
    this.category = this.item.category;
  },
};
</script>

<style></style>
