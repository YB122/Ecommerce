import * as React from 'react';
import { Login as RaLogin, LoginForm } from 'react-admin';
import { motion } from 'motion/react';
import { RTLWrapper } from './RTLWrapper';

const Login = () => (
    <RTLWrapper>
        <RaLogin
            sx={{
                background: `linear-gradient(45deg, #1A237E 0%, #3F51B5 50%, #FF7483 100%)`,
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                <LoginForm />
            </motion.div>
        </RaLogin>
    </RTLWrapper>
);

export default Login;
