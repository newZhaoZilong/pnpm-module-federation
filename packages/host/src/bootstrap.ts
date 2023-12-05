import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import adaptor from "./router/routerAdapor"

const app = createApp(App);
app.use(store);

adaptor(app);
app.mount("#app");
// createApp(App).use(store).use(router).mount("#app");
