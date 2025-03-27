<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer app class="bg-deep-purple" width="219">
      <v-list-item>
        <div style="font-weight: bold; font-size: 1.2rem; letter-spacing: 2px;">img.translate</div>
      </v-list-item>
      <v-divider></v-divider>
      <v-divider></v-divider>

      <v-list-item @click="$router.push('/')" prepend-icon="mdi-view-dashboard" title="Home"></v-list-item>
      <v-list-item @click="$router.push('/history')" prepend-icon="mdi-clock-time-eight" title="History"></v-list-item>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn v-if="!user" @click="$router.push('/login')" block>
            Login
          </v-btn>
          <v-btn v-else block @click="logOut()">
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content Area -->
    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {useNuxtApp} from "#app/nuxt.js";
import { signOut } from "firebase/auth";

export default {
  data() {
    return {
      user: useCurrentUser(),
      loggedInName: "",
    };
  },

  methods: {
    async logOut() {
      try {
        const {$auth} = useNuxtApp();
        await signOut($auth)
        console.log('User Signed Out');
      } catch (error) {
        console.error('Error creating user:', error.message);
      }
    },
  }
};
</script>
