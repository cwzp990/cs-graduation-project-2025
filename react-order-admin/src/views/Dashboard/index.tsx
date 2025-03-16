import React from "react";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Table } from "antd";
import { Line, Pie } from "@ant-design/charts";
import "./index.scss";
import { formatNumber } from "../../utils";

const Home: React.FC = () => {
  const datalist = [
    {
      label: "总销售额",
      value: 100000000,
      diff: "30%",
      type: "increase",
      color: "#1677ff",
    },
    {
      label: "总订单数",
      value: 21067,
      diff: "80%",
      type: "increase",
      color: "#722ED1",
    },
    {
      label: "下单人数",
      value: 3987,
      diff: "20%",
      type: "increase",
      color: "#EB2F96",
    },
    {
      label: "取消人数",
      value: 100000000,
      diff: "30%",
      type: "decrease",
      color: "#FAAD14",
    },
  ];

  // 一周的销售额数据
  const weekSalesData = [
    { date: "周一", sales: 1200 },
    { date: "周二", sales: 1300 },
    { date: "周三", sales: 1150 },
    { date: "周四", sales: 1900 },
    { date: "周五", sales: 1500 },
    { date: "周六", sales: 1600 },
    { date: "周日", sales: 1450 },
  ];

  // 各个食堂的销售额数据
  const canteenSalesData = [
    { canteen: "食堂1", sales: 2000 },
    { canteen: "食堂2", sales: 1800 },
    { canteen: "食堂3", sales: 2200 },
    { canteen: "食堂4", sales: 1600 },
    { canteen: "食堂5", sales: 1900 },
    { canteen: "食堂6", sales: 2700 },
    { canteen: "食堂7", sales: 300 },
    { canteen: "食堂8", sales: 1000 },
    { canteen: "食堂9", sales: 1700 },
    { canteen: "食堂10", sales: 1200 },
  ];

  // 最受喜欢的菜品数据
  const popularDishesData = [
    {
      id: 1,
      name: "宫保鸡丁",
      orderCount: 200,
      changeRate: "10%",
      date: "2025-03-16",
    },
    {
      id: 2,
      name: "鱼香肉丝",
      orderCount: 180,
      changeRate: "8%",
      date: "2025-03-16",
    },
    {
      id: 3,
      name: "麻婆豆腐",
      orderCount: 150,
      changeRate: "5%",
      date: "2025-03-16",
    },
    {
      id: 4,
      name: "糖醋排骨",
      orderCount: 120,
      changeRate: "3%",
      date: "2025-03-16",
    },
    {
      id: 5,
      name: "红烧肉",
      orderCount: 110,
      changeRate: "2%",
      date: "2025-03-16",
    },
    {
      id: 6,
      name: "清蒸鱼",
      orderCount: 100,
      changeRate: "1%",
      date: "2025-03-16",
    },
    {
      id: 7,
      name: "西红柿炒鸡蛋",
      orderCount: 90,
      changeRate: "0%",
      date: "2025-03-16",
    },
    {
      id: 8,
      name: "回锅肉",
      orderCount: 80,
      changeRate: "-2%",
      date: "2025-03-16",
    },
    {
      id: 9,
      name: "水煮鱼",
      orderCount: 70,
      changeRate: "-3%",
      date: "2025-03-16",
    },
    {
      id: 10,
      name: "地三鲜",
      orderCount: 60,
      changeRate: "-5%",
      date: "2025-03-16",
    },
  ];

  // 按照容器宽高显示

  const lineConfig = {
    autoFit: true,
    data: weekSalesData,
    xField: "date",
    yField: "sales",
    point: {
      size: 5,
      shape: "circle",
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: "#000",
          fill: "red",
        },
      },
    },
  };

  const pieConfig = {
    autoFit: true,
    data: canteenSalesData,
    angleField: "sales",
    colorField: "canteen",
    radius: 0.8,
    label: {
      type: "inner",
      offset: "-30%",
      content: "{value}",
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  const tableColumns = [
    {
      title: "序号",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "菜品名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "下单量",
      dataIndex: "orderCount",
      key: "orderCount",
    },
    {
      title: "涨跌幅",
      dataIndex: "changeRate",
      key: "changeRate",
      render: (text) => (
        <span>
          {text.includes("-") ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
          {text}
        </span>
      ),
    },
    {
      title: "日期时间",
      dataIndex: "date",
      key: "date",
    },
  ];

  return (
    <div className="order-home-container">
      <div>
        <h2 className="sub-title">数据分析</h2>
        <ul className="data-wrapper">
          {datalist.map((i, index) => (
            <li
              key={index}
              style={{
                background: `linear-gradient(to right, ${i.color} 30%, ${i.color} 100%)`,
              }}
            >
              <div className="label">{i.label}</div>
              {/* 千分位 */}
              <div className="num">{formatNumber(i.value)}</div>
              <div className="diff">
                <span>较上周</span>
                <span
                  style={{
                    color: i.type === "increase" ? "#52c41a" : "#F5222D",
                  }}
                >
                  {i.type === "increase" ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}
                  {i.diff}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="chart-container">
        <div className="chart-item">
          <h2 className="sub-title">一周销售额</h2>
          <Line {...lineConfig} />
        </div>
        <div className="chart-item">
          <h2 className="sub-title">各大食堂营业额</h2>
          <Pie {...pieConfig} />
        </div>
      </div>

      <div>
        <h2 className="sub-title">最受欢迎的菜品</h2>
        <Table columns={tableColumns} dataSource={popularDishesData} />
      </div>
    </div>
  );
};

export default Home;
