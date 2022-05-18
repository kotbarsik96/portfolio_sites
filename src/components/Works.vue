<template>
  <section id="works-block" class="page-block works-block">
    <div class="works-block__container container">
      <scroll-anim :animType="'typeWriter'">
        <h2 class="page-block__title anim__object-text">Мои работы</h2>
      </scroll-anim>
      <div class="works-block__content">
        <ul class="works-block__sites-list sites-list" ref="sitesList">
          <transition-group
            appear
            name="works-list"
            @before-enter="onBeforeEnter"
            @enter="onEnter"
            @leave="onLeave"
            :css="false"
          >
            <works-item
              v-for="(work, workIndx) in sortedWorks"
              :key="work.id || Date.now() + workIndx"
              :work="work"
              :data-works-item-index="workIndx"
            >
            </works-item>
          </transition-group>
          <transition name="works-list__empty">
            <div
              class="sites-list__empty"
              v-if="sortedWorks.length < 1"
              :key="'sites-list-empty'"
            >
              <img :src="cricketIcon" alt="Сверчок" />
              <p>Здесь пусто...</p>
              <p>Возможно, по выбранным фильтрам нет совпадений</p>
            </div>
          </transition>
        </ul>
        <div class="works-block__filter-block">
          <div class="works-block__filter-block-body" ref="filterBlockBody">
            <my-filter
              ref="filterEl"
              :filterOptions="filterOptions"
              @changeFilterArray="changeFilterArray"
            ></my-filter>
            <my-select
              :optionsInfo="sortOptions.order"
              :optionsName="'order'"
              @changeSelectedSort="changeSelectedSort"
            ></my-select>
            <my-select
              :optionsInfo="sortOptions.type"
              :optionsName="'type'"
              @changeSelectedSort="changeSelectedSort"
            ></my-select>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import cricketIcon from "@/assets/img/icons/cricket.svg";
import WorksItem from "@/components/UI/WorksItem";
import { positionSticky } from "@/assets/js/scripts.js";
import { gsap } from "gsap";

export default {
  name: "works-block",
  components: { WorksItem },
  data() {
    return {
      cricketIcon,
      sortOptions: {
        order: {
          inputName: "works_sort_order",
          options: [
            { id: 11, title: "С начала", value: "start" },
            { id: 12, title: "С конца", value: "end" },
          ],
          selectedValue: "",
        },
        type: {
          inputName: "works_sort_type",
          options: [
            { id: 11, title: "По алфавиту", value: "alphabet" },
            { id: 12, title: "По содержимому", value: "content" },
          ],
          selectedValue: "",
        },
      },
      filterOptions: {
        features: {
          key: "features",
          title: "По содержимому",
          inputName: "works-filter__content",
          options: [],
        },
      },
      selectedFilters: [],
    };
  },
  computed: {
    ...mapGetters(["works"]),
    filteredWorks() {
      let works = [...this.works];

      if (this.selectedFilters.length > 0) {
        this.selectedFilters.forEach((flr) => {
          works = works.filter(
            (w) => w[flr.key].includes(flr.opt) || w[flr.key] === flr.opt
          );
        });
      }

      return works;
    },
    sortedByType() {
      const selectedType = this.sortOptions.type.selectedValue;

      if (selectedType === "alphabet")
        return [...this.filteredWorks].sort((w1, w2) => {
          if (w1.title.toLowerCase() > w2.title.toLowerCase()) return 1;
          if (w1.title.toLowerCase() < w2.title.toLowerCase()) return -1;
          return 0;
        });
      if (selectedType === "content")
        return [...this.filteredWorks].sort((w1, w2) => {
          if (w1.features.length > w2.features.length) return 1;
          if (w1.features.length < w2.features.length) return -1;
          return 0;
        });
      else return [...this.filteredWorks];
    },
    sortedWorks() {
      const selectedOrder = this.sortOptions.order.selectedValue;

      return selectedOrder === "start"
        ? [...this.sortedByType]
        : [...this.sortedByType].reverse();
    },
  },
  methods: {
    changeSelectedSort(value, name) {
      this.sortOptions[name].selectedValue = value;
    },
    changeFilterArray(key, opt) {
      for (let i in this.selectedFilters) {
        const obj = this.selectedFilters[i];

        if (obj.key === key && obj.opt === opt) {
          this.selectedFilters.splice(i, 1);
          return;
        }
      }
      this.selectedFilters.push({ key, opt });
    },
    setFilterOptions() {
      for (let optName in this.filterOptions) {
        const optObj = this.filterOptions[optName];
        const optsSet = new Set();

        this.works.forEach((work) => {
          const workOpt = work[optName];

          if (typeof workOpt === "object")
            workOpt.forEach((item) => optsSet.add(item));
          else if (typeof workOpt !== "boolean") optsSet.add(workOpt);
        });

        optObj.options = Array.from(optsSet);
      }
    },
    // переходы списков
    onBeforeEnter(el) {
      gsap.set(el, {
        opacity: 0,
        paddingBottom: 0,
        x: el.dataset.worksItemIndex % 2 === 0 ? -500 : 500,
      });
    },
    onEnter(el, done) {
      gsap.to(el, {
        opacity: 1,
        maxHeight: "500px",
        paddingBottom: "50px",
        onComplete: done,
        x: 0,
      });
    },
    onLeave(el, done) {
      gsap.to(el, {
        opacity: 0,
        maxHeight: 0,
        paddingBottom: 0,
        x: el.dataset.worksItemIndex % 2 === 0 ? -500 : 500,
        onStart: () =>
          el.addEventListener("transitionend", () => {
            done();
            el.ontransitionend = null;
          }),
      });
    },
  },
  mounted() {
    this.setFilterOptions();
    positionSticky(this.$refs.filterBlockBody, this.$refs.filterEl.body);
  },
};
</script>

<style>
.works-list__empty-enter-from,
.works-list__empty-leave-to {
  opacity: 0;
}

.works-list__empty-enter-active,
.works-list__empty-leave-active {
  transition: opacity 0.5s;
}
</style>