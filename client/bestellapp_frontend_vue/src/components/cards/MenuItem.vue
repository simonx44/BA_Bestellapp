<template>
  <v-card>
    <v-card-title>{{ item.title }}</v-card-title>

    <v-card-text>
      <v-divider />
      <div>
        <span class="font-italic">Beschreibung:</span>
        <div>{{ item.description }}</div>
      </div>
      <span class="font-italic">Preis: </span>
      <span>{{ item.price }} €</span>
    </v-card-text>
    <v-divider />

    <MenuPopUp :title="item.title" width="90%" @addToCart="putItemInCart" />

    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<script>
import MenuPopUp from "@/components/dialog/MenuPopUp";
export default {
  components: { MenuPopUp },
  props: ["item"],
  methods: {
    putItemInCart: function (payload) {
      this.$emit("putInCart", {
        ...this.item,
        amount: payload.amount,
        note: payload.note,
      });
    },
  },
};
</script>

<style></style>
