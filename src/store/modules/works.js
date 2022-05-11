import works from '@/../public/json/works.json';

export default {
    state: {
        works
    },
    getters: {
        works(state) {
            return state.works;
        }
    }
}