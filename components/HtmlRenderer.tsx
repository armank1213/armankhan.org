import React from 'react';

interface HtmlRendererProps {
  htmlContent: string;
}

const HtmlRenderer: React.FC<HtmlRendererProps> = ({ htmlContent }) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default HtmlRenderer;