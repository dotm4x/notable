import { motion } from 'motion/react';
import type { ElementType } from 'react';

const customMotionCache = new Map<
  ElementType,
  ReturnType<typeof motion.create>
>();

export function getMotionComponent(type: ElementType): ElementType {
  if (typeof type === 'string') {
    if (type in motion) {
      return (motion as unknown as Record<string, ElementType>)[type];
    }
  }
  let comp = customMotionCache.get(type);
  if (!comp) {
    comp = motion.create(type as Parameters<typeof motion.create>[0]);
    customMotionCache.set(type, comp);
  }
  return comp;
}
