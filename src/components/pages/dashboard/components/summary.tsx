import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Activity, TrendingUp } from "lucide-react";
import { ReactNode } from "react";

type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, description, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
};

const DashboardSummary: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SummaryCard 
        title="Total Users"
        value="1,248"
        description="+12% from last month"
        icon={<Users className="text-blue-600" />}
      />
      <SummaryCard 
        title="Sales"
        value="$45,231"
        description="+8.2% from last week"
        icon={<CreditCard className="text-green-600" />}
      />
      <SummaryCard 
        title="Active Projects"
        value="46"
        description="+3 new this week"
        icon={<Activity className="text-purple-600" />}
      />
      <SummaryCard 
        title="Conversion Rate"
        value="12.5%"
        description="+2.3% from last month"
        icon={<TrendingUp className="text-orange-600" />}
      />
    </div>
  );
};

export default DashboardSummary;
