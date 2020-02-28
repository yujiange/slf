// api 根路径配置

const apiRoot = {
    // 公司测试开发环境
    dev: {
        javaIP: '47.244.132.175:5050',
        imgIP: ''
    },
    // 个人的开发环境
    pp1Dev: {
        javaIP: '192.168.0.245:5050',
        text: '龙祥本地'
    },
    pp2Dev: {
        javaIP: '',
        phpIP: ''
    },
    pp3Dev: {
        javaIP: '',
        text: ''
    },
    //刷脸付正式地址
    pp4Dev: {
        javaIP: 'app.lianyifu.com.cn',
        phpIP: '182.254.187.32'
    },
    // 聚才正式环境地址
    prod: {
        javaIP: 'app.lianyifu.com.cn/app',
        imgIP: 'app.lianyifu.com.cn/image/'
    }
}

export default apiRoot.prod;
