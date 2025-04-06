import {
  OrderedListOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  PayCircleOutlined,
} from "@ant-design/icons";
import { AdminRouterItem } from "../../router";
import OrderManagementPage from "."; // 订单管理主页面
import PaidOrdersPage from "./components/PaidOrders"; // 已支付订单页面
import RefundedOrdersPage from "./components/RefundedOrders"; // 已退款订单页面
import CompletedOrdersPage from "./components/CompletedOrders"; // 已完成订单页面
import CancelledOrdersPage from "./components/CancelledOrders"; // 已取消订单页面

const orderRoutes: AdminRouterItem[] = [
  {
    path: "order-management",
    element: <OrderManagementPage />,
    meta: {
      label: "订单管理列表",
      title: "订单管理列表",
      key: "/order-management",
      icon: <OrderedListOutlined />,
    },
    children: [
      {
        path: "paid-orders",
        element: <PaidOrdersPage />,
        meta: {
          label: "已支付订单",
          title: "已支付订单",
          key: "/order-management/paid-orders",
          icon: <PayCircleOutlined />,
        },
      },
      {
        path: "refunded-orders",
        element: <RefundedOrdersPage />,
        meta: {
          label: "已退款订单",
          title: "已退款订单",
          key: "/order-management/refunded-orders",
          icon: <DollarOutlined />,
        },
      },
      {
        path: "completed-orders",
        element: <CompletedOrdersPage />,
        meta: {
          label: "已完成订单",
          title: "已完成订单",
          key: "/order-management/completed-orders",
          icon: <CheckCircleOutlined />,
        },
      },
      {
        path: "cancelled-orders",
        element: <CancelledOrdersPage />,
        meta: {
          label: "已取消订单",
          title: "已取消订单",
          key: "/order-management/cancelled-orders",
          icon: <CloseCircleOutlined />,
        },
      },
    ],
    sort: 6,
  },
];

export default orderRoutes;
