import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart3, Activity } from "lucide-react";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

interface HealthMetricsWidgetProps {
  fullWidth?: boolean;
}

const HealthMetricsWidget = ({ fullWidth = false }: HealthMetricsWidgetProps) => {
  // Mock data for visualization
  const weightData = [
    { day: 'Mon', weight: 62.5 },
    { day: 'Tue', weight: 62.3 },
    { day: 'Wed', weight: 62.8 },
    { day: 'Thu', weight: 62.6 },
    { day: 'Fri', weight: 62.4 },
    { day: 'Sat', weight: 62.2 },
    { day: 'Sun', weight: 62.1 }
  ];
  
  const sleepData = [
    { day: 'Mon', sleep: 7.2 },
    { day: 'Tue', sleep: 6.8 },
    { day: 'Wed', sleep: 6.5 },
    { day: 'Thu', sleep: 7.5 },
    { day: 'Fri', sleep: 8.0 },
    { day: 'Sat', sleep: 8.5 },
    { day: 'Sun', sleep: 7.8 }
  ];
  
  const waterData = [
    { day: 'Mon', water: 1800 },
    { day: 'Tue', water: 2200 },
    { day: 'Wed', water: 1500 },
    { day: 'Thu', water: 2000 },
    { day: 'Fri', water: 2500 },
    { day: 'Sat', water: 1900 },
    { day: 'Sun', water: 2200 }
  ];

  return (
    <Card className={`${fullWidth ? 'w-full' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Health Metrics
          </CardTitle>
          
          <Button variant="outline" size="sm">Update</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-medium">Weight</h4>
              <span className="text-xs text-neutral-500">Last 7 days</span>
            </div>
            <p className="text-2xl font-semibold">62.1 kg</p>
            <span className="text-xs text-green-500">-0.4 kg from last week</span>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-medium">Sleep</h4>
              <span className="text-xs text-neutral-500">Last 7 days</span>
            </div>
            <p className="text-2xl font-semibold">7.8 hrs</p>
            <span className="text-xs text-green-500">+0.3 hrs from last week</span>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-medium">Water</h4>
              <span className="text-xs text-neutral-500">Today</span>
            </div>
            <p className="text-2xl font-semibold">2200 ml</p>
            <span className="text-xs text-primary">88% of daily goal</span>
          </div>
        </div>
        
        {fullWidth ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium flex items-center">
                  <LineChart className="h-4 w-4 mr-1 text-primary" />
                  Weight Trend
                </h4>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[61, 64]} />
                    <Tooltip 
                      formatter={(value) => [`${value} kg`, 'Weight']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.375rem'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="hsl(var(--primary))"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1 text-primary" />
                  Sleep & Water
                </h4>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sleepData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" orientation="left" domain={[0, 10]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 3000]} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.375rem'
                      }}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left" 
                      dataKey="sleep" 
                      name="Sleep (hrs)" 
                      fill="hsl(var(--primary))" 
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="water" 
                      name="Water (ml)" 
                      fill="hsl(var(--chart-3))" 
                      data={waterData} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis domain={[61, 64]} />
                <Tooltip 
                  formatter={(value) => [`${value} kg`, 'Weight']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {fullWidth && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Button variant="outline" className="w-full">BMI Calculator</Button>
            <Button variant="outline" className="w-full">Set Reminders</Button>
            <Button variant="outline" className="w-full">Export Data</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthMetricsWidget;
