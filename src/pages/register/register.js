import 'src/public/css/reset.css';
import 'src/public/css/login.scss';
import 'src/public/css/mui.min.css';
import 'src/public/js/hotcss.js';
import 'src/public/js/jquery-3.1.0.min.js';
import 'src/public/js/Countdown.js';

import Vue from 'vue';
import Template from './register.vue';

import api from 'src/config/api';

if (api.env) {
	const  VConsole = require('vconsole');
	new VConsole();
}

Vue.config.productiontip = !api.env;

new Vue({
	el: '#app',
	components: {
		Template
	},
	template: '<Template/>'
});