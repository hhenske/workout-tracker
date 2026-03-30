import { useLocation, useNavigate } from 'react-router-dom';

export default function NavItem({ item, onClickExtra, className = '', iconClass = '' }) {
  const location = useLocation();
  const navigate = useNavigate();

  function handleClick() {
    navigate(item.path);
    if (onClickExtra) onClickExtra(); // e.g. close drawer
  }

  return (
    <li
      className={`${className}${location.pathname === item.path ? ' active' : ''}`}
      onClick={handleClick}
    >
      <span className={iconClass}>
        <item.icon />
      </span>
      {item.label}
    </li>
  );
}

