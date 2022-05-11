<template>
  <div
    class="features-book__page"
    v-for="presInfo in slide"
    :key="presInfo.id"
    :data-page-number="presInfo.pageNumber"
  >
    <h4
      class="features-book__page-title"
      @click="$emit('createModalWindow', presInfo)"
    >
      {{ capitalLetter(presInfo.title) }}
    </h4>
    <div class="features-book__page-presentation">
      <image-container
        v-if="presentsBy === 'img'"
        :src="presInfo.presentation[srcType] || presInfo.presentation.src"
        :alt="presInfo.title"
      ></image-container>
      <video-container
        v-if="presentsBy === 'video'"
        :src="presInfo.presentation[srcType] || presInfo.presentation.src"
        ref="vContainerList"
      ></video-container>
    </div>
    <div class="features-book__page-number">{{ presInfo.pageNumber }}</div>
  </div>
</template>

<script>
import { capitalLetter } from "@/assets/js/scripts";

export default {
  name: "two-pages",
  emits: ["createModalWindow"],
  props: {
    slide: Array,
    srcType: {
      type: String,
      default: "src" || "src-vertical",
    },
    presentsBy: {
      type: String,
      default: "img" || "video",
    },
  },
  methods: {
    capitalLetter,
  },
  computed: {
    vContainerList(){
      return this.$refs.vContainerList || null;
    }
  }
};
</script>

<style>
</style>