import { View, Textarea, Text } from '@tarojs/components'
import { Cell, Button, Popup, Radio, InputNumber } from '@nutui/nutui-react-taro'
import { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import './index.scss'

interface PayWay {
  id: number;
  package: string;
  money: number;
}

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

const payWays: PayWay[] = [
  { id: 1, package: '会员卡', money: 100 },
  { id: 2, package: '微信支付', money: 500 },
  { id: 3, package: '银行卡', money: 1000 }
]

const ConfirmOrder = () => {
  const router = useRouter()
  const [tableNum, setTableNum] = useState('')
  const [cartList, setCartList] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalNum, setTotalNum] = useState(0)
  const [dinerNum, setDinerNum] = useState(1)
  const [remarks, setRemarks] = useState('')
  const [showPayWay, setShowPayWay] = useState(false)
  const [selectedPayWay, setSelectedPayWay] = useState<PayWay | null>(null)

  useEffect(() => {
    const { tableNum: num } = router.params
    setTableNum(num as string)
    // sell/seller/order/list {"page":1,"size":10,"orderStatus":1}
  //   {
  //     "code": 0,
  //     "msg": "成功",
  //     "data": {
  //         "page": {
  //             "pageNo": 1,
  //             "pageSize": 10,
  //             "totalCount": 1,
  //             "totalPages": 1
  //         },
  //         "list": [
  //             {
  //                 "orderId": "1743925080485307084",
  //                 "buyerName": "微信用户",
  //                 "buyerPhone": "15805849785",
  //                 "buyerAddress": "1号桌",
  //                 "buyerOpenid": "null",
  //                 "orderAmount": 48.00,
  //                 "orderStatus": 2,
  //                 "payStatus": 0,
  //                 "payType": null,
  //                 "orderStatusStr": "已完结",
  //                 "payStatusStr": "等待支付",
  //                 "createTime": "2025-04-06 15:38:00",
  //                 "updateTime": "2025-04-06 16:40:48",
  //                 "orderDetailList": [
  //                     {
  //                         "detailId": "1743925080493947309",
  //                         "orderId": "1743925080485307084",
  //                         "productId": "1743769561850693865",
  //                         "productName": "宫保鸡丁",
  //                         "productPrice": 24.00,
  //                         "productQuantity": 2,
  //                         "productIcon": "http://p0.meituan.net/wmproduct/006990a72627d23ef2c7ff0e8288aa3a94544.jpg"
  //                     }
  //                 ]
  //             }
  //         ]
  //     }
  // }
    loadCartData()
  }, [])

  const loadCartData = () => {
    const cart = Taro.getStorageSync('cart') || []
    setCartList(cart)
    calculateTotal(cart)
  }

  const calculateTotal = (cart: CartItem[]) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const num = cart.reduce((sum, item) => sum + item.quantity, 0)
    setTotalPrice(total)
    setTotalNum(num)
  }

  const handleSubmit = () => {
    if (!selectedPayWay) {
      Taro.showToast({ title: '请选择支付方式', icon: 'none' })
      return
    }

    const goods = cartList.map(item => ({
      productId: item.id,
      productQuantity: item.quantity
    }))

    Taro.request({
      url: 'YOUR_API_BASE_URL/buyer/order/create',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        openid: 'YOUR_OPENID', // 需要从全局状态获取
        name: 'YOUR_NAME', // 需要从全局状态获取
        phone: '15805849785',
        address: tableNum,
        items: JSON.stringify(goods)
      },
      success: (res) => {
        if (res.data?.data) {
          Taro.showToast({ title: '下单成功！' })
          Taro.setStorageSync('cart', '')
          Taro.switchTab({ url: '/pages/profile/index' })
        }
      }
    })
  }

  return (
    <View className='confirm-order'>
      <View className='order-info'>
        <Cell title='桌号'>
          <View>{tableNum}</View>
        </Cell>
        <Cell title='用餐人数'>
          <InputNumber
            value={dinerNum}
            onChange={(value: number) => setDinerNum(value)}
            min={1}
            max={20}
          />
        </Cell>
        <Cell title='备注'>
          <Textarea
            value={remarks}
            onInput={(e) => setRemarks(e.detail.value)}
            placeholder='请输入备注信息'
            maxlength={200}
          />
        </Cell>
      </View>

      <View className='order-items'>
        <View className='section-title'>订单明细</View>
        {cartList.map((item) => (
          <Cell
            key={item.id}
            title={item.name}
          >
            <View className='item-info'>
              <View>x{item.quantity}</View>
              <View>¥{(item.price * item.quantity).toFixed(2)}</View>
            </View>
          </Cell>
        ))}
      </View>

      <View className='order-footer'>
        <View className='total'>
          总计: <Text className='price'>¥{totalPrice.toFixed(2)}</Text>
        </View>
        <Button type='primary' onClick={() => setShowPayWay(true)}>
          去支付
        </Button>
      </View>

      <Popup
        visible={showPayWay}
        position='bottom'
        onClose={() => setShowPayWay(false)}
      >
        <View className='pay-way-popup'>
          <View className='popup-title'>选择支付方式</View>
          <Radio.Group value={selectedPayWay?.id} onChange={(value) => {
            const way = payWays.find(w => w.id === value)
            setSelectedPayWay(way || null)
          }}>
            {payWays.map((way) => (
              <Cell key={way.id}>
                <Radio value={way.id}>{way.package}</Radio>
              </Cell>
            ))}
          </Radio.Group>
          <View className='popup-footer'>
            <Button type='primary' onClick={handleSubmit}>
              确认支付
            </Button>
          </View>
        </View>
      </Popup>
    </View>
  )
}

export default ConfirmOrder 