{settingsItem && (
  <div
    className={`drawer__item${location.pathname === settingsItem.path ? ' active' : ''}`}
    onClick={() => handleNavClick(settingsItem.path)}
  >
    <span className="drawer__icon">
      <settingsItem.icon />
    </span>
    {settingsItem.label}
  </div>
)}
