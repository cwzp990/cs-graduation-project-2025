import { View, Image } from '@tarojs/components'
import { Cell, Avatar, Button } from '@nutui/nutui-react-taro'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

interface UserInfo {
  nickName: string;
  avatarUrl: string;
  openid?: string;
}

const Profile = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isShowUserName, setIsShowUserName] = useState(false)

  useEffect(() => {
  //   后端返回的结果：
  //   {
  //     "sellerId": 1,
  //     "username": "chenwenzhen",
  //     "password": "123456",
  //     "phone": "18655323262",
  //     "gender": 1,
  //     "avatar": "https://img.meituan.net/avatar/2d67bc5fca1f7e95d764b1757ad0919244335.jpg",
  //     "createTime": 1743764929000,
  //     "updateTime": 1746878112000
  // }
    loadUserInfo()
  }, [])

  const loadUserInfo = () => {
    const user = Taro.getStorageSync('userInfo')
    if (user) {
      setUserInfo(user)
      setIsShowUserName(true)
    }
  }

  const handleGetUserInfo = (e: any) => {
    if (e.detail.userInfo) {
      const user = {
        ...e.detail.userInfo,
        openid: 'YOUR_OPENID' // 需要从全局状态获取
      }
      setUserInfo(user)
      setIsShowUserName(true)
      Taro.setStorageSync('userInfo', user)
    } else {
      Taro.showToast({
        title: '登录需要允许授权',
        icon: 'none'
      })
    }
  }

  const goToMyOrder = () => {
    Taro.navigateTo({ url: '/pages/orders/list' })
  }

  const goToMyComment = () => {
    Taro.navigateTo({ url: '/pages/comments/list?type=1' })
  }

  const goToChange = () => {
    Taro.navigateTo({ url: '/pages/profile/change' })
  }

  return (
    <View className='profile'>
      <View className='user-info'>
        {isShowUserName ? (
          <View className='user-card'>
            <Avatar
              size='large'
              src={userInfo?.avatarUrl}
            />
            <View className='user-name'>{userInfo?.nickName}</View>
          </View>
        ) : (
          <Button
            type='primary'
            openType='getUserInfo'
            onGetUserInfo={handleGetUserInfo}
          >
            点击登录
          </Button>
        )}
      </View>

      <View className='menu-list'>
        <Cell
          title='我的订单'
          onClick={goToMyOrder}
        >
          <View className='cell-right'>查看订单</View>
        </Cell>
        <Cell
          title='我的评价'
          onClick={goToMyComment}
        >
          <View className='cell-right'>查看评价</View>
        </Cell>
        <Cell
          title='修改信息'
          onClick={goToChange}
        >
          <View className='cell-right'>修改</View>
        </Cell>
      </View>
    </View>
  )
}

export default Profile 