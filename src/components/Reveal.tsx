import React from 'react';
import { motion } from 'framer-motion';
type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'span';
};
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div'
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{
        opacity: 0,
        y: 24
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true,
        margin: '-80px'
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}>
      
      {children}
    </MotionTag>);

}