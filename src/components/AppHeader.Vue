<template>
  <header id="header" class="bg-pale w-screen">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-primary font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
        >Musicify</router-link
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link class="px-2 text-primary" :to="{ name: 'about' }">{{
              $t("header.about")
            }}</router-link>
          </li>
          <li tag="li" v-if="!userStore.userLoggedIn">
            <a
              class="px-2 text-primary"
              href="#"
              @click.prevent="toggleAuthModal"
            >
              {{ $t("header.login_register") }}
            </a>
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-primary" :to="{ name: 'manage' }">
                {{ $t("header.manage") }}
              </router-link>
            </li>
            <li>
              <a class="px-2 text-primary" href="#" @click.prevent="signOut">
                {{ $t("header.logout") }}
              </a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a class="px-2 text-primary" href="#" @click.prevent="changeLocale">
              {{ currentLocale }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapStores } from "pinia";
import useModalStore from "@/stores/modal";
import useUserStore from "@/stores/user";

export default {
  name: "AppHeader",
  computed: {
    ...mapStores(useModalStore, useUserStore),
    currentLocale() {
      return this.$i18n.locale === "he" ? "עִברִית(demo)" : "English";
    },
  },
  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen;
    },
    signOut() {
      this.userStore.signOut();
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: "home" });
      }
    },
    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === "he" ? "en" : "he";
    },
  },
};
</script>
