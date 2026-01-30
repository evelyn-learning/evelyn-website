'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  description?: string;
  allowMultiple?: boolean;
}

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-slate-900 pr-4">
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-5 text-slate-600 leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  );
}

export function FAQ({ items, title, description, allowMultiple = false }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-wide">
        {(title || description) && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            {title && (
              <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
            )}
            {description && (
              <p className="text-xl text-slate-600">{description}</p>
            )}
          </div>
        )}

        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 md:p-8 border border-slate-200">
          {items.map((item, index) => (
            <FAQAccordionItem
              key={index}
              item={item}
              isOpen={openItems.has(index)}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Compact version for embedding in product/service pages
export function FAQCompact({ items }: { items: FAQItem[] }) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200">
      {items.map((item, index) => (
        <FAQAccordionItem
          key={index}
          item={item}
          isOpen={openItems.has(index)}
          onToggle={() => toggleItem(index)}
        />
      ))}
    </div>
  );
}
