'use client';

export default function MaintenancePage() {
  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
        }
      `}</style>
      <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 背景装饰 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #be185d 100%)'
      }}>
        {/* 简化的脚印图案装饰 */}
        <div style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          width: '80px',
          height: '80px',
          opacity: 0.2,
          color: 'white'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
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
        
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '80px',
          width: '64px',
          height: '64px',
          opacity: 0.15,
          color: 'white'
        }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
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
        
        {/* 简化的动态光效 */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '33%',
          width: '128px',
          height: '128px',
          background: 'linear-gradient(45deg, #60a5fa, #a855f7)',
          borderRadius: '50%',
          opacity: 0.2,
          animation: 'pulse 3s ease-in-out infinite'
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '33%',
          right: '25%',
          width: '96px',
          height: '96px',
          background: 'linear-gradient(45deg, #f472b6, #6366f1)',
          borderRadius: '50%',
          opacity: 0.15,
          animation: 'pulse 3s ease-in-out infinite 1s'
        }}></div>
      </div>
      
      {/* 主要内容 */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '48px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '672px',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {/* Logo区域 */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '80px', marginBottom: '24px' }}>🔧</div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <span style={{ fontSize: '24px' }}>👣</span>
              </div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Flipflop Footprint
              </h1>
            </div>
          </div>
          
          {/* 中文内容 */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '30px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '24px'
            }}>系统升级中</h2>
            <p style={{
              fontSize: '20px',
              color: '#374151',
              marginBottom: '16px',
              lineHeight: '1.6'
            }}>
              我们正在进行系统升级，预计10月1日北京时间晚上7点前完成
            </p>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              marginBottom: '24px'
            }}>
              维护期间系统将暂停服务，给您带来的不便敬请谅解
            </p>
          </div>
          
          {/* 分隔线 */}
          <div style={{
            width: '96px',
            height: '4px',
            background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
            margin: '0 auto 32px',
            borderRadius: '2px'
          }}></div>
          
          {/* 英文版本 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '16px'
            }}>System Upgrade</h3>
            <p style={{
              fontSize: '18px',
              color: '#374151',
              marginBottom: '12px',
              lineHeight: '1.6'
            }}>
              We are currently performing system upgrades, expected to complete before 7:00 PM Beijing Time on October 1st
            </p>
            <p style={{
              fontSize: '16px',
              color: '#6b7280'
            }}>
              The system will be temporarily unavailable during maintenance. We apologize for any inconvenience.
            </p>
          </div>
          
          {/* 底部签名 */}
          <div style={{
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '18px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Flipflop Footprint Team
            </div>
            <div style={{
              fontSize: '14px',
              color: '#9ca3af',
              marginTop: '8px'
            }}>
              Thank you for your patience
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
