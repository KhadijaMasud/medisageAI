import { useAuth } from "@/contexts/AuthContext";
import { useModel } from "@/contexts/ModelContext";
import { Briefcase, User, Check } from "lucide-react";

export function SubscriptionTiers() {
  const { userTier, setUserTier } = useAuth();
  const { allModels } = useModel();
  
  const corporateModels = allModels.filter(model => model.tier === 'corporate');
  const personalModels = allModels.filter(model => model.tier === 'personal');
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-10">
      <div className="border-b border-secondary-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-secondary-800">Available Subscription Tiers</h2>
      </div>
      
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Corporate Tier */}
          <div className={`border ${userTier === 'corporate' ? 'border-primary-100 bg-primary-50' : 'border-secondary-200'} rounded-lg p-6 relative`}>
            {userTier === 'corporate' && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full shadow-sm">Your Current Plan</span>
              </div>
            )}
            <h3 className="text-xl font-bold text-primary-800 flex items-center">
              <Briefcase className="h-6 w-6 mr-2" />
              Corporate Tier
            </h3>
            <p className="mt-4 text-secondary-600">High-performance, enterprise-grade AI models with advanced capabilities for professional healthcare environments.</p>
            
            <div className="mt-6">
              <h4 className="font-medium text-secondary-800 mb-2">Available Models:</h4>
              <ul className="space-y-3">
                {corporateModels.map((model) => (
                  <li key={model.id} className="flex items-start">
                    <Check className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium text-secondary-800">{model.name}</span>
                      <p className="text-sm text-secondary-600">{model.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {userTier !== 'corporate' && (
              <div className="mt-6">
                <button 
                  type="button" 
                  onClick={() => setUserTier('corporate')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Switch to Corporate Tier
                </button>
              </div>
            )}
          </div>
          
          {/* Personal Tier */}
          <div className={`border ${userTier === 'personal' ? 'border-primary-100 bg-primary-50' : 'border-secondary-200'} rounded-lg p-6 relative`}>
            {userTier === 'personal' && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full shadow-sm">Your Current Plan</span>
              </div>
            )}
            <h3 className="text-xl font-bold text-secondary-800 flex items-center">
              <User className="h-6 w-6 mr-2" />
              Personal Tier
            </h3>
            <p className="mt-4 text-secondary-600">Cost-efficient AI models optimized for individual use with good performance and lower resource requirements.</p>
            
            <div className="mt-6">
              <h4 className="font-medium text-secondary-800 mb-2">Available Models:</h4>
              <ul className="space-y-3">
                {personalModels.map((model) => (
                  <li key={model.id} className="flex items-start">
                    <Check className="h-5 w-5 text-secondary-600 mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium text-secondary-800">{model.name}</span>
                      <p className="text-sm text-secondary-600">{model.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {userTier !== 'personal' && (
              <div className="mt-6">
                <button 
                  type="button" 
                  onClick={() => setUserTier('personal')}
                  className="inline-flex items-center px-4 py-2 border border-secondary-300 shadow-sm text-sm font-medium rounded-md text-secondary-700 bg-white hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
                >
                  Switch to Personal Tier
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
