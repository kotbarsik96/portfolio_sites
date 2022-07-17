<template>
    <section
        id="works-block"
        class="page-block works-block"
    >
        <div class="works-block__container container">
            <scroll-anim
                :animType="'typeWriter'"
                :queue="true"
            >
                <h2 class="page-block__title anim__object-text">Мои работы</h2>
            </scroll-anim>
            <div class="works-block__content">
                <ul
                    class="works-block__sites-list sites-list"
                    ref="sitesList"
                >
                    <transition-group
                        appear
                        name="works-list"
                        @before-enter="onBeforeEnter"
                        @enter="onEnter"
                        @leave="onLeave"
                        :css="false"
                    >
                        <works-item
                            v-for="(work, workIndx) in filteredSortedWorks"
                            :key="work.id || Date.now() + workIndx"
                            :work="work"
                            :data-works-item-index="workIndx"
                        >
                        </works-item>
                    </transition-group>
                    <transition name="works-list__empty">
                        <div
                            class="sites-list__empty"
                            v-if="filteredSortedWorks.length < 1"
                            :key="'sites-list-empty'"
                        >
                            <img
                                :src="cricketIcon"
                                alt="Сверчок"
                            />
                            <p>Здесь пусто...</p>
                            <p>Возможно, по выбранным фильтрам нет совпадений</p>
                        </div>
                    </transition>
                </ul>
                <div class="works-block__filter-block">
                    <div
                        class="works-block__filter-block-body"
                        ref="filterBlockBody"
                    >
                        <SelectBlock
                            @changeSelected="(selected) => setSortValue('sortType', selected)"
                            inputName="works-sort-type"
                            :options="[
                                { title: 'По алфавиту', value: 'title' },
                                { title: 'По содержимому', value: 'features' }
                            ]"
                        ></SelectBlock>
                        <SelectBlock
                            @changeSelected="(selected) => setSortValue('sortOrder', selected)"
                            inputName="works-sort-order"
                            :options="[
                                { title: 'С начала', value: 'start' },
                                { title: 'С конца', value: 'end' }
                            ]"
                        ></SelectBlock>
                        <FilterBlock
                            v-model="filteredWorks"
                            :objectToFilter="works"
                            :fields="[
                                { title: 'По содержимому', key: 'features', type: 'checkbox' },
                                { title: 'По типу', key: 'type', type: 'checkbox' }
                            ]"
                        ></FilterBlock>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapGetters } from "vuex";
import cricketIcon from "@/assets/img/icons/cricket.svg";
import WorksItem from "@/components/UI/misc/WorksItem";
import { gsap } from "gsap";

export default {
    name: "works-block",
    components: { WorksItem },
    data() {
        return {
            cricketIcon,
            filteredWorks: [],
            filteredSortedWorks: [],
            sortType: "",
            sortOrder: "",
            worksPerPage: 4,
            currentPage: 1,
        };
    },
    computed: {
        ...mapGetters(["works"]),
        pagesAmount() {
            return Math.ceil(
                this.filteredSortedWorks.length / this.worksPerPage
            );
        },
        pages() {
            const pagesData = {};

            if (this.pagesAmount < 1) return {};

            let srcWorksIndex = 0;
            for (let i = 1; i <= this.pagesAmount; i++) {
                const pData = [];
                const startValue = srcWorksIndex;
                const endValue = srcWorksIndex + this.worksPerPage;

                for (let j = startValue; j < endValue; j++) {
                    const work = this.filteredSortedWorks[j];
                    if (work) pData.push(work);
                }
                srcWorksIndex = endValue;
                pagesData[`page${i}`] = pData;
            }
            return pagesData;
        },
        currentPageWorks() {
            const currentPage = this.currentPage;
            const pageDataKey = Object.keys(this.pages).find(
                (pKey) => pKey === `page${currentPage}`
            );
            return this.pages[pageDataKey] || [];
        },
    },
    methods: {
        setSortValue(sortTitle, value) {
            // sortTitle === this.sortType || this.sortOrder
            this[sortTitle] = value;
            this.sortWorks();
        },
        sortWorks() {
            if (this.filteredWorks.length > 0) {
                const sortValue = this.filteredWorks[0][this.sortType];
                const isSortValueArray = Array.isArray(sortValue);
                const srcArray = this.filteredWorks.map((w) => w);
                const sorted = srcArray.sort((work1, work2) => {
                    return isSortValueArray
                        ? this.sortByLengthComparing(
                              work1[this.sortType],
                              work2[this.sortType]
                          )
                        : this.sortByComparing(
                              work1[this.sortType],
                              work2[this.sortType]
                          );
                });

                if (this.sortOrder === "start")
                    this.filteredSortedWorks = sorted;
                if (this.sortOrder === "end")
                    this.filteredSortedWorks = sorted.reverse();
            } else this.filteredSortedWorks = [];
        },
        sortByComparing(work_1_value, work_2_value) {
            if (work_1_value.toLowerCase() < work_2_value.toLowerCase())
                return -1;
            if (work_1_value.toLowerCase() > work_2_value.toLowerCase())
                return 1;
            return 0;
        },
        sortByLengthComparing(work_1_value, work_2_value) {
            if (work_1_value.length < work_2_value.length) return -1;
            if (work_1_value.length > work_2_value.length) return 1;
            return 0;
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
    watch: {
        filteredWorks() {
            this.sortWorks();
        },
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