import type React from 'react';
import { cn } from '@/lib/utils';

type SectionTone = 'default' | 'muted' | 'card';
type SectionSpacing = 'default' | 'tight' | 'loose';

const toneClasses: Record<SectionTone, string> = {
  default: 'bg-background',
  muted: 'bg-secondary/40',
  card: 'bg-card border-y border-border',
};

const spacingClasses: Record<SectionSpacing, string> = {
  tight: 'py-14 md:py-20',
  default: 'py-20 md:py-28',
  loose: 'py-28 md:py-36',
};

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div';
  tone?: SectionTone;
  spacing?: SectionSpacing;
  containerClassName?: string;
}

export function Section({
  as: Tag = 'section',
  tone = 'default',
  spacing = 'default',
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag className={cn(toneClasses[tone], spacingClasses[spacing], className)} {...props}>
      <div className={cn('mx-auto max-w-6xl px-6', containerClassName)}>{children}</div>
    </Tag>
  );
}

interface SectionHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({ title, description, align = 'left', className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16 max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      <h2 className="font-mono text-3xl md:text-4xl font-medium tracking-tight text-foreground">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
