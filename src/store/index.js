import { createStore } from 'vuex';
import works from '@/store/modules/works.js';
import features from '@/store/modules/features.js';
import modalWindows from '@/store/modules/modal-windows.js';
import scrollAnimQueue from '@/store/modules/scroll-anim-queue.js';

export default createStore({
  modules: {
    works,
    features,
    modalWindows,
    scrollAnimQueue
  }
});
