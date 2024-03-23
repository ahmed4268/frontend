
import React, {useEffect, useState} from 'react';
import CountUp from 'react-countup';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';

import { Space,Layout,Statistic, Col,Row , theme,Button } from 'antd';
import axios from "axios";
import Tablee from "../../component/operation/operation";
import Sidebar from "../../component/sidebar/sidebar"
import Footerr from "../../component/footer/footer"
import Navbar from "../../component/navbar/navbar"
const {  Content } = Layout;

const formatter = (value) => <CountUp end={value} separator="," />;
const App = () => {

    const[Operation, setOperation]=useState([]);
    useEffect(() => {
        const fetchOperations = async () => {

            const { data } = await axios.get('/operation/archive');
            setOperation(data);

        };
        fetchOperations();
    }, []);
    console.log('operation',Operation);
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

                            <Tablee operation={Operation} archive={true}/>

                    </Content>
                </Layout>
            </Layout>
            <Footerr />
        </Layout>
    );
};
export default App;