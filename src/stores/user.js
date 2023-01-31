import { defineStore } from "pinia";
import {
  auth,
  db,
  createUser,
  doc,
  setDoc,
  updateProfile,
  signInWithEmailAndPassword,
  signOut as signout,
} from "@/includes/firebase";

export default defineStore("user", {
  state: () => ({
    userLoggedIn: false,
  }),
  actions: {
    async register(values) {
      const { user } = await createUser(auth, values.email, values.password);

      await setDoc(doc(db, "users", user.uid), {
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country,
      });

      await updateProfile(user, {
        displayName: values.name,
      });

      this.userLoggedIn = true;
    },
    async authenticate(values) {
      await signInWithEmailAndPassword(auth, values.email, values.password);

      this.userLoggedIn = true;
    },
    async signOut() {
      await signout(auth);
      this.userLoggedIn = false;
    },
  },
});
