import 'maplibre-gl/dist/maplibre-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import maplibregl from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {message, Form, Input, Button, Spin, ConfigProvider, Space, List, Tooltip, Popconfirm} from 'antd';
import Navbar from "../../component/navbar/navbar";
import Sidebar from "../../component/sidebar/sidebar";
import {
    CloseOutlined,
    DeleteTwoTone,
    EditTwoTone,
    EnvironmentOutlined,
    QuestionCircleOutlined,
    SearchOutlined
} from "@ant-design/icons";

const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        trash: true
    }
});

const App = () => {
    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);
    const [polygon, setPolygon] = useState(null);
    const [isPanel2Visible, setIsPanel2Visible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (mapContainer.current) {
            const mapInstance = new maplibregl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [10.210557325592731,36.8530881166092],
                zoom: 11,
            });

            mapInstance.on('load', () => {
                mapInstance.addControl(draw, 'top-right');
            });

            setMap(mapInstance);
        }

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, []);

    useEffect(() => {
        const updateArea = () => {
            const data = draw.getAll();
            if (data.features.length > 0) {
                const coordinates = data.features[0].geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
                setPolygon(coordinates);
                setIsPanel2Visible(true);
            } else {
                setPolygon(null);
            }
            draw.deleteAll();
        };

        if (map) {
            map.on('draw.create', updateArea);
        }

        return () => {
            if (map) {
                map.off('draw.create', updateArea);
            }
        };
    }, [map]);

    const onFinish = async (values) => {
        if (!polygon) {
            message.error('Please draw the new geofence on the map.');
            return;
        }

        const newItem = {
            name: values.name,
            state: values.state,
            city: values.city,
            address: values.address,
            area: `POLYGON ((${polygon.map(coord => coord.join(' ')).join(', ')}))`,
        };

        try {
            const response = await axios.post('/api/geofences', newItem, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                },
            });

            if (response.status === 200) {
                message.success('Geofence created successfully.');
                form.resetFields();
                setIsPanel2Visible(false);
                setPolygon(null);
            } else {
                throw new Error('Failed to create geofence.');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Failed to create geofence.');
        }
    };

    return (
        <div className="map-container">
            {/*<Spin spinning={spinning}  fullscreen />*/}

            <ConfigProvider
                theme={{
                    components: {
                        Radio: { radioSize: 18,
                            fontSize:15
                            /* here is your component tokens */
                        },
                    },
                }}
            >


                <div className="navbar">
                    <Navbar/>
                </div>
                <div className="aze">

                    <div className="sidebar">
                        <Sidebar collapsed={true}/>
                    </div>

                </div>
                <div className="panel">
                    <Space className="title" size="large">
                        <h3 className="h3">

                        </h3>
                    </Space>
                    <div className="search">
                        <Input
                            size="large"
                            placeholder="Search"
                            prefix={<SearchOutlined />}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="listcontainer">
                        <div className="list">
                            <List

                                dataSource={site && site.length > 0 ? site.filter(item =>
                                    item.name.includes(searchTerm) ||
                                    item.state.includes(searchTerm) ||
                                    item.address.includes(searchTerm) ||
                                    item.city.includes(searchTerm)
                                ) : []}                        renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <Tooltip title="check geofence">
                                            <Button  icon={<EnvironmentOutlined />} onClick={() => {
                                                map.flyTo({
                                                    center: [item.latitude,item.longitude],
                                                    zoom: 15,
                                                });
                                            }}/>
                                        </Tooltip>,
                                        <Tooltip title="Edit" >
                                            <Button   icon={<EditTwoTone twoToneColor="#7070a9"/>} onClick={() =>

                                                handleEdit(item._id)}
                                            />
                                        </Tooltip>,
                                        <Tooltip title="Delete">
                                            <Popconfirm
                                                title="Delete the operation"
                                                description="Are you sure to delete this task?"
                                                onConfirm={async () => {
                                                    try {
                                                        await Promise.all([
                                                            axios.delete(`/site/${item._id}`,{
                                                                headers: {
                                                                    Authorization: `Bearer ${Cookies.get('token')}`,
                                                                },
                                                            }),
                                                            axios.delete(`https://demo4.traccar.org/api/geofences/${item.geofence}`, {
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                    'Authorization': 'Basic ' + credentials,
                                                                }
                                                            })
                                                        ]);
                                                        console.log('Site and Geofence deleted');
                                                        message.success('Site deleted successfully.');
                                                        setreload(true);
                                                        setreload1(true);
                                                    } catch (error) {
                                                        console.error('Error:', error);
                                                        message.error('Failed to delete site.');
                                                    }
                                                }}
                                                icon={<QuestionCircleOutlined style={{color: 'red'}} />}
                                            >
                                                <Button icon={<DeleteTwoTone twoToneColor="#ff1616"/>}/>
                                            </Popconfirm>

                                        </Tooltip>

                                    ]}
                                >
                                    <List.Item.Meta
                                        title={item.name}
                                        description={`${item.address} ${item.city} ${item.state}`}
                                    />


                                </List.Item>
                            )}
                            />
                        </div>
                    </div>



                    <div className="location">
                    </div>
                </div>
                {isPanel2Visible && (
                    <div className="panel-2">
                        <button className="close-button" onClick={() => setIsPanel2Visible(false)}><CloseOutlined /></button>
                        <h3 className="h3">
                            Details
                        </h3>
                        <Form className="form" form={form} layout="vertical"
                              requiredMark={false}
                              onFinish={onFinish}>
                            <Form.Item name="name" label="Name"  hasFeedback validateTrigger="onBlur"
                                       rules={[{ required: true,min:5,max:15,type:'string', message: 'Please input the name of the geofence!' }]}>
                                <Input placeholder="Name" />
                            </Form.Item>
                            <Form.Item name="id" hidden></Form.Item>
                            <Form.Item name="geofence" hidden></Form.Item>

                            <Form.Item name="state" label="state"  hasFeedback validateTrigger="onBlur" rules={[{ required: true,min:5,max:15,type:'string', message: 'Please input the state of the geofence!' }]}>
                                <Input placeholder="State" />
                            </Form.Item>
                            <Form.Item name="city" label="city" hasFeedback  validateTrigger="onBlur" rules={[{ required: true,min:5,max:15,type:'string', message: 'Please input the city of the geofence!' }]}>
                                <Input placeholder="City" />
                            </Form.Item>

                            <Form.Item name="address" label="address"  hasFeedback validateTrigger="onBlur" rules={[{ required: true, min:10,max:40,type:'string',message: 'Please input the address of the geofence!' }]}>
                                <Input placeholder="Address" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" className="subb" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                )}

                <div id="map" className="map">
                    <div style={{ width: '100%', height: '100vh' }}>

                        <div ref={mapContainer} style={{width: '100%', height:'100%'}}/>
                    </div>
                </div>
            </ConfigProvider>
        </div>
    );

};

export default App;