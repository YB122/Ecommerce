import * as React from 'react';
import { Layout } from 'react-admin';
import { motion } from 'motion/react';
import AppBar from './AppBar';
import Menu from './Menu';
import { RTLWrapper } from './RTLWrapper';

export default ({ children }: { children: React.ReactNode }) => (
    <RTLWrapper>
        <Layout
            appBar={AppBar}
            menu={Menu}
            sx={{
                backgroundColor: theme =>
                    (theme.vars || theme).palette.background.default,
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
            >
                {children}
            </motion.div>
        </Layout>
    </RTLWrapper>
);
