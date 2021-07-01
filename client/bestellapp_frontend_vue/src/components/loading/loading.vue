<template>
  <v-container class="loading">
    <v-progress-circular
      indeterminate
      color="grey"
      :size="100"
    ></v-progress-circular>

    <p class="font-weight-bold mt-10">Daten werden geladen....</p>
    <p>Bitte warten Sie einen kurzen Moment</p>
  </v-container>
</template>

<script>
export default {};
</script>

<style>
.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
