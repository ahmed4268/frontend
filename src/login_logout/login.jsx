import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {useDispatch, useSelector} from 'react-redux';
import { setToken } from '../actions/cookieActions';
import { setUser } from '../actions/cookieActions';
import instance from './axiosInstance';
import {Form, Input, Button, Row, Col, Checkbox, Space} from 'antd';
// import 'antd/dist/antd.css';
import  gif from './gitttt.gif';
import { message } from 'antd';

function Login() {

    if(localStorage.getItem('user')) {
        window.location.href = '/';
    }
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const handleForgotPassword = async () => {
        const email = form.getFieldValue('email');

        if (!email) {
            message.error('Please fill up your email');
            return;
        }

        try {
            const response = await axios.post('/user/forgotPassword', {email: email });

            if (response.status === 200) {
                message.success('Please check your email');
            } else {
                message.error('Failed to send email');
            }
        } catch (error) {
            console.error('Request failed', error);
        }
    };
    const handleSubmit = async (event) => {
        try {
            const response = await axios.post('https://opti-track-1.onrender.com/user/login', {
                email: event.email,
                password:event.password });
            console.log(response)

            if (response.data.status === "success") {
                message.success('Login successful! Redirecting...')
                const token = response.data.token;
                const user = response.data.data.user;
                const rememberMe = form.getFieldValue('remember'); // Get the value of the "Remember Me" checkbox

                if (rememberMe) {
                    Cookies.set('token', token, { expires: 7 });
                } else {
                    Cookies.set('token', token);
                }
                instance.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('token')}`;
                dispatch(setUser(response.data.data.user));
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = '/';


            } else {
                message.error('Invalid email or password')
            }
        } catch (error) {
if(error.response.status === 415)
            message.error("your account is inactive,please ask the admin to activate it")
            else
            message.error('Login failed. Please check your credentials and try again.'); // Display error message
        }
    };
    return (
        <Row>
            <Col className="formm" style={{
                backgroundColor: '#ebf5ff',
            }} flex="auto"
                 xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 16 }} lg={{ span: 14 }} xl={{ span: 20 }}>

                <Form style={{
                    width: '300px',
                    margin: 'auto',
                    marginTop: '225px',

                }}
                      form={form}
                      size="large"
                      name="normal_login"
                      className="login-form"
                      initialValues={{ remember: true }}
                      onFinish={handleSubmit}
                >
                    <div style={{
                        textAlign: 'left' ,
                        marginBottom: '20px',


                    }}> Welcome Back</div>
                    <div style={{
                        textAlign: 'left',
                        marginBottom: '20px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                    }}
                    >Please sign in to your account</div>
                    <Form.Item
                        hasFeedback
                        validateTrigger="onBlur"
                        name="email"
                        rules={[{ required: true, message: 'Please input your Email!' },
                            { type: 'email', message: 'Please input a valid email!' }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        hasFeedback
                        validateTrigger="onBlur"
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!'},
                            {min: 8, message: 'Password must be at least 8 characters'}]}
                    >
                        <Input.Password
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Space size={70}>
                    <Form.Item>
                        <a className="login-form-forgot"  onClick={handleForgotPassword}>
                            Forgot password
                        </a>
                    </Form.Item>
                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{


                        }}
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
</Space>
                    <Form.Item

                    >
                        <Button type="primary" style={{
                            backgroundColor: '#00488e',
                        }} htmlType="submit" block>
                            Sign in
                        </Button>
                    </Form.Item>


                </Form>
            </Col>
            <Col  flex="1000px"
                   sm={{ span: 8 }} md={{ span: 10 }} lg={{ span: 15 }} xl={{ span: 20 }} style={{
                backgroundColor: '#001529',
                height: '100vh',

            }} className="logooo" >

                <img src={gif} style={{
                       width: '100%',
                    marginTop: '38px',
                    objectFit: 'cover',
                    objectPosition: 'center',

                }}  alt="Loading" />
            </Col>

        </Row>
    );


}

export default Login;





