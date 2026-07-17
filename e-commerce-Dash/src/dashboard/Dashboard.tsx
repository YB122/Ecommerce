import React, { useMemo, CSSProperties, Suspense } from 'react';
import { Translate, useGetList } from 'react-admin';
import {
    useMediaQuery,
    Theme,
    Skeleton,
    Card,
    CardHeader,
    CardContent,
} from '@mui/material';
import { motion } from 'motion/react';
import { subDays, startOfDay } from 'date-fns';

import Welcome from './Welcome';
import MonthlyRevenue from './MonthlyRevenue';
import NbNewOrders from './NbNewOrders';
import PendingOrders from './PendingOrders';

interface State {
    nbNewOrders?: number;
    pendingOrders?: any[];
    recentOrders?: any[];
    revenue?: string;
}

const styles = {
    flex: { display: 'flex' },
    flexColumn: { display: 'flex', flexDirection: 'column' },
    leftCol: { flex: 1, marginInlineEnd: '0.5em' },
    rightCol: { flex: 1, marginInlineStart: '0.5em' },
    singleCol: { marginTop: '1em', marginBottom: '1em' },
};

const Spacer = () => <span style={{ width: '1em' }} />;
const VerticalSpacer = () => <span style={{ height: '1em' }} />;

const OrderChart = React.lazy(() => import('./OrderChart'));

const Dashboard = () => {
    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('lg')
    );
    const aMonthAgo = useMemo(() => subDays(startOfDay(new Date()), 30), []);

    const { data: orders, isPending: ordersLoading } = useGetList('orders', {
        filter: { date_gte: aMonthAgo.toISOString() },
        sort: { field: 'createdAt', order: 'DESC' },
        pagination: { page: 1, perPage: 50 },
    });

    const aggregation = useMemo<State>(() => {
        if (!orders) return {};
        const aggregations = orders
            .filter((order: any) => order.orderStatus !== 'cancelled')
            .reduce(
                (stats: any, order: any) => {
                    if (order.orderStatus !== 'cancelled') {
                        stats.revenue += order.totalAmount || 0;
                        stats.nbNewOrders++;
                    }
                    if (order.orderStatus === 'pending') {
                        stats.pendingOrders.push(order);
                    }
                    return stats;
                },
                {
                    revenue: 0,
                    nbNewOrders: 0,
                    pendingOrders: [],
                }
            );
        return {
            recentOrders: orders,
            revenue: aggregations.revenue.toLocaleString(undefined, {
                style: 'currency',
                currency: 'EGP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }),
            nbNewOrders: aggregations.nbNewOrders,
            pendingOrders: aggregations.pendingOrders,
        };
    }, [orders]);

    const { nbNewOrders, pendingOrders, revenue, recentOrders } = aggregation;
    const LoadingSkeleton = () => (
        <div>
            {isXSmall ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Skeleton variant="rounded" sx={{ height: 200 }} />
                    <Skeleton variant="rounded" sx={{ height: 120 }} />
                    <Skeleton variant="rounded" sx={{ height: 120 }} />
                    <Skeleton variant="rounded" sx={{ height: 300 }} />
                </div>
            ) : isSmall ? (
                <div>
                    <Skeleton variant="rounded" sx={{ width: '100%', height: 200, mb: 2 }} />
                    <div style={styles.flex}>
                        <Skeleton variant="rounded" sx={{ flex: 1, height: 120, mr: '0.5em' }} />
                        <Skeleton variant="rounded" sx={{ flex: 1, height: 120 }} />
                    </div>
                    <Skeleton variant="rounded" sx={{ width: '100%', height: 400, mt: 2 }} />
                    <Skeleton variant="rounded" sx={{ width: '100%', height: 200, mt: 2 }} />
                </div>
            ) : (
                <div style={styles.flex}>
                    <div style={styles.leftCol}>
                        <div style={styles.flex}>
                            <Skeleton variant="rounded" sx={{ flex: 1, height: 120, mr: '0.5em' }} />
                            <Skeleton variant="rounded" sx={{ flex: 1, height: 120 }} />
                        </div>
                        <div style={styles.singleCol}>
                            <Skeleton variant="rounded" sx={{ width: '100%', height: 400 }} />
                        </div>
                    </div>
                    <div style={styles.rightCol}>
                        <Skeleton variant="rounded" sx={{ width: '100%', height: 200 }} />
                    </div>
                </div>
            )}
        </div>
    );
    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
    } as const;
    const itemVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
    } as const;
    return ordersLoading ? <LoadingSkeleton /> : isXSmall ? (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
                <Welcome />
            </motion.div>
            <motion.div variants={itemVariants}>
                <MonthlyRevenue value={revenue} />
            </motion.div>
            <VerticalSpacer />
            <motion.div variants={itemVariants}>
                <NbNewOrders value={nbNewOrders} />
            </motion.div>
            <VerticalSpacer />
            <motion.div variants={itemVariants}>
                <PendingOrders orders={pendingOrders} />
            </motion.div>
        </motion.div>
    ) : isSmall ? (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} style={styles.singleCol}>
                <Welcome />
            </motion.div>
            <motion.div variants={itemVariants} style={styles.flex}>
                <MonthlyRevenue value={revenue} />
                <Spacer />
                <NbNewOrders value={nbNewOrders} />
            </motion.div>
            <motion.div variants={itemVariants} style={styles.singleCol}>
                <Card>
                    <CardHeader
                        title={
                            <Translate i18nKey="pos.dashboard.month_history" />
                        }
                    />
                    <CardContent>
                        <Suspense fallback={<Skeleton height={300} />}>
                            <OrderChart orders={recentOrders} />
                        </Suspense>
                    </CardContent>
                </Card>
            </motion.div>
            <motion.div variants={itemVariants} style={styles.singleCol}>
                <PendingOrders orders={pendingOrders} />
            </motion.div>
        </motion.div>
    ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
                <Welcome />
            </motion.div>
            <motion.div variants={itemVariants} style={styles.flex}>
                <div style={styles.leftCol}>
                    <div style={styles.flex}>
                        <MonthlyRevenue value={revenue} />
                        <Spacer />
                        <NbNewOrders value={nbNewOrders} />
                    </div>
                    <div style={styles.singleCol}>
                        <Card>
                            <CardHeader
                                title={
                                    <Translate i18nKey="pos.dashboard.month_history" />
                                }
                            />
                            <CardContent>
                                <Suspense fallback={<Skeleton height={300} />}>
                                    <OrderChart orders={recentOrders} />
                                </Suspense>
                            </CardContent>
                        </Card>
                    </div>
                    <div style={styles.singleCol}>
                        <PendingOrders orders={pendingOrders} />
                    </div>
                </div>
                <div style={styles.rightCol}>
                    <div style={styles.singleCol}>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
