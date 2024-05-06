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
import dayjs from "dayjs";
import Cookies from "js-cookie";


const {  Content } = Layout;
const {RangePicker} = DatePicker;



const App = () => {
    const location = useLocation();
    const key = location.state.key;
    const [info, setinfo] = useState();
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const onFinishGeneral = (values) => {
        setinfo(values);
        console.log(values);
        setSubmitting(true);
        const conge = {
            technician: key,
            startDate: dayjs(values.Date[0]),
            endDate: dayjs(values.Date[1]),
            returnDate: dayjs(values.returnDate),
            type: values.type,
        }
        axios.post("https://opti-track-1.onrender.com/conge", conge,{
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        })
            .then((response) => {
                message.success('congé created successfully');
                navigate('/congés');
            }).catch((error) => {
            if (error.response.status === 410) {
                message.error('Email already exists');}
            else if (error.response.status === 411) {
                message.error('Phone number already exists');
            } else {
                message.error('Failed to create congé');
            }
        });
    }

    function Editconge() {



    }


    const GeneralForm= ({onFinish,initialvalue}) => {

        return (
            <Form onFinish={onFinish}
                  initialValues={initialvalue}
                  size="large"
                // labelCol={{
                //     span: 5,
                // }}
                  wrapperCol={{
                      span: 150,
                  }}
                  layout="horizontal"
                // style={{
                //     maxWidth: 600,
                // }}
            >
                <Form.Item hasFeedback name="Date" label="Date" rules={[
                    {
                        required: true,
                    },
                ]} >
                    <RangePicker showTime format="YYYY-MM-DD HH:mm" />
                </Form.Item>
                <Form.Item hasFeedback name="returnDate" label="returnDate" rules={[
                    {
                        required: true,
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || !getFieldValue('Date') || getFieldValue('Date')[1].isBefore(value) || getFieldValue('Date')[1].isSame(value)) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Return date must be greater than or equal to the end date!'));
                        },
                    }),
                ]} >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm"/>
                </Form.Item>

                <Form.Item hasFeedback name="type" label="type">
                    <Select>
                        <Select.Option value="AUTRE">AUTRE</Select.Option>
                        <Select.Option value="MALADIE">MALADIE</Select.Option>
                        <Select.Option value="ANNUEL">ANNUEL</Select.Option>
                    </Select>
                </Form.Item>

                <Flex >
                    <Button type="primary" htmlType={"submit"} >
                        Done
                    </Button>
                </Flex>

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
                            <h2 style={{ fontFamily: 'Arial' }}> new congé</h2>
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