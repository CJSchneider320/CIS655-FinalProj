<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      fileB64: "",
      transcribedText: "",
      translatedText: ""
    }
  },
  computed: {
  },
  methods: {
    handleFileUpload: function(event: Event) {
      const fileInput = (event.target as HTMLInputElement)
      const file = fileInput?.files?.[0]  // Get the first file

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

    printBase64: function() {
      console.log(this.fileB64)
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
          body: JSON.stringify({ imageBase64: this.fileB64.split(',')[1] }) // Remove base64 prefix
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Error:', error);
          return;
        }

        const data = await response.json();
        this.transcribedText= data.transcribed_text || 'No text found in the image';
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
          body: JSON.stringify({ text: this.transcribedText, target_lang: "es"})
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
  },
  mounted() {
  }
})
</script>

<template>
  <div>
    <div class="text-h2 mb-4">Test</div>
    <v-file-input accept="image/*" label="File input" @change="handleFileUpload"></v-file-input>
    <v-img :src="fileB64" :width="200" />
    <v-btn @click="transcribeImage()">Transcribe Image</v-btn>
    <p v-if="transcribedText">{{ transcribedText }}</p>
    <v-btn @click="translateImageText()">Translate Text</v-btn>
    <p v-if="translatedText">{{ translatedText }}</p>
  </div>
</template>

<style scoped>
</style>