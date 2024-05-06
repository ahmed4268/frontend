import React, { useState, useEffect } from 'react';
import {
    Space,
    Layout,
    Descriptions,
    message,
    theme,
    Divider,
    DatePicker,
    Options,
    Col,
    Row,
    Button,
    Steps,
    Flex,
    Statistic,
    Table,
    Form, Drawer, Input, Select
} from 'antd';
import axios from "axios";
import Navbar from "../component/navbar/navbar";
import Sidebar from "../component/sidebar/sidebar";
import Footerr from "../component/footer/footer"
import Cookies from "js-cookie";
import {MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined} from "@ant-design/icons";
import {logout, removeToken, setUser} from "../actions/cookieActions";
import {useDispatch} from "react-redux";
import instance from "./axiosInstance";

function Profile() {
    const dispatch = useDispatch();

    const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);
    const showPasswordChangeDrawer = () => {
        setPasswordChangeOpen(true);
    };
    const onClosePasswordChange = () => {
        setPasswordChangeOpen(false);
    };

    const handlePasswordChangeFormSubmit = async (values) => {
        try {
            const response = await axios.patch('https://opti-track-1.onrender.com/user/updateMyPassword', {
                passwordCurrent: values.oldPassword,
                password: values.newPassword,
            }, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                }
            });

            if (response.data.status === "success") {
                message.success('Password updated successfully');
                const token = response.data.token;
                Cookies.set('token', token);
                instance.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('token')}`;
                onClosePasswordChange();
            } else {
                message.error('Failed to update password');
            }
        } catch (error) {
            console.error(error);
            message.error('An error occurred while updating the password');
        }
    };

    const handlePasswordChange = () => {
        showPasswordChangeDrawer();
    };
    const handleFormSubmit = async (values) => {
        const updatedValues = {
            phoneNumber: values.phoneNumber,
            firstname: values.firstName,
            lastname: values.lastName,
            email: values.email,
        };
        try {
            const response = await axios.patch('user/updateMe', updatedValues, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                }
            });

            if (response.status === 200) {
                console.log("responce",response)
                message.success('Profile updated successfully');
                 localStorage.setItem('user', JSON.stringify(response.data.data.user));
                dispatch(setUser(response.data.data.user));

                onClose();
            } else {
                message.error('Failed to update profile');
            }
        } catch (error) {
            console.error(error);
            message.error('An error occurred while updating the profile');
        }
    };
    const { Option } = Select;

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const {Content}=Layout;

    const user = JSON.parse(localStorage.getItem('user'));


    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const items = [
        {
            key: '1',
            label: 'lastName',
            children: user.lastname,
        },
        {
            key: '2',
            label: 'firstName',
            children: user.firstname,
        },
        {
            key: '3',
            label: 'phoneNumber',
            children:user.phoneNumber,
        },
        {
            key: '4',
            label: 'Email',
            children:user.email,
        },
        {
            key: '5',
            label: 'Role',
            children: user.role,
        },
        {
            key: '6',
            label: 'Status',
            children: user.active===true? 'Active' : 'Inactive',
        },
    ];


    const handleEdit = () => {
        // Handle edit action here
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Drawer
                title="Change your password"
                width={720}
                onClose={onClosePasswordChange}
                open={passwordChangeOpen}
                styles={{
                    body: {
                        paddingBottom: 80,
                        display: 'flex', // Add this
                        justifyContent: 'center', // Add this
                        alignItems: 'center', // Add this
                    },
                }}
            >

                <Form layout="vertical"  size="large"  style={{
                    width: '80%',

                }} onFinish={handlePasswordChangeFormSubmit}
>                    <Form.Item
                        name="oldPassword"

                        hasFeedback
                        validateTrigger="onBlur"
                        label="Old Password"
                        placeholder="Please enter your old password"
                        rules={[{ required: true, message: 'Please input your old password!' },{min:8,message:'Password must be at least 8 characters'}]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        hasFeedback
                        validateTrigger="onBlur"
                        name="newPassword"
                        label="New Password"
                        placeholder="Please enter your new password"
                        rules={[{ required: true, message: 'Please input your new password!' },{min:8,message:'Password must be at least 8 characters'}
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="passwordConfirm"
                        hasFeedback
                        validateTrigger="onBlur"
                        label="Confirm Password"
                        placeholder="Please confirm your new password"
                        rules={[{ required: true, message: 'Please confirm your new password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),{min:8,message:'Password must be at least 8 characters'}]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item style={{display: 'flex', justifyContent: 'center'}}>
                        <Space>
                            <Button onClick={onClosePasswordChange}>Cancel</Button>
                            <Button htmlType="submit" style={{backgroundColor: '#00488e'}} type="primary">
                                Submit
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Drawer>
            <Drawer
                title="Edit your account"
                width={720}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}

            >
                <Form layout="vertical" size="large" onFinish={handleFormSubmit} >

                            <Form.Item
                                name="firstName"
                                label="firstName"
                                hasFeedback
                                validateTrigger="onBlur"
                                rules={[{type: 'string', message: 'The input is not valid lastName!'}]}
                            >
                                <Input placeholder="Please enter your firstName" />
                            </Form.Item>


                            <Form.Item
                                name="lastName"
                                label="lastName"
                                hasFeedback
                                validateTrigger="onBlur"
                                rules={[{type: 'string', message: 'The input is not valid lastName!'}]}

                            >
                                <Input
                                    style={{
                                        width: '100%',
                                    }}

                                    placeholder="Please enter your lastName"
                                />
                            </Form.Item>



                            <Form.Item
                                name="phoneNumber"
                                label="phoneNumber"
                                hasFeedback
                                validateTrigger="onBlur"
                                rules={[{len:8,message:'phone number must be 8 digits'}, {
                                    pattern: /^[0-9]{8}$/,
                                    message: 'The input is not valid phone number!',
                                }]}

                            >
                                <Input placeholder="Please enter your phoneNumber" />
                            </Form.Item>


                            <Form.Item
                                name="Email"
                                label="Email"

                            >
                                <Input placeholder="Please enter your Email" />
                            </Form.Item>
                    <Form.Item style={{display: 'flex', justifyContent: 'center'}}
                    >
                        <Space>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button htmlType="submit"  style={{
                                backgroundColor: '#00488e',
                            }} type="primary">
                                Submit
                            </Button>
                        </Space>
                    </Form.Item>

                </Form>
            </Drawer>
        <Layout  >

            <Navbar/>
            <Layout
                style={{

                    height: '100%',

                }}
            >

                <Sidebar collapsed={collapsed} />

                <Layout
                    style={{
                        padding: '0 24px 24px',
                        height:'100%',



                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',

                            width: 64,
                            height: 64,
                        }}
                    />
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight:"80vh",
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            height: '100%',


                        }}
                    >

                        <Descriptions title="User Info" layout="vertical" size='default'
                                      extra={
                                          <Space>
                                              <Button
                                                  style={{backgroundColor: '#00488e'}}
                                                  onClick={() => setOpen(true)}
                                                  type="primary"
                                              >
                                                  Edit
                                              </Button>
                                              <Button
                                                  style={{backgroundColor: '#00488e'}}
                                                  onClick={handlePasswordChange}
                                                  type="primary"
                                              >
                                                  Change Password
                                              </Button>
                                          </Space>} items={items}/>
                    </Content>
                </Layout>
            </Layout>
            <Footerr />
        </Layout>
        </>
    );
}

export default Profile;
