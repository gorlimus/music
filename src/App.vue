<template>
  <app-header />
  <!-- Introduction -->
  <app-intro />
  <!-- Main Content -->
  <app-main />
  <!-- Player -->
  <app-player />
  <!-- Auth Modal -->
  <app-auth />
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppIntro from "@/components/AppIntro.vue";
import AppMain from "@/components/AppMain.vue";
import AppPlayer from "@/components/AppPlayer.vue";
import AppAuth from "@/components/AppAuth.vue";

export default {
  name: "app",
  components: {
    AppHeader,
    AppIntro,
    AppMain,
    AppPlayer,
    AppAuth,
  },
};
</script>
