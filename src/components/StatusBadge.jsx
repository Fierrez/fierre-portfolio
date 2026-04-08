import React from 'react';

const StatusBadge = ({ status = 'offline', label }) => {
  let base = 'inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium';
  let color = 'bg-gray-700 text-gray-200';

  switch ((status || '').toLowerCase()) {
    case 'online':
      color = 'bg-green-600 text-white';
      break;
    case 'listening':
    case 'playing':
      color = 'bg-cyan-600 text-white';
      break;
    case 'self-hosted':
      color = 'bg-indigo-600 text-white';
      break;
    case 'idle':
      color = 'bg-gray-600 text-gray-100';
      break;
    case 'offline':
    default:
      color = 'bg-gray-700 text-gray-200';
      break;
  }

  return <span className={`${base} ${color}`}>{label || status}</span>;
};

export default StatusBadge;
