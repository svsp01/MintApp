interface BuildOpportunitiesProps {
    keywords: { label: string; value: string }[];
  }
  
  const BuildOpportunities: React.FC<BuildOpportunitiesProps> = ({ keywords }) => {
    const generateOpportunities = (keywords: { label: string; value: string }[]) => {
      return keywords.map((keyword) => ({
        title: `Build a project with ${keyword.label}`,
        description: `Use your ${keyword.label} skills to create a new and innovative project.`,
      }));
    };
  
    const opportunities = generateOpportunities(keywords);
  
    return (
      <div>
        <h2 className="text-xl mb-4">Build Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((opportunity, index) => (
            <div key={index} className="p-4 border rounded shadow">
              <h3 className="text-lg font-bold">{opportunity.title}</h3>
              <p>{opportunity.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default BuildOpportunities;
  