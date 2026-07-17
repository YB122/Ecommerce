import * as React from 'react';
import {
    Edit,
    SimpleForm,
    SelectInput,
    TextField,
    NumberField,
    DateField,
    Labeled,
    useRecordContext,
    useDefaultTitle,
    useEditContext,
    FunctionField,
} from 'react-admin';
import { Card, CardContent, Box, Grid, Typography } from '@mui/material';

const OrderTitle = () => {
    const appTitle = useDefaultTitle();
    const { defaultTitle } = useEditContext();
    return (
        <>
            <title>{`${appTitle} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const OrderDetails = () => {
    const record = useRecordContext();
    if (!record) return null;

    let items: any[] = [];
    try {
        items = typeof record.items === 'string' ? JSON.parse(record.items) : record.items || [];
    } catch {}

    let address: any = {};
    try {
        address = typeof record.shippingAddress === 'string' ? JSON.parse(record.shippingAddress) : record.shippingAddress || {};
    } catch {}

    return (
        <Box sx={{ maxWidth: '50em' }}>
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Order Summary</Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <Labeled label="Order ID">
                                <TextField source="id" />
                            </Labeled>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Labeled label="Date">
                                <DateField source="createdAt" showTime />
                            </Labeled>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Labeled label="Payment Method">
                                <TextField source="paymentMethod" />
                            </Labeled>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Labeled label="Total">
                                <NumberField source="totalAmount" options={{ style: 'currency', currency: 'EGP' }} />
                            </Labeled>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Labeled label="Shipping Cost">
                                <NumberField source="shippingCost" options={{ style: 'currency', currency: 'EGP' }} />
                            </Labeled>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Shipping Address</Typography>
                    {address.fullName && <Typography>{address.fullName}</Typography>}
                    {address.phone && <Typography>Phone: {address.phone}</Typography>}
                    {address.street && <Typography>{address.street}</Typography>}
                    {address.city && address.state && (
                        <Typography>{address.city}, {address.state} {address.zipCode}</Typography>
                    )}
                    {address.country && <Typography>{address.country}</Typography>}
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Items ({items.length})</Typography>
                    {items.map((item: any, idx: number) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                            <Box>
                                <Typography>{item.en_name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.color} / {item.size} x {item.quantity}
                                </Typography>
                            </Box>
                            <Typography>EGP {item.price}</Typography>
                        </Box>
                    ))}
                </CardContent>
            </Card>
        </Box>
    );
};

const OrderEdit = () => (
    <Edit title={<OrderTitle />}>
        <SimpleForm>
            <OrderDetails />
            <SelectInput
                source="orderStatus"
                label="Order Status"
                choices={[
                    { id: 'pending', name: 'Pending' },
                    { id: 'processing', name: 'Processing' },
                    { id: 'shipped', name: 'Shipped' },
                    { id: 'delivered', name: 'Delivered' },
                    { id: 'cancelled', name: 'Cancelled' },
                ]}
                fullWidth
            />
            <SelectInput
                source="paymentStatus"
                label="Payment Status"
                choices={[
                    { id: 'pending', name: 'Pending' },
                    { id: 'paid', name: 'Paid' },
                    { id: 'failed', name: 'Failed' },
                ]}
                fullWidth
            />
        </SimpleForm>
    </Edit>
);

export default OrderEdit;
