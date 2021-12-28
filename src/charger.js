import Vue from 'vue'
import Charger from './Charger.vue'
import VueI18n from 'vue-i18n'
import {
  BootstrapVue,
  IconsPlugin,
  LayoutPlugin,
  ModalPlugin,
  CardPlugin,
  VBScrollspyPlugin,
  DropdownPlugin,
  TablePlugin
} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { BASE } from '@/config'
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(LayoutPlugin);
Vue.use(ModalPlugin);
Vue.use(CardPlugin);
Vue.use(VBScrollspyPlugin);
Vue.use(DropdownPlugin);
Vue.use(TablePlugin);
Vue.use(VueI18n);
Vue.use(VueAxios, axios);
Vue.axios.defaults.baseURL = BASE;

Vue.filter('toVar1', function (mount) {
  if (mount) {
    return 'outline-success';
  } else {
    return 'outline-secondary';
  }
});

Vue.filter('tmFix', function (tm0) {
    let hr = parseInt(tm0/60);
    let mi = parseInt(tm0%60);
    if (hr<10) hr = '0'+hr;
    if (mi<10) mi = '0'+mi;
    return hr+':'+mi;
});

Vue.filter('a2str', function (arr) {
    let ret = '';
    for(var i=0;i<arr.length;i++){
      ret = ret + arr[i].toFixed(2) + ' ';
    }
    return ret.substr(0,ret.length-1);
});

const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || 'CN',
  messages: {
    'EN': require('./assets/en'),
    'CN': require('./assets/cn')
  },
});

Vue.filter('trans', function (engstr) {
  let lo = localStorage.getItem('locale') || 'CN';
  let trastr = i18n.messages[lo].message[engstr];
  if (trastr){
    return trastr;
  } else {
    return engstr;
  }
});

Vue.config.productionTip = false

new Vue({
  i18n,
  render: h => h(Charger),
  data() {return {};},
  methods: {}
}).$mount('#app1')
