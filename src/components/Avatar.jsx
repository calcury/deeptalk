import React from 'react';
import { initials } from '../lib/utils.js';

export default function Avatar({ account, size, className = '' }) {
  const style = size ? { width: size, height: size, fontSize: Math.round(size * 0.42) } : undefined;
  return (
    <span className={'avatar ' + className} style={style}>
      {account?.avatar ? <img src={account.avatar} alt={account.name || 'avatar'} /> : initials(account?.name)}
    </span>
  );
}
