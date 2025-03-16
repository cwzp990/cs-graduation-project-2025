import React, { useState } from "react";
import {
  Table,
  Form,
  Input,
  Button,
  Modal,
  Space,
  Select,
  Checkbox,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// 定义食堂数据类型
type Canteen = {
  id: number;
  name: string;
  address: string;
  openingHours: string;
  photo: string;
  manager: string;
  phone: string;
  auditStatus: string;
};

// 审核状态选项
const auditStatusOptions = [
  { label: "已审核", value: "approved" },
  { label: "待审核", value: "pending" },
  { label: "未通过", value: "rejected" },
];

const CanteenManagementPage: React.FC = () => {
  // 模拟食堂数据
  const [canteens, setCanteens] = useState<Canteen[]>([
    {
      id: 1,
      name: "第一食堂",
      address: "校园一号楼",
      openingHours: "07:00 - 21:00",
      photo: "https://example.com/canteen1.jpg",
      manager: "张三",
      phone: "13800138000",
      auditStatus: "approved",
    },
    {
      id: 2,
      name: "第二食堂",
      address: "校园二号楼",
      openingHours: "08:00 - 20:00",
      photo: "https://example.com/canteen2.jpg",
      manager: "李四",
      phone: "13900139000",
      auditStatus: "pending",
    },
  ]);

  // 新增/编辑表单
  const [form] = Form.useForm();
  // 筛选项
  const [filterForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCanteen, setEditingCanteen] = useState<Canteen | null>(null);
  // 存储过滤后的数据
  const [filteredCanteens, setFilteredCanteens] = useState(canteens);

  // 显示新增/编辑模态框
  const showModal = (canteen?: Canteen) => {
    if (canteen) {
      setEditingCanteen(canteen);
      form.setFieldsValue({
        name: canteen.name,
        address: canteen.address,
        openingHours: canteen.openingHours,
        photo: canteen.photo,
        manager: canteen.manager,
        phone: canteen.phone,
        auditStatus: canteen.auditStatus,
      });
    } else {
      setEditingCanteen(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingCanteen) {
        // 更新食堂信息
        setCanteens(
          canteens.map((canteen) =>
            canteen.id === editingCanteen.id
              ? { ...canteen, ...values }
              : canteen
          )
        );
      } else {
        // 新增食堂信息
        const newCanteen: Canteen = {
          id: canteens.length > 0 ? canteens[canteens.length - 1].id + 1 : 1,
          ...values,
        };
        setCanteens([...canteens, newCanteen]);
      }
      setIsModalVisible(false);
    } catch (error) {
      console.log("Form validation error:", error);
    }
  };

  // 处理删除食堂
  const handleDelete = (id: number) => {
    setCanteens(canteens.filter((canteen) => canteen.id !== id));
  };

  const handleFilter = async () => {
    const values = await filterForm.validateFields();
    const { name = "", status = "" } = values;
    const newFilteredCanteen = canteens.filter((canteen) => {
      const nameMatch = canteen.name.includes(name);
      const statusMatch = status === "" || canteen.auditStatus === status;
      return nameMatch && statusMatch;
    });
    setFilteredCanteens(newFilteredCanteen);
  };

  // 表格列定义
  const columns = [
    {
      title: <Checkbox />,
      dataIndex: "id",
      key: "id",
      render: (_, record) => <Checkbox />,
    },
    {
      title: "序号",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "食堂名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "食堂地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "营业时间",
      dataIndex: "openingHours",
      key: "openingHours",
    },
    {
      title: "食堂照片",
      dataIndex: "photo",
      key: "photo",
      render: (photo) => <img src={photo} alt="食堂照片" width={100} />,
    },
    {
      title: "食堂负责人",
      dataIndex: "manager",
      key: "manager",
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "审核状态",
      dataIndex: "auditStatus",
      key: "auditStatus",
      render: (status) => {
        const option = auditStatusOptions.find((opt) => opt.value === status);
        return option ? option.label : status;
      },
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
      <Form form={filterForm} layout="inline" autoComplete="off">
        <Form.Item
          name="name"
          label="食堂名称"
          rules={[{ required: false }]} // 筛选条件可不填
        >
          <Input placeholder="请输入食堂名称" />
        </Form.Item>
        <Form.Item
          name="status"
          label="审核状态"
          rules={[{ required: false }]} // 筛选条件可不填
        >
          <Select placeholder="请选择状态" options={auditStatusOptions} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={handleFilter}>
            筛选
          </Button>
        </Form.Item>
      </Form>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ position: "absolute", top: 0, right: 0 }}
      >
        添加食堂
      </Button>
      <Table
        dataSource={filteredCanteens}
        columns={columns}
        rowKey="id"
        style={{ marginTop: "16px" }}
      />
      <Modal
        title={editingCanteen ? "编辑食堂信息" : "添加食堂信息"}
        open={isModalVisible} // Ant Design v5 使用 open 代替 visible
        onOk={handleSubmit}
        okText="确定"
        cancelText="取消"
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            label="食堂名称"
            name="name"
            rules={[{ required: true, message: "请输入食堂名称!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="食堂地址"
            name="address"
            rules={[{ required: true, message: "请输入食堂地址!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="营业时间"
            name="openingHours"
            rules={[{ required: true, message: "请输入营业时间!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="食堂照片"
            name="photo"
            rules={[{ required: true, message: "请输入食堂照片链接!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="食堂负责人"
            name="manager"
            rules={[{ required: true, message: "请输入食堂负责人!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="联系电话"
            name="phone"
            rules={[{ required: true, message: "请输入联系电话!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="审核状态"
            name="auditStatus"
            rules={[{ required: true, message: "请选择审核状态!" }]}
          >
            <Select options={auditStatusOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CanteenManagementPage;
