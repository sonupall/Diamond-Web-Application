import React, {useState} from "react";
import CommonFormBackground from "../../../CommonComponents/CommonFormBackground";
import DiamondForm from "../Components/DiamondForm";
import DiamondTable from "../Components/DiamondTable";
const DiamondDetails = () => {
    const [selectedDiamond, setSelectedDiamond] = useState(null);
    console.log(selectedDiamond, "selected")
    return (
        <div className="broker-page">
            <CommonFormBackground title={'Diamond Details'}>
                <DiamondForm editingDiamond={selectedDiamond} setEditingDiamond={setSelectedDiamond}/>
            </CommonFormBackground>

            <DiamondTable onEdit={setSelectedDiamond}/>
        </div>
    );
};

export default DiamondDetails;
