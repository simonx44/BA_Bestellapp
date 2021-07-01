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
      <v-btn class="mt-3" @click="signUp" :disabled="!inputIsValid" block>
        <span v-if="!isLoading">SignUp</span>
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
        <span class="font-weight-bold">{{ username }}</span> eingeben:</label
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
      <v-btn
        class="mt-3"
        @click="confirmSignUp"
        block
        :disabled="!authentificationCode"
      >
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
  props: ["userType"],
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
    signUp: async function () {
      try {
        if (!this.userType || !this.username || !this.password) {
          this.errormessage = "error";
          return;
        }
        this.isLoading = true;
        const { username, password } = this;
        const isCustomer = this.userType == 1 ? "true" : "false";

        const user = await Auth.signUp({
          username,
          password,
          attributes: {
            "custom:isCustomer": isCustomer,
          },
        });
        this.user = user;
        this.step = 1;
        this.errormessage = "";
        this.isLoading = false;
      } catch (error) {
        this.errormessage = error.message;
        this.isLoading = false;
      }
    },
    confirmSignUp: async function () {
      try {
        this.isLoading = true;
        //Bestätigen
        await Auth.confirmSignUp(this.username, this.authentificationCode);
        const user = await Auth.signIn(this.username, this.password);
        this.errormessage = "";
        const { attributes } = user;
        this.$store.commit("setCurrentUser", {
          id: attributes.sub,
          email: attributes.email,
          isCustomer: this.userType == 1,
        });
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.errormessage = error.message;
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
