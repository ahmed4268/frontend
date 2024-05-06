
import React, {useEffect, useRef, useState} from 'react';
import CountUp from 'react-countup';
import {
    DeleteTwoTone,
    EditTwoTone,
    DownloadOutlined,
    EyeTwoTone,
    MenuFoldOutlined,
    MenuUnfoldOutlined, QuestionCircleOutlined, SearchOutlined, TrademarkCircleTwoTone,
} from '@ant-design/icons';

import {
    Space,
    Layout,
    Col,
    Row,
    theme,
    Button,
    Table,
    Drawer,
    ConfigProvider,
    Input,
    Tag,
    Tooltip,
    Popconfirm, Divider, message
} from 'antd';
import axios from "axios";
import Sidebar from "../../component/sidebar/sidebar"
import Footerr from "../../component/footer/footer"
import Navbar from "../../component/navbar/navbar"
import dayjs from "dayjs";
import Highlighter from "react-highlight-words";
import {data} from "autoprefixer";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import * as XLSX from 'xlsx';


const {  Content } = Layout;

const formatter = (value) => <CountUp end={value} separator="," />;

const App = () => {
    const[Data, setData]=useState([]);
console.log(Data)
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(Data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "table_data.xlsx");
    };
    const navigate = useNavigate();// const [isEditing, setIsEditing] = useState(false);

    const [spinning, setSpinning] = React.useState(false);
    const [open, setOpen] = useState(false);
    const [view, setview] = useState(null);
    const DescriptionItem = ({title, content}) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>)
    const[Operation, setOperation]=useState([]);
const opref=useRef(Operation)
    useEffect(() => {
        opref.current = Operation;
    }, [Operation]);

    useEffect(() => {
        const fetchOperations = async () => {
            const { data } = await axios.get('https://opti-track-1.onrender.com/operation/archive',{
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setOperation(data);
            console.log('Operation', data);

            if (data) {
                const newData = data.map((operation) => {
                    if (operation && operation.site) {
                        return {
                            key: operation.id,
                            name: operation.name,
                            AccessCode: operation.accessCode,
                            site: operation.site.name,
                            Technician: operation.technicians.map(technician => technician ? technician.Fullname : '').join(', '),
                            'Start_Date': (dayjs(operation.startTime)).format("YYYY-MM-DD HH:mm"),
                            End_Date: (dayjs(operation.endTime)).format("YYYY-MM-DD HH:mm"),
                            createdAt: (dayjs(operation.createdAt)).format("YYYY-MM-DD HH:mm"),

                            status: operation.status,
                            responsable: operation.responsable ? operation.responsable.Fullname : '',
                            Driver: operation.driver ? operation.driver.Fullname : '',
                            Marche: operation.Marche,
                            responsable_phone: operation.responsable ? operation.responsable.phoneNumber : '',
                            Description: operation.Description,
                            Adress: `${operation.site.address}, ${operation.site.state}, ${operation.site.city}`,
                            vehicle: operation.vehicle ? `${operation.vehicle.brand} ${operation.vehicle.model},${operation.vehicle.seats}-seats` : '',
                            license_plate: operation.vehicle ? operation.vehicle.licensePlate : '',
                        };
                    }
                });
                setData(newData);
            }
        };
        fetchOperations();
    }, []);
    console.log('Data4',Data);

    const showDrawer = () => {
        setOpen(true);
    };
    const drower= (record)=>{
        showDrawer();
        setview({ ...record });
    }
    const onClose = () => {
        setOpen(false);
    };
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
        await axios.delete(`https://opti-track-1.onrender.com/operation/${key}/def`,{
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        })
        const newData = Data.filter((item) => item.key !== key);
        setData(newData);
        message.success('Operation deleted');
    };
    const handlereplay = (key) => {

        const operation = Operation.find(operation => operation._id === key);
        if (!operation) {
            console.error(`No operation found with key: ${key}`);
            return;
        }
        navigate('/replay', { state: { operation: operation } });


    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: 180,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'AccessCode',
            dataIndex: 'AccessCode',
            width: "10%",
            responsive: ['md'],
            ...getColumnSearchProps('AccessCode'),
        },
        {
            title: 'Site',
            dataIndex: 'site',
            width: 180,
            responsive: ['md'],
            ...getColumnSearchProps('site'),

        },
        {
            title: 'Technician',
            dataIndex: 'Technician',
            width: 180,
            responsive: ['md'],
            ...getColumnSearchProps('Technician'),


        },
        {
            title: 'Start Date',
            dataIndex: 'Start_Date',
            width: "15%",
            responsive: ['md'],
            sorter: (date1, date2) => {
                // Convert date strings to Date objects
                const firstDate = new Date(date1.Start_Date);
                const secondDate = new Date(date2.Start_Date);

                // Calculate the difference in days
                const timeDifference = firstDate.getTime() - secondDate.getTime();
                const daysDifference = timeDifference / (1000 * 3600 * 24);

                // Return the difference in days
                return Math.round(daysDifference); // Round to the nearest whole number
            }
        },
        {
            title: 'End Date',
            dataIndex: 'End_Date',
            width: "15%",
            responsive: ['md'],
        },


        {
            title: 'status',
            dataIndex: 'status',
            key: 'status',
            width: '5%',
            render: (status) => {
                let color;
                switch (status) {


                    case 'Completed':
                        color = 'default';
                        break;
                    default:
                        color = 'red';
                }

                return (
                    <Tag color={color} key={status}>
                        {status}
                    </Tag>
                );
            }


            ,
            filters: [


                {
                    text: 'Completed',
                    value: 'Completed',
                },
                {
                    text: 'Canceled',
                    value: 'Canceled',
                },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
        },
        {
            title: 'Actions',
            width: "1%",
            // responsive: ['md'],
            render: (_,record) => {

                return(

                    <Space size="middle">
                        <Tooltip title="more details">
                            <Button icon={<EyeTwoTone/>}  onClick={() => {
                                drower(record);
                            }}/>

                        </Tooltip>
                        <div >
                            <Space size="middle">
                                <Tooltip title="replay" >
                                    <Button   icon={<TrademarkCircleTwoTone  twoToneColor="#7070a9"/>} onClick={() =>
                                        handlereplay(record.key)}
                                    />
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <Popconfirm
                                        title="Delete the operation"
                                        description="Are you sure to delete this task?"
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

// Join full names with commas


    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <ConfigProvider
            button={{ className: 'my-button' }}

        >
            <div>
                <Drawer width={640} placement="right" title="Operation Details" closable={true} onClose={onClose} open={open}>
                   

                    <Row>
                        <Col span={12}>
                            <DescriptionItem title=" Name" content={view?.name}/>
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="AccessCode" content={view?.AccessCode}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <DescriptionItem title="Marche" content={view?.Marche}/>
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="Status" content={view?.status}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <DescriptionItem title="Start Date" content={view?.Start_Date}/>
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="End Date" content={view?.End_Date}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <DescriptionItem title="Site" content={view?.site}/>
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="Address" content={view?.Adress}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <DescriptionItem
                                title="Description"
                                content={view?.Description}
                            />
                        </Col>
                    </Row>
                    <Divider/>
                    <p className="site-description-item-profile-p">Members</p>
                    <Row>
                        <Col span={12}>
                            <DescriptionItem title="Technician" content={view?.Technician}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <DescriptionItem title="Responsable" content={view?.responsable}/>
                        </Col>


                        <Col span={12}>
                            <DescriptionItem title="Phone Number" content={view?.responsable_phone}/>
                        </Col>
                    </Row>
                    <Col span={12}>
                        <DescriptionItem title="Driver" content={view?.Driver}/>
                    </Col>


                    <Divider/>
                    <p className="site-description-item-profile-p">Vehicle</p>
                    <Row>
                        <Col span={12}>
                            <DescriptionItem title="Brand" content={view?.vehicle}/>
                        </Col>
                        <Col span={12}>
                            <DescriptionItem title="License Plate"  content={view?.license_plate}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <DescriptionItem title="Operation_ID" content={view?.key}/>
                        </Col>
                        <Col span={12}>
                        <DescriptionItem title="Created At" content={view?.createdAt}/>
                    </Col>
                    </Row>
                </Drawer>
                </div>
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
                                                        <Row justify="end">
                                                            <Col>
                                                                <Button type="primary" icon={<DownloadOutlined />} size='large' style={{
                                                                    backgroundColor: '#02073f',
                                                                }} onClick={exportToExcel}>Export</Button>
                                                            </Col>
                                                        </Row>
                            <Table bordered columns={columns}  dataSource={Data}  onChange={onChange} size="large"/>
                            </Space>
                        </Content>
                    </Layout>
                </Layout>
                <Footerr />
            </Layout>
        </ConfigProvider>

    );
};
export default App;