import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Button, Col, Input, Layout, Popconfirm, Row, Space, Statistic, Table, Tag, theme, Tooltip} from "antd";
import Navbar from "../../component/navbar/navbar";
import Sidebar from "../../component/sidebar/sidebar";
import * as XLSX from 'xlsx';
import {
    ContainerOutlined,
    DeleteTwoTone, DownloadOutlined,
    EditTwoTone,
    EyeTwoTone,
    MenuFoldOutlined,
    MenuUnfoldOutlined, PlusOutlined,
    QuestionCircleOutlined, ScheduleOutlined,
    SearchOutlined
} from "@ant-design/icons";

import Tablee from "../../component/operation/operation";
import Footerr from "../../component/footer/footer";
import Highlighter from "react-highlight-words";
import {useLocation, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";


const {  Content } = Layout;

const App = () => {
    const location = useLocation();
    const tech = location.state.key;
    const[Data, setData]=useState([]);
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(Data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "table_data.xlsx");
    };
    useEffect(() => {
        const fetchinfo = async () => {

            const { data } = await axios.get(`/presence?technician=${tech}`,{
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });

            const newData = await Promise.all(data.map(async (per) => {
                return {
                    key: per._id,
                    Opeartion: per.operationId.name,
                    Duration:per.operationId.duration,
                    traveledDistance: per.traveledDistance,
                    site: per.site.name,
                    timeSpend: per.timeSpend,
                    isdriver: per.driver?"true":"false",
                    responsable: per.responsable,
                };
            }));
            setData(newData);
        };
        fetchinfo();
    }, []);







    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = () => {
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, close}) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button

                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => handleReset()}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>

                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),

        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#9b9999',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });





    const handleDelete = async (key) => {
        try {
            await axios.delete(`/tech/${key}`);
            const newTech = Data.filter(tech => tech.key !== key);
            setData(newTech);
        } catch (error) {
            console.error(error);
        }
    };


    const columns = [
        {
            title: 'Operation',
            dataIndex: 'Opeartion',
            width: "10%",
            responsive: ['lg'],
            ...getColumnSearchProps('Opeartion'),
        },
        {
            title: 'Opertion_Duration(days)',
            dataIndex: 'Duration',
            width: "10%",
            responsive: ['md'],

            sorter:(a,b)=>a.Duration-b.Duration,
        },
        {
            title: 'timeSpend(hour)',
            dataIndex: 'timeSpend',
            width: "10%",
            responsive: ['md'],

            sorter:(a,b)=>a.timeSpend-b.timeSpend,
        },

        {
            title: 'traveledDistance(km)',
            dataIndex: 'traveledDistance',
            width: 180,
            responsive: ['lg'],
           sorter:(a,b)=>a.traveledDistance-b.traveledDistance,

        },
        {
            title: 'Site',
            dataIndex: 'site',
            width: 18,

            ...getColumnSearchProps('site'),


        },
        {
            title: 'responsable',
            dataIndex: 'responsable',
            width: 18,

            ...getColumnSearchProps('responsable'),


        },
        {
            title: 'isdriver',
            dataIndex: 'isdriver',
            key: 'isdriver',
            width: 18,
            render: (isdriver) => {
                let color;
                switch (isdriver) {
                    case 'true':
                        color = 'green';
                        break;
                    case 'false':
                        color = 'red';

                        break;
                }

                return (
                    <Tag color={color} key={isdriver}>
                        {isdriver}
                    </Tag>
                );
            },
            filters: [
                {
                    text: 'True',
                    value: 'true',
                },
                {
                    text: 'False',
                    value: 'false',
                },
            ],
            onFilter: (value, record) => record.isdriver === value,
        },
        // {
        //     title: 'Actions',
        //     width: "1%",
        //     // responsive: ['md'],
        //     render: (_,record) => {
        //
        //         return(
        //
        //             <Space size="middle">
        //                 <Tooltip title="check presence">
        //                     <Button icon={<ContainerOutlined />}  onClick={() => {
        //                         handletime(record.key)
        //                     }
        //
        //                     }/>
        //
        //                 </Tooltip>
        //                 <Tooltip title="add congé">
        //                     <Button icon={<ScheduleOutlined />}  onClick={() => {
        //                         handleconge(record.key)
        //                     }
        //
        //                     }/>
        //
        //                 </Tooltip>
        //                 <div >
        //                     <Space size="middle">
        //                         <Tooltip title="Edit" >
        //                             <Button   icon={<EditTwoTone twoToneColor="#7070a9"/>} onClick={() =>
        //                                 handleedit(record.key)}
        //                             />
        //                         </Tooltip>
        //                         <Tooltip title="Delete">
        //                             <Popconfirm
        //                                 title="Delete the technician"
        //                                 description="Are you sure to delete this tech?"
        //                                 onConfirm={() => handleDelete(record.key)}
        //                                 icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
        //                             >
        //                                 <Button icon={<DeleteTwoTone twoToneColor="#ff1616"/>}/>
        //                             </Popconfirm>
        //
        //                         </Tooltip>
        //                     </Space>
        //                 </div>
        //
        //
        //             </Space>
        //         )
        //     }
        //     ,
        // },

    ];
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
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

                            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                <Row justify="end">
                                    <Col>
                                        <Button type="primary" icon={<DownloadOutlined />} size='large' style={{
                                            backgroundColor: '#02073f',
                                        }} onClick={exportToExcel}>Export</Button>
                                    </Col>
                                </Row>
                            </Space>
                            <Table bordered columns={columns}      dataSource={Data} onChange={onChange}   size="large"/>
                        </Space>
                    </Content>
                </Layout>
            </Layout>
            <Footerr />
        </Layout>
    );
};
export default App;