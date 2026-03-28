import { generateProjectSchema, type ProjectData } from "@/app/lib/structured-data";

interface ProjectSchemaProps {
  project: ProjectData;
}

export function ProjectSchema({ project }: ProjectSchemaProps) {
  const schema = generateProjectSchema(project);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
