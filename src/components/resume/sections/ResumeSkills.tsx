interface ResumeSkillsProps {
  data: string[];
  themeSettings?: any;
}

export const ResumeSkills = ({ data, themeSettings }: ResumeSkillsProps) => {
  if (!data?.length) return null;

  const styles = {
    heading: {
      fontSize: themeSettings?.font?.size?.heading || '24px',
      color: themeSettings?.colors?.primary || '#1a1a1a'
    },
    skill: {
      backgroundColor: themeSettings?.colors?.accent || '#0066cc',
      color: '#ffffff'
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight" style={styles.heading}>
        Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {data.map((skill: string, index: number) => (
          <span
            key={index}
            className="px-3 py-1 rounded-md text-sm"
            style={styles.skill}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};