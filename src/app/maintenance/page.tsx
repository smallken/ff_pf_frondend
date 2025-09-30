export default function MaintenancePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* 脚印图案装饰 */}
        <div className="absolute top-10 left-10 w-20 h-20 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <path d="M20 40 Q30 20 50 30 Q70 40 60 60 Q50 80 30 70 Q10 60 20 40 Z" fill="currentColor"/>
            <circle cx="25" cy="35" r="3" fill="currentColor"/>
            <circle cx="35" cy="30" r="3" fill="currentColor"/>
            <circle cx="45" cy="35" r="3" fill="currentColor"/>
            <circle cx="55" cy="40" r="3" fill="currentColor"/>
            <circle cx="50" cy="50" r="3" fill="currentColor"/>
            <circle cx="40" cy="55" r="3" fill="currentColor"/>
            <circle cx="30" cy="50" r="3" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute top-20 right-20 w-16 h-16 opacity-15">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <path d="M20 40 Q30 20 50 30 Q70 40 60 60 Q50 80 30 70 Q10 60 20 40 Z" fill="currentColor"/>
            <circle cx="25" cy="35" r="3" fill="currentColor"/>
            <circle cx="35" cy="30" r="3" fill="currentColor"/>
            <circle cx="45" cy="35" r="3" fill="currentColor"/>
            <circle cx="55" cy="40" r="3" fill="currentColor"/>
            <circle cx="50" cy="50" r="3" fill="currentColor"/>
            <circle cx="40" cy="55" r="3" fill="currentColor"/>
            <circle cx="30" cy="50" r="3" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <path d="M20 40 Q30 20 50 30 Q70 40 60 60 Q50 80 30 70 Q10 60 20 40 Z" fill="currentColor"/>
            <circle cx="25" cy="35" r="3" fill="currentColor"/>
            <circle cx="35" cy="30" r="3" fill="currentColor"/>
            <circle cx="45" cy="35" r="3" fill="currentColor"/>
            <circle cx="55" cy="40" r="3" fill="currentColor"/>
            <circle cx="50" cy="50" r="3" fill="currentColor"/>
            <circle cx="40" cy="55" r="3" fill="currentColor"/>
            <circle cx="30" cy="50" r="3" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute bottom-10 right-1/3 w-14 h-14 opacity-12">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <path d="M20 40 Q30 20 50 30 Q70 40 60 60 Q50 80 30 70 Q10 60 20 40 Z" fill="currentColor"/>
            <circle cx="25" cy="35" r="3" fill="currentColor"/>
            <circle cx="35" cy="30" r="3" fill="currentColor"/>
            <circle cx="45" cy="35" r="3" fill="currentColor"/>
            <circle cx="55" cy="40" r="3" fill="currentColor"/>
            <circle cx="50" cy="50" r="3" fill="currentColor"/>
            <circle cx="40" cy="55" r="3" fill="currentColor"/>
            <circle cx="30" cy="50" r="3" fill="currentColor"/>
          </svg>
        </div>
        
        {/* 动态光效 */}
        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full opacity-15 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/2 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-25 animate-pulse delay-2000"></div>
      </div>
      
      {/* 主要内容 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="text-center p-12 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-2xl w-full border border-white/20">
          {/* Logo区域 */}
          <div className="mb-8">
            <div className="text-8xl mb-6">🔧</div>
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-2xl">👣</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Flipflop Footprint
              </h1>
            </div>
          </div>
          
          {/* 中文内容 */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">系统升级中</h2>
            <p className="text-xl text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
              我们正在进行系统升级，预计10月1日北京时间晚上7点前完成
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              维护期间系统将暂停服务，给您带来的不便敬请谅解
            </p>
          </div>
          
          {/* 分隔线 */}
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
          
          {/* 英文版本 */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">System Upgrade</h3>
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-3 leading-relaxed">
              We are currently performing system upgrades, expected to complete before 7:00 PM Beijing Time on October 1st
            </p>
            <p className="text-base text-gray-600 dark:text-gray-300">
              The system will be temporarily unavailable during maintenance. We apologize for any inconvenience.
            </p>
          </div>
          
          {/* 底部签名 */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="text-lg text-gray-500 dark:text-gray-400 font-medium">
              Flipflop Footprint Team
            </div>
            <div className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Thank you for your patience
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
