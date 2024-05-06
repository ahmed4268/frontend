// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
//
// const WebSocketHandler = () => {
//     const [socket, setSocket] = useState(null);
//
//
//     const establishHttpSession = async () => {
//
//             // await axios.get(
//             //     '/api/session?token=RjBEAiBELve7YgzV_8Rgw2Zl5ANkmSqQCst79uHN10gRLAiL1wIgUNnl7VcQdThMiJ3I4NjIT1f7cDgXZXnJj-8bLSaEBJx7InUiOjIzNjU3LCJlIjoiMjAyNS0wNC0yNlQyMzowMDowMC4wMDArMDA6MDAifQ'
//             //
//             // );
//             await axios.get(
//                 '/api/session?token=RzBFAiBeDfqTzn6F5cQs6SNqVmCS4MxB19p2roz7kDgQ_9HlGgIhAJeFwjWZEXYxAFYU4DsY-8hsJkX6Jzr_m1KV2eazFXzIeyJ1IjoxLCJlIjoiMjAyNS0wNC0yNlQyMzowMDowMC4wMDArMDA6MDAifQ'
//
//             );
//
//
//     };
//
//     useEffect(() => {
//         const establishConnection = async () => {
//             await establishHttpSession();
//
//             const protocol =  'wss:'
//             const host = window.location.host
//
//             const wsUrl =`${protocol}//${host}/api/socket`;
//            // await console.log(wsUrl)
//             const socket = new WebSocket(wsUrl);
//
//             socket.onopen = () => {
//                 console.log('WebSocket connection established');
//             };
//             socket.onerror = (error) => {
//                 console.error('WebSocket error:', error);
//             };
//             socket.onmessage = (message) => {
//                 console.log('WebSocket message:', message);
//             };
//             socket.onclose = (event) => {
//                 console.log('WebSocket connection closed:', event);
//             };
//         }
//
//         establishConnection();
//     }, [])
//     return (
//         <div>
//             WebSocket Handler
//         </div>
//     );
// };
//
// export default WebSocketHandler;