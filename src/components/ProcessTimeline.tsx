interface ProcessStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

export default function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-primary via-brand-primary/50 to-brand-primary/20 md:left-1/2 md:-translate-x-px" />
      
      {/* Steps */}
      <div className="space-y-12">
        {steps.map((item, index) => (
          <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            {/* Step Number Circle */}
            <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 w-16 h-16 rounded-full bg-base-200 border-2 border-brand-primary flex items-center justify-center z-10">
              <span className="text-brand-primary font-rubik font-bold text-xl">{item.step}</span>
            </div>
            
            {/* Content Box */}
            <div className={`ml-24 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
              <div className="card bg-base-200 hover:bg-base-300 transition-all duration-300">
                <div className="card-body p-6">
                  <h3 className="text-xl font-rubik font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                  {item.duration && (
                    <span className="text-brand-primary text-xs font-medium">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item.duration}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Empty space for opposite side */}
            <div className="hidden md:block md:w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}