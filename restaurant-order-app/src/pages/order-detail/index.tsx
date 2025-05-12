import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { 
  Cell, 
  CellGroup, 
  Tag, 
  Button, 
  Divider, 
  Avatar, 
  Price, 
  Skeleton,
  Steps,
  Step
} from '@nutui/nutui-react-taro'
import { Toast } from '@nutui/nutui-react-native';
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

const OrderDetailPage: React.FC = () => {
  const router = useRouter()
  const { orderId } = router.params
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [showToast, setShowToast] = useState<boolean>(false)
  const [toastMsg, setToastMsg] = useState<string>('')
  const [toastType, setToastType] = useState<'success' | 'fail' | 'warn' | 'loading'>('loading')

  // 获取订单详情
  const fetchOrderDetail = async () => {
    try {
      setLoading(true)
      const res = await Taro.request({
        url: `sell/seller/order/detail?orderId=${orderId}`,
        method: 'GET'
      })
      
      if (res.data) {
        setOrder(res.data)
      } else {
        showToastMessage('订单不存在', 'fail')
      }
    } catch (error) {
      console.error('获取订单详情失败', error)
      showToastMessage('获取订单详情失败', 'fail')
    } finally {
      setLoading(false)
    }
  }

  // 显示提示消息
  const showToastMessage = (msg: string, type: 'success' | 'fail' | 'warn' | 'loading' = 'success') => {
    setToastMsg(msg)
    setToastType(type)
    setShowToast(true)
  }

  // 支付订单
  const payOrder = async () => {
    try {
      showToastMessage('正在发起支付...', 'loading')
      // 这里应该调用实际的支付接口
      // 模拟支付过程
      setTimeout(() => {
        showToastMessage('支付成功', 'success')
        // 重新获取订单信息
        fetchOrderDetail()
      }, 2000)
    } catch (error) {
      console.error('支付失败', error)
      showToastMessage('支付失败，请重试', 'fail')
    }
  }

  // 取消订单
  const cancelOrder = async () => {
    try {
      showToastMessage('正在取消订单...', 'loading')
      // 这里应该调用实际的取消订单接口
      // 模拟取消过程
      setTimeout(() => {
        showToastMessage('订单已取消', 'success')
        // 重新获取订单信息
        fetchOrderDetail()
      }, 2000)
    } catch (error) {
      console.error('取消订单失败', error)
      showToastMessage('取消订单失败，请重试', 'fail')
    }
  }

  // 获取订单状态对应的步骤
  const getOrderSteps = () => {
    const steps = [
      { title: '下单成功', description: order?.createTime || '' },
      { title: '商家接单', description: '' },
      { title: '订单完成', description: order?.updateTime || '' }
    ]
    
    let current = 0
    if (order?.orderStatus === 1) {
      current = 2
    } else if (order?.orderStatus === 0) {
      current = 1
    }
    
    return { steps, current }
  }

  // 初始化加载
  useEffect(() => {
    if (orderId) {
      fetchOrderDetail()
    } else {
      showToastMessage('订单ID不存在', 'fail')
      setTimeout(() => {
        Taro.navigateBack()
      }, 2000)
    }
  }, [orderId])

  if (loading) {
    return (
      <View className="order-detail-page">
        <Skeleton width="94%" height="100px" animated title row={3} className="skeleton-item" />
        <Skeleton width="94%" height="200px" animated title row={5} className="skeleton-item" />
        <Skeleton width="94%" height="150px" animated title row={3} className="skeleton-item" />
      </View>
    )
  }

  if (!order) {
    return (
      <View className="order-detail-page">
        <View className="empty-state">
          <Text>订单不存在或已被删除</Text>
          <Button 
            type="primary" 
            size="small"
            onClick={() => Taro.navigateBack()}
            className="back-btn"
          >
            返回订单列表
          </Button>
        </View>
      </View>
    )
  }

  const { steps, current } = getOrderSteps()

  return (
    <View className="order-detail-page">
      <Toast
        msg={toastMsg}
        visible={showToast}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
      
      <View className="order-status-card">
        <View className="status-header">
          <Text className="status-text">{order.orderStatusStr}</Text>
          <Tag type={order.payStatus === 0 ? 'warning' : 'success'}>
            {order.payStatusStr}
          </Tag>
        </View>
        
        <Steps current={current} className="order-steps">
          {steps.map((step, index) => (
            <Step 
              key={index}
              title={step.title} 
              description={step.description}
            />
          ))}
        </Steps>
      </View>
      
      <CellGroup title="订单信息" className="info-group">
        <Cell title="订单编号" desc={order.orderId} />
        <Cell title="下单时间" desc={order.createTime} />
        <Cell title="更新时间" desc={order.updateTime} />
      </CellGroup>
      
      <CellGroup title="配送信息" className="info-group">
        <Cell title="收货人" desc={order.buyerName} />
        <Cell title="联系电话" desc={order.buyerPhone} />
        <Cell title="配送地址" desc={order.buyerAddress} />
      </CellGroup>
      
      <View className="order-items-card">
        <View className="card-title">商品信息</View>
        <Divider />
        
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
        
        <Divider />
        
        <View className="order-amount">
          <Text className="amount-text">订单总价</Text>
          <Price price={order.orderAmount} size="large" />
        </View>
      </View>
      
      <View className="action-buttons">
        {order.payStatus === 0 && order.orderStatus !== 2 && (
          <Button 
            type="primary" 
            block
            onClick={payOrder}
          >
            立即支付
          </Button>
        )}
        
        {order.orderStatus === 0 && (
          <Button 
            type="default" 
            block
            onClick={cancelOrder}
          >
            取消订单
          </Button>
        )}
      </View>
    </View>
  )
}

export default OrderDetailPage