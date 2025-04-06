import { getData, postData } from "../utils/request";

export const getLogin = async (phone: string, password: string) => {
  return getData("/admin/loginAdmin", { phone, password });
};

// 获取人员列表
export const getPersonList = async () => {
  return getData("/admin/list", {});
};

// 新增人员
export const updatePerson = async (data) => {
  return postData("/admin/save", data);
};

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
  return getData(`/seller/product/${status === 1 ? 'on_sale' : 'off_sale'}`, { productId });
};

// 获取订单列表
export const getOrderList = async (data) => {
  return postData("/seller/order/list", data);
};

// 完结订单
export const finishOrder = async (orderId: string) => {
  return postData("/seller/order/finish", { orderId });
};


