import React, { useState } from "react";
import { List, Card, Typography, Button, Modal, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import "./index.scss";

const { Text } = Typography;

// 模拟一周的菜品数据，去掉价格字段
const weeklyMenu = [
  {
    day: "周一",
    dishes: [
      { name: "宫保鸡丁", description: "鸡肉鲜嫩，花生米香脆" },
      { name: "西红柿炒鸡蛋", description: "经典家常菜，酸甜可口" },
    ],
  },
  {
    day: "周二",
    dishes: [
      { name: "鱼香肉丝", description: "咸甜酸辣兼备，口感丰富" },
      { name: "麻婆豆腐", description: "麻辣鲜香，豆腐嫩滑" },
    ],
  },
  {
    day: "周三",
    dishes: [
      { name: "糖醋排骨", description: "色泽红亮，酸甜适口" },
      { name: "清炒时蔬", description: "新鲜蔬菜，清爽可口" },
    ],
  },
  {
    day: "周四",
    dishes: [
      { name: "红烧肉", description: "肥而不腻，入口即化" },
      { name: "紫菜蛋花汤", description: "清淡鲜美，营养丰富" },
    ],
  },
  {
    day: "周五",
    dishes: [
      { name: "辣子鸡", description: "鸡肉外酥里嫩，麻辣过瘾" },
      { name: "凉拌黄瓜", description: "清爽可口，夏日必备" },
    ],
  },
  {
    day: "周六",
    dishes: [
      { name: "粉蒸肉", description: "肉质软糯，米粉香浓" },
      { name: "冬瓜肉丸汤", description: "肉丸鲜嫩，冬瓜清甜" },
    ],
  },
  {
    day: "周日",
    dishes: [
      { name: "油焖大虾", description: "虾肉鲜嫩，酱汁浓郁" },
      { name: "凉拌木耳", description: "口感爽脆，营养丰富" },
    ],
  },
];

const NotificationManagementPage: React.FC = () => {
  const [menuData, setMenuData] = useState(weeklyMenu);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  // 新增临时编辑数据状态
  const [editData, setEditData] = useState<typeof weeklyMenu>([]);

  const showEditModal = (index: number) => {
    setEditingIndex(index);
    // 初始化临时数据（深拷贝）
    setEditData(JSON.parse(JSON.stringify(menuData)));
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (editingIndex !== null) {
      // 提交时更新主数据
      setMenuData(editData);
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 新增：处理菜品字段变化
  const handleDishChange = (
    dishIndex: number,
    field: "name" | "description",
    value: string
  ) => {
    if (editingIndex === null) return;
    const newData = [...editData];
    newData[editingIndex].dishes[dishIndex][field] = value;
    setEditData(newData);
  };

  // 修改后的删除和添加方法
  const deleteDish = (dishIndex: number) => {
    if (editingIndex !== null) {
      const newData = [...editData];
      newData[editingIndex].dishes.splice(dishIndex, 1);
      setEditData(newData);
    }
  };

  const addDish = () => {
    if (editingIndex !== null) {
      const newData = [...editData];
      newData[editingIndex].dishes.push({ name: "", description: "" });
      setEditData(newData);
    }
  };

  return (
    <div>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={menuData}
        renderItem={(item, index) => (
          <List.Item>
            <Card
              title={item.day}
              extra={<Button onClick={() => showEditModal(index)}>编辑</Button>}
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
        title="编辑菜品信息"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        className="edit-week-dishes-modal"
      >
        <div className="dishes-list-wrapper">
          {editingIndex !== null &&
            editData[editingIndex]?.dishes.map((dish, dishIndex) => (
              <div className="edit-item" key={dishIndex}>
                <div className="edit-item-name">
                  <Input
                    placeholder="菜品名称"
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
                  placeholder="菜品描述"
                  value={dish.description}
                  onChange={(e) =>
                    handleDishChange(dishIndex, "description", e.target.value)
                  }
                />
              </div>
            ))}
          <Button type="primary" onClick={addDish} style={{ marginTop: 16 }}>
            添加新菜品
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationManagementPage;
