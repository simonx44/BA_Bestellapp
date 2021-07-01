<template>
  <v-card :loading="loading" class="mx-auto my-12" max-width="374">
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img v-if="info.small_url" height="250" :src="info.small_url"></v-img>
    <v-img v-else height="250" src="@/assets/placeholder.jpg"></v-img>

    <v-card-title>{{ info.restaurantName }}</v-card-title>

    <v-card-text>
      <div class="my-4 subtitle-1">Restaurantbeschreibung:</div>

      <div>
        {{ info.description }}
      </div>
    </v-card-text>
    <v-divider class="mx-4"></v-divider>
    <PopUp title="Öffnungszeiten" width="80%">
      <v-card-text>
        <div v-if="openingHours">
          <div v-for="(item, key) of openingHours" :key="key">
            <span class="mr-2">{{ key }}:</span>
            <span v-if="item.closed"> geschlossen </span>
            <span v-else>{{ item.from }} bis {{ item.to }} Uhr</span>
          </div>
        </div>
        <div v-else>Keine Daten vorhanden</div>
      </v-card-text>
    </PopUp>

    <PopUp title="Adresse" width="80%">
      <v-card-text>
        <div v-if="adress">
          <div v-for="(item, key) of adress" :key="key">
            <span class="mr-2">{{ key }}:</span>
            <span> {{ adress[key] }}</span>
          </div>
        </div>
        <div v-else>Keine Daten vorhanden</div>
      </v-card-text>
    </PopUp>

    <v-divider class="mx-4"></v-divider>
    <v-card-actions>
      <router-link :to="`/restaurant/${info.id}`">
        <v-btn color="black" text> Speisekarte einsehen </v-btn>
      </router-link>
    </v-card-actions>
    <v-divider class="mx-4"></v-divider>
  </v-card>
</template>

<script>
import PopUp from "@/components/dialog/PopUp";
export default {
  props: ["info"],
  components: { PopUp },
  data: () => ({
    loading: false,
    selection: 1,
    openingHours: undefined,
    adress: undefined,
  }),

  methods: {
    openMenu() {},
  },
  mounted() {
    this.adress = this.info.adress;
    if (Object.keys(this.info.openhours).length > 0) {
      this.openingHours = {
        Montag: this.info.openhours["Montag"],
        Diensttag: this.info.openhours["Diensttag"],
        Mittwoch: this.info.openhours["Mittwoch"],
        Donnerstag: this.info.openhours["Donnerstag"],
        Freitag: this.info.openhours["Freitag"],
        Samstag: this.info.openhours["Samstag"],
        Sonntag: this.info.openhours["Sonntag"],
      };
    }

    if (Object.keys(this.info.adress).length > 0) {
      this.adress = {
        PLZ: this.info.adress.postleitzahl,
        Stadt: this.info.adress.stadt,
        Strasse: this.info.adress.strasse,
        Hausnummer: this.info.adress.hausnummer,
      };
    }
  },
};
</script>

<style></style>
