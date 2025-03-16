import { CoffeeOutlined } from '@ant-design/icons'
import { AdminRouterItem } from '../../router'
import DishesManagementPage from '.'

const dishesRoutes: AdminRouterItem[] = [
  {
    path: 'dishes-manager',
    element: <DishesManagementPage />,
    meta: {
      label: "菜品管理",
      title: "菜品管理",
      key: "/dishes-manager",
      icon: <CoffeeOutlined />,
    },
    sort: 4,
  },
]

export default dishesRoutes
