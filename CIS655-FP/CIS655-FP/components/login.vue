<script lang="ts">
import {defineComponent} from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import {useNuxtApp} from "#app/nuxt";

export default defineComponent({
  name: "login",

  data() {
    return {
      nuxtApp: useNuxtApp(),
      email: "",
      password: "",
      error: "",
      show1: false
    }
  },

  methods: {
    async handleSignIn() {
      try {
        const { $auth } = useNuxtApp();
        const userCredentials = await signInWithEmailAndPassword($auth, this.email, this.password);
        await this.$router.push('/')
      } catch (error) {
        this.error = error.message.split("(")[0].trim()
        console.error('Error signing in:', error.message)
      }
    },
  },
})
</script>

<template>
  <div style="width: 500px; border: 4px solid rebeccapurple; border-radius: 10px" class="">
    <div class="ma-8">
      <div class="text-h4 mb-8">Login to img.translate</div>
      <v-text-field label="Email" v-model="email"></v-text-field>
      <v-text-field
          v-model="password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
          label="Password"
          counter
          @click:append="show1 = !show1"
      ></v-text-field>      <v-row class="mt-2">
        <v-btn variant="elevated" @click="handleSignIn()">Login</v-btn>
        <v-btn variant="plain" @click="$router.push('/signup')">Sign Up Instead</v-btn>
      </v-row>
      <p class="mt-8 text-red" v-if="this.error">{{this.error}}</p>
    </div>
  </div>
</template>

<style scoped>

</style>