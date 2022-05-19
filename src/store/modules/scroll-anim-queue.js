export default {
    state: {
        scrollAnimQueue: []
    },
    mutations: {
        addScrollAnim(state, scrollAnim){
            state.scrollAnimQueue.push(scrollAnim);
        },
        removeScrollAnim(state, scrollAnim = null){
            const index = state.scrollAnimQueue.indexOf(scrollAnim);
            index >= 0
                ? state.scrollAnimQueue.splice(index, 1)
                : state.scrollAnimQueue.shift();
        }
    }
}