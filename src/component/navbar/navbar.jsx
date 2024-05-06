
import { ReactComponent as Logo } from './logo.svg';
import  './navbar.scss';
import {
    PlusOutlined,
    BellOutlined, UserOutlined, LogoutOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../actions/notificationActions'; // import your action creator

import {Space, Tooltip, Layout, theme, Button, Badge, Menu, Dropdown, message} from 'antd';
import React, { useEffect } from 'react';

import UpdateEvents from './updateEvents';
import { removeToken,logout } from '../../actions/cookieActions';
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

const { Header } = Layout;


const Navbar = () => {

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const dispatch = useDispatch();
    const user=JSON.parse(localStorage.getItem('user'));
    const role=user.role;

    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        dispatch(removeToken());
        localStorage.removeItem('user');

        Cookies.remove('token');
        Cookies.remove('jwwt');
        navigate('/login')
    };
    const notifications = useSelector(state => state.operationNotifications.notifications);
    console.log('notifications',notifications)


        const testNotifications = () => {
            // Operation Started
            dispatch(addNotification({
                message: 'Operation Started',
                description: `Operation: Test Operation has started.`,
                type: 'info'
            }));

            // Operation Ended
            dispatch(addNotification({
                message: 'Operation Ended',
                description: `Operation: Test Operation has ended.`,
                type: 'info'
            }));

            // Technician did not enter
            dispatch(addNotification({
                message: 'Technician did not enter',
                description: `Technician: Test Technician did not enter the site.`,
                type: 'warning'
            }));

            // Technician left early
            dispatch(addNotification({
                message: 'Technician left early',
                description: `Technician: Test Technician left the site early.`,
                type: 'warning'
            }));
        };

    const menu = (
        <Menu style={{ maxHeight: '300px', overflow: 'auto' }}>
            {notifications && notifications.map((notification, index) => (
                <Menu.Item key={index}>
                    <div>
                        <strong>{notification.message}</strong>
                        <p>{notification.description}</p>
                    </div>
                </Menu.Item>
            ))}
            <Menu.Divider />
            <Menu.Item onClick={() => dispatch({ type: 'CLEAR_NOTIFICATIONS' })}>
                Clear Notifications
            </Menu.Item>
        </Menu>
    );
    const NotificationButton = () => {
        if (notifications.length === 0) {
            return (
                <Button shape="around" icon={<BellOutlined />} style={{
                    background:colorBgContainer,
                }}  onClick={() => message.info('Notification box is empty')} />
            );
        } else {
            return (
                <Dropdown overlay={menu} trigger={['click']}>
                    <Badge size="small" color="red">
                        <Button shape="around"  style={{
                            background:colorBgContainer,
                        }} icon={<BellOutlined />} />
                    </Badge>
                </Dropdown>
            );
        }
    };
    // const [operations, setOperations] = useState([]);
    // const credentials = btoa('mohamedouesalti080@gmail.com:RZedi!Z9MpqnF@K');
    // const [storedEvents, setStoredEvents] = useState([]);
    //
    // const [events, setEvents] = useState({});
    // useEffect(() => {
    //
    //     const fetchOperations = async () => {
    //         const source = axios.CancelToken.source();
    //         try {
    //             const { data } = await axios.get('/operation/map', {
    //                 cancelToken: source.token,
    //             });
    //             setOperations(data);
    //         } catch (error) {
    //             if (axios.isCancel(error)) {
    //                 console.log('Request canceled', error.message);
    //             } else {
    //                 console.log('Error', error.message);
    //             }
    //         }
    //
    //
    //     };
    //
    //     fetchOperations();
    // }, []);
    // console.log('operations',operations)
    //
    //     useEffect(() => {
    //         const fetchEvents = async () => {
    //             // Create a new CancelToken source for this request
    //             console.log('we fetch events');
    //             const source = axios.CancelToken.source();
    //
    //             try {
    //                 // For each operation, fetch events
    //                 for (const operation of operations) {
    //                     console.log('we on trracar',operation);
    //                     const { group, startTime, endTime } = operation;
    //                     const eventsUrl = `https://demo4.traccar.org/api/reports/events?groupId=${group}&from=${startTime}&to=${endTime}&type=geofenceEnter&type=geofenceExit`;
    //                     const { data } = await axios.get(eventsUrl, {
    //                         headers: {
    //                             'Authorization': `Basic ${credentials}`
    //                         },
    //                         cancelToken: source.token
    //                     });
    //                    console.log("event traccar",data);
    //
    //
    //
    //                     if(events[operation._id] && events[operation._id].length > 0) {
    //                         console.log("we enter")
    //                         const newEvents = data.filter(newEvent => !events[operation._id].some(event => event.id === newEvent.id));
    //                         console.log("newevents", newEvents)
    //                         if (newEvents.length > 0) {
    //                             for (const newEvent of newEvents) {
    //                                 notification.open({
    //                                     message: 'New Event',
    //                                     description: `A new event has occurred in the active operation. Device ID: ${newEvent.deviceId}, Type: ${newEvent.type}, Event Time: ${newEvent.eventTime}`,
    //                                 });
    //                             }
    //                         }
    //                     }
    //                     // Update the events state
    //                     setEvents(prevEvents => ({
    //                         ...prevEvents,
    //                         [operation._id]: [...(prevEvents[operation.id] || []), ...data]
    //                     }));                    }
    //             } catch (error) {
    //                 if (axios.isCancel(error)) {
    //                     console.log('Request canceled', error.message);
    //                 } else {
    //                     // handle error
    //                     console.error(error);
    //                 }
    //             }
    //             setTimeout(fetchEvents, 5000);
    //         };
    //
    //         if (operations.length > 0) {
    //             fetchEvents(); // Fetch events when operations are available
    //             // Clean up interval on component unmount
    //             }
    //
    //     }, [operations]);
    if(role==="Planifcateur"){
        return(

            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    height:'15vh',
                    justifyContent: 'space-between',
                    borderRadius: borderRadiusLG,
                    margin:"8px"
                }}
            >
                <a className='logo-container' href='/'>
                    <Logo  className='logo'/>
                </a>
                <Space size={"middle"}>


                    <Tooltip title="Profil">
                        <Button shape="raound" href="/profil"  icon={<UserOutlined />}
                                style={{
                                    background:colorBgContainer,
                                }} />


                    </Tooltip>
                    <Tooltip title="LogOut">
                        <Button shape="raound" onClick={handleLogout} icon={<LogoutOutlined />}
                                style={{
                                    background:colorBgContainer,
                                }} />


                    </Tooltip>


                </Space>
            </Header>

        )
    }else{
    return(
        <>
            <UpdateEvents />
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
                height:'15vh',
                justifyContent: 'space-between',
                borderRadius: borderRadiusLG,
                margin:"8px"
            }}
        >
            <a className='logo-container' href='/'>
                <Logo  className='logo'/>
            </a>
            <Space size={"middle"}>
                <Button href="/new-operation" icon={<PlusOutlined />}
                        style={{

                            background:colorBgContainer,

                        }}>New Operation</Button>

                <Tooltip title="Notification">
                    <NotificationButton />
                </Tooltip>
                {/*<button onClick={testNotifications}>Test Notifications</button>*/}
            </Space>
        </Header>
        </>
    );
};}
export default Navbar ;
