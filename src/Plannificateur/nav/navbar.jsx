//
// import { ReactComponent as Logo } from './logo.svg';
// import  './navbar.scss';
// import {
//     PlusOutlined,
//     BellOutlined, UserOutlined, LogoutOutlined,
// } from '@ant-design/icons';
//
// import {Space, Tooltip, Layout, theme, Button, Badge} from 'antd';
//
// const { Header } = Layout;
//
//
// const Navbar = () => {
//     const {
//         token: { colorBgContainer, borderRadiusLG },
//     } = theme.useToken();
//     return(
//         <Header
//             style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 height:'15vh',
//                 justifyContent: 'space-between',
//                 borderRadius: borderRadiusLG,
//                 margin:"8px"
//             }}
//         >
//             <a className='logo-container' href='/'>
//                 <Logo  className='logo'/>
//             </a>
//             <Space size={"middle"}>
//
//
//                 <Tooltip title="Profil">
//                     <Button shape="raound" icon={<UserOutlined />}
//                             style={{
//                                 background:colorBgContainer,
//                             }} />
//
//
//                 </Tooltip>
//                 <Tooltip title="LogOut">
//                     <Button shape="raound" icon={<LogoutOutlined />}
//                             style={{
//                                 background:colorBgContainer,
//                             }} />
//
//
//                 </Tooltip>
//
//
//             </Space>
//         </Header>
//     );
// };
// export default Navbar ;
