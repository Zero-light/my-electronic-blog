/**
 * 技能数据
 * 首页 / 关于我 / 简历页面共用
 * 按分类分组，每项包含名称与熟练度（0–100）
 */

export interface SkillItem {
  name: string;
  level: number;
}

export interface SkillCategory {
  title: string;
  items: SkillItem[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: '嵌入式软件开发',
    items: [
      { name: 'STM32 HAL / 标准库开发', level: 90 },
      { name: 'FreeRTOS 任务调度与同步机制', level: 85 },
      { name: 'ADC / DAC / PWM / DMA / 串口外设配置', level: 88 },
      { name: '嵌入式 C 语言与模块化编程', level: 92 },
    ],
  },
  {
    title: '硬件设计与电源闭环',
    items: [
      { name: 'Altium Designer / 双层 PCB 设计', level: 85 },
      { name: '运放负反馈闭环 / CV/CC 恒压恒流环路', level: 82 },
      { name: '差分采样 / 密勒补偿 / 信号调理', level: 80 },
      { name: '地平面分割 / EMI 抑制 / 防自激设计', level: 78 },
    ],
  },
  {
    title: '通信协议与外设驱动',
    items: [
      { name: 'UART / I2C / SPI 基础通信', level: 90 },
      { name: 'RS485 Modbus RTU / W5500 TCP 客户端', level: 75 },
      { name: '串口屏 / 语音 / 超声波 / NTC / 编码器', level: 82 },
      { name: '串口协议帧解析 / 空闲超时断帧', level: 78 },
    ],
  },
  {
    title: '电机控制与调试工具',
    items: [
      { name: '串级 PID / 积分分离 / 平滑调速', level: 85 },
      { name: 'L298N / TB6612 驱动与编码器测速', level: 82 },
      { name: 'Keil MDK / Proteus / MATLAB', level: 80 },
      { name: '示波器 / 万用表 / 硬件故障排查', level: 88 },
    ],
  },
];
