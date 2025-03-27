<script lang="ts">
import { defineComponent } from 'vue'
import {collection, doc, getDoc, getDocs, query, where} from 'firebase/firestore';
import {useNuxtApp} from "#app/nuxt";

export default defineComponent({
  data() {
    return {
      userTranslations: [],
      loggedInName: "",
      loadingUser: true,
    }
  },

  mounted() {
    this.fetchUserTranslations();
    this.getUsersName();
  },

  methods: {
    async fetchUserTranslations() {
      const {$firestore, $auth} = useNuxtApp();
      const user = $auth.currentUser;

      if (!user) {
        console.error("No user is signed in.");
        return;
      }

      const userId = user.uid;
      const translationsRef = collection($firestore, "translations");

      try {
        const q = query(translationsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const userTranslations = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        this.userTranslations = userTranslations.slice().sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        console.log(userTranslations)
      } catch (error) {
        console.error("Error fetching user translations:", error);
      }
    },

    async getUsersName() {
      const {$auth, $firestore} = useNuxtApp();
      const user = $auth.currentUser;
      if (user) {
        const userId = user.uid;
        const userRef = doc($firestore, "users", userId);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User Name:", userData.name);
            this.loggedInName = userData.name
          } else {
            console.log("No user data found.");
          }
        } catch (error) {
          console.error("Error getting user data:", error);
        }
        finally {
          this.loadingUser = false
        }
      } else {
        console.log("No user logged in.");
        this.loadingUser = false
      }
    },
  },
})
</script>

<template>
  <div v-if="loadingUser" class="text-h2 mb-4"></div>
  <div v-else-if="loggedInName" class="text-h2 mb-4">History for {{loggedInName}}
    <div class="ma-8" v-if="userTranslations">
      <v-row>
        <v-col>
          <div class="text-h4 text-decoration-underline text-center">Image</div>
        </v-col>
        <v-col>
          <div class="text-h4 text-decoration-underline text-center">Transcribed text</div>
        </v-col>
        <v-col>
          <div class="text-h4 text-decoration-underline text-center">Translated text</div>
        </v-col>
        <v-col>
          <div class="text-h4 text-decoration-underline text-center">Timestamp</div>
        </v-col>
      </v-row>
      <v-row v-for="translation in userTranslations">
        <v-col class="border-s-xl border-e-xl border-t-xl border-b-xl">
          <v-img :src="translation.image"/>
        </v-col>
        <v-col class="border-e-xl border-t-xl border-b-xl">
          <p class="text-h5"> {{ translation.transcribedText }} </p>
        </v-col>
        <v-col class="border-e-xl border-t-xl border-b-xl">
          <p class="text-h5"> {{ translation.translatedText }} </p>
        </v-col>
        <v-col class="border-e-xl border-t-xl border-b-xl">
          <p class="text-h5 "> {{ new Date(translation.timestamp.seconds * 1000).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
          }) }}</p>
        </v-col>
      </v-row>
    </div>
  </div>
  <div v-else class="text-h2 mb-4">Log in to view translation history</div>
</template>

<style scoped>
</style>