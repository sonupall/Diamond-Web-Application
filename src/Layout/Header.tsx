import React from "react";
import { NavLink , useLocation} from "react-router-dom";
import { Layout, Menu } from "antd";
import { UserOutlined, FileOutlined, TransactionOutlined } from "@ant-design/icons";
import logo from "../assets/icons/logo.png"

const { Header } = Layout;

const AppHeader: React.FC = () => {
    const location = useLocation();
    return (
        <Header className="custom-header">
            <div className="logo">
                <img src={logo} alt="Sarvadhi Logo" />
            </div>
            <Menu mode="horizontal" selectedKeys={[location?.pathname]} defaultSelectedKeys={["broker-details"]} className="nav-menu">
                <Menu.Item key="/broker-details" icon={<UserOutlined />}>
                    <NavLink to="/broker-details">Broker Details</NavLink>
                </Menu.Item>
                <Menu.Item key="/diamond-details" icon={<FileOutlined />}>
                    <NavLink to="/diamond-details">Diamond Details</NavLink>
                </Menu.Item>
                <Menu.Item key="/transaction-module" icon={<TransactionOutlined />}>
                    <NavLink to="/transaction-module">Transaction Module</NavLink>
                </Menu.Item>
            </Menu>
        </Header>
    );
};

export default AppHeader;
