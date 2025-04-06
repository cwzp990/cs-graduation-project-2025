import { ShopOutlined } from '@ant-design/icons'
import { AdminRouterItem } from '../../router'
import CanteenManagementPage from '.'

const canteenRoutes: AdminRouterItem[] = [
  {
    path: 'canteen-manager',
    element: <CanteenManagementPage />,
    meta: {
      label: "食堂管理",
      title: "食堂管理",
      key: "/canteen-manager",
      icon: <ShopOutlined />,
    },
    sort: 2,
  },
]

export default canteenRoutes
