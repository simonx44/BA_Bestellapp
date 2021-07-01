<template>
  <div>
    <div v-for="(value, key) in menu" :key="key">
      <div v-if="key !== 'unknown'" class="mt-3">
        <h3>{{ key }}:</h3>
        <v-card v-for="(item, index) in menu[key]" :key="index" class="mt-2">
          <v-card-title>Artikelname: {{ item.title }}</v-card-title>
          <v-card-text>
            <h5>Beschreibung</h5>
            <div>{{ item.description }}</div>
            <h5>Preis</h5>
            <div>{{ item.price }} €</div>
          </v-card-text>
          <div></div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["menu"],
};
</script>

<style></style>
