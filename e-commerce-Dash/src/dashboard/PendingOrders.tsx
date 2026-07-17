import * as React from 'react';
import { Card, CardHeader, List } from '@mui/material';
import { motion } from 'motion/react';
import { useTranslate } from 'react-admin';

import { Order } from '../types';
import { PendingOrder } from './PendingOrder';

interface Props {
    orders?: Order[];
}

const PendingOrders = (props: Props) => {
    const { orders = [] } = props;
    const translate = useTranslate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
        >
            <Card sx={{ flex: 1 }}>
                <CardHeader title={translate('pos.dashboard.pending_orders')} />
                <List dense={true}>
                    {orders.map((record, index) => (
                        <motion.div
                            key={record.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.25 }}
                        >
                            <PendingOrder order={record} />
                        </motion.div>
                    ))}
                </List>
            </Card>
        </motion.div>
    );
};

export default PendingOrders;
