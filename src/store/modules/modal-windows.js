export default {
    state: {
        bodyContentLists: []
    },
    getters: {
        modalWindows(state) {
            return state.bodyContentLists.map((modal, index) => {
                modal.id = Date.now() + index;
                return modal;
            });
        }
    },
    mutations: {
        addModalBodyContent(state, bodyContent) {
            state.bodyContentLists.push(bodyContent);
        },
        removeLastModalBodyContent(state) {
            const lastIndex = state.length - 1;
            state.bodyContentLists.splice(lastIndex, 1);
        }
    }
}