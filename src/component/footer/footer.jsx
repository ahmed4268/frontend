import {Layout} from "antd";

const { Footer } = Layout;
const Footerr = () => {
    return (
        <Footer style={{ textAlign: 'center' }}>
            OptiTrack ©{new Date().getFullYear()} Created by OptiTrack Team
        </Footer>
    );
}
export default Footerr;