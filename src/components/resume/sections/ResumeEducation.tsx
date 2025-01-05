interface ResumeEducationProps {
  data: any[];
  themeSettings?: any;
}

export const ResumeEducation = ({ data, themeSettings }: ResumeEducationProps) => {
  if (!data?.length) return null;

  const styles = {
    heading: {
      fontSize: themeSettings?.font?.size?.heading || '24px',
      color: themeSettings?.colors?.primary || '#1a1a1a'
    },
    subheading: {
      fontSize: themeSettings?.font?.size?.subheading || '18px',
      color: themeSettings?.colors?.primary || '#1a1a1a'
    },
    text: {
      color: themeSettings?.colors?.secondary || '#4a4a4a'
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight" style={styles.heading}>
        Education
      </h2>
      <div className="space-y-6">
        {data.map((edu: any, index: number) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium" style={styles.subheading}>{edu.school}</h3>
                <p style={styles.text}>
                  {edu.degree} in {edu.field}
                </p>
              </div>
              <p className="text-sm" style={styles.text}>
                {edu.startDate} - {edu.endDate || "Present"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};