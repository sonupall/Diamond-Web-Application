import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "antd";
import BrokerDetails from "./modules/Broker/pages/index";
import AppHeader from "./Layout/Header";
import "./assets/styles/global.css";
import DiamondDetails from "./modules/Diamond/pages/index";
import TransactionDetails from "./modules/Transaction/pages/index";
const { Content } = Layout;
function App() {

    return (
        <Router>
            <Layout style={{ minHeight: "100vh" }}>
                <AppHeader />
                <Layout >
                    <Content>
                        <Routes>
                            <Route path="/" element={<Navigate to="/broker-details" />} />
                            <Route path="/broker-details" element={<BrokerDetails />} />
                            <Route path="/diamond-details" element={<DiamondDetails />} />
                            <Route path="/transaction-module" element={<TransactionDetails />} />
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </Router>
    );
};
export default App
