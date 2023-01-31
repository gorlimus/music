<template>
  <app-header />

  <router-view></router-view>

  <!-- Player -->
  <app-player></app-player>
  <!-- Auth Modal -->
  <app-auth />
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppPlayer from "@/components/AppPlayer.vue";
import AppAuth from "@/components/AppAuth.vue";
import { mapWritableState } from "pinia";
import useUserStore from "@/stores/user";
import { auth } from "@/includes/firebase";

export default {
  name: "app",
  components: {
    AppHeader,
    AppPlayer,
    AppAuth,
  },
  computed: {
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true;
    }
  },
};
</script>
