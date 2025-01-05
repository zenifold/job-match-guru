import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import { CSSProperties } from "react";

interface ResumeHeaderProps {
  data: any;
  themeSettings?: any;
}

export const ResumeHeader = ({ data, themeSettings }: ResumeHeaderProps) => {
  if (!data) return null;

  const headerStyle = themeSettings?.layout?.headerStyle || 'left-aligned';
  
  const styles: {
    container: string;
    heading: CSSProperties;
    contactInfo: CSSProperties;
  } = {
    container: `border-b pb-6 ${
      headerStyle === 'centered' ? 'text-center' : ''
    }`,
    heading: {
      fontSize: themeSettings?.font?.size?.heading || '24px',
      color: themeSettings?.colors?.primary || '#1a1a1a',
      marginBottom: '1rem'
    },
    contactInfo: {
      color: themeSettings?.colors?.secondary || '#4a4a4a',
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '1rem',
      justifyContent: headerStyle === 'centered' ? 'center' : 'flex-start'
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="font-bold tracking-tight mb-4" style={styles.heading}>
        {data.fullName}
      </h1>
      <div style={styles.contactInfo}>
        {data.email && (
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            {data.email}
          </div>
        )}
        {data.phone && (
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            {data.phone}
          </div>
        )}
        {data.location && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {data.location}
          </div>
        )}
        {data.github && (
          <div className="flex items-center">
            <Github className="h-4 w-4 mr-2" />
            <a href={data.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              GitHub
            </a>
          </div>
        )}
        {data.linkedin && (
          <div className="flex items-center">
            <Linkedin className="h-4 w-4 mr-2" />
            <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              LinkedIn
            </a>
          </div>
        )}
      </div>
    </div>
  );
};