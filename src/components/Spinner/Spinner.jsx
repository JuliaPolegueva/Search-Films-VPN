import React from 'react';
import { Spin } from 'antd';

import './Spinner.css';

const Spinner = () => {
  return (
    <div className="spinner">
      <Spin />
      <span className="spinner-text">Загрузка...</span>
    </div>
  );
};

export default Spinner;
