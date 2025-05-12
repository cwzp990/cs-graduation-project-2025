import React, { useState, useEffect, useRef } from 'react';
import {
  Popup,
  Image,
  Cell,
  Price,
  Button,
  Badge,
  Empty
} from '@nutui/nutui-react-taro'
import { NavBar, Toast, Icon } from '@nutui/nutui-react-native';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import './index.scss';

interface Category {
  categoryType: number;
  categoryName: string;
}

interface Product {
  productId: string;
  productName: string;
  productPrice: number;
  productStock: number;
  productDescription: string;
  productIcon: string;
  productStatus: number;
  categoryType: number;
  createTime: number;
  updateTime: number;
  categoryName: string | null;
}

interface CartItem extends Product {
  quantity: number;
}

const MenuPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { categoryType: 10, categoryName: '热销榜' },
    { categoryType: 11, categoryName: '小吃点心' },
    { categoryType: 12, categoryName: '特色主食' },
    { categoryType: 13, categoryName: '招牌炒菜' },
    { categoryType: 14, categoryName: '汤品' },
    { categoryType: 15, categoryName: '饮品' }
  ]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<number>(10);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const productListRef = useRef<any>(null);
  const categoryRefs = useRef<{ [key: number]: any }>({});

  // 获取菜品数据
  useEffect(() => {
    console.log(123)
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // 实际项目中应该使用Taro.request调用真实接口
      // 这里使用模拟数据
      setTimeout(() => {
        const mockData = {
          code: 0,
          msg: "成功",
          data: {
            page: {
              pageNo: 1,
              pageSize: 10,
              totalCount: 2,
              totalPages: 1
            },
            list: [
              {
                productId: "1743769561850693865",
                productName: "宫保鸡丁",
                productPrice: 24.00,
                productStock: 98,
                productDescription: "糊辣荔枝味，麻辣小酸甜，超下饭。不可免辣啊",
                productIcon: "http://p0.meituan.net/wmproduct/006990a72627d23ef2c7ff0e8288aa3a94544.jpg",
                productStatus: 0,
                categoryType: 10,
                createTime: 1743769561000,
                updateTime: 1747012251000,
                categoryName: null
              },
              {
                productId: "1743920506761605930",
                productName: "鲜肉生煎（6个）",
                productPrice: 17.88,
                productStock: 100,
                productDescription: "皮薄底酥汤水足",
                productIcon: "http://p0.meituan.net/wmproduct/f6b70911dab5ebec6668f569dbfc3e5b419175.jpg",
                productStatus: 0,
                categoryType: 11,
                createTime: 1743920506000,
                updateTime: 1743924824000,
                categoryName: null
              },
              {
                productId: "1743920506761605931",
                productName: "麻婆豆腐",
                productPrice: 22.00,
                productStock: 100,
                productDescription: "麻辣鲜香，下饭神器",
                productIcon: "http://p0.meituan.net/wmproduct/f6b70911dab5ebec6668f569dbfc3e5b419175.jpg",
                productStatus: 0,
                categoryType: 10,
                createTime: 1743920506000,
                updateTime: 1743924824000,
                categoryName: null
              },
              {
                productId: "1743920506761605932",
                productName: "红烧肉",
                productPrice: 32.00,
                productStock: 100,
                productDescription: "肥而不腻，入口即化",
                productIcon: "http://p0.meituan.net/wmproduct/006990a72627d23ef2c7ff0e8288aa3a94544.jpg",
                productStatus: 0,
                categoryType: 12,
                createTime: 1743920506000,
                updateTime: 1743924824000,
                categoryName: null
              },
              {
                productId: "1743920506761605933",
                productName: "酸菜鱼",
                productPrice: 48.00,
                productStock: 100,
                productDescription: "鱼肉鲜嫩，酸辣可口",
                productIcon: "http://p0.meituan.net/wmproduct/006990a72627d23ef2c7ff0e8288aa3a94544.jpg",
                productStatus: 0,
                categoryType: 13,
                createTime: 1743920506000,
                updateTime: 1743924824000,
                categoryName: null
              },
              {
                productId: "1743920506761605934",
                productName: "紫菜蛋花汤",
                productPrice: 12.00,
                productStock: 100,
                productDescription: "清淡爽口，营养丰富",
                productIcon: "http://p0.meituan.net/wmproduct/f6b70911dab5ebec6668f569dbfc3e5b419175.jpg",
                productStatus: 0,
                categoryType: 14,
                createTime: 1743920506000,
                updateTime: 1743924824000,
                categoryName: null
              },
              {
                productId: "1743920506761605935",
                productName: "冰镇柠檬水",
                productPrice: 8.00,
                productStock: 100,
                productDescription: "清凉解暑，酸甜可口",
                productIcon: "http://p0.meituan.net/wmproduct/f6b70911dab5ebec6668f569dbfc3e5b419175.jpg",
                productStatus: 0,
                categoryType: 15,
                createTime: 1743920506000,
                updateTime: 1743924824000,
                categoryName: null
              }
            ]
          }
        };

        if (mockData.code === 0) {
          setProducts(mockData.data.list);
        } else {
          Toast.show('获取菜品数据失败');
        }
        setLoading(false);
      }, 500);

      // 实际接口调用示例
      // const res = await Taro.request({
      //   url: '/sell/seller/category/list?status=0',
      //   method: 'GET'
      // });
      // if (res.data.code === 0) {
      //   setProducts(res.data.data.list);
      // } else {
      //   Toast.show('获取菜品数据失败');
      // }
      // setLoading(false);
    } catch (error) {
      console.error('获取菜品数据失败', error);
      Toast.show('获取菜品数据失败');
      setLoading(false);
    }
  };

  // 处理分类切换
  const handleCategoryChange = (categoryType: number) => {
    setActiveCategory(categoryType);

    // 滚动到对应分类的商品区域
    const productList = productListRef.current;
    if (productList) {
      // 找到该分类的第一个商品
      const firstProductIndex = products.findIndex(p => p.categoryType === categoryType);
      if (firstProductIndex >= 0) {
        // 计算大致的滚动位置（每个商品项高度约为100px）
        productList.scrollTo({ top: firstProductIndex * 100, behavior: 'smooth' });
      }
    }
  };

  // 监听商品列表滚动，更新当前分类
  const handleProductListScroll = (e: any) => {
    const scrollTop = e.detail.scrollTop;

    // 根据滚动位置判断当前分类
    // 简单实现：假设每个商品高度为100px，计算当前可见的第一个商品
    const visibleItemIndex = Math.floor(scrollTop / 100);
    if (visibleItemIndex >= 0 && visibleItemIndex < products.length) {
      const visibleCategory = products[visibleItemIndex].categoryType;
      if (visibleCategory !== activeCategory) {
        setActiveCategory(visibleCategory);

        // 滚动左侧分类列表，使当前分类可见
        const categoryRef = categoryRefs.current[visibleCategory];
        if (categoryRef) {
          categoryRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  // 添加到购物车
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.productId);

      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    Toast.show({
      content: '已加入购物车',
      duration: 1000,
    });
  };

  // 从购物车移除
  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);

      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter(item => item.productId !== productId);
      }
    });
  };

  // 清空购物车
  const clearCart = () => {
    setCart([]);
    setShowCart(false);
    Toast.show('购物车已清空');
  };

  // 计算购物车总价
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.productPrice * item.quantity, 0);
  };

  // 计算购物车商品总数
  const calculateTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // 过滤当前分类的商品
  const filteredProducts = products.filter(product =>
    product.categoryType === activeCategory &&
    (searchText ? product.productName.includes(searchText) : true)
  );

  // 提交订单
  const submitOrder = () => {
    if (cart.length === 0) {
      Toast.show('购物车为空');
      return;
    }

    // 这里应该跳转到订单确认页面
    Toast.show('提交订单成功');
    setShowCart(false);
  };

  return (
    <View className="menu-page">
      <NavBar
        title="菜品浏览"
        leftShow
        onClickLeft={() => Taro.navigateBack()}
        rightShow
        onClickRight={() => Toast.show('搜索功能')}
      />

      <View className="banner">
        <Text className="banner-text">温馨提示，请适量点餐</Text>
      </View>

      <View className="menu-container">
        <ScrollView className="category-sidebar" scrollY>
          {categories.map(category => (
            <View
              key={category.categoryType}
              className={`category-item ${activeCategory === category.categoryType ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.categoryType)}
              ref={el => categoryRefs.current[category.categoryType] = el}
            >
              {category.categoryName}
            </View>
          ))}
        </ScrollView>

        <ScrollView
          className="product-list"
          scrollY
          ref={productListRef}
          onScroll={handleProductListScroll}
          scrollWithAnimation
        >
          {loading ? (
            <View className="loading">加载中...</View>
          ) : filteredProducts.length === 0 ? (
            <Empty description="暂无商品" />
          ) : (
            filteredProducts.map(product => (
              <Cell
                key={product.productId}
                className="product-item"
              >
                <View className="product-content">
                  <Image
                    src={product.productIcon}
                    width="80px"
                    height="80px"
                    radius="6px"
                  />
                  <View className="product-info">
                    <Text className="product-name">{product.productName}</Text>
                    <Text className="product-desc">{product.productDescription}</Text>
                    <View className="product-sales">
                      <Text className="sales-text">月售 100+</Text>
                      <Text className="rating-text">好评率 95%</Text>
                    </View>
                    <View className="product-bottom">
                      <Price price={product.productPrice} thousands />
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => addToCart(product)}
                      >
                        <Icon name="plus" />
                      </Button>
                    </View>
                  </View>
                </View>
              </Cell>
            ))
          )}
        </ScrollView>
      </View>

      {cart.length > 0 && (
        <View className="cart-bar">
          <View className="cart-icon" onClick={() => setShowCart(true)}>
            <Icon name="cart" size="24px" />
            <Badge value={calculateTotalItems()} max={99} />
          </View>
          <View className="cart-info">
            <Price price={calculateTotal()} thousands />
          </View>
          <Button type="primary" onClick={submitOrder}>
            去结算
          </Button>
        </View>
      )}

      <Popup
        visible={showCart}
        position="bottom"
        round
        onClose={() => setShowCart(false)}
      >
        <View className="cart-popup">
          <View className="cart-header">
            <Text className="cart-title">购物车</Text>
            <Text className="cart-clear" onClick={clearCart}>清空</Text>
          </View>

          <View className="cart-list">
            {cart.map(item => (
              <View key={item.productId} className="cart-item">
                <View className="item-info">
                  <Text className="item-name">{item.productName}</Text>
                  <Price price={item.productPrice} thousands />
                </View>
                <View className="item-actions">
                  <Button
                    size="mini"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <Icon name="minus" />
                  </Button>
                  <Text className="item-quantity">{item.quantity}</Text>
                  <Button
                    size="mini"
                    type="primary"
                    onClick={() => addToCart(item)}
                  >
                    <Icon name="plus" />
                  </Button>
                </View>
              </View>
            ))}
          </View>

          <View className="cart-footer">
            <View className="total-price">
              合计: <Price price={calculateTotal()} thousands />
            </View>
            <Button type="primary" onClick={submitOrder}>
              去结算({calculateTotalItems()})
            </Button>
          </View>
        </View>
      </Popup>
    </View>
  );
};

export default MenuPage;