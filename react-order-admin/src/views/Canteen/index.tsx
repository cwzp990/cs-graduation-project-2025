import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Input,
  Button,
  Modal,
  Space,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getCanteenList } from "../../service/url";
import { message } from 'antd';
import { updateCanteen, deleteCanteen } from '../../service/url';

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
  const [canteens, setCanteens] = useState<Canteen[]>([]);

  // 新增/编辑表单
  const [form] = Form.useForm();
  // 筛选项
  const [filterForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCanteen, setEditingCanteen] = useState<Canteen | null>(null);

  const closeModal = () => {
    setEditingCanteen(null);
    setIsModalVisible(false)
  }

  const getCanteenListData = async () => {
    const res = await getCanteenList();
    setCanteens(res.data);
  }

  // 显示新增/编辑模态框
  const showModal = (record?: Canteen) => {
    setEditingCanteen(record || null);
    form.resetFields();
    if (record) {
      form.setFieldsValue(record);
    }
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    const validate = await form.validateFields();
    if (!validate) return;
    // 编辑模式
    const params = form.getFieldsValue();
    await updateCanteen({
      ...params,
      id: editingCanteen?.id
    });
    message.success(editingCanteen?.id ? '编辑食堂成功' : '新建食堂成功');
    setIsModalVisible(false);
    getCanteenListData(); // 刷新列表

  };

  // 处理删除食堂
  const handleDelete = async (id: number) => {
    try {
      await deleteCanteen(id);
      message.success('删除成功');
      getCanteenListData(); // 刷新列表
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 处理筛选
  const handleFilter = async () => {
    try {
      const values = await filterForm.validateFields();
      const filtered = canteens.filter(canteen => {
        const nameMatch = !values.name ||
          canteen.name.toLowerCase().includes(values.name.toLowerCase());
        const statusMatch = !values.status ||
          canteen.auditStatus === values.status;
        return nameMatch && statusMatch;
      });
      setCanteens(filtered);
    } catch (error) {
      message.error('筛选失败');
    }
  };

  // 重置筛选
  const resetFilter = () => {
    filterForm.resetFields();
    getCanteenListData(); // 重新获取所有数据
  };

  // 表格列定义
  const columns = [
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
      render: (url) => <img src={url} alt="食堂照片" width={100} />,
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

  useEffect(() => {
    getCanteenListData()
  }, [])

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
          <Space>
            <Button type="primary" onClick={handleFilter}>
              筛选
            </Button>
            <Button onClick={resetFilter}>重置</Button>
          </Space>
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
        dataSource={canteens}
        columns={columns}
        rowKey="id"
        style={{ marginTop: "16px" }}
      />
      <Modal
        maskClosable={false}
        title={editingCanteen ? "编辑食堂信息" : "添加食堂信息"}
        open={isModalVisible}
        onOk={handleSubmit}
        okText="确定"
        cancelText="取消"
        onCancel={closeModal}
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
