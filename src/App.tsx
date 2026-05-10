/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

// --- 类型定义 ---
type TabType = 'guardian' | 'health' | 'companion' | 'profile';
type OverlayType = 'alertDetail' | 'videoCall' | 'voiceMessage' | 'imageViewer';

interface AlertData {
  time: string;
  type: string;
  status: 'critical' | 'warning';
  message: string;
}

// --- 子组件：全屏图片查看器 ---
const ImageViewer = ({ src, onClose }: { src: string; onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 z-[100] bg-black flex flex-col pt-12"
  >
    <button onClick={onClose} className="absolute top-6 right-6 text-white text-3xl z-[110]">✕</button>
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.img 
        layoutId="fullscreen-image"
        src={src} 
        className="w-full h-auto rounded-xl shadow-2xl" 
        alt="全屏查看"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="p-10 text-center text-white/60 text-sm">
      双指缩放查看细节
    </div>
  </motion.div>
);

// --- 子组件：视频通话页 ---
const VideoCallView = ({ onClose }: { onClose: () => void }) => {
  const [isConnected, setIsConnected] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsConnected(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-[100] bg-gray-900 flex flex-col"
    >
      <div className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center transition-opacity duration-1000 ${isConnected ? 'opacity-100' : 'opacity-40 blur-sm'}`}></div>
      
      {/* 自己的画面 (PIP) */}
      {isConnected && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-12 right-6 w-28 h-40 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl z-20"
        >
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="我" />
        </motion.div>
      )}

      {/* 顶部提示语 */}
      <div className="absolute top-12 left-0 right-0 text-center z-20 pointer-events-none">
        {isConnected ? (
          <div className="bg-black/40 backdrop-blur inline-flex items-center gap-2 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-white text-xs font-bold">小和指示灯闪烁中，正在播放画面</span>
          </div>
        ) : null}
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-between py-20 z-10 w-full">
        <div className="text-center mt-10">
          {!isConnected && (
            <>
              <div className="w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden mx-auto mb-4 bg-white/10 flex items-center justify-center animate-pulse">
                <span className="text-4xl text-white font-serif">👴</span>
              </div>
              <h2 className="text-white text-2xl font-bold tracking-widest">正在呼叫妈妈</h2>
              <p className="text-white/60 mt-2 text-sm">正在建立安全加密连接...</p>
            </>
          )}
        </div>
        
        {/* 底部操作栏 */}
        <div className="w-full px-10 pb-8 mt-auto">
          <div className="bg-black/40 backdrop-blur-xl p-6 rounded-[32px] grid grid-cols-3 gap-6 shadow-2xl border border-white/10">
            <button className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-full bg-white/10 group-active:bg-white/20 flex items-center justify-center text-white text-xl transition-colors">🎙️</div>
              <span className="text-white/60 text-[10px] font-bold">静音</span>
            </button>
            <button onClick={onClose} className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-full bg-red-500 group-active:scale-95 flex items-center justify-center text-white text-2xl shadow-lg shadow-red-500/40 transition-all -mt-4">📞</div>
              <span className="text-white/80 text-[10px] font-bold">挂断</span>
            </button>
            <button className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-full bg-white/10 group-active:bg-white/20 flex items-center justify-center text-white text-xl transition-colors">📷</div>
              <span className="text-white/60 text-[10px] font-bold">翻转镜头</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- 子组件：告警详情页 ---
const AlertDetailView = ({ data, onClose }: { data: AlertData; onClose: () => void }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showFalseAlarmConfirm, setShowFalseAlarmConfirm] = useState(false);

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="absolute inset-0 z-[100] bg-[#fbf9f8] flex flex-col"
    >
      <header className="bg-red-600 text-white px-6 py-6 flex items-center gap-4 relative shadow-md">
        <button onClick={onClose} className="text-2xl text-white">⬅️</button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>⚠️</span> 检测到妈妈可能跌倒
        </h2>
      </header>
      <main className="flex-1 px-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] space-y-6 py-6 text-gray-800">
        <div className="bg-white rounded-[24px] p-6 card-shadow border border-red-50 space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-gray-500 text-sm">发生时间</span>
            <span className="font-bold text-gray-800">2026-05-10 13:00:23</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-gray-500 text-sm">发生位置</span>
            <span className="font-bold text-gray-800">主卧室</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-gray-500 text-sm">持续时长</span>
            <span className="font-bold text-gray-800 text-red-500">已达 3 分钟</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500 text-sm">最新体征数据</span>
            <span className="font-bold text-gray-800">心率稍快 95bmp</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-gray-500 font-bold text-xs px-1 tracking-widest uppercase">实时画面核实</h3>
          {!isVideoOpen ? (
            <button 
              onClick={() => setIsVideoOpen(true)}
              className="w-full h-32 border-2 border-dashed border-[#024481]/30 rounded-[20px] text-[#024481] font-bold flex flex-col items-center justify-center gap-2 bg-blue-50/50"
            >
              <span className="text-3xl">🎥</span>
              <span>点击查看实时监控画面</span>
            </button>
          ) : (
            <div className="aspect-video bg-gray-900 rounded-[20px] overflow-hidden relative border-2 border-red-500 shadow-lg shadow-red-500/20">
              <img src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="核实画面" />
              <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span> LIVE
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <button className="w-full bg-[#024481] text-white py-4 rounded-[20px] flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform text-lg">
            <span className="text-2xl">📞</span>
            <span className="font-bold">呼叫妈妈</span>
          </button>
          <button className="w-full bg-red-600 text-white py-4 rounded-[20px] flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-[0.98] transition-transform text-lg">
            <span className="text-2xl">🚑</span>
            <span className="font-bold">拨打 120急救</span>
          </button>
          <button className="w-full bg-white border-2 border-gray-200 text-gray-800 py-4 rounded-[20px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform text-lg">
            <span className="text-2xl">🏘️</span>
            <span className="font-bold">联系物业服务</span>
          </button>
        </div>

        <div className="pt-6 pb-10 text-center">
          {!showFalseAlarmConfirm ? (
            <button 
              onClick={() => setShowFalseAlarmConfirm(true)}
              className="text-gray-400 font-bold text-sm underline underline-offset-4"
            >
              这可能是一次误报？
            </button>
          ) : (
             <div className="bg-gray-100 p-4 rounded-[20px] flex flex-col gap-3">
               <p className="text-sm font-bold text-gray-700">确认这是一次误报吗？</p>
               <div className="flex gap-3">
                 <button onClick={() => setShowFalseAlarmConfirm(false)} className="flex-1 bg-white py-2 rounded-xl text-gray-500 font-bold shadow-sm">取消</button>
                 <button onClick={onClose} className="flex-1 bg-gray-300 py-2 rounded-xl text-gray-700 font-bold shadow-sm">标记为误报</button>
               </div>
             </div>
          )}
        </div>
      </main>
    </motion.div>
  );
};

// --- 子组件：语音发送页 ---
const VoiceMessageView = ({ onClose }: { onClose: () => void }) => {
  const [isRecording, setIsRecording] = useState(false);
  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="absolute inset-0 z-[100] bg-white flex flex-col"
    >
      <header className="px-6 py-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 text-black">发送语音指令</h2>
        <button onClick={onClose} className="text-gray-400 text-2xl">✕</button>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center p-10 space-y-16">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-800 text-black">{isRecording ? '正在录音...' : '点击开始录音'}</h3>
          <p className="text-gray-400">机器人将循环播放这段录音</p>
        </div>
        <div className="relative">
          {isRecording && (
            <motion.div 
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-[#024481]/10 rounded-full"
            />
          )}
          <button 
            onMouseDown={() => setIsRecording(true)}
            onMouseUp={() => setIsRecording(false)}
            onMouseLeave={() => setIsRecording(false)}
            className={`relative w-40 h-40 rounded-full bg-[#024481] shadow-2xl flex items-center justify-center text-5xl active:scale-90 transition-transform ${isRecording ? 'brightness-125 shadow-[#024481]/40' : ''}`}
          >
            🎙️
          </button>
        </div>
        <p className="text-sm text-[#024481] font-bold">长按底部按钮录制</p>
      </div>
      <div className="p-10 text-center">
        <button onClick={onClose} className="text-gray-400 font-bold">完成并退出</button>
      </div>
    </motion.div>
  );
};

// --- 子�
// --- 子组件：守护首页 ---
const GuardianView = ({ 
  onAction, 
  onImageClick, 
  onStatusClick 
}: { 
  onAction: (type: OverlayType) => void;
  onImageClick: (src: string) => void;
  onStatusClick: (data: AlertData) => void;
}) => {
  const images = [
    { url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800" },
    { url: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800" },
    { url: "https://images.unsplash.com/photo-1573620959092-230f87efd939?auto=format&fit=crop&q=80&w=800" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-24"
    >
      {/* 状态栏：显示系统当前健康状况 */}
      <button 
        onClick={() => onStatusClick({
          time: '刚刚',
          type: '跌倒疑似告警',
          status: 'critical',
          message: '系统检测到长辈在卧室可能发生跌倒，请立即确认画面。'
        })}
        className="w-full bg-[#fef2f2] border border-[#fee2e2] px-4 py-3 rounded-full flex justify-between items-center shadow-sm active:scale-[0.98] transition-all"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-red-600 font-bold">疑似跌倒告警</span>
        </div>
        <span className="text-red-400 text-sm font-bold flex items-center gap-1">点击处理 ➡️</span>
      </button>

      {/* 安心时刻卡片：展示长辈实时抓拍画面 */}
      <div className="bg-white rounded-[24px] p-6 card-shadow border border-gray-50 flex flex-col gap-4 mx-auto w-[90%] md:w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">安心时刻</h2>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs">刚刚 抓拍</span>
            {/* 刷新按钮：模拟下拉刷新 */}
            <button 
              className="w-8 h-8 rounded-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:text-[#024481] hover:bg-blue-50 active:scale-95 active:rotate-180 transition-all duration-300 shadow-sm border border-gray-100 cursor-pointer"
            >
              🔄
            </button>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory">
          {images.map((item, index) => (
            <div 
              key={index}
              onClick={() => onImageClick(item.url)}
              className="relative shrink-0 w-[85%] aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 shadow-inner snap-center cursor-pointer"
            >
              <img 
                src={item.url} 
                alt="长辈安心时刻" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-bold">
                {index + 1} / {images.length}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] text-gray-400 font-medium pb-2">左右滑动查看更多抓拍 ↔️</p>
      </div>

      {/* 今日概况：关键健康指标摘要 */}
      <div className="space-y-4">
        <h3 className="text-gray-500 font-bold text-xs px-1 tracking-widest uppercase">今日概况</h3>
        <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2">
           <div className="flex-shrink-0 bg-white p-5 rounded-[24px] w-36 card-shadow border border-gray-50 flex flex-col items-start">
             <div className="text-3xl mb-3">🌙</div>
             <p className="text-gray-400 text-xs font-bold mb-1">昨晚睡眠</p>
             <p className="text-lg font-bold text-gray-800">6h 20m <span className="text-xs text-gray-400 font-normal ml-1">85分</span></p>
           </div>
           <div className="flex-shrink-0 bg-white p-5 rounded-[24px] w-36 card-shadow border border-gray-50 flex flex-col items-start">
             <div className="flex justify-between w-full mb-3 items-center">
               <div className="text-3xl">💊</div>
               <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
             </div>
             <p className="text-gray-400 text-xs font-bold mb-1">今日用药</p>
             <p className="text-lg font-bold text-gray-800">待服用 x1</p>
           </div>
           <div className="flex-shrink-0 bg-white p-5 rounded-[24px] w-36 card-shadow border border-gray-50 flex flex-col items-start">
             <div className="flex justify-between w-full mb-3 items-center">
               <div className="text-3xl">❤️</div>
               <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-bold">偏高</span>
             </div>
             <p className="text-gray-400 text-xs font-bold mb-1">最近血压</p>
             <p className="text-lg font-bold text-red-500">148/86</p>
           </div>
        </div>
      </div>

      {/* 快速操作按钮 */}
      <div className="space-y-3">
        <h3 className="text-gray-500 font-bold text-xs px-1 tracking-widest uppercase">快捷操作</h3>
        <div className="grid grid-cols-3 gap-4">
          <button 
            onClick={() => onAction('videoCall')}
            className="bg-[#024481] text-white py-5 rounded-[20px] flex flex-col items-center gap-2 shadow-lg active:scale-95 transition-all w-full"
          >
            <span className="text-3xl">📞</span>
            <span className="font-bold text-sm">呼叫小和</span>
          </button>
          <button 
            className="bg-white text-gray-700 border border-gray-100 py-5 rounded-[20px] flex flex-col items-center gap-2 card-shadow active:scale-95 transition-all w-full"
          >
            <span className="text-3xl">📷</span>
            <span className="font-bold text-sm">看看爸妈</span>
          </button>
          <button 
             onClick={() => onAction('voiceMessage')}
            className="bg-white text-gray-700 border border-gray-100 py-5 rounded-[20px] flex flex-col items-center gap-2 card-shadow active:scale-95 transition-all w-full"
          >
            <span className="text-3xl">🎙️</span>
            <span className="font-bold text-sm">发送语音</span>
          </button>
        </div>
      </div>

      {/* 消息提醒入口 */}
      <div className="bg-white rounded-2xl p-4 card-shadow flex items-center justify-between border border-red-50">
        <div className="flex items-center gap-3">
           <div className="relative">
             <span className="text-2xl">🔔</span>
             <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
           </div>
           <div>
             <p className="text-sm font-bold text-gray-800">最新提醒</p>
             <p className="text-xs text-gray-500">今早血压偏高148/86，请关注</p>
           </div>
        </div>
        <span className="text-gray-400">➡️</span>
      </div>
    </motion.div>
  );
};

// --- 子组件：健康详情 ---
const healthData = [
  { name: '05/20', sys: 110, dia: 70 },
  { name: '05/21', sys: 115, dia: 72 },
  { name: '05/22', sys: 125, dia: 78 },
  { name: '05/23', sys: 118, dia: 75 },
  { name: '05/24', sys: 142, dia: 88 },
  { name: '今日', sys: 122, dia: 78 },
];

const HealthView = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-6 pb-24"
  >
    <div className="flex flex-col gap-1">
      <h2 className="text-2xl font-bold text-gray-800">健康管理</h2>
      <p className="text-gray-500 text-sm">为您悉心守护，享受惬意健康的每一天</p>
    </div>

    {/* 依从性反馈 */}
    <div className="bg-white rounded-[24px] p-6 card-shadow flex items-center gap-6 border border-gray-50">
      <div 
        className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-inner"
        style={{ background: '#0d6c42' }}
      >
        <div className="absolute inset-0 rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)', background: '#2a5c9a' }}></div>
        <div className="absolute inset-0 rounded-full" style={{ clipPath: 'polygon(50% 50%, 0 100%, 0 0)', background: '#f97316' }}></div>
        <div className="absolute inset-0 rounded-full" style={{ clipPath: 'polygon(50% 50%, 0 0, 50% 0)', background: '#7c3aed' }}></div>
        <div className="w-[92px] h-[92px] bg-white rounded-full flex flex-col items-center justify-center z-10">
          <span className="text-3xl font-extrabold text-gray-800 leading-none">95</span>
          <span className="text-[10px] text-gray-400 font-bold mt-1">综合评分</span>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="font-bold text-lg">本周依从性</h3>
        <p className="text-[#0d6c42] text-sm font-bold flex items-center gap-1">
          <span>📈</span> 比上周 +5%
        </p>
        <div className="grid grid-cols-2 gap-x-2 gap-y-2 mt-2">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0d6c42]"></span><span className="text-[10px] text-gray-500">用药 40%</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2a5c9a]"></span><span className="text-[10px] text-gray-500">监测 30%</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f97316]"></span><span className="text-[10px] text-gray-500">运动 20%</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7c3aed]"></span><span className="text-[10px] text-gray-500">饮食 10%</span></div>
        </div>
      </div>
    </div>

    {/* 用药记录 */}
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-lg text-gray-800">今日用药</h3>
        <button className="text-[#024481] font-bold text-sm flex items-center gap-1">查看日历 📅</button>
      </div>
      <div className="space-y-3">
        <div className="bg-[#f0fdf4] p-4 rounded-[20px] flex items-center justify-between border-l-4 border-[#16a34a] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-xl">☀️</div>
            <div>
              <p className="font-bold text-gray-800">阿司匹林肠溶片</p>
              <p className="text-xs text-gray-500">08:00 早餐后</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#16a34a] flex items-center gap-1">✅ 已服用</span>
        </div>
        
        <div className="bg-[#fef2f2] p-4 rounded-[20px] flex items-center justify-between border-l-4 border-[#dc2626] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fee2e2] flex items-center justify-center text-xl">🕛</div>
            <div>
              <p className="font-bold text-gray-800">维生素 D3</p>
              <p className="text-xs text-gray-500">12:30 午餐后</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#dc2626] flex items-center gap-1">⚠️ 漏服</span>
        </div>

        <div className="bg-[#eff6ff] p-4 rounded-[20px] flex items-center justify-between border-l-4 border-[#2563eb] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#dbeafe] flex items-center justify-center text-xl">🌙</div>
            <div>
              <p className="font-bold text-gray-800">缬沙坦胶囊</p>
              <p className="text-xs text-gray-500">20:00 睡前</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#2563eb] flex items-center gap-1">⏳ 待服用</span>
        </div>
      </div>
    </div>

    {/* 体征趋势模拟图 */}
    <div className="bg-white rounded-[24px] p-6 card-shadow space-y-4 border border-gray-50">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">体征趋势</h3>
        <span className="text-xl">📈</span>
      </div>
      <div className="flex bg-gray-100 p-1 rounded-full overflow-hidden">
        <button className="flex-1 py-1.5 px-3 rounded-full bg-white text-[#024481] font-bold shadow-sm text-sm">血压</button>
        <button className="flex-1 py-1.5 px-3 rounded-full text-gray-500 font-bold text-sm">血糖</button>
        <button className="flex-1 py-1.5 px-3 rounded-full text-gray-500 font-bold text-sm">心率</button>
        <button className="flex-1 py-1.5 px-3 rounded-full text-gray-500 font-bold text-sm">体重</button>
      </div>
      <div className="h-48 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={healthData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
            <Tooltip />
            <Area type="monotone" dataKey="sys" stroke="#024481" strokeWidth={3} fillOpacity={0.1} fill="#024481" />
            <Area type="monotone" dataKey="dia" stroke="#84d8a4" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* 异常记录 */}
    <div className="space-y-3">
      <h3 className="font-bold text-lg text-gray-800 px-1">异常记录</h3>
      <div className="bg-white p-5 rounded-[24px] shadow-sm border border-[#fee2e2]">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            <p className="font-bold text-gray-800">收缩压偏高</p>
          </div>
          <span className="text-[12px] text-gray-400">今日 08:30</span>
        </div>
        <div className="flex justify-between items-end">
          <p className="text-3xl text-[#dc2626] font-bold">142 <span className="text-xs font-normal text-gray-500">mmHg</span></p>
          <div className="bg-[#dcfce7] px-2 py-1 rounded text-[10px] text-[#16a34a] font-bold">已复测正常 (128)</div>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- 子组件：AI 陪伴 ---
const CompanionView = () => {
  const [liked, setLiked] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 pb-24"
    >
      {/* 传家记忆 */}
      <div className="relative overflow-hidden rounded-[24px] bg-white p-6 shadow-sm border border-[#efeded] card-shadow">
        <span className="absolute -top-4 -left-2 text-[80px] font-serif text-[#024481]/10 select-none">“</span>
        <div className="relative z-10">
          <h2 className="font-bold text-[#024481] mb-2 text-sm">今日记忆金句</h2>
          <p className="text-xl text-gray-800 leading-snug italic font-medium">
            “岁月漫长，唯有爱与陪伴，能让每一个清晨都洒满阳光。”
          </p>
          <div className="mt-4 flex justify-end">
            <span className="text-sm text-gray-400">— 记录于 2023年冬季</span>
          </div>
        </div>
        <span className="absolute -bottom-10 -right-2 text-[80px] font-serif text-[#024481]/10 select-none">”</span>
      </div>

      {/* AI 金句关怀 */}
      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-[24px] bg-[#024481] p-6 text-blue-100 flex flex-col justify-between card-shadow">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✨</span>
            <h3 className="text-xl font-bold text-white">小和的关怀</h3>
          </div>
          <p className="text-base mb-6 text-white/90 leading-relaxed font-medium">
            王阿姨，检测到您这周散步时间增加了15%，您的心肺耐力正在稳步提升！
          </p>
          <div className="bg-white/10 rounded-[16px] p-4 border border-white/20">
            <p className="font-bold text-white text-sm">今日建议</p>
            <p className="text-sm text-white/80 mt-1">午后建议尝试5分钟深呼吸练习，有助于保持心情舒畅。</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setLiked(!liked)}
            className={`flex-1 h-16 rounded-[20px] flex items-center justify-center gap-2 text-lg font-bold transition-all shadow-sm ${liked ? 'bg-pink-100 text-pink-600' : 'bg-[#e6f4ea] text-[#0d6c42]'}`}
          >
            {liked ? '💖 已点赞' : '🤍 为她点赞'}
          </button>
          <button className="flex-1 h-16 rounded-[20px] bg-gray-100 text-gray-700 flex items-center justify-center gap-2 text-lg font-bold shadow-sm active:bg-gray-200">
            🎙️ 语音鼓励
          </button>
        </div>
      </div>

      {/* 运动周历 */}
      <div className="rounded-[24px] bg-white p-6 card-shadow border border-gray-50 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg flex items-center gap-2">🏋️‍♀️ 运动周历</h3>
          <span className="text-sm font-bold text-gray-500">目标：4/7天</span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {[
            { day: '一', level: 'low' },
            { day: '二', level: 'medium' },
            { day: '三', level: 'low' },
            { day: '四', level: 'high' },
            { day: '五', level: 'none' },
            { day: '六', level: 'none' },
            { day: '日', level: 'none' },
          ].map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400">{d.day}</span>
              <div className={`w-full aspect-square rounded-[10px] ${
                d.level === 'high' ? 'bg-[#0d6c42] ring-2 ring-[#0d6c42] ring-offset-2' : 
                d.level === 'medium' ? 'bg-[#4ade80]' : 
                d.level === 'low' ? 'bg-[#bbf7d0]' : 'bg-gray-100'
              }`}></div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <span className="w-2 h-2 rounded-full bg-[#0d6c42]"></span>
          <span>今日完成：30分钟 慢走</span>
        </div>
      </div>

      {/* 情绪脸谱 */}
      <div className="rounded-[24px] bg-white p-6 card-shadow border border-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2">😊 情绪脸谱</h3>
          <button className="text-[#024481] font-bold text-sm">查看详情</button>
        </div>
        <div className="flex justify-between items-end h-16">
          <div className="flex flex-col items-center gap-2 grayscale"><span className="text-2xl">😊</span><span className="text-[10px] text-gray-400 font-bold">周一</span></div>
          <div className="flex flex-col items-center gap-2 grayscale"><span className="text-2xl">😊</span><span className="text-[10px] text-gray-400 font-bold">周二</span></div>
          <div className="flex flex-col items-center gap-2 grayscale"><span className="text-2xl">😐</span><span className="text-[10px] text-gray-400 font-bold">周三</span></div>
          <div className="flex flex-col items-center gap-3"><span className="text-4xl animate-bounce">🥰</span><span className="text-[12px] text-[#024481] font-bold">今天</span></div>
          <div className="flex flex-col items-center gap-2"><div className="w-8 h-8 bg-gray-50 rounded-full"></div><span className="text-[10px] text-gray-300 font-bold">周五</span></div>
          <div className="flex flex-col items-center gap-2"><div className="w-8 h-8 bg-gray-50 rounded-full"></div><span className="text-[10px] text-gray-300 font-bold">周六</span></div>
          <div className="flex flex-col items-center gap-2"><div className="w-8 h-8 bg-gray-50 rounded-full"></div><span className="text-[10px] text-gray-300 font-bold">周日</span></div>
        </div>
      </div>
    </motion.div>
  );
};

// --- 子组件：个人中心 ---
const ProfileView = () => {
  const [switches, setSwitches] = useState({ push: true, sms: true, voice: false });
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-24"
    >
      {/* 个人简介 */}
      <div className="flex flex-col items-center pt-2">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop" 
              alt="用户头像" 
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 bg-[#024481] text-white p-1.5 rounded-full border-2 border-white shadow-md text-xs">
            🖊️
          </button>
        </div>
        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold text-gray-800">张建设 <span className="text-base text-gray-500 font-normal ml-1">78岁</span></h2>
          <div className="flex gap-2 mt-3 justify-center">
            <span className="px-3 py-1 bg-blue-100 text-[#094784] rounded-full text-xs font-bold">A型血</span>
            <span className="px-3 py-1 bg-[#a0f5bf] text-[#187248] rounded-full text-xs font-bold">独居模式</span>
            <span className="px-3 py-1 bg-white border border-[#024481] text-[#024481] rounded-full text-xs font-bold opacity-80">健康良好</span>
          </div>
        </div>
      </div>

      {/* 设备管理 */}
      <div className="bg-white rounded-[24px] p-6 card-shadow border border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 text-[#024481] rounded-xl flex items-center justify-center text-3xl">
              🤖
            </div>
            <div>
              <p className="font-bold text-gray-800">守护机器人 01</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#0d6c42] animate-pulse"></span>
                <span className="text-xs text-[#0d6c42] font-bold">在线</span>
              </div>
            </div>
          </div>
          <button className="p-2 text-gray-400">⚙️</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#f8fafc] p-3 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] text-gray-400 font-bold mb-1 uppercase">电量</span>
            <p className="font-bold text-gray-800">🔋 85%</p>
          </div>
          <div className="bg-[#f8fafc] p-3 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] text-gray-400 font-bold mb-1 uppercase">网络</span>
            <p className="font-bold text-gray-800">📶 极佳</p>
          </div>
        </div>
      </div>

      {/* 紧急联系人 */}
      <div className="bg-white rounded-[24px] p-6 card-shadow border border-gray-50">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-xl">🚨</span>
            <h3 className="font-bold text-lg text-gray-800">紧急联系人</h3>
          </div>
          <button className="text-[#024481] font-bold text-sm">➕ 添加</button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-[16px]">
            <div className="flex items-center gap-3">
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">1st</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">张大伟 <span className="text-gray-400 font-normal ml-1">长子</span></p>
                <p className="text-xs text-gray-500 mt-0.5">138-xxxx-8888</p>
              </div>
            </div>
            <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#024481]">📞</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-[16px]">
            <div className="flex items-center gap-3">
              <span className="bg-gray-400 text-white text-[10px] font-bold px-2 py-1 rounded">2nd</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">李美玲 <span className="text-gray-400 font-normal ml-1">长女</span></p>
                <p className="text-xs text-gray-500 mt-0.5">139-xxxx-9999</p>
              </div>
            </div>
            <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#024481]">📞</button>
          </div>
        </div>
      </div>

      {/* 成员管理（家人信息） */}
      <div className="bg-white rounded-[24px] p-6 card-shadow border border-gray-50">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-lg text-gray-800">家人管家</h3>
          <span className="text-gray-400 text-xs">3人在线</span>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full border-2 border-[#024481] p-0.5"><img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" className="w-full h-full rounded-full object-cover" alt="我" /></div>
            <span className="text-[10px] font-bold text-gray-800">我</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full border-2 border-gray-100 p-0.5"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" className="w-full h-full rounded-full object-cover" alt="大伟" /></div>
            <span className="text-[10px] font-bold text-gray-400">大伟</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full border-2 border-gray-100 p-0.5"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop" className="w-full h-full rounded-full object-cover" alt="小玲" /></div>
            <span className="text-[10px] font-bold text-gray-400">小玲</span>
          </div>
          <button className="w-12 h-12 rounded-full bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xl">
            ＋
          </button>
        </div>
      </div>

      {/* 用药计划摘要 */}
      <div className="bg-white rounded-[24px] p-6 card-shadow border border-gray-50">
        <div className="flex justify-between items-center mb-5">
           <div className="flex items-center gap-2">
            <span className="text-[#024481] text-xl">💊</span>
            <h3 className="font-bold text-lg text-gray-800">用药计划设置</h3>
          </div>
          <button className="text-[#024481] font-bold text-sm">修改 ➡️</button>
        </div>
        <div className="bg-blue-50/50 p-4 rounded-2xl flex justify-between items-center">
           <div>
             <p className="font-bold text-gray-800 text-sm">当前共 3 种药品</p>
             <p className="text-xs text-gray-500 mt-1">下次提醒: 20:00 睡前</p>
           </div>
           <div className="flex -space-x-2">
             <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">💊</div>
             <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">💊</div>
             <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">💊</div>
           </div>
        </div>
      </div>

      {/* 告警设置 */}
      <div className="bg-white rounded-[24px] p-6 card-shadow border border-gray-50">
        <h3 className="font-bold text-lg text-gray-800 mb-5">告警推送方式</h3>
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-xl">📱</span>
              <span className="font-bold text-sm">App 推送提醒 (默认)</span>
            </div>
            <span className="text-sm font-bold text-[#0d6c42]">常开状态</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-xl">💬</span>
              <span className="font-bold text-sm">短信通知</span>
            </div>
            <button 
              onClick={() => setSwitches(s => ({...s, sms: !s.sms}))} 
              className={`w-12 h-6 rounded-full relative transition-colors ${switches.sms ? 'bg-[#024481]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all ${switches.sms ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-xl">☎️</span>
              <span className="font-bold text-sm">语音呼叫</span>
            </div>
            <button 
              onClick={() => setSwitches(s => ({...s, voice: !s.voice}))} 
              className={`w-12 h-6 rounded-full relative transition-colors ${switches.voice ? 'bg-[#024481]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all ${switches.voice ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* 隐私与安全设置 */}
      <div className="bg-white rounded-[24px] p-6 card-shadow border border-gray-50">
        <h3 className="font-bold text-lg text-gray-800 mb-5">隐私设置</h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between text-sm py-3 bg-gray-50 rounded-xl px-4">
            <div className="flex items-center gap-3">
              <span className="text-lg">👁️</span>
              <span className="font-medium text-gray-800 text-left">摄像头调用记录<br/><span className="text-[10px] text-gray-400">查看历史告警/查看实时监控调用</span></span>
            </div>
            <span className="text-gray-400 font-bold">➡️</span>
          </button>
          <button className="w-full flex items-center justify-between text-sm py-3 bg-gray-50 rounded-xl px-4">
            <div className="flex items-center gap-3">
              <span className="text-lg">🗑️</span>
              <span className="font-medium text-gray-800">清除历史数据</span>
            </div>
            <span className="text-gray-400 font-bold">➡️</span>
          </button>
        </div>
      </div>

      {/* 关于 */}
      <div className="text-center space-y-2 mt-10">
         <p className="text-xs text-gray-400 font-bold">康养陪伴系统 v1.2.0</p>
         <div className="flex justify-center gap-4 text-xs text-[#024481]">
           <button>用户协议</button>
           <button>隐私政策</button>
         </div>
      </div>

      {/* 退出登录 */}
      <button className="w-full py-4 rounded-[20px] bg-red-50 text-red-600 font-bold text-lg hover:bg-red-100 transition-colors mt-8">
        退出登录
      </button>
    </motion.div>
  );
};

// --- 主组件 ---
export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('guardian');
  const [overlay, setOverlay] = useState<OverlayType | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [alertData, setAlertData] = useState<AlertData | null>(null);

  // 根据当前标签渲染视图
  const renderContent = () => {
    switch (activeTab) {
      case 'guardian': return (
        <GuardianView 
          onAction={(type) => setOverlay(type)}
          onImageClick={(src) => {
            setSelectedImage(src);
            setOverlay('imageViewer');
          }}
          onStatusClick={(data) => {
            setAlertData(data);
            setOverlay('alertDetail');
          }}
        />
      );
      case 'health': return <HealthView />;
      case 'companion': return <CompanionView />;
      case 'profile': return <ProfileView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#e5e5e5] flex items-center justify-center p-4">
      {/* 手机外壳 */}
      <div className="w-full max-w-[390px] h-[844px] bg-black rounded-[50px] p-2 relative shadow-2xl flex flex-col shrink-0 ring-4 ring-black/10">
        <div className="flex-1 bg-[#fbf9f8] rounded-[42px] overflow-hidden flex flex-col relative text-gray-800">
          
          {/* 刘海屏 / 动态岛 */}
          <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50 pointer-events-none">
            <div className="w-32 h-6 bg-black rounded-b-3xl"></div>
          </div>

      {/* 全屏 Overlay 渲染 */}
      <AnimatePresence>
        {overlay === 'imageViewer' && selectedImage && (
          <ImageViewer src={selectedImage} onClose={() => setOverlay(null)} />
        )}
        {overlay === 'videoCall' && (
          <VideoCallView onClose={() => setOverlay(null)} />
        )}
        {overlay === 'alertDetail' && alertData && (
          <AlertDetailView data={alertData} onClose={() => setOverlay(null)} />
        )}
        {overlay === 'voiceMessage' && (
          <VoiceMessageView onClose={() => setOverlay(null)} />
        )}
      </AnimatePresence>

      {/* 顶部标题栏 */}
      <header className="flex justify-between items-center px-6 py-4 pt-10 sticky top-0 bg-[#fbf9f8]/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <h1 className="text-xl font-bold text-[#024481]">嘉和康养</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center card-shadow active:scale-95 transition-transform">
          🔔
        </button>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 px-6 pt-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <AnimatePresence mode="wait">
          <div key={activeTab}>
            {renderContent()}
          </div>
        </AnimatePresence>
      </main>

      {/* 底部导航栏 */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 pb-6 pt-3 px-4 flex justify-around items-center z-40 rounded-b-[42px]">
        {[
          { id: 'guardian', icon: '🛡️', label: '守护' },
          { id: 'health', icon: '📈', label: '健康' },
          { id: 'companion', icon: '🫂', label: '陪伴' },
          { id: 'profile', icon: '👤', label: '我的' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 relative px-4 py-1.5 rounded-3xl ${
              activeTab === tab.id ? 'bg-[#a0f5bf]/50 text-[#0d6c42] scale-105' : 'text-gray-400 scale-95'
            }`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="text-[10px] font-bold tracking-wider">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute -bottom-1 w-1 h-1 bg-[#0d6c42] rounded-full"
              />
            )}
          </button>
        ))}
      </nav>
        </div>
      </div>
    </div>
  );
}

