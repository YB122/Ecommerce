import * as React from 'react';
import {
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Box,
    ListItemButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface Props {
    order: any;
}

export const PendingOrder = (props: Props) => {
    const { order } = props;

    let itemsCount = 0;
    try {
        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        itemsCount = Array.isArray(items) ? items.length : 0;
    } catch {}

    return (
        <ListItem disablePadding>
            <ListItemButton component={Link} to={`/orders/${order.id}`}>
                <ListItemAvatar>
                    <Avatar>
                        <ShoppingCartIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={new Date(order.createdAt).toLocaleString('en-GB')}
                    secondary={`${itemsCount} item(s)`}
                />
                <Box
                    component="span"
                    sx={{
                        marginRight: '1em',
                        color: 'text.primary',
                    }}
                >
                    EGP {order.totalAmount}
                </Box>
            </ListItemButton>
        </ListItem>
    );
};
