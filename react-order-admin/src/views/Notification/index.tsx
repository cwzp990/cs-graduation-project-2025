import React, { useEffect, useState } from "react";
import { List, Card, Typography, Button, Modal, Input, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { getNotificationList } from "../../service/url";
import "./index.scss";

const { Text } = Typography;

type Dishes = {
  name: string,
  description: string,
  url: string,
}

type MenuList = {
  day: string,
  dishes: Dishes[]
}

const NotificationManagementPage: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuList[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 添加编辑中的数据状态
  const [editingData, setEditingData] = useState<Dishes[]>([]);
  // 添加当前编辑的日期索引状态
  const [currentEditIndex, setCurrentEditIndex] = useState<number>(-1);

  const showEditModal = (dishes: Dishes[], index: number) => {
    setEditingData(dishes);
    setCurrentEditIndex(index);
    setIsModalVisible(true);
  };

  const handleDishChange = (index: number, field: keyof Dishes, value: string) => {
    const newData = [...editingData];
    newData[index] = {
      ...newData[index],
      [field]: value
    };
    setEditingData(newData);
  };

  const handleOk = async () => {
    try {
      // 数据验证
      if (editingData.some(dish => !dish.name.trim())) {
        message.error('菜品名称不能为空');
        return;
      }

      // 更新本地数据
      const newMenuData = [...menuData];
      newMenuData[currentEditIndex] = {
        ...newMenuData[currentEditIndex],
        dishes: editingData
      };

      // TODO: 调用更新API
      // await updateMenu(newMenuData[currentEditIndex]);

      setMenuData(newMenuData);
      setIsModalVisible(false);
      message.success('操作成功');
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 删除菜品
  const deleteDish = (index: number) => {
    const newData = [...editingData];
    newData.splice(index, 1);
    setEditingData(newData);
  };

  // 添加新菜品
  const addDish = () => {
    setEditingData([
      ...editingData,
      { name: '', description: '', url: '' }
    ]);
  };

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
        renderItem={(item, index) => (
          <List.Item>
            <Card
              title={item.day}
              extra={<Button onClick={() => showEditModal(item.dishes, index)}>编辑</Button>}
            >
              <List
                dataSource={item.dishes}
                renderItem={(dish) => (
                  <List.Item>
                    <Text strong>{dish.name}</Text>
                    <Text type="secondary" block>
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
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        className="edit-week-dishes-modal"
      >
        <div className="dishes-list-wrapper">
          <div className="edit-item">
            {
              editingData.map((dish, dishIndex) => (
                <div className="edit-item" key={dishIndex}>
                  <div className="edit-item-name">
                    <Input
                      placeholder="请输入菜品名称"
                      value={dish.name}
                      onChange={(e) =>
                        handleDishChange(dishIndex, "name", e.target.value)
                      }
                    />
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => deleteDish(dishIndex)}
                    />
                  </div>
                  <Input.TextArea
                    className="edit-item-desc"
                    placeholder="请输入菜品描述"
                    value={dish.description}
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
