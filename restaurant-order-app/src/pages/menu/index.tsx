import { View, Image } from '@tarojs/components'
import { Tabs, TabPane, Card, Button, Badge, Popup, Cell } from '@nutui/nutui-react-taro'
import { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import './index.scss'

interface Food {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
}

interface Category {
  id: string | number;
  name: string;
  foods: Food[];
}

const Menu = () => {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [currentCategory, setCurrentCategory] = useState<number>(0)
  const [cartList, setCartList] = useState<Food[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [totalNum, setTotalNum] = useState<number>(0)
  const [showCart, setShowCart] = useState<boolean>(false)
  const tableNum = router.params.tableNum as string

  useEffect(() => {
    fetchMenuData()
    loadCartData()
  }, [])

  const fetchMenuData = () => {
    Taro.request({
      url: '/sell/seller/category/list?status=0',
    //   返回的结果为{
    //     "code": 0,
    //     "msg": "成功",
    //     "data": {
    //         "page": {
    //             "pageNo": 1,
    //             "pageSize": 10,
    //             "totalCount": 2,
    //             "totalPages": 1
    //         },
    //         "list": [
    //             {
    //                 "productId": "1743769561850693865",
    //                 "productName": "宫保鸡丁",
    //                 "productPrice": 24.00,
    //                 "productStock": 98,
    //                 "productDescription": "糊辣荔枝味，麻辣小酸甜，超下饭。不可免辣啊",
    //                 "productIcon": "http://p0.meituan.net/wmproduct/006990a72627d23ef2c7ff0e8288aa3a94544.jpg",
    //                 "productStatus": 0,
    //                 "categoryType": 10,
    //                 "createTime": 1743769561000,
    //                 "updateTime": 1747012251000,
    //                 "categoryName": null
    //             },
    //             {
    //                 "productId": "1743920506761605930",
    //                 "productName": "鲜肉生煎（6个）",
    //                 "productPrice": 17.88,
    //                 "productStock": 100,
    //                 "productDescription": "皮薄底酥汤水足",
    //                 "productIcon": "http://p0.meituan.net/wmproduct/f6b70911dab5ebec6668f569dbfc3e5b419175.jpg",
    //                 "productStatus": 0,
    //                 "categoryType": 11,
    //                 "createTime": 1743920506000,
    //                 "updateTime": 1743924824000,
    //                 "categoryName": null
    //             }
    //         ]
    //     }
    // }
      success: (res) => {
        if (res.data?.data?.length > 0) {
          const data = res.data.data.map((item: any, index: number) => ({
            ...item,
            id: index,
            foods: item.foods.map((food: any) => ({
              ...food,
              quantity: 0
            }))
          }))
          setCategories(data)
        }
      }
    })
  }

  const loadCartData = () => {
    const cart = Taro.getStorageSync('cart') || []
    setCartList(cart)
    calculateTotal(cart)
  }

  const calculateTotal = (cart: Food[]) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const num = cart.reduce((sum, item) => sum + item.quantity, 0)
    setTotalPrice(total)
    setTotalNum(num)
  }

  const addToCart = (food: Food) => {
    if (!tableNum) {
      Taro.showModal({
        title: '提示',
        content: '请到首页扫码点餐',
        showCancel: false,
        success: () => {
          Taro.switchTab({ url: '/pages/index/index' })
        }
      })
      return
    }

    const newCart = [...cartList]
    const existingItem = newCart.find(item => item.id === food.id)

    if (existingItem) {
      existingItem.quantity++
    } else {
      newCart.push({ ...food, quantity: 1 })
    }

    setCartList(newCart)
    Taro.setStorageSync('cart', newCart)
    calculateTotal(newCart)
  }

  const removeFromCart = (food: Food) => {
    const newCart = cartList.filter(item => {
      if (item.id === food.id) {
        if (item.quantity > 1) {
          item.quantity--
          return true
        }
        return false
      }
      return true
    })

    setCartList(newCart)
    Taro.setStorageSync('cart', newCart)
    calculateTotal(newCart)
  }

  const handleCheckout = () => {
    if (cartList.length === 0) {
      Taro.showToast({ title: '请先选择商品', icon: 'none' })
      return
    }
    Taro.navigateTo({ url: '/pages/orders/confirm' })
  }

  return (
    <View className='menu'>
      <Tabs value={currentCategory} onChange={(index: number) => setCurrentCategory(index)}>
        {categories.map((category, index) => (
          <TabPane title={category.name} key={index}>
            <View className='food-list'>
              {category.foods.map((food) => (
                <Card
                  key={food.id}
                  className='food-item'
                  imgUrl={food.image}
                  title={food.name}
                  price={String(food.price)}
                  description={food.description}
                >
                  <View className='food-actions'>
                    <Button
                      size='small'
                      type='primary'
                      onClick={() => addToCart(food)}
                    >
                      加入购物车
                    </Button>
                  </View>
                </Card>
              ))}
            </View>
          </TabPane>
        ))}
      </Tabs>

      <View className='cart-bar'>
        <Badge value={totalNum} max={99}>
          <Button
            type='primary'
            onClick={() => setShowCart(true)}
          >
            购物车
          </Button>
        </Badge>
        <View className='total-price'>
          总计: ¥{totalPrice.toFixed(2)}
        </View>
        <Button
          type='primary'
          onClick={handleCheckout}
        >
          去结算
        </Button>
      </View>

      <Popup
        visible={showCart}
        position='bottom'
        onClose={() => setShowCart(false)}
      >
        <View className='cart-popup'>
          <View className='cart-title'>购物车</View>
          {cartList.map((item) => (
            <Cell key={item.id}>
              <View className='cart-item'>
                <Image src={item.image} mode='aspectFill' />
                <View className='item-info'>
                  <View className='item-name'>{item.name}</View>
                  <View className='item-price'>¥{item.price}</View>
                </View>
                <View className='item-quantity'>
                  <Button
                    size='small'
                    onClick={() => removeFromCart(item)}
                  >
                    -
                  </Button>
                  <View className='quantity'>{item.quantity}</View>
                  <Button
                    size='small'
                    onClick={() => addToCart(item)}
                  >
                    +
                  </Button>
                </View>
              </View>
            </Cell>
          ))}
        </View>
      </Popup>
    </View>
  )
}

export default Menu 