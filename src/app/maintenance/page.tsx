export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-6xl mb-4">🔧</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">系统升级中</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          我们正在进行系统升级，预计10月1日完成
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          维护期间系统将暂停服务，给您带来的不便敬请谅解
        </p>
        <div className="mt-6 text-xs text-gray-400">
          Flipflop Footprint 团队
        </div>
      </div>
    </div>
  );
}
