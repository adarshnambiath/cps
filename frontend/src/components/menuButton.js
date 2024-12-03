import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MenuButton.css';

const MenuButton = () => {
  const navigate = useNavigate();

  return (
    <div className="back-button" onClick={() => navigate('/menu')}>
      <img src="target.png" alt="Back to Menu" />
    </div>
  );
};

export default MenuButton;