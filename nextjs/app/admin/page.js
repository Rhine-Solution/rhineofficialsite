'use client';
import { useState, useEffect } from 'react';
import { Card, Title, Text, AreaChart, BarChart, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Grid, Metric, Tab, TabList, TabGroup, TabPanel, TabPanels, BadgeDelta, ProgressBar, TextInput, Select, SelectItem, Flex, Button } from '@tremor/react';
import { TrendingUp, Users, ShoppingBag, Clock, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://crqjedivobupxbbathux.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWplZGl2b2J1cHhiYmF0aHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA5MDEsImV4cCI6MjA5MDM2NjkwMX0.0_HAu_sj7j-3racZK9nWIghKdNEXWRTHgLme2sUMAhM'

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`
}

// Target values for progress bars
const TARGETS = {
  revenue: 50000,    // Monthly revenue target
  users: 500,         // User growth target
  orders: 200,        // Monthly orders target
  bookings: 50       // Monthly bookings target
};

export default function AdminDashboard() {
  // Overview data
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  
  // Stats with trends
  const [stats, setStats] = useState({ 
    revenue: 0, users: 0, orders: 0, pending: 0,
    prevRevenue: 0, prevUsers: 0, prevOrders: 0, prevPending: 0 
  });
  
  const [loading, setLoading] = useState(true);
  
  // Filters & pagination
  const [dateRange, setDateRange] = useState('7');
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Calculate date range
  const getDateRange = () => {
    const days = parseInt(dateRange);
    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const prevStart = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);
    return { 
      current: { start: start.toISOString(), end: end.toISOString() },
      previous: { start: prevStart.toISOString(), end: start.toISOString() }
    };
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  useEffect(() => {
    setCurrentPage(1);
  }, [orderSearch, statusFilter]);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      const dateRangeData = getDateRange();
      
      // Current period stats
      const [ordersRes, usersRes, pendingRes, prevOrdersRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/orders?created_at=gte.${dateRangeData.current.start}&select=total,created_at`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/users?created_at=gte.${dateRangeData.current.start}&select=id`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/appointments?status=eq.pending&select=id`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/orders?created_at=gte.${dateRangeData.previous.start}&created_at=lt.${dateRangeData.current.start}&select=total`, { headers })
      ]);

      const ordersData = await ordersRes.json();
      const usersData = await usersRes.json();
      const pendingData = await pendingRes.json();
      const prevOrdersData = await prevOrdersRes.json();

      const currentRevenue = Array.isArray(ordersData) ? ordersData.reduce((sum, o) => sum + (o.total || 0), 0) : 0;
      const prevRevenue = Array.isArray(prevOrdersData) ? prevOrdersData.reduce((sum, o) => sum + (o.total || 0), 0) : 0;

      // Calculate trends
      const calcTrend = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      setStats({ 
        revenue: currentRevenue,
        users: Array.isArray(usersData) ? usersData.length : 0,
        orders: Array.isArray(ordersData) ? ordersData.length : 0,
        pending: Array.isArray(pendingData) ? pendingData.length : 0,
        prevRevenue: prevRevenue,
        prevUsers: 0, // Previous period users - simplified
        prevOrders: Array.isArray(prevOrdersData) ? prevOrdersData.length : 0,
        prevPending: 0
      });

      // Revenue over time chart
      const dailyRevenue = {};
      Array.isArray(ordersData) && ordersData.forEach(o => {
        const date = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dailyRevenue[date] = (dailyRevenue[date] || 0) + (o.total || 0);
      });
      setRevenueData(Object.entries(dailyRevenue).map(([date, Revenue]) => ({ date, Revenue })));

      // Top products
      const itemsRes = await fetch(`${SUPABASE_URL}/rest/v1/order_items?created_at=gte.${dateRangeData.current.start}&select=quantity,products(name)&limit=50`, { headers });
      const itemsData = await itemsRes.json();
      const productSales = {};
      Array.isArray(itemsData) && itemsData.forEach(i => { 
        if (i.products?.name) productSales[i.products.name] = (productSales[i.products.name] || 0) + i.quantity; 
      });
      setTopProducts(Object.entries(productSales).map(([name, Sales]) => ({ name, Sales })).sort((a,b) => b.Sales - a.Sales).slice(0,5));

      // All orders for detailed table
      const allOrdersRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=id,total,status,created_at,users(email)&order=created_at.desc&limit=100`, { headers });
      const allOrdersData = await allOrdersRes.json();
      setAllOrders(Array.isArray(allOrdersData) ? allOrdersData : []);
      
      // Recent orders (first 5 for overview)
      setRecentOrders(allOrdersData.slice(0, 5));

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setLoading(false);
    }
  }

  // Calculate progress percentages
  const getProgress = (current, target) => Math.min((current / target) * 100, 100);

  // Calculate delta type for BadgeDelta
  const getDeltaType = (trend) => {
    if (trend >= 10) return 'increase';
    if (trend > 0) return 'moderateIncrease';
    if (trend === 0) return 'unchanged';
    if (trend >= -10) return 'moderateDecrease';
    return 'decrease';
  };

  // Filter orders
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = !orderSearch || 
      order.id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.users?.email?.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Paginate
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Stat cards with trend and progress
  const statCards = [
    { 
      title: 'Total Revenue', 
      value: stats.revenue, 
      prevValue: stats.prevRevenue,
      icon: TrendingUp, 
      color: 'blue',
      target: TARGETS.revenue,
      format: (v) => `$${v.toFixed(2)}`
    },
    { 
      title: 'Total Users', 
      value: stats.users, 
      prevValue: stats.prevUsers,
      icon: Users, 
      color: 'green',
      target: TARGETS.users,
      format: (v) => v
    },
    { 
      title: 'Total Orders', 
      value: stats.orders, 
      prevValue: stats.prevOrders,
      icon: ShoppingBag, 
      color: 'purple',
      target: TARGETS.orders,
      format: (v) => v
    },
    { 
      title: 'Pending Bookings', 
      value: stats.pending, 
      prevValue: stats.prevPending,
      icon: Clock, 
      color: 'yellow',
      target: TARGETS.bookings,
      format: (v) => v
    },
  ];

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <Text>Loading dashboard...</Text>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title>Dashboard</Title>
          <Text>Overview of your business performance</Text>
        </div>
        <Select value={dateRange} onValueChange={setDateRange} className="w-40">
          <SelectItem value="7">Last 7 days</SelectItem>
          <SelectItem value="30">Last 30 days</SelectItem>
          <SelectItem value="90">Last 90 days</SelectItem>
        </Select>
      </div>
      
      <TabGroup>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Detailed Orders</Tab>
        </TabList>
        
        <TabPanels>
          {/* Overview Tab */}
          <TabPanel className="mt-6 space-y-6">
            {/* KPI Cards with Delta and Progress */}
            <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
              {statCards.map((stat, i) => {
                const trend = stat.prevValue ? ((stat.value - stat.prevValue) / stat.prevValue) * 100 : 0;
                const progress = getProgress(stat.value, stat.target);
                
                return (
                  <Card key={i} decoration="top" decorationColor={stat.color}>
                    <Flex justifyContent="start" alignItems="start" className="space-x-2">
                      <Text>{stat.title}</Text>
                      <BadgeDelta deltaType={getDeltaType(trend)} isIncreasePositive={true}>
                        {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
                      </BadgeDelta>
                    </Flex>
                    <Metric className="mt-2">{stat.format(stat.value)}</Metric>
                    <ProgressBar value={progress} color={stat.color} className="mt-3" />
                    <Flex className="mt-2">
                      <Text className="text-xs text-gray-500 dark:text-zinc-400">
                        {progress.toFixed(0)}% of ${stat.target.toLocaleString()} target
                      </Text>
                    </Flex>
                  </Card>
                );
              })}
            </Grid>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <Title>Revenue Over Time</Title>
                <Text>Daily revenue for selected period</Text>
                <AreaChart 
                  className="h-72 mt-4" 
                  data={revenueData} 
                  index="date" 
                  categories={['Revenue']} 
                  colors={['blue']} 
                  valueFormatter={(v) => `$${v.toFixed(2)}`} 
                  showLegend={false}
                  showAnimation
                />
              </Card>
              <Card>
                <Title>Top Products</Title>
                <Text>Best selling products by quantity</Text>
                <BarChart 
                  className="h-72 mt-4" 
                  data={topProducts} 
                  index="name" 
                  categories={['Sales']} 
                  colors={['blue']} 
                  valueFormatter={(v) => `${v} units`} 
                  showLegend={false}
                  layout="vertical"
                  showAnimation
                />
              </Card>
            </div>
            
            {/* Recent Orders */}
            <Card>
              <Title>Recent Orders</Title>
              <Text>Latest orders from your customers</Text>
              <Table className="mt-4">
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Order ID</TableHeaderCell>
                    <TableHeaderCell>Customer</TableHeaderCell>
                    <TableHeaderCell>Total</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Date</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.id?.slice(0,8)}</TableCell>
                      <TableCell>{order.users?.email || 'Guest'}</TableCell>
                      <TableCell className="font-medium">${(order.total || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge color={
                          order.status === 'completed' ? 'green' : 
                          order.status === 'pending' ? 'yellow' : 
                          order.status === 'cancelled' ? 'red' : 'gray'
                        }>
                          {order.status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabPanel>
          
          {/* Detailed Orders Tab */}
          <TabPanel className="mt-6 space-y-6">
            <Card>
              <Flex className="flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <Title>All Orders</Title>
                  <Text>Complete order history with filtering</Text>
                </div>
                <Flex className="space-x-2">
                  <TextInput
                    placeholder="Search by ID or email..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-48"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter} className="w-32">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </Select>
                </Flex>
              </Flex>
              
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Order ID</TableHeaderCell>
                    <TableHeaderCell>Customer</TableHeaderCell>
                    <TableHeaderCell>Total</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Date</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.id?.slice(0,8)}</TableCell>
                      <TableCell>{order.users?.email || 'Guest'}</TableCell>
                      <TableCell className="font-medium">${(order.total || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge color={
                          order.status === 'completed' ? 'green' : 
                          order.status === 'pending' ? 'yellow' : 
                          order.status === 'processing' ? 'blue' :
                          order.status === 'cancelled' ? 'red' : 'gray'
                        }>
                          {order.status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              <Flex className="mt-4 justify-between items-center">
                <Text className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * ordersPerPage) + 1} to {Math.min(currentPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                </Text>
                <Flex className="space-x-2">
                  <Button
                    size="xs"
                    variant="secondary"
                    icon={ChevronLeftIcon}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    size="xs"
                    variant="secondary"
                    icon={ChevronRightIcon}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next
                  </Button>
                </Flex>
              </Flex>
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}