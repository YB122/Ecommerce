import * as React from 'react';
import {
    List,
    Datagrid,
    TextField,
    NumberField,
    DateField,
    EditButton,
    SelectField,
    useDefaultTitle,
    useListContext,
    SearchInput,
    FunctionField,
} from 'react-admin';

const OrdersTitle = () => {
    const title = useDefaultTitle();
    const { defaultTitle } = useListContext();
    return (
        <>
            <title>{`${title} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const ordersFilters = [
    <SearchInput source="q" alwaysOn />,
];

const OrderList = () => (
    <List
        sort={{ field: 'createdAt', order: 'DESC' }}
        perPage={25}
        filters={ordersFilters}
        title={<OrdersTitle />}
    >
        <Datagrid rowClick="edit">
            <TextField source="id" label="Order ID" />
            <DateField source="createdAt" showTime />
            <FunctionField
                label="Items"
                render={record => {
                    try {
                        const items = typeof record.items === 'string' ? JSON.parse(record.items) : record.items;
                        return Array.isArray(items) ? items.length : 0;
                    } catch { return 0; }
                }}
            />
            <NumberField source="totalAmount" options={{ style: 'currency', currency: 'EGP' }} />
            <SelectField
                source="paymentMethod"
                choices={[
                    { id: 'cod', name: 'COD' },
                    { id: 'card', name: 'Card' },
                ]}
            />
            <SelectField
                source="paymentStatus"
                choices={[
                    { id: 'pending', name: 'Pending' },
                    { id: 'paid', name: 'Paid' },
                    { id: 'failed', name: 'Failed' },
                ]}
            />
            <SelectField
                source="orderStatus"
                choices={[
                    { id: 'pending', name: 'Pending' },
                    { id: 'processing', name: 'Processing' },
                    { id: 'shipped', name: 'Shipped' },
                    { id: 'delivered', name: 'Delivered' },
                    { id: 'cancelled', name: 'Cancelled' },
                ]}
            />
            <EditButton />
        </Datagrid>
    </List>
);

export default OrderList;
