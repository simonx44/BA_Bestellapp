<template>
  <div>
    <div
      v-if="mode === 0"
      class="d-flex flex-row justify-content-md-between mb-5"
    >
      <span v-if="category" class="font-weight-bold"> {{ category }} </span>
      <span class="font-weight-bold" v-else> --- </span>
      <div class="mr-3 ml-3">
        <TheButton class="ml-3" @click="changeMode" text="Edit" />
        <TheButton class="ml-3" @click="deleteCategory" text="Delete " />
      </div>
    </div>
    <div v-else class="d-flex flex-row">
      <v-text-field
        type="text"
        label="Kategorie"
        v-model="value"
        :rules="[rules.regex]"
      ></v-text-field>
      <TheButton class="ml-3" @click="changeMode" text="Anzeigen" />
      <TheButton class="ml-3" @click="safeChange" text="Save" />
    </div>
  </div>
</template>

<script>
const CATEGORY_REGEX = /^[a-zA-Zöäüß ]+$/;
import TheButton from "@/components/dialog/TheButton.vue";
export default {
  props: ["category", "index"],
  components: { TheButton },
  data: () => {
    return {
      mode: 0, // 0 -> Anzeigen, 1-> Edit
      value: "",
      errorMessage: "",
      rules: {
        regex: (v) =>
          CATEGORY_REGEX.test(v) ||
          "Eine Kategorie besteht nur aus einem Wort ohne Sonderzeichen",
      },
    };
  },
  methods: {
    changeMode: function () {
      this.mode = this.mode === 0 ? 1 : 0;
    },

    safeChange() {
      if (!CATEGORY_REGEX.test(this.value)) {
        this.errorMessage = "Format ist falsch";
        return;
      }
      this.$emit("categoryChanged", {
        index: this.index,
        category: this.value,
        action: "SAVE",
      });
      this.changeMode();
    },
    deleteCategory() {
      this.$emit("categoryChanged", {
        index: this.index,
        category: "",
        action: "DELETE",
      });
    },
  },
  mounted: function () {
    this.value = this.category;
  },
};
</script>

<style></style>
