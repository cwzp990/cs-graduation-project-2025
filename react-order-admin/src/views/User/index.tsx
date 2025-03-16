import React, { useState } from "react";
import { Table, Form, Input, Button, Modal, Space, Radio, Select, Checkbox } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

// 定义食堂人员数据类型
type User = {
  id: number;
  name: string;
  gender: string;
  phone: string;
  email: string;
  idCard: string;
  avatar: string;
};

const UserManagement: React.FC = () => {
  // 模拟食堂人员数据
  const [personnel, setPersonnel] = useState<User[]>([
    {
      id: 1,
      name: "张三",
      gender: "男",
      phone: "13800138000",
      email: "zhangsan@example.com",
      idCard: "123456789012345678",
      avatar: "https://example.com/avatar1.jpg",
    },
    {
      id: 2,
      name: "李四",
      gender: "女",
      phone: "13900139000",
      email: "lisi@example.com",
      idCard: "234567890123456789",
      avatar: "https://example.com/avatar2.jpg",
    },
  ]);

  // 新增/编辑表单
  const [form] = Form.useForm();
  // 筛选表单
  const [filterForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<User | null>(null);
  // 存储过滤后的数据
  const [filteredPersonnel, setFilteredPersonnel] = useState(personnel);

  // 显示新增/编辑模态框
  const showModal = (person?: User) => {
    if (person) {
      setEditingPersonnel(person);
      form.setFieldsValue(person);
    } else {
      setEditingPersonnel(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingPersonnel) {
        // 更新食堂人员信息
        setPersonnel(
          personnel.map((person) =>
            person.id === editingPersonnel.id
              ? { ...person, ...values }
              : person
          )
        );
      } else {
        // 新增食堂人员信息
        const newPerson: User = {
          id: personnel.length > 0 ? personnel[personnel.length - 1].id + 1 : 1,
          ...values,
        };
        setPersonnel([...personnel, newPerson]);
      }
      setIsModalVisible(false);
    } catch (error) {
      console.log("Form validation error:", error);
    }
  };

  // 处理删除食堂人员
  const handleDelete = (id: number) => {
    setPersonnel(personnel.filter((person) => person.id !== id));
    // 同步更新过滤后的数据
    setFilteredPersonnel(
      filteredPersonnel.filter((person) => person.id !== id)
    );
  };

  // 点击筛选按钮触发的筛选函数
  const handleFilter = async () => {
    const values = await filterForm.validateFields();
    const { name = "", gender = "" } = values;
    const newFilteredPersonnel = personnel.filter((person) => {
      return (
        person.name.includes(name) &&
        (gender === "" || person.gender === gender)
      );
    });
    setFilteredPersonnel(newFilteredPersonnel);
  };

  // 表格列定义
  const columns = [
    {
      title: (
        <Checkbox
          onChange={(e) => {
            // 全选逻辑，这里简单打印日志，可按需实现
            console.log("全选状态:", e.target.checked);
          }}
        />
      ),
      dataIndex: "checkbox",
      key: "checkbox",
      render: (_, record) => (
        <Checkbox
          onChange={(e) => {
            // 单个勾选逻辑，这里简单打印日志，可按需实现
            console.log("菜品", record.name, "勾选状态:", e.target.checked);
          }}
        />
      ),
    },
    {
      title: "序号",
      dataIndex: "id",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "身份证",
      dataIndex: "idCard",
      key: "idCard",
    },
    {
      title: "头像",
      dataIndex: "avatar",
      render: (avatar) => <Avatar src={avatar} />,
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
            编辑
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      {/* 使用定义好的 filterForm */}
      <Form form={filterForm} layout="inline">
        <Form.Item name="name" label="姓名">
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item name="gender" label="性别">
          <Select placeholder="请选择性别">
            <Select.Option value="男">男</Select.Option>
            <Select.Option value="女">女</Select.Option>
          </Select>
        </Form.Item>
        <Button type="primary" onClick={handleFilter}>
          筛选
        </Button>
      </Form>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ position: "absolute", top: 0, right: 0 }}
      >
        新增人员
      </Button>
      <Table
        dataSource={filteredPersonnel}
        columns={columns}
        rowKey="id"
        style={{ marginTop: "16px" }}
      />
      <Modal
        title={editingPersonnel ? "编辑人员信息" : "新增人员信息"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: "请输入姓名!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="性别"
            name="gender"
            rules={[{ required: true, message: "请选择性别!" }]}
          >
            <Radio.Group>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[{ required: true, message: "请输入手机号!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, message: "请输入邮箱!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="身份证"
            name="idCard"
            rules={[{ required: true, message: "请输入身份证号!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="头像"
            name="avatar"
            rules={[{ required: true, message: "请输入头像链接!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
