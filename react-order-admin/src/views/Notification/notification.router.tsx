import { NotificationOutlined } from '@ant-design/icons'
import { AdminRouterItem } from '../../router'
import NotificationManagementPage from '.'

const notificationRoutes: AdminRouterItem[] = [
  {
    path: 'notification-manager',
    element: <NotificationManagementPage />,
    meta: {
      label: "公告管理",
      title: "公告管理",
      key: "/notification-manager",
      icon: <NotificationOutlined />,
    },
    sort: 4,
  },
]

export default notificationRoutes
