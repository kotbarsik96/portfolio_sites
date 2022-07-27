<template>
    <li class="site-item">
        <div class="site-item__controls">
            <div
                class="site-item__control-icon"
                :class="{ __selected: isDesktop }"
                @click="setPlatform(true)"
            >
                <div class="__icon-desktop"></div>
            </div>
            <div class="site-item__controls-delimeter">|</div>
            <div
                class="site-item__control-icon"
                :class="{ __selected: showFeatures }"
                @click="toggleFeaturesByClick"
            >
                <div class="__icon-question-mark"></div>
            </div>
            <div class="site-item__controls-delimeter">|</div>
            <div
                class="site-item__control-icon"
                :class="{ __selected: !isDesktop }"
                @click="setPlatform(false)"
            >
                <div class="__icon-phone"></div>
            </div>
        </div>
        <a
            :href="work.url"
            @mouseover="toggleFeaturesByHover('show')"
            @mouseleave="toggleFeaturesByHover('hide')"
            class="site-item__body"
        >
            <div
                class="site-item__wrapper"
                :class="{
          compressed: changingState,
        }"
            >
                <transition
                    name="change-show"
                    mode="out-in"
                    @before-leave="changingState = true"
                    @after-leave="changingState = false"
                >
                    <picture
                        class="site-item__image site-item__image--transition"
                        v-if="isDesktop"
                        :class="{
              'site-item__image--hidden': showFeatures,
            }"
                    >
                        <source :srcset="`${work.imgDesktop}.webp`" />
                        <img
                            :src="`${work.imgDesktop}.png`"
                            :alt="work.title"
                        />
                    </picture>
                    <picture
                        class="site-item__image site-item__image--transition"
                        v-else-if="!isDesktop"
                        :style="`background-image: url(${work.imgIcon});`"
                        :class="{
              'site-item__image--hidden': showFeatures,
            }"
                    >
                        <source :srcset="`${work.imgMobile}.webp`" />
                        <img
                            :src="`${work.imgMobile}.png`"
                            :alt="work.title"
                        />
                    </picture>
                </transition>
                <transition name="change-show">
                    <ul
                        class="site-item__features"
                        v-if="showFeatures"
                    >
                        <div class="site-item__features-title">
                            Из интересного на этом сайте:
                        </div>
                        <li
                            class="site-item__feature"
                            v-for="(ftr, fIndex) in work.features"
                            :key="ftr.split('').join('')"
                        >
                            {{ `${ftrNumber(fIndex)} ${ftr}` }}
                        </li>
                    </ul>
                </transition>
            </div>
            <div class="site-item__title">
                {{ `${work.type} ${capitalLetter(work.title)}` }}
            </div>
        </a>
    </li>
</template>

<script>
import { capitalLetter } from "@/assets/js/scripts.js";

export default {
    props: {
        work: Object,
    },
    data() {
        return {
            isDesktop: true,
            showFeatures: false,
            showFeaturesByClick: false,
            changingState: false,
        };
    },
    methods: {
        capitalLetter,
        setPlatform(bool) {
            this.showFeatures = false;
            this.isDesktop = bool;
        },
        ftrNumber(fIndex) {
            return this.work.features.length > 1 ? fIndex + 1 + "." : "";
        },
        toggleFeaturesByHover(action) {
            if(!this.showFeaturesByClick) {
                if(action === "hide") this.showFeatures = false;
                if(action === "show") this.showFeatures = true;
            }
        },
        toggleFeaturesByClick() {
            this.showFeatures = !this.showFeatures;
            this.showFeaturesByClick = this.showFeatures;
        }
    },
};
</script>

<style>
.change-show-enter-from,
.change-show-leave-to,
.site-item__image--hidden {
    opacity: 0;
}
.change-show-enter-active,
.change-show-leave-active,
.site-item__image--transition {
    transition: opacity 0.45s;
}

.site-item__wrapper {
    transition: transform 0.35s;
    transform: scale(1, 1);
}
.site-item__wrapper.compressed {
    transform: scale(1, 0);
}
</style>