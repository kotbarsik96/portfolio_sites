<template>
  <div
    class="select"
    :class="{ __active: showOptions }"
    @click="showOptions = !showOptions"
    ref="myselect"
  >
    <div class="select__value">
      {{ selectedOptionTitle }}
    </div>
    <div class="select__items">
      <label
        class="select__item"
        v-for="opt in optionsInfo.options"
        :key="opt.id"
      >
        <input
          type="radio"
          :name="optionsInfo.inputName"
          :value="opt.value"
          @change="setOption(opt)"
        />
        <p>{{ opt.title }}</p>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "my-select",
  props: {
    optionsInfo: {
      type: Object,
      default: {
        inputName: "noname",
        options: [
          { id: 11, title: "Опция", value: "option" },
          { id: 12, title: "Опция", value: "option" },
        ],
        selectedValue: "",
      },
    },
    optionsName: String,
  },
  data() {
    return {
      showOptions: false,
      selectedOptionTitle: "",
    };
  },
  methods: {
    hideOptions(myselect) {
      const hide = (event) => {
        const isSelect = event.target === myselect;
        const isSelectChild = event.target.parentNode === myselect;
        if (!isSelect && !isSelectChild) this.showOptions = false;
      };

      document.addEventListener("click", hide);
    },
    setDefaultOption() {
      const opt = this.optionsInfo.options[0];
      this.setOption(opt);
    },
    setOption(opt) {
      this.showOptions = false;
      this.selectedOptionTitle = opt.title;
      this.$emit("changeSelectedSort", opt.value, this.optionsName);
    },
  },
  mounted() {
    this.setDefaultOption();
    const myselect = this.$refs.myselect;
    this.hideOptions(myselect);
  },
};
</script>

<style scoped>
.select {
  transition-property: z-index;
  transition-delay: 0.15s;
  z-index: 50;
}
.select.__active {
  z-index: 150;
  transition-delay: 0s;
}
.select__items {
  opacity: 0;
  visibility: hidden;
  transition-property: opacity, visibility;
  transition-duration: 0.25s;
  transition-delay: 0s;
}
.select.__active > .select__items {
  transition-delay: 0.1s, 0s;
  opacity: 1;
  visibility: visible;
}
</style>