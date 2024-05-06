import CountUp from "react-countup";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Button, Col, Input, Layout, Popconfirm, Row, Space, Statistic, Table, Tag, theme, Tooltip} from "antd";
import Navbar from "../../component/navbar/navbar";
import Sidebar from "../../component/sidebar/sidebar";
import {
    DeleteTwoTone,
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
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import Cookies from "js-cookie";

const formatter = (value) => <CountUp end={value} separator="," />;
const {  Content } = Layout;

const App = () => {

    const[conge, setconge]=useState([]);
    const[Data, setData]=useState([]);
    useEffect(() => {
        const fetchconge = async () => {

            const { data } = await axios.get('/conge',{
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setconge(data);

        };
        fetchconge();
    }, []);
    const navigate = useNavigate();// const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchconges = async () => {
            try {
                const newData = await Promise.all(conge.map(async (conge) => {
                    return {
                        key: conge._id,
                        technician_id: conge.technician._id,
                        technician: conge.technician.Fullname,
                        StartDate: (dayjs(conge.startDate)).format("YYYY-MM-DD HH:mm"),
                        EndDate: (dayjs(conge.endDate)).format("YYYY-MM-DD HH:mm"),
                        returnDate: (dayjs(conge.returnDate)).format("YYYY-MM-DD HH:mm"),
                        type: conge.type,
                        status: conge.status
                    };
                }));
                setData(newData);
            } catch (error) {
                console.error(error);

            }
        };
        fetchconges();
    }, [conge]);
    const inProgressCount = conge.filter(conge => conge.status === "now").length;
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
    const handleedit = (key) => {
        // Find the operation with the given key
        const conge = Data.find(conge => conge.key === key);
        if (!conge) {
            console.error(`No conge found with key: ${key}`);
            return;
        }
        navigate('/editconge', { state: { conge: conge } });



    };
    const handleDelete = async (key) => {
        try {
            await axios.delete(`/conge/${key}`,{
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            const newconge = Data.filter(conge => conge.key !== key);
            setData(newconge);
        } catch (error) {
            console.error(error);
        }
    };
    const columns = [
        {
            title: 'technician',
            dataIndex: 'technician',
            width: "15%",
            responsive: ['lg'],
            ...getColumnSearchProps('technician'),
        },
        {
            title: 'StartDate',
            dataIndex: 'StartDate',
            width: "15%",
            responsive: ['md'],
            ...getColumnSearchProps('StartDate'),
        },
        {
            title: 'EndDate',
            dataIndex: 'EndDate',
            width:"15%",
            responsive: ['lg'],
            ...getColumnSearchProps('EndDate'),

        },
        {
            title: 'returnDate',
            dataIndex: 'returnDate',
            width:"15%",

            ...getColumnSearchProps('returnDate'),


        },
        {
            title: 'type',
            dataIndex: 'type',
            key: 'type',
            width: "10%",
            render: (type) => {
                let color;
                switch (type) {
                    case 'MALADIE':
                        color = 'red';
                        break;
                    case 'ANNUEL':
                        color = 'volcano';
                        break;
                    case 'AUTRE':
                        color = 'blue';
                        break;

                }

                return (
                    <Tag color={color} key={type}>
                        {type}
                    </Tag>
                );
            },
            filters: [
                {
                    text: 'MALADIE',
                    value: 'MALADIE',
                },
                {
                    text: 'ANNUEL',
                    value: 'ANNUEL',
                },
                {
                    text: 'AUTRE',
                    value: 'AUTRE',
                },

            ],
            onFilter: (value, record) => record.type.indexOf(value) === 0,
        },
        {
            title: 'status',
            dataIndex: 'status',
            key: 'status',
            width: "10%",
            render: (status) => {
                let color;
                switch (status) {
                    case 'now':
                        color = 'green';
                        break;
                    case 'passed':
                        color = 'volcano';
                        break;
                    case 'up coming':
                        color = 'blue';
                        break;
                }

                return (
                    <Tag color={color} key={status}>
                        {status}
                    </Tag>
                );
            },
            filters: [
                {
                    text: 'now',
                    value: 'now',
                },
                {
                    text: 'up coming',
                    value: 'up coming',
                },
                {
                    text: 'passed',
                    value: 'passed',
                },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
        },

        {
            title: 'Actions',
            width: "1%",
             responsive: ['md'],
            render: (_,record) => {

                return(

                    <Space size="middle">
                        {/*<Tooltip title="check congé">*/}
                        {/*    <Button icon={<ScheduleOutlined />}  onClick={() => {*/}

                        {/*    }}/>*/}

                        {/*</Tooltip>*/}
                        <div >

                            <Space size="middle">
                                <Tooltip title="Edit" >
                                    <Button   icon={<EditTwoTone twoToneColor="#7070a9"/>} onClick={() =>
                                        handleedit(record.key)}
                                    />
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <Popconfirm
                                        title="Delete the technician"
                                        description="Are you sure to delete this tech?"
                                        onConfirm={() => handleDelete(record.key)}
                                        icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                    >
                                        <Button icon={<DeleteTwoTone twoToneColor="#ff1616"/>}/>
                                    </Popconfirm>

                                </Tooltip>
                            </Space>
                        </div>


                    </Space>
                )
            }
            ,
        },

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



                                    <Statistic title="Active congé" value={inProgressCount} formatter={formatter} />

{/*                                <Col span={12}>*/}
{/*                                    <Button type="primary" size="large" href="/new-technician" icon={<PlusOutlined />}*/}
{/*                                            style={{*/}
{/*backgroundColor: '#02073f',*/}
{/*                                            }}>New Technician</Button>*/}
{/*                                </Col>*/}


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