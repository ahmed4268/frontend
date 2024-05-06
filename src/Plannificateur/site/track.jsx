

import React, { useEffect, useRef, useState} from 'react';
import {
    Avatar,
    Button,
    ConfigProvider,
    DatePicker,
    Menu,
    message,
    Popconfirm,
    Skeleton,
    Space,
    Timeline,
    Tooltip
} from "antd";
import { SearchOutlined } from '@ant-design/icons';
import {
    CarOutlined,
    CloseOutlined,
    CompassOutlined, DeleteTwoTone, EditTwoTone,
    EnvironmentOutlined,
    LoginOutlined,
    LogoutOutlined, PlusCircleOutlined, PlusOutlined, PlusSquareOutlined,
    QuestionCircleOutlined,
    TeamOutlined,
    UserOutlined,

} from '@ant-design/icons';
import { FeatureGroup } from 'react-leaflet';

import { Radio } from 'antd';
// import 'leaflet-draw/dist/leaflet.draw.css';
import Wkt from 'terraformer-wkt-parser';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Form, Input,List } from 'antd';
import { theme,Spin } from 'antd';
import axios from "axios";
import Navbar from "../../component/navbar/navbar";
import Sidebar from "../../component/sidebar/sidebar";
import "./track.css"
import VirtualList from 'rc-virtual-list';

import dayjs from "dayjs";
import {useLocation} from "react-router-dom";
import Cookies from "js-cookie";



const App = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const [isPanel2Visible, setIsPanel2Visible] = useState(false);
    const credentials = btoa('mohamedouesalti080@gmail.com:RZedi!Z9MpqnF@K');
    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);
    const [update, setupdate] = useState(false);
    const [spinning, setSpinning] = useState(true);
    const [reload, setreload] = useState(false);
    const [reload1, setreload1] = useState(false);
    const [data, setData] = useState(null);
    const [site, setSite] = useState(null);
    const [form] = Form.useForm();
    const [polygon, setPolygon] = useState(null);
    const [draw, setDraw] = useState(null);
    MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
// @ts-ignore
    MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
// @ts-ignore
    MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";

    const polygonRef = useRef(polygon);
    useEffect(() => {
        polygonRef.current = polygon;
    }, [polygon]);
    const reloadRef = useRef(reload);
    useEffect(() => {
        reloadRef.current = reload;
    }, [reload]);
    const reload1Ref = useRef(reload1);
    useEffect(() => {
        reload1Ref.current = reload1;
    }, [reload1]);
    const drawRef = useRef(data);
    useEffect(() => {
        drawRef.current = data;
    }, [data]);
    setTimeout(() => {
        setSpinning(false);
    }, 2000);

    useEffect(() => {

        const fetchsite = async () => {

            const { data } = await axios.get('/site',{
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setSite(data);
            console.log(data)

        };
        fetchsite();
        setreload1(false);
    }, [reload1]);

    useEffect(() => {


        axios.get('https://demo4.traccar.org/api/geofences', {
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Basic ' + btoa('mohamedouesalti080@gmail.com:RZedi!Z9MpqnF@K')
            },
        })
            .then(response => {
                setData(response.data);
                console.log('Geofencing data:', response.data); // This will log the geofencing data to the console
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        setreload(false);
    }, [reloadRef.current]);

    useEffect(() => {
        if (map && drawRef.current) {
            drawRef.current.forEach((geofence, index) => {
                // Parse the WKT string to get the coordinates
                const wktObject = Wkt.parse(geofence.area);
                const coordinates = wktObject.coordinates[0].map(coord => [coord[1], coord[0]]); // Swap lat and lon

                // Add a polygon layer to the map for the geofence
                map.addLayer({
                    id: `geofence-${index}`,
                    type: 'fill',
                    source: {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [coordinates],
                            },
                        },
                    },
                    paint: {
                        'fill-color': '#6e6ebb', // Change this to the desired color
                        'fill-opacity': 0.6,
                    },
                });

                // Add a popup to the map for the geofence
                new maplibregl.Popup({
                    closeOnClick: false,
                    closeButton: false,
                })
                    .setLngLat(coordinates[0])
                    .setHTML(`<p>${geofence.name}</p>`)
                    .addTo(map);
            });
        }
    }, [map, drawRef.current]);

    const handleEdit = (id) => {
        // Find the record using the id
        setupdate(true)
        const recordToEdit = site.find(item => item._id === id);

        if (recordToEdit) {
            // Populate the form with the record's current values
            form.setFieldsValue({
                name: recordToEdit.name,
                state: recordToEdit.state,
                city: recordToEdit.city,
                address: recordToEdit.address,
                geofence: recordToEdit.geofence,
                id: id,
            });

            // Show the form
            setIsPanel2Visible(true);
        } else {
            message.error('Failed to find the record to edit.');
        }
    };

    const onFinish = async (values) => {
        let latSum = 0, lonSum = 0;
        if(!polygonRef.current) {
            message.error('Please draw the new geofence on the map.');
            return;
        }
        polygonRef.current.forEach(coord => {
            latSum += coord[0];
            lonSum += coord[1];
        });
        const center = [latSum / polygonRef.current.length, lonSum / polygonRef.current.length];
        if(!update) {

            axios.post('https://demo4.traccar.org/api/geofences', {
                name: values.name,
                description: values.description,
                area: `POLYGON ((${polygonRef.current.map(coord => coord.join(' ')).join(', ')}))`,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + credentials,
                },
            })
                .then(async response => {
                    console.log('Geofence created:', response.data);
                    await axios.post('/site', {
                        name: values.name,
                        state: values.state,
                        city: values.city,
                        address: values.address,
                        latitude: center[1],
                        longitude: center[0],
                        geofence: response.data.id,

                    }, {
                        headers: {
                            Authorization: `Bearer ${Cookies.get('token')}`,
                        },
                    })
                        .then(response => {
                            console.log('Site created:', response.data);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                    message.success('Geofence created successfully.');
                    form.resetFields();
                    setIsPanel2Visible(false);
                    setreload(true);
                    setreload1(true);
                    setPolygon(null);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    message.error('Failed to create geofence.');
                });
        }else {
            console.log('updating geofence...');
console.log('values',values)
            console.log(`https://demo4.traccar.org/api/geofences/${values.geofence}`)
            axios.put(`https://demo4.traccar.org/api/geofences/${values.geofence}`, {
                id: values.geofence,
                name: values.name,
                area: `POLYGON ((${polygonRef.current.map(coord => coord.join(' ')).join(', ')}))`,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + credentials,
                },
            })
                .then(response => {
                    console.log('Geofence updated:', response.data);
                    axios.patch(`/site/${values.id}`, {
                        name: values.name,
                        state: values.state,
                        city: values.city,
                        address: values.address,
                        latitude: center[1],
                        longitude: center[0],
                        geofence: response.data.id,

                    },{
                        headers: {
                            Authorization: `Bearer ${Cookies.get('token')}`,
                        },
                    })
                        .then(response => {
                            console.log('Site updated:', response.data);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                    message.success('Geofence updated successfully.');
                    form.resetFields();
                    setIsPanel2Visible(false);
                    setreload(true);
                    setreload1(true);
                    setPolygon(null);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    message.error('Failed to update geofence.');
                });
        }
    };
    useEffect(() => {

        let mapInstance;
        if (mapContainer.current) {
            mapInstance = new maplibregl.Map({
                container: mapContainer.current,
                style: {
                    version: 8,
                    sources: {
                        'google-tiles': {
                            type: 'raster',
                            tiles: ['https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga',
                                'https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga',
                                'https://mt2.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga',
                                'https://mt3.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga'],
                            tileSize: 256,
                        },
                    },
                    layers: [{
                        id: 'google-layer',
                        type: 'raster',
                        source: 'google-tiles',
                    }],
                },
                center: [10.210557325592731,36.8530881166092],
                zoom: 11,
            });
            mapInstance.on('load', () => {
                    const drawInstance = new MapboxDraw({
                        displayControlsDefault: false,
                        controls: {
                            polygon: true,
                            trash: true
                        }
                    });
                    mapInstance.addControl(drawInstance, 'bottom-right');

                    const updateArea = () => {
                        const data = drawInstance.getAll();
                        console.log("data",data)
                        if (data.features.length > 0) {
                            console.log('Data:', data);
                            const coordinates = data.features[0].geometry.coordinates[0].map(coord => [coord[1], coord[0]]); // Swap lat and lon
                            console.log('Coordinates:',coordinates);
                            setPolygon(coordinates);
                            setIsPanel2Visible(true);
                            console.log('Polygon:', coordinates);
                            console.log(isPanel2Visible);

                        } else {
                            setPolygon(null);

                        }
                        drawInstance.deleteAll()
                    }

                    mapInstance.on('draw.create', updateArea);
                drawInstance.changeMode('direct_select', {
                    featureId: 'your-feature-id'
                });
            })
            

            setMap(mapInstance);
        }
        return () => {
            if (mapInstance) {
                mapInstance.remove();
            }
        };
    }, []);

    const mapref = useRef([]);

    useEffect(() => {
        mapref.current = map;
    }, [map]);
    useEffect(() => {
        if (polygon)
        setIsPanel2Visible(true);

    }, [polygon]);
    const validateName = (rule, value) => {
        if (site.some(item => item.name === value)) {
            return Promise.reject('This name is already in use!');
        }
        return Promise.resolve();
    };

    // setTimeout(() => {
    //     setSpinning(false);
    // }, 2000);


    return (

        <div className="map-container">
            <Spin spinning={spinning}  fullscreen />

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
                        <button className="close-button" onClick={() => {
                            setIsPanel2Visible(false);
                            form.resetFields();
                        }}><CloseOutlined /></button>
                        <h3 className="h3">
                            Details
                        </h3>
                        <Form className="form" form={form} layout="vertical"
                              requiredMark={false}
                              onFinish={onFinish}>
                            <Form.Item
                                name="name"
                                label="Name"
                                hasFeedback
                                validateTrigger="onBlur"
                                rules={[
                                    { required: true, min:5, max:15, type:'string', message: 'Please input the name of the geofence!' },
                                    { validator: validateName }
                                ]}
                            >
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