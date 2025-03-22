import React, {useEffect, useState} from "react";
import { Form, Button } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import CommonInput from "../../../CommonComponents/CommonInput";
import axios from "axios";
import {useSelector,useDispatch} from "react-redux";
import {RootState} from "../../../redux/store";
import {addBrokerAsync, editBrokerAsync} from "../slice/sliceIndex";
import CommonCheckbox from "../../../CommonComponents/CommonCheckbox";
const initialValues = {
    name: "",
    email: "",
    phone: "",
    address: "",
    brokerRate: "",
    status:""
}
const setInitialFormValues = (selectedContract, setFieldValue) => {
    Object.keys(initialValues)?.forEach((fieldName) => {
        setFieldValue(fieldName, selectedContract[fieldName]);
    });
};
const BrokerForm = ({ editingBroker, setEditingBroker }) => {
    console.log(editingBroker, "editBroker")
    const dispatch = useDispatch();
    const { brokers, loading, error } = useSelector((state: RootState) => state.brokers);
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        phone: Yup.string().matches(/^\d+$/, "Phone number must be numeric").required("Phone number is required"),
        address: Yup.string().required("Address is required"),
        brokerRate: Yup.number()
            .min(1, "Broker rate must be at least 1%")
            .max(100, "Broker rate cannot exceed 100%")
            .required("Broker rate is required"),
        status:Yup.boolean()
    });
    const onSubmit =async () =>{
      await  validateForm().then((errors) => {
            if (Object.keys(errors).length === 0) {
                const newBroker = {
                    name: values?.name,
                    email: values?.email,
                    phone:values?.phone,
                    address: values?.address,
                    brokerRate: values?.brokerRate,
                    status:values?.status
                };

                // Send data to JSON Server
                if (editingBroker) {
                    // Update existing broker
                    dispatch(editBrokerAsync({ id: editingBroker?.id, brokerData: newBroker }));
                    setEditingBroker(null)
                } else {
                    // Add new broker
                    dispatch(addBrokerAsync(newBroker));
                }


                resetForm();
            } else {
                console.log("errors", errors)
            }
        });
    }
    const {values, errors,setFieldValue,validateForm,resetForm,setErrors,validateField} = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
        validateOnChange: false,
        validateOnMount: false,
        validateOnBlur: false,
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFieldValue(name,value.trim()).then(() =>
            validateField(name)
        )
    };

    useEffect(() => {
        if (editingBroker) {
                setInitialFormValues(editingBroker, setFieldValue);
                setTimeout(() => {
                    validateForm(); // Validate after setting values
                }, 0);


        }
    }, [editingBroker]);

    return (
        <div className="broker-form">
            <Form layout="vertical" >
                <div className="form-row">
                <CommonInput
                    label="Name"
                    name="name"
                    value={values.name}
                    error={errors?.name}
                    onChange={(e)=>handleChange(e)}
                    placeholder={"Enter Name"}

                />
                <CommonInput
                    label="Email"
                    name="email"
                    type="email"
                    value={values?.email}
                    error={errors?.email}
                    onChange={(e)=>handleChange(e)}
                    placeholder={"Enter Email"}
                />
                <CommonInput
                    label="Phone No"
                    name="phone"
                    value={values?.phone}
                    error={errors?.phone}
                    onChange={(e)=>handleChange(e)}
                    placeholder={"Enter Number"}
                />
                <CommonInput
                    label="Address"
                    name="address"
                    value={values?.address}
                    error={errors?.address}
                    onChange={(e)=>handleChange(e)}
                    placeholder={"Enter Finish No"}

                />
                </div>
                <div className={'form-row'}>
                <CommonInput
                    label="Broker Rate (%)"
                    name="brokerRate"
                    type="number"
                    value={values?.brokerRate}
                    error={errors?.brokerRate}
                    onChange={(e)=>handleChange(e)}
                    min={0}
                    placeholder={'Enter Broker Rate'}

                />
                <div className="form-checkbox">
                    <label>Status</label>
                    <CommonCheckbox checked={values?.status} onChange={(e) =>setFieldValue("status",e.target.checked).then(() =>
                        validateField("status")
                    )} />
                </div>
                </div>
               <div className={'btn-container'}>
                   <Button type="primary" onClick={()=>onSubmit()}  disabled={loading}>
                       {editingBroker  ?  "Update": "Add"}
                   </Button>
                   <Button  onClick={()=>{resetForm(); setEditingBroker(null)}} >
                       Reset
                   </Button>
               </div>
            </Form>
        </div>
    );
};

export default BrokerForm;
