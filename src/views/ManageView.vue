<template>
  <main>
    <!-- Main Content -->
    <section class="container mx-auto mt-6 pb-20">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
          <app-upload ref="upload" :addSong="addSong" />
        </div>
        <div class="col-span-2">
          <div
            class="bg-primary rounded border border-secondary relative flex flex-col"
          >
            <div
              class="px-6 pt-6 pb-5 font-bold border-b border-secondary bg-white/25"
            >
              <span class="card-title text-pale font-bold text-xl">{{
                $t("manage.my_songs")
              }}</span>
              <i
                class="fa fa-compact-disc float-right text-secondary text-2xl"
              ></i>
            </div>
            <div class="p-6">
              <!-- Composition Items -->
              <composition-item
                v-for="(song, i) in songs"
                :key="song.docID"
                :song="song"
                :updateSong="updateSong"
                :index="i"
                :removeSong="removeSong"
                :updateUnsavedFlag="updateUnsavedFlag"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import AppUpload from "@/components/AppUpload.vue";
import CompositionItem from "@/components/CompositionItem.vue";
import {
  auth,
  songsCollection,
  query,
  where,
  getDocs,
} from "@/includes/firebase";
export default {
  name: "ManageView",
  components: { AppUpload, CompositionItem },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  async created() {
    const q = query(songsCollection, where("uid", "==", auth.currentUser.uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(this.addSong);
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genre = values.genre;
    },
    removeSong(i) {
      this.songs.splice(i, 1);
    },
    addSong(document) {
      const song = {
        ...document.data(),
        docID: document.id,
      };
      this.songs.push(song);
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      const leave = confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      next(leave);
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUploads();
  // },
};
</script>
