// 配置开始时需要监听的页面
exports.devPage = 'login';


// 定义webpack配置文件中的入口以及HtmlWebpackPlugin所需要的参数
exports.pageSet = [{
    title: '手机号登录',
    filename: 'loginTel'
  },
  {
    title: '登录页',
    filename: 'login'
  },
  {
    title: '注册页',
    filename: 'register'
  },
  {
    title: '注册页',
    filename: 'registerEnd'
  },
  {
    title: '找回密码',
    filename: 'password'
  },
  {
    title: '设置密码',
    filename: 'passwordTwo'
  },
  {
    title: '首页',
    filename: 'index'
  },
  {
    title: '个人中心',
    filename: 'my'
  },
  {
    title: '选择套餐',
    filename: 'chooseTc'
  },
  {
    title: '申请代理商',
    filename: 'applydls'
  },
  {
    title: '个人设置',
    filename: 'setting'
  },
  {
    title: '我的财务',
    filename: 'mycw'
  },
  {
    title: '代理商列表',
    filename: 'dlslist'
  },
  {
    title: '代理商详情',
    filename: 'agentDetail'
  },
  {
    title: '商家列表',
    filename: 'sjlist'
  },
  {
    title: '商家详情',
    filename: 'sjDetail'
  },
  {
    title: '个人认证详情',
    filename: 'show_list'
  },
  {
    title: '修改密码',
    filename: 'updatePass'
  },
  {
    title: '广告管理列表',
    filename: 'adList'
  },
  {
    title: '广告管理详情',
    filename: 'adDetail'
  },
  {
    title: '广告管理',
    filename: 'ad'
  },
  {
    title: '广告上下架',
    filename: 'upDown'
  },
  {
    title: '售后管理列表',
    filename: 'serviceList'
  },
  {
    title: '售后详情',
    filename: 'serviceDetail'
  },
  {
    title: '售后管理',
    filename: 'service'
  },
  {
    title: '基本信息',
    filename: 'info'
  },
  {
    title: '关于我们',
    filename: 'aboutUs'
  }
]