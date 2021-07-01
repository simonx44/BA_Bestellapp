<template>
  <div class="login">
    <div v-if="step == 0">
      <v-text-field
        type="text"
        label="email"
        placeholder="email"
        v-model="username"
        :rules="[rules.email.regex]"
      />
      <span class="text-primary" v-if="errormessage"
        >Fehler: {{ errormessage }}</span
      >
      <v-btn class="mt-3" @click="requestCode" :disabled="isInputValid" block>
        <span v-if="!isLoading">Code für Reset anfordern</span>
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
        >Resetcode für
        <span class="font-weight-bold">{{ username }}</span> würde verschickt.
        Code eingeben um mit der Zurücksetzung fortzufahren:</label
      >
      <v-text-field
        type="text"
        label="autentification code"
        placeholder="code"
        v-model="authentificationCode"
      />
      <v-text-field
        type="password"
        label="password"
        placeholder="Neues Password"
        v-model="password"
        :rules="[rules.password.regex]"
      />
      <span class="text-primary" v-if="errormessage"
        >Fehler: {{ errormessage }}</span
      >
      <v-btn @click="resetPassword" block :disabled="isInputValid">
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
    requestCode: async function () {
      this.isLoading = true;

      // Send confirmation code to user's email
      Auth.forgotPassword(this.username)
        .then(() => {
          this.step = 1;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.errormessage = err.message;
        });
    },
    resetPassword: async function () {
      try {
        this.isLoading = true;
        // Collect confirmation code and new password, then
        Auth.forgotPasswordSubmit(
          this.username,
          this.authentificationCode,
          this.password
        )
          .then((data) => {
            this.isLoading = false;
            this.$emit("successfulReset", this.username);
          })
          .catch((err) => {
            this.isLoading = false;
            this.errormessage = err.message;
          });
      } catch (error) {
        this.errormessage = error.message;
      }
    },
  },
  computed: {
    isInputValid: function () {
      if (this.step === 1) {
        return (
          !PASSWORD_REGEX.test(this.password) && !this.authentificationCode
        );
      } else {
        return !MAIL_REGEX.test(this.username);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
