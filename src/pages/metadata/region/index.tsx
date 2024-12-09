import { DeleteOutlined, EditOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, type TableProps, Tooltip } from 'antd';
import React from 'react';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DataType {
    key: React.ReactNode;
    name: string;
    age: number;
    address: string;
    children?: DataType[];
}

const columns: ProColumns[] = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: '12%',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        width: '30%',
        key: 'address',
    },
    {
        title: '操作',
        dataIndex: 'operation',
        width: '12%',
        key: 'operation',
        hideInSearch: true,
        render: () => {
            return (
                <div className='flex gap-2'>
                    <Tooltip title="编辑">
                        <Button type="primary" variant="outlined" size="small" icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title="新增子区域">
                        <Button variant="outlined" size="small" icon={<PlusOutlined />} />
                    </Tooltip>
                    <Tooltip title="删除">
                        <Button danger size="small" icon={<DeleteOutlined />} />
                    </Tooltip>
                </div>
            );
        }
    }
];

const rowSelection: TableRowSelection<DataType> = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
    },
};

const RegionSetting: React.FC = () => {
    return (
        <PageContainer title="行政区域">
            <ProTable
                columns={columns}
                rowSelection={{ ...rowSelection, checkStrictly: true }}
                toolBarRender={() => [
                    <Button variant="filled" icon={<ImportOutlined />}>导入</Button>,
                    <Button type="primary" icon={<PlusOutlined />}>新增</Button>
                ]}
                request={async () => {
                    return {
                        data: [
                            {
                                key: 1,
                                name: 'John Brown sr.',
                                age: 60,
                                address: 'New York No. 1 Lake Park',
                                children: [
                                    {
                                        key: 11,
                                        name: 'John Brown',
                                        age: 42,
                                        address: 'New York No. 2 Lake Park',
                                    },
                                    {
                                        key: 12,
                                        name: 'John Brown jr.',
                                        age: 30,
                                        address: 'New York No. 3 Lake Park',
                                        children: [
                                            {
                                                key: 121,
                                                name: 'Jimmy Brown',
                                                age: 16,
                                                address: 'New York No. 3 Lake Park',
                                            },
                                        ],
                                    },
                                    {
                                        key: 13,
                                        name: 'Jim Green sr.',
                                        age: 72,
                                        address: 'London No. 1 Lake Park',
                                        children: [
                                            {
                                                key: 131,
                                                name: 'Jim Green',
                                                age: 42,
                                                address: 'London No. 2 Lake Park',
                                                children: [
                                                    {
                                                        key: 1311,
                                                        name: 'Jim Green jr.',
                                                        age: 25,
                                                        address: 'London No. 3 Lake Park',
                                                    },
                                                    {
                                                        key: 1312,
                                                        name: 'Jimmy Green sr.',
                                                        age: 18,
                                                        address: 'London No. 4 Lake Park',
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                key: 2,
                                name: 'Joe Black',
                                age: 32,
                                address: 'Sydney No. 1 Lake Park',
                            },
                        ],
                        success: true,
                    };
                }}
            />
        </PageContainer>
    );
};

export default RegionSetting;