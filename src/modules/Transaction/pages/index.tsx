import React, {useState} from "react";
import CommonFormBackground from "../../../CommonComponents/CommonFormBackground";
import TransactionModule from "../Components/TransactionDetailView";
import DiamondTable from "../../Diamond/Components/DiamondTable";
import {Table} from "antd";
import {setSelectedDiamonds} from "../slice/transactionSlice";
import {useDispatch} from "react-redux";
const TransactionDetails = () => {
    const dispatch = useDispatch();
    const [selectedRowKey, setSelectedRowKey] = useState<React.Key | null>(null);

    // Handle row selection (only one row at a time)
    const handleDiamondSelect = (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        const selectedKey = selectedRowKeys.length > 0 ? selectedRowKeys[0] : null;
        setSelectedRowKey(selectedKey); // Update selected row
        dispatch(setSelectedDiamonds(selectedRows)); // Store selected row in Redux
    };

    // Ensure only ONE row can be selected
    const rowSelection = {
        type: "radio",
        selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
        onChange: handleDiamondSelect,
    };

    return (
        <div className="broker-page transaction-page">
            <CommonFormBackground title={'Transaction Details'}>
                <TransactionModule />
            </CommonFormBackground>

            <DiamondTable rowSelection={rowSelection} isNotAction={true}/>
        </div>
    );
};

export default TransactionDetails;
