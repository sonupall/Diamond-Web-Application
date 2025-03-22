import { Form, Input } from "antd";
import { forwardRef } from "react";

interface CommonInputProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

}

const CommonInput = forwardRef<HTMLInputElement, CommonInputProps>(
    ({ label, name, type = "text", value, error, onChange, ...inputProps }, ref) => {
        return (
            <Form.Item label={label} validateStatus={error ? "error" : ""} help={error || ""}>
                <Input
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    ref={ref}
                    {...inputProps} // ✅ Correct placement
                />
            </Form.Item>
        );
    }
);

export default CommonInput;
