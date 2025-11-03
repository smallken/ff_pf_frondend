'use client';

import { useLanguage } from '../contexts/LanguageContext';

export default function Honor() {
  const { t } = useLanguage();
  const honorLevels = [
    {
      level: 'L1 Explorer（探索者）',
      points: '👣0–100',
      benefits: [
        t('honor.l1.benefit.1'),
        t('honor.l1.benefit.2'),
        t('honor.l1.benefit.3'),
        t('honor.l1.benefit.4')
      ]
    },
    {
      level: 'L2 Pathfinder（探路者）',
      points: '👣101–300',
      benefits: [
        t('honor.l2.benefit.1'),
        t('honor.l2.benefit.2'),
        t('honor.l2.benefit.3'),
        t('honor.l2.benefit.4')
      ]
    },
    {
      level: 'L3 Trailblazer（开路者）',
      points: '👣301–700',
      benefits: [
        t('honor.l3.benefit.1'),
        t('honor.l3.benefit.2'),
        t('honor.l3.benefit.3'),
        t('honor.l3.benefit.4'),
        t('honor.l3.benefit.5')
      ]
    },
    {
      level: 'L4 Pioneer（先驱者）',
      points: '👣700+',
      benefits: [
        t('honor.l4.benefit.1'),
        t('honor.l4.benefit.2'),
        t('honor.l4.benefit.3'),
        t('honor.l4.benefit.4'),
        t('honor.l4.benefit.5')
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-violet-900/20 dark:to-gray-800 relative overflow-hidden">
      {/* Background decorative elements - Spirals and Curves */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-12 w-40 h-40 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full text-violet-400 animate-spin" style={{animationDuration: '20s'}}>
            <path d="M50,10 Q90,50 50,90 Q10,50 50,10" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M50,20 Q80,50 50,80 Q20,50 50,20" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </div>
        <div className="absolute top-32 right-16 w-24 h-24 bg-gradient-to-r from-fuchsia-300 to-pink-400 opacity-15 animate-pulse delay-1000" style={{clipPath: 'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)'}}></div>
        <div className="absolute bottom-24 left-1/4 w-32 h-8 bg-gradient-to-r from-purple-300 to-violet-400 opacity-15 animate-bounce delay-2000" style={{clipPath: 'ellipse(80% 50% at 50% 50%)'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-16">
          
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
            {t('honor.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('honor.subtitle')}
          </p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {t('honor.eligibility.note')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {honorLevels.map((level, index) => (
            <div key={index} className="group bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center border-2 border-transparent hover:border-violet-200 dark:hover:border-violet-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                  index === 0 ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                  index === 1 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                  index === 2 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  'bg-gradient-to-r from-purple-400 to-pink-500'
                }`}>
                  <span className="text-3xl">
                    {index === 0 && '🔍'}
                    {index === 1 && '🛤️'}
                    {index === 2 && '⚡'}
                    {index === 3 && '👑'}
                  </span>
                </div>
                <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r bg-clip-text text-transparent ${
                  index === 0 ? 'from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400' :
                  index === 1 ? 'from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400' :
                  index === 2 ? 'from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400' :
                  'from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400'
                }`}>
                  {index === 0 && t('honor.level.l1')}
                  {index === 1 && t('honor.level.l2')}
                  {index === 2 && t('honor.level.l3')}
                  {index === 3 && t('honor.level.l4')}
                </h3>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-6">{level.points}</p>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-center">{t('honor.benefits')}</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    {level.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <span className="w-2 h-2 bg-violet-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 任务类别与基础积分 */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-12 border border-violet-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-200 to-purple-300 dark:from-violet-800 dark:to-purple-900 opacity-20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-2xl">📋</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">{t('honor.taskCategories.title')}</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-violet-200 dark:border-violet-700">
                    <th className="text-left py-4 text-gray-900 dark:text-white font-bold text-base">{t('honor.taskCategories.table.category')}</th>
                    <th className="text-left py-4 text-gray-900 dark:text-white font-bold text-base">{t('honor.taskCategories.table.taskDescription')}</th>
                    <th className="text-left py-4 text-gray-900 dark:text-white font-bold text-base">{t('honor.taskCategories.table.frequencyLimit')}</th>
                    <th className="text-left py-4 text-gray-900 dark:text-white font-bold text-base">{t('honor.taskCategories.table.pointsPerTask')}</th>
                    <th className="text-left py-4 text-gray-900 dark:text-white font-bold text-base">{t('honor.taskCategories.table.weeklyLimit')}</th>
                    <th className="text-left py-4 text-gray-900 dark:text-white font-bold text-base">{t('honor.taskCategories.table.uploadRequirements')}</th>
                    <th className="text-left py-4 text-gray-900 dark:text-white font-bold text-base">{t('honor.taskCategories.table.automaticActions')}</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  {/* 传播类 */}
                  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors duration-200">
                    <td className="py-4 font-medium whitespace-nowrap">{t('honor.taskCategories.promotion.category')}</td>
                    <td className="py-4 whitespace-nowrap">{t('honor.taskCategories.promotion.description')}</td>
                    <td className="py-4 whitespace-nowrap">{t('honor.taskCategories.promotion.frequency')}</td>
                    <td className="py-4 whitespace-nowrap">{t('honor.taskCategories.promotion.points')}</td>
                    <td className="py-4 whitespace-nowrap">{t('honor.taskCategories.promotion.weekly')}</td>
                    <td className="py-4 whitespace-normal min-w-[280px] max-w-[320px]">{t('honor.taskCategories.promotion.upload')}</td>
                    <td className="py-4 whitespace-normal">{t('honor.taskCategories.promotion.automatic')}</td>
                  </tr>
                  {/* 社群类 */}
                  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors duration-200">
                    <td className="py-4 font-medium whitespace-nowrap">{t('honor.taskCategories.community.category')}</td>
                    <td className="py-4 whitespace-nowrap">{t('honor.taskCategories.community.description')}</td>
                    <td className="py-4 whitespace-nowrap">{t('honor.taskCategories.community.frequency')}</td>
                    <td className="py-4 whitespace-nowrap">{t('honor.taskCategories.community.points')}</td>
                    <td className="py-4 whitespace-nowrap">{t('honor.taskCategories.community.weekly')}</td>
                    <td className="py-4 whitespace-normal min-w-[280px] max-w-[320px]">{t('honor.taskCategories.community.upload')}</td>
                    <td className="py-4 whitespace-normal">{t('honor.taskCategories.community.automatic')}</td>
                  </tr>
                  {/* 原创类 */}
                  <tr className="hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors duration-200">
                    <td className="py-4 font-medium whitespace-nowrap">{t('honor.taskCategories.original.category')}</td>
                    <td className="py-4 whitespace-nowrap">{t('honor.taskCategories.original.description')}</td>
                    <td className="py-4 whitespace-nowrap">{t('honor.taskCategories.original.frequency')}</td>
                    <td className="py-4 whitespace-nowrap">{t('honor.taskCategories.original.points')}</td>
                    <td className="py-4 whitespace-nowrap">{t('honor.taskCategories.original.weekly')}</td>
                    <td className="py-4 whitespace-normal min-w-[280px] max-w-[320px]">{t('honor.taskCategories.original.upload')}</td>
                    <td className="py-4 whitespace-normal">{t('honor.taskCategories.original.automatic')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 上传要求说明 */}
            <div className="mt-8 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-violet-200 dark:border-violet-700">
              <h4 className="font-bold text-violet-900 dark:text-violet-200 text-lg mb-4 flex items-center">
                <span className="text-2xl mr-2">📤</span>
                {t('honor.uploadRequirements.title')}
              </h4>
              <div className="space-y-4">
                {/* 传播类上传要求 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-violet-100 dark:border-violet-800">
                  <h5 className="font-semibold text-violet-900 dark:text-violet-200 mb-2 flex items-center">
                    <span className="text-xl mr-2">📣</span>
                    {t('honor.uploadRequirements.promotion.title')}
                  </h5>
                  <div className="space-y-2 ml-8 text-gray-700 dark:text-gray-300 text-sm">
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.uploadRequirements.promotion.1')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="font-medium text-violet-700 dark:text-violet-300">{t('honor.uploadRequirements.promotion.2')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.uploadRequirements.promotion.3')}</span>
                    </div>
                  </div>
                </div>

                {/* 社群类上传要求 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-violet-100 dark:border-violet-800">
                  <h5 className="font-semibold text-violet-900 dark:text-violet-200 mb-2 flex items-center">
                    <span className="text-xl mr-2">💬</span>
                    {t('honor.uploadRequirements.community.title')}
                  </h5>
                  <div className="space-y-2 ml-8 text-gray-700 dark:text-gray-300 text-sm">
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.uploadRequirements.community.1')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="font-medium text-violet-700 dark:text-violet-300">{t('honor.uploadRequirements.community.2')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.uploadRequirements.community.3')}</span>
                    </div>
                  </div>
                </div>

                {/* 原创类上传要求 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-violet-100 dark:border-violet-800">
                  <h5 className="font-semibold text-violet-900 dark:text-violet-200 mb-2 flex items-center">
                    <span className="text-xl mr-2">✍️</span>
                    {t('honor.uploadRequirements.original.title')}
                  </h5>
                  <div className="space-y-2 ml-8 text-gray-700 dark:text-gray-300 text-sm">
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.uploadRequirements.original.1')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="font-medium text-violet-700 dark:text-violet-300">{t('honor.uploadRequirements.original.2')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-violet-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.uploadRequirements.original.3')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 任务细节说明 */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
              <h4 className="font-bold text-blue-900 dark:text-blue-200 text-lg mb-4">{t('honor.taskCategories.details.title')}</h4>
              <div className="space-y-4 text-blue-700 dark:text-blue-300 text-sm">
                {/* 传播类细节 */}
                <div>
                  <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">{t('honor.taskCategories.details.promotion.title')}</h5>
                  <div className="space-y-2 ml-4">
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.taskCategories.details.promotion.1')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.taskCategories.details.promotion.2')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.taskCategories.details.promotion.3')}</span>
                    </div>
                  </div>
                </div>

                {/* 原创类细节 */}
                <div>
                  <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">{t('honor.taskCategories.details.original.title')}</h5>
                  <div className="space-y-2 ml-4">
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.taskCategories.details.original.1')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.taskCategories.details.original.2')}</span>
                    </div>
                  </div>
                </div>

                {/* 社区类细节 */}
                <div>
                  <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">{t('honor.taskCategories.details.community.title')}</h5>
                  <div className="space-y-2 ml-4">
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.taskCategories.details.community.1')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.taskCategories.details.community.2')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.taskCategories.details.community.3')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 原创类任务加权机制 */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-violet-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-200 to-fuchsia-300 dark:from-purple-800 dark:to-fuchsia-900 opacity-20 rounded-full -translate-y-20 -translate-x-20"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-2xl">📊</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">{t('honor.originalWeighting.title')}</h2>
            </div>

            {/* 提交要求 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('honor.originalWeighting.submission.title')}</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
                <ul className="space-y-3 text-blue-700 dark:text-blue-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('honor.originalWeighting.submission.1')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('honor.originalWeighting.submission.2')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('honor.originalWeighting.submission.3')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('honor.originalWeighting.submission.4')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('honor.originalWeighting.submission.5')}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 加权计算规则 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('honor.originalWeighting.calculation.title')}</h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-700">
                <p className="text-green-700 dark:text-green-300 mb-4">
                  <strong>{t('honor.originalWeighting.calculation.formula')}</strong>
                </p>
                <h4 className="font-semibold text-green-900 dark:text-green-200 mb-3">{t('honor.originalWeighting.calculation.reviewLogic')}</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold mr-3 mt-0.5">✅</span>
                    <span className="text-green-700 dark:text-green-300">{t('honor.originalWeighting.calculation.valid')}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-white text-xs font-bold mr-3 mt-0.5">❌</span>
                    <span className="text-yellow-700 dark:text-yellow-300">{t('honor.originalWeighting.calculation.invalid')}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold mr-3 mt-0.5">🚫</span>
                    <span className="text-red-700 dark:text-red-300">{t('honor.originalWeighting.calculation.disqualified')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 奖励与发放 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('honor.originalWeighting.rewards.title')}</h3>
              <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
                <p className="text-purple-700 dark:text-purple-300 mb-4">
                  <strong>{t('honor.originalWeighting.rewards.formula')}</strong>
                </p>
                <ul className="space-y-3 text-purple-700 dark:text-purple-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('honor.originalWeighting.rewards.1')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('honor.originalWeighting.rewards.2')}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 重要说明 */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('honor.originalWeighting.important.title')}</h3>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-700">
                <ul className="space-y-3 text-amber-700 dark:text-amber-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('honor.originalWeighting.important.1')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('honor.originalWeighting.important.2')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('honor.originalWeighting.important.3')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('honor.originalWeighting.important.4')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('honor.originalWeighting.important.5')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        
        {/* Warning Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-red-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-red-200 to-pink-300 dark:from-red-800 dark:to-pink-900 opacity-20 rounded-full -translate-y-20 -translate-x-20"></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-700">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">🚨</span>
                </div>
                <h4 className="font-bold text-red-900 dark:text-red-200 text-lg">{t('honor.warning.title')}</h4>
              </div>
              <p className="text-red-700 dark:text-red-300 text-sm">
                {t('honor.warning.text')}
              </p>
            </div>
          </div>
        </div>

        {/* 社交媒体链接 */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-3xl p-8 text-center border border-blue-200 dark:border-blue-700 shadow-xl">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-sky-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400 bg-clip-text text-transparent">{t('process.social.title')}</h3>
          </div>
          <div className="flex justify-center space-x-6 flex-wrap gap-y-4">
            <a href="https://x.com/flipfloplaunch" target="_blank" rel="noopener noreferrer" className="group flex items-center px-6 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-2xl font-semibold hover:from-gray-900 hover:to-gray-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              <span className="mr-2">𝕏</span>
              X (Twitter)
            </a>
            <a href="https://t.me/flipflopEn" target="_blank" rel="noopener noreferrer" className="group flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              <span className="mr-2">📱</span>
              Telegram EN
            </a>
            <a href="https://t.me/flipflopChi" target="_blank" rel="noopener noreferrer" className="group flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              <span className="mr-2">📱</span>
              Telegram 中文
            </a>
            <a href="https://discord.com/invite/DtwkgAyD" target="_blank" rel="noopener noreferrer" className="group flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              <span className="mr-2">💬</span>
              Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}