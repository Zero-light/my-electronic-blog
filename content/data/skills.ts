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
    title: '硬件设计',
    items: [
      { name: 'Altium Designer / PCB Layout', level: 85 },
      { name: '电源拓扑（Buck / Boost / LDO）', level: 80 },
      { name: '信号完整性分析与仿真', level: 70 },
      { name: '示波器 / 频谱仪 / 逻辑分析仪', level: 90 },
    ],
  },
  {
    title: '嵌入式软件',
    items: [
      { name: 'STM32 HAL / LL 库开发', level: 88 },
      { name: 'ARM Cortex-M 裸机 / RTOS', level: 82 },
      { name: '通信协议（SPI / I2C / UART / CAN）', level: 85 },
      { name: '嵌入式 Linux 驱动', level: 60 },
    ],
  },
  {
    title: '软件开发与工具',
    items: [
      { name: 'C / C++', level: 90 },
      { name: 'Python（自动化测试 / 数据分析）', level: 78 },
      { name: 'Git / CI-CD', level: 75 },
      { name: 'MATLAB / Simulink', level: 65 },
    ],
  },
  {
    title: '辅助工具与技能',
    items: [
      { name: 'LTspice / PSpice 电路仿真', level: 80 },
      { name: 'LaTeX 技术文档排版', level: 70 },
      { name: 'FPGA Verilog / VHDL', level: 55 },
      { name: '3D 建模（SolidWorks / Fusion）', level: 50 },
    ],
  },
];
