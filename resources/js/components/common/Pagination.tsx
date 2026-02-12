import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

export default function Pagination({ links }: PaginationProps) {
  // Filter out the Previous/Next text labels to replace with icons or cleaner text
  // Actually Laravel pagination links include "Previous" and "Next" text in label.
  
  // We'll clean up the labels using regex or simple replacements.

  const cleanLabel = (label: string) => {
    if (label.includes('&laquo;')) return <ChevronLeft className="h-4 w-4" />;
    if (label.includes('&raquo;')) return <ChevronRight className="h-4 w-4" />;
    return <span dangerouslySetInnerHTML={{ __html: label }} />;
  };

  if (links.length <= 3) return null;

  return (
    <div className="flex flex-wrap gap-1 justify-center mt-8">
      {links.map((link, index) => {
        if (!link.url) {
            // Disabled links (like previous on first page)
            return (
                <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    disabled
                    className="text-muted-foreground opacity-50"
                >
                    {cleanLabel(link.label)}
                </Button>
            );
        }
        
        return (
            <Link key={index} href={link.url} preserveScroll>
              <Button
                variant={link.active ? 'default' : 'outline'}
                size="icon"
                className={link.active ? '' : 'text-muted-foreground hover:text-foreground'}
              >
                 {cleanLabel(link.label)}
              </Button>
            </Link>
        );
      })}
    </div>
  );
}
