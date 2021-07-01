<template>
  <v-dialog v-model="isOpen" max-width="90%" heigth="90%">
    <v-card
      ><v-card-title class="headline grey lighten-2">
        Bestellung abschließen - Bestellübersicht
      </v-card-title>
      <v-list-item class="text-center">
        <v-list-item-title class="font-weight-bold">
          Derzeit nur Selbstabhloung möglich
        </v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>
      <!-- Anzeigen -->
      <v-list v-if="state == 0">
        <v-list-item
          v-for="item in items"
          :key="item.id"
          class="d-flex flex-column justify-content-center text-center"
        >
          <v-list-item-content>
            <div class="mb-2">
              <v-list-item-title>Gericht:</v-list-item-title>
              <v-list-item-subtitle>{{ item.title }}</v-list-item-subtitle>
            </div>
            <div class="mb-2">
              <v-list-item-title>Anzahl:</v-list-item-title>
              <v-list-item-subtitle>{{ item.amount }}</v-list-item-subtitle>
            </div>
            <div class="mb-2">
              <v-list-item-title>Note:</v-list-item-title>
              <v-list-item-subtitle>{{ item.note }}</v-list-item-subtitle>
            </div>
            <div class="mb-2">
              <v-list-item-title>Preis:</v-list-item-title>
              <v-list-item-subtitle
                >{{ item.amount * item.price }} €</v-list-item-subtitle
              >
            </div>
            <v-divider />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- Bestellung anlegen -->
      <v-list
        v-else-if="state == 1"
        class="d-flex flex-column justify-content-center align-items-center"
      >
        <div class="text-center">Bestellung wird angelegt:</div>
        <v-progress-circular
          indeterminate
          size="50"
          color="grey"
        ></v-progress-circular>
      </v-list>
      <!-- Statusmeldung -->
      <v-list v-else-if="state == 2">
        <v-list-item
          class="d-flex flex-column justify-content-center text-center"
        >
          <v-list-item-content>
            <p>
              Die Bestellung wurde erfolgreich verbucht. Sie werden zeitnah per
              Mail informiert und können die Details der Bestellung in der
              Bestellübesicht einsehen
            </p>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- Fehler -->
      <v-list v-else-if="state == 3">
        <v-list-item
          class="d-flex flex-column justify-content-center text-center"
        >
          <v-list-item-content>
            <p>Ein Fehler ist aufgetreten: {{ message }}</p>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>

        <TheButton
          v-if="state == 0 || state == 3"
          text="Abbrechen"
          @click="closeModal"
        />
        <TheButton
          v-if="state == 0"
          text="Bestellung abschließen"
          @click="completeOrder"
        />
        <TheButton v-if="state == 2" text="Schließen" @click="closeOrder" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TheButton from "@/components/dialog/TheButton.vue";
export default {
  components: { TheButton },
  props: ["isOpen", "items", "state", "message"],
  methods: {
    closeModal() {
      this.$emit("close");
    },
    completeOrder() {
      this.$emit("completeOrder");
    },
    closeOrder() {
      this.$emit("closeOrder");
    },
  },
  mounted() {},
};
</script>

<style></style>
