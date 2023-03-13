<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-secondary relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg bg-pale"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="newSong(song)"
          type="button"
          class="mx-4 z-50 h-24 w-24 text-3xl bg-primary text-secondary rounded-full focus:outline-none"
        >
          <i
            :class="{ 'fa-play': !playing, 'fa-pause': playing }"
            class="fa"
          ></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-primary rounded border border-secondary relative flex flex-col"
      >
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-secondary relative"
        >
          <!-- Comment Count -->
          <span class="card-title text-pale">
            {{
              $tc("song.comment_count", song.comment_count, {
                count: song.comment_count,
              })
            }}</span
          >
          <select
            v-model="sort"
            class="block py-1.5 px-3 text-pale border border-secondary bg-white/50 transition duration-500 focus:outline-none focus:border-bluAcc rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
          <i
            class="absolute right-4 bottom-10 fa fa-comments float-right text-secondary text-2xl"
          ></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="comment_show_alert"
            :class="comment_alert_variant"
          >
            {{ comment_alert_msg }}
          </div>
          <vee-form
            v-if="userStore.userLoggedIn"
            :validation-schema="schema"
            @submit="addComment"
          >
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-pale border border-secondary transition-all duration-500 focus:outline-none focus:border-bluAcc rounded mb-4 bg-white/50"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage class="text-secondary" name="comment" />
            <button
              :disabled="comment_in_submission"
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-greAcc block"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto mb-20">
      <li
        v-for="comment in sortedComments"
        :key="comment.docID"
        class="p-6 bg-primary border border-secondary"
      >
        <!-- Comment Author -->
        <div class="mb-2">
          <div class="font-bold text-secondary">{{ comment.name }}</div>
          <time class="text-pale/25">{{ comment.datePosted }}</time>
        </div>

        <p class="text-pale">
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import {
  db,
  commentsCollection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  auth,
  where,
} from "@/includes/firebase";
import { mapState, mapStores, mapActions } from "pinia";
import useUserStore from "@/stores/user";
import usePlayerStore from "@/stores/player";

export default {
  name: "SongView",
  data() {
    return {
      song: {},
      comments: [],
      sort: "1",
      schema: {
        comment: "required|min:3",
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: "bg-bluAcc",
      comment_alert_msg: "Please wait! Your comment is being submitted.",
    };
  },
  computed: {
    ...mapStores(useUserStore),
    ...mapState(usePlayerStore, ["playing"]),

    sortedComments() {
      return this.comments.slice(0).sort((a, b) => {
        if (this.sort === "1") {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  async beforeRouteEnter(to, from, next) {
    const songSnap = await getDoc(doc(db, "songs", to.params.id));

    next((vm) => {
      if (!songSnap.exists()) {
        vm.$router.push({ name: "home" });
        return;
      }

      const { sort } = vm.$route.query;

      vm.sort = sort === "1" || sort === "2" ? sort : "1";

      vm.song = songSnap.data();
      vm.getComments();
    });
  },

  methods: {
    ...mapActions(usePlayerStore, ["newSong"]),

    async addComment(values, { resetForm }) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = "bg-bluAcc";
      this.comment_alert_msg = "Please wait! Your comment is being submitted.";

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      };
      await addDoc(commentsCollection, comment);

      this.getComments();

      this.comment_in_submission = false;
      this.comment_show_alert = true;
      this.comment_alert_variant = "bg-greAcc";
      this.comment_alert_msg = "Success!";

      resetForm();
    },
    async getComments() {
      const q = query(
        commentsCollection,
        where("sid", "==", this.$route.params.id)
      );
      const querySnapshot = await getDocs(q);
      this.comments = [];

      querySnapshot.forEach((document) => [
        this.comments.push({
          docID: document.id,
          ...document.data(),
        }),
      ]);
      this.song.comment_count = this.comments.length;
      await updateDoc(doc(db, "songs", this.$route.params.id), {
        comment_count: this.song.comment_count,
      });
    },
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }

      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
};
</script>
