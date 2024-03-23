
import React, {useEffect, useState} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    Cascader,
    Checkbox,
    ColorPicker,
    DatePicker, Flex,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    Slider,
    Switch,
    TreeSelect,
    Upload,
} from 'antd';
import {
    CarOutlined, CheckCircleOutlined,
    ContainerOutlined,
    LoadingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined, ProfileOutlined, SmileOutlined, SolutionOutlined, TeamOutlined, UserOutlined,
} from '@ant-design/icons';

import {Space, Layout, Statistic, Col, message, theme, Button, Steps} from 'antd';
import axios from "axios";
// import Tablee from "../../component/operation/operation";
import Sidebar from "../../component/sidebar/sidebar"
import Footerr from "../../component/footer/footer"
import Navbar from "../../component/navbar/navbar"
const {  Content } = Layout;

const App = () => {
    const steps = [
        {
            title: 'General',
            icon: <ContainerOutlined />,
        },
        {
            title: 'Technicians',
            icon: <TeamOutlined />,
        },
        {
            title: 'Vehicle',
            icon: <CarOutlined />
        },
        {
            title: 'confirmation',
            icon: <CheckCircleOutlined />,
        },
    ];

    const { RangePicker } = DatePicker;
    const { TextArea } = Input;
    const[Site, setSite]=useState([]);
    useEffect(() => {
        const fetchSites = async () => {

            const { data } = await axios.get('/site');
            setSite(data);

        };
        fetchSites();

    }, []);

const options = Site.map((site) => ({
    value: site._id,
    label: `${site.name}(${site.state},${site.city})`,
}));
const [generalinfo,setGeneralinfo] = useState(null);
const GeneralForm= ({onFinish}) => {
    return (
        <Form onSubmit={onFinish}
            size="large"
            labelCol={{
                span: 4,
            }}
            wrapperCol={{
                span: 14,
            }}
            layout="horizontal"
            style={{
                maxWidth: 600,
            }}
        >
            <Form.Item  hasFeedback
                        label="Name"
                        name="name"
                        validateTrigger="onBlur"
                        rules={[
                            {
                                required: true,
                            },
                            {
                                type: 'string',
                                min: 6,
                            },
                        ]}>
                <Input />
            </Form.Item>
            <Form.Item  hasFeedback name="access code" label="Acess Code" rules={[
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
            <Form.Item hasFeedback name="Marché" label="Marché" rules={[
                {
                    required: true,
                },
                {
                    type: 'string',
                    min: 6,
                },
            ]}>
                <Input />
            </Form.Item>
            <Form.Item label="Site" name="Site" rules={[
                {
                    required: true,
                },
            ]}>

                <Select hasFeedback showSearch  placeholder="Search to Select"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())} options={options} />

            </Form.Item>

            <Form.Item hasFeedback name="Date" label="Date" rules={[
                {
                    required: true,
                },
            ]} >
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                </Form.Item>
               <Form.Item hasFeedback label="Description">
                <TextArea rows={4} />
                </Form.Item>

                <Flex  justify="space-around" >
                    {current > 0 && (
                        <Button
                            style={{
                                margin: '0 8px',
                            }}
                            onClick={() => prev()}
                        >
                            Previous
                        </Button>
                    )}

                    {current < steps.length - 1 && (
                        <Button type="primary" htmlType="submit" onClick={()=>
                        next()
                    } >
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={() => message.success('Processing complete!')}>
                            Done
                        </Button>
                    )}
                </Flex>

             </Form >

    )
}
const next = () => {
    setCurrent(current + 1);
}
const onFinishGeneral=(values)=> {
    setGeneralinfo(values);
console.log(generalinfo)
}
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [collapsed, setCollapsed] = useState(false);

    const [current, setCurrent] = useState(0);



    const prev = () => {
        setCurrent(current - 1);
    };
    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
        icon: item.icon
    }));

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
                            <Steps current={current}  items={items} />
                            <Flex  justify="center" >
                            <div style={{ marginTop:50 }} >
                             <GeneralForm onFinish={onFinishGeneral}/>
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