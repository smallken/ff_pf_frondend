'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText,
  onButtonClick
}: SuccessModalProps) {
  const { language } = useLanguage();

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* 弹窗内容 */}
            <motion.div
              className="bg-gradient-to-br from-gray-900 via-blue-900 to-black border border-cyan-500/50 rounded-2xl p-8 max-w-md w-full mx-auto shadow-2xl"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 成功图标 */}
              <div className="text-center mb-6">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                >
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5, duration: 0.5, ease: "easeInOut" }}
                    />
                  </svg>
                </motion.div>
                
                {/* 标题 */}
                <motion.h3
                  className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  {title || (language === 'zh' ? '🎉 提交成功！' : '🎉 Success!')}
                </motion.h3>
              </div>

              {/* 消息内容 */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <p className="text-gray-300 text-lg leading-relaxed">
                  {message}
                </p>
              </motion.div>

              {/* 确认按钮 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <button
                  onClick={handleButtonClick}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 min-w-[120px]"
                >
                  {buttonText || (language === 'zh' ? '确定' : 'OK')}
                </button>
              </motion.div>

              {/* 装饰性粒子效果 */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 20}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.4, 1, 0.4],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
