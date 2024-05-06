import {
    UserOutlined,

    NodeIndexOutlined,
    ProductOutlined,
    LogoutOutlined,

    FolderOutlined, TeamOutlined, CarOutlined, EnvironmentOutlined, ScheduleOutlined, SmileOutlined,

} from '@ant-design/icons';

import { Layout , Menu, theme } from 'antd';
import { removeToken,logout } from '../../actions/cookieActions';
import {useDispatch} from "react-redux";
import Cookies from "js-cookie";

const {  Sider } = Layout;

const Sidebar = (props) => {
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
        dispatch(removeToken());
        localStorage.removeItem('user');

        Cookies.remove('token');
        Cookies.remove('jwt');
    };
    const user=JSON.parse(localStorage.getItem('user'));
const role=user.role;
    const {
        token: {  borderRadiusLG },
    } = theme.useToken();
    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        }
    }

    const chef = [
        getItem(<a href="/"  rel="noopener noreferrer">
                Dashboard
            </a>,
            'sub1', <ProductOutlined />),
        {type: 'divider'},
        getItem(<a href="/tracking"  rel="noopener noreferrer">
            Tracking
        </a>, 'sub2', <NodeIndexOutlined />),
        {type: 'divider'},
        getItem(<a href="/archive" rel="noopener noreferrer">
            Archive
        </a>, 'sub13', <FolderOutlined />),
        {type: 'divider'},
        getItem(<a href="/profil"  rel="noopener noreferrer">
            Profil
        </a>, 'sub14', <UserOutlined />),
        {type: 'divider'},
        getItem(<a href="/login" onClick={handleLogout} rel="noopener noreferrer">Log out</a>, 'sub15', <LogoutOutlined />)
    ];

    const admin = [
        getItem(<a href="/"  rel="noopener noreferrer">
                Dashboard
            </a>,
            'sub1', <ProductOutlined />),
        {type: 'divider'},
        getItem(<a href="/tracking"  rel="noopener noreferrer">
            Tracking
        </a>, 'sub2', <NodeIndexOutlined />),
        {type: 'divider'},


        getItem(<a href="/technicians" rel="noopener noreferrer">
            Technicians
        </a>, 'sub3', <TeamOutlined/>),
        {type: 'divider'},
        getItem(<a href="/vehicules" rel="noopener noreferrer">
            Vehicules
        </a>, 'sub4', <CarOutlined/>),
        {type: 'divider'},
        getItem(<a href="/sites" rel="noopener noreferrer">
            Sites
        </a>, 'sub5', <EnvironmentOutlined/>),
        {type: 'divider'},
        getItem(<a href="/congés" rel="noopener noreferrer">
            Congés
        </a>, 'sub7', <ScheduleOutlined/>),
        {type: 'divider'},
        getItem(<a href="/archive" rel="noopener noreferrer">
            Archive
        </a>, 'sub13', <FolderOutlined />),
        {type: 'divider'},
        getItem(<a href="/users" rel="noopener noreferrer">
            Users
        </a>, 'sub19', <SmileOutlined /> ),
        {type: 'divider'},
        getItem(<a href="/profil"  rel="noopener noreferrer">
            Profil
        </a>, 'sub14', <UserOutlined />),
        {type: 'divider'},
        getItem(<a href="/login" onClick={handleLogout} rel="noopener noreferrer">Log out</a>, 'sub15', <LogoutOutlined />)
    ];


const plat= [
            getItem(<a href="/technicians" rel="noopener noreferrer">
                Technicians
            </a>, 'sub3', <TeamOutlined/>),
            {type: 'divider'},
            getItem(<a href="/vehicules" rel="noopener noreferrer">
                Vehicules
            </a>, 'sub4', <CarOutlined/>),
            {type: 'divider'},
            getItem(<a href="/sites" rel="noopener noreferrer">
                Sites
            </a>, 'sub5', <EnvironmentOutlined/>),
            {type: 'divider'},
            getItem(<a href="/congés" rel="noopener noreferrer">
                Congés
            </a>, 'sub7', <ScheduleOutlined/>),

        ];
let items ;
    if(role === "admin") {
        items = admin;
    } else if(role === "ChefProjet") {
        items = chef;
    } else if(role === "Planifcateur") {
        items = plat;
    }
    return (
        <Sider trigger={null} collapsible collapsed={props.collapsed}
               width={200}
               style={{
                   // background: colorBgContainer,
                   minHeight:"0vh",
                   margin:"7px",
                   marginTop:"45px",
                   borderRadius: borderRadiusLG,
               }}
        >
            <Menu

                theme="dark"
                mode="inline"
                iconSize='78'

                fontSize='48'
                defaultSelectedKeys={['']}
                defaultOpenKeys={['sub1']}
                style={{
                    borderRadius: borderRadiusLG,
                    height: '80vh',
                    marginTop: '40px',
                    borderRight: 0,

                }}
                items={items}
            />
        </Sider>


    );
};
export default Sidebar;