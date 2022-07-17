<template>
  <my-header></my-header>
  <main class="main">
    <about-block></about-block>
    <tools-block></tools-block>
    <works-block></works-block>
    <features-block></features-block>
  </main>

  <transition name="mw-list">
    <modal-windows-list v-if="modalWindows.length > 0"></modal-windows-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";

import "@/assets/scss/styles.scss";
import MyHeader from "@/components/MyHeader";
import AboutBlock from "@/components/About";
import ToolsBlock from "@/components/Tools";
import WorksBlock from "@/components/Works";
import FeaturesBlock from "@/components/Features";
import ModalWindowsList from "@/components/UI/modal-window/ModalWindowsList.vue";

export default {
  components: {
    MyHeader,
    AboutBlock,
    ToolsBlock,
    WorksBlock,
    FeaturesBlock,
    ModalWindowsList,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["modalWindows"]),
  },
  methods: {},
  mounted() {},
};
</script>

<style>
.mw-list-enter-active,
.mw-list-leave-active {
  transition: opacity 0.3s ease;
}

.mw-list-enter-from,
.mw-list-leave-to {
  opacity: 0;
}
</style>