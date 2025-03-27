<script>
  import {defineComponent} from 'vue'
  import {useNuxtApp} from "#app/nuxt";
  import {createUserWithEmailAndPassword} from "firebase/auth";
  import { doc, setDoc } from 'firebase/firestore';
  export default defineComponent({
  name: "signup",

  data() {
    return {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
      error: "",
      show1: false,
      show2: false
    }
  },

  methods: {
    async handleRegistration() {
      if(!this.isPasswordValid) {
        this.error = "Make sure all password requirements are complete."
        return
      }
      try {
        this.error = ""
        const {$auth} = useNuxtApp();
        console.log($auth)
        const userCredentials = await createUserWithEmailAndPassword($auth, this.email, this.password);

        this.user = userCredentials.user;
        await this.createUserInDb(userCredentials.user.uid)

        console.log('User created:', userCredentials.user);
        await this.$router.push('/')
      } catch (error) {
        this.error = error.message.split("(")[0].trim()
        console.error('Error creating user:', error.message);
      }
    },

    async createUserInDb(userId) {
      try {
        await setDoc(doc($firestore, "users", userId), {
          name: this.name,
          email: this.email,
          id: userId,
          createdAt: new Date(),
        });
        console.log('Added firestore document:', userId);
      } catch (error) {
        console.error('Error adding document:', error);
      }
    },
  },

  computed: {
    passwordLengthCheck: function() {
      return this.password.length >= 8
    },

    passwordUpperCheck: function() {
      return /[A-Z]/.test(this.password)
    },

    passwordLowerCheck: function() {
      return /[a-z]/.test(this.password)
    },

    passwordDigitCheck: function() {
      return /[0-9]/.test(this.password)
    },

    passwordSymbolCheck: function() {
      return /[^a-zA-Z\d]/.test(this.password)
    },

    passwordMatchCheck: function() {
      return this.password === this.repeatPassword && (this.password.length > 1 || this.repeatPassword.length > 1)
    },

    isPasswordValid: function() {
      return this.passwordLengthCheck && this.passwordUpperCheck && this.passwordLowerCheck && this.passwordDigitCheck && this.passwordSymbolCheck && this.passwordMatchCheck
    }
  },
  })
</script>

<template>
  <div style="width: 500px; border: 4px solid rebeccapurple; border-radius: 10px" class="">
    <div class="ma-8">
      <div class="text-h4 mb-8">Welcome to img.translate!</div>
      <v-text-field label="Name" v-model="name"></v-text-field>
      <v-text-field label="Email" v-model="email"></v-text-field>
      <v-text-field
          v-model="password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
          label="Password"
          counter
          @click:append="show1 = !show1"
      ></v-text-field>
      <v-text-field
          v-model="repeatPassword"
          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show2 ? 'text' : 'password'"
          label="Re-enter password"
          counter
          @click:append="show2 = !show2"
      ></v-text-field>
      <div class="d-flex align-center">
        <v-icon v-if="passwordLengthCheck" color="green">mdi-check-bold</v-icon>
        <v-icon v-else color="red">mdi-close-thick</v-icon>
        <p class="ml-2">Password is at least 8 characters long</p>
      </div>
      <div class="d-flex align-center">
        <v-icon v-if="passwordUpperCheck" color="green">mdi-check-bold</v-icon>
        <v-icon v-else color="red">mdi-close-thick</v-icon>
        <p class="ml-2">Password includes at least one uppercase letter</p>
      </div>
      <div class="d-flex align-center">
        <v-icon v-if="passwordLowerCheck" color="green">mdi-check-bold</v-icon>
        <v-icon v-else color="red">mdi-close-thick</v-icon>
        <p class="ml-2">Password includes at least one lowercase letter</p>
      </div>
      <div class="d-flex align-center">
        <v-icon v-if="passwordDigitCheck" color="green">mdi-check-bold</v-icon>
        <v-icon v-else color="red">mdi-close-thick</v-icon>
        <p class="ml-2">Password includes at least one digit (0-9)r</p>
      </div>
      <div class="d-flex align-center">
        <v-icon v-if="passwordSymbolCheck" color="green">mdi-check-bold</v-icon>
        <v-icon v-else color="red">mdi-close-thick</v-icon>
        <p class="ml-2">Password includes at least one symbol</p>
      </div>
      <div class="d-flex align-center">
        <v-icon v-if="passwordMatchCheck" color="green">mdi-check-bold</v-icon>
        <v-icon v-else color="red">mdi-close-thick</v-icon>
        <p class="ml-2">Passwords match</p>
      </div>
      <v-row class="mt-2">
        <v-btn variant="elevated" @click="handleRegistration()">Sign Up</v-btn>
        <v-btn variant="plain" @click="$router.push('/login')">Login Instead</v-btn>
      </v-row>
      <p class="mt-8 text-red" v-if="this.error">{{this.error}}</p>
    </div>
  </div>
</template>

<style scoped>

</style>