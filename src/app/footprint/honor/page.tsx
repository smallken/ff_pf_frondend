'use client';

import { useLanguage } from '../../contexts/LanguageContext';

export default function Honor() {
  const { t } = useLanguage();
  const honorLevels = [
    { 
      level: 'L1 Explorer（探索者）', 
      points: '👣0–30', 
      benefits: [
        t('honor.l1.benefit.1'),
        t('honor.l1.benefit.2'), 
        t('honor.l1.benefit.3'),
        t('honor.l1.benefit.4')
      ]
    },
    { 
      level: 'L2 Pathfinder（探路者）', 
      points: '👣31–100', 
      benefits: [
        t('honor.l2.benefit.1'),
        t('honor.l2.benefit.2'),
        t('honor.l2.benefit.3'),
        t('honor.l2.benefit.4')
      ]
    },
    { 
      level: 'L3 Trailblazer（开路者）', 
      points: '👣101–300', 
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
      points: '👣300+', 
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

        {/* 月度激励 */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-12 border border-violet-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-200 to-purple-300 dark:from-violet-800 dark:to-purple-900 opacity-20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-2xl">📅</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">{t('honor.monthly.title')}</h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {t('honor.monthly.subtitle')}
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-violet-200 dark:border-violet-700">
                    <th className="text-left py-4 text-gray-900 dark:text-white font-bold text-base">{t('honor.table.completion')}</th>
                    <th className="text-left py-4 text-gray-900 dark:text-white font-bold text-base">{t('honor.table.reward')}</th>
                    <th className="text-left py-4 text-gray-900 dark:text-white font-bold text-base">{t('honor.table.requirements')}</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors duration-200">
                    <td className="py-4 font-medium">{t('honor.monthly.basic.completion')}</td>
                    <td className="py-4">{t('honor.monthly.basic.reward')}</td>
                    <td className="py-4" style={{whiteSpace: 'pre-line'}}>{t('honor.monthly.basic.requirements')}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors duration-200">
                    <td className="py-4 font-medium">{t('honor.monthly.advanced1.completion')}</td>
                    <td className="py-4">{t('honor.monthly.advanced1.reward')}</td>
                    <td className="py-4" style={{whiteSpace: 'pre-line'}}>{t('honor.monthly.advanced1.requirements')}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors duration-200">
                    <td className="py-4 font-medium">{t('honor.monthly.advanced2.completion')}</td>
                    <td className="py-4">{t('honor.monthly.advanced2.reward')}</td>
                    <td className="py-4" style={{whiteSpace: 'pre-line'}}>{t('honor.monthly.advanced2.requirements')}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors duration-200">
                    <td className="py-4 font-medium">{t('honor.monthly.advanced3.completion')}</td>
                    <td className="py-4">{t('honor.monthly.advanced3.reward')}</td>
                    <td className="py-4" style={{whiteSpace: 'pre-line'}}>{t('honor.monthly.advanced3.requirements')}</td>
                  </tr>
                  <tr className="hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors duration-200">
                    <td className="py-4 font-medium">{t('honor.monthly.special.completion')}</td>
                    <td className="py-4">{t('honor.monthly.special.reward')}</td>
                    <td className="py-4" style={{whiteSpace: 'pre-line'}}>{t('honor.monthly.special.requirements')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('honor.monthly.special.note')}
                <a 
                  href="/forms/activity" 
                  className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline ml-1 transition-colors duration-200"
                >
                  {t('honor.monthly.special.link')}
                </a>
              </p>
            </div>
            
            {/* Definitions Section */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
              <h4 className="font-bold text-blue-900 dark:text-blue-200 text-lg mb-4">{t('honor.monthly.definitions.title')}</h4>
              <div className="space-y-4 text-blue-700 dark:text-blue-300 text-sm">
                {/* 传播类 */}
                <div>
                  <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">{t('honor.monthly.definitions.promotion.title')}</h5>
                  <div className="space-y-2 ml-4">
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.monthly.definitions.promotion.1')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.monthly.definitions.promotion.2')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.monthly.definitions.promotion.3')}</span>
                    </div>
                  </div>
                </div>
                
                {/* 创作类 */}
                <div>
                  <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">{t('honor.monthly.definitions.creation.title')}</h5>
                  <div className="space-y-2 ml-4">
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.monthly.definitions.creation.1')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.monthly.definitions.creation.2')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.monthly.definitions.creation.3')}</span>
                    </div>
                  </div>
                </div>
                
                {/* 社区类 */}
                <div>
                  <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">{t('honor.monthly.definitions.community.title')}</h5>
                  <div className="space-y-2 ml-4">
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.monthly.definitions.community.1')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.monthly.definitions.community.2')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{t('honor.monthly.definitions.community.3')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footprint贡献参考 */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-violet-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-200 to-fuchsia-300 dark:from-purple-800 dark:to-fuchsia-900 opacity-20 rounded-full -translate-y-20 -translate-x-20"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-2xl">💎</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">{t('honor.flipprints.title')}</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-purple-200 dark:border-purple-700">
                    <th className="text-left py-4 text-gray-900 dark:text-white font-bold text-base">{t('honor.table.category')}</th>
                    <th className="text-left py-4 text-gray-900 dark:text-white font-bold text-base">{t('honor.table.task')}</th>
                    <th className="text-left py-4 text-gray-900 dark:text-white font-bold text-base">{t('honor.table.points')}</th>
                    <th className="text-left py-4 text-gray-900 dark:text-white font-bold text-base">{t('honor.table.notes')}</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  {/* 传播类 */}
                  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors duration-200">
                    <td className="py-4 font-medium">{t('honor.flipprints.promotion.category')}</td>
                    <td className="py-4">{t('honor.flipprints.promotion.task')}</td>
                    <td className="py-4">{t('honor.flipprints.promotion.points')}</td>
                    <td className="py-4">{t('honor.flipprints.promotion.notes')}</td>
                  </tr>
                  
                  {/* 创作类（短） */}
                  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors duration-200">
                    <td className="py-4 font-medium">{t('honor.flipprints.creation.category')}</td>
                    <td className="py-4">{t('honor.flipprints.creation.task1')}</td>
                    <td className="py-4">{t('honor.flipprints.creation.points1')}</td>
                    <td className="py-4">{t('honor.flipprints.creation.notes1')}</td>
                  </tr>
                  
                  {/* 创作类（长） */}
                  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors duration-200">
                    <td className="py-4 font-medium">{t('honor.flipprints.creation.category2')}</td>
                    <td className="py-4">{t('honor.flipprints.creation.task2')}</td>
                    <td className="py-4">{t('honor.flipprints.creation.points2')}</td>
                    <td className="py-4">{t('honor.flipprints.creation.notes2')}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors duration-200">
                    <td className="py-4"></td>
                    <td className="py-4">{t('honor.flipprints.creation.task3')}</td>
                    <td className="py-4">{t('honor.flipprints.creation.points3')}</td>
                    <td className="py-4">{t('honor.flipprints.creation.notes3')}</td>
                  </tr>
                  
                  {/* 社区类 */}
                  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors duration-200">
                    <td className="py-4 font-medium">{t('honor.flipprints.community.category')}</td>
                    <td className="py-4">{t('honor.flipprints.community.task1')}</td>
                    <td className="py-4">{t('honor.flipprints.community.points1')}</td>
                    <td className="py-4">{t('honor.flipprints.community.notes1')}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors duration-200">
                    <td className="py-4"></td>
                    <td className="py-4">{t('honor.flipprints.community.task2')}</td>
                    <td className="py-4">{t('honor.flipprints.community.points2')}</td>
                    <td className="py-4">{t('honor.flipprints.community.notes2')}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors duration-200">
                    <td className="py-4"></td>
                    <td className="py-4">{t('honor.flipprints.community.task3')}</td>
                    <td className="py-4">{t('honor.flipprints.community.points3')}</td>
                    <td className="py-4">{t('honor.flipprints.community.notes3')}</td>
                  </tr>
                  
                  {/* 爆款内容 */}
                  <tr className="hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors duration-200">
                    <td className="py-4 font-medium">{t('honor.flipprints.viral.category')}</td>
                    <td className="py-4">{t('honor.flipprints.viral.task')}</td>
                    <td className="py-4">{t('honor.flipprints.viral.points')}</td>
                    <td className="py-4">{t('honor.flipprints.viral.notes')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('honor.flipprints.submit.note')}
                <a 
                  href="/forms/achievement" 
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline mx-1 transition-colors duration-200"
                >
                  {t('honor.flipprints.submit.link')}
                </a>
                {t('honor.flipprints.submit.text')}
              </p>
            </div>
          </div>
        </div>

        {/* Important Notes Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-yellow-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-yellow-200 to-amber-300 dark:from-yellow-800 dark:to-amber-900 opacity-20 rounded-full translate-y-20 translate-x-20"></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">⚠️</span>
                </div>
                <h4 className="font-bold text-yellow-900 dark:text-yellow-200 text-lg">{t('honor.notice.title')}</h4>
              </div>
              <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-4 text-sm">
                {t('honor.notice.subtitle')}
              </p>
              <p className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2 text-sm">
                {t('honor.notice.subtitle2')}
              </p>
              <ul className="text-yellow-700 dark:text-yellow-300 space-y-2 text-sm mb-4">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{t('honor.notice.1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{t('honor.notice.2')}</span>
                </li>
              </ul>
              <p className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2 text-sm">
                {t('honor.notice.subtitle3')}
              </p>
              <ul className="text-yellow-700 dark:text-yellow-300 space-y-2 text-sm mb-4">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{t('honor.notice.3')}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{t('honor.notice.4')}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{t('honor.notice.5')}</span>
                </li>
              </ul>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-4">
                {t('honor.notice.6')}
              </p>
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