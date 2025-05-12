export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/menu/index',
    'pages/orders/index',
    'pages/profile/index',
    'pages/order-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '点餐系统',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#1296db',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/icons/home.png',
        selectedIconPath: './assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/menu/index',
        text: '点餐',
        iconPath: './assets/icons/menu.png',
        selectedIconPath: './assets/icons/menu-active.png'
      },
      {
        pagePath: 'pages/orders/index',
        text: '订单',
        iconPath: './assets/icons/order.png',
        selectedIconPath: './assets/icons/order-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/icons/profile.png',
        selectedIconPath: './assets/icons/profile-active.png'
      }
    ]
  }
})
