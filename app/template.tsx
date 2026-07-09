'use client';

import { motion } from 'framer-motion';

/**
 * App Router 页面切换过渡
 * - 每次路由切换触发淡入+轻微上滑
 * - 仅 opacity+y 动画，不影响布局稳定性
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
