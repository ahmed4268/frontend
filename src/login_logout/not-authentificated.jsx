import React from 'react';
import { Button, Result } from 'antd';
const App = () => (
    <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<Button href="/login" type="primary">login</Button>}
    />
);
export default App;