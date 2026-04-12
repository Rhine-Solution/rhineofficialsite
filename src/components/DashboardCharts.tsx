import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const COLORS = ['#0082D8', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

interface ActivityData {
  date: string;
  views: number;
  projects: number;
}

interface ProjectStatus {
  name: string;
  value: number;
}

interface TeamActivity {
  name: string;
  tasks: number;
}

interface DashboardChartsProps {
  activityData?: ActivityData[];
  projectStatus?: ProjectStatus[];
  teamActivity?: TeamActivity[];
}

export function ActivityTimeline({ data }: { data?: ActivityData[] }) {
  const defaultData = useMemo(() => [
    { date: 'Mon', views: 120, projects: 2 },
    { date: 'Tue', views: 180, projects: 3 },
    { date: 'Wed', views: 150, projects: 1 },
    { date: 'Thu', views: 220, projects: 4 },
    { date: 'Fri', views: 190, projects: 2 },
    { date: 'Sat', views: 80, projects: 1 },
    { date: 'Sun', views: 60, projects: 0 },
  ], []);

  const chartData = data || defaultData;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} />
          <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px'
            }}
          />
          <Line type="monotone" dataKey="views" stroke="#0082D8" strokeWidth={2} dot={{ fill: '#0082D8' }} />
          <Line type="monotone" dataKey="projects" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProjectStatusChart({ data }: { data?: ProjectStatus[] }) {
  const defaultData = useMemo(() => [
    { name: 'Active', value: 8 },
    { name: 'Completed', value: 15 },
    { name: 'In Progress', value: 5 },
    { name: 'On Hold', value: 2 },
  ], []);

  const chartData = data || defaultData;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TeamPerformanceChart({ data }: { data?: TeamActivity[] }) {
  const defaultData = useMemo(() => [
    { name: 'Alex', tasks: 12 },
    { name: 'Sarah', tasks: 15 },
    { name: 'Mike', tasks: 8 },
    { name: 'Emma', tasks: 11 },
    { name: 'John', tasks: 9 },
  ], []);

  const chartData = data || defaultData;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
          <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar dataKey="tasks" fill="#0082D8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DashboardCharts({ 
  activityData, 
  projectStatus, 
  teamActivity 
}: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">Activity Timeline</h3>
        <ActivityTimeline data={activityData} />
      </div>
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">Project Status</h3>
        <ProjectStatusChart data={projectStatus} />
      </div>
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">Team Performance</h3>
        <TeamPerformanceChart data={teamActivity} />
      </div>
    </div>
  );
}