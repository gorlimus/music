<template>
  <div class="fixed bottom-0 left-0 bg-pale px-4 py-2 w-full">
    <!-- Track Info -->
    <div class="text-center text-secondary" v-if="current_song.modified_name">
      <span class="song-title font-bold">
        {{ current_song.modified_name }}</span
      >
      by
      <span class="song-artist">{{ current_song.display_name }}</span>
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <!-- Play/Pause Button -->
      <button @click.prevent="toggleAudio" type="button">
        <i
          class="fa text-secondary text-xl"
          :class="{ 'fa-play': !playing, 'fa-pause': playing }"
        >
        </i>
      </button>
      <!-- Current Position -->
      <div class="player-currenttime text-secondary">{{ seek }}</div>
      <!-- Scrub Container  -->
      <div
        @click.prevent="updateSeek"
        class="w-full h-2 rounded bg-primary relative cursor-pointer"
      >
        <!-- Player Ball -->
        <span
          class="absolute -top-2.5 -ml-2.5 text-secondary text-lg"
          :style="{ left: playerProgress }"
        >
          <i class="fas fa-circle"></i>
        </span>
        <!-- Player Progress Bar-->
        <span
          class="block h-2 rounded bg-gradient-to-r from-greAcc to-greAcc"
          :style="{ width: playerProgress }"
        ></span>
      </div>
      <!-- Duration -->
      <div class="player-duration text-secondary">{{ duration }}</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import usePlayerStore from "@/stores/player";
export default {
  name: "AppPlayer",
  methods: {
    ...mapActions(usePlayerStore, ["toggleAudio", "updateSeek"]),
  },
  computed: {
    ...mapState(usePlayerStore, [
      "playing",
      "duration",
      "seek",
      "playerProgress",
      "current_song",
    ]),
  },
  created() {},
};
</script>
