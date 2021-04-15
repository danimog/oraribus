import { createApp } from 'vue'
import App from './App.vue'
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker, LTooltip, LIcon } from "@vue-leaflet/vue-leaflet";

import { Icon } from "leaflet";

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

const app = createApp(App)

app.component('LMap', LMap) // global registration - can be used anywhere
app.component('LTileLayer', LTileLayer) // global registration - can be used anywhere
app.component('LMarker', LMarker) // global registration - can be used anywhere
app.component('LTooltip', LTooltip) // global registration - can be used anywhere
app.component('LIcon', LIcon) // global registration - can be used anywhere

app.mount('#app')
