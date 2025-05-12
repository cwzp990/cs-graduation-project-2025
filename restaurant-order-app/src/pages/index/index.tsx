import { View, Image } from '@tarojs/components'
import { Swiper, SwiperItem, Button, Cell } from '@nutui/nutui-react-taro'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

interface BannerItem {
  url: string;
  id: string | number;
}

const Index = () => {
//   后端传回的参数 如下 [
//     {
//         "id": 73,
//         "day": "周一",
//         "dishes": [
//             {
//                 "name": "紫菜蛋花汤",
//                 "description": "营养美味，开胃解腻"
//             },
//             {
//                 "name": "清炒时蔬",
//                 "description": "新鲜时令蔬菜，清淡爽口"
//             },
//             {
//                 "name": "番茄炒蛋",
//                 "description": "家常经典，酸甜可口"
//             },
//             {
//                 "name": "紫菜蛋花汤",
//                 "description": "营养美味，开胃解腻"
//             }
//         ]
//     },
//     {
//         "id": 81,
//         "day": "周三",
//         "dishes": [
//             {
//                 "name": "宫保鸡丁",
//                 "description": "经典川菜，麻辣鲜香"
//             },
//             {
//                 "name": "清蒸鲈鱼",
//                 "description": "新鲜鲈鱼，肉质细嫩"
//             },
//             {
//                 "name": "炒青菜",
//                 "description": "时令青菜，清淡爽口"
//             },
//             {
//                 "name": "玉米排骨汤",
//                 "description": "香甜可口，营养丰富"
//             }
//         ]
//     },
//     {
//         "id": 77,
//         "day": "周二",
//         "dishes": [
//             {
//                 "name": "鱼香肉丝",
//                 "description": "咸甜酸辣兼备，口感丰富"
//             },
//             {
//                 "name": "麻婆豆腐",
//                 "description": "麻辣鲜香，下饭神器"
//             },
//             {
//                 "name": "蒜蓉空心菜",
//                 "description": "清脆爽口，蒜香四溢"
//             },
//             {
//                 "name": "冬瓜排骨汤",
//                 "description": "清热解暑，营养美味"
//             }
//         ]
//     },
//     {
//         "id": 89,
//         "day": "周五",
//         "dishes": [
//             {
//                 "name": "水煮肉片",
//                 "description": "麻辣鲜香，肉质嫩滑"
//             },
//             {
//                 "name": "干煸四季豆",
//                 "description": "香辣可口，下饭神器"
//             },
//             {
//                 "name": "蒜蓉粉丝蒸扇贝",
//                 "description": "海鲜美味，蒜香四溢"
//             },
//             {
//                 "name": "紫菜虾皮汤",
//                 "description": "鲜美可口，营养丰富"
//             }
//         ]
//     },
//     {
//         "id": 93,
//         "day": "周六",
//         "dishes": [
//             {
//                 "name": "红烧狮子头",
//                 "description": "肉质鲜嫩，汤汁浓郁"
//             },
//             {
//                 "name": "清炒菜心",
//                 "description": "清脆爽口，营养丰富"
//             },
//             {
//                 "name": "葱油拌面",
//                 "description": "香葱提味，面条劲道"
//             },
//             {
//                 "name": "海带排骨汤",
//                 "description": "营养美味，滋补养生"
//             }
//         ]
//     },
//     {
//         "id": 85,
//         "day": "周四",
//         "dishes": [
//             {
//                 "name": "糖醋里脊",
//                 "description": "外酥里嫩，酸甜可口"
//             },
//             {
//                 "name": "青椒土豆丝",
//                 "description": "家常小炒，爽口下饭"
//             },
//             {
//                 "name": "红烧茄子",
//                 "description": "软糯入味，下饭神器"
//             },
//             {
//                 "name": "番茄蛋汤",
//                 "description": "酸甜开胃，营养美味"
//             }
//         ]
//     },
//     {
//         "id": 97,
//         "day": "周日",
//         "dishes": [
//             {
//                 "name": "红烧肉",
//                 "description": "肥而不腻，入口即化"
//             },
//             {
//                 "name": "清蒸鸡",
//                 "description": "肉质鲜嫩，原汁原味"
//             },
//             {
//                 "name": "炒时蔬",
//                 "description": "时令蔬菜，清淡爽口"
//             },
//             {
//                 "name": "莲藕排骨汤",
//                 "description": "滋补养生，营养美味"
//             }
//         ]
//     }
// ]
  const [banner, setBanner] = useState<BannerItem[]>([])

  useEffect(() => {
    getTopBanner()
  }, [])

  const getTopBanner = () => {
    Taro.request({
      url: '/sell/notice/weekly-menu',
      success: (res) => {
        if (res.data?.data?.length > 0) {
          setBanner(res.data.data)
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
      <Swiper
        height={150}
        autoPlay={true}
        indicator
      >
        {banner.map((item, index) => (
          <SwiperItem key={index}>
            <Image src={item.url} mode='aspectFill' />
          </SwiperItem>
        ))}
      </Swiper>

      <View className='action-buttons'>
        <Button type='primary' onClick={handleScanCode}>
          扫码点餐
        </Button>
        <Button type='default' onClick={handlePhoneCall}>
          电话订座
        </Button>
      </View>
    </View>
  )
}

export default Index 