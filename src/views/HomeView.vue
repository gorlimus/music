<template>
  <main>
    <!-- intro -->
    <section class="mb-8 pb-20 text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg bg-pale"
      ></div>
      <div class="container mx-auto">
        <div class="text-primary main-header-content">
          <h1 class="font-bold text-5xl mb-5">
            {{ $t("home.listen") }}
          </h1>
          <p class="w-full md:w-6/12 mx-auto text-secondary text-lg px-2">
            {{ $t("home.description") }}
          </p>
        </div>
      </div>
    </section>
    <!-- main -->
    <section class="container mx-auto mb-20">
      <div
        class="bg-primary rounded border border-secondary relative flex flex-col"
      >
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-secondary bg-white/25"
        >
          <span class="card-title text-pale font-bold text-xl">
            {{ $t("home.songs") }}
          </span>
          <i v-icon.right.secondary="'headphones-alt'"></i>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <song-item v-for="song in songs" :key="song.docID" :song="song" />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>
<script>
import SongItem from "@/components/SongItem.vue";
import {
  db,
  songsCollection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  startAfter,
  limit,
} from "@/includes/firebase";

export default {
  name: "HomeView",
  components: { SongItem },
  data() {
    return {
      songs: [],
      maxPerPage: 10,
      pendingRequest: false,
    };
  },
  async created() {
    this.getSongs();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow =
        Math.round(scrollTop) + innerHeight === offsetHeight;

      if (bottomOfWindow) {
        this.getSongs();
      }
    },
    async getSongs() {
      if (this.pendingRequest) {
        return;
      }
      this.pendingRequest = true;
      let songsSnapshots;

      if (this.songs.length) {
        const lastDocSnap = await getDoc(
          doc(db, "songs", this.songs[this.songs.length - 1].docID)
        );
        const NEXT = await query(
          songsCollection,
          orderBy("modified_name"),
          startAfter(lastDocSnap),
          limit(this.maxPerPage)
        );
        songsSnapshots = await getDocs(NEXT);
      } else {
        const FIRST = await query(
          songsCollection,
          orderBy("modified_name"),
          limit(this.maxPerPage)
        );
        songsSnapshots = await getDocs(FIRST);
      }

      songsSnapshots.forEach((document) => {
        this.songs.push({
          ...document.data(),
          docID: document.id,
        });
      });

      this.pendingRequest = false;
    },
  },
};
</script>
