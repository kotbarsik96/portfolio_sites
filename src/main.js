import { createApp } from 'vue';
import store from '@/store';
import App from '@/App.vue';
import components from '@/components/UI';

const app = createApp(App);

components.forEach(component => app.component(component.name, component));

app
  .use(store)
  .mount('#app');
