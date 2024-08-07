<template>
    <v-dialog class="mb-40 pb-32">
      <v-avatar
        :color="isSuccess? 'green' : 'red'"
        class="absolute translate-y-1/2 left-1/2 transform -translate-x-1/2 z-10"
        size="130"
      >
        <v-icon :icon="isSuccess?  'mdi mdi-check-bold' : 'mdi mdi-close-thick'" size="80"></v-icon>
      </v-avatar>
      <v-card
        width="480"
        class="mx-auto flex-col items-center px-6 pb-6"
        rounded="lg"
      >
        <v-card-title class="mt-16"
          ><p class="text-5xl text-neutral-700">
            {{ isSuccess ? "Success" : "Error" }}
          </p></v-card-title
        >
        <v-card-subtitle
          ><p class="text-xl text-neutral-700 text-center">
            <!-- Your order has been successfully placed. -->
            {{ subtitle }}
          </p></v-card-subtitle
        >
        <v-card-text
          ><p class="text-neutral-700 text-center text-pretty">
            {{ content }}
          </p></v-card-text
        >
        <v-btn
          :color="isSuccess? 'green' : 'red'"
          rounded="lg"
          class="w-full mt-4"
          size="large"
          @click="onClose"
          >Okay</v-btn
        >
      </v-card>
    </v-dialog>
  </template>
  <script lang="ts">
  import { defineComponent } from "vue";
  export default defineComponent({
    data: () => ({}),
    props: {
      subtitle: String,
      content: String,
      isSuccess: Boolean,
    },
    methods: {
      onClose() {
        this.$emit("close");
      },
    },
  });
  </script>
  