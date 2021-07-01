<template>
  <Loading v-if="isLoading" />
  <div v-else class="mb-6">
    <div>
      <InfoExpansion :data="userdata" @requestUpdate="updateData">
      </InfoExpansion>
    </div>
    <span class="text-primary" v-if="errormessage"
      >Fehler: {{ errormessage }}</span
    >
  </div>
</template>

<script>
import InfoExpansion from "@/components/cards/InfoExpansion";
import Loading from "@/components/loading/loading";
import { HTTP_SERVICE_INSTANCE } from "@/services/http.service.js";
export default {
  components: {
    Loading,
    InfoExpansion,
  },
  data() {
    return {
      errormessage: "",
      isLoading: false,
      userdata: [
        {
          id: 0,
          title: "Kundeninformationen",
          data: {},
          options: {
            firstname: {
              title: "Vorname",
              isMutable: true,
              isDefault: false,
              type: "text",
            },
            lastname: {
              title: "Nachname",
              isMutable: true,
              isDefault: false,
              type: "text",
            },
            email: {
              title: "Email",
              isMutable: false,
              isDefault: false,
              type: "text",
            },
          },
          isMutable: true,
          invisibleAttributes: ["SK", "PK", "id", "entityType"],
        },
        {
          id: 1,
          title: "Adresse",
          //default Daten: Nach Anmeldung noch keine Daten vorhanden
          data: {
            postleitzahl: "",
            stadt: "",
            strasse: "",
            hausnummer: "",
          },
          options: {
            postleitzahl: {
              title: "Postleitzahl",
              isMutable: true,
              isDefault: true,
              type: "number",
            },
            stadt: {
              title: "Stadt",
              isMutable: true,
              isDefault: true,
              type: "text",
            },
            strasse: {
              title: "Straße",
              isMutable: true,
              isDefault: true,
              type: "text",
            },
            hausnummer: {
              title: "Hausnummer",
              isMutable: true,
              isDefault: true,
              type: "text",
            },
          },
          isMutable: true,
          invisibleAttributes: ["SK", "PK", "id"],
        },
      ],
    };
  },
  methods: {
    updateData: function (payload) {
      const { id, items } = payload;

      if (id == 0) {
        this.updateUserName(items);
      } else if (id == 1) {
        this.updateUserAdress(items);
      }
    },
    updateUserAdress: async function (data) {
      this.isLoading = true;

      const user = this.$store.getters.getCurrentUser;

      const payload = {
        updateType: "adress",
        postleitzahl: data.postleitzahl,
        stadt: data.stadt,
        strasse: data.strasse,
        hausnummer: data.hausnummer,
      };

      try {
        await HTTP_SERVICE_INSTANCE.put(`/customers/${user.id}`, payload);

        (this.userdata[1].data.postleitzahl = data.postleitzahl),
          (this.userdata[1].data.stadt = data.stadt);
        this.userdata[1].data.strasse = data.strasse;
        this.userdata[1].data.hausnummer = data.hausnummer;

        this.errormessage = "";
      } catch (error) {
        this.errormessage =
          "Update war aufgrund eines internen Fehlers nicht möglich";
      } finally {
        this.isLoading = false;
      }
    },
    updateUserName: async function (data) {
      this.isLoading = true;

      const user = this.$store.getters.getCurrentUser;

      const payload = {
        updateType: "name",
        firstname: data.firstname,
        lastname: data.lastname,
      };

      try {
        await HTTP_SERVICE_INSTANCE.put(`/customers/${user.id}`, payload);
        this.userdata[0].data.firstname = data.firstname;
        this.userdata[0].data.lastname = data.lastname;
        this.errormessage = "";
      } catch (error) {
        this.errormessage =
          "Update war aufgrund eines internen Fehlers nicht möglich";
      } finally {
        this.isLoading = false;
      }
    },
    // Nutzerdaten inital beschaffen
    getCurrentUserData: async function () {
      this.isLoading = true;

      const user = this.$store.getters.getCurrentUser;

      try {
        const result = await HTTP_SERVICE_INSTANCE.get(`/customers/${user.id}`);
        console.log(result);
        for (const item of result.Items) {
          if ("email" in item) {
            this.userdata[0].data = item;
            continue;
          }
          this.userdata[1].data = {
            postleitzahl: item.postleitzahl,
            stadt: item.stadt,
            strasse: item.strasse,
            hausnummer: item.hausnummer,
          };
        }
      } catch (error) {
        this.errormessage =
          "Nutzerdaten konnten aufgrund eines Fehlers nicht beschafft werden";
      } finally {
        this.isLoading = false;
      }
    },
  },

  mounted() {
    this.getCurrentUserData();
  },
};
</script>

<style></style>
