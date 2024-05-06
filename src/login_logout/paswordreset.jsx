import { useParams } from 'react-router-dom';
import {Form, Input, Button, message, Layout, Row, Col} from 'antd';
import axios from 'axios';
import logo from'./logo.svg';
import { Image } from 'antd';
import {Cookie} from "tough-cookie";
import instance from "./axiosInstance";
import Cookies from "js-cookie";
import {setUser} from "../actions/cookieActions";
import {useDispatch} from "react-redux";
function ResetPassword() {
    const { token } = useParams();
    const { Content } = Layout;
    const dispatch = useDispatch();

    const handleSubmit = async ({ password }) => {
        try {
            const response = await axios.patch('https://opti-track-1.onrender.com/user/resetPassword/' + token, { password });

            if (response.status === 200) {
                message.success('Password has been reset');
                const token = response.token;
                const user = response.data.user;
                Cookie.set('token', token);
                instance.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('token')}`;
                dispatch(setUser(response.data.data.user));
                localStorage.setItem('user', JSON.stringify(user));

            } else {
                message.error('Failed to reset password');
            }
        } catch (error) {
            console.error('Request failed', error);
            message.error('Failed to reset password: url is invalid or has expired');

        }
    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#001529' }}>
            <Content>
                <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
                    <Col>
                        <Image
                            width={300}
                            l
                            src={logo}
                        />
                        <Form
                            onFinish={handleSubmit}
                            style={{ width: '300px', backgroundColor: '#ebf5ff', padding: '20px', borderRadius: '5px' }}
                        >
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your new password!' }]}
                            >
                                <Input.Password size="large" type="password" placeholder="New Password" />
                            </Form.Item>
                            <Form.Item
                                name="confirmPassword"
                                rules={[
                                    { required: true, message: 'Please confirm your new password!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password size="large" type="password" placeholder="Confirm New Password" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{
                                    backgroundColor:'#00488e'
                                }} block size="large">
                                    Reset Password
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );

}

export default ResetPassword;