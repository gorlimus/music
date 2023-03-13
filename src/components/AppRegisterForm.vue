<template>
  <!-- Registration Form -->
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="reg_show_alert"
    :class="reg_alert_variant"
  >
    {{ reg_alert_msg }}
  </div>
  <vee-form
    :validation-schema="schema"
    @submit="register"
    :initial-values="userData"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("register.name") }}</label>
      <vee-field
        type="text"
        name="name"
        class="block w-full py-1.5 px-3 text-pale border border-bluAcc/25 transition duration-500 focus:outline-none focus:border-bluAcc rounded bg-white/50 focus:bg-white/75"
        placeholder="Enter Name"
      />
      <ErrorMessage class="text-secondary" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("register.email") }}</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-pale border border-bluAcc/25 transition duration-500 focus:outline-none focus:border-bluAcc rounded bg-white/50 focus:bg-white/75"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-secondary" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("register.age") }}</label>
      <vee-field
        type="number"
        name="age"
        class="block w-full py-1.5 px-3 ttext-pale border border-bluAcc/25 transition duration-500 focus:outline-none focus:border-bluAcc rounded bg-white/50 focus:bg-white/75"
      />
      <ErrorMessage class="text-secondary" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("register.password") }}</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          class="block w-full py-1.5 px-3 text-pale border border-bluAcc/25 transition duration-500 focus:outline-none focus:border-bluAcc rounded bg-white/50 focus:bg-white/75"
          type="password"
          placeholder="Password"
          v-bind="field"
        />
        <div class="text-secondary" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{
        $t("register.confirm_password")
      }}</label>
      <vee-field
        type="password"
        name="confirm_password"
        class="block w-full py-1.5 px-3 text-pale border border-bluAcc/25 transition duration-500 focus:outline-none focus:border-bluAcc rounded bg-white/50 focus:bg-white/75"
        placeholder="Confirm Password"
      />
      <ErrorMessage class="text-secondary" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("register.country") }}</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-pale border border-bluAcc/25 transition duration-500 focus:outline-none focus:border-bluAcc rounded bg-white/50 focus:bg-white/75"
      >
        <option value="USA">{{ $t("register.usa") }}</option>
        <option value="Europe">{{ $t("register.europe") }}</option>
        <option value="Israel">{{ $t("register.israel") }}</option>
        <option value="Russia">{{ $t("register.russia") }}</option>
      </vee-field>
      <ErrorMessage class="text-secondary" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        type="checkbox"
        id="checkbox"
        name="tos"
        value="1"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded accent-bluAcc"
      />
      <label
        class="inline-block"
        for="checkbox"
        keypath="register.accept"
        tag="label"
      >
        {{ $t("register.tos") }}
      </label>
      <ErrorMessage class="text-secondary block" name="tos" />
    </div>
    <button
      type="submit"
      class="block w-full bg-bluAcc/75 text-white py-1.5 px-3 rounded transition hover:bg-bluAcc"
      :disabled="reg_in_submission"
    >
      {{ $t("register.submit") }}
    </button>
  </vee-form>
</template>
<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user";

export default {
  name: "AppRegisterForm",
  data() {
    return {
      schema: {
        name: "required|min:3|max:50|alpha_spaces",
        email: "required|max:50|email",
        age: "required|min_value:13|max_value:120",
        password: "required|min:9|max:50|excluded:password",
        confirm_password: "password_mismatch:@password",
        country: "required|country_excluded:Russia",
        tos: "tos",
      },
      userData: {
        country: "USA",
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: "bg-blue-500",
      reg_alert_msg: "Please wait! Your account is being created.",
    };
  },
  methods: {
    ...mapActions(useUserStore, {
      createUser: "register",
    }),
    async register(values) {
      this.reg_show_alert = true;
      this.reg_in_submission = true;
      this.reg_alert_variant = "bg-bluAcc";
      this.reg_alert_msg = "Please wait! Your account is being created.";
      //auth user & add to DB
      try {
        this.createUser(values);
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = "bg-secondary";
        this.reg_alert_msg =
          "An unexpected error occured. Please try again later.";
        return;
      }
      this.reg_alert_variant = "bg-greAcc";
      this.reg_alert_msg = "Success!";
    },
  },
};
</script>
