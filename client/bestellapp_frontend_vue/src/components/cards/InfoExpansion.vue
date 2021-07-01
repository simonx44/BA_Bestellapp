<template>
  <!-- Erst wenn da Containerobjekt mit gefüllt ist, soll gerendert werden -->
  <div v-if="container.length > 0">
    <v-expansion-panels accordion>
      <v-expansion-panel v-for="item in data" :key="item.id">
        <!-- Title eines übergebenen Objektes -->
        <v-expansion-panel-header class="headline mb-2">{{
          item.title
        }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-divider></v-divider>
          <!-- Verfügbare Aktionen auf einem Objekt -> bestimmt ob datensatz veränderbar ist -->
          <div v-if="item.isMutable">
            <!-- Ist Container-objekt erstellt und ist der status auf dem Objekt anzeigen (status = 0)-->

            <TheButton
              v-if="container[item.id].state == 0"
              @click="changeMode(item.id)"
              text="Edit"
            />
            <!-- sonst Änderungsmodus -->
            <div v-else>
              <TheButton
                class="mr-5"
                @click="changeMode(item.id)"
                text="Anzeigen"
              />
              <TheButton
                class="mr-5"
                @click="updateData(item.id)"
                text="Save"
              />
            </div>
            <span class="text-primary" v-if="container[item.id].errorMessage"
              >Fehler: {{ container[item.id].errorMessage }}</span
            >
            <v-divider></v-divider>
          </div>
          <!-- Props eines Objektes werden angezeigt, falls Daten vorhanden sind -->
          <div class="showMode" v-if="Object.keys(item.data).length > 0">
            <div v-for="(value, name) in item.data" :key="value + name">
              <div v-if="!item.invisibleAttributes.includes(name)">
                <!-- Beschreibung wird nur im Ansichtsmodus angezeigt -->
                <div
                  class="mr-2 font-weight-bold"
                  v-if="container[item.id].state == 0"
                >
                  {{ item.options[name].title }}:
                </div>

                <div v-if="container[item.id].state == 0">
                  <!--  -->
                  <div v-if="item.options[name].type == 'time'">
                    <span v-if="value.closed"> geschlossen </span>
                    <span v-else>{{ value.from }} bis {{ value.to }} Uhr</span>
                  </div>

                  <div v-else-if="item.options[name].type === 'picture'">
                    <v-img
                      v-if="!value.url"
                      height="250"
                      :width="IMAGE_WIDTH"
                      src="@/assets/placeholder.jpg"
                    ></v-img>
                    <v-img
                      v-else
                      height="250"
                      :width="IMAGE_WIDTH"
                      :src="value.url"
                    ></v-img>
                  </div>
                  <div v-else>{{ value ? value + "" : "--" }}</div>
                </div>

                <!-- Editmode, falls Daten vorhanden sind -->
                <div v-else class="row">
                  <div class="col-12" v-if="item.options[name].isMutable">
                    <!-- Richtiges Format auswählen -->
                    <v-container fluid>
                      <v-text-field
                        v-if="
                          item.options[name].type == 'text' ||
                          item.options[name].type == 'number'
                        "
                        v-model="container[item.id].mutableItems[name]"
                        :type="item.options[name].type"
                        :label="name"
                      ></v-text-field>
                      <v-textarea
                        v-else-if="item.options[name].type == 'area'"
                        clearable
                        :label="name"
                        v-model="container[item.id].mutableItems[name]"
                      ></v-textarea>
                      <div v-else-if="item.options[name].type == 'time'">
                        <span class="font-weight-bold">
                          {{ item.options[name].title }}:</span
                        >

                        <div
                          v-if="
                            container[item.id].mutableItems[name].closed ==
                            false
                          "
                        >
                          <span> Von </span>
                          <input
                            type="time"
                            name="uhrzeit"
                            v-model="container[item.id].mutableItems[name].from"
                          />
                          <span> bis </span>
                          <input
                            type="time"
                            name="uhrzeit"
                            v-model="container[item.id].mutableItems[name].to"
                          />
                        </div>
                        <v-checkbox
                          v-model="container[item.id].mutableItems[name].closed"
                          label="geschlossen"
                        ></v-checkbox>
                      </div>
                      <div v-else-if="item.options[name].type == 'picture'">
                        <v-file-input
                          accept="image/png, image/jpeg, image/webp, image/bmp, image/jpg, image/jpeg"
                          label="Ihr Restaurantbild"
                          @change="
                            createFileUrl(
                              container[item.id].mutableItems[name],
                              item.id
                            )
                          "
                          outlined
                          v-model="
                            container[item.id].mutableItems[name]
                              .uploadedPicture
                          "
                        />
                        <div v-if="container[item.id].mutableItems[name].url">
                          <h3>Vorschau</h3>

                          <v-img
                            height="250"
                            :width="IMAGE_WIDTH"
                            :src="container[item.id].mutableItems[name].url"
                            alt="restaurantPicture"
                          ></v-img>
                        </div>
                      </div>
                    </v-container>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- No kein Eintrag vorhanden -->
          <div v-else>
            <div v-for="(value, name) in item.options" :key="value + name">
              <div>
                <div v-if="container[item.id].state == 0">
                  <span class="mr-2 font-weight-bold">
                    {{ item.options[name].title }}:
                  </span>
                  <span> -</span>
                </div>
                <div v-else>
                  <!--  Editmode ohne vorhandene Daten-->
                  <div class="row" v-if="item.options[name].isMutable">
                    <!-- Richtiges Format auswählen -->
                    <div class="col-12">
                      <v-text-field
                        v-if="
                          item.options[name].type == 'text' ||
                          item.options[name].type == 'number'
                        "
                        v-model="container[item.id].mutableItems[name]"
                        :type="item.options[name].type"
                        :label="name"
                      ></v-text-field>
                      <v-textarea
                        v-if="item.options[name].type == 'area'"
                        clearable
                        :label="name"
                        v-model="container[item.id].mutableItems[name]"
                      ></v-textarea>
                      <div v-if="item.options[name].type == 'time'">
                        <span class="font-weight-bold">
                          {{ item.options[name].title }}:</span
                        >

                        <div
                          v-if="
                            container[item.id].mutableItems[name].closed ==
                            false
                          "
                        >
                          <span> Von </span>
                          <input
                            type="time"
                            name="uhrzeit"
                            v-model="container[item.id].mutableItems[name].from"
                          />
                          <span> bis </span>
                          <input
                            type="time"
                            name="uhrzeit"
                            v-model="container[item.id].mutableItems[name].to"
                          />
                        </div>
                        <v-checkbox
                          v-model="container[item.id].mutableItems[name].closed"
                          label="geschlossen"
                        ></v-checkbox>
                      </div>
                      <div v-if="item.options[name].type == 'picture'">
                        <v-file-input
                          accept="image/png, image/jpeg, image/webp, image/bmp, image/jpg, image/jpeg"
                          @change="
                            createFileUrl(
                              container[item.id].mutableItems[name],
                              item.id
                            )
                          "
                          outlined
                          v-model="
                            container[item.id].mutableItems[name]
                              .uploadedPicture
                          "
                        />
                        <div v-if="container[item.id].mutableItems[name].url">
                          <h3>Vorschau</h3>
                          <v-img
                            height="250"
                            :width="IMAGE_WIDTH"
                            :src="container[item.id].mutableItems[name].url"
                            alt="restaurantPicture"
                          ></v-img>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
  <div v-else>Test</div>
</template>

<script>
const PIC_TYPE = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/bmp",
  "image/jpg",
  "image/jpeg",
];
import TheButton from "@/components/dialog/TheButton.vue";
export default {
  components: { TheButton },
  data() {
    return { container: [], IMAGE_WIDTH: 600 };
  },
  props: ["data"],

  mounted() {
    this.generateContainerData();
  },

  methods: {
    createFileUrl: function (filedata, id) {
      const uploadedPicture = filedata.uploadedPicture;
      if (!PIC_TYPE.includes(uploadedPicture.type)) {
        this.container[id].errorMessage =
          "Hochgeladenes Bild hat ein falsches Format";
        filedata.url = null;
        return false;
      } else {
        const url = URL.createObjectURL(filedata.uploadedPicture);
        filedata.url = url;
        this.container[id].errorMessage = "";
      }
    },
    checkForDataChange: function (id) {
      let initalData = this.data[id].data;
      let options = this.data[id].options;

      let mutableData = this.container[id].mutableItems;

      //Überprüfen, ob Felder gefüllt sind
      let countUnchanged = 0;
      let countItems = 0;

      for (const item in mutableData) {
        countItems++;

        if (options[item].type === "picture") {
          /* mutableItems */
          const { url, uploadedPicture } = mutableData[item];
          const initalUrl = initalData[item].url;

          if (!url || !uploadedPicture) {
            this.container[id].errorMessage = "Alle Felder benötigen Daten";
            return false;
          } else if (initalUrl == url) {
            this.container[id].errorMessage =
              "Es wurde keine Änderung festgestellt";
            return false;
          }
        }

        if (options[item].type === "time") {
          const { from, to, closed } = mutableData[item];

          if (!closed && !from && !to) {
            this.container[id].errorMessage = "Alle Felder benötigen Daten";
            return false;
          } else if (initalData[item]) {
            const initalFrom = initalData[item].from;
            const intialTo = initalData[item].to;
            const initalClosed = initalData[item].closed;

            if (
              to === intialTo &&
              from === initalFrom &&
              closed === initalClosed
            ) {
              countUnchanged++;
            }
          }
        } else {
          if (!mutableData[item]) {
            this.container[id].errorMessage = "Alle Felder benötigen Daten";
            return false;
          }

          if (mutableData[item] === initalData[item]) {
            countUnchanged++;
          }
        }
      }

      if (countUnchanged == countItems) {
        this.container[id].errorMessage =
          "Es wurde keine Änderung festgestellt";
        return false;
      }

      return true;
    },
    changeMode: function (id) {
      this.container[id].errorMessage = "";
      this.container[id].state = this.container[id].state == 1 ? 0 : 1;
    },
    updateData: function (id) {
      //Überprüfen ob Änderung stattgefunden hat

      if (!this.checkForDataChange(id)) {
        return;
      }

      this.$emit("requestUpdate", {
        id: id,
        items: this.container[id].mutableItems,
      });
      this.changeMode(id);
    },

    // Funktion generiert das initale Datenobjekt, das für eine potentielle Überarbeitung der Daten benötigt wird
    // Hierbei wird für jede änderbare Property eine neue Property innerhalb der Komponente erzeugt, sodass über v-model
    //im Anschluss bei einer Änderung darauf zugegriffen werden kann
    // Zudem wird ein Status benötigt um zwischen Anzeigen und Änderung zu unterscheiden
    generateContainerData: function () {
      for (const item of this.data) {
        var mutableItems = {};

        let { options, data } = item;

        for (var key in options) {
          let { isMutable, type } = options[key];

          if (isMutable) {
            if (data[key]) {
              if (type === "time" || type === "picture") {
                // Objekte müssen kopiert werden, damit Änderungen registiert werden können
                // Änderungen werden sonst immer nur auf dem übergebenen Objekt ausgeführt
                mutableItems[key] = Object.assign({}, data[key]);
              } else {
                mutableItems[key] = data[key];
              }
            } else {
              //keine Daten inital vorhanden
              //typprüfung
              if (type == "number" || type == "text") {
                mutableItems[key] = "";
              } else if (type == "time") {
                mutableItems[key] = { from: "", to: "", closed: false };
              } else if (type === "picture") {
                mutableItems[key] = {
                  url: null,
                  uploadedPicture: null,
                };
              }
            }
          }
        }

        var itemInfo = {
          id: item.id,
          state: 0, // 0 -> anzeigen 1 - edit
          mutableItems,
          errorMessage: "",
        };
        this.container.push(itemInfo);
      }
    },
  },
  computed: {
    isShowMode: function (id) {
      return this.container.length > 0 && this.container[id].state == 0;
    },
  },
};
</script>

<style>
.showMode {
  word-wrap: break-word;
}
</style>
