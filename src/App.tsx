/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceArea } from 'recharts';

// --- 类型定义 ---
type TabType = 'guardian' | 'health' | 'companion' | 'profile';
type OverlayType = 'alertDetail' | 'videoCall' | 'voiceMessage' | 'imageViewer' | 'notifications' | 'elderlyProfile' | 'addRobot' | 'emergencyContacts' | 'familyMembers' | 'medicationPlan' | 'medicationCalendar' | 'legalNotice' | 'robotDetail' | 'confirmDelete' | 'cameraAccessLogs' | 'alarmSettings' | 'healthReport';

interface CameraLog {
  id: string;
  time: string;
  source: '告警' | '通话' | '抓拍';
  status: string;
}

interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  avatar: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  times: string[];
}

interface AlertData {
  time: string;
  type: string;
  status: 'critical' | 'warning';
  message: string;
}

// --- 子组件：全屏图片查看器 ---
const ImageViewer = ({ src, onClose }: { src: string; onClose: () => void }) => {
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center p-0"
    >
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={onClose} className="text-white text-3xl drop-shadow-md">✕</button>
        <button 
          onClick={handleSave}
          className="bg-white/20 backdrop-blur-xl text-white px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 active:scale-95 transition-transform"
        >
          <span>📥</span> 保存图片
        </button>
      </header>

      <div className="w-full h-full flex items-center justify-center">
        <motion.img 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          src={src} 
          alt="全屏查看" 
          className="max-w-full max-h-full transition-transform duration-300 touch-none shadow-2xl"
          referrerPolicy="no-referrer"
        />
      </div>

      <AnimatePresence>
        {showSavedToast && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 bg-white text-[#024481] px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 z-20"
          >
            <span>✅</span> 已成功保存至相册
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-30">
        <p className="text-white text-[10px] font-bold tracking-widest uppercase">双指可缩放查看细节</p>
      </div>
    </motion.div>
  );
};

// --- 子组件：视频通话页 ---
const VideoCallView = ({ onClose, isConnecting }: { onClose: () => void; isConnecting: boolean }) => {
  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-[100] bg-gray-900 flex flex-col"
    >
      <div className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center transition-all duration-1000 ${isConnecting ? 'opacity-30 blur-xl scale-110' : 'opacity-100 blur-0 scale-100'}`}></div>
      
      {/* 自己的画面 (PIP) */}
      {!isConnecting && (
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
        {!isConnecting && (
          <div className="bg-black/40 backdrop-blur inline-flex items-center gap-2 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-white text-xs font-bold">小和指示灯闪烁中，正在播放画面</span>
          </div>
        )}
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-between py-20 z-10 w-full px-6">
        <div className="text-center mt-10">
          {isConnecting ? (
            <div className="space-y-6 flex flex-col items-center">
               <div className="relative w-24 h-24">
                 <motion.div 
                   animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="absolute inset-0 bg-blue-500 rounded-full blur-xl"
                 />
                 <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-4xl shadow-inner">
                   👴
                 </div>
               </div>
               <div className="space-y-2">
                 <h2 className="text-white text-2xl font-bold tracking-widest animate-pulse">正在呼叫妈妈</h2>
                 <p className="text-white/60 text-sm">正在请求父母同意，请稍候...</p>
               </div>
            </div>
          ) : (
            <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <span className="text-white font-mono text-sm">正在通话 00:45</span>
            </div>
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
  onStatusClick,
  onTabSwitch,
  isDeviceOffline = false,
  isAnonymous = false
}: { 
  onAction: (type: OverlayType) => void;
  onImageClick: (src: string) => void;
  onStatusClick: (data: AlertData) => void;
  onTabSwitch: (tab: TabType) => void;
  isDeviceOffline?: boolean;
  isAnonymous?: boolean;
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [captureStep, setCaptureStep] = useState('');

  const [images, setImages] = useState(isAnonymous ? [] : [
    { url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800" },
    { url: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800" },
    { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800" }
  ]);

  const handleRefresh = async () => {
    if (isCapturing || isDeviceOffline) return;
    
    setIsCapturing(true);
    setCaptureProgress(0);
    
    const steps = [
      { p: 15, s: '指令正在下发...' },
      { p: 45, s: '机器人正移动至老人附近...' },
      { p: 75, s: '摄像头瞬间开启抓拍...' },
      { p: 95, s: '加密上传影像中...' }
    ];

    for (const step of steps) {
      setCaptureStep(step.s);
      // 模拟每一步的耗时
      await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
      setCaptureProgress(step.p);
    }

    // 抓拍成功后，模拟多加一张图片（或者替换第一张）
    const newImg = { url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=800&sig=${Date.now()}` };
    setImages(prev => [newImg, ...prev.slice(0, 2)]);
    
    setIsCapturing(false);
    setCaptureProgress(100);
    setCaptureStep('抓拍成功');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-24"
    >
      {/* 状态栏：显示系统当前健康状况 */}
      {!isAnonymous && (
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
      )}

      {/* 安心时刻卡片：展示长辈实时抓拍画面 */}
      <div className="bg-white rounded-[24px] p-6 card-shadow border border-gray-50 flex flex-col gap-4 mx-auto w-[90%] md:w-full min-h-[300px]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">安心时刻</h2>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs">{isCapturing ? '正在尝试抓拍...' : '刚刚 抓拍'}</span>
            {/* 刷新按钮 */}
            <button 
              onClick={handleRefresh}
              disabled={isCapturing || isDeviceOffline}
              className={`w-8 h-8 rounded-full flex flex-col items-center justify-center shadow-sm border border-gray-100 cursor-pointer transition-all ${
                isCapturing ? 'bg-blue-50 text-[#024481]' : 'bg-gray-50 text-gray-400 hover:text-[#024481] hover:bg-blue-50'
              } active:scale-95 disabled:opacity-50`}
            >
              <motion.span
                animate={isCapturing ? { rotate: 360 } : {}}
                transition={isCapturing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
              >
                🔄
              </motion.span>
            </button>
          </div>
        </div>

        {isDeviceOffline ? (
          <div className="w-full aspect-[4/3] rounded-2xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-3">
            <span className="text-4xl text-gray-300">📷</span>
            <p className="text-xs text-gray-400 font-bold">设备离线或被遮挡，无法获取影像</p>
          </div>
        ) : isAnonymous ? (
          <div className="w-full aspect-[4/3] rounded-2xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-3">
            <span className="text-4xl text-gray-300">🍃</span>
            <p className="text-xs text-gray-400 font-bold">暂无实时影像数据</p>
          </div>
        ) : isCapturing ? (
          <div className="relative w-full aspect-[4/3] rounded-2xl bg-gray-900 overflow-hidden flex flex-col items-center justify-center p-6 gap-4">
             <div className="text-3xl animate-pulse">🛰️</div>
             <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${captureProgress}%` }}
                  className="h-full bg-blue-500"
                />
             </div>
             <p className="text-white/60 text-xs font-bold tracking-widest">{captureStep}</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory">
            {images.map((item, index) => (
              <div 
                key={index}
                onClick={() => onImageClick(item.url)}
                className="relative shrink-0 w-[85%] aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 shadow-inner snap-center cursor-pointer group"
              >
                <img 
                  src={item.url} 
                  alt="长辈安心时刻" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-bold">
                  {index + 1} / {images.length}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button 
          onClick={handleRefresh}
          className="text-center text-[10px] text-gray-400 font-bold pb-2 uppercase tracking-widest active:scale-95 transition-transform"
        >
          {isCapturing ? '正在尝试建立物理连接...' : '下拉或点击以上图标 立即抓拍一张 ↓'}
        </button>
      </div>

      {/* 今日概况：关键健康指标摘要 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-gray-500 font-bold text-xs tracking-widest uppercase">今日概况</h3>
          {!isAnonymous && (
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map(idx => (
                <div 
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeCardIndex === idx ? 'w-4 bg-[#024481]' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out"
          >
            {isAnonymous ? (
              <div className="w-full px-1">
                <div className="bg-white rounded-[32px] p-10 border border-gray-50 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
                  <div className="text-5xl">🔭</div>
                  <div>
                    <h4 className="font-bold text-gray-800">概况数据正在生成中</h4>
                    <p className="text-xs text-gray-400 mt-1">系统正在全天候监测并分析关键健康趋势</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex w-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
                   onScroll={(e) => {
                     const el = e.currentTarget;
                     const index = Math.round(el.scrollLeft / el.clientWidth);
                     if (index !== activeCardIndex) setActiveCardIndex(index);
                   }}>
              
              {/* 心率呼吸卡片 */}
              <div 
                className="w-full shrink-0 snap-center px-1"
                onClick={() => onTabSwitch('health')}
              >
                <div className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm flex flex-col gap-4 active:scale-[0.98] transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-xl">💓</div>
                      <div>
                        <h4 className="font-bold text-gray-800">心率 / 呼吸</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">毫米波雷达实时监测</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">正常</span>
                      <p className="text-[10px] text-gray-300 mt-1">同步于刚刚</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-2 border-y border-gray-50">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">平均心率</p>
                      <p className="text-xl font-black text-gray-800">72<span className="text-[10px] ml-1 font-bold">bpm</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">平均呼吸</p>
                      <p className="text-xl font-black text-gray-800">18<span className="text-[10px] ml-1 font-bold">次/分</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(6)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ height: [4, 12, 6, 14, 8] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                          className="w-1 bg-red-400 rounded-full"
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">生命体征平稳，未检测到异常波动。</p>
                  </div>
                </div>
              </div>
              <div 
                className="w-full shrink-0 snap-center px-1"
                onClick={() => onTabSwitch('health')}
              >
                <div className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm flex flex-col gap-4 active:scale-[0.98] transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">🌙</div>
                      <div>
                        <h4 className="font-bold text-gray-800">睡眠质量</h4>
                        <p className="text-[10px] text-gray-400 font-bold">昨晚睡眠监测数据</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-[#024481]">78<span className="text-[10px] ml-1 font-bold">分</span></p>
                      <p className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-full">良好</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-2 border-y border-gray-50">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">睡眠时长</p>
                      <p className="text-lg font-bold text-gray-700">6h 20min</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">深睡比例</p>
                      <p className="text-lg font-bold text-gray-700">22%</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed italic">“深度睡眠比例略低，建议晚间睡前适当增加泡脚行为。”</p>
                </div>
              </div>

              {/* 用药卡片 */}
              <div 
                className="w-full shrink-0 snap-center px-1"
                onClick={() => onTabSwitch('health')}
              >
                <div className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm flex flex-col gap-4 active:scale-[0.98] transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl">💊</div>
                      <div>
                        <h4 className="font-bold text-gray-800">今日用药</h4>
                        <p className="text-[10px] text-gray-400 font-bold">服药计划完成度计数</p>
                      </div>
                    </div>
                    <div className="relative">
                      <p className="text-xl font-black text-emerald-600">3/4</p>
                      <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-sm"></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-[10px]">✅</div>
                      <div className="w-6 h-6 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-[10px]">✅</div>
                      <div className="w-6 h-6 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-[10px]">✅</div>
                      <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px]">⏳</div>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-bold">待服 1 次：降压药 (睡前)</p>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed italic">今日表现不错，最后一项目前暂未到开始时间。</p>
                </div>
              </div>

              {/* 血压卡片 */}
              <div 
                className="w-full shrink-0 snap-center px-1"
                onClick={() => onTabSwitch('health')}
              >
                <div className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm flex flex-col gap-4 active:scale-[0.98] transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-xl">🩺</div>
                      <div>
                        <h4 className="font-bold text-gray-800">最新血压</h4>
                        <p className="text-[10px] text-gray-400 font-bold tracking-tight">自动同步于 今早 08:30</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="w-2.5 h-2.5 bg-orange-400 rounded-full shadow-[0_0_8px_rgba(251,146,60,0.5)]"></span>
                       <span className="text-xs font-bold text-orange-500">轻度偏高</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 py-2">
                    <p className="text-4xl font-black text-orange-500">148/86</p>
                    <p className="text-xs text-gray-400 font-bold">mmHg</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100/50">
                    <p className="text-[11px] text-orange-700 leading-relaxed font-medium">
                      ⚠️ 检测到今日血压偏高。建议提醒长辈按时服用降压药物，并保持静息观察，如不适请及时致电紧急联系人。
                    </p>
                  </div>
                </div>
              </div>

            </div>
            )}
          </div>
        </div>
      </div>

      {/* 快速操作按钮 */}
      <div className="space-y-3">
        <h3 className="text-gray-500 font-bold text-xs px-1 tracking-widest uppercase">快捷操作</h3>
        <div className="grid grid-cols-3 gap-4">
          <button 
            onClick={() => onAction('videoCall')}
            className="bg-white text-gray-700 border border-gray-100 py-5 rounded-[20px] flex flex-col items-center gap-2 card-shadow active:scale-95 transition-all w-full"
          >
            <span className="text-3xl">📞</span>
            <span className="font-bold text-sm">呼叫小和</span>
          </button>
          <button 
            onClick={() => onAction('videoCall')}
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
      <div 
        onClick={() => onAction('notifications')}
        className="bg-white rounded-2xl p-4 card-shadow flex items-center justify-between border border-red-50 active:scale-[0.98] transition-transform cursor-pointer"
      >
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
const HealthView = ({ onCalendarClick, isAnonymous }: { onCalendarClick: () => void; isAnonymous?: boolean }) => {
  if (isAnonymous) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 px-6 text-center">
        <div className="text-6xl mb-6">📊</div>
        <h2 className="text-xl font-black text-gray-800 mb-2">暂无健康数据</h2>
        <p className="text-gray-500 text-sm">机器人监测后，将为您生成每日健康报表。</p>
      </div>
    );
  }
  const [metricTab, setMetricTab] = useState<'bp' | 'bs' | 'hr' | 'resp'>('bp');
  const [timeRange, setTimeRange] = useState<'7' | '30'>('7');
  const [expandedMed, setExpandedMed] = useState(false);
  const [abnormalRecords, setAbnormalRecords] = useState([
    { id: '1', type: '收缩压偏高', time: '今日 08:30', value: '142', unit: 'mmHg', detail: '已复测正常 (128)', status: 'warning' },
    { id: '2', type: '心率偏快', time: '昨日 22:15', value: '105', unit: '次/分', detail: '休息后恢复 (72)', status: 'warning' }
  ]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const currentData = React.useMemo(() => {
    const data = [];
    const now = new Date();
    const days = timeRange === '7' ? 7 : 30;
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const name = i === 0 ? '今日' : `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
      
      // 模拟数据缺失：约 15% 的概率缺失，今日保证有数据
      const isMissing = i !== 0 && Math.random() < 0.15;

      if (metricTab === 'bp') {
        data.push({ 
          name, 
          sys: isMissing ? null : 110 + Math.floor(Math.random() * 30), 
          dia: isMissing ? null : 70 + Math.floor(Math.random() * 15),
          isMissing 
        });
      } else if (metricTab === 'bs') {
        data.push({ name, val: isMissing ? null : +(5.0 + Math.random() * 2).toFixed(1), isMissing });
      } else if (metricTab === 'hr') {
        data.push({ name, val: isMissing ? null : 65 + Math.floor(Math.random() * 20), isMissing });
      } else if (metricTab === 'resp') {
        data.push({ name, val: isMissing ? null : 16 + Math.floor(Math.random() * 4), isMissing });
      }
    }
    return data;
  }, [metricTab, timeRange]);

  const renderNormalRange = () => {
    switch(metricTab) {
      case 'bp': return <p className="text-[10px] text-gray-400 mt-1">正常范围: 收缩压90-139 / 舒张压60-89</p>;
      case 'bs': return <p className="text-[10px] text-gray-400 mt-1">正常范围: 空腹 3.9-6.1 mmol/L</p>;
      case 'hr': return <p className="text-[10px] text-gray-400 mt-1">正常范围: 60-100 次/分</p>;
      case 'resp': return <p className="text-[10px] text-gray-400 mt-1">正常范围: 12-20 次/分</p>;
      default: return null;
    }
  };

  const todayMeds = [
    { id: '1', name: '阿司匹林肠溶片', time: '08:00 早餐后', icon: '☀️', status: 'done', statusText: '已服用', color: '#16a34a', bg: '#f0fdf4', iconBg: '#dcfce7' },
    { id: '2', name: '维生素 D3', time: '12:30 午餐后', icon: '🕛', status: 'missed', statusText: '漏服', color: '#dc2626', bg: '#fef2f2', iconBg: '#fee2e2' },
    { id: '3', name: '缬沙坦胶囊', time: '20:00 睡前', icon: '🌙', status: 'pending', statusText: '待服用', color: '#2563eb', bg: '#eff6ff', iconBg: '#dbeafe' },
  ];

  const fullMeds = [
    ...todayMeds,
    { id: '4', name: '钙片', time: '09:00', icon: '☀️', status: 'done', statusText: '已服用', color: '#16a34a', bg: '#f0fdf4', iconBg: '#dcfce7' },
    { id: '5', name: '降压药', time: '19:00', icon: '🌙', status: 'pending', statusText: '待服用', color: '#2563eb', bg: '#eff6ff', iconBg: '#dbeafe' },
  ];

  return (
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
        <button 
          onClick={onCalendarClick}
          className="text-[#024481] font-bold text-sm flex items-center gap-1 p-2 active:bg-blue-50 rounded-lg transition-colors"
        >查看日历 📅</button>
      </div>
      <button 
        onClick={() => setExpandedMed(!expandedMed)}
        className="w-full space-y-3 text-left transition-all duration-300"
      >
        {(expandedMed ? fullMeds : todayMeds).map((med) => (
          <div key={med.id} className="p-4 rounded-[20px] flex items-center justify-between border-l-4 shadow-sm" style={{ background: med.bg, borderColor: med.color }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ border: `1px solid ${med.color}20`, background: med.iconBg }}>{med.icon}</div>
              <div>
                <p className="font-bold text-gray-800">{med.name}</p>
                <p className="text-xs text-gray-500">{med.time}</p>
              </div>
            </div>
            <span className="text-xs font-bold flex items-center gap-1" style={{ color: med.color }}>
              {med.status === 'done' ? '✅' : med.status === 'missed' ? '⚠️' : '⏳'} {med.statusText}
            </span>
          </div>
        ))}
        {!expandedMed && (
          <div className="text-center py-2">
            <span className="text-[10px] font-bold text-[#024481] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              点击展开全部清单 ⌵
            </span>
          </div>
        )}
      </button>
    </div>

    {/* 体征趋势模拟图 */}
    <div className="bg-white rounded-[24px] p-6 card-shadow space-y-4 border border-gray-50">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">体征趋势</h3>
            <span className="text-xl">📈</span>
          </div>
          {renderNormalRange()}
        </div>
        <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200 shadow-inner">
          <button 
            onClick={() => setTimeRange('7')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${timeRange === '7' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}
          >7日</button>
          <button 
            onClick={() => setTimeRange('30')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${timeRange === '30' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}
          >30日</button>
        </div>
      </div>
      <div className="flex bg-gray-100 p-1 rounded-full overflow-hidden shadow-inner border border-gray-100">
        <button onClick={() => setMetricTab('bp')} className={`flex-1 py-1.5 px-3 rounded-full font-bold text-sm transition-colors ${metricTab === 'bp' ? 'bg-white text-[#024481] shadow-sm' : 'bg-transparent text-gray-500 shadow-none'}`}>血压</button>
        <button onClick={() => setMetricTab('bs')} className={`flex-1 py-1.5 px-3 rounded-full font-bold text-sm transition-colors ${metricTab === 'bs' ? 'bg-white text-[#024481] shadow-sm' : 'bg-transparent text-gray-500 shadow-none'}`}>血糖</button>
        <button onClick={() => setMetricTab('hr')} className={`flex-1 py-1.5 px-3 rounded-full font-bold text-sm transition-colors ${metricTab === 'hr' ? 'bg-white text-[#024481] shadow-sm' : 'bg-transparent text-gray-500 shadow-none'}`}>心率</button>
        <button onClick={() => setMetricTab('resp')} className={`flex-1 py-1.5 px-3 rounded-full font-bold text-sm transition-colors ${metricTab === 'resp' ? 'bg-white text-[#024481] shadow-sm' : 'bg-transparent text-gray-500 shadow-none'}`}>呼吸</button>
      </div>
      <div className="h-48 w-full mt-4 relative">
        {/* 数据缺失提示层 */}
        <div className="absolute inset-0 pointer-events-none flex items-end pb-8 left-10 right-0">
          {currentData.map((d, i) => d.isMissing && (
            <div 
              key={i} 
              className="flex-1 flex flex-col items-center justify-end h-full group"
            >
              <div className="w-[1px] h-[60%] border-l border-dashed border-gray-200 relative">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-[8px] text-gray-300 font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">无数据</span>
              </div>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  if (data.isMissing) {
                    return (
                      <div className="bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-xl border border-gray-100 text-[10px]">
                        <p className="font-bold text-gray-400">{data.name}</p>
                        <p className="text-gray-300 italic mt-1">⚠️ 该时段数据缺失</p>
                      </div>
                    );
                  }
                  return (
                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-gray-50 flex flex-col gap-1">
                      <p className="text-[10px] font-bold text-gray-400 border-b border-gray-50 pb-1 mb-1">{data.name}</p>
                      {payload.map((p: any) => (
                        <div key={p.name} className="flex items-center justify-between gap-4">
                          <span className="text-[10px] font-medium text-gray-500">{p.name}:</span>
                          <span className="text-xs font-black text-[#024481]">{p.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            {metricTab === 'bp' ? (
              <>
                <ReferenceArea y1={60} y2={89} fill="#84d8a4" fillOpacity={0.1} strokeOpacity={0} {...({} as any)} />
                <ReferenceArea y1={90} y2={139} fill="#024481" fillOpacity={0.05} strokeOpacity={0} {...({} as any)} />
                <Area type="monotone" dataKey="sys" name="收缩压" stroke="#024481" strokeWidth={3} fillOpacity={0.1} fill="#024481" connectNulls={false} />
                <Area type="monotone" dataKey="dia" name="舒张压" stroke="#84d8a4" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} connectNulls={false} />
              </>
            ) : (
              <>
                {metricTab === 'bs' && <ReferenceArea y1={3.9} y2={6.1} fill="#024481" fillOpacity={0.05} strokeOpacity={0} {...({} as any)} />}
                {metricTab === 'hr' && <ReferenceArea y1={60} y2={100} fill="#024481" fillOpacity={0.05} strokeOpacity={0} {...({} as any)} />}
                {metricTab === 'resp' && <ReferenceArea y1={12} y2={20} fill="#024481" fillOpacity={0.05} strokeOpacity={0} {...({} as any)} />}
                <Area type="monotone" dataKey="val" name={metricTab === 'bs' ? '血糖' : metricTab === 'hr' ? '心率' : '呼吸'} stroke="#024481" strokeWidth={3} fillOpacity={0.1} fill="#024481" connectNulls={false} />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* 异常记录 */}
    <div className="space-y-3">
      <h3 className="font-bold text-lg text-gray-800 px-1">最近异常记录</h3>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {abnormalRecords.map((record) => (
            <motion.div 
              key={record.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative overflow-hidden rounded-[24px]"
            >
              <div className="absolute right-0 inset-y-0 w-24 bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">🗑️ 删除</span>
              </div>
              <motion.div 
                drag="x"
                dragConstraints={{ right: 0, left: -96 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -40) {
                    setDeleteConfirmId(record.id);
                  }
                }}
                className="bg-white p-5 rounded-[24px] shadow-sm border border-[#fee2e2] relative z-10 touch-pan-y"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
                    <p className="font-bold text-gray-800">{record.type}</p>
                  </div>
                  <span className="text-[12px] text-gray-400">{record.time}</span>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-3xl text-[#dc2626] font-bold">{record.value} <span className="text-sm font-normal text-gray-500">{record.unit}</span></p>
                  <div className="bg-[#dcfce7] px-2 py-1 rounded text-[10px] text-[#16a34a] font-bold">{record.detail}</div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>

    {/* 删除确认弹窗 */}
    <AnimatePresence>
      {deleteConfirmId && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] p-8 w-full max-w-sm text-center shadow-2xl"
          >
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-gray-800">确认删除此条异常记录？</h3>
            <p className="text-sm text-gray-400 mt-2">删除后将无法找回该条记录。</p>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-500 active:scale-95 transition-transform"
              >取消</button>
              <button 
                onClick={() => {
                  setAbnormalRecords(prev => prev.filter(r => r.id !== deleteConfirmId));
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform"
              >确认删除</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
  );
};

// --- 子组件：AI 陪伴 ---
const CompanionView = ({ onAction, isAnonymous }: { onAction: (type: OverlayType) => void; isAnonymous?: boolean }) => {
  if (isAnonymous) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 px-6 text-center">
        <div className="text-6xl mb-6">💬</div>
        <h2 className="text-xl font-black text-gray-800 mb-2">暂无聊天记录</h2>
        <p className="text-gray-500 text-sm">快去和机器人聊聊天吧！</p>
      </div>
    );
  }
  const [liked, setLiked] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<any>(null);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  // 运动数据
  const exerciseData = [
    { day: '一', date: '05/05', level: 'low', type: '散步', duration: '15分钟', moves: '1200步', feeling: '轻松', calories: '45kcal' },
    { day: '二', date: '05/06', level: 'medium', type: '太极拳', duration: '30分钟', moves: '24组', feeling: '刚好', calories: '120kcal' },
    { day: '三', date: '05/07', level: 'low', type: '慢走', duration: '20分钟', moves: '1800步', feeling: '轻松', calories: '60kcal' },
    { day: '四', date: '05/08', level: 'high', type: '广场舞', duration: '45分钟', moves: '36节', feeling: '吃力', calories: '210kcal' },
    { day: '五', date: '05/09', level: 'high', type: '慢跑', duration: '40分钟', moves: '3200步', feeling: '刚好', calories: '180kcal' },
    { day: '六', date: '05/10', level: 'none', type: '休息', duration: '0分钟', moves: '0', feeling: '无', calories: '0kcal' },
    { day: '日', date: '今日', level: 'medium', type: '室内操', duration: '25分钟', moves: '20组', feeling: '刚好', calories: '110kcal' },
  ];

  // 情绪脸谱数据
  const emotions = [
    { day: '周一', emoji: '😊', level: 4, reason: '主动对话6次，笑声3次', summary: '今日心情极佳，与邻居聊得愉快。' },
    { day: '周二', emoji: '😐', level: 3, reason: '对话较少，监测到较多静息时间', summary: '心情平稳，生活节奏稳定。' },
    { day: '周三', emoji: '😔', level: 2, reason: '午后情绪略显低落，活动量下降', summary: '情绪低落期，建议增加主动关怀。' },
    { day: '周四', emoji: '😊', level: 4, reason: '完成了一场象棋对弈，心情舒畅', summary: '积极社交的一天。' },
    { day: '周五', emoji: '😐', level: 3, reason: '作息规律，配合健康指导练习', summary: '情绪稳定，执行力强。' },
    { day: '周六', emoji: '😰', level: 1, reason: '夜间惊醒后出现轻微喘息与焦虑', summary: '监测到焦虑情绪，机器人已介入陪伴。' },
    { day: '今日', emoji: '😊', level: 4, reason: '收到了家人寄来的礼物', summary: '满怀喜悦，正在与机器人分享快乐。' },
  ];

  // 回忆金句数据
  const quotes = [
    { text: "那时候哪有那么多讲究，有口吃的就是福，只要全家人聚在一起就是团圆。", topic: "冬日趣事", date: "2026-05-10", source: "奶奶" },
    { text: "年轻时总想走远，老了才发现，最香的还是家里的那碗热面。", topic: "感悟人生", date: "2026-05-08", source: "妈妈" },
    { text: "勤学好问是家风。记住，书本里的知识是别人偷不走的财富。", topic: "家风家教", date: "2026-05-05", source: "爷爷" },
  ];
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 pb-24"
    >
      {/* 4.5.1 运动周历 */}
      <div className="rounded-[24px] bg-white p-6 card-shadow border border-gray-50 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg flex items-center gap-2">🏋️‍♀️ 运动周历</h3>
          <span className="text-sm font-bold text-gray-500">目标：4/7天</span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {exerciseData.map((d, i) => (
            <motion.div 
              key={i} 
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedExercise(d)}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <span className="text-[10px] font-bold text-gray-400">{d.day}</span>
              <div className={`w-full aspect-square rounded-full transition-all ${
                d.level === 'high' ? 'bg-[#0d6c42]' : 
                d.level === 'medium' ? 'bg-[#4ade80]' : 
                d.level === 'low' ? 'bg-[#bbf7d0]' : 'bg-gray-100 border border-gray-200'
              } ${selectedExercise?.day === d.day ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}></div>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-[#0d6c42] font-bold">
            <span>🔥 连续运动 5 天</span>
          </div>
          <p className="text-[10px] text-gray-400">点击查看每日详情</p>
        </div>

        {/* 运动详情浮层 */}
        <AnimatePresence>
          {selectedExercise && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 space-y-3 relative"
            >
              <button onClick={() => setSelectedExercise(null)} className="absolute top-3 right-3 text-emerald-300 hover:text-emerald-500">✕</button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-800">{selectedExercise.day === '今日' ? '今日' : `周${selectedExercise.day}`} 运动详情</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-bold">{selectedExercise.type}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <p className="text-[8px] text-emerald-600 font-bold uppercase">时长</p>
                  <p className="text-xs font-black text-emerald-900">{selectedExercise.duration}</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] text-emerald-600 font-bold uppercase">动作</p>
                  <p className="text-xs font-black text-emerald-900">{selectedExercise.moves}</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] text-emerald-600 font-bold uppercase">感受</p>
                  <p className="text-xs font-black text-emerald-900">{selectedExercise.feeling}</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] text-emerald-600 font-bold uppercase">热量</p>
                  <p className="text-xs font-black text-emerald-900">{selectedExercise.calories}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4.5.2 情绪脸谱 (V2.0 整合情绪趋势) */}
      <div className="bg-white rounded-[32px] p-6 card-shadow border border-gray-50 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800">情绪脸谱</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Multi-modal Emotion Analytics</p>
          </div>
          <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">本周良好</span>
        </div>

        {/* 表情图标横向排列 */}
        <div className="flex justify-between items-center px-1">
          {emotions.map((item, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedEmotion(item)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl transition-all ${selectedEmotion?.day === item.day ? 'bg-blue-50 scale-110 shadow-sm' : 'bg-gray-50'}`}>
                {item.emoji}
              </div>
              <span className={`text-[10px] font-bold ${selectedEmotion?.day === item.day ? 'text-[#024481]' : 'text-gray-400'}`}>{item.day}</span>
            </motion.button>
          ))}
        </div>

        {/* 情绪趋势曲线 (LineChart) */}
        <div className="h-32 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={emotions}>
              <XAxis dataKey="day" hide />
              <YAxis hide domain={[0, 5]} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-xl border border-gray-100 text-[10px] flex items-center gap-2">
                        <span className="text-sm">{data.emoji}</span>
                        <span className="font-bold text-gray-500">{data.day}</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="level" 
                stroke="#024481" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#024481', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 详情浮层 (Inline Animated Detail) */}
        <AnimatePresence>
          {selectedEmotion && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50 space-y-3 relative">
                <button 
                  onClick={() => setSelectedEmotion(null)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#024481]">{selectedEmotion.day} 情绪溯源</span>
                  <span className="text-lg">{selectedEmotion.emoji}</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">标注原因</p>
                    <p className="text-xs text-gray-700 font-medium">{selectedEmotion.reason}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">陪伴摘要</p>
                    <p className="text-xs text-gray-700 font-medium leading-relaxed">{selectedEmotion.summary}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4.5.3 AI健康关怀卡片 */}
      <div className="rounded-[32px] bg-blue-50/80 p-6 card-shadow border border-blue-100/50 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-3xl shadow-sm">🤖</div>
          <div>
            <h3 className="font-bold text-[#024481]">小和的关怀</h3>
            <p className="text-[10px] text-blue-400 font-bold uppercase">AI Health Insights</p>
          </div>
        </div>
        <p className="text-base text-blue-900 leading-relaxed font-medium italic">
          “王阿姨，您这周心率平稳，睡眠质量有明显提升。周三由于天气骤降有过一次血压偏高，目前已恢复正常，近期早晚注意及时添衣保暖。”
        </p>
        <button 
          onClick={() => onAction('healthReport')}
          className="w-full py-3 bg-[#024481] text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md"
        >
          <span>📄</span> 生成周报PDF报告
        </button>
      </div>

      {/* 4.5.4 回忆金句卡片 (左右滑动切换，参考今日概况样式) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-gray-500 font-bold text-xs tracking-widest uppercase">传家记忆金句</h3>
          <div className="flex gap-1.5">
            {quotes.map((_, idx) => (
              <div 
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeQuoteIndex === idx ? 'w-4 bg-[#024481]' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-1"
            onScroll={(e) => {
              const el = e.currentTarget;
              const index = Math.round(el.scrollLeft / el.clientWidth);
              if (index !== activeQuoteIndex) setActiveQuoteIndex(index);
            }}
          >
            {quotes.map((quote, idx) => (
              <div key={idx} className="w-full shrink-0 snap-center px-1">
                <div className="relative overflow-hidden rounded-[32px] bg-white p-6 shadow-sm border border-[#efeded] card-shadow group cursor-pointer active:scale-[0.99] transition-transform min-h-[200px] flex flex-col justify-between">
                  <span className="absolute -top-4 -left-2 text-[80px] font-serif text-[#024481]/10 select-none group-hover:text-[#024481]/20 transition-colors">“</span>
                  <div className="relative z-10 space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="font-bold text-[#024481] text-sm">最新采集金句</h2>
                      <div className="text-[10px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded font-bold">话题：{quote.topic}</div>
                    </div>
                    <p className="text-lg text-gray-800 leading-snug italic font-medium">
                      “{quote.source}说：{quote.text}”
                    </p>
                  </div>
                  <div className="relative z-10 flex justify-between items-center pt-4 border-t border-gray-50 mt-4">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">采集时间：{quote.date}</span>
                    <span className="text-xs text-[#024481] font-bold">查看原声 ➔</span>
                  </div>
                  <span className="absolute -bottom-10 -right-2 text-[80px] font-serif text-[#024481]/10 select-none group-hover:text-[#024481]/20 transition-colors">”</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4.5.5 鼓励按钮 */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setLiked(!liked)}
          className={`h-20 rounded-[24px] flex flex-col items-center justify-center gap-1 text-sm font-bold transition-all shadow-sm ${liked ? 'bg-pink-100 text-pink-600 scale-105' : 'bg-white border border-gray-100 text-gray-700 active:scale-95'}`}
        >
          <span className="text-2xl">{liked ? '💖' : '❤️'}</span>
          <span>给妈妈点赞</span>
        </button>
        <button className="h-20 rounded-[24px] bg-white border border-gray-100 text-gray-700 flex flex-col items-center justify-center gap-1 text-sm font-bold shadow-sm active:scale-95 transition-transform active:bg-gray-50">
          <span className="text-2xl">🎙️</span>
          <span>发送语音鼓励</span>
        </button>
      </div>
    </motion.div>
  );
};

// --- 子组件：紧急联系人管理 ---
const EmergencyContactsView = ({ 
  contacts, 
  onUpdate, 
  onClose 
}: { 
  contacts: Contact[]; 
  onUpdate: (newContacts: Contact[]) => void; 
  onClose: () => void 
}) => {
  const [items, setItems] = useState(contacts);
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });

  const handleAdd = () => {
    if (!newContact.name || !newContact.phone) return;
    const updated = [...items, { ...newContact, id: Date.now().toString() }];
    setItems(updated);
    onUpdate(updated);
    setIsAdding(false);
    setNewContact({ name: '', relation: '', phone: '' });
  };

  const handleDelete = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    onUpdate(updated);
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="absolute inset-0 z-[150] bg-[#fbf9f8] flex flex-col"
    >
      <header className="bg-white px-6 py-6 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-xl">⬅️</button>
          <h2 className="text-xl font-bold text-[#024481]">紧急联系人</h2>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="text-blue-600 font-bold text-sm"
        >添加</button>
      </header>

      <main className="flex-1 p-6">
        <p className="text-[10px] text-gray-400 mb-4 font-bold uppercase tracking-wider">长按右侧图标拖动排序（首位为默认呼叫人）</p>
        <Reorder.Group axis="y" values={items} onReorder={(newOrder) => {
          setItems(newOrder);
          onUpdate(newOrder);
        }} className="space-y-4">
          {items.map((item) => (
            <Reorder.Item 
              key={item.id} 
              value={item}
              className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm active:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500 font-bold">🚑</div>
                <div>
                  <p className="font-bold text-gray-800">{item.name} <span className="text-xs text-gray-400 font-normal ml-1">({item.relation})</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleDelete(item.id)} className="text-xs text-red-400 p-2">移除</button>
                <div className="cursor-grab active:cursor-grabbing text-gray-300">☰</div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {isAdding && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
            <div className="bg-white rounded-[32px] w-full p-8 space-y-6">
              <h3 className="text-lg font-bold text-center">添加新联系人</h3>
              <div className="space-y-4">
                <input 
                  placeholder="姓名"
                  value={newContact.name}
                  onChange={e => setNewContact({...newContact, name: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold border-none"
                />
                <input 
                  placeholder="关系 (如：大儿子)"
                  value={newContact.relation}
                  onChange={e => setNewContact({...newContact, relation: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold border-none"
                />
                <input 
                  placeholder="手机号"
                  type="tel"
                  value={newContact.phone}
                  onChange={e => setNewContact({...newContact, phone: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold border-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsAdding(false)} className="flex-1 py-4 text-gray-400 font-bold">取消</button>
                <button onClick={handleAdd} className="flex-1 py-4 bg-[#024481] text-white rounded-2xl font-bold shadow-lg">确认添加</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </motion.div>
  );
};

// --- 子组件：用药详情与日历 ---
const MedicationCalendarView = ({ onClose, plan }: { onClose: () => void, plan: Medication[] }) => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const monthDays = 31; // 模拟当前月 31 天
  const startDayOffset = 3; // 模拟月首偏移 (从周三开始)

  // 模拟数据状态
  const getDayStatus = (day: number) => {
    if (day % 7 === 0) return 'missed'; // 红色：漏服
    if (day % 5 === 0) return 'delayed'; // 黄色：延迟
    if (day % 3 === 0) return 'none'; // 灰色：无计划
    return 'onTime'; // 绿色：全部按时
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'onTime': return 'bg-green-500';
      case 'delayed': return 'bg-yellow-400';
      case 'missed': return 'bg-red-500';
      default: return 'bg-gray-200';
    }
  };

  const getDailyDetails = (day: number) => {
    const status = getDayStatus(day);
    if (status === 'none') return [];
    
    return [
      { name: '阿司匹林', planTime: '08:00', actualTime: status === 'missed' ? '--:--' : '08:05', status: status === 'missed' ? '漏服' : '已服用' },
      { name: '维生素 D3', planTime: '12:30', actualTime: status === 'delayed' ? '14:20' : status === 'missed' ? '--:--' : '12:35', status: status === 'delayed' ? '已服用' : status === 'missed' ? '漏服' : '已服用' },
      { name: '缬沙坦', planTime: '20:00', actualTime: '--:--', status: '待服用' },
    ];
  };

  const currentDetails = getDailyDetails(selectedDay);

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="absolute inset-0 z-[160] bg-[#fbf9f8] flex flex-col"
    >
      <header className="bg-white px-6 py-6 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-xl">⬅️</button>
          <h2 className="text-xl font-bold text-[#024481]">用药日历</h2>
        </div>
        <div className="text-sm font-bold text-gray-500">2024年5月</div>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* 日历卡片 */}
        <div className="bg-white rounded-[32px] p-6 card-shadow border border-gray-50">
          <div className="grid grid-cols-7 gap-y-4 mb-4">
            {['一', '二', '三', '四', '五', '六', '日'].map(w => (
              <div key={w} className="text-[10px] font-bold text-gray-400 text-center">{w}</div>
            ))}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: monthDays }).map((_, i) => {
              const day = i + 1;
              const status = getDayStatus(day);
              const isSelected = selectedDay === day;
              return (
                <button 
                  key={day} 
                  onClick={() => setSelectedDay(day)}
                  className="flex flex-col items-center gap-1 relative"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isSelected ? 'bg-[#024481] text-white' : 'text-gray-700'
                  }`}>
                    {day}
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(status)}`}></div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center gap-4 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-[10px] text-gray-400">全部按时</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400"></span><span className="text-[10px] text-gray-400">有延迟</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-[10px] text-gray-400">有漏服</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-200"></span><span className="text-[10px] text-gray-400">无计划</span></div>
          </div>
        </div>

        {/* 当日详情 */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 px-1">
            <span>📅</span> 5月{selectedDay}日 用药清单
          </h3>
          <div className="space-y-3">
            {currentDetails.length > 0 ? currentDetails.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-[24px] border border-gray-50 card-shadow flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    item.status === '已服用' ? 'bg-green-50 text-green-600' : 
                    item.status === '漏服' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {item.name.includes('阿司匹林') ? '💊' : item.name.includes('维生素') ? '🧴' : '🌿'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      计划 {item.planTime} | 实际 {item.actualTime}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  item.status === '已服用' ? 'bg-green-100 text-green-700' : 
                  item.status === '漏服' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.status}
                </span>
              </div>
            )) : (
              <div className="bg-white p-10 rounded-[24px] border border-dashed border-gray-100 text-center text-gray-400 text-xs font-bold">
                今日无预设用药计划
              </div>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
};

// --- 子组件：告警设置 ---
const AlarmSettingsView = ({ onClose }: { onClose: () => void }) => {
  const [settings, setSettings] = useState({
    health: true,
    dailyReport: true,
    care: true
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const categories = [
    {
      id: 'emergency',
      title: '紧急告警',
      scenario: '跌倒 / 心率骤停 / 烟雾报警等',
      method: 'App强推送 + 短信 + 语音电话',
      description: '事关生命安全，此项不可关闭',
      isLocked: true,
      enabled: true,
      icon: '🚨'
    },
    {
      id: 'health',
      title: '健康异常',
      scenario: '血压重度异常 / 严重漏服药',
      method: 'App系统推送',
      description: '及时获知健康偏离状态',
      isLocked: false,
      enabled: settings.health,
      icon: '💓'
    },
    {
      id: 'dailyReport',
      title: '每日简报',
      scenario: '每日 08:00 生成前一日汇总',
      method: 'App系统推送',
      description: '掌握每日健康全景数据',
      isLocked: false,
      enabled: settings.dailyReport,
      icon: '📅'
    },
    {
      id: 'care',
      title: '关怀提醒',
      scenario: '连续多日未运动 / 情绪波动',
      method: 'App系统推送',
      description: '关注长辈心理与日常活力',
      isLocked: false,
      enabled: settings.care,
      icon: '💗'
    }
  ];

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="absolute inset-0 z-[200] bg-[#fbf9f8] flex flex-col"
    >
      <header className="bg-white px-6 py-6 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-xl">⬅️</button>
          <h2 className="text-xl font-bold text-[#024481]">告警与通知设置</h2>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-4 overflow-y-auto">
        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3 mb-2">
          <span className="text-lg">🛡️</span>
          <p className="text-[10px] text-blue-600 leading-relaxed font-medium">
            系统深度集成了多维度感知算法，确保在紧急时刻能第一时间通过多种路径通知到您。
          </p>
        </div>

        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-[28px] p-5 shadow-sm border border-gray-50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${cat.isLocked ? 'bg-red-50' : 'bg-gray-50'}`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{cat.title}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{cat.method}</p>
                </div>
              </div>
              
              {cat.isLocked ? (
                <div className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span className="text-[10px] text-gray-400 font-bold">始终开启</span>
                  <span className="text-[10px]">🔒</span>
                </div>
              ) : (
                <button 
                  onClick={() => toggle(cat.id as any)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative ${cat.enabled ? 'bg-[#024481]' : 'bg-gray-200'}`}
                >
                  <motion.div 
                    animate={{ x: cat.enabled ? 24 : 0 }}
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-gray-50">
              <div className="flex items-start gap-2">
                <span className="text-[10px] text-gray-300 mt-0.5">场景:</span>
                <p className="text-xs text-gray-600 font-medium">{cat.scenario}</p>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 italic">{cat.description}</p>
            </div>
          </div>
        ))}

        <div className="p-8 text-center">
          <p className="text-[10px] text-gray-300">嘉和智护 极简守护OS · 告警模块 v1.0</p>
        </div>
      </main>
    </motion.div>
  );
};
const FamilyMembersView = ({ 
  members, 
  onDelete, 
  onClose 
}: { 
  members: FamilyMember[]; 
  onDelete: (id: string) => void; 
  onClose: () => void 
}) => {
  const handleInvite = () => {
    // 模拟原生分享
    if (navigator.share) {
      navigator.share({
        title: '邀请加入嘉和智护',
        text: '老爸老妈的健康我在看，你也来看看吧！',
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert('已生成邀请链接，请前往微信/手机QQ粘贴发送给家人');
    }
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="absolute inset-0 z-[150] bg-[#fbf9f8] flex flex-col"
    >
      <header className="bg-white px-6 py-6 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-xl">⬅️</button>
          <h2 className="text-xl font-bold text-[#024481]">家人管理</h2>
        </div>
        <button onClick={handleInvite} className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">邀请家人</button>
      </header>

      <main className="flex-1 p-6 space-y-4">
        {members.map(member => (
          <div key={member.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-50">
            <div className="flex items-center gap-3">
              <img src={member.avatar} className="w-12 h-12 rounded-full border-2 border-blue-50" alt={member.name} />
              <div>
                <p className="font-bold text-gray-800">{member.name}</p>
                <p className="text-xs text-gray-400 font-bold">{member.relation}</p>
              </div>
            </div>
            <button onClick={() => onDelete(member.id)} className="text-xs text-red-400 p-2">移除</button>
          </div>
        ))}
        
        <div className="bg-blue-50/40 p-5 rounded-[24px] border border-blue-100 border-dashed text-center">
          <p className="text-xs text-blue-600 font-medium">邀请更多家人，共同守护家里的老人</p>
          <div className="flex justify-center gap-4 mt-4">
             <div className="flex flex-col items-center gap-1 opacity-60 grayscale scale-90">
               <span className="text-2xl">💬</span>
               <span className="text-[8px] font-bold text-gray-500 uppercase">微信</span>
             </div>
             <div className="flex flex-col items-center gap-1 opacity-60 grayscale scale-90">
               <span className="text-2xl">🐧</span>
               <span className="text-[8px] font-bold text-gray-500 uppercase">手机QQ</span>
             </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

// --- 子组件：用药计划调整 ---
const MedicationPlanView = ({ 
  plan, 
  onUpdate, 
  onClose 
}: { 
  plan: Medication[]; 
  onUpdate: (plan: Medication[]) => void; 
  onClose: () => void 
}) => {
  const [data, setData] = useState(plan);

  const updateDosage = (id: string, newDosage: string) => {
    const updated = data.map(m => m.id === id ? { ...m, dosage: newDosage } : m);
    setData(updated);
    onUpdate(updated);
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="absolute inset-0 z-[150] bg-[#fbf9f8] flex flex-col"
    >
      <header className="bg-white px-6 py-6 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-xl">⬅️</button>
          <h2 className="text-xl font-bold text-[#024481]">用药计划</h2>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {data.map(med => (
          <div key={med.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-3">
                 <span className="text-3xl">💊</span>
                 <div>
                   <h4 className="font-bold text-lg text-gray-800">{med.name}</h4>
                   <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mt-1">
                     {med.times.join(' • ')}
                   </p>
                 </div>
               </div>
            </div>
            
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
               <span className="text-xs font-bold text-gray-400">当前剂量：</span>
               <input 
                 className="bg-transparent border-none font-bold text-gray-700 w-24 text-sm focus:ring-0"
                 value={med.dosage}
                 onChange={e => updateDosage(med.id, e.target.value)}
               />
               <span className="text-[10px] text-gray-300">点击可直接维护 🖊️</span>
            </div>
          </div>
        ))}

        <div className="bg-[#024481] p-4 rounded-2xl flex items-center justify-between shadow-lg">
           <div>
              <p className="text-white text-xs font-bold">同步至机器人 🤖</p>
              <p className="text-white/50 text-[10px]">修改后机器人将自动进行语音播报提醒</p>
           </div>
           <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        </div>
      </main>
    </motion.div>
  );
};

// --- 子组件：法律条款 ---
const LegalNoticeView = ({ 
  type, 
  onClose,
  onDeleteData,
  onViewLogs
}: { 
  type: 'terms' | 'privacy'; 
  onClose: () => void;
  onDeleteData?: () => void;
  onViewLogs?: () => void;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
    >
      <div className="bg-white rounded-[40px] w-full max-w-sm flex flex-col p-8 space-y-6 max-h-[80vh]">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800">{type === 'terms' ? '用户服务协议' : '隐私保护政策'}</h3>
          <p className="text-xs text-gray-400 mt-2">嘉和智护OS · 极简版说明</p>
        </div>
        
        <div className="flex-1 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-4 px-2">
          <p>1. <strong>数据安全</strong>：我们将采取工业级标准对您的健康数据进行加密存储。</p>
          <p>2. <strong>隐私边界</strong>：机器人采集的音频与视频仅用于实时通话与AI跌倒检测，绝不另作他用。</p>
          <p>3. <strong>知情同意</strong>：您可以随时在“个人中心”撤回各项数据授权。</p>
          <p>4. <strong>服务范围</strong>：本系统旨在辅助照护，不能替代专业医疗诊断。</p>
          {type === 'privacy' && (
            <div className="pt-6 border-t border-gray-50 flex flex-col gap-3">
              <p className="text-[10px] text-gray-400 mb-1">您也可以根据需要执行以下操作：</p>
              <button 
                onClick={() => {
                  onViewLogs?.();
                }}
                className="w-full py-3 text-[#024481] font-bold text-xs bg-blue-50 rounded-xl active:scale-95 transition-transform"
              >查看摄像头调用详情</button>
              <button 
                onClick={() => {
                  onClose();
                  onDeleteData?.();
                }}
                className="w-full py-3 text-red-500 font-bold text-xs bg-red-50 rounded-xl active:scale-95 transition-transform"
              >清理历史数据</button>
            </div>
          )}
          <p className="text-[10px] text-gray-400 pt-4 border-t border-gray-100">© 2024 嘉和智护（北京）科技有限公司 版权所有</p>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full py-4 bg-gray-100 rounded-2xl font-bold text-gray-600 active:scale-95 transition-transform"
        >我知道了</button>
      </div>
    </motion.div>
  );
};

// --- 子组件：摄像头记录展示 ---
const CameraAccessLogsView = ({ logs, onClose }: { logs: CameraLog[], onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="absolute inset-0 z-[250] bg-[#fbf9f8] flex flex-col"
    >
      <header className="bg-white px-6 py-6 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-xl">⬅️</button>
          <h2 className="text-xl font-bold text-[#024481]">摄像头调用记录</h2>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="bg-white rounded-[32px] p-6 space-y-4 border border-gray-100 shadow-sm">
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center py-2 border-b border-gray-50">
             隐私保障：端到端加密传输 🔒
           </p>
           <div className="space-y-4">
             {logs.length > 0 ? logs.map(log => (
               <div key={log.id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                 <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold ${
                     log.source === '告警' ? 'bg-red-50 text-red-500' : 
                     log.source === '通话' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
                   }`}>
                     {log.source === '告警' ? '🚨' : log.source === '通话' ? '📞' : '📷'}
                   </div>
                   <div>
                     <p className="font-bold text-gray-800">{log.source}调用</p>
                     <p className="text-xs text-gray-400">{log.time}</p>
                   </div>
                 </div>
                 <span className="text-xs text-gray-500 font-bold bg-gray-50 px-3 py-1 rounded-full">{log.status}</span>
               </div>
             )) : (
               <div className="text-center py-20 text-gray-400">暂无相关调用记录</div>
             )}
           </div>
        </div>
        
        <div className="p-4 bg-blue-50/50 rounded-[24px] border border-blue-100/50">
          <p className="text-[10px] text-blue-600 leading-relaxed text-center font-medium">
            提示：采集的音视频仅用于实时通话与跌倒检测，暂不在云端进行持久化存储。
          </p>
        </div>
      </main>
    </motion.div>
  );
};

// --- 子组件：机器人详情设置 (OTA/重启/关机) ---
const RobotDetailView = ({ 
  robot, 
  onSave, 
  onDelete,
  onClose 
}: { 
  robot: any; 
  onSave: (robot: any) => void; 
  onDelete: (id: string) => void;
  onClose: () => void 
}) => {
  const [nickname, setNickname] = useState(robot.nickname);
  const [upgrading, setUpgrading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleOTA = () => {
    setUpgrading(true);
    setTimeout(() => {
      setUpgrading(false);
      alert('固件已更新至最新版本');
    }, 3000);
  };

  const handleConfirmDelete = () => {
    if (password === '123456') {
      onDelete(robot.id);
      onClose();
    } else {
      setPasswordError('验证失败：密码错误');
    }
  };

  return (
    <motion.div 
      initial={{ x: '100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="absolute inset-0 z-[150] bg-[#fbf9f8] flex flex-col"
    >
      <header className="bg-white px-6 py-6 pt-12 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-xl">🔙</button>
          <h2 className="text-xl font-bold text-[#024481]">设备维护</h2>
        </div>
        <button 
          onClick={() => onSave({ ...robot, nickname })}
          className="bg-[#024481] text-white px-6 py-2 rounded-full font-black text-sm shadow-xl shadow-blue-100"
        >保存修改</button>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="bg-white rounded-[32px] p-6 space-y-4 border border-gray-50 shadow-sm">
           <div className="space-y-1.5 text-left">
             <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">机器人名称</label>
             <input 
               value={nickname}
               onChange={e => setNickname(e.target.value)}
               className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-blue-100 text-[#024481]"
             />
           </div>
           <div className="flex justify-between items-center px-1">
             <span className="text-xs text-gray-400 font-bold">硬件型号</span>
             <span className="text-xs font-black text-gray-700">{robot.model}</span>
           </div>
           <div className="flex justify-between items-center px-1">
             <span className="text-xs text-gray-400 font-bold">序列号 (SN)</span>
             <span className="text-xs font-mono font-black text-gray-700">{robot.sn || 'JH4820-2910-X1'}</span>
           </div>
        </div>

        <div className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">💿</div>
             <div>
               <p className="text-sm font-black text-gray-800">系统固件</p>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Version {robot.version}</p>
             </div>
           </div>
           <button 
             onClick={handleOTA}
             disabled={upgrading}
             className={`px-5 py-2 rounded-2xl text-[10px] font-black transition-all ${
               upgrading ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white shadow-lg active:scale-95'
             }`}
           >
             {upgrading ? '⌛ 升级中...' : '检查更新'}
           </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => confirm('确定要重启机器人吗？') && alert('正在下发远程重启指令...')}
            className="bg-white p-6 rounded-[32px] flex flex-col items-center justify-center gap-3 border border-gray-50 shadow-sm active:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">🔄</span>
            <span className="text-xs font-black text-gray-800">远程重启</span>
          </button>
          <button 
            onClick={() => confirm('确定要关闭机器人吗？') && alert('已发送远程关机指令')}
            className="bg-white p-6 rounded-[32px] flex flex-col items-center justify-center gap-3 border border-gray-50 shadow-sm active:bg-gray-50 transition-colors text-red-500"
          >
            <span className="text-2xl">🔌</span>
            <span className="text-xs font-black">远程关机</span>
          </button>
        </div>

        <div className="pt-4">
           <button 
             onClick={() => setShowDeleteConfirm(true)}
             className="w-full py-4 text-red-500 font-black text-xs tracking-widest bg-red-50 rounded-2xl active:scale-95 transition-transform"
           >❌ 解除设备绑定</button>
           <p className="text-center text-[10px] text-gray-300 font-bold mt-4 leading-relaxed px-4">
             解除绑定后，该设备的历史轨迹和录音数据将被安全抹除。
           </p>
        </div>
      </main>

      {/* 解绑确认弹窗 */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="bg-white rounded-[40px] w-full p-8 space-y-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto">⚠️</div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-gray-900 tracking-tight">确认解除绑定？</h3>
                <p className="text-[10px] text-gray-400 font-bold leading-relaxed px-4">此操作不可撤销，请输入您的登录密码确认身份。</p>
              </div>
              
              <div className="space-y-2">
                <input 
                  type="password"
                  placeholder="请输入您的登录密码"
                  autoFocus
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPasswordError(''); }}
                  className={`w-full h-14 bg-gray-50 border-none rounded-2xl p-4 text-sm font-black text-center tracking-[0.5em] focus:ring-2 ${passwordError ? 'ring-2 ring-red-300 animate-shake' : 'focus:ring-blue-100'}`}
                />
                {passwordError && <p className="text-[10px] text-red-500 font-bold animate-pulse">{passwordError}</p>}
                <p className="text-[8px] text-gray-300 font-bold">默认演示密码: 123456</p>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-4 text-gray-400 font-black text-xs uppercase tracking-widest leading-none">返回</button>
                <button 
                  onClick={handleConfirmDelete}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs shadow-xl shadow-red-200 active:scale-95 transition-transform"
                >确认解绑</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- 子组件：二次确认删除弹窗 ---
const DeleteConfirmDialog = ({ 
  onConfirm, 
  onClose 
}: { 
  onConfirm: () => void; 
  onClose: () => void 
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (password === '123456') {
      onConfirm();
    } else {
      setError('密码错误，请重新输入');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 text-center"
    >
      <div className="bg-white rounded-[40px] w-full max-xs p-8 space-y-6">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">⚠️</div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-800">重要安全确认</h3>
          <p className="text-xs text-gray-400 leading-relaxed">删除历史数据将永久移除所有健康趋势与录音，操作不可撤销。</p>
        </div>
        
        <div className="space-y-2 text-left">
          <label className="text-[10px] font-bold text-gray-400 ml-1">请输入登录密码验证</label>
          <input 
            type="password"
            placeholder="默认密码 123456"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            className={`w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-center tracking-widest ${error ? 'ring-1 ring-red-300' : ''}`}
          />
          {error && <p className="text-[10px] text-red-500 text-center font-medium">{error}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-4 text-gray-400 font-bold text-sm">取消</button>
          <button onClick={handleConfirm} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform text-sm">确认清理</button>
        </div>
      </div>
    </motion.div>
  );
};
const ElderlyProfileEditView = ({ 
  data, 
  onSave, 
  onClose 
}: { 
  data: any; 
  onSave: (newData: any) => void; 
  onClose: () => void 
}) => {
  const [formData, setFormData] = useState(data);
  const [isScanning, setIsScanning] = useState(false);

  // 模拟从病历拍照提取数据
  const handleScanRecord = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // 模拟提取了一些新信息
      setFormData({
        ...formData,
        medicalHistory: formData.medicalHistory + '；近期检查：心功能二级',
        medications: formData.medications + '；维D 1片/日'
      });
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="absolute inset-0 z-[100] bg-[#fbf9f8] flex flex-col"
    >
      <header className="bg-white text-gray-800 px-5 py-5 flex items-center justify-between shadow-sm border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-xl">⬅️</button>
          <h2 className="text-lg font-bold">健康档案库</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleScanRecord}
            className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold border border-orange-100 flex items-center gap-1 active:scale-95 transition-transform"
          >
            📷 扫病历
          </button>
          <button 
            onClick={() => {
              if(!formData.phone) return; // 必填校验简易实现
              onSave(formData);
              onClose();
            }}
            className="bg-[#024481] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md active:scale-95 transition-transform"
          >保存</button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-4 space-y-4 pb-12">
        {isScanning && (
          <div className="bg-[#024481] text-white p-3 rounded-xl flex items-center justify-center gap-3 animate-pulse shadow-lg text-sm">
             <span className="animate-spin text-lg">⚙️</span> 正在AI解析电子病历档案...
          </div>
        )}

        {/* 核心基础信息 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
          <div className="flex items-center gap-4 mb-2">
             <div className="relative shrink-0">
               <img src={formData.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-blue-50" alt="avatar" />
               <div className="absolute -bottom-1 -right-1 bg-[#024481] text-white p-1 rounded-full text-[8px]">📷</div>
             </div>
             <div className="flex-1 space-y-2">
                <input 
                  type="text" 
                  placeholder="姓名 (必填)"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-blue-200"
                />
                <input 
                  type="tel" 
                  placeholder="联系电话 (必填)"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-blue-200"
                />
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold ml-1 uppercase">年龄</label>
              <input 
                type="number" 
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold ml-1 uppercase">血型</label>
              <select 
                value={formData.bloodType}
                onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm font-bold appearance-none"
              >
                <option value="A型血">A型</option>
                <option value="B型血">B型</option>
                <option value="AB型血">AB型</option>
                <option value="O型血">O型</option>
              </select>
            </div>
          </div>
        </div>

        {/* 健康记录详情 */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold text-[#024481] flex items-center gap-2 px-1">
             <span className="w-1 h-3 bg-[#024481] rounded-full inline-block"></span>
             健康档案详情
          </h3>
          
          <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-bold ml-1">既往病史</label>
              <textarea 
                rows={2}
                value={formData.medicalHistory}
                onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                className="w-full bg-gray-50 rounded-xl p-3 text-xs leading-relaxed focus:ring-1 focus:ring-blue-100 border-none outline-none resize-none"
                placeholder="手术史、重大疾病..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-bold ml-1">慢性病管理</label>
              <input 
                type="text"
                value={formData.chronicDiseases}
                onChange={(e) => setFormData({...formData, chronicDiseases: e.target.value})}
                className="w-full bg-gray-50 rounded-xl p-3 text-xs focus:ring-1 focus:ring-blue-100 border-none outline-none"
                placeholder="如：高血压、糖尿病"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-bold ml-1 italic text-red-400">⚠️ 过敏源</label>
              <input 
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                className="w-full bg-red-50/30 rounded-xl p-3 text-xs text-red-600 focus:ring-1 focus:ring-red-100 border-none outline-none font-medium"
                placeholder="药物、食物过敏..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-bold ml-1">医嘱</label>
              <textarea 
                rows={2}
                value={formData.medications}
                onChange={(e) => setFormData({...formData, medications: e.target.value})}
                className="w-full bg-blue-50/30 rounded-xl p-3 text-xs text-blue-800 leading-relaxed border-none outline-none resize-none"
                placeholder="药物名称、频次、剂量"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-bold ml-1">运动饮食管理</label>
              <textarea 
                rows={2}
                value={formData.dietExercise || ''}
                onChange={(e) => setFormData({...formData, dietExercise: e.target.value})}
                className="w-full bg-green-50/30 rounded-xl p-3 text-xs text-green-800 leading-relaxed border-none outline-none resize-none"
                placeholder="饮食建议、运动计划..."
              />
            </div>
          </div>
        </section>

        {/* 综合测评 */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold text-[#024481] flex items-center gap-2 px-1">
             <span className="w-1 h-3 bg-[#024481] rounded-full inline-block"></span>
             评估与环境
          </h3>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-4">
             <div className="grid grid-cols-3 gap-2">
               {['健康良好', '一般', '需关注'].map(h => (
                 <button
                   key={h}
                   onClick={() => setFormData({...formData, healthStatus: h})}
                   className={`py-2 rounded-lg text-[10px] font-bold transition-all ${formData.healthStatus === h ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400'}`}
                 >{h}</button>
               ))}
             </div>

             <div className="space-y-1.5">
               <label className="text-[10px] text-gray-400 font-bold ml-1">生活能力评估</label>
               <input 
                 type="text"
                 value={formData.livingAbility}
                 onChange={(e) => setFormData({...formData, livingAbility: e.target.value})}
                 className="w-full bg-gray-50 rounded-xl p-3 text-xs border-none outline-none"
               />
             </div>

             <div className="space-y-1.5">
               <label className="text-[10px] text-gray-400 font-bold ml-1">风险提示</label>
               <input 
                 type="text"
                 value={formData.riskAssessment}
                 onChange={(e) => setFormData({...formData, riskAssessment: e.target.value})}
                 className="w-full bg-gray-50 rounded-xl p-3 text-xs border-none outline-none"
               />
             </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
};

// --- 子组件：添加机器人页面 ---
const AddRobotView = ({ 
  onAdd, 
  onClose 
}: { 
  onAdd: (robot: any) => void; 
  onClose: () => void 
}) => {
  const [formData, setFormData] = useState({
    sn: '',
    nickname: '嘉和智能助手',
    ownerName: '',
    ownerPhone: '',
    serviceProviderName: '',
    serviceProviderPhone: ''
  });
  const [isScanningSN, setIsScanningSN] = useState(false);

  // 验证序列号 (样例: 需为8-12位字母数字组合)
  const isValidSN = (sn: string) => /^[A-Z0-9]{8,12}$/i.test(sn);
  // 验证手机号
  const isValidPhone = (phone: string) => /^1[3-9]\d{9}$/.test(phone);

  // 模拟扫码识别序列号
  const handleScanSN = () => {
    setIsScanningSN(true);
    // Simulate camera access and scanning
    setTimeout(() => {
      setIsScanningSN(false);
      const mockSN = 'JH' + Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0');
      setFormData(prev => ({ ...prev, sn: mockSN }));
      alert(`🎉 扫描成功！识别到设备序列号：${mockSN}`);
    }, 2000);
  };

  const handleConfirm = () => {
    if (!isValidSN(formData.sn)) {
      alert('请输入有效的8-12位设备序列号');
      return;
    }
    if (formData.ownerPhone && !isValidPhone(formData.ownerPhone)) {
      alert('请输入有效的11位长辈手机号');
      return;
    }
    if (formData.serviceProviderPhone && !isValidPhone(formData.serviceProviderPhone)) {
      alert('请输入有效的11位服务人员手机号');
      return;
    }
    onAdd({
      id: 'robot-' + Date.now(),
      name: formData.nickname,
      nickname: formData.nickname,
      model: 'JH-Care X1',
      status: '在线',
      battery: 100,
      version: 'v1.0.0',
      icon: '🤖',
      network: '5G',
      ...formData
    });
    onClose();
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="absolute inset-0 z-[150] bg-[#fbf9f8] flex flex-col"
    >
      <header className="bg-white px-6 py-6 flex items-center gap-4 border-b border-gray-100 shrink-0">
        <button onClick={onClose} className="text-xl">🔙</button>
        <h2 className="text-xl font-bold text-[#024481]">绑定新设备</h2>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="bg-white rounded-[32px] p-6 border border-gray-50 card-shadow space-y-5">
           <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center text-4xl mb-4 shadow-inner">🤖</div>
              <p className="text-xs text-gray-400 font-bold tracking-tight text-center px-4">请扫描机器人底部的二维码或手动输入序列号</p>
           </div>

           {/* 序列号录入 */}
           <div className="space-y-1.5">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">设备序列号 (SN)</label>
             <div className="flex gap-2">
               <input 
                 type="text" 
                 placeholder={isScanningSN ? "🔍 正在扫描中..." : "请输入序列号"}
                 value={formData.sn}
                 onChange={(e) => setFormData({...formData, sn: e.target.value})}
                 className="flex-1 bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-100"
               />
               <button 
                 onClick={handleScanSN}
                 className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl active:scale-95 transition-transform"
               >
                 {isScanningSN ? '⌛' : '📷'}
               </button>
             </div>
           </div>
           
            
           {/* 机器人昵称 */}
           <div className="space-y-1.5">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">机器人名称</label>
             <input 
               type="text" 
               placeholder="给机器人起个名字"
               value={formData.nickname}
               onChange={(e) => setFormData({...formData, nickname: e.target.value})}
               className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-100"
             />
           </div>
        </div>

        {/* 服务商信息 */}
        <div className="bg-white rounded-[32px] p-6 border border-gray-50 card-shadow space-y-4">
           <div className="flex items-center gap-2 mb-1">
             <span className="w-1 h-3 bg-green-500 rounded-full"></span>
             <h3 className="text-xs font-bold text-gray-800">服务人员信息 (必填)</h3>
           </div>
           <div className="space-y-3">
             <input 
               type="text" 
               placeholder="服务人员姓名"
               value={formData.serviceProviderName}
               onChange={(e) => setFormData({...formData, serviceProviderName: e.target.value})}
               className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold"
             />
             <input 
               type="tel" 
               placeholder="服务人员手机号"
               value={formData.serviceProviderPhone}
               onChange={(e) => setFormData({...formData, serviceProviderPhone: e.target.value})}
               className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold"
             />
           </div>
        </div>

        <button 
          disabled={!formData.sn || !formData.serviceProviderName || !formData.serviceProviderPhone}
          onClick={handleConfirm}
          className="w-full py-4 bg-[#024481] text-white rounded-2xl font-bold shadow-xl shadow-blue-100 active:scale-[0.98] transition-all disabled:opacity-30"
        >
          确认绑定设备
        </button>
      </main>
    </motion.div>
  );
};

// --- 子组件：每周健康报告 PDF 预览 ---
const HealthReportView = ({ onClose, robots, setOverlay }: { onClose: () => void; robots: any[]; setOverlay: (overlay: OverlayType | null) => void }) => {
  const reportData = {
    dateRange: '2026.05.04 - 2026.05.10',
    overallStatus: '优秀',
    statusDesc: '本周老人生命体征稳定，健康状态较上周有所提升。',
    metrics: [
      { name: '平均心率', value: '72 bpm', status: '正常', icon: '💓' },
      { name: '平均血压', value: '128/82 mmHg', status: '正常', icon: '🩺' },
      { name: '睡眠时长', value: '7h 15m', status: '达标', icon: '🌙' },
      { name: '运动天数', value: '5 天', status: '积极', icon: '🏃' },
    ],
    highlights: [
      '睡眠质量显著提升，深度睡眠比例增加 15%',
      '每日坚持慢走，运动依从性达到 85%',
      '周三监测到短时血压波动，已提示用药并恢复',
    ],
    suggestions: [
      '近期气温变化剧烈，注意早晚添衣防止感冒。',
      '建议增加摄入富含钾的食物，有助于更稳定控制血压。',
      '保持目前的心情愉悦状态，情绪脸谱显示本周心情良好。'
    ]
  };

  const handleWeChatClick = () => {
    // Check if any robot is bound and has service provider info
    const robot = robots[0];
    const isBound = robots.length > 0 && robot?.serviceProviderName && robot?.serviceProviderPhone;
    
    if (!isBound) {
      alert('请先绑定机器人和服务人员');
      setOverlay('addRobot');
    } else {
      alert('已生成分享链接，可发送至微信');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 z-[300] bg-gray-50 flex flex-col"
    >
      <header className="bg-white p-6 pt-12 flex justify-between items-center border-b border-gray-100">
        <button onClick={onClose} className="p-2 -ml-2 text-gray-400">✕</button>
        <h2 className="font-black text-gray-800 text-lg">每周健康评估报告</h2>
        <div className="w-8"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* PDF 模拟页 */}
        <div className="bg-white rounded-[32px] p-8 card-shadow space-y-8 border border-white">
          {/* 页眉 */}
          <div className="flex justify-between items-start border-b-2 border-blue-50 pb-6">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-3">小和</div>
              <h1 className="text-2xl font-black text-gray-900 italic">HEALTH REPORT</h1>
              <p className="text-[10px] text-blue-500 font-bold tracking-[0.2em] uppercase mt-1">Professional Assessment</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400">报告周期</p>
              <p className="text-sm font-black text-[#1e293b]">{reportData.dateRange}</p>
              <div className="mt-4 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">状态：{reportData.overallStatus}</div>
            </div>
          </div>

          {/* 综述 */}
          <section className="space-y-3">
             <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
               <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
               AI 综合评估
             </h3>
             <p className="text-sm text-gray-600 leading-loose bg-blue-50/50 p-4 rounded-2xl italic">
               “{reportData.statusDesc}”
             </p>
          </section>

          {/* 指标卡片 */}
          <div className="grid grid-cols-2 gap-4">
            {reportData.metrics.map((m, i) => (
              <div key={i} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col gap-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-[8px] bg-white px-1.5 py-0.5 rounded font-bold text-gray-400">{m.status}</span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold">{m.name}</p>
                <p className="text-base font-black text-gray-800">{m.value}</p>
              </div>
            ))}
          </div>

          {/* 本周亮点 */}
          <section className="space-y-3">
             <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
               <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
               本周亮点
             </h3>
             <ul className="space-y-2">
               {reportData.highlights.map((h, i) => (
                 <li key={i} className="flex gap-2 items-start text-xs text-gray-600 leading-relaxed">
                   <span className="text-emerald-500 mt-0.5">⭐</span>
                   {h}
                 </li>
               ))}
             </ul>
          </section>

          {/* 专业建议 */}
          <section className="space-y-3">
             <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
               <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
               下周建议
             </h3>
             <div className="space-y-2">
               {reportData.suggestions.map((s, i) => (
                 <div key={i} className="p-3 bg-orange-50/30 rounded-xl text-xs text-gray-700 leading-relaxed border-l-2 border-orange-200">
                   {s}
                 </div>
               ))}
             </div>
          </section>

          {/* 印章/页脚 */}
          <div className="pt-8 border-t border-gray-100 flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-400 font-bold">检测设备：JH-Care X1 智能机器人</p>
              <p className="text-[10px] text-gray-400 font-bold">生成时间：2026.05.11 08:45:12</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-2 border-blue-200 rounded-full flex items-center justify-center -mb-4 opacity-30 select-none">
                <span className="text-[8px] font-black text-blue-500 text-center scale-90">小和 AI<br/>健康评估<br/>专用章</span>
              </div>
              <p className="text-[10px] font-black text-[#024481] italic">Xiao He AI Care</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-6 bg-white border-t border-gray-100 flex gap-4">
        <button 
          onClick={handleWeChatClick}
          className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <span>📤</span> 分享转发
        </button>
        <button 
          onClick={() => alert('PDF 正在下载中...')}
          className="flex-1 py-4 bg-[#024481] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-transform"
        >
          <span>📥</span> 立即下载
        </button>
      </footer>
    </motion.div>
  );
};

// --- 子组件：登录与注册 ---
const LoginRegisterView = ({ 
  onLogin, 
  onAnonymousLogin, 
  onSetUnbound, 
  onSetRobots, 
  onSetLoggedIn 
}: { 
  onLogin: () => void; 
  onAnonymousLogin: () => void;
  onSetUnbound: (val: boolean) => void;
  onSetRobots: (robots: any[]) => void;
  onSetLoggedIn: (val: boolean) => void;
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState<'sms' | 'password'>('sms'); // 默认验证码登录
  const [formData, setFormData] = useState({ phone: '', code: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const fillDemoAccount = () => {
    // 设置演示账户登录信息
    setFormData({
      ...formData,
      phone: '13800138000',
      password: 'password123',
      code: '888888'
    });
    // 演示模式：登录并设置演示机器人数据
    onLogin();
    onSetRobots([
      { id: 'robot-1', nickname: '我的小和', model: 'Gen-2', status: 'online', battery: 85, network: '极佳', version: 'v2.1.0', icon: '🤖' },
      { id: 'robot-2', nickname: '备用小和', model: 'Gen-2 Lite', status: 'offline', battery: 12, network: '断开', version: 'v2.0.8', icon: '🤖' }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // 模拟身份验证
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] bg-white flex flex-col p-8"
    >
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-10">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-16 h-16 bg-[#024481] rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-blue-100">🏠</div>
            <div className="flex flex-col gap-2">
              {isLogin && (
                <>
                  <button 
                    type="button"
                    onClick={fillDemoAccount}
                    className="text-[10px] bg-blue-50 text-[#024481] px-3 py-1.5 rounded-full font-black uppercase tracking-wider active:scale-95 transition-all text-center"
                  >使用演示模式</button>
                  <button 
                    type="button"
                    onClick={() => {
                      onAnonymousLogin();
                      // Maybe set a flag indicating unbound mode
                    }}
                    className="text-[10px] bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-black uppercase tracking-wider active:scale-95 transition-all text-center"
                  >使用匿名模式</button>
                  <button 
                    type="button"
                    onClick={() => {
                      onAnonymousLogin();
                      onSetUnbound(true);
                      onSetRobots([]);
                      onSetLoggedIn(true);
                    }}
                    className="text-[10px] bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full font-black uppercase tracking-wider active:scale-95 transition-all text-center"
                  >快速绑定模式</button>
                </>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{isLogin ? '欢迎回来' : '开启守护'}</h1>
            <p className="text-gray-400 font-bold text-sm">家和万事兴 · 欢迎使用嘉和智护OS系统</p>
          </div>
        </div>

        {/* 登录方式切换 - 仅在登录状态显示 */}
        {isLogin && (
          <div className="flex bg-gray-50 p-1.5 rounded-2xl">
            <button 
              onClick={() => setLoginMethod('sms')}
              className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${loginMethod === 'sms' ? 'bg-white text-[#024481] shadow-sm' : 'text-gray-400'}`}
            >验证码登录</button>
            <button 
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${loginMethod === 'password' ? 'bg-white text-[#024481] shadow-sm' : 'text-gray-400'}`}
            >密码登录</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">手机号码</label>
            <input 
              type="tel" 
              placeholder="请输入 11 位手机号"
              required
              className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-[#024481] transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {(isLogin && loginMethod === 'sms') || !isLogin ? (
             <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">短信验证码</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="6位验证码"
                    className="flex-1 h-14 bg-gray-50 border-none rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-[#024481] transition-all"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                  <button type="button" className="px-5 h-14 bg-gray-100 text-gray-600 rounded-2xl text-xs font-bold active:scale-95 transition-transform">获取码</button>
                </div>
             </div>
          ) : null}

          {(isLogin && loginMethod === 'password') || !isLogin ? (
            <div className="space-y-1.5">
              <div className="flex justify-between px-1">
                <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{!isLogin ? '设置密码' : '登录密码'}</label>
                {isLogin && <button type="button" className="text-[10px] text-gray-400 font-bold">忘记密码？</button>}
              </div>
              <input 
                type="password" 
                placeholder={isLogin ? "请输入密码" : "6-12位字母数字"}
                required
                className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-[#024481] transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          ) : null}

          <div className="pt-2">
            <button 
              disabled={loading}
              className="w-full h-14 bg-[#024481] text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  正在安全校验...
                </>
              ) : (isLogin ? '进入系统' : '立即注册')}
            </button>
          </div>
        </form>

        <div className="text-center space-y-6">
          <p className="text-xs text-gray-400 font-bold">
            {isLogin ? '还没有账号？' : '已有账号？'}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#024481] ml-1 font-black underline underline-offset-4"
            >
              {isLogin ? '极速注册' : '返回登录'}
            </button>
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-gray-100"></div>
              <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">第三方快捷入口</span>
              <div className="flex-1 h-[1px] bg-gray-100"></div>
            </div>
            <div className="flex justify-center gap-12">
              <button className="flex flex-col items-center gap-2 active:scale-90 transition-transform">
                <div className="w-14 h-14 rounded-full bg-[#f7f7f7] flex items-center justify-center text-3xl shadow-sm">💬</div>
                <span className="text-[10px] text-gray-400 font-bold italic">WeChat</span>
              </button>
              <button className="flex flex-col items-center gap-2 active:scale-90 transition-transform">
                <div className="w-14 h-14 rounded-full bg-[#f7f7f7] flex items-center justify-center text-3xl shadow-sm">🍎</div>
                <span className="text-[10px] text-gray-400 font-bold italic">Apple ID</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-8 text-center mt-auto">
        <p className="text-[10px] text-gray-300 font-medium leading-relaxed max-w-[240px] mx-auto">
          登录即代表同意 <span className="text-gray-400 font-bold">服务协议</span> 与 <span className="text-gray-400 font-bold">隐私政策</span><br/>
          嘉和智护 OS · 安全合规审计
        </p>
      </footer>
    </motion.div>
  );
};

const ProfileView = ({ 
  profiles,
  activeIdx,
  onProfileSwitch,
  onEditClick,
  robots,
  activeRobotId,
  onRobotSwitch,
  onRobotEdit,
  onRobotDetail,
  onAddRobotClick,
  onDeleteRobot,
  onDeleteData,
  onLogout
}: { 
  profiles: any[];
  activeIdx: number;
  onProfileSwitch: (index: number) => void;
  onEditClick: () => void;
  robots: any[];
  activeRobotId: string;
  onRobotSwitch: (id: string) => void;
  onRobotEdit: (robot: any) => void;
  onRobotDetail: (robot: any) => void;
  onAddRobotClick: (type?: any) => void;
  onDeleteRobot: (id: string) => void;
  onDeleteData: () => void;
  onLogout: () => void;
}) => {
  const profile = profiles[activeIdx];
  const [switches, setSwitches] = useState({ push: true, sms: true, voice: false });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-24"
    >
      {/* 成员切换页签 - 切换老人 */}
      <div className="flex gap-4 p-4 overflow-x-auto [&::-webkit-scrollbar]:hidden shrink-0">
        {profiles.map((p, idx) => (
          <button 
            key={p.id}
            onClick={() => onProfileSwitch(idx)}
            className={`flex flex-col items-center gap-2 min-w-[70px] transition-all ${activeIdx === idx ? 'scale-110' : 'opacity-40 grayscale'}`}
          >
            <div className={`w-14 h-14 rounded-full border-2 ${activeIdx === idx ? 'border-[#024481]' : 'border-transparent'} p-0.5 relative`}>
              <img src={p.avatar} className="w-full h-full rounded-full object-cover" alt={p.name} />
              {activeIdx === idx && (
                <span className="absolute -bottom-1 -right-1 bg-[#024481] text-white p-0.5 rounded-full text-[8px]">✔️</span>
              )}
            </div>
            <span className={`text-[10px] font-bold ${activeIdx === idx ? 'text-[#024481]' : 'text-gray-400'}`}>
              {p.name}{activeIdx === idx && ' (已选)'}
            </span>
          </button>
        ))}
        <button className="flex flex-col items-center gap-2 min-w-[70px] opacity-40">
           <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-2xl text-gray-400 font-light">＋</div>
           <span className="text-[10px] font-bold text-gray-400">添加</span>
        </button>
      </div>

      {/* 个人简介与数据概览 */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
            <img 
              src={profile.avatar} 
              alt="用户头像" 
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            onClick={onEditClick}
            className="absolute bottom-0 right-0 bg-[#024481] text-white p-1.5 rounded-full border-2 border-white shadow-md text-xs active:scale-90 transition-transform"
          >
            🖊️
          </button>
        </div>
        <div className="text-center mt-4 w-full">
          <h2 className="text-2xl font-bold text-gray-800">{profile.name} <span className="text-base text-gray-500 font-normal ml-1">{profile.age}岁</span></h2>
          <div className="flex gap-2 mt-3 justify-center mb-8">
            <span className="px-3 py-1 bg-blue-100 text-[#094784] rounded-full text-xs font-bold shadow-sm">{profile.bloodType}</span>
            <span className="px-3 py-1 bg-[#a0f5bf] text-[#187248] rounded-full text-xs font-bold shadow-sm">{profile.mode}</span>
            <span className="px-3 py-1 bg-white border border-[#024481] text-[#024481] rounded-full text-xs font-bold opacity-80 shadow-sm">{profile.healthStatus}</span>
          </div>
        </div>

        {/* 数据概览 */}
        <div className="w-full bg-transparent flex justify-between items-center text-center px-4">
          <div className="flex-1">
            <div className="text-[11px] text-[#8e9eba] font-bold tracking-wider mb-2">守护天数</div>
            <div className="text-[28px] font-medium text-[#1e293b]">452</div>
          </div>
          <div className="w-px h-10 bg-[#e2e8f0]"></div>
          <div className="flex-1">
            <div className="text-[11px] text-[#8e9eba] font-bold tracking-wider mb-2">关联机器人</div>
            <div className="text-[28px] font-medium text-[#1e293b]">{robots.length}</div>
          </div>
          <div className="w-px h-10 bg-[#e2e8f0]"></div>
          <div className="flex-1">
            <div className="text-[11px] text-[#8e9eba] font-bold tracking-wider mb-2">依从性评分</div>
            <div className="text-[28px] font-medium text-[#3b82f6]">优秀</div>
          </div>
        </div>
      </div>

      {/* 机器人管理 */}
      <div className="px-2 mb-2">
        <h3 className="text-gray-500 font-bold text-xs tracking-widest uppercase">我的设备</h3>
      </div>
      <div className="bg-white rounded-[24px] p-6 card-shadow border border-gray-50 space-y-4">
        <h3 className="font-bold text-gray-800 text-sm flex items-center justify-between">
          <span>机器人管理</span>
          <button 
            onClick={onAddRobotClick}
            className="text-[10px] text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full active:scale-95 transition-transform"
          >＋ 添加机器人</button>
        </h3>
        
        <div className="space-y-4">
          {robots.map(robot => (
            <div 
              key={robot.id}
              className={`p-4 rounded-2xl border transition-all ${activeRobotId === robot.id ? 'border-blue-100 bg-blue-50/20' : 'border-gray-50 bg-gray-50/30'}`}
              onClick={() => onRobotSwitch(robot.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl transition-all ${activeRobotId === robot.id ? 'bg-[#024481] text-white scale-110 shadow-lg' : 'bg-white text-gray-300'}`}>
                    🤖
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <p className={`font-bold transition-all ${activeRobotId === robot.id ? 'text-gray-800 text-base' : 'text-gray-400 text-sm'}`}>{robot.nickname}</p>
                       {activeRobotId === robot.id && <span className="bg-[#0d6c42] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">默认</span>}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${robot.status === 'online' ? 'bg-[#0d6c42] animate-pulse' : 'bg-gray-300'}`}></span>
                      <span className={`text-[10px] font-bold ${robot.status === 'online' ? 'text-[#0d6c42]' : 'text-gray-400'}`}>
                        {robot.status === 'online' ? '在线运行中' : '离线/深度休眠'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRobotDetail(robot);
                    }}
                    title="管理设备"
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-90 ${activeRobotId === robot.id ? 'bg-white text-[#024481]' : 'bg-gray-100 text-gray-400'}`}
                  >管理维护</button>
                </div>
              </div>
              
              {activeRobotId === robot.id && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-white/80 backdrop-blur-sm p-2 rounded-xl flex items-center justify-center gap-2">
                    <span className="text-xs">🔋</span>
                    <span className="text-xs font-bold text-gray-700">{robot.battery}%</span>
                    <div className="w-8 h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-green-500" style={{ width: `${robot.battery}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-2 rounded-xl flex items-center justify-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">网络</span>
                    <span className="text-xs font-bold text-gray-700">{robot.network}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          {robots.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-3xl">
               <p className="text-xs text-gray-400">暂无机器人，请点击上方添加</p>
            </div>
          )}
        </div>
      </div>

      {/* 系统相关设置 */}
      <div className="px-2 mb-2">
        <h3 className="text-gray-500 font-bold text-xs tracking-widest uppercase">系统设置</h3>
      </div>
      
      {/* 设置列表 */}
      <div className="bg-white rounded-[32px] p-2 card-shadow border border-gray-50 overflow-hidden">
        <button 
          onClick={() => onAddRobotClick('emergencyContacts' as any)}
          className="w-full p-5 flex items-center justify-between border-b border-gray-50 active:bg-gray-50"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center text-xl">🚑</div>
            <span className="font-bold text-gray-700">紧急联系人</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">已设 {profiles.length} 位</span>
            <span className="text-gray-300">❯</span>
          </div>
        </button>

        <button 
          onClick={() => onAddRobotClick('familyMembers' as any)}
          className="w-full p-5 flex items-center justify-between border-b border-gray-50 active:bg-gray-50"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center text-xl">🏘️</div>
            <span className="font-bold text-gray-700">家人管理</span>
          </div>
          <span className="text-gray-300">❯</span>
        </button>

        <button 
          onClick={() => onAddRobotClick('medicationPlan' as any)}
          className="w-full p-5 flex items-center justify-between active:bg-gray-50"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center text-xl">💊</div>
            <span className="font-bold text-gray-700">用药计划</span>
          </div>
          <span className="text-gray-300">❯</span>
        </button>
      </div>

      {/* 消息通知相关 */}
      <div className="px-2 mt-6 mb-2">
        <h3 className="text-gray-500 font-bold text-xs tracking-widest uppercase">消息通知</h3>
      </div>

      {/* 告警与通知设置入口 */}
      <div className="bg-white rounded-[32px] p-6 card-shadow border border-gray-50 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer"
        onClick={() => onAddRobotClick('alarmSettings')}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">🔔</div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">告警与通知设置</h3>
            <p className="text-[10px] text-gray-400 mt-1">包含紧急告警、健康异常及每日简报</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">去配置</span>
           <span className="text-gray-300">➡️</span>
        </div>
      </div>

      {/* 底部辅助连接 */}
      <div className="flex justify-center gap-6 pt-4">
        <button 
          onClick={() => onAddRobotClick('legalTerms' as any)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >用户协议</button>
        <div className="w-px h-3 bg-gray-100 mt-1"></div>
        <button 
          onClick={() => onAddRobotClick('legalPrivacy' as any)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >隐私政策</button>
      </div>

      {/* 退出登录 */}
      <div className="px-6 pb-4">
        <button 
          onClick={onLogout}
          className="w-full py-4 text-red-500 font-bold text-sm bg-red-50 rounded-[24px] active:scale-95 transition-transform"
        >退出当前账号</button>
        <p className="text-center text-[10px] text-gray-400 mt-4 px-4 leading-relaxed">
          嘉和智护OS 极简陪伴版 v1.2.4<br/>
          安全加密连接中 🔒
        </p>
      </div>
    </motion.div>
  );
};

// --- 主组件 ---
const NotificationsView = ({ onClose, onAlertClick }: { onClose: () => void, onAlertClick: (data: AlertData) => void }) => {
  const notifications: AlertData[] = [
    { time: '08:30', type: 'health', status: 'warning', message: '今早血压偏高148/86，请关注' },
    { time: '昨天 23:15', type: 'fall', status: 'critical', message: '检测到妈妈可能跌倒' },
    { time: '昨天 20:00', type: 'medication', status: 'warning', message: '缬沙坦胶囊 待服用' },
  ];

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="absolute inset-0 z-[100] bg-[#fbf9f8] flex flex-col"
    >
      <header className="bg-white text-gray-800 px-6 py-6 flex items-center gap-4 relative shadow-sm border-b border-gray-100">
        <button onClick={onClose} className="text-2xl text-gray-600">⬅️</button>
        <h2 className="text-xl font-bold flex-1">消息通知</h2>
      </header>
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-6 space-y-4">
        {notifications.map((note, index) => (
          <div 
            key={index} 
            onClick={() => onAlertClick(note)}
            className="bg-white rounded-2xl p-4 card-shadow flex items-start gap-4 border border-gray-50 active:scale-[0.98] transition-transform"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${note.status === 'critical' ? 'bg-red-100' : 'bg-orange-100'}`}>
              {note.status === 'critical' ? '🚨' : '⚠️'}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-800">{note.type === 'health' ? '健康提醒' : note.type === 'fall' ? '跌倒警报' : '用药提醒'}</span>
                <span className="text-xs text-gray-400">{note.time}</span>
              </div>
              <p className="text-sm text-gray-500">{note.message}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isUnboundMode, setIsUnboundMode] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('guardian');
  const [overlay, setOverlay] = useState<OverlayType | null>(null);
  
  // 恢复老人档案
  const [elderlyProfiles, setElderlyProfiles] = useState([
    {
      id: 'elder-1',
      name: '张建设',
      phone: '13812345678',
      age: 78,
      bloodType: 'A型血',
      mode: '独居模式',
      healthStatus: '健康良好',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
      chronicDiseases: '高血压、轻度糖尿病',
      medicalHistory: '2015年进行过阑尾切除手术',
      allergies: '青霉素过敏',
      medications: '缬沙坦胶囊 1粒/日，二甲双胍 0.5g/日',
      livingAbility: '基本自理，需提醒用药',
      riskAssessment: '存在轻度跌倒风险'
    },
    {
      id: 'elder-2',
      name: '王秀兰',
      phone: '13987654321',
      age: 75,
      bloodType: 'O型血',
      mode: '居家养老',
      healthStatus: '一般',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      chronicDiseases: '无',
      medicalHistory: '无',
      allergies: '无过敏史',
      medications: '复合维生素 1粒/日',
      livingAbility: '完全自理',
      riskAssessment: '健康良好，需日常陪伴'
    }
  ]);
  const [activeElderlyIndex, setActiveElderlyIndex] = useState(0);

  const [robots, setRobots] = useState<any[]>([]);

  const [activeRobotId, setActiveRobotId] = useState('robot-1');
  const [editingRobot, setEditingRobot] = useState<any>(null);
  const [activeDetailRobot, setActiveDetailRobot] = useState<any>(null);

  // 摄像头记录
  const [cameraLogs, setCameraLogs] = useState<CameraLog[]>([
    { id: '1', time: '10:24', source: '告警', status: '已自动取流' },
    { id: '2', time: '09:15', source: '通话', status: '通话时长 05:20' },
    { id: '3', time: '昨日 18:30', source: '抓拍', status: '定时日常巡检' }
  ]);

  // 通知设置
  const [notifConfig, setNotifConfig] = useState({
    app: true,
    sms: true,
    voice: false,
    dnd: false,
    startTime: '22:00',
    endTime: '07:00'
  });

  // 紧急联系人
  const [emergencyContacts, setEmergencyContacts] = useState<Contact[]>([
    { id: '1', name: '张大勇', relation: '长子', phone: '13800001111' },
    { id: '2', name: '张小丽', relation: '次女', phone: '13900002222' }
  ]);

  // 家人管理
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: '1', name: '张大勇', relation: '大儿子', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop' },
    { id: '2', name: '王晓梅', relation: '大儿媳', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' }
  ]);

  // 用药计划
  const [medicationPlan, setMedicationPlan] = useState<Medication[]>([
    { id: '1', name: '缬沙坦胶囊', dosage: '1粒/次', times: ['08:00'] },
    { id: '2', name: '二甲双胍', dosage: '0.5g/次', times: ['08:00', '18:00'] }
  ]);

  const [legalType, setLegalType] = useState<'terms' | 'privacy'>('terms');

  // 统一处理操作导航
  const handleAction = (type: OverlayType) => {
    if (type === 'videoCall') {
      setIsConnecting(true);
      setOverlay('videoCall');
      // 模拟父母同意的过程
      setTimeout(() => {
        setIsConnecting(false);
      }, 4000);
    } else {
      setOverlay(type);
    }
  };

  // 根据当前标签渲染视图
  const renderContent = () => {
    const isEmptyAnonymous = isAnonymous && robots.length > 0;
    switch (activeTab) {
      case 'guardian': {
        const activeRobot = robots.find(r => r.id === activeRobotId);
        return (
          <GuardianView 
            onAction={handleAction}
            onImageClick={(src) => {
              setSelectedImage(src);
              setOverlay('imageViewer');
            }}
            onStatusClick={(data) => {
              setAlertData(data);
              setOverlay('alertDetail');
            }}
            onTabSwitch={(tab) => setActiveTab(tab)}
            isDeviceOffline={activeRobot?.status === 'offline'}
            isAnonymous={isEmptyAnonymous} // 更新此调用
          />
        );
      }
      case 'health': return (
        <HealthView 
          onCalendarClick={() => handleAction('medicationCalendar')}
          isAnonymous={isEmptyAnonymous} // 更新此调用
        />
      );
      case 'companion': return <CompanionView onAction={(type) => setOverlay(type)} isAnonymous={isEmptyAnonymous} />; // 更新此调用
      case 'profile': return (
        <ProfileView 
          profiles={elderlyProfiles} 
          activeIdx={activeElderlyIndex}
          onProfileSwitch={(idx) => setActiveElderlyIndex(idx)}
          onEditClick={() => setOverlay('elderlyProfile')} 
          robots={robots}
          activeRobotId={activeRobotId}
          onRobotSwitch={(id) => setActiveRobotId(id)}
          onRobotEdit={(robot) => setEditingRobot(robot)}
          onRobotDetail={(robot) => {
            setActiveDetailRobot(robot);
            setOverlay('robotDetail');
          }}
          onAddRobotClick={(type: any) => {
            if (type === 'emergencyContacts') setOverlay('emergencyContacts' as any);
            else if (type === 'familyMembers') setOverlay('familyMembers' as any);
            else if (type === 'medicationPlan') setOverlay('medicationPlan' as any);
            else if (type === 'legalTerms') { setLegalType('terms'); setOverlay('legalNotice' as any); }
            else if (type === 'legalPrivacy') { setLegalType('privacy'); setOverlay('legalNotice' as any); }
            else if (type === 'alarmSettings') { setOverlay('alarmSettings' as any); }
            else setOverlay('addRobot');
          }}
          onDeleteRobot={(id) => {
            setRobots(rs => rs.filter(r => r.id !== id));
            if (activeRobotId === id && robots.length > 1) {
              setActiveRobotId(robots.find(r => r.id !== id)?.id || '');
            }
          }}
          onDeleteData={() => setOverlay('confirmDelete' as any)}
          onLogout={() => setIsLoggedIn(false)}
        />
      );
    }
  };

  // 机器人昵称编辑弹窗
  const renderRobotEditor = () => {
    if (!editingRobot) return null;
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl overflow-hidden relative"
        >
          <div className="flex flex-col items-center gap-4">
             <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl">🤖</div>
             <div className="text-center">
               <h3 className="text-xl font-bold text-gray-800">修改机器人昵称</h3>
               <p className="text-xs text-gray-400 mt-1">给这台设备取个好记的名字吧</p>
             </div>
             <input 
               type="text" 
               autoFocus
               defaultValue={editingRobot.nickname}
               id="robotNicknameInput"
               className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-center text-lg font-bold focus:ring-2 focus:ring-blue-100"
             />
             <div className="flex gap-3 w-full mt-4">
               <button 
                 onClick={() => setEditingRobot(null)}
                 className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-500 font-bold active:scale-95 transition-transform"
               >取消</button>
               <button 
                 onClick={() => {
                   const val = (document.getElementById('robotNicknameInput') as HTMLInputElement).value;
                   if (val) {
                     setRobots(rs => rs.map(r => r.id === editingRobot.id ? { ...r, nickname: val } : r));
                   }
                   setEditingRobot(null);
                 }}
                 className="flex-1 py-4 rounded-2xl bg-[#024481] text-white font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
               >确认</button>
             </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative bg-[#fbf9f8] text-gray-800">
      <AnimatePresence>
        {!isLoggedIn && (
          <LoginRegisterView 
            onLogin={() => setIsLoggedIn(true)} 
            onAnonymousLogin={() => {
              setIsLoggedIn(true);
              setIsAnonymous(true);
              setIsUnboundMode(false);
              setRobots([
                { id: 'robot-1', nickname: '我的小和', model: 'Gen-2', status: 'online', battery: 85, network: '极佳', version: 'v2.1.0', icon: '🤖' },
                { id: 'robot-2', nickname: '备用小和', model: 'Gen-2 Lite', status: 'offline', battery: 12, network: '断开', version: 'v2.0.8', icon: '🤖' }
              ]);
            }}
            onSetUnbound={setIsUnboundMode}
            onSetRobots={setRobots}
            onSetLoggedIn={setIsLoggedIn}
          />
        )}
      </AnimatePresence>

      {/* 全屏 Overlay 渲染 */}
      <AnimatePresence>
        {renderRobotEditor()}
        {overlay === 'imageViewer' && selectedImage && (
          <ImageViewer src={selectedImage} onClose={() => setOverlay(null)} />
        )}
        {overlay === 'addRobot' && (
          <AddRobotView 
            onAdd={(robot) => {
              setRobots(rs => [...rs, robot]);
              setOverlay(null);
            }}                
            onClose={() => setOverlay(null)}
          />
        )}
        {overlay === 'videoCall' && (
          <VideoCallView 
            isConnecting={isConnecting} 
            onClose={() => {
              setOverlay(null);
              setIsConnecting(false);
            }} 
          />
        )}
        {overlay === 'alertDetail' && alertData && (
          <AlertDetailView data={alertData} onClose={() => setOverlay(null)} />
        )}
        {overlay === 'voiceMessage' && (
          <VoiceMessageView onClose={() => setOverlay(null)} />
        )}
        {overlay === 'notifications' && (
          <NotificationsView 
            onClose={() => setOverlay(null)} 
            onAlertClick={(data) => {
              setAlertData(data);
              setOverlay('alertDetail');
            }} 
          />
        )}
        {overlay === 'elderlyProfile' && (
          <ElderlyProfileEditView 
            data={elderlyProfiles[activeElderlyIndex]} 
            onSave={(newData) => setElderlyProfiles(ps => ps.map((p, idx) => idx === activeElderlyIndex ? newData : p))}
            onClose={() => setOverlay(null)} 
          />
        )}
        {overlay === 'emergencyContacts' && (
          <EmergencyContactsView 
            contacts={emergencyContacts}
            onUpdate={setEmergencyContacts}
            onClose={() => setOverlay(null)}
          />
        )}
        {overlay === 'familyMembers' && (
          <FamilyMembersView 
            members={familyMembers}
            onDelete={(id) => setFamilyMembers(ms => ms.filter(m => m.id !== id))}
            onClose={() => setOverlay(null)}
          />
        )}
        {overlay === 'medicationPlan' && (
          <MedicationPlanView 
            plan={medicationPlan}
            onUpdate={setMedicationPlan}
            onClose={() => setOverlay(null)}
          />
        )}
        {overlay === 'medicationCalendar' && (
          <MedicationCalendarView 
            plan={medicationPlan}
            onClose={() => setOverlay(null)}
          />
        )}
        {overlay === 'robotDetail' && activeDetailRobot && (
          <RobotDetailView 
            robot={activeDetailRobot}
            onSave={(updatedRobot) => {
              setRobots(rs => rs.map(r => r.id === updatedRobot.id ? updatedRobot : r));
              setOverlay(null);
              setActiveDetailRobot(null);
            }}
            onDelete={(id) => {
              setRobots(rs => rs.filter(r => r.id !== id));
            }}
            onClose={() => {
              setOverlay(null);
              setActiveDetailRobot(null);
            }}
          />
        )}
        {overlay === 'legalNotice' && (
          <LegalNoticeView 
            type={legalType}
            onViewLogs={() => setOverlay('cameraAccessLogs')}
            onDeleteData={() => setOverlay('confirmDelete' as any)}
            onClose={() => setOverlay(null)}
          />
        )}
        {overlay === 'alarmSettings' && (
          <AlarmSettingsView onClose={() => setOverlay(null)} />
        )}
        {overlay === 'healthReport' && (
          <HealthReportView onClose={() => setOverlay(null)} robots={robots} setOverlay={setOverlay} />
        )}
        {overlay === 'cameraAccessLogs' && (
          <CameraAccessLogsView 
            logs={cameraLogs}
            onClose={() => setOverlay('legalNotice' as any)}
          />
        )}
        {overlay === 'confirmDelete' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[250] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="bg-white rounded-[40px] w-full max-w-sm p-8 space-y-6 text-center shadow-2xl">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-2">🗑️</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">确认清理数据？</h3>
                <p className="text-sm text-gray-400 mt-2">操作后将清除所有历史体征趋势与摄像头通话记录，此操作不可撤销。</p>
              </div>
              
              <div className="space-y-3">
                <input 
                  type="password" 
                  placeholder="请输入确认密码 (123456)" 
                  id="deleteConfirmPwd"
                  className="w-full bg-gray-50 border-none rounded-xl p-4 text-center text-sm font-bold focus:ring-1 focus:ring-red-100"
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => setOverlay(null)}
                    className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-500 active:scale-95 transition-transform"
                  >取消</button>
                  <button 
                    onClick={() => {
                      const pwd = (document.getElementById('deleteConfirmPwd') as HTMLInputElement).value;
                      if (pwd === '123456') {
                        setCameraLogs([]);
                        setOverlay(null);
                        alert('历史记录已成功清理');
                      } else {
                        alert('密码错误');
                      }
                    }}
                    className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform"
                  >确认清理</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 顶部标题栏 */}
      <header className="flex justify-between items-center px-6 py-4 sticky top-0 bg-[#fbf9f8]/80 backdrop-blur-md z-40 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <h1 className="text-xl font-bold text-[#024481]">嘉和智护OS</h1>
        </div>
        <button onClick={() => handleAction('notifications')} className="w-10 h-10 rounded-full bg-white flex items-center justify-center card-shadow active:scale-95 transition-transform relative">
          🔔
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-[1.5px] border-white shadow-sm"></span>
        </button>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 px-6 pt-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {isAnonymous && robots.length === 0 && activeTab !== 'profile' && (
          <div className="bg-blue-50 text-[#024481] p-4 rounded-3xl mb-6 flex items-center justify-between shadow-sm">
            <p className="text-xs font-bold">欢迎使用嘉和智护OS，请一步快速绑定机器人。</p>
            <button onClick={() => setOverlay('addRobot')} className="text-[10px] font-black bg-white rounded-full px-3 py-1.5 shadow-sm">去绑定</button>
          </div>
        )}
        <AnimatePresence mode="wait">
          <div key={activeTab}>
            {isUnboundMode && robots.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-20 px-6 text-center">
                 <div className="w-40 h-40 bg-blue-500 rounded-[32px] flex items-center justify-center text-6xl text-white mb-8 shadow-2xl shadow-blue-300">🤖</div>
                 <h2 className="text-2xl font-black text-blue-600 mb-4">欢迎开启智护生活！</h2>
                 <p className="text-gray-500 font-bold text-sm mb-12">只需简单两步，即可为您或您的长辈开启全方位的智能健康守护。</p>
                 <div className="w-full bg-white rounded-[32px] p-6 shadow-xl border border-blue-50 flex items-center gap-4 text-left">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-black text-xl">1</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-sm">绑定机器人 & 建立档案</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">连接终端并录入服务人信息以开启AI守护</p>
                    </div>
                    <button onClick={() => setOverlay('addRobot')} className="bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-full shadow-lg">立即开始</button>
                 </div>
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </AnimatePresence>
      </main>

      {/* 底部导航栏 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 pb-safe pb-8 pt-3 px-4 flex justify-around items-center z-40 max-w-md mx-auto shadow-[0_-10px_20px_-4px_rgba(42,92,154,0.08)]">
        {[
          { id: 'guardian', icon: '🛡️', label: '守护' },
          { id: 'health', icon: '📈', label: '健康' },
          { id: 'companion', icon: '🫂', label: '陪伴' },
          { id: 'profile', icon: '👤', label: '我的' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (isAnonymous && robots.length === 0 && tab.id !== 'profile') {
                alert('请绑定机器人');
                setOverlay('addRobot');
                return;
              }
              setActiveTab(tab.id as TabType);
            }}
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
  );
}

