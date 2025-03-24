import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

type Project = {
  id: number;
  name: string;
  progress: number;
  status: string;
};

const projects: Project[] = [
  {
    id: 1,
    name: "Website Redesign",
    progress: 75,
    status: "In Progress"
  },
  {
    id: 2,
    name: "Mobile App Development",
    progress: 40,
    status: "In Progress"
  },
  {
    id: 3,
    name: "Database Migration",
    progress: 90,
    status: "Almost Done"
  },
  {
    id: 4,
    name: "API Integration",
    progress: 20,
    status: "Just Started"
  }
];

const ProjectProgress: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{project.name}</span>
                <span className="text-sm text-gray-500">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">{project.status}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectProgress;
