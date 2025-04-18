import { memo, FC } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, message } from "antd";
import useUserStore from "../../store/user";
import { getLogin } from "../../service/url";
import "./index.scss";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Login: FC = () => {
  const navigate = useNavigate();
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  const onFinish = async (values: {
    phone: string;
    password: string;
    remember: boolean;
  }) => {
    const data = await getLogin(values.phone, values.password);
    if (data?.code === 0) {
    //   const { roleType, userName, avatar } = data.data;
    //   await setUserInfo({
    //     roleType,
    //     userName,
    //     avatar,
    //   });
      navigate("/home");
    } else {
      message.error(`登录失败, 用户名或者密码不正确`);
    }
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login flex-all-center">
      <div className="login__form flex-all-center">
        <span className="login__form__title">校园订餐管理系统</span>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="login__form__form"
        >
          <Form.Item
            label="用户名"
            name="phone"
            labelAlign="left"
            rules={[{ required: true, message: "请输入用户名!" }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            labelAlign="left"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login__form__form__submit"
          >
            提交
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default memo(Login);
