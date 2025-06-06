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
    CarOutlined, CheckCircleOutlined,
    ContainerOutlined
    ,SearchOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,  TeamOutlined
} from '@ant-design/icons';
import "./new.scss"

import {Space, Layout, message, theme, Divider,Col,Row,Button, Steps} from 'antd';
import axios from "axios";
import Sidebar from "../../component/sidebar/sidebar"
import Footerr from "../../component/footer/footer"
import Navbar from "../../component/navbar/navbar"
import moment from 'moment-timezone';
import Highlighter from 'react-highlight-words';
import dayjs from "dayjs";
import Cookies from "js-cookie";
const {  Content } = Layout;



const App = () => {
    const location = useLocation();
    const operationn = location.state.operation;
    const moment = require('moment');
const date1=dayjs(operationn.startTime)
const date2=dayjs(operationn.endTime)
    const [generalinfo, setGeneralinfo] = useState({
        name:operationn.name,
        accessCode: operationn.AccessCode,
        Marché: operationn.Marche,
        Site: operationn.sitee._id,
        Date:[date1,date2],
        Description: operationn.Description
    });

    const [techinfo, setTechinfo] = useState({responsable:operationn.responsablee._id,
        driver: operationn.Drivere._id,
        techniciens:operationn.Technician_e
    });
    const [vehinfo, setvehinfo] = useState( {vehicule: operationn.vehiclee._id});
    const [technicians, setTechnicians] = useState(operationn.Technician_ee?operationn.Technician_ee:[]);
    const [tech, settech] = useState([]);
    const [veh, setveh] = useState([]);
    const [Site, setSite] = useState([]);
    const [data, setData] = useState([]);
    const [dataa, setDataa] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState(operationn.Technician_e);
    const [selectedRowKeyss, setSelectedRowKeyss] = useState(operationn.vehiclee._id);
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();
    const next = () => {
        setCurrent(current + 1);
    }
    const onFinishGeneral = (values) => {
        setGeneralinfo(values);
        setSubmitting(true);
    }
    const onFinishtech = (values) => {
        setTechinfo(values);
        setTechinfo(prevState => ({
            ...prevState,
            techniciens: selectedRowKeys,
        }));

        setSubmitting(true);
    }
    const onFinishveh = (values) => {
        console.log(selectedRowKeyss)
        if (selectedRowKeyss.length === 0) {
            message.error('Please select a vehicle');
            return;
        }
        setvehinfo(values);

        setvehinfo(prevState => ({
            ...prevState,
            vehicule: selectedRowKeyss,

        }));
        setSubmitting(true);
    }
    const getDatesBetween = (startDate, endDate) => {
        let datesArray = [];
        let currentDate = startDate;

        while (currentDate <= endDate) {
            datesArray.push(currentDate.format('YYYY-MM-DD'));
            currentDate = currentDate.add(1, 'days');
        }
        return datesArray;
    };
    const gettechnumb = () => {
        if (techinfo.techniciens)
        return (techinfo.techniciens.length)
    }
    useEffect(() => {
        if (!generalinfo) {
            return;

        }
        const requestData = {
             operationDays: getDatesBetween(generalinfo.Date[0], generalinfo.Date[1]),
            operation_id: operationn.key
        }

        const fetchtech = async () => {

            const {data} = await axios.post('https://opti-track-1.onrender.com/tech/availabletech_update', requestData,{
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });

            settech(data);
        };

        fetchtech();

    }, [generalinfo]);
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
                        Fullname: tech.Fullname
                    };
                }));
                setData(newData);
            } catch (error) {
                console.error(error);

            }
        };
        fetchtechs();
    }, [tech]);
    useEffect(() => {
        if (!generalinfo) {
            return;
        }
console.log(tech)
        const driver = tech.find(tech => tech.id === techinfo.driver);

        const driverPermis = driver ? driver.Permis : null;
        console.log(driver)
        const requestDataa = {

             operationDays: getDatesBetween(generalinfo.Date[0], generalinfo.Date[1]),
            technumber:gettechnumb(),
            Permis: driverPermis,
            operation_id: operationn.key
        }


        const fetchveh = async () => {
            const {data} = await axios.post('https://opti-track-1.onrender.com/vehicule/availableveh_update', requestDataa,{
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setveh(data);
        };
        fetchveh();

    }, [techinfo]);
    useEffect(() => {
        if (submitting && generalinfo) {
            next();
            setSubmitting(false);
        }
        if (submitting && techinfo) {

            next();
            setSubmitting(false);
        }
        if (submitting && vehinfo) {

            next();
            setSubmitting(false);
        }
        const fetchSites = async () => {

            const {data} = await axios.get('https://opti-track-1.onrender.com/site',{
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setSite(data);

        };
        fetchSites();


    }, [generalinfo, techinfo, vehinfo, submitting]);


    const options = Site.map((site) => ({
        value: site._id,
        label: `${site.name}(${site.state},${site.city})`,
    }));

    const steps = [
        {
            title: 'General',
            icon: <ContainerOutlined/>,
        },
        {
            title: 'Technicians',
            icon: <TeamOutlined/>,
        },
        {
            title: 'Vehicle',
            icon: <CarOutlined/>
        },
        {
            title: 'confirmation',
            icon: <CheckCircleOutlined/>,
        },
    ];

    const {RangePicker} = DatePicker;
    const {TextArea} = Input;



    useEffect(() => {
        const fetchvehs = async () => {
            try {
                const newDataa = await Promise.all(veh.map(async (veh) => {
                    return {
                        key: veh._id,
                        licensePlate: veh.licensePlate,
                        brand: veh.brand,
                        model: veh.model,
                        seats: veh.seats,
                        year: veh.year,
                        type: veh.type,
                    };
                }));
                setDataa(newDataa);
            } catch (error) {
                console.error(error);

            }
        };
        fetchvehs();
    }, [veh]);

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
    const columns = [
        {
            title: 'firstName',
            dataIndex: 'firstName',
            width: 180,
            ...getColumnSearchProps('firstName'),

        },
        {
            title: 'lastName',
            dataIndex: 'lastName',
            width: "10%",
            ...getColumnSearchProps('lastName'),
        },
        {
            title: 'Email',
            dataIndex: 'Email',
            width: 180,

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
            // width: 180,

            ...getColumnSearchProps('specialization'),


        },
        {
            title: 'Permis',
            dataIndex: 'Permis',
            key: 'Permis',
            width: '5%',
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

    ];
    const columnss = [
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

    ];
    const onSelectChange = (newSelectedRowKeys, selected) => {
        setTechnicians(selected);
        setSelectedRowKeys(newSelectedRowKeys);
        if (techinfo.techniciens && Array.isArray(techinfo.techniciens)) {
            const deselectedTechIds = techinfo.techniciens.filter(techId => !newSelectedRowKeys.includes(techId));

            // Check if the deselected technician is the currently selected driver or responsable
            ['driver', 'responsable'].forEach(role => {
                if (deselectedTechIds.includes(techinfo[role])) {
                    // Update the role field in the techinfo state
                    setTechinfo(prevState => ({
                        ...prevState,
                        [role]: null,
                    }));
                }
            });
        }
    };
    const onSelectChangee = (record) => {
        console.log(record)
        setSelectedRowKeyss(record.key);

    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const rowSelectionn = {
        selectedRowKeyss,
        onSelect: onSelectChangee,
    };
    const optionss=technicians.map((technician) => ({
        value: technician.key,
        label: technician.Fullname,
    }));

    const DescriptionItem = ({title, content}) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>)

    function EditOperation() {
        const operation = {
            name: generalinfo.name,
            accessCode: generalinfo.accessCode,
            Marche: generalinfo.Marché,
            site: generalinfo.Site,
            operationDays: (generalinfo.Date[0]===moment(operationn.startTime)?getDatesBetween(operationn.startTime, operationn.endTime):getDatesBetween(generalinfo.Date[0], generalinfo.Date[1])),
            startTime: generalinfo.Date[0],
            endTime: generalinfo.Date[1],
            Description: generalinfo.Description,
            responsable: techinfo.responsable,
            driver: techinfo.driver,
            technicians: techinfo.techniciens,
            vehicle: vehinfo.vehicule,
        };
        message.loading('updating operation...', 3)

        axios.patch(`https://opti-track-1.onrender.com/operation/op/${operationn.key}`, operation,{
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        })
            .then((response) => {
                message.success('Operation updated successfully');
                navigate('/');
            })

    }

    function Confirmation() {
        const operation = {
            name: generalinfo.name,
            accessCode: generalinfo.accessCode,
            Marche: generalinfo.Marché,
            site: Site.find(site => site._id === generalinfo.Site)?.name,
            startTime: generalinfo.Date[0],
            endTime: generalinfo.Date[1],
            Description: generalinfo.Description,
            responsable: technicians.find(tech => tech.key === techinfo.responsable)?.Fullname,
            Driver: technicians.find(tech => tech.key === techinfo.driver)?.Fullname,
            technicians: techinfo.techniciens.map(techId => technicians.find(tech => tech.key === techId)?.Fullname),
            vehicle: veh.find(vehicle => vehicle._id === vehinfo.vehicule)?.licensePlate,
        };
        const technicianNames = operation.technicians.map(name => name).join(', ');
        return (
            <div>
                <p
                    className="site-description-item-profile-p"
                    style={{
                        marginBottom: 15,
                    }}
                >
                    <h3>Operation Details</h3>
                </p>

                <Row>
                    <Col span={13} >
                        <DescriptionItem title=" Name" content={operation.name}/>
                    </Col>
                    <Col >
                        <DescriptionItem title="AccessCode" content={operation.accessCode}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Marche" content={operation.Marche}/>
                    </Col>

                </Row>
                <Row>
                    <Col span={13}>
                        <DescriptionItem title="Start Date" content={operation.startTime.format('YYYY-MM-DD HH:mm')}/>
                    </Col>
                    <Col >
                        <DescriptionItem title="End Date" content={operation.endTime.format('YYYY-MM-DD HH:mm')}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Site" content={operation.site}/>
                    </Col>

                </Row>
                <Row>
                    <Col span={24}>
                        <DescriptionItem
                            title="Description"
                            content={operation.Description}
                        />
                    </Col>
                </Row>
                <Divider/>
                <p className="site-description-item-profile-p"><h3>Members</h3></p>
                <Row>
                    <Col >
                        <DescriptionItem title="Technician" content={technicianNames}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={19}>
                        <DescriptionItem title="Responsable" content={operation.responsable}/>
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Driver" content={operation.Driver}/>
                    </Col>

                </Row>



                <Divider/>
                <p className="site-description-item-profile-p"><h3>Vehicle</h3></p>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="licencePlate" content={operation.vehicle}/>
                    </Col>

                </Row>
                <Flex  justify="space-around" >
                    {current > 0 && (
                        <Button
                            curee       style={{
                            margin: '0 8px',
                        }}
                            onClick={() => prev()}
                        >
                            Previous
                        </Button>
                    )}

                    {current < steps.length - 1 && (
                        <Button type="primary" htmlType="submit">
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={EditOperation}>
                            Done
                        </Button>
                    )}
                </Flex>
            </div>
        ) ;
    }
    const GeneralForm= ({onFinish,initialvalue}) => {

        return (
            <Form onFinish={onFinish}
                  initialValues={initialvalue}
                  size="large"
                  labelCol={{
                      span: 5,
                  }}
                  wrapperCol={{
                      span: 16,
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
                <Form.Item  hasFeedback name="accessCode" label="AcessCode" rules={[
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
                    <RangePicker showTime format="YYYY-MM-DD HH:mm" />
                </Form.Item>
                <Form.Item hasFeedback name="Description" label="Description">
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
                        <Button type="primary" htmlType="submit">
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
    const TechForm= ({onFinish,initialvalue}) => {

        return (
            <Form onFinish={onFinish}
                  initialValues={initialvalue}
                  size="large"
                  labelCol={{
                      span: 4,
                  }}
                  wrapperCol={{
                      span: 15,
                  }}
                  layout="horizontal"
                  style={{
                      maxWidth: 800,

                  }}
            >
                <Form.Item label="responsable" name="responsable" rules={[
                    {
                        required: true,
                    },
                ]}>

                    <Select hasFeedback showSearch  placeholder="Search to Select"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())} options={optionss} />

                </Form.Item>
                <Form.Item label="driver" name="driver" rules={[
                    {
                        required: true,
                    },
                ]}>

                    <Select hasFeedback showSearch  placeholder="Search to Select"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())} options={optionss} />

                </Form.Item>
                <Form.Item name="techniciens">
                    <Table bordered columns={columns}  rowSelection={{...rowSelection, hideSelectAll:true}} dataSource={data} size="large"/>
                </Form.Item>
                <Flex  justify="space-between" style={{marginLeft:"1px"
                }} >
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
                        <Button type="primary" htmlType="submit" >
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
    const VehiculeForm= ({onFinish,initialvalue}) => {

        return (
            <Form  onFinish={onFinish}
                   initialValues={initialvalue}
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

                <Form.Item  name="vehicule"
                >


                    <Table bordered columns={columnss}  rowSelection={{...rowSelectionn,type: "radio", hideSelectAll:true}} dataSource={dataa} size="large"/>


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
                        <Button type="primary" htmlType="submit">
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



    const forms = [
        <GeneralForm onFinish={onFinishGeneral} initialvalue={generalinfo}/>,
        <TechForm onFinish={onFinishtech} initialvalue={techinfo} />,
        <VehiculeForm onFinish={onFinishveh} initialvalue={vehinfo}/>,
        <Confirmation/>
    ]
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [collapsed, setCollapsed] = useState(false);

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
                            <Flex justify="center" >
                                <div style={{ marginTop:50 }} >
                                    {forms[current]}
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