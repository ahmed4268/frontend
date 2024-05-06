import React, {useEffect,useRef, useState} from 'react';
import {
    DatePicker, Flex,
    Form,
    Input,
    Select, Table,
    Tag
} from 'antd';
import {useLocation, useNavigate} from 'react-router-dom';
import {

    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';

import {Space, Layout, message, theme, Divider,Col,Row,Button, Steps} from 'antd';
import axios from "axios";
import Navbar from "../../component/navbar/navbar";
import Sidebar from "../../component/sidebar/sidebar";
import Footerr from "../../component/footer/footer"
import Cookies from "js-cookie";


const {  Content } = Layout;



const App = () => {
    const location = useLocation();
    const technicien = location.state.tech;

    const [info, setinfo] = useState({
        firstName: technicien.firstName,
        lastName: technicien.lastName,
        Email: technicien.Email,
        phoneNumber: technicien.phoneNumber,
        specialization: technicien.specialization,
        Permis: technicien.Permis,
    });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const onFinishGeneral = (values) => {
        setinfo(values);
        const technician = {
            firstName: values.firstName,
            lastName: values.lastName,
            Email: values.Email,
            phoneNumber: values.phoneNumber,
            specialization: values.specialization,
            Permis: values.Permis,
        };
        message.loading('updating technician...', 1.5)

        axios.patch(`https://opti-track-1.onrender.com/tech/${technicien.key}`, technician,{
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        })
            .then((response) => {
                message.success('technician updated successfully');
                navigate('/technicians');
            }).catch((error) => {
            if (error.response.status === 410) {
                message.error('Email already exists');}
            else if (error.response.status === 411) {
                message.error('Phone number already exists');
            } else {
                message.error('Failed to add technician');
            }
        });
    }

    function Edittech() {



    }


    const GeneralForm= ({onFinish,initialvalue}) => {

        return (
            <Form onFinish={onFinish}
                  initialValues={initialvalue}
                  size="middle"
                  labelCol={{

                  }}

                  layout="vertical"
                  style={{
                      maxWidth: 600,
                  }}
            >
                <Form.Item  hasFeedback
                            label="firstName"
                            name="firstName"
                            validateTrigger="onBlur"
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    type: 'string',
                                   min:4,
                                },
                            ]}>
                    <Input />
                </Form.Item>
                <Form.Item  hasFeedback name="lastName" label="lastName" rules={[
                    {
                        required: true,
                    },
                    {
                        type: 'string',
                        min: 4,
                    },
                ]}
                            style={{ width: '100%' }}>
                    <Input style={{ width: '300px' }} />
                </Form.Item>
                <Form.Item hasFeedback name="Email" label="Email" rules={[
                    {
                        required: true,
                        message: 'Please input your Email!',
                    },
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                ]} style={{ width: '100%' }}>
                    <Input style={{ width: '300px' }}/>
                </Form.Item>

                <Form.Item label="phoneNumber" name="phoneNumber" rules={[
                    {
                        required: true,
                        message: 'Please input your phone number!',
                    },
                    {
                        pattern: /^[0-9]{8}$/,
                        message: 'The input is not valid phone number!',
                    },
                ]} style={{ width: '100%' }}>
                    <Input  style={{ width: '100%' }}/>
                </Form.Item>

                <Form.Item hasFeedback name="specialization" label="specialization" rules={[
                    {
                        required: true,
                    },
                    {
                        type: 'string',
                        min: 6,
                    },
                ]}  style={{ width: '100%' }}>
                   <Input  style={{ width: '100%' }}/>
                </Form.Item>
                <Form.Item hasFeedback name="Permis" label="Permis">
                    <Select>
                        <Select.Option value="car">car</Select.Option>
                        <Select.Option value="truck">truck</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item style={{ alignSelf: 'flex-start' }}> {/* Add this */}
                    <Button type="primary" htmlType="submit">
                        Done
                    </Button>
                </Form.Item>

            </Form >

        )
    }
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [collapsed, setCollapsed] = useState(false);



    return (
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
                            display: 'flex', // Add this
                            justifyContent: 'center', // Add this
                            alignItems: 'center',

                        }}
                    >
                        <>

                                    <GeneralForm onFinish={onFinishGeneral} initialvalue={info}/>


                        </>
                    </Content>
                </Layout>
            </Layout>
            <Footerr />
        </Layout>
    );
};
export default App;