'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Stethoscope,
  Building2,
  UserCog,
  CalendarCheck,
  Calendar,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getAdminDashboardData } from '@/actions/admin/dashboard.actions';
import {
  DashboardData,
  RecentAppointment,
  TopDoctor,
} from '@/types/admin.dashboard.type';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/Typography';

const STATUS_COLORS = {
  CONFIRMED: 'bg-green-500/10 text-green-600 border-green-500/20',
  CANCELLED: 'bg-red-500/10 text-red-600 border-red-500/20',
  COMPLETED: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

const SOURCE_COLORS = {
  PATIENT: '#8b5cf6',
  DOCTOR: '#06b6d4',
  SECRETARY: '#f59e0b',
};

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  trend?: { value: number; label: string };
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{title}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {description}
              </p>
            )}
            {trend && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />+{trend.value} {trend.label}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AppointmentStatusChart({
  data,
}: {
  data: { confirmed: number; cancelled: number; completed: number };
}) {
  const chartData = [
    { name: 'Confirmed', value: data.confirmed, fill: '#22c55e' },
    { name: 'Cancelled', value: data.cancelled, fill: '#ef4444' },
    { name: 'Completed', value: data.completed, fill: '#3b82f6' },
  ];

  const total = data.confirmed + data.cancelled + data.completed;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Appointment Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <ChartContainer
              config={{
                confirmed: { label: 'Confirmed', color: '#22c55e' },
                cancelled: { label: 'Cancelled', color: '#ef4444' },
                completed: { label: 'Completed', color: '#3b82f6' },
              }}
              className="h-[140px]"
            >
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </div>
          <div className="space-y-2">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-medium ml-auto">{item.value}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm pt-2 border-t">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium ml-auto">{total}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BookingSourceChart({
  data,
}: {
  data: { patient: number; doctor: number; secretary: number };
}) {
  const chartData = [
    { name: 'Patient', value: data.patient, fill: SOURCE_COLORS.PATIENT },
    { name: 'Doctor', value: data.doctor, fill: SOURCE_COLORS.DOCTOR },
    { name: 'Secretary', value: data.secretary, fill: SOURCE_COLORS.SECRETARY },
  ];

  const total = data.patient + data.doctor + data.secretary;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Booking Source</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <ChartContainer
              config={{
                patient: { label: 'Patient', color: SOURCE_COLORS.PATIENT },
                doctor: { label: 'Doctor', color: SOURCE_COLORS.DOCTOR },
                secretary: {
                  label: 'Secretary',
                  color: SOURCE_COLORS.SECRETARY,
                },
              }}
              className="h-[140px]"
            >
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </div>
          <div className="space-y-2">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-medium ml-auto">{item.value}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm pt-2 border-t">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium ml-auto">{total}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AppointmentsTrendChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    appointments: item.count,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Appointments Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            appointments: { label: 'Appointments', color: '#8b5cf6' },
          }}
          className="h-[200px]"
        >
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
              allowDecimals={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="appointments"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function TopDoctorsTable({ doctors }: { doctors: TopDoctor[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Top Doctors</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead className="text-right">Appointments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center py-6 text-muted-foreground"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor) => (
                <TableRow key={doctor.doctorId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-primary/10 rounded-md">
                        <Stethoscope className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{doctor.doctorName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {doctor.appointmentCount}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RecentAppointmentsTable({
  appointments,
}: {
  appointments: RecentAppointment[];
}) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const colorClass =
      STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
      'bg-gray-500/10 text-gray-600 border-gray-500/20';
    return (
      <Badge variant="outline" className={colorClass}>
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Appointments</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  No appointments found
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment.appointmentId}>
                  <TableCell className="font-medium">
                    {appointment.patientName}
                  </TableCell>
                  <TableCell>{appointment.doctorName}</TableCell>
                  <TableCell>
                    {formatDate(appointment.appointmentDate)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(appointment.appointmentStatus)}
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground capitalize">
                      {appointment.bookingSource?.toLowerCase() || '—'}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <Skeleton className="w-11 h-11 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="w-16 h-7" />
                  <Skeleton className="w-24 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skeleton className="h-[200px] rounded-xl" />
        <Skeleton className="h-[200px] rounded-xl" />
        <Skeleton className="h-[200px] rounded-xl" />
      </div>

      {/* Tables Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-[300px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getAdminDashboardData();

        if (response.success && response.payload) {
          setData(response.payload);
          setError(null);
        } else {
          setError(response.message || 'Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of the platform statistics
          </p>
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of the platform statistics
          </p>
        </div>
        <Card className="border-destructive/50">
          <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div className="text-center">
              <Typography size="sm" color="destructive" weight="medium">
                {error}
              </Typography>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            No data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of the platform statistics
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={data.summary.totalPatients}
          icon={Users}
          description="Registered patients"
          trend={
            data.summary.newPatientsThisMonth > 0
              ? {
                  value: data.summary.newPatientsThisMonth,
                  label: 'this month',
                }
              : undefined
          }
        />
        <StatCard
          title="Total Doctors"
          value={data.summary.totalDoctors}
          icon={Stethoscope}
          description="Active doctors"
          trend={
            data.summary.newDoctorsThisMonth > 0
              ? {
                  value: data.summary.newDoctorsThisMonth,
                  label: 'this month',
                }
              : undefined
          }
        />
        <StatCard
          title="Total Hospitals"
          value={data.summary.totalHospitals}
          icon={Building2}
          description="Partner hospitals"
        />
        <StatCard
          title="Total Secretaries"
          value={data.summary.totalSecretaries}
          icon={UserCog}
          description="Active secretaries"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Appointments"
          value={data.summary.totalAppointments}
          icon={CalendarCheck}
          description="All time appointments"
        />
        <StatCard
          title="Today's Appointments"
          value={data.summary.appointmentsToday}
          icon={Calendar}
          description="Scheduled for today"
        />
        <StatCard
          title="This Month"
          value={data.summary.appointmentsThisMonth}
          icon={Clock}
          description="Appointments this month"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AppointmentStatusChart data={data.appointmentStatusBreakdown} />
        <BookingSourceChart data={data.bookingSourceBreakdown} />
        <AppointmentsTrendChart data={data.appointmentsTrend} />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopDoctorsTable doctors={data.topDoctors} />
        <RecentAppointmentsTable appointments={data.recentAppointments} />
      </div>
    </div>
  );
}
