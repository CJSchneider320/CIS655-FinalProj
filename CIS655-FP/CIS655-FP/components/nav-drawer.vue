<script setup lang="ts">

</script>

<template>
  <v-navigation-drawer class="bg-deep-purple" :width="219">
    <v-list-item>
      <div style="font-weight: bold; font-size: 1.2rem; letter-spacing: 2px;">PET FEEDER+</div>
    </v-list-item>
    <v-divider></v-divider>

    <v-list-item to="/" prepend-icon="mdi-view-dashboard" link title="Home"></v-list-item>
    <v-list-item to="/history" prepend-icon="mdi-clock-time-eight" link title="Feed Log"></v-list-item>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn>Logout</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>

</style>