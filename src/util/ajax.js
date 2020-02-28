import mui from 'src/public/js/mui.min.js';
import api from "src/config/api";
import store from 'src/store';
import Vue from "vue";
import {Toast} from "vant";
Vue.use(Toast)
export default (options) => {
  return new Promise((resolve, reject) => {
    let authorization = localStorage.getItem("token");
    // if (options.url.match("/login") == null&&options.url.match("/sendCode") !== null) {
		// 	if (authorization == null || authorization == "undefined") {
		// 		api.gotoIndex("login");
		// 		localStorage.clear();
		// 		return;
		// 	}
		// }
    mui.ajax(options.url, {
      data: options.data,
      type: options.type || 'POST',
      timeout: options.timeout || 5000,
      contentType:'application/json',
      headers: {
				"x-auth-token": authorization
			},
      success: function (res) {
        if (res.code == 500) {
          Toast(res.msg);
          // setTimeout(() => {
          //   plus.runtime.restart();
          // }, 1000);
        } else {
          resolve(res);
        }
      },
      error: function (xhr, type, errorThrown) {
        Toast('网络连接异常');
        reject(xhr, type, errorThrown);
      }
    })
  })
}