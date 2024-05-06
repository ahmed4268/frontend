import {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { notification } from 'antd';
import {useLocation} from "react-router-dom";
import dayjs from "dayjs";
import { addNotification } from '../../actions/notificationActions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Cookies from "js-cookie";

const UpdateEvents = () => {
    const dispatch = useDispatch();
    const operationNotifications = useSelector(state => state.operationNotifications);
    // console.log(operationNotifications);
    const operationNotificationsRef = useRef();

    useEffect(() => {
        operationNotificationsRef.current = operationNotifications;
    }, [operationNotifications]);
    const sotetel=1328;
    const [operations, setOperations] = useState([]);
    const operationRef = useRef(operations);
    useEffect(() => {
        operationRef.current = operations;
    }, [operations]);
    const credentials = btoa('mohamedouesalti080@gmail.com:RZedi!Z9MpqnF@K');
    const storedevents = useRef({});
    const events = useRef({});

    useEffect(() => {
        const fetchOperations = async () => {
            const { data } = await axios.get('/operation/map',{
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setOperations(data);
        };

        fetchOperations();
    }, []);
    const location = useLocation();

    useEffect(() => {
 fetchData();
    }, [location,operations]);
    const fetchData = async () => {
        const abortController = new AbortController();
        let fetchPromises = [];
        if(operationRef.current&&operationRef.current.length>0){
         fetchPromises = operationRef.current.map(operation => {

            const {group, startTime, endTime} = operation;
            const today = new Date();
            today.setDate(today.getDate() + 1); // Add a day to get tomorrow's date
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000); // Get the date for yesterday
            yesterday.setHours(0, 0, 0, 0);
            const yesterdayISOString = yesterday.toISOString();
            const tomorrowISOString = today.toISOString();
            const eventsUrl = `https://demo4.traccar.org/api/reports/events?groupId=${group}&from=${yesterdayISOString}&to=${tomorrowISOString}&type=geofenceEnter&type=geofenceExit`;
           // console.log('eventsUrl',eventsUrl)
            return fetch(eventsUrl, {
                signal: abortController.signal, // Add this line

                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    // console.log('data',data)
                    storedevents.current[operation._id] = data;
                })
                .catch(error => {
                    if (error.name === 'AbortError') {
                        // console.log('Fetch aborted');
                    } else {
                        console.error('Error:', error);
                    }
                });
        });}
        else {
            return
        }
        const allPromises = Promise.all(fetchPromises);
        allPromises.finally(() => abortController.abort()); // Add this line
        return allPromises;
    }
    useEffect(() => {
        const fetchDataPromise = fetchData();
        return () => {
            fetchDataPromise.finally(() => console.log('fetchData has completed'));
        };
    }, [operationRef.current]);
    const shownotification = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                // console.log('shownotification has started')
                await fetchData();
                // console.log(storedevents.current)
                if (storedevents.current) {
                    for (const operation of operationRef.current) {
                        if (!events.current[operation._id]) {
                            events.current[operation._id] = storedevents.current[operation._id];
                        }
                        if (storedevents.current[operation._id] && events.current[operation._id] && storedevents.current[operation._id].length > events.current[operation._id].length) {
                            // console.log("filter")
                            const newEvents = storedevents.current[operation._id].filter(newEvent => !events.current[operation._id].some(event => event.id === newEvent.id));


                            if (newEvents.length > 0) {
                                for (const newEvent of newEvents) {
                                    const technicianOrVehicle = operation.technicians.find(technician => technician.device === newEvent.deviceId) || operation.vehicles.find(vehicle => vehicle.device === newEvent.deviceId);
                                    const geofenceName = newEvent.geofenceId === sotetel ? "sotetel" : operation.site.name;
                                    let description;
                                    if (technicianOrVehicle.Fullname) {
                                        description = `${technicianOrVehicle.Fullname} has ${newEvent.type === "geofenceEnter" ? "entered" : "exited"} site ${geofenceName} at ${(dayjs(newEvent.eventTime)).format("YYYY-MM-DD HH:mm")} as part of the Operation: ${operation.name}`;
                                    } else if (technicianOrVehicle.model) {
                                        description = `${technicianOrVehicle.brand} ${technicianOrVehicle.model} has ${newEvent.type === "geofenceEnter" ? "entered" : "exited"} site ${geofenceName} at ${(dayjs(newEvent.eventTime)).format("YYYY-MM-DD HH:mm")} as part of the Operation: ${operation.name}`;
                                    }

                                    notification.open({
                                        message: `${newEvent.type} `,
                                        description: description,
                                        duration: 5,
                                        style: {
                                            width: 500,
                                        },
                                        type: 'info',
                                        placement: 'top'
                                    });


                                }
                                // console.log('events.current[operation._id] has been updated')
                                events.current[operation._id] = storedevents.current[operation._id];
                            }
                        }

                        const now = new Date();
                        const fourThirtyPM = new Date();
                        fourThirtyPM.setHours(16, 30, 0, 0);
                        if (!operationNotificationsRef.current[operation._id]?.technicianLeftEarly && now < new Date(operation.endTime) && now < fourThirtyPM) {
                            const techniciansWhoLeftEarly = [];
                            for (const technician of operation.technicians) {
                                const technicianEvents = storedevents.current[operation._id]?.filter(event => event.deviceId === technician.device);
                                const exitEvent = technicianEvents?.find(event => event.type === "geofenceExit" && new Date(event.eventTime) > fourThirtyPM);
                                if (exitEvent) {
                                    const reEnterEvent = technicianEvents?.find(event => event.type === "geofenceEnter" && new Date(event.eventTime) > new Date(exitEvent.eventTime.getTime() + 45 * 60 * 1000));
                                    if (!reEnterEvent) {
                                        techniciansWhoLeftEarly.push(technician);
                                    }
                                }
                            }
                            for (const technician of techniciansWhoLeftEarly) {
                                notification.open({
                                    message: 'Technician left early',
                                    description: `${technician.Fullname} left the site early.`,
                                    duration: 3,
                                    type: 'warning',
                                    placement: 'top'
                                });
                                dispatch(addNotification({
                                    message: 'Technician left early',
                                    description: `${technician.Fullname} left the site early.`,
                                    type: 'warning'
                                }));
                            }
                            if (techniciansWhoLeftEarly.length > 0) {
                                dispatch({
                                    type: 'SET_OPERATION_NOTIFICATIONS',
                                    payload: {
                                        operationId: operation._id,
                                        notificationType: 'technicianLeftEarly',
                                        value: true,
                                    },
                                });
                            }
                        }

                            let startTime = new Date(operation.startTime);



                        if (!operationNotificationsRef.current[operation._id]?.technicianDidNotEnter && new Date(operation.startTime) <= now && now <= new Date(startTime.getTime() + 45 * 60 * 1000)) {
                             // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                            const techniciansWhoDidNotEnter = [];
                            for (const technician of operation.technicians) {
                                const technicianEvents = storedevents.current[operation._id]?.filter(event => event.deviceId === technician.device);
                                if (!technicianEvents?.some(event => event.type === "geofenceEnter")) {
                                    techniciansWhoDidNotEnter.push(technician);
                                }
                            }

                            for (const technician of techniciansWhoDidNotEnter) {
                                notification.open({
                                    message: 'Technician did not enter',
                                    description: `${technician.Fullname} did not enter the site.`,
                                    duration: 3,
                                    type: 'warning',
                                    placement: 'top'
                                });
                                dispatch(addNotification({
                                    message: 'Technician did not enter',
                                    description: `${technician.Fullname} did not enter the site.`,
                                    type: 'warning',
                                    placement: 'top'
                                }));
                            }
                            if (techniciansWhoDidNotEnter.length > 0) {
                                dispatch({
                                    type: 'SET_OPERATION_NOTIFICATIONS',
                                    payload: {
                                        operationId: operation._id,
                                        notificationType: 'technicianDidNotEnter',
                                        value: true,
                                    },
                                });
                            }
                        }
                          // console.log(operation._id,!operationNotificationsRef.current[operation._id]?.startEnd)
                        // console.log(new Date(operation.endTime) < now &&!operationNotificationsRef.current[operation._id]?.startEnd)

                        if (!operationNotificationsRef.current[operation._id]?.startEnd) {
                            if (new Date(operation.startTime) <= now && new Date(operation.endTime) >= now) {
                                notification.open({
                                    message: 'Operation Started',
                                    description: `Operation: ${operation.name} has started.`,
                                    duration: 3,
                                    type: 'info',
                                    placement: 'top'
                                });
                                dispatch(addNotification({
                                    message: 'Operation Started',
                                    description: `Operation: ${operation.name} has started.`,
                                    type: 'info'
                                }));
                                dispatch({
                                    type: 'SET_OPERATION_NOTIFICATIONS',
                                    payload: {
                                        operationId: operation._id,
                                        notificationType: 'startEnd',
                                        value: true,
                                    },
                                });

                            } else if (new Date(operation.endTime) < now &&!operationNotificationsRef.current[operation._id]?.startEnd){
                                // console.log(new Date(operation.endTime) < now &&!operationNotificationsRef.current[operation._id]?.startEnd)
                                notification.open({
                                    message: 'Operation Ended',
                                    description: `Operation: ${operation.name} has ended.`,
                                    duration: 3,
                                    type: 'info',
                                    placement: 'top'
                                });
                                dispatch(addNotification({
                                    message: 'Operation Ended',
                                    description: `Operation: ${operation.name} has ended.`,
                                    type: 'info'
                                }));
                                dispatch({
                                    type: 'SET_OPERATION_NOTIFICATIONS',
                                    payload: {
                                        operationId: operation._id,
                                        notificationType: 'startEnd',
                                        value: true,
                                    },
                                });
                            }
                        }
                        // console.log(operation._id)
                    }

                }





                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    useEffect(() => {
        const intervalId = setInterval(() => {
            shownotification().then(() => {
                // console.log('shownotification has completed');
            }).catch((error) => {
                console.error('Error:', error);
            });
        }, 4000); // Call shownotification every 5 seconds

        // Clear interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    // useEffect(() => {
    //     shownotification().then(() => {
    //         console.log('shownotification has completed');
    //     }).catch((error) => {
    //         console.error('Error:', error);
    //     });
    // }, []); // Run shownotification once when the component mounts


    // useEffect(() => {
    //     const fetchEvents = async () => {
    //         for (const operation of operations) {
    //             const { group, startTime, endTime } = operation;
    //             const eventsUrl = `https://demo4.traccar.org/api/reports/events?groupId=${group}&from=${startTime}&to=${endTime}&type=geofenceEnter&type=geofenceExit`;
    //             fetch(eventsUrl, {
    //                 headers: {
    //                     'Authorization': `Basic ${credentials}`
    //                 }
    //             })
    //                 .then(response => response.json())
    //                 .then(data => {
    //
    //
    //                     setTimeout(fetchEvents(), 5000);
    //                 }).catch(error => console.error('Error:', error));
    //         }
    //
    //
    //     };
    //
    //     if (operations.length > 0) {
    //         fetchEvents();
    //     }
    // }, [operations]);

};

export default UpdateEvents;