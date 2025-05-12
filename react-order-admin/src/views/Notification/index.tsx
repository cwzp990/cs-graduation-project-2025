import React, { useEffect, useState } from "react";
import { List, Card, Typography, Button, Modal, Input, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { getNoticeData, uodateNoticeData } from "../../service/url";

import "./index.scss";

const { Text } = Typography;

interface Dish {
  name: string;
  description: string;
}

interface MenuItem {
  id: number;
  day: string;
  dishes: Dish[];
}

const NotificationManagementPage: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editData, setEditData] = useState<MenuItem | null>(null);

  const showEditModal = (item: MenuItem) => {
    setEditData(item);
    setIsModalVisible(true);
  };

  const handleDishChange = (
    dishIndex: number,
    field: keyof Dish,
    value: string
  ) => {
    if (!editData) return;

    const updatedDishes = [...editData.dishes];
    updatedDishes[dishIndex] = {
      ...updatedDishes[dishIndex],
      [field]: value,
    };

    setEditData({
      ...editData,
      dishes: updatedDishes,
    });
  };

  const deleteDish = (dishIndex: number) => {
    if (!editData) return;

    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个菜品吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const updatedDishes = editData.dishes.filter(
          (_, index) => index !== dishIndex
        );
        setEditData({
          ...editData,
          dishes: updatedDishes,
        });
      }
    });
  };

  const addDish = () => {
    if (!editData) return;

    setEditData({
      ...editData,
      dishes: [...editData.dishes, { name: "", description: "" }],
    });
  };

  const handleOk = async () => {
    if (!editData) return;

    const res = await uodateNoticeData(editData);
    if (res.code === 0) {
      message.success("保存成功");
      setIsModalVisible(false);
      setEditData(null);
      await queryNotice();
    } else {
      message.error("保存失败");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditData(null);
  };

  const queryNotice = async () => {
    const res = await getNoticeData();
    if (res.code === 0) {
      setMenuData(res.data);
    }
  };

  useEffect(() => {
    queryNotice();
  }, []);

  const getNotificationListData = async () => {
    const res = await getNotificationList();
    setMenuData(res.data);
  }

  useEffect(() => {
    getNotificationListData()
  }, [])

  return (
    <div>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={menuData}
        renderItem={(item: MenuItem) => (
          <List.Item>
            <Card
              title={item.day}
              extra={<Button onClick={() => showEditModal(item)}>编辑</Button>}
            >
              <List
                dataSource={item.dishes}
                renderItem={(dish: Dish) => (
                  <List.Item>
                    <Text strong>{dish.name}</Text>
                    <Text type="secondary" style={{ display: "block" }}>
                      {dish.description}
                    </Text>
                  </List.Item>
                )}
              />
            </Card>
          </List.Item>
        )}
      />
      <Modal
        maskClosable={false}
        title="编辑菜品信息"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        className="edit-week-dishes-modal"
      >
        <div className="dishes-list-wrapper">
          {editData &&
            editData.dishes.map((dish: Dish, dishIndex: number) => (
              <div className="edit-item" key={dishIndex}>
                <div className="edit-item-name">
                  <Input
                    placeholder="菜品名称"
                    value={dish.name}
                    onChange={(e) =>
                      handleDishChange(dishIndex, "description", e.target.value)
                    }
                  />
                  <Input
                    placeholder="请输入菜品图片链接"
                    value={dish.url}
                    onChange={(e) =>
                      handleDishChange(dishIndex, "url", e.target.value)
                    }
                  />
                </div>
              ))}
          </div>
          <Button type="primary" onClick={addDish} style={{ marginTop: 16 }}>
            添加新菜品
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationManagementPage;
