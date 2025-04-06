import React, { useEffect, useState } from "react";
import { Table, Form, Input, Button, Space, Select, Modal, message, Image } from "antd";
import dayjs from "dayjs";
import { getPersonList, updatePerson } from "../../service/url";

type User = {
  sellerId: number;
  username: string;
  gender: string;
  phone: string;
  email: string;
};

const UserManagement: React.FC = () => {
  const [personnel, setPersonnel] = useState<User[]>([]);
  // 新增/编辑表单
  const [form] = Form.useForm();
  // 筛选表单
  const [filterForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sellerId, setSellerId] = useState<number | null>(null);

  const handleFilter = () => {};

  const handleEdit = (record: User) => {
    setSellerId(record.sellerId);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const onAddHandle = () => {
    setSellerId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    const validate = await form.validateFields();
    if (validate) {
      const params = form.getFieldsValue();
      params.sellerId = sellerId ? sellerId : undefined;
      await updatePerson(params);
      await getPersonListData();
      message.success(sellerId ? "编辑人员信息成功" : "新增人员信息成功");
      setIsModalVisible(false);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: "序号",
      dataIndex: "id",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "姓名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      render: (value: string) => <Image src={value} width={100} height={100} />,
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      render: (value) => {
        return value === 0 ? "男" : "女";
      },
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      render: (value) => {
        return value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : "";
      },
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      render: (value) => {
        return value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : "";
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const getPersonListData = async () => {
    const res = await getPersonList();
    setPersonnel(res.data.list);
  };

  useEffect(() => {
    getPersonListData();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* 使用定义好的 filterForm */}
      <Form form={filterForm} layout="inline">
        <Form.Item name="name" label="姓名">
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item name="gender" label="性别">
          <Select placeholder="请选择性别">
            <Select.Option value={0}>男</Select.Option>
            <Select.Option value={1}>女</Select.Option>
          </Select>
        </Form.Item>
        <Button type="primary" onClick={handleFilter}>
          筛选
        </Button>
      </Form>
      <Button type="primary" style={{ position: "absolute", top: 0, right: 0 }} onClick={onAddHandle}>
        新增人员
      </Button>
      <Table
        dataSource={personnel}
        columns={columns}
        rowKey="sellerId"
        style={{ marginTop: 12 }}
      />
      <Modal
        maskClosable={false}
        title={sellerId ? "编辑人员" : "新增人员"}
        open={isModalVisible}
        onOk={handleSubmit}
        okText="确定"
        cancelText="取消"
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            label="姓名"
            name="username"
            rules={[{ required: true, message: "请输入姓名!" }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            label="性别"
            name="gender"
            rules={[{ required: true, message: "请选择性别!" }]}
          >
            <Select placeholder="请选择性别">
              <Select.Option value={0}>男</Select.Option>
              <Select.Option value={1}>女</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input type="password" placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            label="手机号码"
            name="phone"
            rules={[{ required: true, message: "请输入手机号码!" }]}
          >
            <Input placeholder="请输入手机号码" />
          </Form.Item>
          <Form.Item
            label="头像"
            name="avatar"
            rules={[{ required: true, message: "请输入头像!" }]}
          >
            <Input placeholder="请输入头像" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
