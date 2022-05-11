<template>
  <div class="features-book__page" :data-page-number="page.pageNumber">
    <h4 class="features-book__page-title" @click="$emit('createModalWindow', page)">{{ capitalLetter(page.title) }}</h4>
    <div class="features-book__page-presentation">
      <image-container v-if="presentsBy === 'img'" :src="page.presentation[srcType] || page.presentation['src']"></image-container>
      <video-container v-if="presentsBy === 'video'" :src="page.presentation[srcType] || page.presentation['src']"></video-container>
    </div>
    <div class="features-book__page-number">{{ page.pageNumber }}</div>
  </div>
</template>

<script>
import { capitalLetter } from '@/assets/js/scripts';

export default {
    name: 'single-page',
    emits: ["createModalWindow"],
    props: {
        page: Object,
        srcType: {
          type: String,
          default: 'src' || 'src-vertical'
        },
        presentsBy: {
            type: String,
            default: 'img' || 'video'
        }
    },
    methods: {
        capitalLetter
    }
};
</script>

<style>
</style>