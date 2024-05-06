
import React, { useEffect, useRef, useState} from 'react';
import {Menu, message, Timeline} from "antd";
import {
   CarOutlined, CloseOutlined, LoginOutlined, LogoutOutlined,
    TeamOutlined, UserOutlined,

} from '@ant-design/icons';
import maplibregl, { Popup} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';


import { theme,Spin } from 'antd';
import axios from "axios";
import Sidebar from "../../component/sidebar/sidebar"
import Navbar from "../../component/navbar/navbar"
import "./tracking.css"
import dayjs from "dayjs";
import {useLocation} from "react-router-dom";



const App = () => {
    const [isPanel2Visible, setIsPanel2Visible] = useState(false);
    const[items, setitems]=useState([]);
    const [startMarker, setStartMarker] = useState(null);
    const [endMarker, setEndMarker] = useState(null);
    const credentials = btoa('mohamedouesalti080@gmail.com:RZedi!Z9MpqnF@K');
    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);
    const [spinning, setSpinning] = useState(true);
    const [deviceData, setDeviceData] = useState({});
    const [steps, setSteps] = useState([]);
    const deviceDataRef = useRef(deviceData);
    useEffect(() => {
        deviceDataRef.current = deviceData;
    }, [deviceData]);
    const stepsRef = useRef(steps);
    useEffect(() => {
        stepsRef.current = steps;
    }, [steps]);

    const location = useLocation();
    const operation = location.state.operation;
    setTimeout(() => {
        setSpinning(false);
    }, 7000);
    const startMarkerRef = useRef(startMarker);
    const endMarkerRef = useRef(endMarker);
    useEffect(() => {
        startMarkerRef.current = startMarker;
    }, [startMarker]);

    useEffect(() => {
        endMarkerRef.current = endMarker;
    }, [endMarker]);

    useEffect(() => {
        const devices = [operation.vehicle, ...operation.technicians];
        const startTime = operation.startTime;
        const endTime = operation.endTime;
        devices.forEach(device => {
            const deviceId = device.device;

console.log(`https://demo4.traccar.org/api/positions?deviceId=${deviceId}&from=${startTime}&to=${endTime}`)
            fetch(`https://demo4.traccar.org/api/positions?deviceId=${deviceId}&from=${startTime}&to=${endTime}`, {
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            })
                .then(response => response.json())
                .then(data => {

                    if (data&&data.length === 0) {
                        message.error('No position data ');
                        return;
                    }

                    let a=2;
                    console.log(data.length)
                    if (data.length >= 15 && data.length < 40) {
                        a = 2;
                    } else if (data.length >= 40 && data.length < 100) {
                        a = 4;
                    } else if (data.length >= 100 && data.length < 300) {
                        a = 6;
                    } else if (data.length >= 300) {
                        a = 12;
                    }
                    const extractedData = data
                        .filter((_, index) => index % a === 0)
                        .reduce((acc, item) => {
                            if (!acc[deviceId]) {
                                acc[deviceId] = [];
                            }
                            acc[deviceId].push({
                                fixTime: item.fixTime,
                                coordinates: [item.longitude, item.latitude]
                            });
                            return acc;
                        }, {});

                    setSteps(prevSteps => ({...prevSteps, ...extractedData}));
                    const waypoints = data
                        .filter((_, index) => index % a === 0)
                        .map(item => `${item.latitude},${item.longitude}`);
                    const waypointsString = waypoints.join('|');
                    setDeviceData(prevState => ({
                        ...prevState,
                        [deviceId]: waypointsString
                    }));
                })
                .catch(error => console.error(error));
        });
    }, []);
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

                mapInstance.addSource('points', {
                    type: 'geojson',
                    data: {
                        type: "FeatureCollection",
                        features: []
                    }
                });

            });
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
    function processRoute(waypointsString,deviceId) {
        if (!waypointsString) {
            console.error('waypointsString is undefined');
            return;
        }
        const deviceSteps = stepsRef.current[deviceId];
        if (!deviceSteps) {
            console.error(`No steps data for device ${deviceId}`);
            return;
        }
        const waypoints = waypointsString.split('|').map(waypoint => waypoint.split(',').map(Number));
        const firstWaypoint = [waypoints[0][1], waypoints[0][0]]; // Flip the coordinates
        const lastWaypoint = [waypoints[waypoints.length - 1][1], waypoints[waypoints.length - 1][0]]; // Flip the coordinates
        const startMarker = new maplibregl.Marker({
            color: "#ce0d0d",
        })
            .setLngLat(firstWaypoint)
            .setPopup(new Popup({ offset: 25 })
                .setHTML('<h3>depart</h3>'))
            .addTo(mapref.current);
        setStartMarker(startMarker);

        const endMarker = new maplibregl.Marker({
            color: "#ce0d0d",
        })
            .setLngLat(lastWaypoint)
            .setPopup(new Popup({ offset: 25 })
                .setHTML('<h3>fin</h3>'))
            .addTo(mapref.current);
        setEndMarker(endMarker);
        let routeData;
        let routeStepsData;
        // let instructionsData;
        let stepPointsData;

        fetch(`https://api.geoapify.com/v1/routing?waypoints=${waypointsString}&mode=drive&apiKey=e327a1988cea41ea9b80b0225c329861`)
            .then(response => response.json())
            .then(routeResult => {
                routeData = routeResult;
                const steps = [];
                const instructions = [];
                const stepPoints = [];


                routeData.features[0].properties.legs.forEach((leg, legIndex) => {
                    const legGeometry = routeData.features[0].geometry.coordinates[legIndex];
                    leg.steps.forEach((step, index) => {
                        if (step.instruction) {
                            instructions.push({
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": legGeometry[step.from_index]
                                },
                                properties: {
                                    text: step.instruction.text
                                }
                            });
                        }

                        if (index !== 0) {
                            stepPoints.push({
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": legGeometry[step.from_index]
                                },
                                properties: step
                            })
                        }

                        if (step.from_index === step.to_index) {
                            // destination point
                            return;
                        }

                        const stepGeometry = legGeometry.slice(step.from_index, step.to_index + 1);
                        steps.push({
                            "type": "Feature",
                            "geometry": {
                                "type": "LineString",
                                "coordinates": stepGeometry
                            },
                            properties: step
                        });
                    });
                });

                routeStepsData = {
                    type: "FeatureCollection",
                    features: steps
                }

                // instructionsData = {
                //     type: "FeatureCollection",
                //     features: instructions
                // }

                stepPointsData = {
                    type: "FeatureCollection",
                    features: stepPoints
                }
                if (!mapref.current.getSource('route')) {
                    mapref.current.addSource('route', {
                        type: 'geojson',
                        data: routeData
                    });
                }

                // if (!mapref.current.getSource('points')) {
                //     mapref.current.addSource('points', {
                //         type: 'geojson',
                //
                //     });
                // }


                drawRoute();
            }, err => console.log(err));

        function drawRoute() {
            if (!routeData || !mapref.current) {
                return;
            }

            if (mapref.current.getLayer('route-layer')) {
                mapref.current.removeLayer('route-layer')
            }

            if (mapref.current.getLayer('points-layer')) {
                mapref.current.removeLayer('points-layer')
            }

            mapref.current.getSource('route').setData(routeData);
            mapref.current.addLayer({
                'id': 'route-layer',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-cap': "round",
                    'line-join': "round"
                },
                'paint': {
                    'line-color': "#6084eb",
                    'line-width': 5
                },
                'filter': ['==', '$type', 'LineString']
            });


            const sourceData = {
                type: "FeatureCollection",
                features: deviceSteps.map(step => ({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: step.coordinates
                    },
                    properties: {
                        fixTime: (dayjs(step.fixTime)).format("YYYY-MM-DD HH:mm"),
                    }
                }))
            };

            if(mapref.current.getSource('points')){

                console.log("source exist")
                mapref.current.getSource('points').setData(sourceData);
                console.log("source",mapref.current.getSource('points')._data)
                // Add 'points-layer' after 'points' source is populated
                mapref.current.addLayer({
                    'id': 'points-layer',
                    'type': 'circle',
                    'source': 'points',
                    'paint': {
                        'circle-radius': 5,
                        'circle-color': "#fff",
                        'circle-stroke-color': "#aaa",
                        'circle-stroke-width': 1,
                    }
                });
            }

            addLayerEvents();
        }
        function addLayerEvents() {

            mapref.current.on('click', 'points-layer', (e) => {
                showPopup({
                    fixTime: e.features[0].properties.fixTime
                }, e.lngLat);

                e.preventDefault();
            });

            // mapref.current.on('mouseleave', 'route-layer', () => {
            //     mapref.current.getCanvas().style.cursor = '';
            // });
            //
            // mapref.current.on('mouseenter', 'points-layer', () => {
            //     mapref.current.getCanvas().style.cursor = 'pointer';
            // });
            //
            // mapref.current.on('mouseleave', 'points-layer', () => {
            //     mapref.current.getCanvas().style.cursor = '';
            // });

            // mapref.current.on('click', 'route-layer', (e) => {
            //
            //
            //     showPopup({
            //         distance: `${e.features[0].properties.distance} m`,
            //         time: `${e.features[0].properties.time} s`
            //     }, e.lngLat);
            //
            //     e.preventDefault();
            // })


        }


        function showPopup(data, lngLat) {
            console.log('showPopup')
            if (data && data.fixTime) {
                new maplibregl.Popup()
                    .setLngLat(lngLat)
                    .setHTML(`<div>Time: ${data.fixTime}</div>`)
                    .addTo(mapref.current);
            } else {
                console.log('Data or fixTime is undefined');
            }
        }
        mapref.current.flyTo({
            center: firstWaypoint,
            zoom: 10
        });
    }

    useEffect(() => {

        const fetchitems = ()=> {

            let items =[
                getItem('Vehicle', operation.vehicle._id, null, [getItem(`${operation.vehicle.brand} ${operation.vehicle.model} ${operation.vehicle.licensePlate}`, operation.vehicle._id, <CarOutlined />, null, null, operation.vehicle.device, operation.startTime, operation.endTime)], 'group'),
                getItem('Responsable', operation.responsable.id, null, [getItem(operation.responsable.Fullname, operation.responsable.id, <UserOutlined />, null, null, operation.responsable.device, operation.startTime, operation.endTime)], 'group'),
                getItem('technicians', null, <TeamOutlined />, operation.technicians.map((technician) => {
                    return getItem(technician.Fullname, technician.id, null, null, null, technician.device, operation.startTime, operation.endTime)
                }))
            ];



            setitems(items);


        }
        fetchitems();
    }, []);

    const [itemss, setitemss] = useState(null);

    const Sotetel = [10.210557325592731,36.8530881166092];




    const onDeviceClick = async (deviceId,name,startdate,enddate) => {
        if (!deviceId)
            return;
        setitemss(null);
        if (startMarkerRef.current) {
            startMarkerRef.current.remove();
            setStartMarker(null);
        }

        if (endMarkerRef.current) {
            endMarkerRef.current.remove();
            setEndMarker(null);
        }

        // Remove the existing markers and route from the map
        if (mapref.current.getLayer('route-layer')) {
            mapref.current.removeLayer('route-layer');
            mapref.current.removeSource('route');
        }

        if (mapref.current.getLayer('points-layer')) {
            mapref.current.removeLayer('points-layer');
            mapref.current.removeSource('points');
        }

        if (mapref.current.getSource('points')) {
            // If it does, update its data
            mapref.current.getSource('points').setData({
                type: "FeatureCollection",
                features: []
            });
        } else {
            // If it doesn't, add it to the map
            mapref.current.addSource('points', {
                type: 'geojson',
                data: {
                    type: "FeatureCollection",
                    features: []
                }
            });
        }
        processRoute(deviceDataRef.current[deviceId],deviceId);

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
    setTimeout(() => {
        setSpinning(false);
    }, 2000);



    function getItem(label, key,icon,children, type,device,startdate,enddate){

        return {
            key,
            icon,
            children,
            label,
            type,
            device,

            startdate,
            enddate,
            onClick: () => {
                onDeviceClick(device,label,startdate,enddate);
                // Show the panel when an operation is clicked
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
            <div className="panel3">
                <h3 className="h3">
                  {operation.name}
                </h3>
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
            </div>
            {isPanel2Visible && (
                <div className="panel-2">
                    <button className="close-button" onClick={() => setIsPanel2Visible(false)}><CloseOutlined /></button>
                    <h3 className="h3">
                      Details
                    </h3>

                    <div className="timeline" id="style-8">
                        Timeline
                        {!itemss||itemss.length === 0 ? (
                            <p>The timeline is empty</p>
                        ) : (
                            <Timeline
                                style={{
                                    padding: '16px',
                                }}
                                items={itemss}
                            />
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