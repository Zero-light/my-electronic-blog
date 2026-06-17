/**
 * 个人档案数据
 * 关于我 / 简历页面共用
 */

export interface Education {
  school: string;
  major: string;
  degree: string;
  period: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Profile {
  name: string;
  title: string;
  email: string;
  github: string;
  location: string;
  education: Education[];
  experience: Experience[];
  summary: string;
  objective: string;
}

export const profile: Profile = {
  name: 'EIE 工程师',
  title: '电子信息工程 · 嵌入式系统与电源设计',
  email: 'example@example.com',
  github: 'https://github.com',
  location: '中国',
  summary:
    '热爱从晶体管到系统的全栈硬件开发，专注于高效开关电源、精密信号链与嵌入式固件设计。具备完整的硬件项目经验：从需求分析、方案论证、PCB Layout 到固件开发、调试验证。熟悉 STM32 生态、多种电源拓扑与常见通信协议。',
  objective:
    '寻求嵌入式硬件 / 电源工程师岗位，期待在高效能电源、精密测控或工业自动化领域深耕发展。',
  education: [
    {
      school: '某某大学',
      major: '电子信息工程',
      degree: '本科',
      period: '2022.09 – 2026.06',
    },
  ],
  experience: [
    {
      company: '某电子科技公司',
      role: '硬件研发实习生',
      period: '2025.03 – 2025.08',
      description:
        '参与数控电源模块研发，负责 Buck 变换器环路补偿设计、PCB Layout 与 STM32 数字控制固件开发。完成电源效率优化与动态负载测试。',
    },
    {
      company: '某智能硬件实验室',
      role: '嵌入式开发实习生',
      period: '2024.07 – 2024.12',
      description:
        '负责传感器采集系统的嵌入式软件开发，实现多通道 ADC 采样、数字滤波算法与 SPI/I2C 外设驱动。完成硬件-软件联调与可靠性测试。',
    },
  ],
};
