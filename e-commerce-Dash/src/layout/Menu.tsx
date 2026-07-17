import * as React from 'react';
import { useState } from 'react';
import { Box } from '@mui/material';
import {
    useTranslate,
    DashboardMenuItem,
    MenuItemLink,
    MenuProps,
    useSidebarState,
} from 'react-admin';

import users from '../users';
import orders from '../orders';
import products from '../products';
import categories from '../categories';
import subcategories from '../subcategories';
import SubMenu from './SubMenu';

type MenuName = 'menuCatalog' | 'menuSales' | 'menuUsers';

const Menu = ({ dense = false }: MenuProps) => {
    const [state, setState] = useState({
        menuCatalog: true,
        menuSales: true,
        menuUsers: true,
    });
    const translate = useTranslate();
    const [open] = useSidebarState();

    const handleToggle = (menu: MenuName) => {
        setState(state => ({ ...state, [menu]: !state[menu] }));
    };

    return (
        <Box
            sx={{
                width: open ? 200 : 50,
                marginTop: 1,
                marginBottom: 1,
                transition: theme =>
                    theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
            }}
        >
            <DashboardMenuItem />
            <SubMenu
                handleToggle={() => handleToggle('menuSales')}
                isOpen={state.menuSales}
                name="pos.menu.sales"
                icon={<orders.icon />}
                dense={dense}
            >
                <MenuItemLink
                    to="/orders"
                    state={{ _scrollToTop: true }}
                    primaryText={translate('pos.menu.orders')}
                    leftIcon={<orders.icon />}
                    dense={dense}
                />
            </SubMenu>
            <SubMenu
                handleToggle={() => handleToggle('menuCatalog')}
                isOpen={state.menuCatalog}
                name="pos.menu.catalog"
                icon={<products.icon />}
                dense={dense}
            >
                <MenuItemLink
                    to="/products"
                    state={{ _scrollToTop: true }}
                    primaryText={translate('pos.menu.products')}
                    leftIcon={<products.icon />}
                    dense={dense}
                />
                <MenuItemLink
                    to="/categories"
                    state={{ _scrollToTop: true }}
                    primaryText={translate('pos.menu.categories')}
                    leftIcon={<categories.icon />}
                    dense={dense}
                />
                <MenuItemLink
                    to="/subcategories"
                    state={{ _scrollToTop: true }}
                    primaryText={translate('pos.menu.subcategories')}
                    leftIcon={<subcategories.icon />}
                    dense={dense}
                />
            </SubMenu>
            <SubMenu
                handleToggle={() => handleToggle('menuUsers')}
                isOpen={state.menuUsers}
                name="pos.menu.account"
                icon={<users.icon />}
                dense={dense}
            >
                <MenuItemLink
                    to="/users"
                    state={{ _scrollToTop: true }}
                    primaryText={translate('pos.menu.my_profile')}
                    leftIcon={<users.icon />}
                    dense={dense}
                />
            </SubMenu>
        </Box>
    );
};

export default Menu;
