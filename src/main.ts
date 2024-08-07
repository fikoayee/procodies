import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import maska from "./plugins/maska";
import api from "./services/infrastructure/axios-config";

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.use(maska);
app.use(api);
app.mount("#app");
