import { getResources } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { ExternalLink, BookOpen, Video, FileText, GraduationCap } from "lucide-react";
import type { ResourceType } from "@/lib/types";

const typeIcons: Record<ResourceType, React.ReactNode> = {
  video: <Video className="h-5 w-5" />,
  book: <BookOpen className="h-5 w-5" />,
  article: <FileText className="h-5 w-5" />,
  course: <GraduationCap className="h-5 w-5" />,
};

const typeLabels: Record<ResourceType, string> = {
  video: "Videos",
  book: "Books",
  article: "Articles",
  course: "Courses",
};

export default function ResourcesPage() {
  const resources = getResources();
  const types = [...new Set(resources.map((r) => r.type))] as ResourceType[];

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="mt-2 text-muted-foreground">
          Curated learning materials for mastering algorithmic patterns.
        </p>
      </div>

      {types.map((type) => {
        const items = resources.filter((r) => r.type === type);
        return (
          <section key={type} className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold capitalize">
              {typeIcons[type]}
              {typeLabels[type]}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card className="group h-full p-5 transition-colors hover:border-primary/30">
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="font-medium group-hover:text-primary">
                        {resource.title}
                      </h3>
                      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {resource.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
