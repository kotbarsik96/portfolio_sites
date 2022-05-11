<template>
  <div class="filter">
    <div class="filter__title __icon-filter" ref="filterBtn">Фильтр</div>
    <div class="filter__body" ref="filterBody">
      <div
        class="filter__body-block"
        v-for="filterObj in filterOptions"
        :key="filterObj.title"
      >
        <h6 class="filter__list-title">{{ filterObj.title }}</h6>
        <ul class="filter__list">
          <li
            class="filter__item filter__item--checkbox"
            v-for="opt in filterObj.options"
            :key="opt"
          >
            <label>
              <input
                type="checkbox"
                :name="filterObj.inputName"
                :value="opt"
                @change="$emit('changeFilterArray', filterObj.key, opt)"
              />
              <span>{{ opt }}</span>
            </label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { initSpoilerElem } from "@/assets/js/scripts.js";

export default {
  name: "my-filter",
  props: {
    filterOptions: {
      type: Object,
      default: {
        key: "default",
        title: "Без названия",
        inputName: "noname",
        options: [],
      },
    },
  },
  data() {
    return {
      body: "",
    };
  },
  methods: {
    initToggleFilter() {
      const btn = this.$refs.filterBtn;
      initSpoilerElem(btn);
    },
  },
  mounted() {
    this.initToggleFilter();
    this.body = this.$refs.filterBody;
  },
};
</script>