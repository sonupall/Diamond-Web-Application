import React, {useEffect, useState} from "react";
import { Form, Button } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addDiamondAsync, updateDiamondAsync } from "../slice/diamondSlice";
import CommonInput from "../../../CommonComponents/CommonInput";

const initialValues = {
    stockNo: "",
    carat: "",
    shape: "",
    color: "",
    clarity: "",
    rapPrice: "",
    discount: "",
    ppc: "",
    totalAmount: "",
};

const DiamondForm = ({ editingDiamond, setEditingDiamond }) => {
    const dispatch = useDispatch();
    const [isClick, setIsClick] = useState(false)
    const validationSchema = Yup.object().shape({
        stockNo: Yup.string().required("Stock No is required"),
        carat: Yup.number().required("Carat is required"),
        shape: Yup.string(),
        color: Yup.string(),
        clarity: Yup.string(),
        rapPrice: Yup.number().required("RAP Price is required"),
        discount: Yup.number().required("Discount is required"),
    });

    const { values, errors, setFieldValue, validateForm, resetForm , setErrors} = useFormik({
        initialValues,
        validationSchema,
        onSubmit: () => handleSave(),
        validateOnChange: !isClick ? false: true,
        validateOnBlur: false,
        validateOnMount: false,
    });

    useEffect(() => {
        if (!!editingDiamond) {
            Object.keys(initialValues).forEach((field) => {
                setFieldValue(field, editingDiamond[field] || "");
            });
        }
    }, [editingDiamond]);

    // Calculate PPC & Total Amount when rapPrice, discount, or carat changes
    useEffect(() => {
        const rapPrice = parseFloat(values.rapPrice) || 0;
        const discount = parseFloat(values.discount) || 0;
        const carat = parseFloat(values.carat) || 0;

        if (rapPrice && discount && carat) {
            const ppc = rapPrice + rapPrice * (discount / 100);
            const totalAmount = ppc * carat;

            setFieldValue("ppc", ppc.toFixed(2));
            setFieldValue("totalAmount", totalAmount.toFixed(2));
        } else {
            setFieldValue("ppc", ""); // Reset if values are invalid
            setFieldValue("totalAmount", "");
        }
    }, [values.rapPrice, values.discount, values.carat]);

    const handleSave = () => {
        validateForm().then((errors) => {
            if (Object.keys(errors).length === 0) {
                const newDiamond = { ...values };

                if (editingDiamond) {
                    dispatch(updateDiamondAsync({ ...newDiamond, id: editingDiamond.id }));
                    setEditingDiamond(null);
                } else {
                    dispatch(addDiamondAsync(newDiamond));
                }
                setIsClick(false)
                resetForm();
            }
        });
    };
 useEffect(()=>{
     if(!!values){
         setIsClick(true)
     }
 },[values])
    return (
        <div>
            <Form layout="vertical">
                <div className="form-row">
                    <CommonInput label="Stock No" name="stockNo" placeholder='Enter stock no' value={values.stockNo} onChange={(e) => setFieldValue("stockNo", e.target.value)} error={errors.stockNo} />
                    <CommonInput label="Carat" name="carat" type="number" placeholder="Enter Carat" value={values.carat} onChange={(e) => setFieldValue("carat", e.target.value)} error={errors.carat} />
                    <CommonInput label="Shape" name="shape" value={values.shape} placeholder='Enter Shape' onChange={(e) => setFieldValue("shape", e.target.value)} error={errors.shape} />
                    <CommonInput label="Color" name="color" value={values.color} placeholder="Enter Color" onChange={(e) => setFieldValue("color", e.target.value)} error={errors.color} />
                    <CommonInput label="Clarity" name="clarity" value={values.clarity} placeholder="Enter Calarity" onChange={(e) => setFieldValue("clarity", e.target.value)} error={errors.clarity} />
                </div>
                <div className="form-row">
                    <CommonInput label="RAP Price" name="rapPrice" type="number" placeholder="Enter RAP Price" min={0} value={values.rapPrice} onChange={(e) => setFieldValue("rapPrice", e.target.value)} error={errors.rapPrice} />
                    <CommonInput label="Discount (%)" name="discount" type="number" placeholder="Enter Discount"  min={0} value={values.discount} onChange={(e) => setFieldValue("discount", e.target.value)} error={errors.discount} />
                    <CommonInput label="PPC" name="ppc" value={values.ppc} placeholder="0.00" />
                    <CommonInput label="Total Amount" name="totalAmount"  value={values.totalAmount}  placeholder="0.00" />
                </div>
                <div className={'btn-container'}>
                    <Button type="primary" onClick={()=>handleSave()}>{editingDiamond ? "Update" : "Add"}</Button>
                    <Button onClick={() => { resetForm(); setEditingDiamond(null); }}>Reset</Button>
                </div>
            </Form>
        </div>
    );
};

export default DiamondForm;
