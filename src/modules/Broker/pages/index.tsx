import React, {useState} from "react";
import BrokerForm from "../Components/BrokerForm";
import BrokerTable from "../Components/BrokerTable";
import { Card } from "antd";
import CommonFormBackground from "../../../CommonComponents/CommonFormBackground";
import set = Reflect.set;
const BrokerDetails = () => {
    const [selectedBroker, setSelectedBroker] = useState(null);
    return (
        <div className="broker-page">
            <CommonFormBackground title={'Broker Details'}>
                <BrokerForm editingBroker={selectedBroker} setEditingBroker={setSelectedBroker}/>
            </CommonFormBackground>
                <BrokerTable onEdit={setSelectedBroker}/>
        </div>
    );
};

export default BrokerDetails;
