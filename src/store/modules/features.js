import rootPath from "@/root-path.js";

function newArray(array) {
    return array.map((item, index, array) => {
        if (index % 2 === 0) {
            const siblingItem = array[index + 1];
            return siblingItem ? [item, siblingItem] : [item];
        }
    }).filter(item => item) || [];
}

export default {
    state: {
        features: []
    },
    actions: {
        async loadFeatures({ commit }) {
            const request = await fetch(`${rootPath}json/features.json`);
            const features = await request.json();
            commit("setFeatures", features);
        }
    },
    mutations: {
        setFeatures(state, features){
            state.features = features;
        }
    },
    getters: {
        pagedFeatures(state) {
            let pageCounter = 1;
            const stateVideo = state.features.video;
            const stateImg = state.features.img;

            const video = stateVideo ? setNumbers(stateVideo) : [];
            const img = stateImg ? setNumbers(stateImg) : [];

            function setNumbers(array) {
                return array.map(ftr => {
                    ftr.pageNumber = pageCounter;
                    pageCounter = pageCounter + 1;
                    return ftr;
                });
            }
            pageCounter = pageCounter - 1;

            return { img, video, pageCounter };
        },
        pagesTotal(state, getters) {
            return getters.pagedFeatures.pageCounter;
        },
        twoPagesArray(state, getters) {
            const srcObj = getters.pagedFeatures;
            srcObj.img = newArray(srcObj.img);
            srcObj.video = newArray(srcObj.video);
            delete srcObj.pagesTotal;

            return srcObj;
        },
        singlePageArray(state, getters) {
            const srcObj = getters.pagedFeatures;
            srcObj.img = [...srcObj.img];
            srcObj.video = [...srcObj.video];
            delete srcObj.pagesTotal;

            return srcObj;
        }
    }
}