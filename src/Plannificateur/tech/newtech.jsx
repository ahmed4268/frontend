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


    const [info, setinfo] = useState();
    const [submitting, setSubmitting] = useState(false);


    const onFinishGeneral = (values) => {
        setinfo(values);
        console.log("val",values)
        if (!values) {
            console.error('info is undefined');
            return;
        }

        const technician = {
            firstName: values.firstName,
            lastName: values.lastName,
            Email: values.Email,
            phoneNumber: values.phoneNumber,
            specialization: values.specialization,
            Permis: values.Permis,
        };
        message.loading('creating technician...', 2.5)

        axios.post("https://opti-track-1.onrender.com/tech", technician,{
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        })
            .then((response) => {
                console.log('Technician added successfully', response);
                message.success('technician added successfully');
                navigate('/technicians');
            })
            .catch((error) => {
                console.log('Failed to add technician', error.response);
                if (error.response.status === 410) {
                    message.error('Email already exists');
                } else if (error.response.status === 411) {
                    message.error('Phone number already exists');
                } else {
                    message.error('Failed to add technician');
                }
            })

        setSubmitting(true);
    }
    const navigate = useNavigate();

    function newtech() {

    }


    const GeneralForm= ({onFinish,initialvalue}) => {

        return (
            <Form onFinish={onFinish}
                  initialValues={initialvalue}
                  size="middle"
                  // labelCol={{
                  //     span: 5,
                  // }}
                  wrapperCol={{
                      span: 24,
                  }}
                  layout="vertical"
                  style={{

                      width: '100%',
                      margin: '0 auto',


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
                ]}>
                    <Input />
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
                ]}>
                    <Input />
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
                ]}>
                    <Input />
                </Form.Item>

                <Form.Item hasFeedback name="specialization" label="specialization" rules={[
                    {
                        required: true,
                    },
                    {
                        type: 'string',
                        min: 6,
                    },
                ]} >
                   <Input />
                </Form.Item>
                <Form.Item hasFeedback name="Permis" label="Permis">
                    <Select>
                        <Select.Option value="car">car</Select.Option>
                        <Select.Option value="truck">truck</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item style={{ alignSelf: 'flex-start' }}>
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

                        }}
                    >
                        <>
                            <h2 style={{ fontFamily: 'Arial' }}> new Technician</h2>                            <Flex justify="center" >
                                <div style={{ marginTop:50 }} >
                                    <GeneralForm onFinish={onFinishGeneral} initialvalue={info}/>
                                </div>
                            </Flex>

                        </>
                    </Content>
                </Layout>
            </Layout>
            <Footerr />
        </Layout>
    );
};
export default App;