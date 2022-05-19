import { createStore } from 'vuex';
import works from '@/store/modules/works';
import features from '@/store/modules/features';
import modalWindows from '@/store/modules/modal-windows';
import scrollAnimQueue from '@/store/modules/scroll-anim-queue';

export default createStore({
  modules: {
    works,
    features,
    modalWindows,
    scrollAnimQueue
  }
});
