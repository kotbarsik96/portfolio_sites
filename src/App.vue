<template>
    <div class="wrapper">
        <MyHeader></MyHeader>
        <main class="main">
            <AboutBlock></AboutBlock>
            <WorksBlock></WorksBlock>
            <FeaturesBlock></FeaturesBlock>
        </main>

        <Transition name="mw-list">
            <ModalWindowsList v-if="modalWindows.length > 0"></ModalWindowsList>
        </Transition>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import "@/assets/scss/styles.scss";
import MyHeader from "@/components/MyHeader.vue";
import AboutBlock from "@/components/About.vue";
import WorksBlock from "@/components/Works.vue";
import FeaturesBlock from "@/components/Features.vue";
import ModalWindowsList from "@/components/UI/modal-window/ModalWindowsList.vue";

export default {
    components: {
        MyHeader,
        AboutBlock,
        WorksBlock,
        FeaturesBlock,
        ModalWindowsList,
    },
    methods: {
        ...mapActions(["loadWorks", "loadFeatures"]),
    },
    computed: {
        ...mapGetters(["modalWindows"]),
    },
    mounted() {
        this.loadWorks();
        this.loadFeatures();
    }
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