<template>
  <Loading v-if="isLoading" />
  <div v-else>
    <!--   <InfoCard> </InfoCard> -->
    <InfoExpansion :data="userdata" @requestUpdate="updateData">
    </InfoExpansion>
    <span class="text-primary" v-if="errormessage"
      >Fehler: {{ errormessage }}</span
    >
  </div>
</template>

<script>
//import InfoCard from "@/components/cards/InfoCard";
import InfoExpansion from "@/components/cards/InfoExpansion";
import { HTTP_SERVICE_INSTANCE } from "@/services/http.service.js";
import Loading from "@/components/loading/loading";

export default {
  components: {
    // InfoCard,
    InfoExpansion,
    Loading,
  },
  data() {
    return {
      errormessage: "",
      isLoading: true,
      userdata: [
        {
          id: 0,
          title: "Restaurantinformationen",
          data: {},
          options: {
            description: {
              title: "Beschreibung",
              isMutable: true,
              isDefault: false,
              type: "area",
            },
            restaurantName: {
              title: "Restaurantname",
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
          invisibleAttributes: [
            "SK",
            "PK",
            "id",
            "openhours",
            "adress",
            "pic_url",
            "small_url",
            "GSI1-PK",
            "GSI1-SK",
            "entityType",
          ],
        },
        {
          id: 1,
          title: "Adresse",
          data: {},
          options: {
            postleitzahl: {
              title: "PLZ",
              isMutable: true,
              isdefault: true,
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
        {
          id: 2,
          title: "Öffnungszeiten",
          data: {},
          options: {
            Montag: {
              title: "Montag",
              isMutable: true,
              isdefault: true,
              type: "time",
            },
            Diensttag: {
              title: "Dienstag",
              isMutable: true,
              isDefault: true,
              type: "time",
            },
            Mittwoch: {
              title: "Mittwoch",
              isMutable: true,
              isDefault: true,
              type: "time",
            },
            Donnerstag: {
              title: "Donnerstag",
              isMutable: true,
              isDefault: true,
              type: "time",
            },
            Freitag: {
              title: "Freitag",
              isMutable: true,
              isDefault: true,
              type: "time",
            },
            Samstag: {
              title: "Samstag",
              isMutable: true,
              isDefault: true,
              type: "time",
            },
            Sonntag: {
              title: "Sonntag",
              isMutable: true,
              isDefault: true,
              type: "time",
            },
          },
          isMutable: true,
          invisibleAttributes: ["SK", "PK", "id"],
        },
        {
          id: 3,
          title: "Restaurantbild",
          data: { picture: { url: null, uploadedPicture: null } },
          options: {
            picture: {
              title: "Restaurantbild hochladen",
              isMutable: true,
              isDefault: true,
              type: "picture",
            },
          },
          isMutable: true,
          invisibleAttributes: [],
        },
      ],
    };
  },
  methods: {
    updateData: function (payload) {
      const { id, items } = payload;

      switch (id) {
        case 0:
          this.updateRestaurantInfo(items);
          break;
        case 1:
          this.updateRestaurantAdress(items);
          break;
        case 2:
          this.updateOpeningHours(items);
          break;
        case 3:
          this.updateRestaurantPicture(items);
          break;
        default:
          break;
      }
    },
    async updateRestaurantPicture(data) {
      this.isLoading = true;

      const user = this.$store.getters.getCurrentUser;

      const { uploadedPicture, url } = data.picture;

      try {
        const result = await HTTP_SERVICE_INSTANCE.get(
          `/uploads?userid=${user.id}&type=info`
        );

        const { uploadURL } = result;

        const result2 = await fetch(uploadURL, {
          method: "PUT",
          body: uploadedPicture,
        });

        this.userdata[3].data.picture = {
          url: url,
          uploadedPicture: uploadedPicture,
        };

        this.errormessage = "";
      } catch (error) {
        this.errormessage =
          "Update war aufgrund eines internen Fehlers nicht möglich";
      } finally {
        this.isLoading = false;
      }

      this.isLoading = false;
    },
    async updateOpeningHours(data) {
      this.isLoading = true;

      const user = this.$store.getters.getCurrentUser;
      const payload = {
        updateType: "openinghours",
        openinghours: data,
      };
      try {
        await HTTP_SERVICE_INSTANCE.put(`/restaurants/${user.id}`, payload);

        this.userdata[2].data = data;

        this.errormessage = "";
      } catch (error) {
        this.errormessage =
          "Update war aufgrund eines internen Fehlers nicht möglich";
      } finally {
        this.isLoading = false;
      }
    },
    async updateRestaurantInfo(data) {
      const { restaurantName, description } = data;

      this.isLoading = true;

      const user = this.$store.getters.getCurrentUser;
      const payload = {
        updateType: "info",
        restaurantName,
        description,
      };
      try {
        await HTTP_SERVICE_INSTANCE.put(`/restaurants/${user.id}`, payload);

        this.userdata[0].data.restaurantName = restaurantName;
        this.userdata[0].data.description = description;

        this.errormessage = "";
      } catch (error) {
        this.errormessage =
          "Update war aufgrund eines internen Fehlers nicht möglich";
      } finally {
        this.isLoading = false;
      }
    },
    async updateRestaurantAdress(data) {
      this.isLoading = true;

      const user = this.$store.getters.getCurrentUser;
      const payload = {
        updateType: "adress",
        adress: data,
      };
      try {
        await HTTP_SERVICE_INSTANCE.put(`/restaurants/${user.id}`, payload);

        this.userdata[1].data = data;

        this.errormessage = "";
      } catch (error) {
        this.errormessage =
          "Update war aufgrund eines internen Fehlers nicht möglich";
      } finally {
        this.isLoading = false;
      }
    },
    getRestaurantData: async function () {
      this.isLoading = true;

      const user = this.$store.getters.getCurrentUser;

      try {
        const result = await HTTP_SERVICE_INSTANCE.get(
          `/restaurants/${user.id}`
        );

        this.userdata[0].data = result.Item;
        this.userdata[1].data = result.Item.adress;
        this.userdata[2].data = result.Item.openhours;

        const url = result.Item.pic_url ? result.Item.pic_url : "";

        this.userdata[3].data = {
          picture: { url: url, uploadedPicture: null },
        };
      } catch (error) {
        this.errormessage =
          "Nutzerdaten konnten aufgrund eines Fehlers nicht beschafft werden";
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.getRestaurantData();
  },
};
</script>

<style></style>
