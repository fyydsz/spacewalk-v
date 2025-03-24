import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

type Activity = {
  id: number;
  user: string;
  action: string;
  project: string;
  time: string;
};

const activities: Activity[] = [
  {
    id: 1,
    user: "John Doe",
    action: "created a new project",
    project: "Website Redesign",
    time: "2 hours ago"
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "completed task",
    project: "Database Migration",
    time: "4 hours ago"
  },
  {
    id: 3,
    user: "Robert Johnson",
    action: "updated document",
    project: "API Documentation",
    time: "yesterday"
  },
  {
    id: 4,
    user: "Emily Davis",
    action: "joined team",
    project: "Mobile App",
    time: "2 days ago"
  },
  {
    id: 5,
    user: "Michael Wilson",
    action: "commented on task",
    project: "Bug Fixes",
    time: "3 days ago"
  }
];

const RecentActivity: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="border-b pb-4 last:border-0">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium text-gray-800">{activity.user}</p>
                  <p className="text-sm text-gray-600">
                    {activity.action} in <span className="font-medium">{activity.project}</span>
                  </p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;