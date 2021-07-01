<template>
  <div class="login">
    <div v-if="step == 0">
      <v-text-field
        type="text"
        label="email"
        placeholder="Your Username"
        v-model="username"
        :rules="[rules.email.regex]"
      />
      <v-text-field
        type="password"
        label="password"
        placeholder="Your Password"
        v-model="password"
        :rules="[rules.password.regex]"
      />
      <span class="text-primary" v-if="errormessage"
        >Fehler: {{ errormessage }}</span
      >
      <v-btn @click="signIn" :disabled="!inputIsValid" block>
        <span v-if="!isLoading">Login</span>
        <span v-else>
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular
        ></span>
      </v-btn>
    </div>
    <div v-else>
      <label
        >Bestätigungscode für User
        <span class="font-weight-bold">{{ username }}</span> würde neu
        verschickt. Code eingeben um mit Anmeldung fortzufahren:</label
      >
      <v-text-field
        type="text"
        label="autentification code"
        placeholder="code"
        v-model="authentificationCode"
      />
      <span class="text-primary" v-if="errormessage"
        >Fehler: {{ errormessage }}</span
      >
      <v-btn @click="confirmSignUp" block :disabled="!authentificationCode">
        <span v-if="!isLoading">Confirm</span>
        <span v-else>
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular
        ></span>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import { PASSWORD_REGEX, MAIL_REGEX } from "./config";
export default {
  data() {
    return {
      isLoading: false,
      username: "",
      password: "",
      step: 0,
      authentificationCode: "",
      errormessage: "",
      user: "",
      rules: {
        email: {
          required: (v) => !!v || "Required.",
          regex: (v) => MAIL_REGEX.test(v) || "Kein gültiges Format",
        },
        password: {
          regex: (v) =>
            PASSWORD_REGEX.test(v) ||
            "Password benötigt min 6 Zeichen sowie Klein- und Großbuchstaben",
        },
      },
    };
  },
  methods: {
    resendConfirmationCode: async function () {
      try {
        await Auth.resendSignUp(this.username);
      } catch (err) {
        this.errormessage = err.message;
      }
    },
    signIn: async function () {
      try {
        this.isLoading = true;
        const user = await Auth.signIn(this.username, this.password);

        this.errormessage = "";
        const { attributes } = user;
        const isCustomer = attributes["custom:isCustomer"] === "true";

        this.$store.commit("setCurrentUser", {
          id: attributes.sub,
          email: attributes.email,
          isCustomer: isCustomer,
        });

        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        if (error.code === "UserNotConfirmedException") {
          //Bestätigungscode wird neu zugesendet
          await this.resendConfirmationCode();
          this.step = 1;
          return;
        }

        this.errormessage = error.message;
      }
    },
    confirmSignUp: async function () {
      this.isLoading = true;
      try {
        await Auth.confirmSignUp(this.username, this.authentificationCode);
        this.errormessage = "";
        this.step = 0;
        this.isLoading = false;
      } catch (error) {
        this.errormessage = error.message;
        this.isLoading = false;
      }
    },
  },
  computed: {
    inputIsValid: function () {
      return (
        MAIL_REGEX.test(this.username) && PASSWORD_REGEX.test(this.password)
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
