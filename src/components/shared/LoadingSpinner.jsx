import React from 'react';
import { Spin } from 'antd';

const LoadingSpinner = ({ 
  size = 'large', 
  tip = 'Đang tải...', 
  style = {},
  spinning = true,
  children 
}) => {
  const defaultStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    ...style
  };

  if (children) {
    return (
      <Spin spinning={spinning} tip={tip} size={size}>
        {children}
      </Spin>
    );
  }

  return (
    <div style={defaultStyle}>
      <Spin size={size} />
      <p style={{ marginTop: 16, color: '#666' }}>{tip}</p>
    </div>
  );
};

export default LoadingSpinner; 