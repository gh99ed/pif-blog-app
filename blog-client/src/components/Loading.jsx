import React from 'react';
import loadingIcon from '../assets/images/loading.svg';

const Loading = () => {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <img src={loadingIcon} alt="Loading..." width={80} className="animate-spin" />
    </div>
  );
};

export default Loading;
