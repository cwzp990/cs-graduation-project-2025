import { getData, postData } from "../utils/request";

const weeklyMenu = [
  {
    day: "周一",
    dishes: [
      { name: "宫保鸡丁", description: "鸡肉鲜嫩，花生米香脆", url: '' },
      { name: "西红柿炒鸡蛋", description: "经典家常菜，酸甜可口", url: '' },
    ],
  },
  {
    day: "周二",
    dishes: [
      { name: "鱼香肉丝", description: "咸甜酸辣兼备，口感丰富", url: '' },
      { name: "麻婆豆腐", description: "麻辣鲜香，豆腐嫩滑", url: '' },
    ],
  },
  {
    day: "周三",
    dishes: [
      { name: "糖醋排骨", description: "色泽红亮，酸甜适口", url: '' },
      { name: "清炒时蔬", description: "新鲜蔬菜，清爽可口", url: '' },
    ],
  },
  {
    day: "周四",
    dishes: [
      { name: "红烧肉", description: "肥而不腻，入口即化", url: '' },
      { name: "紫菜蛋花汤", description: "清淡鲜美，营养丰富", url: '' },
    ],
  },
  {
    day: "周五",
    dishes: [
      { name: "辣子鸡", description: "鸡肉外酥里嫩，麻辣过瘾", url: '' },
      { name: "凉拌黄瓜", description: "清爽可口，夏日必备", url: '' },
    ],
  },
  {
    day: "周六",
    dishes: [
      { name: "粉蒸肉", description: "肉质软糯，米粉香浓", url: '' },
      { name: "冬瓜肉丸汤", description: "肉丸鲜嫩，冬瓜清甜", url: '' },
    ],
  },
  {
    day: "周日",
    dishes: [
      { name: "油焖大虾", description: "虾肉鲜嫩，酱汁浓郁", url: '' },
      { name: "凉拌木耳", description: "口感爽脆，营养丰富", url: '' },
    ],
  },
];

export const getLogin = async (phone: string, password: string) => {
  return getData("/admin/loginAdmin", { phone, password });
};

// 获取人员列表
export const getPersonList = async (params?: { username?: string; gender?: number }) => {
  return getData("/admin/list", params || {});
};

// 新增人员
export const updatePerson = async (data) => {
  return postData("/admin/save", data);
};

// 获取一周菜品信息
export const getNoticeData = async() => {
  return getData('/notice/weekly-menu', {})
}

// 更新一周菜品信息
export const uodateNoticeData = async (data) => {
  return postData('/notice/weekly-menu/update', data)
}

// 获取菜系列表
export const getCuisineList = async () => {
  return getData("/seller/category/list", {});
};

// 删除菜系
export const deleteCuisine = async (categoryId: number) => {
  return postData("/seller/category/delete", { categoryId });
};

// 添加菜系
export const updateCuisine = async (data) => {
  return postData("/seller/category/save", data);
};

// 获取菜品列表
export const getDishes = async (params: any) => {
  return getData("/seller/product/list", params);
};

// 通过id获取菜品信息
export const getDishById = async (productId: string) => {
  return getData(`/seller/product/ById`, { productId });
};

// 修改菜品
export const updateDish = async (data) => {
  return postData(`/seller/product/save`, data);
};

// 上/下架菜品
// status: 1 上架, 0 下架
export const changeDishStatus = async (status: number, productId: number) => {
  return getData(`/seller/product/${status === 1 ? "on_sale" : "off_sale"}`, {
    productId,
  });
};

// 获取订单列表
export const getOrderList = async (params: any) => {
  return postData("/seller/order/list", params);
};

// 完结订单
export const finishOrder = async (orderId: string) => {
  return postData("/seller/order/finish", { orderId });
};

// 获取食堂列表
export const getCanteenList = async () => {
  return getData("/seller/canteen/list", {});
};

// 新增食堂
export const updateCanteen = async (data) => {
  return postData("/seller/canteen/save", data);
};

// 删除食堂
export const deleteCanteen = async (id: number) => {
  return postData("/seller/canteen/delete", { id });
};


// 获取公告列表
export const getNotificationList = async () => {
  // return getData('/seller/notification/list', {});
  return { data: weeklyMenu };
};