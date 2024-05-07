import CountUp from "react-countup";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {
    Button,
    Col,
    Drawer,
    Form,
    Input,
    Layout, message,
    Popconfirm,
    Row, Select,
    Space,
    Statistic,
    Table,
    Tag,
    theme,
    Tooltip
} from "antd";
import Navbar from "../component/navbar/navbar";
import Sidebar from "../component/sidebar/sidebar";
import {useNavigate} from "react-router-dom";

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
import instance from '../login_logout/axiosInstance';
import * as XLSX from 'xlsx';

import Footerr from "../component/footer/footer";
import Highlighter from "react-highlight-words";
import Cookies from "js-cookie";
import {logout, removeToken} from "../actions/cookieActions";
import {useDispatch} from "react-redux";
const formatter = (value) => <CountUp end={value} separator="," />;
const {  Content } = Layout;

const App = () => {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [usertoedit, setUserToEdit] = useState(null);
const useredit=useRef(usertoedit)
    // useEffect(() => {
    //     useredit.current = usertoedit;
    // }, [usertoedit]);
    const showDrawer = () => {
        setIsDrawerVisible(true);
    };
    const closeDrawer = () => {
        setIsDrawerVisible(false);
    };
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        dispatch(removeToken());
        localStorage.removeItem('user');

        Cookies.remove('token');
        Cookies.remove('jwwt');
        navigate('/login')
    };
    const useer = JSON.parse(localStorage.getItem('user'));

    const handleFormSubmit = async (values) => {
        const user = {
            email: values.Email,
            phoneNumber: values.phoneNumber,
            lastname: values.lastName,
            firstname: values.firstName,
            role: values.Role,

        }

        try {
            const response = await axios.post('https://opti-track-1.onrender.com/user', user, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    }
                }
            );
            console.log(response, response.status)
            if (response.status === 201) {
                message.success('User created successfully');


            } else if (response.status === 500) {
                message.error('Email or phone number already exist');
            }
        } catch (error) {
            console.error(error);
            message.error('Email or phone number already exist');
        }

        closeDrawer();
    };
    const[users, setusers]=useState([]);
    const[Data, setData]=useState([]);
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(Data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "user_data.xlsx");
    };
    useEffect(() => {
        const fetchuser = async () => {

            const response = await axios.get('https://opti-track-1.onrender.com/user', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                }}
            );
            console.log('response', response)
            setusers(response.data.data.data);

        };
        fetchuser();
    }, []);
     const navigate = useNavigate();

    useEffect(() => {
        const fetchusers = async () => {
            try {
                const newData = await Promise.all(users.map(async (tech) => {
                    return {
                        key: tech._id,
                        firstName: tech.firstname,
                        lastName: tech.lastname,
                        Email: tech.email,
                        phoneNumber: tech.phoneNumber,
                        // specialization: tech.specialization,

                        Role: tech.role,
                        Fullname: tech.Fullname,
                        Status:tech.active===true ? 'Active' : 'Inactive',
                    };
                }));
                console.log('newData', newData)
                setData(newData);
            } catch (error) {
                console.error(error);

            }
        };
        fetchusers();
    }, [users]);
    const inProgressCount = Data.filter(tech => tech.Status === 'Active').length;
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
    const handleoperation = (key) => {
        // Find the operation with the given key
        const user = Data.find(tech => tech.key === key);
        console.log('user', user,'key', key);
        if (!user) {
            console.error(`No user found with key: ${key}`);
            return;
        }
        navigate('/chef_operations', { state: { user: key } });



    };
    const handleDelete = async (key) => {
        try {
            await axios.delete(`/user/${key}`,{
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            const newTech = Data.filter(tech => tech.key !== key);
            setData(newTech);
        } catch (error) {
            console.error(error);
        }
    };




    async function handleedit(values) {
       console.log("values",values)
        if (!usertoedit.key) {
            console.log('No user selected for editing');
            return;
        }
        console.log("we throu")
        const user = {
            email: values.Email,
            phoneNumber: values.phoneNumber,
            lastname: values.lastName,
            firstname: values.firstName,
            role: values.Role,
            active: values.Status,
        }
        console.log(`/user/${usertoedit.key}`)
        try {
            console.log(`/user/${usertoedit.key}`)
            const response = await axios.patch(`/user/${usertoedit.key}`, user, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                }
            });

            console.log(response, response.status);

            if (response.status === 200) {
                message.success('User updated successfully');
                if (values.Status === false && usertoedit.key === useer._id) {
                    handleLogout();
                }

            } else if (response.status === 500) {
                message.error('Email or phone number already exist');
            }
        } catch (error) {
            console.error(error);
        }

        closeDrawer();


    }

    const  setuserandopendrower= (record) => {
        setUserToEdit(record);
        showDrawer();

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
            title: 'Role',
            dataIndex: 'Role',
            width: 18,
            responsive: ['md'],
            render: (Role) => {
                let color;
                switch (Role) {
                    case 'Plannificateur':
                        color = 'green';
                        break;
                    case 'ChefProjet':
                        color = 'blue';
                        break;
                        case 'admin':
                            color = 'red';
                            break;

                }

                return (
                    <Tag color={color} key={Role}>
                        {Role}
                    </Tag>
                );
            },
            filters: [
                {
                    text: 'admin',
                    value: 'admin',
                },
                {
                    text: 'chef of Projet',
                    value: 'ChefProjet',
                },
                {
                    text: 'Plannificateur',
                    value: 'Plannificateur',
                },
            ],
            onFilter: (value, record) => record.Role.indexOf(value) === 0,
        },

        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            width: 18,
            render: (Status) => {
                let color;
                switch (Status) {
                    case 'Active':
                        color = 'green';
                        break;
                    case 'Inactive':
                        color = 'red';
                        break;

                }

                return (
                    <Tag color={color} key={Status}>
                        {Status}
                    </Tag>
                );
            },
            filters: [
                {
                    text: 'Active',
                    value: 'Active',
                },
                {
                    text: 'Inactive',
                    value: 'Inactive',
                },
            ],
            onFilter: (value, record) => record.Status.indexOf(value) === 0,
        },

        {
            title: 'Actions',
            width: "1%",
            // responsive: ['md'],
            render: (_,record) => {

                return(

                    <Space size="middle">

                        <Tooltip title="check Operations">
                            <Button icon={<ContainerOutlined />}  disabled={record.Role !== 'ChefProjet'}  onClick={() => {
                                handleoperation(record.key)
                            }

                            }/>

                        </Tooltip>


                            <Space size="middle">
                                <Tooltip title="Edit" >
                                    <Button   icon={<EditTwoTone twoToneColor="#7070a9"/>} onClick={() =>
                                        setuserandopendrower(record)

                                    }/>

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
                                    <Statistic title="Active User"  value={inProgressCount} formatter={formatter} />
                                </Col>
                                <Col>
                                    <Space size="small" direction="horizontal">
                                        <Button type="primary" size='large' icon={<DownloadOutlined />} style={{
                                            backgroundColor: '#02073f',
                                        }} onClick={exportToExcel}>Export</Button>
                                        <Button type="primary" style={{
                                            backgroundColor: '#02073f',
                                        }} size='large' icon={<PlusOutlined />} onClick={() => {
                                            setUserToEdit(null)
                                            showDrawer();
                                        }}>Create User</Button>
                                    </Space>
                                </Col>

                            </Row>
                            <Drawer
                                title={usertoedit? "Update user":"Create a new user"}
                                width={720}
                                onClose={closeDrawer}
                                open={isDrawerVisible}
                                bodyStyle={{

                                    display: 'flex', // Add this
                                    justifyContent: 'center', // Add this
                                    alignItems: 'center',}}
                            >
                                {usertoedit? (
                                    <Form layout="vertical" size="middle"
                                          style={{ width: '70%' }}
                                          onFinish={handleedit}
                           >
                                        <Form.Item
                                            hasFeedback
                                            validateTrigger="onBlur"
                                            name="firstName"
                                            label="firstName"
                                            rules={[{type: 'string', message: 'The input is not valid lastName!'},
                                                { pattern: /^[A-Za-z\s]+$/, message: 'The input is not valid firstName!'}]}


                                        >
                                            <Input placeholder="Please enter the firstName" />
                                        </Form.Item>


                                        <Form.Item
                                            name="lastName"
                                            label="lastName"
                                            hasFeedback
                                            validateTrigger="onBlur"
                                            rules={[
                                                {type: 'string', message: 'The input is not valid lastName!'},
                                                { pattern: /^[A-Za-z\s]+$/, message: 'The input is not valid Name!'}]}


                                        >
                                            <Input
                                                style={{
                                                    width: '100%',
                                                }}

                                                placeholder="Please enter the lastName"
                                            />
                                        </Form.Item>



                                        <Form.Item
                                            name="phoneNumber"
                                            label="phoneNumber"
                                            hasFeedback
                                            validateTrigger="onBlur"
                                            rules={[{len:8,message:'phone number must be 8 digits'}, {
                                                pattern: /^[0-9]{8}$/,
                                                message: 'The input is not valid phone number!',
                                            }]}


                                        >
                                            <Input placeholder="Please enter the phoneNumber" />
                                        </Form.Item>


                                        <Form.Item
                                            name="Email"
                                            label="Email"
                                            hasFeedback
                                            validateTrigger="onBlur"
                                            rules={[
                                                {type: 'email', message: 'The input is not valid E-mail!'}]}
                                        >
                                            <Input placeholder="Please enter the Email" />
                                        </Form.Item>
                                        <Form.Item hasFeedback name="Role" label="Role" >
                                            <Select>
                                                <Select.Option value="admin">admin</Select.Option>
                                                <Select.Option value="Planificateur">Planificateur</Select.Option>
                                                <Select.Option value="ChefProjet">ChefProjet</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item hasFeedback name="Status" label="Status" >
                                            <Select>
                                                <Select.Option value={true}>Active</Select.Option>
                                                <Select.Option value={false}>Inactive</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item style={{display: 'flex', justifyContent: 'center'}}
                                        >
                                            <Space>
                                                <Button onClick={closeDrawer}>Cancel</Button>
                                                <Button htmlType="submit"  style={{
                                                    backgroundColor: '#00488e',
                                                }} type="primary">
                                                    Submit
                                                </Button>
                                            </Space>
                                        </Form.Item>

                                    </Form>
                                ) : (
                                <Form layout="vertical" size="large"
                                      style={{
                                        width: '70%',
                                      }}onFinish={handleFormSubmit} >

                                    <Form.Item
                                        hasFeedback
                                        validateTrigger="onBlur"
                                        name="firstName"
                                        label="firstName"
                                        rules={[{ required: true, message: 'Please input the firstname!' },{type: 'string', message: 'The input is not valid lastName!'},
                                            { pattern: /^[A-Za-z\s]+$/, message: 'The input is not valid firstName!'}]}


                                    >
                                        <Input placeholder="Please enter the firstName" />
                                    </Form.Item>


                                    <Form.Item
                                        name="lastName"
                                        label="lastName"
                                        hasFeedback
                                        validateTrigger="onBlur"
                                        rules={[{ required: true, message: 'Please input the lastname!' }
                                            ,{type: 'string', message: 'The input is not valid lastName!'},
                                            { pattern: /^[A-Za-z\s]+$/, message: 'The input is not valid Name!'}]}


                                    >
                                        <Input
                                            style={{
                                                width: '100%',
                                            }}

                                            placeholder="Please enter the lastName"
                                        />
                                    </Form.Item>



                                    <Form.Item
                                        name="phoneNumber"
                                        label="phoneNumber"
                                        hasFeedback
                                        validateTrigger="onBlur"
                                        rules={[{ required: true, message: 'Please input the phonenumber!' },{len:8,message:'phone number must be 8 digits'}, {
                                            pattern: /^[0-9]{8}$/,
                                            message: 'The input is not valid phone number!',
                                        }]}


                                    >
                                        <Input placeholder="Please enter the phoneNumber" />
                                    </Form.Item>


                                    <Form.Item
                                        name="Email"
                                        label="Email"
                                        hasFeedback
                                        validateTrigger="onBlur"
                                       rules={[{ required: true, message: 'Please input the email!' },
                                           {type: 'email', message: 'The input is not valid E-mail!'}]}
                                    >
                                        <Input placeholder="Please enter the Email" />
                                    </Form.Item>
                                    <Form.Item hasFeedback name="Role" label="Role" rules={[{required:true,message:'the Role is required' }]}>
                                        <Select>
                                            <Select.Option value="admin">admin</Select.Option>
                                            <Select.Option value="Planificateur">Planificateur</Select.Option>
                                            <Select.Option value="ChefProjet">ChefProjet</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item style={{display: 'flex', justifyContent: 'center'}}
                                    >
                                        <Space>
                                            <Button onClick={closeDrawer}>Cancel</Button>
                                            <Button htmlType="submit"  style={{
                                                backgroundColor: '#00488e',
                                            }} type="primary">
                                                Submit
                                            </Button>
                                        </Space>
                                    </Form.Item>

                                </Form>
                                )}
                            </Drawer>                            <Table bordered columns={columns}      dataSource={Data} onChange={onChange}   size="large"/>
                        </Space>
                    </Content>
                </Layout>
            </Layout>
            <Footerr />
        </Layout>
    );
};
export default App;
