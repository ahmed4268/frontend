import {
    UserOutlined ,

    NodeIndexOutlined  ,
    ProductOutlined ,
    LogoutOutlined ,

    FolderOutlined,

} from '@ant-design/icons';

import { Layout , Menu, theme } from 'antd';

const {  Sider } = Layout;

const Sidebar = (props) => {

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
    const items = [

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
        </a>, 'sub3', <FolderOutlined />),
        {type: 'divider'},
        getItem(<a href="/profil" target="_blank" rel="noopener noreferrer">
            Profil
        </a>, 'sub4', <UserOutlined />),
        {type: 'divider'},
        getItem('Log out ', 'sub5', <LogoutOutlined />)

    ];
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