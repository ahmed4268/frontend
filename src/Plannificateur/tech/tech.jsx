import CountUp from "react-countup";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Button, Col, Input, Layout, Popconfirm, Row, Space, Statistic, Table, Tag, theme, Tooltip} from "antd";
import Navbar from "../../component/navbar/navbar";
import Sidebar from "../../component/sidebar/sidebar";
import {
    ContainerOutlined,
    DeleteTwoTone,
    EditTwoTone,
    EyeTwoTone,
    MenuFoldOutlined,
    MenuUnfoldOutlined, PlusOutlined,
    QuestionCircleOutlined, ScheduleOutlined,
    SearchOutlined
} from "@ant-design/icons";
import instance from '../../login_logout/axiosInstance';

import Footerr from "../../component/footer/footer";
import Highlighter from "react-highlight-words";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
const formatter = (value) => <CountUp end={value} separator="," />;
const {  Content } = Layout;

const App = () => {

    const[tech, settech]=useState([]);
    const[Data, setData]=useState([]);
    useEffect(() => {
        const fetchtech = async () => {

            const { data } = await axios.get('/tech', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                }}
            );
            settech(data);

        };
        fetchtech();
    }, []);
    const navigate = useNavigate();// const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchtechs = async () => {
            try {
                const newData = await Promise.all(tech.map(async (tech) => {
                    return {
                        key: tech._id,
                        firstName: tech.firstName,
                        lastName: tech.lastName,
                        Email: tech.Email,
                        phoneNumber: tech.phoneNumber,
                        specialization: tech.specialization,
                        Permis: tech.Permis,
                        Fullname: tech.Fullname,
                        disponibility: tech.disponibility,
                    };
                }));
                setData(newData);
            } catch (error) {
                console.error(error);

            }
        };
        fetchtechs();
    }, [tech]);
    const inProgressCount = tech.filter(tech => tech.disponibility === true).length;
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
        const tech = Data.find(tech => tech.key === key);
        if (!tech) {
            console.error(`No tech found with key: ${key}`);
            return;
        }
        navigate('/edittech', { state: { tech: tech } });



    };
    const handleDelete = async (key) => {
        try {
            await axios.delete(`/tech/${key}`,{
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            const newTech = Data.filter(tech => tech.key !== key);
            setData(newTech);
        } catch (error) {
            console.error(error);
        }
    };const handleconge = async (key) => {
        const tech = Data.find(tech => tech.key === key);
        if (!tech) {
            console.error(`No tech found with key: ${key}`);
            return;
        }
        navigate('/newconge', { state: { key: key } });
    };

    function handletime(key) {
        const tech = Data.find(tech => tech.key === key);
        if (!tech) {
            console.error(`No tech found with key: ${key}`);
            return;
        }
        navigate('/presence', { state: { key: key } });

    }

    const columns = [
        {
            title: 'firstName',
            dataIndex: 'firstName',
            width: "10%",
            responsive: ['lg'],
            ...getColumnSearchProps('firstName'),
        },
        {
            title: 'lastName',
            dataIndex: 'lastName',
            width: "10%",
            responsive: ['md'],
            ...getColumnSearchProps('lastName'),
        },
        {
            title: 'Email',
            dataIndex: 'Email',
            width: 180,
            responsive: ['lg'],
            ...getColumnSearchProps('Email'),

        },
        {
            title: 'phoneNumber',
            dataIndex: 'phoneNumber',
            width: 18,

            ...getColumnSearchProps('phoneNumber'),


        },
        {
            title: 'specialization',
            dataIndex: 'specialization',
             width: 18,

            ...getColumnSearchProps('specialization'),


        },
        {
            title: 'Permis',
            dataIndex: 'Permis',
            key: 'Permis',
             width: 18,
            render: (Permis) => {
                let color;
                switch (Permis) {
                    case 'car':
                        color = 'blue';
                        break;
                    case 'truck':
                        color = 'green';
                        break;

                }

                return (
                    <Tag color={color} key={Permis}>
                        {Permis}
                    </Tag>
                );
            }


            ,
            filters: [
                {
                    text: 'car',
                    value: 'car',
                },
                {
                    text: 'truck',
                    value: 'truck',
                },

            ],
            onFilter: (value, record) => record.Permis.indexOf(value) === 0,
        },
        {
            title: 'Actions',
            width: "1%",
            // responsive: ['md'],
            render: (_,record) => {

                return(

                    <Space size="middle">
                        <Tooltip title="check presence">
                            <Button icon={<ContainerOutlined />}  onClick={() => {
                                handletime(record.key)
                            }

                            }/>

                        </Tooltip>
                        <Tooltip title="add congé">
                            <Button icon={<ScheduleOutlined />}  onClick={() => {
                                handleconge(record.key)
                            }

                            }/>

                        </Tooltip>
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

                            <Row justify="space-between">
                                <Col>
                                    <Statistic title="Active tech" value={inProgressCount} formatter={formatter} />
                                </Col>
                                <Col>
                                    <Button type="primary" size="large" href="/new-technician" icon={<PlusOutlined />}
                                            style={{
                                              backgroundColor: '#02073f',
                                            }}>New Technician</Button>
                                </Col>
                            </Row>
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