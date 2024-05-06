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
    const veh = location.state.veh;
    console.log(veh)

    const [info, setinfo] = useState({
        licensePlate: veh.licensePlate,
        brand: veh.brand,
        model: veh.model,
        seats: veh.seats,
        year: veh.year,
        type: veh.type,
    });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const onFinishGeneral = (values) => {
        setinfo(values);
        setSubmitting(true);
        const vehicle = {
            licensePlate: values.licensePlate,
            brand: values.brand,
            model: values.model,
            seats: values.seats,
            year: values.year,
            type: values.type,
        };
        message.loading('updating vehicle...', 1.5)

        axios.patch(`/vehicule/${veh.key}`, vehicle,{
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        })
            .then((response) => {
                message.success('vehicule added successfully');
                navigate('/vehicules');
            })
            .catch((error) => {
                if (error.response.status === 410) {
                    message.error('licenseplate already exists');
                } else {
                    message.error('Failed to edit vehicule,check the licenseplate');
                }
            })
    }





    const GeneralForm= ({onFinish,initialvalue}) => {

        return (
            <Form onFinish={onFinish}
                  initialValues={initialvalue}
                  size="large"

                  // wrapperCol={{
                  //     span: 150,
                  // }}
                  layout="horizontal"
                  style={{
                      maxWidth: 600,
                  }}
            >
                <Form.Item  hasFeedback
                            label="licensePlate"
                            name="licensePlate"
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
                    <Input style={{ width: '300px' }}/>
                </Form.Item>
                <Form.Item hasFeedback name="brand" label="brand" rules={[
                    {
                        required: true,
                    },
                    {
                        type: 'string',
                        min: 3,
                    },
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item  hasFeedback name="model" label="model" rules={[
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

                <Form.Item label="seats" name="seats" rules={[
                    {
                        required: true,
                    },
                    {
                        type: 'Number',
                        min: 2,
                    },
                ]}>

                    <Input />


                </Form.Item>

                <Form.Item hasFeedback name="year" label="year" rules={[
                    {
                        required: true,
                    },
                    {
                        type: 'Number',
                        len: 4,
                    },
                ]} >
                    <Input />
                </Form.Item>
                <Form.Item hasFeedback name="type" label="type">
                    <Select>
                        <Select.Option value="car">car</Select.Option>
                        <Select.Option value="truck">truck</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item style={{ marginLeft:"300px" }}>
                    <Button type="primary" htmlType="submit" loading={submitting}>
                        done
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
                            alignItems: 'center', //

                        }}
                    >
                        <>
                            <Flex justify="center" >
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