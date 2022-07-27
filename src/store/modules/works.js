import rootPath from "@/root-path.js";

export default {
    state: {
        works: []
    },
    actions: {
        async loadWorks({ commit }) {
            const request = await fetch(`${rootPath}json/works.json`);
            const works = await request.json();
            commit("setWorks", works);
        }
    },
    mutations: {
        setWorks(state, works) {
            state.works = works;
        }   
    },
    getters: {
        works(state) {
            return state.works;
        }
    }
}