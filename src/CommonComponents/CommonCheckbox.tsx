import {  Checkbox } from "antd";

const CommonCheckbox = ({ checked, onChange }) => {
    return <Checkbox className="custom-checkbox" checked={checked} onChange={onChange} />;
};
export default  CommonCheckbox
