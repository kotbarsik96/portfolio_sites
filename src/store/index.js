import { createStore } from 'vuex';
import works from '@/store/modules/works';
import features from '@/store/modules/features';
import modalWindows from '@/store/modules/modal-windows';

export default createStore({
  modules: {
    works,
    features,
    modalWindows
  }
});
