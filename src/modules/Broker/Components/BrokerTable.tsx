import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../../../CommonComponents/CommonTable";
import { RootState } from "../../../redux/store";
import {
    fetchBrokersAsync,
    deleteBrokerAsync,
    updateBrokerAsync
} from "../slice/sliceIndex";

const BrokerTable = ({ onEdit }: { onEdit: (broker: any) => void }) => {
    const dispatch = useDispatch();
    const { brokers, loading } = useSelector((state: RootState) => state.brokers);

    useEffect(() => {
        dispatch(fetchBrokersAsync());
    }, [dispatch]);

    const columns = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email ID" },
        { key: "phone", label: "Phone No" },
        { key: "address", label: "Address" },
        { key: "brokerRate", label: "Broker Rate (%)" },
        { key: "status", label: "Status" },
    ];

    const handleEdit = (row: any) => {
        console.log(row, "row")
        onEdit(row); // Pass selected broker to parent for editing
    };

    const handleDelete = (row: any) => {
        dispatch(deleteBrokerAsync(row.id));
    };
    // const [data, setData] = useState(initialData);
    //
    // const handleStatusChange = (row: any, checked: boolean) => {
    //     setData((prevData) =>
    //         prevData.map((item) => (item.key === row.key ? { ...item, status: checked } : item))
    //     );
    // };
    const handleStatusChange = (row: any, checked: any) => {
        console.log(row, checked,"checked")
        const updatedBroker = { ...row, status: checked?.target?.checked };
        dispatch(updateBrokerAsync(updatedBroker));
    };

    return (
        <div>
            <CommonTable
                columns={columns}
                data={brokers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                loading={loading}
            />
        </div>
    );
};

export default BrokerTable;
