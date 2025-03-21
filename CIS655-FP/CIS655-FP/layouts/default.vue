<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app class="bg-deep-purple" width="219">
      <v-list-item>
        <div style="font-weight: bold; font-size: 1.2rem; letter-spacing: 2px;">img_translator</div>
      </v-list-item>
      <v-divider></v-divider>
      <v-divider></v-divider>

      <v-list-item @click="$router.push('/')" prepend-icon="mdi-view-dashboard" title="Home"></v-list-item>
      <v-list-item @click="$router.push('/history')" prepend-icon="mdi-clock-time-eight" title="History"></v-list-item>
      <v-list-item @click="$router.push('/account')" prepend-icon="mdi-account" title="Account"></v-list-item>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block>
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

<script setup lang="ts">
import { ref } from 'vue';

const drawer = ref(true); // Controls the drawer state
</script>
