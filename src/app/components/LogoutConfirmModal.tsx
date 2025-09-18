'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm
}: LogoutConfirmModalProps) {
  const { logout } = useAuth();
  const { t } = useLanguage();

  const handleConfirm = async () => {
    try {
      await logout();
      onConfirm();
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-scaleIn">
        <div className="text-center">
          {/* 图标 */}
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* 标题 */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('logout.confirm.title')}
          </h3>

          {/* 消息 */}
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {t('logout.confirm.message')}
          </p>

          {/* 按钮 */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold"
            >
              {t('logout.confirm.cancel')}
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-semibold transform hover:-translate-y-0.5"
            >
              {t('logout.confirm.confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
