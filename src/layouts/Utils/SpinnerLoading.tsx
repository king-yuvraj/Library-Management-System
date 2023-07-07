import React from 'react'

export function SpinnerLoading() {
  return (
    <div className='container m-5 d-flex justify-content-center' style={{ height: 550 }}>
      <div className='spinner-border text-primary' role='status'/>
    </div>
  );
}

