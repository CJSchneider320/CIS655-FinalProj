<script lang="ts">
import { defineComponent } from 'vue'
import {addDoc, collection, doc, getDoc} from 'firebase/firestore';
import {useNuxtApp} from "#app/nuxt";
import {target} from "@vue/devtools-shared";

export default defineComponent({
  data() {
    return {
      fileB64: "",
      imageUrl: "",
      transcribedText: "",
      translatedText: "",
      targetLanguage: "",
      loggedInName: "",
      loadingUser: true,
      translationComplete: false,
      languages: [
        {name: "English", code: "en"},
        {name: "Spanish", code: "es"},
        {name: "French", code: "fr"},
        {name: "German", code: "de"},
        {name: "Italian", code: "it"},
        {name: "Japanese", code: "ja"},
        {name: "Chinese", code: "zh"},
        {name: "Arabic", code: "ar"},
        {name: "Ukrainian", code: "uk"},
      ]
    }
  },

  mounted() {
    this.getUsersName()
  },

  methods: {

    async doFullTranslation() {
      if (!this.fileB64 || !this.targetLanguage) {
        console.error('File or target language not selected');
        return;
      }

      try {
        await this.transcribeImage();
        if (!this.transcribedText) {
          console.error('No transcribed text found');
          return;
        }

        await this.translateImageText();
        if (!this.translatedText) {
          console.error('Translation failed');
          return;
        }

        await this.storeTranslation();
        console.log('Translation stored successfully');

        this.translationComplete = true
      } catch (error) {
        console.error('Error in processing image:', error);
      }
    },

    resetTranslation: function() {
      this.fileB64 = ""
      this.imageUrl = ""
      this.transcribedText = ""
      this.translatedText = ""
      this.targetLanguage = ""
      this.translationComplete = false
    },

    target() {
      return target
    },

    handleFileUpload: function (event: Event) {
      this.fileB64 = ""
      this.transcribedText = ""
      this.translatedText = ""
      const fileInput = (event.target as HTMLInputElement)
      const file = fileInput?.files?.[0]

      if (file) {
        const reader = new FileReader()

        reader.readAsDataURL(file)

        reader.onload = () => {
          this.fileB64 = reader.result as string
          console.log('Base64: ', this.fileB64)
        }

        reader.onerror = (error) => {
          console.error('Error reading file: ', error)
        }
      }
    },

    async transcribeImage() {
      if (!(this.fileB64)) {
        console.error('No image selected');
        return;
      }

      try {
        const response = await fetch('https://cis655-fp-image-transcription-366529428684.us-central1.run.app', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({imageBase64: this.fileB64.split(',')[1]})
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Error:', error);
          return;
        }

        const data = await response.json();
        this.transcribedText = data.transcribed_text || 'No text found in the image';
        this.imageUrl = data.imageUrl;
      } catch (error) {
        console.error('Error:', error);
      }
    },

    async translateImageText() {
      if (!(this.transcribedText)) {
        console.error('No transcribed text');
        return;
      }
      try {
        const response = await fetch('https://cis655-fp-translation-366529428684.us-central1.run.app', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({text: this.transcribedText, target_lang: this.targetLanguage})
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Error:', error);
          return;
        }

        const data = await response.json();
        this.translatedText = data.translated_text || 'Translation Error';
      } catch (error) {
        console.error('Error:', error);
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

    async storeTranslation() {
      const { $firestore, $auth } = useNuxtApp();
      const user = $auth.currentUser;
      if (user) {
        await addDoc(collection($firestore, "translations"), {
          userId: user.uid,
          timestamp: new Date(),
          image: this.imageUrl,
          transcribedText: this.transcribedText,
          translatedText: this.translatedText,
        });
      }
    },
  },
})
</script>

<template>
  <div>
    <div v-if="loadingUser" class="text-h2 mb-4"></div>
    <div v-else-if="loggedInName" class="text-h2 mb-4">Hello {{loggedInName}}!</div>
    <div v-else class="text-h2 mb-4">Log in to save translations</div>
    <v-file-input :disabled="translationComplete" accept="image/*" label="File input" @change="handleFileUpload"></v-file-input>
    <v-select
        v-model="targetLanguage"
        :disabled="translationComplete"
        :items="languages"
        item-title="name"
        item-value="code"
        label="Select a Language"
    ></v-select>
    <v-row>
      <v-col>
        <p class="text-h4">Image to Translate: </p>
        <v-img :src="fileB64" :height="450"/>
        <v-btn class="mt-4" v-if="translationComplete" @click="resetTranslation()">Translate Another Image</v-btn>
        <v-btn class="mt-4" v-else-if="fileB64" @click="doFullTranslation()">Translate Image!</v-btn>
      </v-col>
      <v-col>
        <div v-if="translationComplete">
          <p class="text-h3 mt-8">Transcribed Text: </p>
          <p v-if="transcribedText">{{ transcribedText }}</p>

          <p class="text-h3 mt-8">Translated Text: </p>
          <p v-if="translatedText">{{ translatedText }}</p>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
</style>