interface ResumeExperienceProps {
  data: any[];
  themeSettings?: any;
}

export const ResumeExperience = ({ data, themeSettings }: ResumeExperienceProps) => {
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
        Experience
      </h2>
      <div className="space-y-6">
        {data.map((exp: any, index: number) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium" style={styles.subheading}>{exp.position}</h3>
                <p style={styles.text}>{exp.company}</p>
              </div>
              <p className="text-sm" style={styles.text}>
                {exp.startDate} - {exp.endDate || "Present"}
              </p>
            </div>
            <p className="text-sm leading-relaxed" style={styles.text}>
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};