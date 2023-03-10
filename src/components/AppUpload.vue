<template>
  <div
    class="bg-primary rounded border border-secondary relative flex flex-col"
  >
    <div class="px-6 pt-6 pb-5 font-bold border-b border-secondary bg-white/25">
      <span class="card-title text-pale font-bold text-xl">Upload</span>
      <i class="fas fa-upload float-right text-greAcc text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-bluAcc text-bluAcc/50 transition duration-500 hover:text-white hover:bg-greAcc/75 hover:border-greAcc hover:border-solid"
        :class="{ 'bg-greAcc border-greAcc border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragente.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  storage,
  ref,
  uploadBytesResumable,
  auth,
  getDownloadURL,
  songsCollection,
  addDoc,
  getDoc,
} from "@/includes/firebase";

export default {
  name: "AppUpload",
  data() {
    return {
      is_dragover: false,
      uploads: [],
    };
  },
  props: ["addSong"],
  methods: {
    upload($event) {
      this.is_dragover = false;

      //converting obj into array
      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];

      files.forEach((file) => {
        if (file.type !== "audio/mpeg") {
          return;
        }
        if (!navigator.onLine) {
          this.uploads.push({
            uploadTask: {},
            current_progress: 100,
            name: file.name,
            variant: "bg-red-400",
            icon: "fas fa-times",
            text_class: "text-red-400",
          });
          return;
        }
        const songRef = ref(storage, `songs/${file.name}`);
        const uploadTask = uploadBytesResumable(songRef, file);

        const uploadIndex =
          this.uploads.push({
            uploadTask,
            current_progress: 0,
            name: file.name,
            variant: "bg-blue-400",
            icon: "fas fa-spinner fa-spin",
            text_class: "",
          }) - 1;

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].current_progress = progress;
          },
          (error) => {
            this.uploads[uploadIndex].variant = "bg-red-400";
            this.uploads[uploadIndex].icon = "fas fa-times";
            this.uploads[uploadIndex].text_class = "text-red-400";
            console.log(error);
          },
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: uploadTask.snapshot.ref.name,
              modified_name: uploadTask.snapshot.ref.name,
              genre: "",
              comment_count: 0,
            };

            song.url = await getDownloadURL(uploadTask.snapshot.ref);
            const songRef = await addDoc(songsCollection, song);
            const songSnapshot = await getDoc(songRef);

            this.addSong(songSnapshot);

            this.uploads[uploadIndex].variant = "bg-green-400";
            this.uploads[uploadIndex].icon = "fas fa-check";
            this.uploads[uploadIndex].text_class = "text-green-400";
          }
        );
      });
    },
    // cancelUploads() {
    //   this.uploads.forEach((upload) => {
    //     upload.uploadTask.cancel();
    //   });
    // },
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.uploadTask.cancel();
    });
  },
};
</script>
