import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { 
  Card,
  Tag, 
  Empty, 
  Button, 
  Divider, 
  Avatar, 
  Price, 
  Skeleton
} from '@nutui/nutui-react-taro'
import './index.scss'

interface OrderDetail {
  detailId: string
  orderId: string
  productId: string
  productName: string
  productPrice: number
  productQuantity: number
  productIcon: string
}

interface Order {
  orderId: string
  buyerName: string
  buyerPhone: string
  buyerAddress: string
  buyerOpenid: string
  orderAmount: number
  orderStatus: number
  payStatus: number
  payType: number | null
  orderStatusStr: string
  payStatusStr: string
  createTime: string
  updateTime: string
  orderDetailList: OrderDetail[]
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)

  // 获取订单列表
  const fetchOrders = async (pageNum = 1) => {
    try {
      setLoading(true)
      const res = await Taro.request({
        url: 'sell/seller/order/list',
        method: 'GET',
        data: {
          page: pageNum,
          size: 10
        }
      })
      
      if (pageNum === 1) {
        setOrders(res.data || [])
      } else {
        setOrders([...orders, ...(res.data || [])])
      }
      
      setHasMore(res.data && res.data.length > 0)
      setPage(pageNum)
    } catch (error) {
      console.error('获取订单列表失败', error)
      Taro.showToast({
        title: '获取订单列表失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 加载更多
  const loadMore = () => {
    if (hasMore) {
      fetchOrders(page + 1)
    }
  }

  // 查看订单详情
  const viewOrderDetail = (orderId: string) => {
    Taro.navigateTo({
      url: `/pages/order-detail/index?orderId=${orderId}`
    })
  }

  // 获取订单状态对应的标签类型
  const getOrderStatusTagType = (status: number) => {
    switch (status) {
      case 0: return 'primary' // 新订单
      case 1: return 'success' // 已完成
      case 2: return 'info'    // 已取消
      default: return 'default'
    }
  }

  // 获取支付状态对应的标签类型
  const getPayStatusTagType = (status: number) => {
    switch (status) {
      case 0: return 'warning' // 等待支付
      case 1: return 'success' // 支付成功
      case 2: return 'danger'  // 支付失败
      default: return 'default'
    }
  }

  // 监听滚动到底部事件
  const handleScrollToLower = () => {
    if (hasMore && !loading) {
      loadMore()
    }
  }

  // 初始化加载
  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <View className="orders-page">
      <View className="orders-header">
        <Text className="page-title">我的订单</Text>
      </View>

      {loading && page === 1 ? (
        <View className="skeleton-container">
          {[1, 2, 3].map(item => (
            <Skeleton
              key={item}
              width="94%"
              height="160px"
              animated
              title
              avatar
              row={3}
              className="skeleton-item"
            />
          ))}
        </View>
      ) : orders.length === 0 ? (
        <Empty
          description="暂无订单"
          image="empty"
        >
          <Button 
            type="primary" 
            size="small"
            onClick={() => Taro.switchTab({ url: '/pages/menu/index' })}
          >
            去点餐
          </Button>
        </Empty>
      ) : (
        <ScrollView
          className="orders-list"
          scrollY
          lowerThreshold={100}
          onScrollToLower={handleScrollToLower}
        >
          {orders.map((order) => (
            <Card
              key={order.orderId}
              className="order-card"
              onClick={() => viewOrderDetail(order.orderId)}
            >
              <View className="order-card-header">
                <View className="order-id">订单号: {order.orderId}</View>
                <View className="order-status">
                  <Tag type={getOrderStatusTagType(order.orderStatus)}>
                    {order.orderStatusStr}
                  </Tag>
                  <Tag type={getPayStatusTagType(order.payStatus)}>
                    {order.payStatusStr}
                  </Tag>
                </View>
              </View>
              
              <Divider />
              
              <View className="order-items">
                {order.orderDetailList.map((item) => (
                  <View key={item.detailId} className="order-item">
                    <Avatar 
                      size="large" 
                      src={item.productIcon} 
                      className="product-image"
                    />
                    <View className="product-info">
                      <View className="product-name">{item.productName}</View>
                      <View className="product-price-quantity">
                        <Price price={item.productPrice} size="small" />
                        <Text className="quantity">x{item.productQuantity}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
              
              <Divider />
              
              <View className="order-footer">
                <View className="order-time">{order.createTime}</View>
                <View className="order-amount">
                  <Text className="amount-label">总计: </Text>
                  <Price price={order.orderAmount} size="normal" />
                </View>
              </View>
            </Card>
          ))}
          
          {loading && page > 1 && (
            <View className="loading-more">
              <Text>加载中...</Text>
            </View>
          )}
          
          {!hasMore && orders.length > 0 && (
            <View className="no-more">
              <Text>没有更多了</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  )
}

export default OrdersPage
