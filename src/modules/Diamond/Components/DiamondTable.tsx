import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../../../CommonComponents/CommonTable";
import { RootState } from "../../../redux/store";
import {
    fetchDiamondsAsync,
    deleteDiamondAsync,
    updateDiamondAsync
} from "../slice/diamondSlice";

const DiamondTable = ({ onEdit,rowSelection,isNotAction }: { onEdit: (diamond: any) => void ,rowSelection: (diamond: any) => void,isNotAction:boolean}) => {
    const dispatch = useDispatch();
    const { diamonds, loading } = useSelector((state: RootState) => state.diamonds);

    useEffect(() => {
        dispatch(fetchDiamondsAsync());
    }, [dispatch]);

    const columns = [
        { key: "stockNo", label: "Stock No" },
        { key: "carat", label: "Carat" },
        { key: "shape", label: "Shape" },
        { key: "color", label: "Color" },
        { key: "clarity", label: "Clarity" },
        { key: "rapPrice", label: "RAP Price" },
        { key: "discount", label: "Discount (%)" },
        { key: "ppc", label: "Price per Carat" },
        { key: "totalAmount", label: "Total Amount" },
    ];

    const handleEdit = (row: any) => {
        onEdit(row); // Pass selected diamond to parent for editing
    };

    const handleDelete = (row: any) => {
        dispatch(deleteDiamondAsync(row.id));
    };

    return (
        <div>
            <CommonTable
                rowSelection={rowSelection}
                columns={columns}
                data={diamonds}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
                isNotAction={isNotAction}
            />
        </div>
    );
};

export default DiamondTable;
