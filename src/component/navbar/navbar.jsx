
import { ReactComponent as Logo } from './logo.svg';
import  './navbar.scss';
import {
    PlusOutlined ,
    BellOutlined ,
} from '@ant-design/icons';

import {Space, Tooltip, Layout, theme, Button, Badge} from 'antd';

const { Header } = Layout;


const Navbar = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
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
                <Button href="/new-operation" icon={<PlusOutlined />}
                        style={{

                            background:colorBgContainer,

                        }}>New Operation</Button>

                <Tooltip title="Notification">
                    <Badge size="small" color="red" count={8}>
                    <Button shape="raound" icon={<BellOutlined />}
                            style={{
                                background:colorBgContainer,
                            }} />
                    </Badge>

                </Tooltip>


            </Space>
        </Header>
    );
};
export default Navbar ;
