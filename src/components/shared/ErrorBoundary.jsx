import React from 'react';
import { Result, Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="500"
          title="Có lỗi xảy ra"
          subTitle="Xin lỗi, đã có lỗi không mong muốn xảy ra. Vui lòng thử lại."
          extra={
            <Button type="primary" onClick={this.handleReload}>
              Tải lại trang
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 