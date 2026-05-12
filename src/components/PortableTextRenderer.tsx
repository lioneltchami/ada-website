import { PortableText } from '@portabletext/react';

const components = {
  block: {
    h2: ({ children }: any) => <h2 className="text-2xl font-heading font-bold text-gray-900 mt-10 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-heading font-semibold text-gray-900 mt-8 mb-3">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-2">{children}</h4>,
    normal: ({ children }: any) => <p className="text-gray-600 leading-relaxed mb-4">{children}</p>,
    blockquote: ({ children }: any) => <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-700 my-6">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside space-y-2 my-4 text-gray-600">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside space-y-2 my-4 text-gray-600">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-gray-900">{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    link: ({ children, value }: any) => <a href={value?.href} className="text-primary-600 hover:underline" target="_blank" rel="noopener">{children}</a>,
  },
};

export default function PortableTextRenderer({ value }: { value: any[] }) {
  if (!value || !Array.isArray(value)) {
    return null;
  }
  return <PortableText value={value} components={components} />;
}
