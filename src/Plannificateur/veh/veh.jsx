import CountUp from "react-countup";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Button, Col, Input, Layout, Popconfirm, Row, Space, Statistic, Table, Tag, theme, Tooltip} from "antd";
import Navbar from "../../component/navbar/navbar";
import Sidebar from "../../component/sidebar/sidebar";
import {
    DeleteTwoTone,
    EditTwoTone, EnvironmentOutlined,
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
import Cookies from "js-cookie";

const formatter = (value) => <CountUp end={value} separator="," />;
const {  Content } = Layout;

const App = () => {

    const[veh, setveh]=useState([]);
    const[Data, setData]=useState([]);
    useEffect(() => {
        const fetchveh = async () => {

            const { data } = await axios.get('/vehicule', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setveh(data);

        };
        fetchveh();
    }, []);
    const navigate = useNavigate();// const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchvehs = async () => {
            try {
                const newData = await Promise.all(veh.map(async (veh) => {
                    return {
                        key: veh._id,
                        licensePlate: veh.licensePlate,
                        brand: veh.brand,
                        model: veh.model,
                        seats: veh.seats,
                        year: veh.year,
                        type: veh.type,
                        disponibility: veh.disponibility,
                        device: veh.device,
                    };
                }));
                setData(newData);
            } catch (error) {
                console.error(error);

            }
        };
        fetchvehs();
    }, [veh]);
    const inProgressCount = veh.filter(veh => veh.disponibility === "disponible").length;
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
        const veh = Data.find(veh => veh.key === key);
        if (!veh) {
            console.error(`No veh found with key: ${key}`);
            return;
        }
        navigate('/editveh', { state: { veh: veh } });



    };
    const handletrack = (key) => {
        console.log("Hand")
        const veh = Data.find(operation => operation.key === key);
        if (!veh) {
            console.error(`No veh found with key: ${key}`);
            return;
        }
        console.log(veh)
        navigate('/track', { state: { veh: veh } });


    };
    const handleDelete = async (key) => {
        try {
            await axios.delete(`/vehicule/${key}`,{
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            const newveh = Data.filter(tech => tech.key !== key);
            setData(newveh);
        } catch (error) {
            console.error(error);
        }
    };
    const columns = [
        {
            title: 'licensePlate',
            dataIndex: 'licensePlate',
            width: 500,
            ...getColumnSearchProps('licensePlate'),
        },
        {
            title: 'brand',
            dataIndex: 'brand',
            ...getColumnSearchProps('brand'),
        },
        {
            title: 'model',
            dataIndex: 'model',
            width: 500,

            ...getColumnSearchProps('model'),

        },
        {
            title: 'seats',
            dataIndex: 'seats',
            width: 180,

            ...getColumnSearchProps('seats'),


        },
        {
            title: 'year',
            dataIndex: 'year',
            width: 180,

            ...getColumnSearchProps('year'),


        },
        {
            title: 'type',
            dataIndex: 'type',
            key: 'type',

            render: (type) => {
                let color;
                switch (type) {
                    case 'car':
                        color = 'blue';
                        break;
                    case 'truck':
                        color = 'green';
                        break;

                }

                return (
                    <Tag color={color} key={type}>
                        {type}
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
            onFilter: (value, record) => record.type.indexOf(value) === 0,
        },
        {
            title: 'Actions',
            width: "1%",
            // responsive: ['md'],
            render: (_,record) => {

                return(

                    <Space size="middle">
                        <Tooltip title="check location">
                            <Button icon={ <EnvironmentOutlined />}  onClick={() =>
                                handletrack(record.key)
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
                                        title="Delete the vehicule"
                                        description="Are you sure to delete this vehicule?"
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
                        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>


                            <Row justify="space-between">
                                <Col>
                                    <Statistic title="Active vehicules" value={inProgressCount} formatter={formatter} />
                                </Col>
                                <Col>
                                    <Button type="primary" size="large" href="/new-vehicule" icon={<PlusOutlined />}
                                            style={{
backgroundColor: '#02073f',
                                            }}>New Vehicule</Button>   </Col>
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