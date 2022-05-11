<template>
  <div
    class="image-container"
    ref="imgContainer"
    @click="expand"
    @mouseover="showExpand = true"
    @mouseleave="showExpand = false"
  >
    <img :src="src" :alt="alt" />
    <div class="image-container__controls" :class="{ __shown: showExpand }">
      <div class="image-container__expand-btn __icon-expand"></div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "image-container",
  props: {
    src: String,
    alt: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showExpand: false,
    };
  },
  methods: {
    ...mapMutations(["addModalBodyContent"]),
    expand() {
      const imgContainer = this.$refs.imgContainer;
      const imgContainerParent = imgContainer.parentNode;

      if (imgContainer.closest(".modal-window")) return;

      const bodyContent = {
        bodyType: "media",
        node: imgContainer,
        oldParent: imgContainerParent,
      };
      this.$store.commit("addModalBodyContent", bodyContent);
    },
  },
};
</script>

<style>
</style>