import React, {useEffect, useRef, useState} from 'react';
import { PlusOutlined } from '@ant-design/icons';

import {

    QuestionCircleOutlined,

    SearchOutlined,
    CheckCircleOutlined,
    EditTwoTone,
    EyeTwoTone,
    DeleteTwoTone, CheckCircleTwoTone,


} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import {Space, Tooltip, Col, Divider, Drawer, Row, Popconfirm, Input, Button, Tag, Table, message, ConfigProvider} from 'antd';
import './operation.scss'
import axios from "axios";
const Tablee =  (props) => {
    // const [isEditing, setIsEditing] = useState(false);
    const [view, setview] = useState(null);
    const DescriptionItem = ({title, content}) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>)
    const [spinning, setSpinning] = React.useState(false);

    const [open, setOpen] = useState(false);

const [data, setData] = useState([])

    useEffect(() => {
        const showLoader = async () => {
            setSpinning(true);
            setTimeout(() => {
                setSpinning(false);
            }, 500);
        };
        showLoader();
        const fetchOperations = async () => {
            try {
                const newData = await Promise.all(props.operation.map(async (operation) => {
                    return {
                        key: operation.id,
                        name: operation.name,
                        AccessCode: operation.accessCode,
                        site: operation.site.name,
                        Technician: operation.technicians.map(technician => technician.Fullname).join(', '),
                        'Start_Date': operation.startTime.slice(0, 10),
                        End_Date: operation.endTime.slice(0, 10),
                        status: operation.status,
                        responsable: operation.responsable.Fullname,
                        Driver: operation.driver.Fullname,
                        Marche: operation.Marche,
                        responsable_phone: operation.responsable.phoneNumber,
                        Description: operation.Description,
                        Adress: `${operation.site.address}, ${operation.site.state}, ${operation.site.city}`,
                        vehicle: `${operation.vehicle.brand} ${operation.vehicle.model},${operation.vehicle.seats}-seats`,
                        license_plate: operation.vehicle.licensePlate,
                        confirm:operation.status==="Planned"
                    };
                }));
                setData(newData);
            } catch (error) {
                console.error(error);

            }
        };
        fetchOperations();
    }, [props.operation]);
    const handleDelete = async (key) => {
        await axios.delete(`/operation/${key}`)
        const newData = data.filter((item) => item.key !== key);
        setData(newData);
        message.success('Operation deleted');
    };
    const handleConfirm = async (key) => {
        await axios.patch(`/operation/${key}/complete`)
        message.success('Operation Completed');
        setData(data);
    };
    
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
            ...getColumnSearchProps('AccessCode'),
        },
        {
            title: 'Site',
            dataIndex: 'site',
            width: 180,

            ...getColumnSearchProps('site'),

        },
        {
            title: 'Technician',
            dataIndex: 'Technician',
            width: 180,

            ...getColumnSearchProps('Technician'),


        },
        {
            title: 'Start Date',
            dataIndex: 'Start_Date',
            width: "15%",
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
        },


        {
            title: 'status',
            dataIndex: 'status',
            key: 'status',
            width: '5%',
            render: (status) => {
                let color;
                switch (status) {
                    case 'Planned':
                        color = 'blue';
                        break;
                    case 'In Progress':
                        color = 'green';
                        break;
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
                    text: 'Planned',
                    value: 'Planned',
                },
                {
                    text: 'In Progress',
                    value: 'In Progress',
                },
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
            render: (_,record) => {

                return(

                    <Space size="middle">
                        <Tooltip title="more details">
                            <Button icon={<EyeTwoTone/>}  onClick={() => {
                                drower(record);
                            }}/>

                        </Tooltip>
                        <div hidden={props.archive}>
                            <Space size="middle">
                                <Tooltip title="Edit" >
                                    <Button   icon={<EditTwoTone twoToneColor="#7070a9"/>}/>
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

    return (
            <ConfigProvider
                button={{ className: 'my-button' }}

            >
        <div>
            <Drawer width={640} placement="right" closable={true} onClose={onClose} open={open}>
                <p
                    className="site-description-item-profile-p"
                    style={{
                        marginBottom: 24,
                    }}
                >
                    Operation Details
                </p>

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
                    <Popconfirm
                        title="confirm the operation"
                        description="Are you sure to confirm this operation?"
                        onConfirm={() => handleConfirm(view?.key)}
                        okText={"Yes"}
                        icon={<CheckCircleOutlined style={{color: 'green'}}/>}
                    >
                        <Button icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                                type="default" disabled={props.archive||view?.confirm}  size="large">confirm</Button>
                    </Popconfirm>

                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Operation_ID" content={view?.key}/>
                    </Col>
                </Row>
            </Drawer>



            <Table bordered columns={columns} loading={spinning} dataSource={data}  onChange={onChange} size="large"/>

            </div>
                </ConfigProvider>

    )
};
export default Tablee;