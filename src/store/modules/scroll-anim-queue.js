export default {
    state: {
        animQueue: [],
        visibleAnims: []
    },
    getters: {
        animQueue(state) {
            return state.animQueue;
        }
    },
    mutations: {
        addScrollAnim(state, scrollAnim) {
            if(!state.animQueue.includes(scrollAnim)) state.animQueue.push(scrollAnim);
            this.commit("setVisibleAnims");
        },
        removeScrollAnim(state, scrollAnim) {
            const queue = state.animQueue;
            const index = queue.indexOf(scrollAnim);
            queue.splice(index, 1);
            this.commit("setVisibleAnims");
        },
        setVisibleAnims(state) {
            state.visibleAnims = state.animQueue.filter(animEl => animEl.isVisible);
            this.commit("startAnim");
        },
        startAnim(state) {
            const queue = state.visibleAnims;
            if (queue.length > 0) queue[0].applyAnim();
        },
    }
}