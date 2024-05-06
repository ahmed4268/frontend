
import React, { useEffect, useRef, useState} from 'react';
import {Menu, message, Timeline} from "antd";
import {
    AppstoreTwoTone, CarOutlined, CloseOutlined, LoginOutlined, LogoutOutlined,
    TeamOutlined, UserOutlined,

} from '@ant-design/icons';
import maplibregl, {Popup} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { theme,Spin } from 'antd';
import axios from "axios";
import Sidebar from "../../component/sidebar/sidebar"
import Navbar from "../../component/navbar/navbar"
import "./tracking.scss"
import dayjs from "dayjs";
import Cookies from "js-cookie";



const App = () => {
    const [isPanel2Visible, setIsPanel2Visible] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState('');
    const [devicesLocations, setDevicesLocations] = useState([]);
    const [eventsData, setEventsData] = useState([]);
    const colors = ['#f30000', '#24a806', '#1890ff', '#fa541c', '#722ed1', '#13c2c2', '#fadb14', '#a0d911', '#fa8c16', '#eb2f96'];
    const[Operation, setOperation]=useState([]);
    const[items, setitems]=useState([]);
    const credentials = btoa('mohamedouesalti080@gmail.com:RZedi!Z9MpqnF@K');
    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);

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
                zoom: 15,
            });

            mapInstance.on('load', () => {
                new maplibregl.Marker({
                    color: "#27aac7",
                })
                    .setLngLat([10.210557325592731,36.8530881166092])
                    .setPopup(new Popup({ offset: 25 })
                        .setHTML('<h3>Sotetel</h3>'))
                    .addTo(mapInstance);
            });
            setMap(mapInstance);
        }
        return () => {
            if (mapInstance) {
                mapInstance.remove();
            }
        };
    }, []);


    useEffect(() => {
        const fetchOperations = async () => {
            const { data } = await axios.get('https://opti-track-1.onrender.com/operation/map',{
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setOperation(data);
            fetchitems(data);
            console.log(data)
        };

        const fetchitems = async (Operation) => {
            try {
                let itemss = await Promise.all(Operation.map((operation,index) => {
                    const color = colors[index % colors.length];
                    const operationItems =
                        getItem(operation.name, operation.id, <AppstoreTwoTone twoToneColor={color}/>,[
                                getItem('Vehicle', operation.vehicle._id,null,  [getItem(`${operation.vehicle.brand} ${operation.vehicle.model} ${operation.vehicle.licensePlate}`,operation.vehicle._id,<CarOutlined />,null,null,operation.vehicle.device,true,color,operation.startTime,operation.endTime)], 'group'),
                                getItem('Responsable',operation.responsable.id, null,[getItem(operation.responsable.Fullname,operation.responsable.id,<UserOutlined />,null,null,operation.responsable.device,false,color,operation.startTime,operation.endTime)], 'group'),
                                getItem('technicians', null, <TeamOutlined />,operation.technicians.map((technician) => {
                                    return getItem(technician.Fullname, technician.id,null,null,null,technician.device,false,color,operation.startTime,operation.endTime)
                                })),
                            ],

                        )


                    return operationItems;
                }));
                itemss = itemss.reduce((acc, item, index) => {
                    if (index !== 0) {
                        acc.push({ type: 'divider' });
                    }
                    acc.push(item);
                    return acc;
                }, []);

                setitems(itemss);

            } catch (error) {
                console.error(error);
            }
        }
        console.log(items)
        fetchOperations();
    }, []);
    const [markerr, setMarker] = useState(null);
    const [itemss, setitemss] = useState(null);

    const Sotetel = [10.210557325592731,36.8530881166092];
    useEffect(() => {
        const fetchDevicesLocations = async () => {
            try {
                const response = await axios.get('https://demo4.traccar.org/api/positions', {
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    }
                });
                setDevicesLocations(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDevicesLocations();

        const intervalId = setInterval(fetchDevicesLocations, 2 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);


    const moveMapToLocationAndAddMarker = (location, name, color,isCar) => {
        if (!mapref.current) {
            console.error('Map object is not defined');
            return;
        }

        mapref.current.flyTo({
            center: [location.longitude,location.latitude],
            zoom: 15
        });
        const markerHtml = isCar ?
            `<div><img src="/car%20(1).png" alt="Car" style="color:${color}"/></div>` :
            `<div><img src="/car%20(2).png" alt="Technician" style="color:${color}" /></div>`;

        const el = document.createElement('div');
        el.innerHTML = markerHtml;


        const marker = new maplibregl.Marker(el)
            .setLngLat([location.longitude, location.latitude])
            .setPopup(new Popup({ offset: 25 })
                .setHTML(`<h4>${name}</h4>`))



        marker.addTo(mapref.current);
        setMarker(marker);
    }
    const markerref = useRef(markerr);
    useEffect(() => {
        markerref.current = markerr;
    }, [markerr]);



    const devicesLocationsRef = useRef([]);
    const mapref = useRef([]);

    useEffect(() => {
        devicesLocationsRef.current = devicesLocations;
    }, [devicesLocations]);
    useEffect(() => {
        mapref.current = map;
    }, [map]);
    const onDeviceClick = async (deviceId,name,color,iscar,startdate,enddate) => {
if (!deviceId)
    return;
        let location;
        if(devicesLocationsRef.current) {
            location = await devicesLocationsRef.current.find(device => device.deviceId === deviceId);
        }

    if (!location) {
        message.error('no data found');
        return;
    }


        if (iscar){
            setIsCar(true);
            setSpeed(location.speed);
        }
        else{
            setIsCar(false);
            setbatteryLevel(location.attributes.batteryLevel)
        }

        if (markerref.current) {
            markerref.current.remove();
            setMarker(null);
        }

        let startdateObj = dayjs(startdate);
        let enddateObj = dayjs(enddate);

// Add an hour
        startdateObj = startdateObj.add(1, 'hour');
        enddateObj = enddateObj.add(1, 'hour');

// Convert back to ISO 8601 strings if needed
        startdate = startdateObj.toISOString();
        enddate = enddateObj.toISOString();
        // addMarker([10,0])
        moveMapToLocationAndAddMarker(location, name, color,iscar);
        console.log(`https://demo4.traccar.org/api/reports/events?deviceId=${deviceId}&from=${startdate}&to=${enddate}&type=deviceOnline&type=geofenceEnter&type=geofenceExit`)
        try {
            const response = await axios.get(`https://demo4.traccar.org/api/reports/events?deviceId=${deviceId}&from=${startdate}&to=${enddate}&type=deviceOnline&type=geofenceEnter&type=geofenceExit`, {
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });
            const events = response.data;
            const timelineItems = events.map(event => {
                if (event.type === 'deviceOnline') {
                    return {
                        children: `${event.type} at ${(dayjs(event.eventTime
                        )).format("YYYY-MM-DD HH:mm")}`,
                        color: 'green',
                    };
                } else if (event.type === 'geofenceEnter') {
                    return {
                        dot: (
                            <LoginOutlined
                                style={{
                                    fontSize: '16px',
                                }}
                            />
                        ),
                        children: `Entered the geofence at ${(dayjs(event.eventTime
                        )).format("YYYY-MM-DD HH:mm")}`,
                    };
                } else  {
                    return {
                        dot: (
                            <LogoutOutlined
                                style={{
                                    fontSize: '16px',
                                    color: 'red'
                                }}
                            />
                        ),
                        children: `Exit the geofence at ${(dayjs(event.eventTime
                        )).format("YYYY-MM-DD HH:mm")}`,
                    };
                }
            });
            setitemss(timelineItems);
        } catch (error) {
            console.error(error);
        }
    };
    const [iscar, setIsCar] = useState(false);
    const [speed, setSpeed] = useState(0);
    const [batteryLevel, setbatteryLevel] = useState(0);


    const [spinning, setSpinning] = useState(true);

    setTimeout(() => {
        setSpinning(false);
    }, 2000);


    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [collapsed, setCollapsed] = useState(false);
    function getItem(label, key,icon,children, type,device,iscar,color,startdate,enddate){

        return {
            key,
            icon,
            children,
            label,
            type,
            device,
            iscar,
            color,
            startdate,
            enddate,
            onClick: () => {
                onDeviceClick(device,label,color,iscar,startdate,enddate);
                setSelectedOperation(label);
                setIsPanel2Visible(true);
            }
        };

    }
    return (

        <div className="map-container">
            <Spin spinning={spinning} fullscreen />



            <div className="navbar">
                <Navbar/>
            </div>
            <div className="aze">

                <div className="sidebar">
                    <Sidebar collapsed={true}/>
                </div>

            </div>
            <div className="panel1">
                <h3 className="h3">
                    Active Operations
                </h3>
                {items && items.length >  0 ? (
                    <Menu className="scrollable-menu"
                          style={{
                              fontSize: '16px',
                              width: 300,
                              padding:'14px',
                              borderRadius: '14px'
                          }}
                          mode="inline"
                          items={items}
                    />
                ) : (
                    <p>No active operations at the moment.</p>
                )}
            </div>
            {isPanel2Visible && (
                <div className="panel-2">
                    <button className="close-button" onClick={() => setIsPanel2Visible(false)}><CloseOutlined /></button>
                    <h3 className="h3">
                        Operation Details
                    </h3>
                    <div className="speed">
                        <h4 className="h4" >{iscar ? "Current Speed" : "Battery Level"}</h4>
                        <h5 className="h5">{iscar ? `${speed} km/h` : `${batteryLevel}%`}</h5>
                    </div>
                    <div className="timeline" id="style-8">
                        Timeline
                        {itemss && itemss.length > 0 ? (
                        <Timeline
                            style={{
                                padding: '16px',
                            }}
                            items={itemss}
                        />
                        ) : (
                            <p>No events at the moment.</p>
                        )}
                    </div>
                </div>
            )}

            <div id="map" className="map">
                <div style={{ width: '100%', height: '100vh' }}>

                    <div ref={mapContainer} style={{width: '100%', height:'100%'}}/>
                </div>
            </div>

        </div>



    );
};


export default App;