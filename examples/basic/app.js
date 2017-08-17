import Vue  from "vue/dist/vue";
import {TreacherousPlugin} from "../../dist/commonjs/plugin"

import "./components/basic.component";

Vue.use(new TreacherousPlugin());

let app = new Vue({
    el: "#app"
});