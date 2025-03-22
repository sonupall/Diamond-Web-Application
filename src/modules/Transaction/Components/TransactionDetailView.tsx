
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Select, Table, Button, Card, Row, Col, Spin, message, Form} from "antd";
import { RootState } from "../../../redux/store";
import {
    fetchBrokersAsync,
    fetchDiamondsAsync,
    purchaseDiamondsAsync,
    setSelectedDiamonds,
} from "../slice/transactionSlice";

const { Option } = Select;
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const TransactionModule: React.FC = () => {
    const dispatch = useDispatch();
    const { brokers, diamonds, selectedDiamonds, loading } = useSelector(
        (state: RootState) => state.transaction
    );
    const [selectedBroker, setSelectedBroker] = useState(brokers[0]);

    useEffect(() => {
        dispatch(fetchBrokersAsync());
        dispatch(fetchDiamondsAsync());
    }, [dispatch]);

    const handleBrokerChange = (brokerId: number) => {
        const broker = brokers.find((b) => b.id === brokerId);
        setSelectedBroker(broker);
    };

    const handlePurchases = () => {
        if (selectedDiamonds.length === 0) {
            message.warning("Please select at least one diamond.");
            return;
        }
        dispatch(purchaseDiamondsAsync(selectedDiamonds));
        message.success("Purchase successful!");
    };

    const rowSelection = {
        selectedRowKeys: selectedDiamonds.map((item) => item.id),
        onChange: (selectedRowKeys, selectedRows) => {
            dispatch(setSelectedDiamonds(selectedRows));
        },
    };

    const totalQty = selectedDiamonds.reduce((acc, item) => acc + (item.quantity || 0), 0);
    const totalCts = selectedDiamonds.reduce((acc, item) => acc + (item.carats || 0), 0);
    const totalAmount = selectedDiamonds.reduce((acc, item) => acc + (item.amount || 0), 0);
    const avgDiscount = totalQty > 0 ? (totalAmount / totalQty).toFixed(2) : "0.00";

    const summaryData = [
        { key: "1", summary: "Qty", total: diamonds.length, selected: totalQty, billAmount: totalAmount },
        { key: "2", summary: "Total Cts", total: diamonds.reduce((acc, item) => acc + (item.carats || 0), 0), selected: totalCts, billAmount: totalAmount },
        { key: "3", summary: "Avg Discount", total: "-", selected: avgDiscount, billAmount: "-" },
        { key: "4", summary: "Total Amount", total: diamonds.reduce((acc, item) => acc + (item.amount || 0), 0), selected: totalAmount, billAmount: totalAmount },
    ];

 useEffect(()=>{
     setSelectedBroker(brokers[0])
 },[brokers])


    const handlePurchase = () => {
        if (selectedDiamonds.length === 0) {
            message.warning("Please select at least one diamond.");
            return;
        }
        dispatch(purchaseDiamondsAsync(selectedDiamonds));
        message.success("Purchase successful!");
    };

    const handleSendInvoiceEmail = async () => {
        if (selectedDiamonds.length === 0) {
            message.warning("Please select at least one diamond.");
            return;
        }

        try {
            await axios.post("/api/send-invoice-email", {
                brokerId: selectedBroker?.id,
                diamonds: selectedDiamonds,
            });

            message.success("Invoice email sent successfully!");
        } catch (error) {
            message.error("Failed to send invoice email.");
        }
    };

    const handleDownloadInvoice = () => {
        if (selectedDiamonds.length === 0) {
            message.warning("Please select at least one diamond before downloading.");
            return;
        }

        const doc = new jsPDF();

        // Add Title
        doc.setFontSize(18);
        doc.text("Invoice", 14, 20);

        // Add Broker Details
        doc.setFontSize(12);
        doc.text(`Broker Name: ${selectedBroker.name}`, 14, 30);
        doc.text(`Email: ${selectedBroker.email}`, 14, 40);
        doc.text(`Phone: ${selectedBroker.phone}`, 14, 50);
        doc.text(`Address: ${selectedBroker.address}`, 14, 60);
        // Table for Diamonds
        const tableColumn = ["ID", "Carats", "Amount", "Quantity"];
        const tableRows = selectedDiamonds.map((diamond) => [
            diamond.id,
            diamond.carat,
            diamond.totalAmount,
            5,
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 70,
        });

        // Save PDF
        doc.save(`Invoice_${selectedBroker.name}.pdf`);
    };

    return (
        <div style={{ padding: "20px", background: "#f8f9fc", borderRadius: "8px" }}>
            {loading ? (
                <Spin size="large" />
            ) : (
                <>
                    <Row gutter={16}>
                        <Col span={10}>
                            <Card title="Broker Details">
                                {selectedBroker && (
                                    <div>
                                        <p><strong>Name:</strong> {selectedBroker.name}</p>
                                        <p><strong>Email:</strong> {selectedBroker.email}</p>
                                        <p><strong>Phone:</strong> {selectedBroker.phone}</p>
                                        <p><strong>Address:</strong> {selectedBroker.address}</p>
                                        <p><strong>Broker Rate:</strong> {selectedBroker.brokerRate}%</p>
                                    </div>
                                )}
                            </Card>
                        </Col>
                        <Col span={14}>
                            <Card title="Summary" className={'summary-table'}>
                                <Table
                                    columns={[
                                        { title: "Summary", dataIndex: "summary", key: "summary" },
                                        { title: "Total", dataIndex: "total", key: "total" },
                                        { title: "Selected", dataIndex: "selected", key: "selected" },
                                        { title: "Bill Amount", dataIndex: "billAmount", key: "billAmount" },
                                    ]}
                                    dataSource={summaryData}
                                    pagination={false}
                                    bordered
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: "20px", justifyContent: "end" }}>

                        <div className={'btn-container'}>
                            <div>
                                <span style={{ fontWeight: "bold", marginRight: "10px" }}>Broker Name</span>
                                <Select
                                    value={selectedBroker?.id}
                                    style={{ width: 200 }}
                                    onChange={handleBrokerChange}
                                >
                                    {brokers.map((broker) => (
                                        <Option key={broker.id} value={broker.id}>
                                            {broker.name}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <Button type="primary" onClick={handlePurchase}>Purchase</Button>
                            <Button  className='delete-btn' onClick={()=>handleDownloadInvoice()}>
                                Download
                            </Button>
                            <Button type="dashed" onClick={handleSendInvoiceEmail}>
                                Send Invoice Email
                            </Button>
                        </div>
                    </Row>


                </>
            )}
        </div>
    );
};

export default TransactionModule;

