<template>
  <div class="border border-secondary p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold text-secondary">
        {{ song.modified_name }}
      </h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-secondary/75 float-right hover:bg-secondary transition"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-bluAcc/75 float-right hover:bg-bluAcc transition"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>

    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 rounded mb-4"
        v-if="show_alert"
        :class="alert_variant"
      >
        {{ alert_msg }}
      </div>
      <vee-form
        :validation-schema="schema"
        @submit="edit"
        :initial-values="song"
      >
        <div class="mb-3">
          <label class="inline-block mb-2 text-secondary">{{
            song.modified_name
          }}</label>
          <vee-field
            name="modified_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-secondary transition duration-500 focus:outline-none focus:border-bluAcc rounded bg-white/50 focus:bg-white/75"
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-secondary" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">{{ song.genre }}</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-pale border border-secondary transition duration-500 focus:outline-none focus:border-bluAcc rounded bg-white/50 focus:bg-white/75"
            placeholder="Enter Genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-secondary" name="genre" />
        </div>
        <div class="w-full flex justify-between">
          <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-greAcc/75 hover:bg-greAcc transition"
            :disabled="in_submission"
            @click="showForm = false"
          >
            Submit
          </button>
          <button
            type="button"
            class="py-1.5 px-3 rounded text-white bg-bluAcc/75 hover:bg-bluAcc transition"
            :disabled="in_submission"
            @click="showForm = false"
          >
            Go Back
          </button>
        </div>
      </vee-form>
    </div>
  </div>
</template>

<script>
import {
  db,
  doc,
  updateDoc,
  deleteDoc,
  storage,
  ref,
  deleteObject,
} from "@/includes/firebase";

export default {
  name: "CompositionItem",
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: "required",
        genre: "alpha_spaces",
      },
      in_submission: false,
      show_alert: false,
      alert_variant: "bg-bluAcc",
      alert_msg: "Please wait! Updating song info.",
    };
  },
  methods: {
    async edit(values) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = "bg-bluAcc";
      this.alert_msg = "Please wait! Updating song info.";

      const songRef = doc(db, "songs", this.song.docID);

      try {
        await updateDoc(songRef, values);
      } catch (error) {
        this.in_submission = false;
        this.show_alert = true;
        this.alert_variant = "bg-secondary";
        this.alert_msg = "Something went wrong. Try again later.";
        return;
      }
      this.updateSong(this.index, values);
      this.updateUnsavedFlag(false);

      this.in_submission = false;
      this.alert_variant = "bg-greAcc";
      this.alert_msg = "Success";
    },
    async deleteSong() {
      const songRef = ref(storage, `songs/${this.song.original_name}`);
      await deleteObject(songRef);
      console.log("Deleted from storage!");

      //   const songRef = doc(db, "songs", this.song.docID);
      await deleteDoc(doc(db, "songs", this.song.docID));
      console.log("Deleted from db");
      this.removeSong(this.index);
    },
  },
};
</script>
