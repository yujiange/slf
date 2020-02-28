// var devMode = true;
var devMode = false;

import pp1Api from './pp1Api' // 开发者1负责的api

export default {
    'env': devMode,
    ...pp1Api
}