import { View, Image } from '@tarojs/components'
import { Swiper, SwiperItem, Button, Cell } from '@nutui/nutui-react-taro'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

// 定义接口类型
interface Dish {
  name: string;
  description: string;
}

interface MenuItem {
  id: number;
  day: string;
  dishes: Dish[];
}

const Index = () => {
  // 修改 state 类型
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    getWeeklyMenu()
  }, [])

  // 获取每周菜单数据
  const getWeeklyMenu = () => {
    Taro.request({
      url: '/sell/notice/weekly-menu',
      success: (res) => {
        if (res.data?.data?.length > 0) {
          // 按照周一到周日的顺序排序
          const sortedMenu = res.data.data.sort((a: MenuItem, b: MenuItem) => {
            const dayOrder = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
          })
          setMenuItems(sortedMenu)
        }
      }
    })
  }

  const handleScanCode = () => {
    Taro.scanCode({
      success: (res) => {
        const result = res.result
        if (result.includes('111')) {
          goToBuy('1号桌')
        } else if (result.includes('222')) {
          goToBuy('2号桌')
        } else if (result.includes('333')) {
          goToBuy('3号桌')
        }
      }
    })
  }

  const goToBuy = (tableNum: string) => {
    Taro.navigateTo({
      url: `/pages/menu/index?tableNum=${tableNum}`
    })
  }

  const handlePhoneCall = () => {
    Taro.makePhoneCall({
      phoneNumber: '18810908748'
    })
  }

  return (
    <View className='index'>
      <Swiper height={300} autoPlay={false} indicator>
        {menuItems.map((item) => (
          <SwiperItem key={item.id}>
            <View className='menu-card'>
              <View className='day-title'>{item.day}菜单</View>
              <View className='dishes-list'>
                {item.dishes.map((dish, index) => (
                  <View key={index} className='dish-item'>
                    <View className='dish-name'>{dish.name}</View>
                    <View className='dish-desc'>{dish.description}</View>
                  </View>
                ))}
              </View>
            </View>
          </SwiperItem>
        ))}
      </Swiper>

      <View className='action-buttons'>
        <Button type='primary' onClick={handleScanCode}>扫码点餐</Button>
        <Button type='default' onClick={handlePhoneCall}>电话订座</Button>
      </View>
    </View>
  )
}

export default Index