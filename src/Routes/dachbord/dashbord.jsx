
import React, {useEffect, useState} from 'react';
import CountUp from 'react-countup';
import { ReactComponent as Logo } from '../../component/navbar/logo.svg';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,

    PlusOutlined ,



    BellOutlined ,


} from '@ant-design/icons';

import { Space,Tooltip,Layout,Statistic, Col,Row , theme,Button } from 'antd';
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

                   const { data } = await axios.get('/operation/dashboard');
                   setOperation(data);

           };
           fetchOperations();
       }, []);
    const inProgressCount = Operation.filter(operation => operation.status === "In Progress").length;

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
     const [collapsed, setCollapsed] = useState(false);
    // function getItem(label, key, icon, children, type) {
    //     return {
    //         key,
    //         icon,
    //         children,
    //         label,
    //         type,
    //     }
    // }
    //     const items = [
    //
    //         getItem('Operation List', 'sub1', <ProductOutlined />),
    //
    //         {type: 'divider'},
    //         getItem('Tracking ', 'sub2', <NodeIndexOutlined />),
    //         {type: 'divider'},
    //         getItem('Archive ', 'sub3', <FolderOutlined />),
    //         {type: 'divider'},
    //         getItem('Profil ', 'sub4', <UserOutlined />),
    //         {type: 'divider'},
    //         getItem('Log out ', 'sub5', <LogoutOutlined />)
    //
    //     ];
    return (
        <Layout  >

<Navbar/>
            <Layout
                style={{

                    height: '100%',

            }}
                >
                {/*<Sider trigger={null} collapsible collapsed={collapsed}*/}
                {/*    width={200}*/}
                {/*    style={{*/}
                {/*         // background: colorBgContainer,*/}
                {/*        minHeight:"0vh",*/}
                {/*        margin:"8px",*/}
                {/*        borderRadius: borderRadiusLG,*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <Menu*/}
                {/*         theme="dark"*/}
                {/*        mode="inline"*/}
                {/*        iconSize='78'*/}

                {/*        defaultSelectedKeys={['1']}*/}
                {/*        defaultOpenKeys={['sub1']}*/}
                {/*        style={{*/}

                {/*            marginTop: '40px',*/}
                {/*            borderRight: 0,*/}

                {/*        }}*/}
                {/*        items={items}*/}
                {/*    />*/}
                {/*</Sider>*/}
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
                        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                          <Row gutter={16}>
                            <Col span={12}>
                                <Statistic title="Active Operation" value={inProgressCount} formatter={formatter} />
                            </Col>
                          </Row>
                          <Tablee operation={Operation} />
                        </Space>
                    </Content>
                </Layout>
            </Layout>
            <Footerr />
        </Layout>
    );
};
export default App;