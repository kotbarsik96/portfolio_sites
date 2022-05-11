<template>
  <div class="modal-windows-list" @pointerdown="removeLastModalWindow">
    <modal-window
      @pointerdown.stop
      v-for="modalContent in modalWindows"
      :key="modalContent.id"
      :bodyContent="modalContent"
    ></modal-window>
  </div>
</template>

<script>
import ModalWindow from "@/components/UI/ModalWindow";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "modal-windows-list",
  components: {
    ModalWindow,
  },
  computed: {
    ...mapGetters(["modalWindows"]),
  },
  methods: {
    ...mapMutations(["removeLastModalBodyContent"]),
    removeLastModalWindow() {
      this.$store.commit("removeLastModalBodyContent");
    },
  },
};
</script>