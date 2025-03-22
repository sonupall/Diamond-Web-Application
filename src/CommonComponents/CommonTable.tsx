import React from "react";
import { Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import CommonCheckbox from "./CommonCheckbox";

interface Column {
    key: string;
    label: string;
}

interface TableRow {
    key: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    brokerRate: string;
    status: boolean;
}

interface CommonTableProps {
    columns: Column[];
    data: TableRow[];
    onEdit: (row: TableRow) => void;
    onDelete: (row: TableRow) => void;
    rowSelection?: {
        type: "radio";
        selectedRowKeys: React.Key[];
        onChange: (selectedRowKeys: React.Key[], selectedRows: TableRow[]) => void;
    };
    onStatusChange: (row: TableRow, checked: boolean) => void;
    isNotAction: boolean;
}

const CommonTable: React.FC<CommonTableProps> = ({
                                                     columns,
                                                     data,
                                                     onEdit,
                                                     onDelete,
                                                     onStatusChange,
                                                     rowSelection,
                                                     isNotAction
                                                 }) => {
    // Define Ant Design Table Columns
    const tableColumns: ColumnsType<TableRow> = [
        ...columns.map((column) => ({
            title: column.label,
            dataIndex: column.key,
            key: column.key,
            render: (text: any, record: TableRow) =>

                column.key === "status" ? (

                    <CommonCheckbox checked={record.status} onChange={(checked) => onStatusChange(record, checked)} />
                ) : (
                    text
                ),
        })),
        ...(!isNotAction
            ? [
                {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                        <div className="action-buttons">
                            <Button type="primary" size="small"  onClick={() => onEdit(record)}>
                                Edit
                            </Button>
                            <Button danger type="primary" size="small" className="delete-btn" onClick={() => onDelete(record)}>
                                Delete
                            </Button>
                        </div>
                    ),
                },
            ]
            : []),
    ];

    return (
        <div className="custom-table-container">
            <Table
                rowSelection={rowSelection}
                columns={tableColumns}
                dataSource={data}
                pagination={{ pageSize: 5 }}
                bordered
            />
        </div>
    );
};

export default CommonTable;
