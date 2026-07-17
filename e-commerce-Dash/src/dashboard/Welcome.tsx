import * as React from 'react';
import { Box, Card, CardActions, Button, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import { motion } from 'motion/react';
import { useTranslate } from 'react-admin';

import publishArticleImage from './welcome_illustration.svg';

const Welcome = () => {
    const translate = useTranslate();
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
        >
            <Card
                sx={{
                    background: theme =>
                        `linear-gradient(45deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.light} 50%, ${theme.palette.primary.dark} 100%)`,
                    color: theme => theme.palette.primary.contrastText,
                    padding: '20px',
                    marginTop: 2,
                    marginBottom: '1em',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                    }}
                >
                    <Box
                        sx={{
                            flex: '1',
                        }}
                    >
                        <Typography variant="h5" component="h2" gutterBottom>
                            {translate('pos.dashboard.welcome.title')}
                        </Typography>
                        <Box
                            sx={{
                                maxWidth: '40em',
                            }}
                        >
                            <Typography variant="body1" component="p" gutterBottom>
                                {translate('pos.dashboard.welcome.subtitle')}
                            </Typography>
                        </Box>
                        <CardActions
                            sx={{
                                padding: { xs: 0, xl: null },
                                flexWrap: { xs: 'wrap', xl: null },
                                '& a': {
                                    marginTop: { xs: '1em', xl: null },
                                    marginInlineStart: { xs: '0!important', xl: null },
                                    marginInlineEnd: { xs: '1em', xl: null },
                                },
                            }}
                        >
                            <Button
                                variant="contained"
                                href="https://marmelab.com/react-admin"
                                startIcon={<HomeIcon />}
                            >
                                {translate('pos.dashboard.welcome.ra_button')}
                            </Button>
                            <Button
                                variant="contained"
                                href="https://github.com/marmelab/react-admin/tree/master/examples/demo"
                                startIcon={<CodeIcon />}
                            >
                                {translate('pos.dashboard.welcome.demo_button')}
                            </Button>
                        </CardActions>
                    </Box>
                    <Box
                        sx={{
                            display: { xs: 'none', sm: 'none', md: 'block' },
                            width: '16em',
                            height: '9em',
                            overflow: 'hidden',
                            background: `url(${publishArticleImage}) top right / cover`,
                            marginInlineStart: 'auto',
                        }}
                    />
                </Box>
            </Card>
        </motion.div>
    );
};

export default Welcome;
